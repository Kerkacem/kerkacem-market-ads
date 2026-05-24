import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, CheckCircle2, RefreshCw, Landmark, AlertCircle, FileText, Copy, Check, ExternalLink, PhoneCall } from 'lucide-react';

interface ChargilyPaymentSimProps {
  userId: string;
  plan: 'free' | 'pro' | 'agency' | 'enterprise';
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

export function ChargilyPaymentSim({ userId, plan, amount, onPaymentSuccess, onPaymentCancel }: ChargilyPaymentSimProps) {
  const [activeTab, setActiveTab] = useState<'baridimob' | 'cards'>('baridimob');
  const [copiedRip, setCopiedRip] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const ripNumber = "00799999000979580702";
  const holderName = "kerbani belkacem";
  const whatsappNumber = "+213661379535";

  // Build elegant WhatsApp message link
  const cleanPhone = whatsappNumber.replace('+', '');
  const encodedText = encodeURIComponent(
    `سلام عليكم، قمت بتحويل مبلغ ${amount.toLocaleString()} د.ج لتفعيل خطة ${plan.toUpperCase()} لحسابي برقم المعرف المصلحي: ${userId}. هذا هو وصل التحويل الخاص بي للتأكيد.`
  );
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  const copyToClipboard = (text: string, type: 'rip' | 'name') => {
    navigator.clipboard.writeText(text);
    if (type === 'rip') {
      setCopiedRip(true);
      setTimeout(() => setCopiedRip(false), 2000);
    } else {
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    }
  };

  const handleSimulateActivation = async () => {
    setProcessing(true);
    // Call the server confirm route to persist the status
    try {
      await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          plan,
          amount,
          checkoutId: "baridimob_" + Math.random().toString(36).substring(2, 11)
        })
      });
    } catch (e) {
      console.error("Local sync mode only", e);
    }

    // Force update local storage for smooth fallback performance
    try {
      const cachedUserStr = localStorage.getItem('nextify_saas_user');
      if (cachedUserStr) {
        const u = JSON.parse(cachedUserStr);
        u.plan = plan;
        localStorage.setItem('nextify_saas_user', JSON.stringify(u));
        
        const localUsersStr = localStorage.getItem('nextify_local_users') || '[]';
        const localUsers = JSON.parse(localUsersStr);
        const idx = localUsers.findIndex((usr: any) => usr.id === u.id);
        if (idx !== -1) {
          localUsers[idx].plan = plan;
          localStorage.setItem('nextify_local_users', JSON.stringify(localUsers));
        }
      }
    } catch (err) {}

    setTimeout(() => {
      setProcessing(false);
      setStatus('success');
      setTimeout(() => {
        onPaymentSuccess();
      }, 3500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center p-4 selection:bg-[#00FF41]" dir="rtl">
      <div className="w-full max-w-xl bg-white border-3 border-black shadow-[12px_12px_0_rgba(0,0,0,1)] p-6 md:p-8 relative">
        <div className="absolute top-0 right-0 left-0 h-2 bg-amber-500 border-b-2 border-black" />

        {/* SATIM & CHARGILY Head banner mock */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Landmark size={20} className="text-black" />
            <span className="font-mono font-black text-xs tracking-wider text-black">MARKETING MASTER BILLING desk</span>
          </div>
          <div className="text-left font-sans">
            <span className="text-[10px] font-mono font-bold bg-[#00FF41] text-black px-2 py-0.5 border border-black rounded-sm">
              طريقة تحويل ومحاكاة الدفع الوطنية 🇩🇿
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center py-12 space-y-4 font-sans"
            >
              <div className="w-16 h-16 bg-[#00FF41] text-black rounded-full border-2 border-black flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-black text-black">طلب تفعيل قيد المعالجة!</h2>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                رائع! لقد قمنا بفتح الخطة <span className="font-extrabold uppercase text-green-700 bg-green-50 border border-green-300 px-1.5 py-0.5">{plan}</span> على متصفحك وسيرفرك المحلي بنجاح. بمجرد تأكيد المعلم <strong className="text-black font-black">kerbani belkacem</strong> لوصل التحويل، سيتم إبقاء تفعيل حسابك سحابياً دائماً.
              </p>
              <p className="text-[11px] text-amber-600 font-bold bg-amber-50 p-2.5 border border-dashed border-amber-300">
                من فضلك تذكر إرسال صورة وصل الدفع إلى الهاتف {whatsappNumber} عبر تطبيق WhatsApp إن لم تقم بذلك بعد!
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 font-mono block">جاري إعادة توجيهك للوحة التحكم خلال لحظات...</span>
              </div>
            </motion.div>
          ) : (
            <div className="font-sans text-start">
              
              {/* Order Invoice Brief */}
              <div className="bg-[#fcf8f2] border-2 border-black p-4 mb-6 text-xs flex justify-between items-center leading-relaxed">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold mb-0.5">
                    <FileText size={14} />
                    <span>تفاصيل طلب الترقية</span>
                  </div>
                  <div className="text-black font-extrabold text-xs md:text-sm">
                    حزمة اشتراك: {plan === 'pro' ? 'المحترفين (Pro)' : plan === 'agency' ? 'الوكالة (Agency)' : plan === 'enterprise' ? 'الشركات Enterprise' : plan}
                  </div>
                  <span className="text-gray-400 font-mono text-[9px] block">رقم المعرف الفرعي للمشتري: {userId}</span>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold block">القيمة الإجمالية</span>
                  <span className="text-xl font-black text-black font-mono">{amount.toLocaleString()}</span>
                  <span className="text-xs font-bold text-black mr-1">د.ج</span>
                </div>
              </div>

              {/* Selection Method Tab controls styled in Neubrutalism */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('baridimob')}
                  className={`py-3 px-2 border-2 border-black font-black text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'baridimob' 
                      ? 'bg-[#00FF41] text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' 
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  <Landmark size={15} />
                  <span>بريدي موب BaridiMob (متوفر)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('cards')}
                  className={`py-3 px-2 border-2 border-black font-black text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'cards' 
                      ? 'bg-amber-100 text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' 
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={15} />
                  <span>البطاقات CIB / الذهبية (قريباً)</span>
                </button>
              </div>

              {activeTab === 'baridimob' ? (
                <div className="space-y-5">
                  <div className="p-4 bg-green-50 border-2 border-black space-y-4">
                    <h3 className="font-black text-green-900 text-xs flex items-center gap-1.5 border-b border-green-200 pb-2">
                      <Landmark size={16} />
                      <span>بيانات تحويل الحساب الجاري المعتمد</span>
                    </h3>

                    {/* Account stats cards */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block mb-1">اسم صاحب الحساب (Nom du bénéficiaire):</span>
                        <div className="flex bg-white border border-black p-2.5 justify-between items-center text-xs">
                          <span className="font-mono font-black text-black uppercase">{holderName}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(holderName, 'name')}
                            className="p-1 px-2 border border-black hover:bg-gray-50 flex items-center gap-1 text-[10px] font-bold"
                          >
                            {copiedName ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                            <span>{copiedName ? 'تم النسخ' : 'نسخ'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block mb-1">رقم الحساب الجاري RIP:</span>
                        <div className="flex bg-white border border-black p-2.5 justify-between items-center text-xs">
                          <span className="font-mono font-black text-black select-all tracking-wider">{ripNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(ripNumber, 'rip')}
                            className="p-1 px-2 border border-black hover:bg-gray-50 flex items-center gap-1 text-[10px] font-bold"
                          >
                            {copiedRip ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                            <span>{copiedRip ? 'تم النسخ' : 'نسخ'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flow instructions */}
                  <div className="border-r-3 border-amber-500 pr-4 py-1 space-y-2">
                    <h4 className="font-black text-black text-xs">خطوات تفعيل وتأكيد اشتراكك:</h4>
                    <ol className="list-decimal list-inside text-xs text-gray-600 font-bold space-y-1">
                      <li>افتح تطبيق <span className="text-black font-extrabold">بريدي موب (BaridiMob)</span> الخاص بك على الهاتف.</li>
                      <li>قم بهما التحويل لصاحب الحساب برقم الـ RIP المذكور أعلاه بقيمة <span className="text-black font-black">{amount.toLocaleString()} د.ج</span>.</li>
                      <li>بعد إتمام العملية، قم بالتقاط لقطة شاشة (Screenshot) لوصل العملية الناجحة.</li>
                    </ol>
                  </div>

                  {/* Mass WhatsApp integration action */}
                  <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-sm space-y-3">
                    <div className="text-xs text-blue-900 font-bold">
                      يرجى النقر على الرابط التالي لمراسلة مسؤول التفعيل بالـ WhatsApp لإرسال الوصل وتفعيل حسابك سحابياً:
                    </div>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] text-white font-black py-3.5 px-4 rounded border-2 border-black flex items-center justify-center gap-2 hover:bg-[#20ba56] transition-all shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5"
                    >
                      <PhoneCall size={16} />
                      <span>إرسال الوصل للتفعيل عبر الواتساب (+213661379535)</span>
                      <ExternalLink size={14} className="mr-auto" />
                    </a>
                  </div>

                  {/* Finish simulation action but verify */}
                  <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row gap-3">
                    <button
                      type="button"
                      disabled={processing}
                      onClick={handleSimulateActivation}
                      className="flex-1 bg-black text-[#00FF41] hover:bg-gray-900 font-extrabold py-3.5 px-6 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {processing && <RefreshCw size={14} className="animate-spin text-[#00FF41]" />}
                      <span>لقد قمت بتحويل بريدي موب وتأكيد الإرسال</span>
                    </button>
                    <button
                      type="button"
                      onClick={onPaymentCancel}
                      className="py-3.5 px-6 border-2 border-black bg-white font-black text-xs hover:bg-gray-100 hover:text-black transition-colors"
                    >
                      إلغاء وعودة الخلف
                    </button>
                  </div>

                </div>
              ) : (
                <div className="space-y-6 py-6 text-center">
                  <div className="w-16 h-16 bg-amber-50 text-amber-500 border-2 border-amber-300 border-dashed rounded-full flex items-center justify-center mx-auto">
                    <CreditCard size={28} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-black text-black text-base">بوابة الدفع الإلكتروني المباشر CIB / الذهبية</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-semibold">
                      نقوم حالياً بالربط التقني مع SATIM و Chargily لتوفير التفعيل المالي التلقائي بالبطاقات. سيتم توفير هذا الخيار قريباً جداً في التحديثات القادمة!
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs max-w-md mx-auto leading-relaxed">
                    🔔 يرجى استخدام بوابة <strong className="text-black">"بريدي موب BaridiMob"</strong> المجاورة حالياً لإتمام الدفع السريع والتفعيل اليدوي عبر الواتساب في أقل من 5 دقائق.
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('baridimob')}
                    className="px-6 py-2.5 bg-black text-[#00FF41] font-black border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] text-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    الانتقال لصفحة بريدي موب المتاحة
                  </button>
                </div>
              )}

            </div>
          )}
        </AnimatePresence>

        {/* Designer Signature Footer */}
        <div className="mt-6 pt-4 border-t border-black/10 text-center">
          <span className="text-[10px] font-bold text-gray-400 block pb-1">منصة الدفع مؤمنة ومشفرة بالكامل</span>
          <span className="inline-block bg-black text-[#00FF41] px-2.5 py-0.5 border border-black font-extrabold uppercase text-[11px] tracking-wider">
            تصميم كرباني بلقاسم KERBANI BELKACEM
          </span>
        </div>
      </div>
    </div>
  );
}
