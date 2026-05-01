import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guests, date, time, lastName, firstName, phone, email, notes } = body;

    // 基础校验
    if (!guests || !date || !time || !lastName || !firstName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO milano_marin_reservations 
      (guests, date, time, last_name, first_name, phone, email, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [guests, date, time, lastName, firstName, phone, email, notes || '']
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error: any) {
    console.error('Reservation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
