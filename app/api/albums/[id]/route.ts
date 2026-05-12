import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.title?.trim() || !body.year || !body.singerID) {
      return NextResponse.json({ error: 'Title, year and singerID are required' }, { status: 400 });
    }
    const db = await getDb();
    const albumID = parseInt(id);
    const singerID = parseInt(body.singerID);

    const singer = await db.collection('singers').findOne({ singerID }, { projection: { name: 1, style: 1 } });
    if (!singer) {
      return NextResponse.json({ error: 'Singer not found' }, { status: 404 });
    }

    await db.collection('albums').updateOne(
      { albumID },
      {
        $set: {
          title: body.title.trim(),
          year: parseInt(body.year),
          singerID,
          singerName: singer.name,
          singerStyle: singer.style,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection('albums').deleteOne({ albumID: parseInt(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
