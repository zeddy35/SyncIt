'use client';

import { useState, useEffect, useCallback } from 'react';

interface Album {
  albumID: number;
  title: string;
  year: number;
  singerName: string;
  singerID: number;
}

interface SingerOption {
  singerID: number;
  name: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function Toast({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {t.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
          )}
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 text-white/70 hover:text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [singers, setSingers] = useState<SingerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAlbum, setEditAlbum] = useState<Album | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formSingerID, setFormSingerID] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/albums');
      if (!res.ok) throw new Error();
      setAlbums(await res.json());
    } catch {
      addToast('Failed to load albums', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingers = useCallback(async () => {
    try {
      const res = await fetch('/api/singers/list');
      if (!res.ok) throw new Error();
      setSingers(await res.json());
    } catch {
      addToast('Failed to load singers list', 'error');
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
    fetchSingers();
  }, [fetchAlbums, fetchSingers]);

  const openAddForm = () => {
    setEditAlbum(null);
    setFormTitle('');
    setFormYear('');
    setFormSingerID('');
    setShowForm(true);
  };

  const openEditForm = (album: Album) => {
    setEditAlbum(album);
    setFormTitle(album.title);
    setFormYear(String(album.year));
    setFormSingerID(String(album.singerID));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditAlbum(null);
    setFormTitle('');
    setFormYear('');
    setFormSingerID('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formYear || !formSingerID) return;
    setSubmitting(true);
    try {
      if (editAlbum) {
        const res = await fetch(`/api/albums/${editAlbum.albumID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formTitle, year: parseInt(formYear), singerID: parseInt(formSingerID) }),
        });
        if (!res.ok) throw new Error();
        addToast('Album updated successfully', 'success');
      } else {
        const res = await fetch('/api/albums', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formTitle, year: parseInt(formYear), singerID: parseInt(formSingerID) }),
        });
        if (!res.ok) throw new Error();
        addToast('Album added successfully', 'success');
      }
      closeForm();
      fetchAlbums();
    } catch {
      addToast('Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (album: Album) => {
    if (!confirm(`Delete "${album.title}"? This cannot be undone.`)) return;
    setDeletingId(album.albumID);
    try {
      const res = await fetch(`/api/albums/${album.albumID}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      addToast('Album deleted', 'success');
      fetchAlbums();
    } catch {
      addToast('Failed to delete album', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <Toast toasts={toasts} remove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Albums</h1>
            <p className="text-zinc-400 text-sm">{albums.length} albums in database</p>
          </div>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-black font-bold text-sm rounded-full hover:bg-green-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Album
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mb-6 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
          <h2 className="text-white font-semibold text-base mb-4">
            {editAlbum ? 'Edit Album' : 'New Album'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Album title *"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              className="flex-1 bg-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm border border-zinc-600 focus:outline-none focus:border-green-500"
            />
            <input
              type="number"
              placeholder="Year *"
              value={formYear}
              onChange={(e) => setFormYear(e.target.value)}
              required
              min={1900}
              max={2100}
              className="w-28 bg-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm border border-zinc-600 focus:outline-none focus:border-green-500"
            />
            <select
              value={formSingerID}
              onChange={(e) => setFormSingerID(e.target.value)}
              required
              className="flex-1 bg-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm border border-zinc-600 focus:outline-none focus:border-green-500"
            >
              <option value="" disabled>Select singer *</option>
              {singers.map((s) => (
                <option key={s.singerID} value={s.singerID}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-green-500 text-black font-bold text-sm rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : editAlbum ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 bg-zinc-700 text-zinc-300 font-medium text-sm rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
            </svg>
            <p>No albums found. Add one to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left text-xs uppercase tracking-wider text-zinc-400 font-semibold px-6 py-4">
                  Title
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-zinc-400 font-semibold px-6 py-4">
                  Year
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-zinc-400 font-semibold px-6 py-4">
                  Singer
                </th>
                <th className="text-right text-xs uppercase tracking-wider text-zinc-400 font-semibold px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album, i) => (
                <tr
                  key={album.albumID}
                  className={`border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors ${
                    i === albums.length - 1 ? 'border-none' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-700 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                        </svg>
                      </div>
                      <span className="text-white font-medium text-sm">{album.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-300 text-sm">{album.year}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-zinc-600 rounded-full flex items-center justify-center text-xs font-bold text-zinc-300">
                        {album.singerName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-zinc-300 text-sm">{album.singerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(album)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(album)}
                        disabled={deletingId === album.albumID}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === album.albumID ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
