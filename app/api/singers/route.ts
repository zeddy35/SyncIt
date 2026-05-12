import { NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM SINGER ORDER BY name');
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.style) {
      return NextResponse.json({ error: 'Name and style are required' }, { status: 400 });
    }
    const pool = await getPool();
    await pool
      .request()
      .input('name', sql.NVarChar, body.name)
      .input('style', sql.NVarChar, body.style)
      .query('INSERT INTO SINGER (name, style) VALUES (@name, @style)');
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
