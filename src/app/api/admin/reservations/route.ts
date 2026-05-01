import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 获取列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = request.headers.get('Authorization');
  const date = searchParams.get('date');

  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let sql = 'SELECT * FROM milano_marin_reservations';
    const params = [];
    if (date) {
      sql += ' WHERE date = ?';
      params.push(date);
    }
    sql += ' ORDER BY date DESC, time ASC';
    const results = await query(sql, params);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 修改预订
export async function PATCH(request: Request) {
  const token = request.headers.get('Authorization');
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, guests, date, time, lastName, firstName, phone, email, notes } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await query(
      `UPDATE milano_marin_reservations 
       SET guests=?, date=?, time=?, last_name=?, first_name=?, phone=?, email=?, notes=?
       WHERE id=?`,
      [guests, date, time, lastName, firstName, phone, email, notes, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 删除预订
export async function DELETE(request: Request) {
  const token = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    await query('DELETE FROM milano_marin_reservations WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
