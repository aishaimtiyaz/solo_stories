'use client';
import { useState } from 'react';
import { saveContact, loadState } from '@/utils/localStorage';

interface Props {
  onClose: () => void;
  onSaved: (data: { name?: string; phone?: string }) => void;
}

export default function ContactModal({ onClose, onSaved }: Props) {
  const [name, setName] = useState('');
  const [phone , setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError('Please enter both your name and phone number.');
      return;
    }
    setLoading(true);
    try {
      // save locally
      saveContact({ name: name.trim(), phone: phone.trim() });

      // prepare payload with active task if present
      const state = loadState();
      const task = (state as any).task;
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        dateId: task?.dateId,
        title: task?.title,
        stepsChecked: task?.stepsChecked,
        appearedAt: task?.appearedAt,
        origin: typeof window !== 'undefined' ? window.location.href : '',
      };

      // send to server API (which can forward to Google Apps Script)
      try {
        await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // ignore network errors; server may be unconfigured
        console.warn('submit failed', e);
      }

      onSaved({ name: name.trim(), phone: phone.trim() });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-96 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#4C1D95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="white" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Share your adventure</h3>
            <p className="text-xs text-gray-500">Tell us who you are before sharing</p>
          </div>
        </div>

        <label className="block text-xs text-gray-500 mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-3 p-2 rounded bg-gray-50 dark:bg-gray-800" placeholder="Your name" />

        <label className="block text-xs text-gray-500 mb-1">Phone</label>
        <input type="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mb-3 p-2 rounded bg-gray-50 dark:bg-gray-800" placeholder="your phone number" />

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={onClose} className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Back</button>
          <button onClick={submit} disabled={loading} className="flex-1 px-3 py-2 rounded bg-purple-600 text-white font-semibold">{loading ? 'Saving...' : 'Continue'}</button>
        </div>
      </div>
    </div>
  );
}