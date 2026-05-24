import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Check, ShieldCheck, CreditCard, Sparkles, Building, Flame } from 'lucide-react';

interface SaaSPricingProps {
  onBackToDashboard: () => void;
  onInitiatePayment: (planName: "free" | "pro" | "agency" | "enterprise", price: number) => void;
}

export function SaaSPricing({ onBackToDashboard, onInitiatePayment }: SaaSPricingProps) {
  const { user } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'الخطة المجانية',
      price: 0,
      description: 'مثالية لتجربة محرك الذكاء الإعلاني واختبار الميزات الأساسية على نطاق محدود.',
      icon: Sparkles,
      color: '#f3f4f6',
      features: [
        'توليد 3 مشاريع نشطة بحد أقصى',
        'الوصول الكامل لـ 9 مراحل تسويقية',
        'استخدام مفاتيح الذكاء الاصطناعي الخاصة بك (BYOK)',
        'تصدير الخطط التسويقية بصيغة PDF مع علامة مائية',
        'ذاكرة تخزين محلية فقط (LocalStorage)',
        'تحديث وحفظ يدوي'
      ],
      ctaText: 'خطتك الحالية',
      activeColor: 'border-gray-300'
    },
    {
      id: 'pro',
      name: 'خطة المحترفين PRO',
      price: 1500,
      icon: Flame,
      description: 'الأكثر طلباً للتجار والمسوقين المحترفين في السوق الجزائري لتحقيق التوسع.',
      color: '#00FF41',
      popular: true,
      features: [
        'توليد حتى 20 مشروعاً إعلانياً',
        'الوصول الفوري لـ 9 مراحل كاملة من MARKETING MASTER',
        'حفظ سحابي مستقر لا يفقد على حسابك بالـ Database',
        'لوحة تحكم إحصائية حية لنتائج مبيعاتك',
        'عروض خيارات A/B Testing متقدمة بالدارجة الجزائرية',
        'تكامل ممتاز وتحليل صور منتجات عالي الدقة',
        'دعم عبر البريد الإلكتروني في غضون 24 ساعة'
      ],
      ctaText: 'اشترك الآن بالدينار',
      activeColor: 'border-black'
    },
    {
      id: 'agency',
      name: 'خطة الوكالات Agency',
      price: 3500,
      icon: Building,
      description: 'مصممة للوكالات وفرق العمل المتخصصة بمبيعات COD لتنظيم حملات ضخمة.',
      color: '#60a5fa',
      features: [
        'مشاريع تسويقية غير محدودة',
        'كل الميزات السحابية السابقة مع تخزين فوري',
        'إصدارات وتقارير بدون علامة مائية (White label)',
        'توليد سكريبتات فيديو غير متناهية مع خريطة Dual-Keyframe',
        'إدارة فرق عمل (حتى 5 أعضاء بالوكالة) - تجريبي',
        'أولوية فائقة لسرعة خوادم معالجة الذكاء الاصطناعي',
        'دعم فني خاص وهاتف مباشر'
      ],
      ctaText: 'اشترك الآن بالدينار',
      activeColor: 'border-[#3b82f6]'
    },
    {
      id: 'enterprise',
      name: 'خطة الشركات Enterprise',
      price: 12000,
      icon: ShieldCheck,
      description: 'بروتوكول احترافي مخصص للشركات والمصانع الجزائرية الكبرى مع خوادم معالجة آمنة.',
      color: '#f43f5e',
      features: [
        'مشاريع ومخططات غير محدودة',
        'لوحة إدارة مخصصة لحسابات فرعية وصلاحيات دقيقة',
        'دعم خوادم وAPI مخصصة لسرعة فائقة جداً',
        'استخدام مفتاح ذكاء اصطناعي موحد مضمن (اختياري)',
        'تحليل تقارير ذكاء المنافسين المتقدم بـ AI',
        'نسخ احتياطي فوري على خوادم متعددة',
        'مستشار تسويق مخصص لحملات الـ Meta والـ Scale'
      ],
      ctaText: 'تواصل لطلب الخطة',
      activeColor: 'border-red-500 font-bold'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-12 font-sans selection:bg-[#00FF41]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b-2 border-black gap-4">
          <div>
            <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest bg-[#00FF41] px-2 py-1 border border-black inline-block mb-2">
              بوابة الدفع والخطط المتاحة
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-black">
              اختر الخطة والسرعة التي تناسب عملك
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-bold">
              الدفع متاح حالياً بشكل آمن وسريع عبر تطبيق بريدي موب (BaridiMob). تفعيل يدوي فوري ومباشر! 🇩🇿
            </p>
          </div>
          <button 
            onClick={onBackToDashboard}
            className="px-6 py-3 border-2 border-black bg-white font-black text-xs hover:bg-black hover:text-[#00FF41] shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
          >
            ← عودة للوحة التحكم
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isUserCurrentPlan = user?.plan === plan.id;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                className={`bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] relative flex flex-col justify-between ${
                  plan.popular ? 'ring-3 ring-[#00FF41]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-6 bg-[#00FF41] border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <span>الأكثر شعبية</span>
                  </div>
                )}

                {/* Top Half */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="p-3 border-2 border-black" 
                      style={{ backgroundColor: plan.color }}
                    >
                      <IconComponent size={24} className="text-black" />
                    </div>
                    {isUserCurrentPlan && (
                      <span className="text-[10px] font-black text-green-700 bg-green-100 border border-green-400 px-2 py-1">
                        خيارك المفعل حالياً
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-black mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 h-8 leading-snug mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <span className="text-3xl font-black text-black font-mono">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-black ml-1">د.ج</span>
                    <span className="text-xs text-gray-500 font-bold"> / شهرياً</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex gap-2 items-start text-gray-700">
                        <Check size={14} className="text-black shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action */}
                <button
                  disabled={isUserCurrentPlan}
                  onClick={() => onInitiatePayment(plan.id as any, plan.price)}
                  className={`w-full font-black text-xs p-3.5 border-2 border-black tracking-tight text-center transition-all ${
                    isUserCurrentPlan 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
                      : plan.popular
                        ? 'bg-[#00FF41] text-black hover:bg-black hover:text-[#00FF41] shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none'
                        : 'bg-white text-black hover:bg-black hover:text-[#00FF41] shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none'
                  }`}
                >
                  {isUserCurrentPlan ? 'اشتراكك الحالي' : plan.ctaText}
                </button>
              </motion.div>
            );
          })}
        </div>
        
        {/* Payments Footer logo banner info */}
        <div className="bg-[#fcf8f2] border-2 border-black p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <div className="flex gap-4 items-center">
            <div className="bg-[#ffe8ca] border border-black p-2 text-black text-xl font-bold rounded-sm font-mono shrink-0">
              🇩🇿
            </div>
            <div>
              <h4 className="font-black text-black text-xs">طريقة تفعيل الاشتراك والدفع المتوفرة</h4>
              <p className="text-[11px] text-gray-600 mt-1 max-w-2xl font-semibold">
                نقوم بتفعيل اشتراكات MARKETING MASTER حالياً عبر تطبيق **بريدي موب (BaridiMob)** للحساب الجاري المعتمد. بعد اختيار خطتك، ستظهر لك بيانات التحويل للحساب الجاري <span className="font-mono text-black font-extrabold select-all">00799999000979580702</span> باسم حامل الحساب <span className="text-black font-extrabold">kerbani belkacem</span>. عند إتمام التحويل يرجى إرسال لقطة الشاشة للوصل عبر الواتساب لتفعيل حسابك فوراً.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="px-3 py-1 bg-green-100 text-green-800 border border-black font-mono font-black text-[10px]">BARIDIMOB ACTIVE</span>
            <span className="px-3 py-1 bg-white text-gray-400 border border-gray-300 border-dashed font-mono font-bold text-[10px]">CIB CARD (SOON)</span>
            <span className="px-3 py-1 bg-white text-gray-400 border border-gray-300 border-dashed font-mono font-bold text-[10px]">EDAHABIA (SOON)</span>
          </div>
        </div>

        {/* Brand Copyright & Designer Signature Footer */}
        <div className="mt-12 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400" dir="rtl">
          <span>حقوق النشر © {new Date().getFullYear()} MARKETING MASTER SaaS الجزائر. جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-1.5 text-black">
            <span>طُور وتصمم بواسطة:</span>
            <span className="bg-black text-[#00FF41] px-2 py-0.5 border border-black font-extrabold uppercase font-mono tracking-wider">
              تصميم كرباني بلقاسم KERBANI BELKACEM
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
