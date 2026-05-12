'use client';

import { useState, useEffect, useCallback } from 'react';

interface Singer {
  singerID: number;
  name: string;
  style: string;
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
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
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

export default function SingersPage() {
  const [singers, setSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSinger, setEditSinger] = useState<Singer | null>(null);
  const [formName, setFormName] = useState('');
  const [formStyle, setFormStyle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchSingers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/singers');
      if (!res.ok) throw new Error();
      setSingers(await res.json());
    } catch {
      addToast('Failed to load singers', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSingers();
  }, [fetchSingers]);

  const openAddForm = () => {
    setEditSinger(null);
    setFormName('');
    setFormStyle('');
    setShowForm(true);
  };

  const openEditForm = (singer: Singer) => {
    setEditSinger(singer);
    setFormName(singer.name);
    setFormStyle(singer.style);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditSinger(null);
    setFormName('');
    setFormStyle('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formStyle.trim()) return;
    setSubmitting(true);
    try {
      if (editSinger) {
        const res = await fetch(`/api/singers/${editSinger.singerID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formName, style: formStyle }),
        });
        if (!res.ok) throw new Error();
        addToast('Singer updated successfully', 'success');
      } else {
        const res = await fetch('/api/singers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formName, style: formStyle }),
        });
        if (!res.ok) throw new Error();
        addToast('Singer added successfully', 'success');
      }
      closeForm();
      fetchSingers();
    } catch {
      addToast('Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (singer: Singer) => {
    if (!confirm(`Delete "${singer.name}"? This cannot be undone.`)) return;
    setDeletingId(singer.singerID);
    try {
      const res = await fetch(`/api/singers/${singer.singerID}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      addToast('Singer deleted', 'success');
      fetchSingers();
    } catch {
      addToast('Failed to delete singer', 'error');
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
              <path d="M12 3a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Singers</h1>
            <p className="text-zinc-400 text-sm">{singers.length} artists in database</p>
          </div>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-black font-bold text-sm rounded-full hover:bg-green-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Singer
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mb-6 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
          <h2 className="text-white font-semibold text-base mb-4">
            {editSinger ? 'Edit Singer' : 'New Singer'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Artist name *"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              className="flex-1 bg-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm border border-zinc-600 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Style (e.g. Rock, Pop, Jazz) *"
              value={formStyle}
              onChange={(e) => setFormStyle(e.target.value)}
              required
              className="flex-1 bg-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm border border-zinc-600 focus:outline-none focus:border-green-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-green-500 text-black font-bold text-sm rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : editSinger ? 'Update' : 'Add'}
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
        ) : singers.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
            </svg>
            <p>No singers found. Add one to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left text-xs uppercase tracking-wider text-zinc-400 font-semibold px-6 py-4">
                  Name
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-zinc-400 font-semibold px-6 py-4">
                  Style
                </th>
                <th className="text-right text-xs uppercase tracking-wider text-zinc-400 font-semibold px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {singers.map((singer, i) => (
                <tr
                  key={singer.singerID}
                  className={`border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors ${
                    i === singers.length - 1 ? 'border-none' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold text-zinc-300">
                        {singer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium text-sm">{singer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full">
                      {singer.style}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(singer)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(singer)}
                        disabled={deletingId === singer.singerID}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === singer.singerID ? (
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
