import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  Play, 
  Layers, 
  Target, 
  TrendingUp, 
  FileText, 
  Video, 
  DollarSign, 
  Percent, 
  Users, 
  Smartphone, 
  ShieldCheck, 
  Zap,
  ChevronDown
} from 'lucide-react';

interface SaaSPublicLandingProps {
  onGoToAuth: (isLogin: boolean) => void;
}

export function SaaSPublicLanding({ onGoToAuth }: SaaSPublicLandingProps) {
  // Simulator State Variables for Algerian COD (ROI Forecast Engine)
  const [roiAdsSpend, setRoiAdsSpend] = useState<number>(15000); // DZD
  const [roiSourcingCost, setRoiSourcingCost] = useState<number>(1300); // DZD
  const [roiSalePrice, setRoiSalePrice] = useState<number>(4500); // DZD
  const [roiDeliveryRate, setRoiDeliveryRate] = useState<number>(68); // %
  const [roiShippingFee, setRoiShippingFee] = useState<number>(750); // DZD
  const [roiConfirmFee, setRoiConfirmFee] = useState<number>(150); // DZD
  const [roiReturnPenalty, setRoiReturnPenalty] = useState<number>(450); // DZD
  const [roiCpa, setRoiCpa] = useState<number>(900); // DZD

  // Interactive FAQ state
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // ROI Calculator Calculations
  const calculatedOrders = Math.floor(roiAdsSpend / (roiCpa || 1));
  const confirmedOrders = Math.floor(calculatedOrders * 0.9); // Assumption: 90% confirmation
  const deliveredOrders = Math.floor(confirmedOrders * (roiDeliveryRate / 100));
  const returnedOrders = confirmedOrders - deliveredOrders;

  // Revenues & Expenses in DZD
  const totalRevenue = deliveredOrders * roiSalePrice;
  const totalSourcingCost = confirmedOrders * roiSourcingCost; 
  const totalShippingCost = (deliveredOrders * roiShippingFee) + (returnedOrders * roiReturnPenalty);
  const totalConfirmCost = confirmedOrders * roiConfirmFee;
  const totalExpenses = roiAdsSpend + totalSourcingCost + totalShippingCost + totalConfirmCost;
  
  const netProfit = totalRevenue - totalExpenses;
  const roiPercentage = totalExpenses > 0 ? ((netProfit / totalExpenses) * 100).toFixed(1) : '0';

  const faqItems = [
    {
      q: "ما هي منصة MARKETING MASTER وبماذا تختلف عن المولدات التقليدية؟",
      a: "منصة MARKETING MASTER هي نظام ذكي متكامل مصمم خصيصاً لسوق التجارة الإلكترونية الجزائري والدفع عند الاستلام (COD). على عكس المنصات العامة، نحن نوفر 5 مراحل متتالية تبدأ من التحليل النفسي الدقيق للمنتج ومخاوف الزبون الجزائري، مروراً بإنشاء برومبتات صور مخصصة، خطط استهداف فيسبوك للمدن والولايات الجزائرية، بناء هيكل صفحات الهبوط عالية التحويل (CRO)، وانتهاءً بكتابة سيناريوهات الفيديوهات بالدارجة الجزائرية وتدقيق الجودة."
    },
    {
      q: "هل تعمل المنصة على أي منتج أو فكرة؟",
      a: "نعم، تماماً! يمكنك ببساطة إدخال اسم المنتج، وسعره، والفئة المستهدفة، أو حتى رفع صورة حية للمنتج. سيقودك محلل الذكاء الاصطناعي خطوة بخطوة للوصول للتقارير الكاملة الجاهزة للتطبيق الفوري ببلادنا."
    },
    {
      q: "كيف يتم ربح المبيعات والدفع عبر بريدي موب (BaridiMob)؟",
      a: "نوفر خطة مجانية تتيح لك تجربة المنصة بمرونة تامة. للترقية والحصول على عدد غير محدود من التحليلات وبناء المشاريع واستخدام المميزات المتقدمة كربط الـ Webhooks وإدارة الفرق، يمكنك الدفع بسهولة محلياً بالجزائر عبر تطبيق بريدي موب المعتمد لتفعيل اشتراكك الفوري."
    },
    {
      q: "ما هو معدل التحويل المتوقع باستعمال استراتيجيات MARKETING MASTER؟",
      a: "بفضل التركيز على سد ثغرات صفحات الهبوط والزوايا النفسية المخصصة للمستهلك الجزائري (مثل زاوية Confort/Mobilité أو زاوية Prestige)، يرتفع معدل التحويل المعتاد في صفحات الهبوط من 1.5% إلى أكثر من 3.8%، مع خفض ملحوظ في تكلفة الاقتناء (CPA)."
    },
    {
      q: "هل يمكنني إخفاء شعار المنصة من التقارير عند إرسالها للعملاء؟",
      a: "نعم! ميزة White Label المتاحة لأصحاب خطط المبيعات والوكالات تسمح لك بمسح كامل لعلامتنا المائية وإشارات MARKETING MASTER، واستبدالها بشعار وكالتك، ونطاقك المخصص لتظهر بمظهر احترافي فخم أمام عملائك بالجزائر."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-[#00FF41] selection:text-black overflow-x-hidden" dir="rtl">
      
      {/* 1. Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-3 border-black px-4 py-3 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black flex items-center justify-center font-black text-[#00FF41] text-lg border-2 border-black rotate-3">
            M
          </div>
          <span className="font-sans font-black text-xl tracking-tighter text-black">
            MARKETING MASTER <span className="text-[10px] bg-[#00FF41] px-1 py-0.5 border border-black font-bold mr-1.5 rounded-sm">SAAS</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-black">
          <a href="#features" className="hover:text-amber-500 transition-colors">مراحل المنصة</a>
          <a href="#simulator" className="hover:text-amber-500 transition-colors">محاكي الأرباح والتكلفة</a>
          <a href="#pricing" className="hover:text-amber-500 transition-colors">الخطط والأسعار</a>
          <a href="#faq" className="hover:text-amber-500 transition-colors">الأسئلة الشائعة</a>
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          <span className="text-gray-400 font-mono text-xs">ALG-2026 EDITION</span>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onGoToAuth(true)} 
            className="px-4 py-2 border-2 border-transparent hover:border-black font-bold text-xs md:text-sm text-black transition-all"
          >
            تسجيل الدخول
          </button>
          
          <button 
            onClick={() => onGoToAuth(false)} 
            className="px-5 py-2.5 bg-black text-[#00FF41] hover:bg-[#00FF41] hover:text-black border-2 border-black font-black text-xs md:text-sm shadow-[3px_3px_0_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            التسجيل مجاناً 🚀
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative py-20 px-4 md:px-12 lg:px-24 bg-white border-b-3 border-black overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Info */}
          <div className="lg:col-span-7 text-right space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#00FF41]/10 text-green-900 border border-black/15 px-3 py-1 text-xs font-bold font-mono">
              <Zap size={14} className="text-green-600 shrink-0" />
              <span>أول منصة ذكاء اصطناعي متكاملة للتجارة الإلكترونية COD بالجزائر</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-black leading-[1.12] tracking-tighter">
              حوّل أي منتج إلى <span className="underline decoration-[#00FF41] decoration-8">حملة إعلانية رابحة</span> في دقائق!
            </h1>
            
            <p className="text-sm md:text-base text-gray-600 font-bold leading-relaxed max-w-2xl">
              لا تخمّن زوايا البيع بعد اليوم. يقوم محرك <span className="text-black font-extrabold">MARKETING MASTER</span> بتحليل منتجك نفسياً، وتوليد برومبتات الصور الإعلانية الفخمة، وخطط استعراض الفيسبوك وتحديد الجمهور الجزائري بدقة، وصناعة صفحة هبوطCRO احترافية مع سكريبتات فيديو بالدارجة الجزائرية الفصحى.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button 
                onClick={() => onGoToAuth(false)}
                className="px-8 py-4 bg-[#00FF41] text-black font-black text-lg border-3 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1-translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>ابدأ مجاناً الآن وصمم حملتك الأولى</span>
                <ArrowRight size={20} className="rotate-180" />
              </button>
              
              <a 
                href="#simulator"
                className="px-6 py-4 bg-white hover:bg-neutral-50 text-black border-3 border-black font-bold text-center text-sm transition-all"
              >
                المحاكاة المالية للتجارة 🤑
              </a>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-dashed border-black/10 text-right">
              <div>
                <span className="block text-xl md:text-3xl font-black tracking-tight text-black">+4,500</span>
                <span className="text-xs text-gray-500 font-bold">مشاريع إعلانية ناجحة</span>
              </div>
              <div>
                <span className="block text-xl md:text-3xl font-black tracking-tight text-[#00FF41] bg-black px-2 py-0.5 inline-block border border-black">+3.8%</span>
                <span className="text-xs text-gray-500 font-bold block mt-1">متوسط زيادة معدل الطلب CTR</span>
              </div>
              <div>
                <span className="block text-xl md:text-3xl font-black tracking-tight text-black">58 ولاية</span>
                <span className="text-xs text-gray-500 font-bold">مستهدفة ومدرجة كاملة</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border-3 border-black p-4 md:p-6 shadow-[14px_14px_0_rgba(0,0,0,1)] relative z-10 space-y-4">
              {/* Header inside mockup */}
              <div className="flex justify-between items-center pb-3 border-b border-black/10">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black" />
                </div>
                <div className="bg-gray-100 border border-black px-3 py-0.5 font-mono text-[9px] font-bold text-gray-500">
                  MARKETING_INTEL_ENGINE
                </div>
              </div>

              {/* Mockup content */}
              <div className="space-y-3 font-sans">
                {/* Product Intelligence Sample info */}
                <div className="bg-[#00FF41]/5 border-2 border-black p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-black">حزام الظهر الطبي الفاخر</span>
                    <span className="bg-[#00FF41] text-black border border-black text-[9px] font-bold px-1">مؤهل للشحن 🚀</span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-bold leading-normal">
                    الزاوية النفسية الموصى بها: <span className="text-black underline font-black">Confort [راحة وموثوقية]</span>
                  </p>
                </div>

                {/* Checklist steps block */}
                <div className="space-y-1.5 text-xs text-black font-bold">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 border border-black/10">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>تحليل USP ونقاط الضعف والمبيعات المتوقعة</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 border border-black/10">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>توليد برومبتات Midjourney بالخطاط العربي</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 border border-black/10">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>خطة الإطلاق والـ Testing لـ 7 أيام في الجزائر</span>
                  </div>
                </div>

                {/* Interactive Simulation output teaser */}
                <div className="bg-black text-white p-3 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between text-[#00FF41] font-bold">
                    <span>CPA المستهدف:</span>
                    <span>750 دج (Target)</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>نسبة التوصيل المقدرة:</span>
                    <span>65% - 75% بمراكز يالادين</span>
                  </div>
                </div>
              </div>

              {/* CTA trigger */}
              <button 
                onClick={() => onGoToAuth(false)}
                className="w-full py-2.5 bg-black text-white hover:bg-[#00FF41] hover:text-black hover:font-bold border-2 border-black text-xs font-black transition-colors flex items-center justify-center gap-2"
              >
                <span>جرب مجاناً الآن</span>
                <ArrowRight size={14} className="rotate-180" />
              </button>
            </div>

            {/* Absolute Decorative Blob */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#fff2ba] border-2 border-black -z-10 rotate-12" />
          </div>

        </div>
      </section>

      {/* 3. The 5 Metamorphic Phases Walkthrough */}
      <section id="features" className="py-20 px-4 md:px-12 lg:px-24 bg-white border-b-3 border-black">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="font-mono text-xs font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 border border-green-200">
              الدورة الإنتاجية المتكاملة
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight">
              5 مراحل دقيقة تحول منتجك لحملة تسويقية رابحة!
            </h2>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">
              قمنا بأتمتة كامل الدورة الإبداعية التي تقوم بها الوكالات التسويقية الكبرى بمصاريف باهظة، وبنيناها بدقة لتلائم السوق الجزائري.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Phase 1 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] relative flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-black text-[#00FF41] block mb-3">01 /</span>
                <h3 className="text-lg font-black text-black mb-2 flex items-center gap-1.5">
                  <Compass size={18} className="text-black shrink-0" />
                  <span>التحليل العميق</span>
                </h3>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  استبيان ذكي لعلامتك وجمهورك المستهدف بالجزائر واستخراج لوحة الألوان والزوايا النفسية الـ 10 للزبائن.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] font-mono text-gray-400 font-bold uppercase">
                Product Intelligence Card
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] relative flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-black text-amber-500 block mb-3">02 /</span>
                <h3 className="text-lg font-black text-black mb-2 flex items-center gap-1.5">
                  <FileText size={18} className="text-black shrink-0" />
                  <span>البرومبتات الصورية</span>
                </h3>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  توليد 5 برومبتات ذكاء اصطناعي (أوامر Midjourney) لخدمات Lovart و DALL-E مع نصوص عربية إعلانية فخمة.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] font-mono text-amber-600 font-bold uppercase">
                5 Nextify Static Briefs
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] relative flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-black text-purple-600 block mb-3">03 /</span>
                <h3 className="text-lg font-black text-black mb-2 flex items-center gap-1.5">
                  <Target size={18} className="text-black shrink-0" />
                  <span>خطة الاستهداف</span>
                </h3>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  هيكل حملة فيسبوك وربط الجماهير (Ciblage) وبروتوكول الـ 7 أيام لتصفية الإعلانات ومراقبة النقر ومبيعات COD.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] font-mono text-purple-600 font-bold uppercase">
                Facebook Campaign Structure
              </div>
            </div>

            {/* Phase 4 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] relative flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-black text-blue-600 block mb-3">04 /</span>
                <h3 className="text-lg font-black text-black mb-2 flex items-center gap-1.5">
                  <Layers size={18} className="text-black shrink-0" />
                  <span>صفحة الهبوط CRO</span>
                </h3>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  كتابة وتصميم هيكل صفحات الهبوط عالية التحويل (6 أقسام متتالية) مخصصة لتخطي اعتراضات السعر ومخاوف الاستلام بالجزائر.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] font-mono text-blue-600 font-bold uppercase">
                Landing Page Brief (CRO Angle)
              </div>
            </div>

            {/* Phase 5 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] relative flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-black text-green-600 block mb-3">05 /</span>
                <h3 className="text-lg font-black text-black mb-2 flex items-center gap-1.5">
                  <Video size={18} className="text-black shrink-0" />
                  <span>سيناريوهات الفيديو</span>
                </h3>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  بروتوكول تفصيلي لإنشاء 4 مقاطع فيديو إعلانية وسيناريوهات كلامية مجهزة بالكامل بالدارجة الجزائرية الفصحى.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] font-mono text-green-600 font-bold uppercase">
                Darija Video Copywriting
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Interactive Sandbox COD ROI Simulator */}
      <section id="simulator" className="py-20 px-4 md:px-12 lg:px-24 bg-[#fafafa] border-b-3 border-black">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 border border-amber-200">
              ذكاء الأعمال التفاعلي
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight">
              محاكي العائد على الاستثمار وصافي الربح بالجزائر 🇩🇿
            </h2>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">
              قم بتعديل قيم المصاريف والتكاليف الحقيقية للتجارة الإلكترونية محلياً، وشاهد تغيرات أرباحك الصافية المتوقعة حياً فور تشغيل الإعلانات!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left: Interactive Controls */}
            <div className="lg:col-span-7 bg-white border-3 border-black p-6 md:p-8 space-y-6 shadow-[8px_8px_0_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black text-black border-b pb-3 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" />
                <span>المدخلات والمصاريف التقديرية</span>
              </h3>

              <div className="space-y-5">
                {/* Ads Budget */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-black">ميزانية الإعلان اليومية (DZD)</span>
                    <span className="font-mono text-black font-extrabold">{roiAdsSpend.toLocaleString()} دج</span>
                  </div>
                  <input 
                    type="range" 
                    min="3000" 
                    max="100000" 
                    step="1000"
                    value={roiAdsSpend}
                    onChange={(e) => setRoiAdsSpend(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer bg-gray-200 h-1.5"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>3,000 دج</span>
                    <span>100,000 دج</span>
                  </div>
                </div>

                {/* Sourcing Cost & Sale price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-black">سعر شراء المنتج بالجملة</span>
                      <span className="font-mono text-black font-extrabold">{roiSourcingCost.toLocaleString()} دج</span>
                    </div>
                    <input 
                      type="number" 
                      value={roiSourcingCost}
                      onChange={(e) => setRoiSourcingCost(Math.max(0, Number(e.target.value)))}
                      className="w-full p-2 border-2 border-black font-mono font-bold text-sm bg-neutral-50"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-black">سعر بيع المنتج النهائي</span>
                      <span className="font-mono text-black font-extrabold">{roiSalePrice.toLocaleString()} دج</span>
                    </div>
                    <input 
                      type="number" 
                      value={roiSalePrice}
                      onChange={(e) => setRoiSalePrice(Math.max(0, Number(e.target.value)))}
                      className="w-full p-2 border-2 border-black font-mono font-bold text-sm bg-neutral-50"
                    />
                  </div>
                </div>

                {/* CPA & Delivery Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-black">سعر الحصول على المبيعة (CPA)</span>
                      <span className="font-mono text-red-500 font-extrabold">{roiCpa.toLocaleString()} دج</span>
                    </div>
                    <input 
                      type="number" 
                      value={roiCpa}
                      onChange={(e) => setRoiCpa(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2 border-2 border-black font-mono font-bold text-sm bg-neutral-50"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-black">نسبة توصيل الطلبات (Delivery)</span>
                      <span className="font-mono text-green-600 font-extrabold">{roiDeliveryRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="95" 
                      step="1"
                      value={roiDeliveryRate}
                      onChange={(e) => setRoiDeliveryRate(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer bg-gray-200 h-1.5"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                      <span>30% استرجاع كبير</span>
                      <span>95% استلام أسطوري</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Fee & confirm rates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold block mb-1">تسعيرة شحن يالادين للولاية</label>
                    <input 
                      type="number" 
                      value={roiShippingFee}
                      onChange={(e) => setRoiShippingFee(Number(e.target.value))}
                      className="w-full p-2 border-2 border-black font-mono font-extrabold text-xs bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold block mb-1">رسوم التأكيد (Call Center)</label>
                    <input 
                      type="number" 
                      value={roiConfirmFee}
                      onChange={(e) => setRoiConfirmFee(Number(e.target.value))}
                      className="w-full p-2 border-2 border-black font-mono font-extrabold text-xs bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold block mb-1">غرامة الإرجاع (Return Cost)</label>
                    <input 
                      type="number" 
                      value={roiReturnPenalty}
                      onChange={(e) => setRoiReturnPenalty(Number(e.target.value))}
                      className="w-full p-2 border-2 border-black font-mono font-extrabold text-xs bg-neutral-50"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Real-time Live Financial Forecast */}
            <div className="lg:col-span-5 bg-black text-white border-3 border-black p-6 md:p-8 flex flex-col justify-between shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
              {/* Overlay grid lines */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#00FF41]" />

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Algeria COD 2026 Forecast Matrix</span>
                  <span className="text-[9px] bg-green-500 text-black font-bold px-1.5 py-0.5 border border-green-500">مباشر ومحسوب</span>
                </div>

                {/* Main Profit display */}
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold block">صافي الأرباح اليومية المقدرة:</span>
                  <span className={`text-4xl md:text-5xl font-black tracking-tighter ${netProfit >= 0 ? 'text-[#00FF41]' : 'text-red-500'}`}>
                    {netProfit.toLocaleString()} دج
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-white/10">
                  <div>
                    <span className="text-[11px] text-gray-400 block font-bold">نسبة العائد على الاستثمار:</span>
                    <span className="text-xl font-bold font-mono text-white">{roiPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-bold">الطلبات المقدرة:</span>
                    <span className="text-xl font-bold font-mono text-[#00FF41]">{calculatedOrders} طلبية</span>
                  </div>
                </div>

                {/* Detailed financial statistics */}
                <div className="space-y-2 text-xs pt-4 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">إجمالي المبيعات المحققة:</span>
                    <span className="font-mono text-white">{totalRevenue.toLocaleString()} دج</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">سعر اقتناء السورسينغ (الشراء):</span>
                    <span className="font-mono text-white">-{totalSourcingCost.toLocaleString()} دج</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">مصاريف الشحن الكلية (يالادين):</span>
                    <span className="font-mono text-white">-{totalShippingCost.toLocaleString()} دج</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold">رسوم إعلانات فيسبوك:</span>
                    <span className="font-mono text-white">-{roiAdsSpend.toLocaleString()} دج</span>
                  </div>
                </div>

              </div>

              {/* Instant action call */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <button 
                  onClick={() => onGoToAuth(false)}
                  className="w-full py-4.5 bg-[#00FF41] text-black hover:bg-white hover:text-black border-2 border-black font-black text-sm transition-colors text-center rounded-sm cursor-pointer"
                >
                  اكتشف المنتجات الرابحة واصنع حملة ناجحة 🚀
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Additional platform core features grid */}
      <section className="py-20 px-4 md:px-12 lg:px-24 bg-white border-b-3 border-black">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-black">
              نظام تشغيلي متكامل لوكالات الـ B2B والتجار بالجزائر
            </h2>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">
              ندعم كل ما تحتاجه لتوسيع أعمال المبيعات محلياً مع توفير أمان البيانات والأتمتة المكاملة لبلادنا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border-2 border-black bg-neutral-50 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all">
              <div className="w-12 h-12 bg-black text-[#00FF41] flex items-center justify-center border-2 border-black font-black text-xl mb-4">
                01
              </div>
              <h3 className="text-lg font-black text-black mb-2">تأمين تام لأكواد الـ API Keys</h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                ندعم مفاتيح Gemini الكلية والخاصة بك مع تخزين محلي آمن ومشفر بالكامل بـ AES-250-GCM لضمان الموثوقية وعدم خروج المفتاح خارج إطار السيرفر.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border-2 border-black bg-neutral-50 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all">
              <div className="w-12 h-12 bg-[#00FF41] text-black flex items-center justify-center border-2 border-black font-black text-xl mb-4">
                02
              </div>
              <h3 className="text-lg font-black text-black mb-2">أتمتة Webhooks لـ Shopify و Woo</h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                أرسل مبيعات زبائنك من شوبيفاي مباشرة عبر Webhooks مدمجة لتتم مطابقتها ومعالجتها وفحص الأرقام المكررة والمدن تلقائياً بواسطة خوارزمية MARKETING MASTER.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border-2 border-black bg-neutral-50 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black font-black text-xl mb-4">
                03
              </div>
              <h3 className="text-lg font-black text-black mb-2">دعم White Label كلي للوكالات</h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                أنشئ تقارير مبيعات استخباراتية مذهلة لشركائك وزبائنك وأخفِ أي علامات مائية تابعة لنا. استبدلها باسم شركتك ونطاق الـ Custom لترقية هوية أعمالك.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-12 lg:px-24 bg-[#fafafa] border-b-3 border-black">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 border border-amber-200">
              الأسعار وباقات الدعم
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight">
              اختر خطتك وابدأ ترقية مبيعاتك اليوم!
            </h2>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">
              باقات أسعار شديدة المرونة والشفافية تدعم الدفع المحتسب بالجزائر عبر BaridiMob وتفعيل فوري للاستفادة الكاملة من المميزات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            
            {/* Free Plan */}
            <div className="bg-white border-2 border-black p-6 flex flex-col justify-between transition-all hover:-translate-y-1 relative">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold bg-gray-100 px-2 py-0.5 border border-black/10 text-gray-500 rounded-sm">
                  البداية السريعة
                </span>
                <h3 className="text-xl font-black text-black">الباقة المجانية</h3>
                <div className="font-mono">
                  <span className="text-3xl font-black text-black">0 دج</span>
                  <span className="text-xs text-gray-400 font-bold">/ للأبد</span>
                </div>
                <p className="text-xs text-gray-500">جرب المنصة مع ميزات ذكاء أساسية وعينات محدودة.</p>
                
                <ul className="space-y-2 text-xs font-bold text-gray-700 pt-4 border-t border-dashed">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>توليد حتى 3 مشاريع مبيعات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>تحليل منتجات أساسي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>تقارير الـ 5 مراحل متتالية</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => onGoToAuth(false)}
                className="w-full py-2.5 mt-8 border-2 border-black hover:bg-black hover:text-[#00FF41] text-xs font-black transition-colors"
              >
                سجل حساب محلي مجاناً
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-3 border-black p-6 flex flex-col justify-between transition-all hover:-translate-y-1 relative shadow-[6px_6px_0_rgba(0,0,0,1)]">
              <div className="absolute top-0 left-6 -translate-y-1/2 bg-[#00FF41] text-black border-2 border-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
                موصى به لرواد الـ COD
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold bg-green-50 px-2 py-0.5 border border-green-200 text-green-700 rounded-sm">
                  الأكثر طلباً
                </span>
                <h3 className="text-xl font-black text-black">الباقة الاحترافية (PRO)</h3>
                <div className="font-mono">
                  <span className="text-3xl font-black text-black">1,500 دج</span>
                  <span className="text-xs text-gray-400 font-bold">/ شهرياً</span>
                </div>
                <p className="text-xs text-gray-500">الأفضل للتوجيه والمبيعات المتقدمة للمحترفين بالجزائر.</p>
                
                <ul className="space-y-2 text-xs font-bold text-gray-700 pt-4 border-t border-dashed">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span className="text-black font-extrabold">حتى 20 مشروعاً إعلانياً</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>الوصول الفوري لـ 9 مراحل كاملة من MARKETING MASTER</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>حفظ سحابي مستقر لا يفقد على حسابك</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>عروض خيارات A/B Testing متقدمة بالدارجة</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => onGoToAuth(false)}
                className="w-full py-3 mt-8 bg-[#00FF41] text-black border-2 border-black text-xs font-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
              >
                شراء الباقة الآن ورصد النجاح
              </button>
            </div>

            {/* Agency Plan */}
            <div className="bg-white border-2 border-black p-6 flex flex-col justify-between transition-all hover:-translate-y-1 relative">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold bg-amber-50 px-2 py-0.5 border border-amber-200 text-amber-700 rounded-sm">
                  أصحاب الوكالات
                </span>
                <h3 className="text-xl font-black text-black">باقة الوكالة (AGENCY)</h3>
                <div className="font-mono">
                  <span className="text-3xl font-black text-black">3,500 دج</span>
                  <span className="text-xs text-gray-400 font-bold">/ شهرياً</span>
                </div>
                <p className="text-xs text-gray-500">خاصة بالوكالات التسويقية وخدمات B2B وتجميع البيانات.</p>
                
                <ul className="space-y-2 text-xs font-bold text-gray-700 pt-4 border-t border-dashed">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span className="text-black font-extrabold">مشاريع غير محدودة (Unlimited)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>تضمين شعارك والبراند في كافة التقارير للعملاء</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>إمكانية دعوة وإضافة 3 أعضاء لإدارة الفريق</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>إخفاء العلامة المائية وملفات الاستاتيك الكبرى</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => onGoToAuth(false)}
                className="w-full py-2.5 mt-8 border-2 border-black hover:bg-black hover:text-[#00FF41] text-xs font-black transition-colors cursor-pointer"
              >
                تفعيل الحساب للوكالة
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-black p-6 flex flex-col justify-between transition-all hover:-translate-y-1 relative">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold bg-purple-50 px-2 py-0.5 border border-purple-200 text-purple-700 rounded-sm">
                  الشركات الكبرى
                </span>
                <h3 className="text-xl font-black text-black">باقة الشركات (ENTERPRISE)</h3>
                <div className="font-mono">
                  <span className="text-3xl font-black text-black">8,900 دج</span>
                  <span className="text-xs text-gray-400 font-bold">/ شهرياً</span>
                </div>
                <p className="text-xs text-gray-500">لكبار التجار والمستوردين بالجزائر والربط بالـ APIs.</p>
                
                <ul className="space-y-2 text-xs font-bold text-gray-700 pt-4 border-t border-dashed">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>كل مميزات باقة الوكالة دون استثناء</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>بوابات الـ Webhooks لربط المبيعات مع Shopify</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>سرعة وخوادم مخصصة ذات جودة منخفضة البينغ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>تشفير كامل لكافة بيانات التصدير ولقطات الشحن</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => onGoToAuth(false)}
                className="w-full py-2.5 mt-8 border-2 border-black hover:bg-black hover:text-[#00FF41] text-xs font-black transition-colors cursor-pointer"
              >
                اطلب البوابة المتقدمة للشركات
              </button>
            </div>

          </div>

          <div className="p-4 bg-amber-50 border border-amber-400 font-bold text-xs text-amber-900 leading-normal text-center select-none rounded-sm">
            💡 نقوم بتفعيل اشتراكات منصة <strong>MARKETING MASTER</strong> حالياً عبر تطبيق <strong>بريدي موب (BaridiMob)</strong> المعتمد بالجزائر للتحويل الفوري، ما يضمن الأمان والسرعة لعملائنا محلياً.
          </div>

        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-20 px-4 md:px-12 lg:px-24 bg-white border-b-3 border-black">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight">
              الأسئلة الشائعة حول MARKETING MASTER
            </h2>
            <p className="text-sm text-gray-500 font-bold">
              مجموع الإجابات اللازمة لتوضيح آلية العمل للزبون الجزائري.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="border-2 border-black bg-neutral-50"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full text-right p-5 font-black text-sm md:text-base flex justify-between items-center bg-white border-b-2 border-transparent transition-all hover:bg-neutral-50 hover:border-black/5"
                >
                  <span>{item.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`transform transition-transform ${faqOpen === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {faqOpen === index && (
                  <div className="p-5 text-xs md:text-sm font-semibold text-gray-600 leading-relaxed bg-neutral-50 border-t">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Call To Action Footer Banner */}
      <section className="py-16 px-4 md:px-12 bg-black text-white text-center space-y-6 relative overflow-hidden text-right">
        {/* Absolute Banner Strip background */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-[#00FF41]" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10 p-4">
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            ابدأ رحلة النجاح ومكاسب التجارة الإلكترونية بالجزائر اليوم!
          </h2>
          <p className="text-sm text-gray-400 font-bold leading-relaxed max-w-xl mx-auto">
            انضم إلى المئات من كبار التجار والوكالات التسويقية النشطة في الجزائر، والذين يستخدمون MARKETING MASTER لدراسة الأسواق وتصميم صفحات CRO وحملات فيسبوك رابحة.
          </p>
          
          <div className="pt-4">
            <button 
              onClick={() => onGoToAuth(false)}
              className="px-8 py-4.5 bg-[#00FF41] text-black font-black text-lg border-2 border-black inline-flex items-center gap-3 hover:bg-white hover:text-black hover:shadow-none transition-all shadow-[4px_4px_0_rgba(255,255,255,1)] cursor-pointer"
            >
              <span>سجل حسابك المجاني فوراً 🚀</span>
              <ArrowRight size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. Elegant branding Footer */}
      <footer className="bg-white border-t border-black/10 py-10 px-4 md:px-12 text-center text-xs font-bold text-gray-400" dir="rtl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-sans font-black text-base text-black">
              MARKETING MASTER SaaS الجزائر
            </span>
          </div>

          <span>حقوق النشر © {new Date().getFullYear()} MARKETING MASTER. جميع الحقوق محفوظة.</span>

          <div className="flex items-center gap-1.5 text-black">
            <span>طُور وتصمم بواسطة:</span>
            <span className="bg-black text-[#00FF41] px-2 py-0.5 border border-black font-extrabold uppercase font-mono tracking-wider">
              كرباني بلقاسم KERBANI BELKACEM
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
