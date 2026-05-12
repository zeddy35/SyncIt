import { NextResponse } from 'next/server';
import { r2, R2_BUCKET, GetObjectCommand } from '@/lib/r2';

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

  try {
    const res = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    const body = res.Body as ReadableStream;
    return new NextResponse(body, {
      headers: {
        'Content-Type': res.ContentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
