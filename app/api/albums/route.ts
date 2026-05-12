import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const albums = await db
      .collection('albums')
      .find({}, { projection: { _id: 0 } })
      .sort({ title: 1 })
      .toArray();
    return NextResponse.json(albums);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title?.trim() || !body.year || !body.singerID) {
      return NextResponse.json({ error: 'Title, year and singerID are required' }, { status: 400 });
    }
    const db = await getDb();

    const count = await db.collection('albums').countDocuments();
    if (count >= 60) {
      return NextResponse.json({ error: 'Album limit reached (max 60)' }, { status: 400 });
    }

    const singerID = parseInt(body.singerID);

    const singer = await db.collection('singers').findOne({ singerID }, { projection: { name: 1, style: 1 } });
    if (!singer) {
      return NextResponse.json({ error: 'Singer not found' }, { status: 404 });
    }

    const last = await db.collection('albums').find().sort({ albumID: -1 }).limit(1).toArray();
    const albumID = last.length > 0 ? last[0].albumID + 1 : 1;

    const newAlbum = {
      albumID,
      title: body.title.trim(),
      year: parseInt(body.year),
      singerID,
      singerName: singer.name,
      singerStyle: singer.style,
    };

    await db.collection('albums').insertOne(newAlbum);

    // Also push into singer's albums array
    await db.collection('singers').updateOne(
      { singerID },
      { $push: { albums: { title: newAlbum.title, year: newAlbum.year } } as never }
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
