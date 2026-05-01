import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import nodemailer from 'nodemailer';

// 配置邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: 465,
  secure: true, // 使用 SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guests, date, time, lastName, firstName, phone, email, notes } = body;

    // 1. 基础校验
    if (!guests || !date || !time || !lastName || !firstName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. 写入数据库
    const result = await query(
      `INSERT INTO milano_marin_reservations 
      (guests, date, time, last_name, first_name, phone, email, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [guests, date, time, lastName, firstName, phone, email, notes || '']
    );

    // 3. 发送邮件通知
    try {
      const mailOptions = {
        from: `"Milano Marin Reservation" <${process.env.SMTP_USER}>`,
        to: `${process.env.SMTP_USER}, ${email}`, // 发送给餐厅和顾客
        subject: `New Reservation: ${lastName} ${firstName} - ${date} @ ${time}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #1B3022; text-align: center; text-transform: uppercase; letter-spacing: 2px;">New Reservation</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <div style="padding: 20px 0;">
              <p><strong>Guest:</strong> ${lastName} ${firstName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>People:</strong> ${guests}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            </div>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #666; text-align: center;">
              This is an automated notification from Milano Marin Website.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Mail Sending Error:', mailError);
      // 注意：即使邮件发送失败，我们也不报错给前端，因为数据库已经记录成功了
    }

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error: any) {
    console.error('Reservation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
