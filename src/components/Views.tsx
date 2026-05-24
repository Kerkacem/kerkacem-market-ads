import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Activity, CheckCircle2, ArrowRight, Zap, Image as ImageIcon, Video, LayoutDashboard, LayoutTemplate, Copy, Check, Users, RotateCw } from 'lucide-react';
import { 
  Phase0_CouncilResult,
  Phase05_AudienceBuilder,
  Phase1_Intelligence, 
  Phase2_StaticBriefs, 
  Phase3_LandingPage, 
  Phase4_VideoWorkflow,
  Phase5_MetaAdsStrategy,
  Phase6_ScalingSystem,
  Phase7_AdGenerator
} from '../types';

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy} 
      className={`p-1.5 flex items-center justify-center border-2 border-black bg-white hover:bg-[#00FF41] transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#000] ${className}`}
      title="نسخ النص"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-[#00FF41] text-black border-2 border-black flex items-center justify-center mb-8 shadow-[6px_6px_0_#000000]">
        <Zap size={40} />
      </div>
      <h2 className="text-4xl font-display uppercase font-black tracking-tighter text-black mb-4">MARKETING MASTER ENGINE</h2>
      <p className="text-black font-mono text-sm leading-relaxed mb-4 max-w-lg uppercase">
        أدخل تفاصيل المنتج بالأسفل أو انسخ مسار المنتج للبدء في تشغيل النظام التسويقي.
      </p>
      <div className="bg-[#f2f2f2] p-4 border-2 border-black border-dashed mt-4 max-w-md w-full font-mono text-xs font-bold space-y-2">
         <p>لتشغيل التحليل الكامل للمنتج: <span className="text-[#00FF41] bg-black px-1">اسم المنتج</span></p>
         <p>لتوليد أفكار الإعلانات والكوبي رايتنج فقط: <span className="text-[#00FF41] bg-black px-1">/ad اسم المنتج</span></p>
      </div>
    </div>
  );
}

