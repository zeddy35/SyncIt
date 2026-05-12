import { NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.title || !body.year || !body.singerID) {
      return NextResponse.json({ error: 'Title, year and singerID are required' }, { status: 400 });
    }
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, parseInt(id))
      .input('title', sql.NVarChar, body.title)
      .input('year', sql.Int, parseInt(body.year))
      .input('singerID', sql.Int, parseInt(body.singerID))
      .query('UPDATE ALBUM SET title=@title, year=@year, singerID=@singerID WHERE albumID=@id');
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
      .query('DELETE FROM ALBUM WHERE albumID=@id');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
