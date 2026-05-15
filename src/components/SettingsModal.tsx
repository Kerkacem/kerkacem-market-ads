
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Key, AlertTriangle } from 'lucide-react';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [apiKeys, setApiKeys] = useState<string[]>(['']);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nextify_api_keys');
      if (stored) {
        const parsed = JSON.parse(stored);
        setApiKeys(parsed.length > 0 ? parsed : ['']);
      }
    } catch (e) {}
  }, [isOpen]);

  const addKey = () => setApiKeys([...apiKeys, '']);
  const removeKey = (index: number) => setApiKeys(apiKeys.filter((_, i) => i !== index));
  const updateKey = (index: number, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = value;
    setApiKeys(newKeys);
  };

  const handleSave = () => {
    try {
      const validKeys = apiKeys.filter(k => k.length > 0);
      localStorage.setItem('nextify_api_keys', JSON.stringify(validKeys));
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
        onClose();
      }, 1500);
    } catch (e) {
      setSaveStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 w-full max-w-md border-2 border-black shadow-[8px_8px_0_#00FF41] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold uppercase flex items-center gap-2">
            <Key size={20} /> إعدادات النظام
          </h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 p-3 mb-4 rounded-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
            <div className="text-xs text-yellow-800">
              <strong>خطأ الحصة (Quota Exceeded):</strong> إذا ظهر لك خطأ 429 أو 503، فهذا يعني أن مفتاح API استنفذ حصرته المجانية. أضف مفتاح جديد من{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-600">
                Google AI Studio
              </a>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-6">
          <label className="text-sm font-bold flex items-center gap-2">
            مفاتيح API (Gemini)
            <span className="text-xs font-normal opacity-60">(يمكنك إضافة أكثر من مفتاح)</span>
          </label>
          {apiKeys.map((key, i) => (
            <div key={i} className="flex gap-2">
              <span className="flex items-center text-xs font-mono opacity-40">{i + 1}.</span>
              <input 
                type="password"
                className="flex-1 p-2 border border-black text-sm font-mono"
                value={key}
                onChange={(e) => updateKey(i, e.target.value)}
                placeholder="AIzaSy..."
                dir="ltr"
              />
              {apiKeys.length > 1 && (
                <button className="text-red-500 hover:text-red-700" onClick={() => removeKey(i)}><Trash2 size={16} /></button>
              )}
            </div>
          ))}
          <button className="flex items-center gap-2 text-sm font-bold text-[#00FF41] hover:text-[#00cc33] transition-colors" onClick={addKey}>
            <Plus size={16} /> إضافة مفتاح جديد
          </button>
        </div>

        <div className="space-y-2">
          <button 
            className={`w-full font-bold p-2 border-2 transition-all ${
              saveStatus === 'saved' 
                ? 'bg-green-500 text-white border-green-600' 
                : saveStatus === 'error'
                ? 'bg-red-500 text-white border-red-600'
                : 'bg-[#00FF41] hover:bg-black hover:text-[#00FF41] border-black'
            }`} 
            onClick={handleSave}
          >
            {saveStatus === 'saved' ? '✓ تم الحفظ' : saveStatus === 'error' ? 'خطأ في الحفظ' : 'حفظ'}
          </button>
          <button className="w-full bg-gray-100 font-bold p-2 hover:bg-gray-200 border-2 border-gray-300 text-gray-600" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
