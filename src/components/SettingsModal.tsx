import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Key, Check } from 'lucide-react';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [apiKeys, setApiKeys] = useState<string[]>(['']);

  // Load keys on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('nextify_api_keys');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApiKeys(parsed);
          } else {
            setApiKeys(['']);
          }
        } catch (e) {
          setApiKeys(['']);
        }
      } else {
        setApiKeys(['']);
      }
    }
  }, [isOpen]);

  const addKey = () => setApiKeys([...apiKeys, '']);
  
  const removeKey = (index: number) => {
    const updated = apiKeys.filter((_, i) => i !== index);
    const final = updated.length === 0 ? [''] : updated;
    setApiKeys(final);
    saveKeys(final);
  };

  const updateKey = (index: number, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = value;
    setApiKeys(newKeys);
    saveKeys(newKeys);
  };

  const makeActive = (index: number) => {
    if (index === 0) return;
    const newKeys = [...apiKeys];
    // Move the chosen key to the first place (index 0)
    const [selected] = newKeys.splice(index, 1);
    newKeys.unshift(selected);
    setApiKeys(newKeys);
    saveKeys(newKeys);
  };

  const saveKeys = (keys: string[]) => {
    const cleanKeys = keys.filter(k => k.trim().length > 0);
    localStorage.setItem('nextify_api_keys', JSON.stringify(cleanKeys));
    // Trigger storage event so target listeners can update or just notify
    window.dispatchEvent(new Event('storage'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
      <div className="bg-white p-6 w-full max-w-md border-3 border-black shadow-[8px_8px_0_#00FF41]">
        <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-black">
          <h2 className="text-xl font-bold uppercase font-sans flex items-center gap-2">
            <Key size={20} className="text-black" />
            <span>إعدادات النظام والمفاتيح</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 border border-transparent hover:border-black rounded transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-[#fcfcfc] p-3 border border-dashed border-black rounded text-xs leading-relaxed text-gray-700">
            <strong>نظام التدوير التلقائي:</strong> يمكنك إدخال عدة مفاتيح API لـ Gemini. إذا تم استنفاد الكوتا (Quota) أو فشل أي مفتاح أثناء معالجة مرحلة، فسيقوم النظام تلقائياً بالانتقال للمفتاح التالي لإتمام التحليل دون انقطاع.
          </div>

          <label className="text-sm font-bold block">مفاتيح API لـ Gemini:</label>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {apiKeys.map((key, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border border-black bg-gray-50 rounded">
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-gray-500">
                      مفتاح #{i + 1} {i === 0 && <span className="text-green-600 bg-green-100 px-1.5 py-0.5 rounded ml-1">نشط حالياً</span>}
                    </span>
                    {i > 0 && (
                      <button 
                        onClick={() => makeActive(i)}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        اجعله النشط
                      </button>
                    )}
                  </div>
                  <input 
                    type="password"
                    className="w-full p-2 border border-black text-sm bg-white font-mono"
                    value={key}
                    onChange={(e) => updateKey(i, e.target.value)}
                    placeholder="AIzaSy..."
                  />
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                  {i === 0 ? (
                    <div className="p-1.5 bg-green-100 border border-green-600 rounded text-green-600" title="المفتاح النشط">
                      <Check size={16} />
                    </div>
                  ) : (
                    <button 
                      onClick={() => makeActive(i)}
                      className="p-1.5 bg-gray-100 border border-gray-400 rounded hover:bg-blue-50 hover:border-blue-500 text-gray-600 hover:text-blue-600"
                      title="تنشيط هذا المفتاح"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button 
                    className="p-1.5 bg-red-100 border border-red-400 rounded hover:bg-red-200 text-red-600" 
                    onClick={() => removeKey(i)}
                    title="حذف المفتاح"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 border-2 border-dashed border-black hover:bg-gray-50 transition-all rounded" 
            onClick={addKey}
          >
            <Plus size={16} /> إضافة مفتاح API بديل
          </button>
        </div>

        <button 
          className="w-full bg-[#00FF41] text-black font-bold p-3 font-sans hover:bg-black hover:text-[#00FF41] border-2 border-black transition-all shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none reset-button mb-3" 
          onClick={onClose}
        >
          حفظ وإغلاق
        </button>
        <div className="text-center pt-2 border-t border-black/10 text-[9px] font-bold text-gray-500 font-sans" dir="rtl">
          طُور وصمم بواسطة: <span className="text-black font-mono font-black border border-black px-1.5 py-0.2 bg-black text-[#00FF41]">كرباني بلقاسم KERBANI BELKACEM</span>
        </div>
      </div>
    </div>
  );
}