export function Phase0View({ data, onNext, hideNext = false, onRebuild }: { data: Phase0_CouncilResult; onNext?: () => void; hideNext?: boolean; onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 0.</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pt-4 pb-12">
      <div className="flex flex-col mb-10 border-b-2 border-black pb-8 gap-4">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black flex items-center gap-3">
           <Users size={48} className="text-[#00FF41] bg-black p-2" />
           مجلس الخبراء للذكاء الاصطناعي (LLM Council)
        </h2>
        <p className="font-mono text-sm font-bold uppercase opacity-50" dir="ltr">المرحلة 00 // مجلس تقييم الفكرة</p>
      </div>

      <div className="bg-gray-100 p-4 border-l-4 border-black font-mono text-sm mb-8 whitespace-pre-wrap">
         {data.question}
      </div>

      <div className="bg-[#fbfcfa] border-2 border-black p-6 md:p-8 neo-shadow relative group/brief">
        <div className="absolute top-0 right-0 bg-black text-[#00FF41] font-mono text-xs font-black uppercase px-3 py-1">
          THE VERDICT - الحكم النهائي
        </div>
        
        <div className="space-y-8 mt-6">
          {/* Recommendation */}
          <div className="border-r-4 border-[#00FF41] pr-4">
             <h3 className="text-lg font-bold uppercase mb-2">التوصية النهائية:</h3>
             <p className="font-mono text-xl">{data.verdict.recommendation}</p>
          </div>

          <div className="border-r-4 border-black pr-4 bg-gray-100 p-4">
             <h3 className="text-sm font-bold uppercase mb-1">الخطوة الأولى الإجبارية:</h3>
             <p className="font-mono text-lg font-bold">{data.verdict.oneThingToDoFirst}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agreements */}
            <div className="border-2 border-black p-4">
               <h3 className="text-sm border-b-2 border-black pb-2 mb-4 font-bold uppercase bg-[#00FF41] inline-block px-2">نقاط الاتفاق (إشارات قوية)</h3>
               <ul className="space-y-3">
                 {data.verdict.agreements.map((a, i) => (
                   <li key={i} className="flex gap-2 p-2 bg-white border border-gray-200">
                     <CheckCircle2 size={18} className="text-green-600 mt-1 shrink-0" />
                     <p className="text-sm">{a}</p>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Blind Spots */}
            <div className="border-2 border-black p-4">
               <h3 className="text-sm border-b-2 border-black pb-2 mb-4 font-bold uppercase bg-red-400 text-black inline-block px-2">نقاط عمياء تم اكتشافها</h3>
               <ul className="space-y-3">
                 {data.verdict.blindSpots.map((b, i) => (
                   <li key={i} className="flex gap-2 p-2 bg-white border border-gray-200">
                     <Target size={18} className="text-red-500 mt-1 shrink-0" />
                     <p className="text-sm font-bold">{b}</p>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {/* Clashes */}
          {data.verdict.clashes && data.verdict.clashes.length > 0 && (
            <div className="border-2 border-black p-4 bg-[#f2f2f2]">
               <h3 className="text-sm font-bold uppercase mb-4 px-2 py-1 bg-black text-white inline-block">نقاط الخلاف (تضارب الآراء)</h3>
               <div className="space-y-4">
                 {data.verdict.clashes.map((c, i) => (
                   <div key={i} className="bg-white p-3 border border-black border-dashed">
                     <p className="font-bold text-[#00FF41] bg-black inline-block px-2 mb-1">المحور: {c.issue}</p>
                     <p className="text-xs mb-2 text-gray-600">{c.sides}</p>
                     <p className="text-sm">{c.explanation}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">تفاصيل نقاش الخبراء</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {Object.entries(data.advisorResponses).map(([key, response]) => (
             <div key={key} className="border-2 border-black p-4 neo-shadow bg-white text-sm">
                <div className="font-bold border-b-2 border-black pb-1 mb-2 capitalize bg-gray-100 p-1 flex justify-between">
                   <span>{key}</span>
                   <CopyButton text={response as string} />
                </div>
                <div className="whitespace-pre-wrap">{response as string}</div>
             </div>
           ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t-2 border-black/10 mt-8 print-hide">
        {onRebuild && (
          <button 
            onClick={onRebuild}
            className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-4 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            <RotateCw size={18} />
            <span>إعادة بناء هذه المرحلة (Phase 0) 🔄</span>
          </button>
        )}
        {!hideNext && onNext && (
          <button onClick={onNext} className="bg-black text-[#00FF41] px-8 py-4 font-bold text-lg uppercase flex items-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_#00FF41] ml-auto">
            الموافقة وبناء الجماهير (Phase 0.5) <ArrowRight size={24} className="rotate-180" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Phase05View({ data, onNext, hideNext = false, onRebuild }: { data: Phase05_AudienceBuilder; onNext?: () => void; hideNext?: boolean; onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 0.5.</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pt-4 pb-12">
      <div className="flex flex-col mb-10 border-b-2 border-black pb-8 gap-4">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black flex items-center gap-3">
           <Users size={48} className="text-[#00FF41] bg-black p-2" />
           Facebook Audience Builder
        </h2>
        <p className="font-mono text-sm font-bold uppercase opacity-50" dir="ltr">المرحلة 0.5 // بناء الجماهير</p>
      </div>

      <div className="bg-[#fbfcfa] border-2 border-black p-6 md:p-8 neo-shadow relative pr-12">
        <div className="absolute top-0 right-0 bg-black text-[#00FF41] font-mono text-xs font-black uppercase px-3 py-1">
          عنصر
        </div>
        <div className="border-l-4 border-black pl-4 mb-6">
          <p className="text-sm font-bold text-gray-500 uppercase">ملخص استراتيجية الجمهور</p>
          <p className="font-mono">{data.summary}</p>
        </div>

        <div className="space-y-6">
           <div className="border-2 border-black p-4 bg-gray-50">
             <h3 className="font-bold border-b-2 border-black pb-1 mb-2 inline-block px-1">🔥 Phase de test (للاختبار)</h3>
             <ul className="list-disc pl-5 font-mono text-sm space-y-1 mt-2">
               {data.testPhase.priorityAudiences.map((a, i) => <li key={i}>{a}</li>)}
             </ul>
             <p className="text-sm mt-3 border-t border-dashed pt-2"><strong>الميزانية/النصيحة:</strong> {data.testPhase.budgetAdvice}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="border-2 border-black p-4 neo-shadow bg-white text-sm space-y-4">
            <h3 className="font-bold border-b-2 border-black pb-1 mb-2 capitalize bg-[#00FF41] inline-block px-1">1. Lookalike Audiences</h3>
            {data.audiences.lookalike.map((a, i) => (
              <div key={i} className="mb-2">
                 <p className="font-bold">{a.name}</p>
                 <p className="text-xs text-gray-600">{a.details}</p>
              </div>
            ))}
         </div>
         <div className="border-2 border-black p-4 neo-shadow bg-white text-sm space-y-4">
            <h3 className="font-bold border-b-2 border-black pb-1 mb-2 capitalize bg-[#00FF41] inline-block px-1">2. Interests</h3>
            {data.audiences.interests.map((a, i) => (
              <div key={i} className="mb-2">
                 <p className="font-bold">Group {a.groupName}</p>
                 <p className="text-xs text-gray-600">{a.description}</p>
                 <div className="flex flex-wrap gap-1 mt-1">
                   {a.interests.map((int, idx) => <span key={idx} className="bg-gray-200 px-1 text-[10px]">{int}</span>)}
                 </div>
              </div>
            ))}
         </div>
         <div className="border-2 border-black p-4 neo-shadow bg-white text-sm space-y-4">
            <h3 className="font-bold border-b-2 border-black pb-1 mb-2 capitalize bg-[#00FF41] inline-block px-1">3. Remarketing</h3>
            {data.audiences.remarketing.map((a, i) => (
              <div key={i} className="mb-2">
                 <p className="font-bold">{a.name}</p>
                 <p className="text-xs text-gray-600">{a.details}</p>
              </div>
            ))}
         </div>
         <div className="border-2 border-black p-4 neo-shadow bg-white text-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold border-b-2 border-black pb-1 mb-2 capitalize bg-[#00FF41] inline-block px-1 mt-4">4. Broad</h3>
              {data.audiences.broad.map((a, i) => (
                <div key={i} className="mb-2">
                   <p className="font-bold">{a.name}</p>
                   <p className="text-xs text-gray-600">{a.details}</p>
                </div>
              ))}
              
              <h3 className="font-bold border-b-2 border-black pb-1 mb-2 capitalize bg-[#00FF41] inline-block px-1 mt-4">5. Custom</h3>
              {data.audiences.custom.map((a, i) => (
                <div key={i} className="mb-2">
                   <p className="font-bold">{a.name}</p>
                   <p className="text-xs text-gray-600">{a.details}</p>
                </div>
              ))}
            </div>
         </div>
      </div>

      <div className="bg-white border-2 border-black p-6 neo-shadow space-y-4">
         <h3 className="font-bold bg-black text-white px-2 py-1 inline-block">Règles d'exclusion (قواعد الاستبعاد)</h3>
         <ul className="list-disc pl-5 font-mono text-sm space-y-1">
            {data.exclusionRules.map((e, i) => <li key={i}>{e}</li>)}
         </ul>
      </div>

      <div className="bg-white border-2 border-black p-6 neo-shadow space-y-4">
         <h3 className="font-bold bg-black text-[#00FF41] px-2 py-1 inline-block">Instructions de création</h3>
         <div className="font-mono text-sm whitespace-pre-wrap">{data.instructions}</div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t-2 border-black/10 mt-8 print-hide">
        {onRebuild && (
          <button 
            onClick={onRebuild}
            className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-4 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            <RotateCw size={18} />
            <span>إعادة بناء هذه المرحلة (Phase 0.5) 🔄</span>
          </button>
        )}
        {!hideNext && onNext && (
          <button onClick={onNext} className="bg-black text-[#00FF41] px-8 py-4 font-bold text-lg uppercase flex items-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_#00FF41] ml-auto">
            الموافقة وبدء التحليل (Phase 1) <ArrowRight size={24} className="rotate-180" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Phase1View({ data, onNext, hideNext = false, onRebuild }: { data: Phase1_Intelligence; onNext?: () => void; hideNext?: boolean; onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 1.</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pt-4 pb-12">
      <div className="flex flex-col mb-10 border-b-2 border-black pb-8 gap-4">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black">
           الرادار الذكي للمنتجات الرابحة
        </h2>
        <p className="font-mono text-sm font-bold uppercase opacity-50" dir="ltr">المرحلة 01 // رادار ذكاء المنتج</p>
      </div>

      {/* Main Stats Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white border-2 border-black p-6 shadow-[4px_4px_0_#00FF41]">
           <h1 className="text-3xl font-black font-display uppercase text-black mb-2">{data.productName}</h1>
           <span className="font-mono text-[10px] bg-black text-[#00FF41] px-2 py-1 uppercase">{data.brand} | {data.category}</span>
           <p className="mt-4 font-bold text-lg">{data.usp}</p>
        </div>
        <div className="shrink-0 bg-[#00FF41] border-2 border-black p-6 flex flex-col justify-center items-center font-mono">
           <span className="text-[10px] uppercase font-bold tracking-widest mb-1">النتيجة / التصنيف</span>
           <span className="text-4xl font-black mb-1">{data.score}/100</span>
           <span className="bg-black text-white px-2 py-1 text-xs uppercase tracking-wider">{data.classification}</span>
        </div>
      </div>

      {/* Market & Economics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#f2f2f2] p-6 border-2 border-black relative">
          <span className="font-mono text-[10px] bg-black text-[#00FF41] px-2 py-1 absolute -top-3 right-4 tracking-widest uppercase font-bold text-center" dir="ltr">الجمهور المستهدف (DZ)</span>
          <p className="text-sm text-black font-medium leading-relaxed font-sans mt-3">{data.targetAudienceDZ}</p>
        </div>
        <div className="bg-[#f2f2f2] p-6 border-2 border-black relative">
          <span className="font-mono text-[10px] bg-black text-white px-2 py-1 absolute -top-3 right-4 tracking-widest uppercase font-bold text-center" dir="ltr">تشبع السوق</span>
          <p className="text-sm text-black font-medium leading-relaxed font-sans mt-3">{data.marketSaturation}</p>
        </div>
      </div>

      {/* Pricing Strategies */}
      {data.pricingStrategies && (
        <div className="bg-black text-white p-6 border-2 border-black relative">
          <span className="font-mono text-[10px] border-2 border-[#00FF41] text-[#00FF41] px-2 py-1 absolute -top-3 right-4 tracking-widest uppercase font-bold text-center" dir="ltr">استراتيجيات التسعير (DZD)</span>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div className="border border-[#FFFFFF33] p-3">
              <span className="block text-[10px] uppercase opacity-50 mb-1">منخفض</span>
              <span className="font-bold font-mono">{data.pricingStrategies.low}</span>
            </div>
            <div className="border border-[#00FF41] bg-[#00FF411A] p-3">
              <span className="block text-[10px] text-[#00FF41] uppercase mb-1">متوازن (مقترح)</span>
              <span className="font-bold font-mono text-[#00FF41]">{data.suggestedPriceDZD || data.pricingStrategies.balanced}</span>
            </div>
            <div className="border border-[#FFFFFF33] p-3">
              <span className="block text-[10px] uppercase opacity-50 mb-1">مرتفع</span>
              <span className="font-bold font-mono">{data.pricingStrategies.premium}</span>
            </div>
          </div>
        </div>
      )}

      {/* Profitability Estimates */}
      {data.profitabilityEstimates && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
           {Object.entries(data.profitabilityEstimates || {}).map(([key, val]) => (
              <div key={key} className="border-2 border-black p-3 bg-white text-center">
                <span className="block text-[9px] uppercase font-mono font-bold opacity-50 mb-1">{key}</span>
                <span className="font-bold text-sm tracking-tight">{val as React.ReactNode}</span>
              </div>
           ))}
        </div>
      )}

      {/* Competitors */}
      {data.competitorAnalysis && data.competitorAnalysis.length > 0 && (
         <div className="p-6 border-2 border-black bg-white">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold mb-4 block" dir="ltr">COMPETITOR ANALYSIS</span>
            <div className="flex flex-col gap-4">
              {data.competitorAnalysis.map((comp, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 border-b border-[#0000001A] pb-4 last:border-0 last:pb-0">
                   <div className="md:w-32 shrink-0">
                     <span className="bg-black text-white px-2 py-1 text-xs font-bold uppercase">{comp.name}</span>
                     <span className="block mt-2 font-mono text-sm">{comp.price}</span>
                   </div>
                   <div className="flex-1 text-sm space-y-2">
                      <p><span className="font-bold">Message:</span> {comp.message}</p>
                      <div className="flex gap-4">
                         <p className="text-green-700 bg-green-50 px-2 py-1 text-xs border border-green-200"><span className="font-bold">Strength:</span> {comp.strengths}</p>
                         <p className="text-red-700 bg-red-50 px-2 py-1 text-xs border border-red-200"><span className="font-bold">Weakness:</span> {comp.weaknesses}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
         </div>
      )}

      {/* New Untapped Angles */}
      {data.untappedAngles && data.untappedAngles.length > 0 && (
        <div className="bg-[#00FF41] p-6 border-2 border-black break-inside-avoid">
          <span className="font-mono text-[10px] bg-black text-[#00FF41] px-2 py-1 inline-block tracking-widest uppercase font-bold mb-4" dir="ltr">UNTAPPED ANGLES</span>
          <ul className="list-disc list-inside space-y-2 font-bold text-sm">
            {data.untappedAngles.map((angle, i) => (
              <li key={i}>{angle}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Color Palette */}
      {data.colorPalette && (
        <div className="p-6 border-2 border-black bg-white break-inside-avoid">
           <span className="font-mono text-[10px] uppercase tracking-widest font-bold mb-4 block" dir="ltr">COLOR PALETTE</span>
           <div className="flex gap-4">
               {Object.entries(data.colorPalette).map(([key, hex]) => (
                  <div key={key} className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 border-2 border-black" style={{ backgroundColor: hex }}></div>
                     <span className="font-mono text-[10px] uppercase font-bold" dir="ltr">{hex}</span>
                     <span className="font-mono text-[8px] opacity-50 uppercase">{key}</span>
                  </div>
               ))}
           </div>
        </div>
      )}

      <div className="space-y-4 break-inside-avoid">
         <span className="font-mono text-[10px] uppercase font-bold opacity-50 border-b-2 border-black pb-2 block w-full" dir="ltr">Psychological Angles</span>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.psychologicalAngles?.slice(0, 3).map((angle, idx) => (
               <div key={idx} className="border-2 border-black p-4 bg-white">
                  <h4 className="font-bold text-lg mb-2">{angle.name}</h4>
                  <p className="text-xs opacity-80 mb-4">{angle.description}</p>
                  <p className="text-sm font-bold bg-[#f2f2f2] p-2 border-s-2 border-[#00FF41]">"{angle.hookExample}"</p>
               </div>
            ))}
         </div>
      </div>

      {/* Customer Reviews */}
      {data.customerReviews && data.customerReviews.length > 0 && (
        <div className="bg-white p-6 border-2 border-black break-inside-avoid">
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold mb-4 block" dir="ltr">CUSTOMER REVIEWS</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {data.customerReviews.map((review, i) => (
                <div key={i} className="border border-[#00000033] p-4 bg-[#fcfcfc]">
                   <div className="flex justify-between mb-2">
                     <span className="font-bold text-sm">{review.author}</span>
                     <span className="text-[#F59E0B] font-mono text-xs">{'★'.repeat(Math.round(review.rating))}</span>
                   </div>
                   <p className="text-xs italic">"{review.comment}"</p>
                </div>
             ))}
          </div>
        </div>
      )}

      {data.buyerPersona && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
          <div className="bg-white p-6 border-2 border-black">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold mb-4 block" dir="ltr">BUYER PERSONA</span>
            <ul className="space-y-2 text-sm">
              <li><span className="font-bold">Age & Gender:</span> {data.buyerPersona.age} | {data.buyerPersona.gender}</li>
              <li><span className="font-bold">Income:</span> {data.buyerPersona.income}</li>
              <li><span className="font-bold">Behavior:</span> {data.buyerPersona.behavior}</li>
              <li><span className="font-bold">Interests:</span> {data.buyerPersona.interests?.join(' - ')}</li>
            </ul>
          </div>
          <div className="bg-[#f2f2f2] p-6 border-2 border-black">
             <span className="font-mono text-[10px] uppercase tracking-widest font-bold mb-4 block" dir="ltr">TOP PAIN POINTS</span>
             <ul className="list-disc list-inside space-y-2 text-sm font-bold">
                {data.buyerPersona.painPoints?.map((pain: string, i: number) => <li key={i}>{pain}</li>)}
             </ul>
          </div>
        </div>
      )}

      {data.adScripts && data.adScripts.length > 0 && (
         <div className="p-6 border-2 border-black bg-white break-inside-avoid">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold mb-4 block" dir="ltr">VIDEO AD SCRIPTS (15-30s)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {data.adScripts.map((script, i) => (
                 <div key={i} className="border border-[#00000033] p-4 text-xs space-y-2">
                    <p><span className="bg-[#00FF41] px-1 font-bold">HOOK:</span> {script.hook}</p>
                    <p><span className="bg-black text-white px-1 font-bold">PROBLEM:</span> {script.problem}</p>
                    <p><span className="border-b border-[#00FF41] font-bold">SOLUTION:</span> {script.solution}</p>
                    <p><span className="font-bold underline">CTA:</span> {script.cta}</p>
                 </div>
               ))}
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 break-inside-avoid">
         {data.adStrategy && (
            <div className="border-2 border-black p-6 bg-white">
               <span className="font-mono text-[10px] uppercase tracking-widest font-bold mb-4 block" dir="ltr">META ADS STRATEGY</span>
               <div className="space-y-3 text-xs">
                  <p><span className="font-bold block mb-1">Targeting:</span> {data.adStrategy.targeting}</p>
                  <p><span className="font-bold block mb-1">Testing:</span> {data.adStrategy.testing}</p>
                  <p><span className="font-bold block mb-1">Scaling:</span> {data.adStrategy.scaling}</p>
                  <p><span className="font-bold block mb-1">Retargeting:</span> {data.adStrategy.retargeting}</p>
               </div>
            </div>
         )}
         {data.finalReport && (
            <div className="border-2 border-black p-6 bg-black text-white h-full flex flex-col justify-center">
               <span className="font-mono text-[10px] text-[#00FF41] uppercase tracking-widest font-bold mb-4 block" dir="ltr">FINAL VERDICT & REPORT</span>
               <p className="text-sm leading-relaxed font-bold">{data.finalReport}</p>
            </div>
         )}
      </div>

      {data.bsaCompetitiveExtractor && (
        <div className="border-2 border-black bg-white p-6 mt-6 break-inside-avoid shadow-[4px_4px_0_#FF0055]">
           <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
              <div className="w-4 h-4 bg-[#FF0055]"></div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tighter">Competitive Ads Extractor (BSA Edition)</h3>
           </div>
           
           <p className="text-sm font-bold mb-6">{data.bsaCompetitiveExtractor.overview}</p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <h4 className="font-bold underline mb-3 text-sm">Recurring Angles (What Works)</h4>
                <div className="space-y-4">
                  {data.bsaCompetitiveExtractor.recurringAngles.map((angle, idx) => (
                    <div key={idx} className="bg-[#f2f2f2] p-3 text-xs border border-black">
                      <p><span className="font-bold">Problem:</span> {angle.problem}</p>
                      <p className="mt-1"><span className="bg-[#FF0055] text-white px-1">Copy:</span> {angle.copy}</p>
                      <p className="mt-1"><span className="font-bold">Why it works:</span> {angle.whyItWorks}</p>
                    </div>
                  ))}
                </div>
             </div>

             <div className="space-y-6">
                <div>
                  <h4 className="font-bold underline mb-3 text-sm">Winning Patterns</h4>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                    {data.bsaCompetitiveExtractor.winningPatterns.map((pattern, idx) => (
                      <li key={idx}><span className="font-bold">{pattern.patternName}:</span> {pattern.description}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold underline mb-3 text-sm">Missing Angles / Opportunities</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.bsaCompetitiveExtractor.missingAngles.map((angle, idx) => (
                      <span key={idx} className="bg-black text-[#00FF41] px-2 py-1 text-xs font-mono">{angle}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#fbfcfa] border border-[#FF0055] p-4 relative">
                  <span className="absolute top-0 right-0 bg-[#FF0055] text-white text-[10px] font-bold px-2">BSA Action Plan</span>
                  <ul className="list-square pl-4 text-xs space-y-1 font-bold mt-2">
                    {data.bsaCompetitiveExtractor.bsaRecommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
             </div>
           </div>
        </div>
      )}

      <div className="mt-8">
        <SaaSComplianceAuditor 
          phaseName="مستشار الجودة والامتثال - نتائج تحليل رادار المنتج" 
          initialText={data.finalReport || ""} 
        />
      </div>

      {data.seoBlueprint && (
        <div className="border-2 border-black bg-black text-white p-6 mt-6 break-inside-avoid">
           <div className="flex items-center gap-3 mb-6 border-b-2 border-white pb-4">
              <div className="w-4 h-4 bg-[#00FF41]"></div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-[#00FF41]">SEO Blueprint</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <h4 className="font-mono text-sm font-bold uppercase mb-3 text-[#FF0055]">Technical Checklist</h4>
               <ul className="list-disc pl-5 text-sm space-y-2 mb-6">
                 {data.seoBlueprint.technicalChecklist.map((item, idx) => (
                   <li key={idx} className="opacity-90">{item}</li>
                 ))}
               </ul>

               <h4 className="font-mono text-sm font-bold uppercase mb-3 text-[#FF0055]">Audit Report</h4>
               <div className="bg-[#111] border border-[#333] p-4 font-mono text-xs text-[#00FF41] whitespace-pre-wrap">
                 {data.seoBlueprint.auditOutput}
               </div>
             </div>

             <div className="space-y-6">
               <h4 className="font-mono text-sm font-bold uppercase mb-3 text-[#FF0055]">On-Page SEO Rules</h4>
               <div className="space-y-3">
                 <div className="bg-[#111] p-3 text-xs border border-[#333]">
                   <span className="font-bold text-[#00FF41] block mb-1">Title Formula:</span>
                   {data.seoBlueprint.onPageRules.titleFormula}
                 </div>
                 <div className="bg-[#111] p-3 text-xs border border-[#333]">
                   <span className="font-bold text-[#00FF41] block mb-1">Description Formula:</span>
                   {data.seoBlueprint.onPageRules.descriptionFormula}
                 </div>
                 <div className="bg-[#111] p-3 text-xs border border-[#333]">
                   <span className="font-bold text-[#00FF41] block mb-1">Heading Structure:</span>
                   {data.seoBlueprint.onPageRules.headingStructure}
                 </div>
                 <div className="bg-[#111] p-3 text-xs border border-[#333]">
                   <span className="font-bold text-[#00FF41] block mb-1">Keyword Mapping:</span>
                   {data.seoBlueprint.onPageRules.keywordMapping}
                 </div>
                 <div className="bg-[#111] p-3 text-xs border border-[#333]">
                   <span className="font-bold text-[#00FF41] block mb-1">Internal Linking:</span>
                   {data.seoBlueprint.onPageRules.internalLinking}
                 </div>
               </div>
             </div>
           </div>
           
           <div className="mt-6 border-t border-[#333] pt-6">
             <h4 className="font-mono text-sm font-bold uppercase mb-3 text-[#FF0055]">JSON-LD Schema</h4>
             <pre className="bg-[#111] border border-[#333] p-4 font-mono text-xs text-gray-300 overflow-x-auto">
               {data.seoBlueprint.jsonLdSchema}
             </pre>
           </div>
        </div>
      )}

      {!hideNext && (
        <div className="min-h-24 py-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between px-8 bg-[#f2f2f2] mt-10 gap-4 printable-hide">
          {onRebuild ? (
            <button 
              onClick={onRebuild}
              className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <RotateCw size={18} />
              <span>إعادة بناء وتحسين هذه المرحلة (Phase 1) 🔄</span>
            </button>
          ) : (
            <div className="font-display font-bold text-xl uppercase tracking-tighter">اكتملت المرحلة 1. هل نتابع توليد البرومبتات (MARKETING MASTER Briefs)؟</div>
          )}
          <button onClick={onNext} className="px-10 py-4 bg-black text-white font-display font-bold text-lg uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#00FF41] transition-all flex items-center gap-3 shrink-0 ml-auto">
            اعتماد <ArrowRight size={20} className="rotate-180" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function Phase2View({ data, onNext, hideNext = false, onRebuild }: { data: Phase2_StaticBriefs; onNext?: () => void; hideNext?: boolean; onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 2.</div>;
  const getBriefCopyText = (brief: any) => {
    return `CONCEPT: ${brief.conceptName}
ANGLE: ${brief.psychoAngle}

[IMAGE PROMPT]
${brief.imagePromptEN}
${brief.negativePrompt ? `Negative: ${brief.negativePrompt}` : ''}

[TEXT LAYOUT]
Headline: ${brief.textLayout.headline}
Sub-Headline: ${brief.textLayout.subHeadline}
CTA: ${brief.textLayout.ctaButton}

[AD COPY (FUSHA)]
Hook: ${brief.adCopyFusha.hook}
Body: ${brief.adCopyFusha.body}
CTA: ${brief.adCopyFusha.cta}`;
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto space-y-8 pt-4 pb-12">
      <div className="mb-10 pb-6 border-b-2 border-black flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black flex items-center gap-4">ترسانة الإعلانات البصرية</h2>
          <p className="font-mono text-sm font-bold uppercase mt-4 opacity-50" dir="ltr">Phase 02 // Visual Ad Arsenal</p>
        </div>
      </div>

      {data.masterPhotographyPrompt && (
        <div className="bg-black text-[#00FF41] border-4 border-black p-6 shadow-[8px_8px_0_#00FF41] mb-12 relative group">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <CopyButton text={data.masterPhotographyPrompt} className="!border-[#00FF41] !bg-black !text-[#00FF41] hover:!bg-[#00FF41] hover:!text-black" />
          </div>
          <div className="flex items-center gap-3 mb-4 border-b-2 border-[#00FF41] pb-4">
            <ImageIcon size={28} />
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter" dir="ltr">MASTER PRODUCT PHOTOGRAPHY PROMPT</h3>
          </div>
          <p className="font-mono text-xs md:text-sm whitespace-pre-wrap leading-relaxed opacity-90" dir="ltr">
            {data.masterPhotographyPrompt}
          </p>
        </div>
      )}

      {data.socialMediaPlan && (
        <div className="bg-[#fbfcfa] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_#FF0055] mb-12 relative break-inside-avoid">
           <div className="absolute top-0 right-0 bg-[#FF0055] text-white font-mono text-xs font-bold uppercase px-3 py-1">
             SOCIAL MEDIA ADVERTISING PLAN
           </div>
           
           <h3 className="text-3xl font-display font-black uppercase mb-6 border-b-4 border-black pb-4">Social Media Advertising</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="bg-white border-2 border-black p-4">
               <span className="block text-xs font-mono font-bold uppercase bg-black text-white px-2 py-1 mb-2 inline-block">1. Objectives</span>
               <p className="text-sm font-bold">{data.socialMediaPlan.objectives}</p>
             </div>
             <div className="bg-white border-2 border-black p-4">
               <span className="block text-xs font-mono font-bold uppercase bg-black text-white px-2 py-1 mb-2 inline-block">2. Audience</span>
               <p className="text-sm font-bold">{data.socialMediaPlan.audienceAnalysis}</p>
             </div>
           </div>

           <div className="bg-white border-2 border-black p-4 mb-6">
              <span className="block text-xs font-mono font-bold uppercase bg-black text-white px-2 py-1 mb-2 inline-block">3. Strategy</span>
              <p className="text-sm font-bold">{data.socialMediaPlan.strategyDevelopment}</p>
           </div>

           <div className="mb-6">
              <span className="block text-xs font-mono font-bold uppercase bg-black text-white px-2 py-1 mb-2 inline-block">4. Content Creation</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.socialMediaPlan.contentCreation.map((content, idx) => (
                  <div key={idx} className="bg-white border border-black p-3 text-xs">
                    <p className="font-bold underline mb-1 uppercase">{content.format}</p>
                    <p className="mb-1"><span className="text-gray-500 font-mono">HOOK:</span> {content.hook}</p>
                    <p><span className="text-gray-500 font-mono">VALUE:</span> {content.valueProposition}</p>
                  </div>
                ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white border-2 border-black p-4">
               <span className="block text-xs font-mono font-bold uppercase bg-black text-white px-2 py-1 mb-2 inline-block">5. Setup & 6. Tracking</span>
               <p className="text-sm mb-3"><strong>Setup:</strong> {data.socialMediaPlan.campaignSetup}</p>
               <p className="text-sm"><strong>Performance (KPIs):</strong> {data.socialMediaPlan.performanceTracking}</p>
             </div>
             <div className="bg-black text-white border-2 border-black p-4">
               <span className="block text-xs font-mono font-bold uppercase bg-[#FF0055] text-white px-2 py-1 mb-2 inline-block">7. Mistakes to Avoid (D-Tier)</span>
               <ul className="list-disc pl-4 text-xs space-y-1">
                 {data.socialMediaPlan.mistakesToAvoid.map((mistake, idx) => (
                   <li key={idx} className="opacity-90">{mistake}</li>
                 ))}
               </ul>
             </div>
           </div>
        </div>
      )}

      <div className="space-y-12">
        {data.briefs?.map((brief, idx) => (
          <div key={idx} className="bg-white border-2 border-black relative flex flex-col md:flex-row group/brief break-inside-avoid">
             <div className="absolute top-2 right-2 opacity-0 group-hover/brief:opacity-100 transition-opacity z-10">
               <CopyButton text={getBriefCopyText(brief)} />
            </div>
            <div className="bg-black text-[#00FF41] p-6 border-b-2 md:border-b-0 md:border-e-2 border-black md:w-64 shrink-0 flex flex-col justify-center">
              <span className="font-mono font-bold text-xs opacity-50 mb-2" dir="ltr">CONCEPT {idx + 1}/5</span>
              <h3 className="text-2xl font-display font-black uppercase tracking-tighter leading-tight text-white mb-2">{brief.conceptName}</h3>
              <span className="bg-[#00FF41] text-black font-bold uppercase text-[10px] px-2 py-1 w-max">{brief.psychoAngle}</span>
            </div>
            
            <div className="p-6 flex-1 space-y-6">
              <div dir="ltr">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2"><ImageIcon size={14}/> Image Prompt (Generative AI)</span>
                <p className="text-xs font-mono bg-[#f2f2f2] p-4 border border-[#00000033] pr-10">{brief.imagePromptEN}</p>
                {brief.negativePrompt && <p className="text-[10px] font-mono text-red-600 mt-2">Negative: {brief.negativePrompt}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-black border-dashed">
                <div>
                   <span className="font-mono text-[10px] px-1 bg-black text-[#00FF41] uppercase font-bold tracking-widest mb-2 block w-max" dir="ltr">Text Layout</span>
                   <ul className="text-sm font-bold space-y-3">
                      <li><span className="font-normal opacity-50">Head:</span> {brief.textLayout.headline}</li>
                      <li><span className="font-normal opacity-50">Sub:</span> {brief.textLayout.subHeadline}</li>
                      <li><span className="font-normal opacity-50">CTA:</span> {brief.textLayout.ctaButton}</li>
                   </ul>
                </div>
                <div>
                   <span className="font-mono text-[10px] px-1 bg-black text-white uppercase font-bold tracking-widest mb-2 block w-max" dir="ltr">Ad Copy (Arabic Fusha)</span>
                   <p className="text-sm font-bold text-[#00FF41] bg-black p-2 border-2 border-black">
                     {brief.adCopyFusha.hook}
                   </p>
                   <p className="text-sm opacity-80 mt-2">{brief.adCopyFusha.body}</p>
                   <p className="text-xs bg-[#f2f2f2] p-1 mt-2">{brief.adCopyFusha.cta}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!hideNext && (
        <div className="min-h-24 py-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between px-8 bg-[#f2f2f2] mt-10 gap-4 printable-hide">
          {onRebuild ? (
            <button 
              onClick={onRebuild}
              className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <RotateCw size={18} />
              <span>إعادة بناء هذه المرحلة (Phase 2) 🔄</span>
            </button>
          ) : (
            <div className="font-display font-bold text-xl uppercase tracking-tighter">اكتملت المرحلة 2. هل نتابع بناء Landing page (المرحلة 3)؟</div>
          )}
          <button onClick={onNext} className="px-10 py-4 bg-black text-white font-display font-bold text-lg uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#00FF41] transition-all flex items-center gap-3 shrink-0 ml-auto">
            اعتماد <ArrowRight size={20} className="rotate-180" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function Phase3View({ data, onNext, hideNext = false, onRebuild }: { data: Phase3_LandingPage; onNext?: () => void; hideNext?: boolean; onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 3.</div>;
  const getSectionCopyText = (sec: any) => {
    return `SECTION ${sec.order}: ${sec.title} (${sec.section_type})

[IMAGE PROMPT]
${sec.image_prompt}

[TEXT LAYOUT/CONTENT]
Headline: ${sec.text_overlay?.headline}
Subtext: ${sec.text_overlay?.subtext}
Position: ${sec.text_overlay?.position}
Content: ${sec.content}
CTA: ${sec.cta_text}`;
  };

  const getFullCopyText = () => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8 pt-4 pb-12">
      <div className="mb-10 pb-6 border-b-2 border-black flex justify-between items-start">
        <div>
           <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black flex items-center gap-4">صفحة هبوط خارقة التحويل</h2>
           <p className="font-mono text-sm font-bold uppercase mt-4 opacity-50" dir="ltr">Phase 03 // Landing Page Classic & MARKETING MASTER LP</p>
        </div>
        <CopyButton text={getFullCopyText()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#f2f2f2] border-2 border-black p-4">
          <span className="block font-mono text-[10px] opacity-50 mb-1">PRODUCT / PAGE TYPE</span>
          <p className="font-bold">{data.product_name} <span className="opacity-50">/</span> {data.page_type}</p>
        </div>
        <div className="bg-[#f2f2f2] border-2 border-black p-4">
          <span className="block font-mono text-[10px] opacity-50 mb-1">FRAMEWORK / ANGLE</span>
          <p className="font-bold uppercase">{data.conversion_framework} <span className="opacity-50">/</span> {data.marketing_angle}</p>
        </div>
        <div className="bg-[#f2f2f2] border-2 border-black p-4">
          <span className="block font-mono text-[10px] opacity-50 mb-1">TONE / MARKET</span>
          <p className="font-bold">{data.tone} <span className="opacity-50">/</span> {data.target_market}</p>
        </div>
        <div className="bg-[#f2f2f2] border-2 border-black p-4">
          <span className="block font-mono text-[10px] opacity-50 mb-1">COLOR SCHEME</span>
          <div className="flex gap-2 items-center h-full">
            <div className="w-8 h-8 rounded-full border border-black shadow" style={{background: data.color_scheme?.primary}} title="Primary"></div>
            <div className="w-8 h-8 rounded-full border border-black shadow" style={{background: data.color_scheme?.secondary}} title="Secondary"></div>
            <div className="w-8 h-8 rounded-full border border-black shadow" style={{background: data.color_scheme?.accent}} title="Accent"></div>
            <div className="w-8 h-8 rounded-full border border-black shadow" style={{background: data.color_scheme?.background}} title="Background"></div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-6 relative">
        <h3 className="font-bold mb-2 uppercase text-sm border-b-2 border-black pb-2">General Notes & SEO</h3>
        <p className="text-sm opacity-80 mb-4">{data.general_notes}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
           <div><span className="font-bold">SEO Title:</span> {data.seo?.meta_title}</div>
           <div><span className="font-bold">SEO Desc:</span> {data.seo?.meta_description}</div>
        </div>
        <div className="mt-4 text-xs font-bold bg-black text-[#00FF41] p-2 inline-block">Impact: {data.estimated_sections_impact}</div>
      </div>

      <div className="space-y-6">
        {data.sections?.map((sec, idx) => (
          <div key={idx} className="border-2 border-black bg-white flex flex-col hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_#00FF41] transition-all relative group/section break-inside-avoid mb-6">
             <div className="absolute top-2 right-2 opacity-0 group-hover/section:opacity-100 transition-opacity z-10">
                <CopyButton text={getSectionCopyText(sec)} />
             </div>
             
             {/* Header */}
             <div className="p-4 border-b-2 border-black bg-[#f2f2f2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                   <span className="font-mono text-[10px] font-bold opacity-40 bg-black text-white px-2 py-1 mr-2" dir="ltr">SEC {sec.order}</span>
                   <span className="font-mono text-[10px] font-bold opacity-40 uppercase" dir="ltr">{sec.section_type}</span>
                   <h4 className="font-display font-black text-xl uppercase mt-1">{sec.title}</h4>
                   <p className="text-sm opacity-60 text-black mt-1 font-bold">{sec.subtitle}</p>
                </div>
                <div className="flex gap-2 items-center" dir="ltr">
                  <span className="text-[10px] font-mono opacity-50">LIAISON:</span>
                  <div className="text-[10px] font-mono px-2 py-1 bg-white border border-black">{sec.color_transition}</div>
                </div>
             </div>

             {/* Content area */}
             <div className="p-6 space-y-4">
                <div dir="ltr" className="bg-black text-[#00FF41] p-4 relative">
                   <span className="absolute top-0 right-0 bg-white text-black font-mono text-[10px] font-bold px-2 border-b border-l border-black">IMAGE / POSTER PROMPT</span>
                   <p className="text-xs font-mono whitespace-pre-wrap">{sec.image_prompt}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-[#f2f2f2] p-4 border border-[#00000033]">
                      <span className="font-mono text-[10px] font-bold block opacity-50 mb-1" dir="ltr">TEXT OVERLAY</span>
                      <h3 className="font-bold text-lg leading-tight mb-2">{sec.text_overlay?.headline}</h3>
                      <p className="text-xs opacity-80 mb-2">{sec.text_overlay?.subtext}</p>
                      <span className="text-[10px] bg-black text-white px-1 font-mono uppercase">{sec.text_overlay?.position}</span>
                   </div>
                   <div className="flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold block opacity-50 mb-1" dir="ltr">CONTENT</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{sec.content}</p>
                      </div>
                      <div className="mt-4">
                        <button className="bg-black text-white font-bold py-2 px-4 shadow-[2px_2px_0_#00FF41] font-mono text-sm border-2 border-black inline-block">{sec.cta_text || "اطلب الآن"}</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {!hideNext && (
        <div className="min-h-24 py-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between px-8 bg-[#f2f2f2] mt-10 gap-4 printable-hide">
          {onRebuild ? (
            <button 
              onClick={onRebuild}
              className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <RotateCw size={18} />
              <span>إعادة بناء هذه المرحلة (Phase 3) 🔄</span>
            </button>
          ) : (
            <div className="font-display font-bold text-xl uppercase tracking-tighter">اكتملت الصفحة (المرحلة 3). ننتقل إلى Video Workflow (المرحلة 4)؟</div>
          )}
          <button onClick={onNext} className="px-10 py-4 bg-black text-white font-display font-bold text-lg uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#00FF41] transition-all flex items-center gap-3 shrink-0 ml-auto">اعتماد <ArrowRight size={20} className="rotate-180" /></button>
        </div>
      )}
    </motion.div>
  );
}


export function Phase4View({ data, onNext, hideNext = false, onRebuild }: { data: Phase4_VideoWorkflow; onNext?: () => void; hideNext?: boolean; onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 4.</div>;
  const getSceneCopyText = (scene: any) => {
    return `SCENE: ${scene.sceneName}
${scene.duration} | ${scene.emotion} | ROLE: ${scene.narrativeRole}

[VISUALS & MOTION]
Debut: ${scene.debutPromptEN}
Fin: ${scene.finPromptEN}
Motion: ${scene.animationPromptEN}

[NARRATION (FUSHA)]
${scene.narrationFusha}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-12 pt-4 pb-12">
       <div className="mb-10 pb-6 border-b-2 border-black">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black flex items-center gap-4">مخطط إعلانات الفيديو الفيروسية</h2>
        <p className="font-mono text-sm font-bold uppercase mt-4 opacity-50" dir="ltr">Phase 04 // Viral UGC Video Builder</p>
      </div>

      {/* Character Sheet */}
      <div className="border-4 border-black bg-white shadow-[8px_8px_0_#000000] break-inside-avoid">
         <div className="bg-black text-white p-4 font-mono font-bold uppercase flex justify-between items-center" dir="ltr">
            <span>4A - CHARACTER SHEET </span>
            <span className="text-[#00FF41]">SEED: {data.characterSheet.seed}</span>
         </div>
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <span className="text-[10px] font-mono font-bold opacity-50 block mb-2" dir="ltr">CHARACTER DESCRIPTION</span>
               <p className="text-base font-bold leading-relaxed border-s-4 border-[#00FF41] ps-4">{data.characterSheet.description}</p>
            </div>
            <div dir="ltr" className="relative group">
               <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={data.characterSheet.promptEN} />
               </div>
               <span className="text-[10px] font-mono font-bold opacity-50 block mb-2" dir="ltr">AI GENERATOR PROMPT</span>
               <p className="text-xs font-mono bg-[#f2f2f2] border border-[#00000033] p-4">{data.characterSheet.promptEN}</p>
            </div>
         </div>
      </div>

      {/* Scenes */}
      <div className="space-y-4 mt-8 break-inside-avoid">
         <div className="bg-black text-white p-4 font-mono font-bold uppercase" dir="ltr">
            4B - 5 SCENES TEMPLATE
         </div>
      </div>
      <div className="space-y-4">
         {data.scenes?.map((scene, idx) => (
            <div key={idx} className="border-2 border-black bg-white p-6 relative group/scene break-inside-avoid">
               <div className="absolute top-2 right-2 opacity-0 group-hover/scene:opacity-100 transition-opacity z-10">
                  <CopyButton text={getSceneCopyText(scene)} />
               </div>
               <div className="flex gap-4 items-center mb-6 border-b-2 border-black pb-4">
                  <div className="w-12 h-12 bg-[#00FF41] border-2 border-black flex items-center justify-center font-display font-black text-2xl" dir="ltr">{idx+1}</div>
                  <div>
                     <h3 className="font-display font-black text-xl uppercase tracking-wider">{scene.sceneName}</h3>
                     <span className="font-mono text-xs font-bold" dir="ltr">{scene.duration} | {scene.emotion} | ROLE: {scene.narrativeRole}</span>
                  </div>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="ltr">
                  <div>
                    <span className="font-mono text-[10px] font-bold block mb-1">DÉBUT IMAGE</span>
                    <p className="text-[11px] bg-[#f2f2f2] border border-black p-2 min-h-16 pr-8">{scene.debutPromptEN}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold block mb-1">FIN IMAGE</span>
                    <p className="text-[11px] bg-[#f2f2f2] border border-black p-2 min-h-16 pr-8">{scene.finPromptEN}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold block mb-1 text-[#00FF41] bg-black px-1 w-max">MOTION PROMPT</span>
                    <p className="text-[12px] bg-white border-2 border-black p-2 font-bold min-h-16 pr-8">{scene.animationPromptEN}</p>
                  </div>
               </div>
               <div className="mt-6 p-4 bg-[#0000000D] text-black">
                  <span className="font-mono text-[10px] font-bold block mb-1 opacity-50" dir="ltr">SCENE NARRATION FUSHA</span>
                  <p className="font-bold text-lg">"{scene.narrationFusha}"</p>
               </div>
            </div>
         ))}
      </div>

      {/* Voice Over Script */}
      <div className="border-4 border-black bg-white shadow-[8px_8px_0_#00FF41] relative group mt-8 break-inside-avoid">
         <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={data.voiceOverScript.fullText} />
         </div>
         <div className="bg-black text-[#00FF41] p-4 font-mono font-bold uppercase flex justify-between items-center" dir="ltr">
            <span>4C - SCRIPT VOIX-OFF (DARIJA DZ)</span>
         </div>
         <div className="p-8 space-y-6">
            <p className="text-xl font-bold font-display leading-loose border-s-4 border-black ps-6">{data.voiceOverScript.fullText}</p>
            <div className="bg-[#f2f2f2] p-4 border border-black">
               <span className="font-mono text-[10px] font-bold block mb-2 opacity-50" dir="ltr">RECORDING TIPS:</span>
               <ul className="list-disc list-inside text-sm font-bold space-y-1">
                 {data.voiceOverScript.recordingTips.map((tip, i) => <li key={i}>{tip}</li>)}
               </ul>
            </div>
         </div>
      </div>

      {!hideNext && (
        <div className="min-h-24 py-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between px-8 bg-[#f2f2f2] mt-10 gap-4 printable-hide">
          {onRebuild ? (
            <button 
              onClick={onRebuild}
              className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <RotateCw size={18} />
              <span>إعادة بناء هذه المرحلة (Phase 4) 🔄</span>
            </button>
          ) : (
            <div className="font-display font-bold text-xl uppercase tracking-tighter">اكتملت المرحلة 4. هل نتابع استراتيجية الإعلانات (المرحلة 5)؟</div>
          )}
          <button onClick={onNext} className="px-10 py-4 bg-black text-white font-display font-bold text-lg uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#00FF41] transition-all flex items-center gap-3 shrink-0 ml-auto">
            اعتماد <ArrowRight size={20} className="rotate-180" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function Phase5View({ data, onNext, hideNext = false, onRebuild }: { data: Phase5_MetaAdsStrategy; onNext?: () => void; hideNext?: boolean; onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 5.</div>;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8 pt-4 pb-12">
      <div className="mb-10 pb-6 border-b-2 border-black">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black">استراتيجية الإطلاق على ميتا</h2>
        <p className="font-mono text-sm font-bold uppercase mt-4 opacity-50" dir="ltr">Phase 05 // Meta Ads Launchpad (DZ Market)</p>
      </div>
      
      <div className="bg-[#f2f2f2] p-6 border-2 border-black space-y-6">
        <h3 className="font-bold border-b-2 border-black pb-2">هيكل الحملة (Campaign Structure)</h3>
        <p className="text-sm">{data.campaignStructure?.overview}</p>
        <p className="text-sm"><strong>Advantage+:</strong> {data.campaignStructure?.advantagePlus}</p>
        <p className="text-sm"><strong>ABO Test:</strong> {data.campaignStructure?.aboTest}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border-2 border-black">
            <h3 className="font-bold mb-3">زوايا الإعلان (Ad Angles)</h3>
            <p className="text-sm">{data.anglesTesting?.statutVsConfort}</p>
            <p className="text-sm mt-3">{data.anglesTesting?.painVsDesire}</p>
          </div>
          <div className="bg-white p-6 border-2 border-black">
            <h3 className="font-bold mb-3">الاستهداف (Targeting)</h3>
            <p className="text-sm"><strong>Broad:</strong> {data.targetingDZ?.broad}</p>
            <p className="text-sm mt-3"><strong>Narrow:</strong> {data.targetingDZ?.narrow}</p>
          </div>
      </div>
      
      <div className="bg-black text-[#00FF41] p-6 border-2 border-black">
        <h3 className="font-bold mb-3">الـ KPIs المستهدفة</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
            <div><span className="block text-xs opacity-50">CTR</span><span className="font-bold">{data.kpis?.ctr}</span></div>
            <div><span className="block text-xs opacity-50">CPC</span><span className="font-bold">{data.kpis?.cpc}</span></div>
            <div><span className="block text-xs opacity-50">CVR</span><span className="font-bold">{data.kpis?.cvr}</span></div>
        </div>
      </div>

      {data.bulkLauncher && (
        <div className="bg-[#fbfcfa] border-2 border-black p-6 md:p-8 neo-shadow relative pr-12">
           <div className="absolute top-0 right-0 bg-black text-[#00FF41] font-mono text-xs font-black uppercase px-3 py-1">
             BULK LAUNCHER EXPRESS v1.0
           </div>
           
           <h3 className="text-xl font-bold uppercase mb-4 border-b-2 border-black pb-2">Launch Brief ({data.bulkLauncher.mode})</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
             <div className="border border-black p-3 bg-white">
               <span className="block text-xs text-gray-500 uppercase font-bold">Budget</span>
               <span className="font-mono text-lg">{data.bulkLauncher.budget}</span>
             </div>
             <div className="border border-black p-3 bg-white">
               <span className="block text-xs text-gray-500 uppercase font-bold">Path</span>
               <span className="font-mono text-lg">{data.bulkLauncher.path}</span>
             </div>
             <div className="border border-black p-3 bg-white">
               <span className="block text-xs text-gray-500 uppercase font-bold">Template</span>
               <span className="font-mono text-lg">{data.bulkLauncher.template}</span>
             </div>
             <div className="border border-black p-3 bg-white">
               <span className="block text-xs text-gray-500 uppercase font-bold">GEO</span>
               <span className="font-mono text-lg">{data.bulkLauncher.geo}</span>
             </div>
           </div>

           <div className="mb-6">
              <h4 className="font-bold uppercase text-sm mb-2">Structure</h4>
              <div className="bg-black text-white p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                 {data.bulkLauncher.structureVisual?.map((line, idx) => (
                   <div key={idx}>{line}</div>
                 ))}
              </div>
           </div>

           <div>
              <h4 className="font-bold uppercase text-sm mb-2">Targeting rules</h4>
              <div className="border-l-4 border-black pl-3 py-1 text-sm bg-gray-100 italic">
                 {data.bulkLauncher.targetingSummary}
              </div>
           </div>
        </div>
      )}

      {!hideNext && (
        <div className="min-h-24 py-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between px-8 bg-[#f2f2f2] mt-10 gap-4 printable-hide">
          {onRebuild ? (
            <button 
              onClick={onRebuild}
              className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <RotateCw size={18} />
              <span>إعادة بناء هذه المرحلة (Phase 5) 🔄</span>
            </button>
          ) : (
            <div className="font-display font-bold text-xl uppercase tracking-tighter">اكتملت المرحلة 5. هل نتابع نظام التوسع (المرحلة 6)؟</div>
          )}
          <button onClick={onNext} className="px-10 py-4 bg-black text-white font-display font-bold text-lg uppercase tracking-wider border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_#00FF41] transition-all flex items-center gap-3 shrink-0 ml-auto">
            اعتماد <ArrowRight size={20} className="rotate-180" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function Phase6View({ data, onNext, hideNext, onRebuild }: { data: Phase6_ScalingSystem, onNext?: () => void, hideNext?: boolean, onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 6.</div>;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8 pt-4 pb-12">
      <div className="mb-10 pb-6 border-b-2 border-black">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black">آلة التوسع والربحية</h2>
        <p className="font-mono text-sm font-bold uppercase mt-4 opacity-50" dir="ltr">Phase 06 // The Growth & Scaling Machine</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 border-2 border-black">
          <h3 className="font-black text-xl uppercase mb-3">خطة الاختبار (7 Days)</h3>
          <p className="text-sm leading-relaxed">{data.testingPlan7Days}</p>
        </div>
        <div className="bg-[#f2f2f2] p-6 border-2 border-black">
          <h3 className="font-black text-xl uppercase mb-3">استراتيجية التوسع (Scaling)</h3>
          <p className="text-sm leading-relaxed">{data.scalingWinners}</p>
        </div>
        <div className="bg-white p-6 border-2 border-black">
           <h3 className="font-black text-xl uppercase mb-3">تطوير الإعلانات</h3>
           <p className="text-sm leading-relaxed">{data.creativeIterations}</p>
        </div>
        <div className="bg-[#00FF41] p-6 border-2 border-black">
           <h3 className="font-black text-xl uppercase mb-3 text-black">استراتيجية الإيقاف (Kill Strategy)</h3>
           <p className="text-sm font-bold text-black leading-relaxed">{data.killStrategy}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t-2 border-black/10 mt-8 print-hide">
        {onRebuild && (
          <button 
            onClick={onRebuild}
            className="border-2 border-black bg-white hover:bg-[#f2f2f2] text-black px-6 py-4 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            <RotateCw size={18} />
            <span>إعادة بناء هذه المرحلة (Phase 6) 🔄</span>
          </button>
        )}
        {!hideNext && onNext && (
          <button onClick={onNext} className="bg-black text-[#00FF41] hover:bg-[#00FF41] hover:text-black hover:border-black font-bold uppercase tracking-widest px-8 py-4 border-2 border-transparent transition-all ml-auto">
            توليد مولد الإعلانات (Phase 7) →
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Phase7View_AdGenerator({ data, onRebuild }: { data: Phase7_AdGenerator, onRebuild?: () => void }) {
  if (!data) return <div className="p-8 text-center font-mono opacity-50">لا توجد بيانات متاحة للمرحلة 7.</div>;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 pt-4 pb-12">
      <div className="mb-10 pb-6 border-b-2 border-black">
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-black flex items-center gap-4">مولد الإعلانات والكوبي رايتنج</h2>
        <p className="font-mono text-sm font-bold uppercase mt-4 opacity-50" dir="ltr">Ad Creatives & Copywriting Output</p>
      </div>

      <div className="bg-white border-2 border-black p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f2f2f2] p-4 border-2 border-black">
            <h3 className="font-bold underline mb-3 text-lg">دوافع الشراء النفسية:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.analysis?.psychologicalTriggers?.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
          </div>
          <div className="bg-[#f2f2f2] p-4 border-2 border-black">
            <h3 className="font-bold underline mb-3 text-lg">أبرز المشاكل (Pain Points):</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.analysis?.painPoints?.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
          </div>
          <div className="bg-[#f2f2f2] p-4 border-2 border-black">
            <h3 className="font-bold underline mb-3 text-lg">أخطاء المنافسين:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.analysis?.competitorMistakes?.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
          </div>
          <div className="bg-[#f2f2f2] p-4 border-2 border-black">
            <h3 className="font-bold underline mb-3 text-lg">زوايا مستهلكة (للتجنب):</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.analysis?.commonAngles?.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#00FF41] border-2 border-black p-6 shadow-[6px_6px_0_#000]">
        <h3 className="text-3xl font-display font-black uppercase mb-2">🔥 الزاوية المبتكرة (Unique Angle)</h3>
        <p className="text-xl font-bold bg-white p-3 border-2 border-black inline-block mb-3">{data.uniqueAngle.title}</p>
        <p className="text-lg font-medium">{data.uniqueAngle.description}</p>
      </div>

      <div className="mt-8">
        <SaaSComplianceAuditor 
          phaseName="مستشار الجودة والامتثال - تدقيق الكوبي رايتنج المولد" 
          initialText={data.adIdeas?.[0]?.copywriting || ""} 
        />
      </div>

      <h3 className="text-4xl font-display font-black mt-12 mb-6">5 أفكار إعلانية مبنية على التحليل:</h3>
      
      <div className="space-y-10">
        {data.adIdeas?.map((idea, idx) => (
          <div key={idx} className="bg-white border-2 border-black relative group/brief">
            <div className="absolute top-2 right-2 opacity-0 group-hover/brief:opacity-100 transition-opacity z-10">
              <CopyButton text={`HOOK: ${idea.hook}\n\nCOPYWRITING:\n${idea.copywriting}\n\nCREATIVE:\n${idea.creativeDirection}\n\nCTA: ${idea.cta}`} />
            </div>
            
            <div className="bg-black text-white p-4 border-b-2 border-black flex items-center justify-between">
              <h4 className="font-bold text-xl uppercase">Idea {idx + 1}</h4>
              <span className="bg-[#00FF41] p-1 px-3 text-black text-sm font-bold border-2 border-black">سبب النجاح: {idea.successReason}</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="border-r-4 border-black pr-4">
                <span className="block font-bold text-lg mb-2 underline decoration-2 decoration-[#00FF41]">🎯 Hook:</span>
                <p className="text-2xl font-bold text-black">{idea.hook}</p>
                <div className="mt-3 bg-[#f2f2f2] p-3 text-sm italic">
                  <span className="font-bold block mb-1">Variations:</span>
                  <ul className="list-disc list-inside">
                    {idea.variations?.map((v, i) => <li key={i}>{v}</li>)}
                  </ul>
                </div>
              </div>

              <div>
                <span className="block font-bold mb-2">📝 Copywriting:</span>
                <p className="whitespace-pre-wrap font-medium bg-[#f2f2f2] p-4 border-2 border-black">{idea.copywriting}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <span className="block font-bold mb-2">🎬 Creative / Video Direction:</span>
                  <p className="text-sm p-4 border border-black">{idea.creativeDirection}</p>
                </div>
                <div className="shrink-0 md:w-64">
                   <span className="block font-bold mb-2">🔴 CTA:</span>
                   <p className="text-center font-bold bg-black text-[#00FF41] p-4">{idea.cta}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {onRebuild && (
        <div className="flex justify-start pt-6 border-t-2 border-black/10 mt-8 print-hide">
          <button 
            onClick={onRebuild}
            className="border-2 border-black bg-white hover:bg-gray-100 text-black px-6 py-4 font-bold text-sm uppercase flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            <RotateCw size={18} />
            <span>إعادة بناء هذه المرحلة (Phase 7) 🔄</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

// MARKETING MASTER AI Quality & B2B Compliance Auditor Component (Algeria 2026 Strategy)
export function SaaSComplianceAuditor({ initialText = '', phaseName = '' }: { initialText?: string; phaseName?: string }) {
  const [copyToAudit, setCopyToAudit] = useState(
    initialText || "عرض خاص ومحدود بالجزائر: حزام الظهر الطبي الفاخر للتخلص من الآلام نهائياً وبدون تعب! التوصيل متوفر لـ 58 ولاية والدفع بعد معاينة وفحص الطلب ببلدية الإقامة. اطلب الآن مباشرة للاستفادة من تخفيض اليوم!"
  );
  const [strictMode, setStrictMode] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Computed metrics live checkers
  const hasEnglish = /[a-zA-Z]/g.test(copyToAudit);
  const hasDelivery = /التوصيل|توصيل/g.test(copyToAudit);
  const hasWilayas = /ولاية|الولايات/g.test(copyToAudit);
  const hasCod = /الدفع|الاستلام|دفع|استلام/g.test(copyToAudit);
  const hasGuarantee = /ضمان|مضمون|كفالة/g.test(copyToAudit);
  const hasCta = /اطلب|احصل|اشتري|سجل|طلب/g.test(copyToAudit);
  const isTooShort = copyToAudit.trim().length < 40;

  // Compute stats logic
  let score = 100;
  const warningsList: string[] = [];
  const passesList: string[] = [];

  if (hasEnglish) {
    score -= strictMode ? 25 : 15;
    warningsList.push("تم العثور على أحرف إنجليزية/لاتينية! يفضل فِيسْ بُوك استخدام نصوص عربية مبنية لعدسات السوق الجزائري COD لتسهيل القبول والحفاظ على جودة الأداء.");
  } else {
    passesList.push("الامتثال اللغوي التام: خالٍ من اللاتينية والإنجليزية والمصطلحات الدخيلة 💯");
  }

  if (hasDelivery) {
    passesList.push("توضيح توفر خدمة الشحن والتوصيل المحلي 🚚");
  } else {
    score -= 15;
    warningsList.push("لم نجد ذكر لمصطلح 'التوصيل'. المستهلك الجزائري يبحث دائماً أولاً عن آلية التوصيل وطريقته.");
  }

  if (hasWilayas) {
    passesList.push("إدراج تغطية الولايات الـ 58 (Wilayas Breakdown) دال على الجدية الاحترافية 🗺️");
  } else {
    score -= 15;
    warningsList.push("لم تذكر تغطية 'الولايات الـ 58' أو كامل الولايات الوطنية بالجزائر، مما يخفض بشكل ملموس نسب التحويل (CTR).");
  }

  if (hasCod) {
    passesList.push("توطيد الأمان بذكر التعهد بالدفع عند الاستلام بالدينار (COD Algeria Mode) 💰");
  } else {
    score -= 20;
    warningsList.push("غاب مصطلح 'الدفع عند الاستلام'. ثقة المشتري الجزائري تزيد بنسبة 85% عند رؤية هذا التعهد صراحة.");
  }

  if (hasGuarantee) {
    passesList.push("بناء الثقة بتقديم ضمان الجودة وفحص السلعة قبل الدفع 🛡️");
  } else {
    score -= 10;
    warningsList.push("يستحسن إضافة 'ضمان الجودة' أو فحص السلعة في شروط الإرسال لتجنب رفض الاستلام وارتجاع الطرود.");
  }

  if (hasCta) {
    passesList.push("دعوة واضحة للمباشرة واتخاذ القرار الفوري بالشراء (CTA Catalyst) 🔥");
  } else {
    score -= 15;
    warningsList.push("لم نجد صيغة أمر مباشر واضحة (مثل: اطلب الآن، احصل عليه اليوم، املأ الاستمارة الآن بشكل مباشر).");
  }

  if (isTooShort) {
    score -= 10;
    warningsList.push("النص غاية في القصر. يفضل توسيع الشرح لبيان زوايا المنافع والألم قبل الدعوة للشراء.");
  }

  const finalScore = Math.max(10, score);

  const handleRunAudit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResult(true);
    }, 1200);
  };

  return (
    <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-5 break-inside-avoid" dir="rtl">
      
      {/* Visual top indicator banner */}
      <div className="border-b border-black pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <span className="text-[9px] font-mono font-black bg-black text-[#00FF41] px-2 py-0.5 rounded-sm uppercase tracking-wide inline-block mb-1">
            {phaseName || "نظام الفحص الاستراتيجي الآلي للامتثال والنوعية"}
          </span>
          <h4 className="text-sm font-black text-black flex items-center gap-1.5">
            <span>🛡️ مدقق الامتثال التسويقي وجودة الكوبي رايتنج (MARKETING MASTER AI Quality Auditor)</span>
          </h4>
          <p className="text-[10px] text-gray-400 mt-1 font-bold leading-relaxed">
            محاكي ذكي يفحص تركيب النصوص والخطافات التسويقية استناداً لقواعد الامتثال بالجزائر لعام 2026.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-50 border border-black text-[10px] font-black shrink-0">
          <span className="cursor-pointer select-none">تشغيل الفحص الصارم (Meta Algeria):</span>
          <input 
            type="checkbox" 
            checked={strictMode} 
            onChange={(e) => setStrictMode(e.target.checked)}
            className="w-3.5 h-3.5 accent-black cursor-pointer" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Input box */}
        <div className="md:col-span-7 space-y-2">
          <span className="text-[10px] font-bold text-gray-400 block">📝 عدل نص الكوبي رايتنج أو الصق النص الذي ترغب في فحصه:</span>
          <textarea
            className="w-full h-36 p-3 border-2 border-black font-sans text-xs bg-gray-50 text-black font-semibold leading-relaxed"
            value={copyToAudit}
            onChange={(e) => {
              setCopyToAudit(e.target.value);
              setShowResult(false);
            }}
            placeholder="اكتب بالدارجة أو الفصحى نص إعلانك..."
          />
          <button 
            onClick={handleRunAudit}
            disabled={analyzing}
            className="w-full py-2 bg-black hover:bg-neutral-800 text-[#00FF41] font-black border border-black uppercase text-xs flex items-center justify-center gap-1.5"
          >
            {analyzing ? (
              <>
                <RotateCw size={13} className="animate-spin text-[#00FF41]" />
                <span>جاري تحليل النص ومراجعة القواعد...</span>
              </>
            ) : (
              <span>🔍 تدقيق الكوبي رايتنج وتحليل معايير الامتثال</span>
            )}
          </button>
        </div>

        {/* Audit outputs cabinet */}
        <div className="md:col-span-5 bg-neutral-50 border border-neutral-300 p-4 relative overflow-hidden flex flex-col justify-between">
          
          {analyzing && (
            <div className="absolute inset-0 bg-white/85 flex items-center justify-center z-10">
              <div className="p-3 border border-black bg-white flex items-center gap-2 font-mono font-bold text-[10px]">
                <RotateCw size={14} className="animate-spin text-black" />
                <span>تحليل التركيب وقواعد COD الجزائر...</span>
              </div>
            </div>
          )}

          {!showResult && !analyzing ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 my-auto">
              <span className="text-3xl">🔬</span>
              <p className="font-black text-black text-[11px]">في انتظار تشغيل فحص الملاءمة</p>
              <p className="text-[10px] text-gray-400 font-bold">انقر على زر الفحص بالأسفل لاحتساب نقاط الموثوقية آلياً.</p>
            </div>
          ) : (
            <div className="space-y-3.5 animate-fade-in text-[11px]">
              
              <div className="flex justify-between items-center border-b pb-1.5">
                <span className="text-[10px] font-black text-gray-500 uppercase">نتائج المطابقة الإجمالية</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[10px]">الدرجة:</span>
                  <span className={`p-0.5 px-2 text-white text-xs font-black border border-black font-mono ${finalScore >= 80 ? 'bg-green-600' : finalScore >= 50 ? 'bg-amber-500' : 'bg-red-650'}`}>
                    {finalScore} / 100
                  </span>
                </div>
              </div>

              {/* Passes */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-green-700 block">🟢 قواعد مستوفاة بنجاح ({passesList.length}):</span>
                {passesList.length === 0 ? (
                  <p className="text-[9px] text-gray-450 italic">لم نجد أي حافز متطابق في الجمل الحالية.</p>
                ) : (
                  <div className="max-h-[80px] overflow-y-auto space-y-0.5">
                    {passesList.map((p, i) => (
                      <div key={i} className="text-[9px] font-black text-emerald-700 bg-green-50/50 p-1 border border-green-200 flex items-center gap-1">
                        <span>✓</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warnings */}
              <div className="space-y-1 border-t border-dashed pt-2">
                <span className="text-[9px] font-black text-red-700 block">🚨 تنبيهات وملاحظات المستشار ({warningsList.length}):</span>
                {warningsList.length === 0 ? (
                  <div className="text-[9.5px] font-black text-emerald-800 bg-green-50 p-1.5 border border-green-200">
                    تهانينا الحارة! النص الإعلاني مطابق وقابل للاستخدام بنسبة 100% لخوض السوق الجزائري. 🎉
                  </div>
                ) : (
                  <div className="max-h-[80px] overflow-y-auto space-y-1">
                    {warningsList.map((w, i) => (
                      <div key={i} className="text-[9px] text-red-800 bg-red-50/50 p-1 border border-red-200 flex items-start gap-1">
                        <span className="text-red-500 font-black">•</span>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
