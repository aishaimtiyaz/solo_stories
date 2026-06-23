'use client';

import { useEffect, useState } from 'react';
import { loadState, saveState, addTask } from '@/utils/localStorage';

export default function StorageDebug() {
  const [stateJson, setStateJson] = useState<string>('');

  const refresh = () => {
    try {
      const s = loadState();
      setStateJson(JSON.stringify(s, null, 2));
    } catch (err) {
      setStateJson(String(err));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const clear = () => {
    saveState({});
    refresh();
  };

  const addSample = () => {
    const sample = { id: 9999, title: 'Sample Task', emoji: '✨', steps: ['one','two'] };
    addTask(sample);
    refresh();
  };

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 9999 }}>
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg w-80 max-w-full text-xs">
        <div className="flex items-center justify-between mb-2">
          //<strong>Storage Debug</strong>
          <div className="flex gap-1">
            <button onClick={refresh} className="px-2 py-1 bg-gray-100 rounded">Refresh</button>
            <button onClick={addSample} className="px-2 py-1 bg-yellow-100 rounded">Add</button>
            <button onClick={clear} className="px-2 py-1 bg-red-100 rounded">Clear</button>
          </div>
        </div>
        <pre style={{ maxHeight: 220, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{stateJson || '—'}</pre>
      </div>
    </div>
  );
}
