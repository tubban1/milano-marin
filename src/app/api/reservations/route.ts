import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guests, date, time, lastName, firstName, phone, email, notes } = body;

    if (!guests || !date || !time || !lastName || !firstName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 生成唯一的取消 Token
    const cancelToken = crypto.randomBytes(32).toString('hex');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.milano-marin.ch';

    const result = await query(
      `INSERT INTO milano_marin_reservations 
      (guests, date, time, last_name, first_name, phone, email, notes, cancel_token) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [guests, date, time, lastName, firstName, phone, email, notes || '', cancelToken]
    );

    // 构建日历链接 (Google Calendar 示例)
    const startDateTime = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
    const endDateTime = `${date.replace(/-/g, '')}T${(parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}${time.split(':')[1]}00`;
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Table+at+Milano+Marin&dates=${startDateTime}/${endDateTime}&details=Reservation+for+${guests}+people&location=Route+des+Marais+10,+2074+Marin-Epagnier&sf=true&output=xml`;
    
    const cancelUrl = `${siteUrl}/api/reservations/cancel?token=${cancelToken}`;

    // 发送邮件
    try {
      await transporter.sendMail({
        from: `"Milano Marin" <${process.env.SMTP_USER}>`,
        to: `${process.env.SMTP_USER}, ${email}`,
        subject: `Your Table at Milano Marin - ${date} @ ${time}`,
        html: `
          <div style="background-color: #050A07; padding: 40px 20px; font-family: 'Playfair Display', serif; color: #E8F5E9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1B3022; border: 1px solid #C0C0C0; padding: 40px; border-radius: 4px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #C0C0C0; text-transform: uppercase; letter-spacing: 4px; font-size: 24px; margin: 0;">Reservation Confirmed</h1>
                <div style="width: 40px; hieght: 1px; background-color: #C0C0C0; margin: 20px auto;"></div>
              </div>

              <p style="font-size: 16px; line-height: 1.6; text-align: center; color: #E8F5E9; margin-bottom: 30px;">
                Dear ${firstName} ${lastName}, we are delighted to confirm your reservation at Milano Marin.
              </p>

              <div style="background-color: rgba(255,255,255,0.03); padding: 30px; border: 1px solid rgba(192,192,192,0.1); margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #C0C0C0; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">Date</td>
                    <td style="padding: 10px 0; text-align: right; color: #fff;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #C0C0C0; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">Time</td>
                    <td style="padding: 10px 0; text-align: right; color: #fff;">${time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #C0C0C0; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">Guests</td>
                    <td style="padding: 10px 0; text-align: right; color: #fff;">${guests} People</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin-bottom: 40px;">
                <a href="${calendarUrl}" style="display: inline-block; background-color: #C0C0C0; color: #0F1D15; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 2px; margin-right: 10px;">Add to Calendar</a>
                <a href="${cancelUrl}" style="display: inline-block; border: 1px solid #C0C0C0; color: #C0C0C0; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-size: 11px; letter-spacing: 2px;">Cancel Booking</a>
              </div>

              <div style="border-top: 1px solid rgba(192,192,192,0.1); padding-top: 30px; text-align: center;">
                <p style="font-size: 12px; color: #C0C0C0; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Milano Marin Restaurant</p>
                <p style="font-size: 12px; color: #E8F5E9; margin-bottom: 5px;">Route des Marais 10, 2074 Marin-Epagnier</p>
                <p style="font-size: 12px; color: #E8F5E9;">T: <a href="tel:0327557176" style="color: #E8F5E9; text-decoration: none;">032 755 71 76</a></p>
              </div>
            </div>
            <p style="text-align: center; font-size: 10px; color: #444; margin-top: 20px; text-transform: uppercase; letter-spacing: 2px;">Authentic Passion</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error('Mail Error:', mailError);
    }

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
