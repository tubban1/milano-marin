import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = request.headers.get('Authorization');
  const date = searchParams.get('date'); // YYYY-MM-DD

  // 校验 Token
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
