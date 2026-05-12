import { NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.name || !body.style) {
      return NextResponse.json({ error: 'Name and style are required' }, { status: 400 });
    }
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, parseInt(id))
      .input('name', sql.NVarChar, body.name)
      .input('style', sql.NVarChar, body.style)
      .query('UPDATE SINGER SET name=@name, style=@style WHERE singerID=@id');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM SINGER WHERE singerID=@id');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
