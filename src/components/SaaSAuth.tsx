import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Mail, Lock, User, KeyRound, ArrowLeft, Terminal, ShieldAlert } from 'lucide-react';

export function SaaSAuth({ onBackToLanding, initialIsLogin = true }: { onBackToLanding?: () => void; initialIsLogin?: boolean }) {
  const { login, signup, serverDbAvailable } = useAuth();
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [uiError, setUiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiError(null);
    setLoading(true);

    if (!email || !password || (!isLogin && !fullName)) {
      setUiError('يرجى ملء جميع الحقول المطلوبة.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (!res.success) setUiError(res.error || 'فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.');
      } else {
        const res = await signup(email, password, fullName);
        if (!res.success) setUiError(res.error || 'فشل إنشاء الحساب.');
      }
    } catch (err) {
      setUiError('حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 selection:bg-[#00FF41]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full max-w-md bg-white border-3 border-black p-6 md:p-8 shadow-[12px_12px_0_rgba(0,0,0,1)] relative overflow-hidden"
      >
        {/* Absolute Ribbon */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-[#00FF41] border-b-2 border-black" />
        
        {/* Status Line */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-gray-400">
            <span className={`w-2 h-2 rounded-full ${serverDbAvailable ? 'bg-green-500' : 'bg-amber-500'}`} />
            <span>قاعدة البيانات: {serverDbAvailable ? 'متصلة (Supabase)' : 'محلية (Fallback)'}</span>
          </div>
          {onBackToLanding && (
            <button 
              onClick={onBackToLanding}
              className="flex items-center gap-1 text-xs font-bold text-black hover:underline"
            >
              <span>الرئيسية</span>
              <ArrowLeft size={14} />
            </button>
          )}
        </div>

        {/* Branding Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-black font-sans">
            MARKETING MASTER <span className="bg-[#00FF41] px-1.5 border border-black text-black">SAAS</span>
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-2 font-mono">
            نظام الذكاء الإعلاني المتكامل للجزائر
          </p>
        </div>

        {uiError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-900 text-xs font-bold flex gap-3 items-center rounded-sm"
          >
            <ShieldAlert size={18} className="shrink-0 text-red-600" />
            <span>{uiError}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold block mb-1 text-black">الاسم الكامل:</label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={16} />
                </span>
                <input 
                  type="text"
                  required
                  placeholder="محمد بلقاسم"
                  className="w-full p-2.5 pr-10 border-2 border-black focus:outline-none focus:bg-[#00FF41]/5 text-sm font-bold bg-[#fafafa]"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold block mb-1 text-black">البريد الإلكتروني:</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input 
                type="email"
                required
                placeholder="yasin@marketingmaster.dz"
                className="w-full p-2.5 pr-10 border-2 border-black focus:outline-none focus:bg-[#00FF41]/5 text-sm font-bold bg-[#fafafa]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1 text-black">كلمة المرور:</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full p-2.5 pr-10 border-2 border-black focus:outline-none focus:bg-[#00FF41]/5 text-sm font-bold bg-[#fafafa]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#00FF41] text-black font-black p-3.5 border-2 border-black transition-all shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-black border-r-transparent mr-2" />
            ) : null}
            <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-dashed border-black text-center text-xs">
          {isLogin ? (
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <button 
                onClick={() => { setIsLogin(false); setUiError(null); }}
                className="font-black text-black hover:underline underline-offset-2"
              >
                سجل حساباً جديداً مجاناً
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <button 
                onClick={() => { setIsLogin(true); setUiError(null); }}
                className="font-black text-black hover:underline underline-offset-2"
              >
                قم بتسجيل الدخول مباشرة
              </button>
            </p>
          )}
        </div>

        {/* Designer Signature Footer */}
        <div className="mt-6 pt-4 border-t border-black/10 text-center font-sans">
          <span className="text-[10px] text-gray-400 block font-bold">جميع الحقوق محفوظة للهيكل البرمجي</span>
          <span className="inline-block bg-black text-[#00FF41] px-2 py-0.5 border border-black font-extrabold uppercase text-[10px] mt-1 tracking-wider">
            تصميم كرباني بلقاسم KERBANI BELKACEM
          </span>
        </div>
      </motion.div>
    </div>
  );
}
