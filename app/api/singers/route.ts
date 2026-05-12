import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const singers = await db.collection('singers').find({}, { projection: { _id: 0 } }).sort({ name: 1 }).toArray();
    return NextResponse.json(singers);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name?.trim() || !body.style?.trim()) {
      return NextResponse.json({ error: 'Name and style are required' }, { status: 400 });
    }
    const db = await getDb();

    const count = await db.collection('singers').countDocuments();
    if (count >= 30) {
      return NextResponse.json({ error: 'Singer limit reached (max 30)' }, { status: 400 });
    }

    const last = await db.collection('singers').find().sort({ singerID: -1 }).limit(1).toArray();
    const singerID = last.length > 0 ? last[0].singerID + 1 : 1;

    await db.collection('singers').insertOne({
      singerID,
      name: body.name.trim(),
      style: body.style.trim(),
      instruments: [],
      albums: [],
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
