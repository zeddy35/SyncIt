import Link from 'next/link';

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const [singersRes, albumsRes] = await Promise.all([
      fetch(`${baseUrl}/api/singers`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/albums`, { cache: 'no-store' }),
    ]);
    const singers = singersRes.ok ? await singersRes.json() : [];
    const albums = albumsRes.ok ? await albumsRes.json() : [];
    return {
      singerCount: Array.isArray(singers) ? singers.length : 0,
      albumCount: Array.isArray(albums) ? albums.length : 0,
    };
  } catch {
    return { singerCount: 0, albumCount: 0 };
  }
}

export default async function HomePage() {
  const { singerCount, albumCount } = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-900/40 via-zinc-900 to-zinc-900 px-8 pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl">
          <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Welcome to
          </p>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            MusicDB
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            Manage your music database — artists, albums, and instruments all in one place.
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/singers"
              className="px-6 py-3 bg-green-500 text-black font-bold rounded-full text-sm hover:bg-green-400 transition-colors"
            >
              Browse Singers
            </Link>
            <Link
              href="/albums"
              className="px-6 py-3 bg-zinc-700 text-white font-bold rounded-full text-sm hover:bg-zinc-600 transition-colors"
            >
              Browse Albums
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-10">
        <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-5">
          Database Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <Link href="/singers" className="group">
            <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-5 hover:bg-zinc-700 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{singerCount}</p>
                <p className="text-zinc-400 text-sm">Singers</p>
              </div>
            </div>
          </Link>

          <Link href="/albums" className="group">
            <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-5 hover:bg-zinc-700 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{albumCount}</p>
                <p className="text-zinc-400 text-sm">Albums</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-8 py-6">
        <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <Link
            href="/singers"
            className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <span className="text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </span>
            <span className="text-sm text-white font-medium">Add Singer</span>
          </Link>
          <Link
            href="/albums"
            className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <span className="text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </span>
            <span className="text-sm text-white font-medium">Add Album</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
