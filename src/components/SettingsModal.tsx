
import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [apiKeys, setApiKeys] = useState<string[]>(['']);

  const addKey = () => setApiKeys([...apiKeys, '']);
  const removeKey = (index: number) => setApiKeys(apiKeys.filter((_, i) => i !== index));
  const updateKey = (index: number, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = value;
    setApiKeys(newKeys);
    localStorage.setItem('nextify_api_keys', JSON.stringify(newKeys.filter(k => k.length > 0)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 w-96 border-2 border-black shadow-[8px_8px_0_#00FF41]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold uppercase">إعدادات النظام</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="space-y-2 mb-6">
          <label className="text-sm font-bold">مفاتيح API (Gemini)</label>
          {apiKeys.map((key, i) => (
            <div key={i} className="flex gap-2">
              <input 
                type="password"
                className="flex-1 p-2 border border-black text-sm"
                value={key}
                onChange={(e) => updateKey(i, e.target.value)}
                placeholder="أدخل مفتاح API..."
              />
              <button className="text-red-500" onClick={() => removeKey(i)}><Trash2 size={16} /></button>
            </div>
          ))}
          <button className="flex items-center gap-2 text-sm font-bold text-[#00FF41]" onClick={addKey}>
            <Plus size={16} /> إضافة مفتاح جديد
          </button>
        </div>

        <button className="w-full bg-[#00FF41] font-bold p-2 hover:bg-black hover:text-[#00FF41] border-2 border-black" onClick={onClose}>
          حفظ
        </button>
      </div>
    </div>
  );
}
