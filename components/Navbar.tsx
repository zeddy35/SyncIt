'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    href: '/singers',
    label: 'Singers',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
      </svg>
    ),
  },
  {
    href: '/albums',
    label: 'Albums',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col p-6 fixed top-0 left-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        </div>
        <span className="text-white text-xl font-bold tracking-tight">MusicDB</span>
      </div>

      {/* Nav Links */}
      <ul className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <span className={isActive ? 'text-green-400' : ''}>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom decoration */}
      <div className="mt-auto pt-6 border-t border-zinc-800">
        <p className="text-xs text-zinc-600 text-center">Music Database v1.0</p>
      </div>
    </nav>
  );
}
