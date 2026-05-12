import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.name?.trim() || !body.style?.trim()) {
      return NextResponse.json({ error: 'Name and style are required' }, { status: 400 });
    }
    const db = await getDb();
    const singerID = parseInt(id);

    await db.collection('singers').updateOne(
      { singerID },
      { $set: { name: body.name.trim(), style: body.style.trim() } }
    );

    // Keep singerName in sync inside albums collection
    await db.collection('albums').updateMany(
      { singerID },
      { $set: { singerName: body.name.trim(), singerStyle: body.style.trim() } }
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
    const singerID = parseInt(id);

    await db.collection('singers').deleteOne({ singerID });
    await db.collection('albums').deleteMany({ singerID });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
