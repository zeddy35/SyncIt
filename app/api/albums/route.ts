import { NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT a.albumID, a.title, a.year, s.name AS singerName, a.singerID
      FROM ALBUM a
      JOIN SINGER s ON a.singerID = s.singerID
      ORDER BY a.title
    `);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.year || !body.singerID) {
      return NextResponse.json({ error: 'Title, year and singerID are required' }, { status: 400 });
    }
    const pool = await getPool();
    await pool
      .request()
      .input('title', sql.NVarChar, body.title)
      .input('year', sql.Int, parseInt(body.year))
      .input('singerID', sql.Int, parseInt(body.singerID))
      .execute('sp_AddAlbum');
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
