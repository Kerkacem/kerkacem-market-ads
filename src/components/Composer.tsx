import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Sparkles, Command, X, Link as LinkIcon, SpellCheck } from 'lucide-react';
import { checkSpellingAndGrammar } from '../lib/ai';

interface ComposerProps {
  onSendMessage: (message: string, images?: string[], sellingPrice?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  isConfirming?: boolean;
}

export function Composer({ onSendMessage, isLoading, disabled = false, isConfirming = false }: ComposerProps) {
  const [input, setInput] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved state on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('nextify_retained_composer');
      if (saved) {
        const { input: savedInput, sellingPrice: savedPrice, images: savedImages } = JSON.parse(saved);
        if (savedInput) setInput(savedInput);
        if (savedPrice) setSellingPrice(savedPrice);
        if (savedImages && Array.isArray(savedImages)) setImages(savedImages);
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    }
  }, []);

  // Save changes to localStorage on any input/price/images change
  React.useEffect(() => {
    if (!isConfirming) {
      localStorage.setItem('nextify_retained_composer', JSON.stringify({ input, sellingPrice, images }));
    }
  }, [input, sellingPrice, images, isConfirming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim(), images, sellingPrice);
      if (!isConfirming) {
        setInput('');
        setSellingPrice('');
        setImages([]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...(prev || []).slice(-4), reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-3 md:p-6 bg-white border-t-2 border-black shrink-0 relative z-20">
      <div className="max-w-4xl mx-auto relative">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col bg-white border-2 border-black overflow-hidden focus-within:ring-0 focus-within:shadow-[4px_4px_0_#00FF41] transition-all"
        >
          {!isConfirming && (
             <div className="flex bg-[#f2f2f2] border-b-2 border-black items-center gap-2 md:gap-4 px-2 md:px-4 py-2 overflow-x-auto custom-scrollbar">
                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                   <span className="text-[9px] md:text-[10px] uppercase font-mono font-bold tracking-widest leading-none bg-black text-[#00FF41] px-1 md:px-2 py-1">PRICE</span>
                   <input 
                      type="text" 
                      value={sellingPrice}
                      onChange={e => setSellingPrice(e.target.value)}
                      placeholder="مثال: 4500 دج"
                      className="bg-white border-2 border-black px-1.5 md:px-2 py-1 text-xs font-mono font-bold w-[90px] md:max-w-[120px] outline-none"
                   />
                </div>
                <div className="flex gap-1 md:gap-2 shrink-0">
                   {images.map((img, i) => (
                      <div key={i} className="relative w-7 h-7 md:w-8 md:h-8 border-2 border-black shrink-0 group">
                         <img src={img} alt="Product" className="w-full h-full object-cover" />
                         <button 
                           type="button" 
                           onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                           className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                         >
                            <X size={10} />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          )}

          <div className="flex items-stretch md:items-center flex-col md:flex-row">
             <div className="flex items-center border-b-2 md:border-b-0 border-e-0 md:border-e-2 border-black shrink-0 bg-[#f2f2f2] md:bg-white">
               <button type="button" className="p-3 text-black hover:bg-[#00FF41] transition-colors border-e-2 border-black shrink-0 hidden md:flex">
                 <Command size={18} />
               </button>
               <button 
                 type="button" 
                 onClick={async () => {
                   if (input.trim()) {
                     const corrected = await checkSpellingAndGrammar(input);
                     setInput(corrected);
                   }
                 }}
                 className="p-3 text-black hover:bg-[#00FF41] transition-colors border-e-2 border-black shrink-0"
                 title="تصحيح إملائي"
              >
                 <SpellCheck size={18} />
               </button>
               
               {/* Mobile only icon options */}
               {!isConfirming && (
                  <button 
                     type="button" 
                     onClick={() => fileInputRef.current?.click()}
                     className="md:hidden p-3 text-black hover:bg-[#00FF41] transition-colors shrink-0"
                  >
                    <ImageIcon size={18} />
                  </button>
               )}
             </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || disabled}
              dir="auto"
              placeholder={isConfirming ? "اكتب 'اعتماد' لمواصلة التنفيذ..." : "أدخل الأمر أو مسار المنتج..."}
              className="flex-1 py-3 md:py-4 px-3 md:px-4 bg-transparent outline-none text-black placeholder-[#00000080] disabled:opacity-50 font-mono text-xs md:text-sm"
            />
            
            <div className="flex items-center border-t-2 md:border-t-0 md:border-s-2 border-black shrink-0 bg-[#f2f2f2] md:bg-white">
              {!isConfirming && (
                <>
                  <input 
                     type="file" 
                     accept="image/*" 
                     multiple 
                     className="hidden" 
                     ref={fileInputRef}
                     onChange={handleFileChange}
                  />
                  <button 
                     type="button" 
                     onClick={() => fileInputRef.current?.click()}
                     className="hidden md:block p-4 text-black hover:bg-[#f2f2f2] transition-colors border-e-2 border-black shrink-0"
                     title="رفع حتى 5 صور"
                  >
                    <ImageIcon size={20} />
                  </button>
                </>
              )}
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading || disabled}
                className="w-full md:w-auto px-6 py-3 md:py-4 bg-black text-white hover:bg-[#000000E6] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-display font-bold uppercase tracking-wider flex items-center justify-center shrink-0 md:min-w-[120px]"
              >
                {isLoading ? (
                  <Sparkles size={18} className="animate-pulse text-[#00FF41] md:w-5 md:h-5" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base">{isConfirming ? 'استمرار' : 'تشغيل'}</span>
                    <Send size={14} className="rotate-180" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
        {!isConfirming && (
          <div className="flex gap-2 mt-3 pl-1 overflow-x-auto custom-scrollbar pb-1 items-center">
            <span className="text-[9px] md:text-[10px] text-black font-mono font-bold tracking-widest bg-[#00FF41] px-1 md:px-2 py-1 border-2 border-black shrink-0">سريع</span>
            {['/analyse-product', '/generate-lp', '/generate-video', '/scale-plan'].map((cmd) => (
              <button 
                key={cmd}
                type="button"
                onClick={() => setInput(cmd + ' ')}
                className="text-[9px] md:text-[10px] text-black font-mono font-bold uppercase tracking-wider border-2 border-black hover:bg-[#00FF41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#000000] px-2 py-1 transition-all shrink-0"
              >
                <span dir="ltr">{cmd}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-2 px-1 text-[9px] font-mono text-gray-400 font-bold" dir="rtl">
          <span>نهج التسويق المتقدم للتجارة الإلكترونية بالجزائر</span>
          <span>تصميم كرباني بلقاسم KERBANI BELKACEM</span>
        </div>
      </div>
    </div>
  );
}
