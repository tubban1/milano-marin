import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Invalid token', { status: 400 });
  }

  try {
    // 1. 查找并删除预订
    const result = await query(
      'DELETE FROM milano_marin_reservations WHERE cancel_token = ?',
      [token]
    );

    const affectedRows = (result as any).affectedRows;

    // 2. 返回一个简单的 HTML 确认页面
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reservation Cancelled - Milano Marin</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              background-color: #050A07; 
              color: #E8F5E9; 
              font-family: sans-serif; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              text-align: center;
            }
            .container { 
              padding: 40px; 
              border: 1px solid #C0C0C0; 
              max-width: 400px;
              background: #1B3022;
            }
            h1 { color: #C0C0C0; text-transform: uppercase; letter-spacing: 2px; font-size: 20px; }
            p { font-size: 14px; opacity: 0.7; line-height: 1.6; }
            a { 
              display: inline-block; 
              margin-top: 20px; 
              color: #C0C0C0; 
              text-decoration: none; 
              border: 1px solid #C0C0C0; 
              padding: 10px 20px; 
              font-size: 12px; 
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${affectedRows > 0 ? `
              <h1>Reservation Cancelled</h1>
              <p>Your reservation has been successfully removed from our system. We hope to see you another time.</p>
            ` : `
              <h1>Link Expired</h1>
              <p>This reservation has already been cancelled or the link is invalid.</p>
            `}
            <a href="/">Return to Website</a>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: any) {
    return new NextResponse('System Error', { status: 500 });
  }
}
