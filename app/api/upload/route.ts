import { NextResponse } from 'next/server';
import { r2, R2_BUCKET, PutObjectCommand } from '@/lib/r2';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const type = form.get('type') as string | null;   // 'singer' | 'album'
    const id = form.get('id') as string | null;

    if (!file || !type || !id) {
      return NextResponse.json({ error: 'file, type and id are required' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const key = `${type}s/${id}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    const db = await getDb();
    const collection = type === 'singer' ? 'singers' : 'albums';
    const idField = type === 'singer' ? 'singerID' : 'albumID';

    await db.collection(collection).updateOne(
      { [idField]: parseInt(id) },
      { $set: { imageKey: key } }
    );

    return NextResponse.json({ key });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
