import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const singers = await db
      .collection('singers')
      .find({}, { projection: { _id: 0, singerID: 1, name: 1 } })
      .sort({ name: 1 })
      .toArray();
    return NextResponse.json(singers);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
