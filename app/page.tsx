import Link from 'next/link';
import Image from 'next/image';
import { getArtistImage, getAlbumImage } from '@/lib/artistImage';
import { getDb } from '@/lib/db';

interface Singer {
  singerID: number;
  name: string;
  style: string;
}

interface Album {
  albumID: number;
  title: string;
  year: number;
  singerName: string;
}

async function getData() {
  try {
    const db = await getDb();
    const [singers, albums] = await Promise.all([
      db.collection('singers').find({}, { projection: { _id: 0 } }).sort({ name: 1 }).toArray(),
      db.collection('albums').find({}, { projection: { _id: 0 } }).sort({ year: -1 }).toArray(),
    ]);
    return { singers: singers as unknown as Singer[], albums: albums as unknown as Album[] };
  } catch {
    return { singers: [], albums: [] };
  }
}

export default async function HomePage() {
  const { singers, albums } = await getData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-900/40 via-zinc-900 to-zinc-900 px-8 pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl">
          <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Welcome to</p>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">SyncIt</h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            Manage your music database artists, albums, and instruments all in one place.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="/singers" className="px-6 py-3 bg-green-500 text-black font-bold rounded-full text-sm hover:bg-green-400 transition-colors">
              Browse Singers
            </Link>
            <Link href="/albums" className="px-6 py-3 bg-zinc-700 text-white font-bold rounded-full text-sm hover:bg-zinc-600 transition-colors">
              Browse Albums
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-10">
        <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-5">Database Overview</h2>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <Link href="/singers" className="group">
            <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-5 hover:bg-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{singers.length}</p>
                <p className="text-zinc-400 text-sm">Singers</p>
              </div>
            </div>
          </Link>
          <Link href="/albums" className="group">
            <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-5 hover:bg-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{albums.length}</p>
                <p className="text-zinc-400 text-sm">Albums</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Artists */}
      {singers.length > 0 && (
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-lg font-bold">Featured Artists</h2>
            <Link href="/singers" className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {singers.slice(0, 6).map((singer) => (
              <Link key={singer.singerID} href="/singers" className="group">
                <div className="bg-zinc-800 rounded-xl p-4 hover:bg-zinc-700 transition-colors text-center">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 mx-auto bg-zinc-700">
                    <Image
                      src={getArtistImage(singer.name)}
                      alt={singer.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-white text-xs font-semibold truncate">{singer.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{singer.style}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Albums */}
      {albums.length > 0 && (
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-lg font-bold">Albums</h2>
            <Link href="/albums" className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.slice(0, 6).map((album) => (
              <Link key={album.albumID} href="/albums" className="group">
                <div className="bg-zinc-800 rounded-xl p-4 hover:bg-zinc-700 transition-colors">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-zinc-700">
                    <Image
                      src={getAlbumImage(album.title, album.singerName)}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <p className="text-white text-xs font-semibold truncate">{album.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{album.singerName} · {album.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
