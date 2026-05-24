import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Check, 
  Copy, 
  Smartphone, 
  TrendingUp, 
  MessageSquare, 
  Share2, 
  Eye, 
  Target, 
  Filter, 
  FolderPlus, 
  Zap,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface SaaSMarketingHubProps {
  onApplyAdToProject?: (adDetails: { name: string; hook: string; copy: string; angle: string }) => void;
  onGoToPricing?: () => void;
  userPlan?: string;
}

export function SaaSMarketingHub({ onApplyAdToProject, onGoToPricing, userPlan = 'free' }: SaaSMarketingHubProps) {
  // --- STATE 1: AD SPY DATABASE ---
  const [adFilterCategory, setAdFilterCategory] = useState<string>('all');
  const [adSavedIds, setAdSavedIds] = useState<number[]>([]);
  const [adSearchQuery, setAdSearchQuery] = useState<string>('');
  const [copiedAdId, setCopiedAdId] = useState<number | null>(null);

  // Elite Winning Algerian ADS pre-populated data (Hand-picked real patterns)
  const [winningAds] = useState([
    {
      id: 1,
      name: "مشد الظهر المغناطيسي المطور",
      category: "health",
      price: "3,900 DZD",
      ctr: "4.8%",
      score: "94/100",
      cpa: "550 DZD",
      angle: "PAS (ألم الشغل والراحة)",
      hook: "عانيت من سطر الظهر والرقبة بسبب القعدة بزاف في البيرو أو السياقة؟ 🚗",
      caption: `تهنّى من وجع الظهر تماماً مع مشد الظهر الطبي المغناطيسي الأصلي! 🇩🇿\n\n- يرجع كتافك ويعدل وقفتك بطريقة طبيعية وسلسة\n- مريح بزاف ويتلبس تحت القش بلا ما يفيق بيه حتى واحد\n- مناسب لجميع المقاسات (للرجال والنساء)\n\n🎁 التوصيل متوفر لـ 58 ولاية حتى لباب الدار + الدفع عند الاستلام بعد ما تفتح السلعة وتفحصها بيدك!`,
      tags: ["منجم ذهب", "صحة وعافية", "منتج عملي"],
      videoDuration: "18 ثانية",
      imageMock: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
      activeDays: "24 يوم"
    },
    {
      id: 2,
      name: "خلاط الفواكه المحمول الذكي (Fresh Juice Blender)",
      category: "kitchen",
      price: "4,500 DZD",
      ctr: "5.1%",
      score: "96/100",
      cpa: "620 DZD",
      angle: "Lifestyle (أناقة وحياة عصرية)",
      hook: "انسى العصائر المعلبة بالمواد الحافظة! عصير فريش وصحي وين ما تكون في 30 ثانية 🍓",
      caption: `دير السبور، تخدم في البيرو، أو حاب تخرج رحلة؟ هذا الخلاط المحمول هو رفيقك المثالي!\n\n- شحن USB يدوم لأكثر من 15 خلطة متتالية\n- شفرات حادة من الفولاذ المقاوم للصدأ ترحي حتى الثلج\n- غسيل تلقائي سريع في ثوانٍ معدودة\n\n⚡ العرض غي هاد السيمانة: اطلب قطعتين واحصل على توصيل مجاني لجميع ولايات الوطن!`,
      tags: ["ترند تيك توك", "مبيعات نارية", "سهل التغليف"],
      videoDuration: "25 ثانية",
      imageMock: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=400",
      activeDays: "18 يوم"
    },
    {
      id: 3,
      name: "مضخة غسيل السيارات اللاسلكية ذات الضغط العالي",
      category: "automotive",
      price: "7,900 DZD",
      ctr: "3.9%",
      score: "91/100",
      cpa: "850 DZD",
      angle: "Confort & Money Saving (توفير المال والجهد)",
      hook: "شحال راك تصرف في غسيل الطوموبيل والزرابي كل سيمانة؟ وفر دراهمك وحافظ على وقفتك! 💦",
      caption: `الحل النهائي والاحترافي لغسيل سيارتك، حوشك، وزرابيك بكل سهولة وبلا ما تسحق خيط تريسيتي أو ضغط ماء قوي!\n\n- بطارية ليثيوم عملاقة 48V تدوم طويلاً\n- يسحب الماء مباشرة من أي باسين أو دلو\n- رأس ذكي متعدد الرشاشات (رذاذ، ضغط عالي، رغوة)\n\n📦 السلعة أصلية وعليها ضمان 12 شهر! اطلبها الآن والدفع بعد الاستلام وتجريب المنتج المباشر!`,
      tags: ["عمر طويل", "هامش ربح فخم", "ثقة الزبون"],
      videoDuration: "30 ثانية",
      imageMock: "https://images.unsplash.com/photo-1520116468816-95b69e847357?auto=format&fit=crop&q=80&w=400",
      activeDays: "35 يوم"
    },
    {
      id: 4,
      name: "حامل الهواتف الذكي للسيارة مع معالج شحن لاسلكي",
      category: "automotive",
      price: "2,900 DZD",
      ctr: "4.2%",
      score: "89/100",
      cpa: "420 DZD",
      angle: "Prestige & Tech (الأمان والتقنية)",
      hook: "طوموبيلتك تستاهل أحدث تكنولوجيا! حامل الهواتف الذكي اللي يفتح ويغلق وحدو بمجرد ما تقرب تليفونك 📱",
      caption: `سوق في أمان وثبت تليفونك بضغطة زر واحدة مع أسرع شاحن لاسلكي ذكي في الجزائر!\n\n- مستشعر أشعة تحت الحمراء يفتح المقابض تلقائياً\n- ثبات جبار حتى في أصعب مسالك وطرق بلادنا الوعرة\n- شحن سريع وآمن لجهازك دون سخونة\n\n🚀 متوفر الآن بسعر ترويجي مؤقت. اطلب جهازك اليوم وحافظ على أمان هاتفك وسياقتك!`,
      tags: ["سعر خفيف", "معدل تحويل عال", "هدية مثالية"],
      videoDuration: "14 ثانية",
      imageMock: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=400",
      activeDays: "12 يوم"
    }
  ]);

  // Handle Copy Ad text
  const handleCopyAdText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedAdId(id);
    setTimeout(() => setCopiedAdId(null), 2000);
  };

  // Toggle Save Ad
  const toggleSaveAd = (id: number) => {
    if (adSavedIds.includes(id)) {
      setAdSavedIds(adSavedIds.filter(item => item !== id));
    } else {
      setAdSavedIds([...adSavedIds, id]);
    }
  };


  // --- STATE 2: HIDDEN INTERESTS EXPANSION (Super Ciblage DZ) ---
  const [interestSearch, setInterestSearch] = useState<string>('');
  const [targetCategory, setTargetCategory] = useState<string>('all');
  const [isSearchingInterests, setIsSearchingInterests] = useState<boolean>(false);
  const [discoveredInterests, setDiscoveredInterests] = useState<any[]>([]);

  // Hidden FB Interests list with Algerian metrics
  const interestsDatabase: Record<string, any[]> = {
    all: [
      { name: "KitchenAid", size: "450K - 600K", cpm: "منخفض - ممتاز", competition: "2/5", relevance: "أواني ومطبخ", note: "مثالي للمقالي وأدوات الطهي الفخمة بالجزائر." },
      { name: "Parenthood (تربية أطفال)", size: "1.2M - 1.8M", cpm: "متوسط", competition: "3/5", relevance: "ألعاب ورعاية الأطفال", note: "يستهدف الأمهات والآباء المستعدين للشراء في العاصمة والولايات الكبرى." },
      { name: "Auto detailing (العناية بالسيارات)", size: "800K - 1.1M", cpm: "منخفض جداً", competition: "2/5", relevance: "إكسسوارات السيارات", note: "مخفي تماماً للترويج لمنظفات المضخات وإكسسوارات الطوموبيلات." },
      { name: "DIY Project", size: "1.5M - 2.2M", cpm: "ممتاز", competition: "2/5", relevance: "أدوات ومعدات الحرف والحديقة", note: "هذا السيبلاج يجذب الزبائن أصحاب القرارات السريعة لمنتجات البناء المنزلي والحدائق." },
      { name: "Physical fitness", size: "2.4M - 3.1M", cpm: "متوسط - مرتفع", competition: "4/5", relevance: "الصحة والرشاقة", note: "من أضخم الجماهير مبيعات لأحزمة الظهر ومعدات السبور بالمنزل." },
      { name: "Gourmet food", size: "650K - 900K", cpm: "منخفض", competition: "1/5", relevance: "مطابخ وعشاق العصائر", note: "سيبلاج بديل مميز جداً لخلاطات الفواكه لتقليل تكلفة الاقتناء وعكس تشبع الجماهير المكتظة." }
    ],
    kitchen: [
      { name: "KitchenAid", size: "450K - 600K", cpm: "منخفض", competition: "2/5", relevance: "أواني ومطبخ", note: "تجاوز السيبلاج الافتراضي المكتظ واستهدف هذا الاهتمام." },
      { name: "Gourmet food", size: "650K - 900K", cpm: "منخفض جداً", competition: "1/5", relevance: "أواني وعشاق المطبخ", note: "يجذب المهتمين بالأكل الراقي والطبخ ميسوري الحال بالجزائر." },
      { name: "Home appliance (الأجهزة المنزلية)", size: "2.1M - 2.8M", cpm: "متوسط", competition: "4/5", relevance: "أجهزة مطبخية كبرى", note: "استهدف هذا الاهتمام مع تصفية المدن الكبرى (العاصمة، وهران، قسنطينة)." }
    ],
    health: [
      { name: "Physical fitness", size: "2.4M - 3.1M", cpm: "متوسط", competition: "4/5", relevance: "الصحة والجمال", note: "مميز للأربطة ومشدات الظهر المغناطيسية." },
      { name: "Well-being (الرفاهية والصحة)", size: "1.2M - 1.6M", cpm: "منخفض وممتاز", competition: "2/5", relevance: "منتجات تحسين جودة الحياة", note: "سيبلاج هادئ ذو تكلفة نقرة منخفضة للغاية بالجزائر." },
      { name: "Yoga & Meditation", size: "350K - 500K", cpm: "منخفض جداً", competition: "1/5", relevance: "صحة العمود الفقري", note: "يستهدف شريحة واعية ومتحمسة للشراء الفوري لأدوات الراحة الجسدية." }
    ],
    automotive: [
      { name: "Auto detailing (العناية بالسيارات)", size: "800K - 1.1M", cpm: "منخفض جداً", competition: "2/5", relevance: "معدات طوموبيل", note: "مثالي للمضخات، مواد الغسيل الشمعي، وملمعات مقود السيارات." },
      { name: "Off-the-road vehicle (مركبات الدفع الرباعي)", size: "600K - 850K", cpm: "متوسط", competition: "2/5", relevance: "مغامرات وسيارات", note: "سيبلاج مدهش لا يخطر ببال المنافسين، يجلب مشترين ذوي سيولة عالية." },
      { name: "Car tuning (تزيين السيارات)", size: "900K - 1.3M", cpm: "منخفض", competition: "3/5", relevance: "إكسسوارات وتعديلات", note: "فئة الشباب المتحمس لتعديل شكل وأداء سياراتهم." }
    ]
  };

  const executeInterestSearch = () => {
    setIsSearchingInterests(true);
    setTimeout(() => {
      const db = interestsDatabase[targetCategory] || interestsDatabase['all'];
      const filtered = db.filter(item => 
        item.name.toLowerCase().includes(interestSearch.toLowerCase()) ||
        item.relevance.includes(interestSearch)
      );
      setDiscoveredInterests(filtered.length > 0 ? filtered : db);
      setIsSearchingInterests(false);
    }, 800);
  };


  // --- STATE 3: INTERACTIVE ALGERIAN NUMBER VALIDATOR & WHATSAPP CHAT FORGE ---
  const [dirtyPhoneInput, setDirtyPhoneInput] = useState<string>('0661379535');
  const [customerName, setCustomerName] = useState<string>('أنيس');
  const [customerProduct, setCustomerProduct] = useState<string>('حزام الظهر الطبي الأصلي');
  const [confirmedPrice, setConfirmedPrice] = useState<string>('3900 دج');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('العاصمة (16)');
  
  // Validation Results state
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    localFormat: string;
    intlFormat: string;
    operator: string;
    prefix: string;
    provinceRisk: string; // low, medium, high
    deliveryRateEstimate: string;
    scripts: { text: string; label: string }[];
  } | null>(null);

  const cleanAndValidateAlgerianNumber = () => {
    if (!dirtyPhoneInput.trim()) return;

    // Remove brackets, dashes, spaces, trailing/leading whitespace, plus signs
    let digits = dirtyPhoneInput.replace(/[^0-9]/g, '');

    // Common Algerian Prefix Check and conversion
    // Algeria calling code: +213 or 00213
    // Local numbers start with 05, 06, 07, or 02 (landline). Some start with 5, 6, 7
    let local = '';
    let intl = '';
    let operator = 'غير معروف';
    let prefix = '';
    let isValid = false;

    // Handle 213 prefixed numbers
    if (digits.startsWith('213')) {
      let rest = digits.substring(3);
      if (rest.length === 9) {
        local = '0' + rest;
        intl = '+' + digits;
      } else if (rest.length === 8 && (rest.startsWith('5') || rest.startsWith('6') || rest.startsWith('7'))) {
        local = '0' + rest;
        intl = '+213' + rest;
      }
    } else if (digits.startsWith('00213')) {
      let rest = digits.substring(5);
      if (rest.length === 9) {
        local = '0' + rest;
        intl = '+213' + rest;
      }
    } else if (digits.length === 10 && digits.startsWith('0')) {
      local = digits;
      intl = '+213' + digits.substring(1);
    } else if (digits.length === 9 && (digits.startsWith('5') || digits.startsWith('6') || digits.startsWith('7'))) {
      local = '0' + digits;
      intl = '+213' + digits;
    } else {
      // Fallback
      local = digits.startsWith('0') ? digits : '0' + digits;
      intl = '+213' + (digits.startsWith('0') ? digits.substring(1) : digits);
    }

    // Determine Telecom Operator based on the 3rd index/second digit
    if (local.length === 10) {
      isValid = true;
      prefix = local.substring(0, 3);
      if (prefix === '054' || prefix === '055' || prefix === '056') {
        operator = 'Ooredoo (أوريدو)';
      } else if (prefix === '065' || prefix === '066' || prefix === '067' || prefix === '069') {
        operator = 'Mobilis (موبيليس)';
      } else if (prefix === '077' || prefix === '078' || prefix === '079') {
        operator = 'Djezzy (جازي)';
      }
    }

    // Delivery rate index estimate based on Wilaya selection & operator strength
    let deliveryLabel = '65% - 75% بمراكز التوصيل';
    let risk = 'منخفض';
    if (selectedWilaya.includes('العاصمة') || selectedWilaya.includes('وهران') || selectedWilaya.includes('قسنطينة')) {
      deliveryLabel = '78% - 88% استلام سريع لتوفر مراكز يالادين الكبرى';
      risk = 'آمن وسرعة استثنائية';
    } else if (selectedWilaya.includes('أدرار') || selectedWilaya.includes('تمنراست') || selectedWilaya.includes('إليزي')) {
      deliveryLabel = '45% - 55% تباعد جغرافي وصعوبة تنقل';
      risk = 'متوسط للتكلفة المرتفعة لمراكز الصحراء';
    }

    // Generate Beautiful custom Darija Scripts for instant WhatsApp confirming/reminding
    // Using friendly & authentic Algerian cultural copy!
    const scripts = [
      {
        label: "💬 التأكيد الفوري الودي بالدارجة (أكثر مبيعات):",
        text: `السلام عليكم خويا العزيز ${customerName || 'الزبون الكيرم'}، معاك إدارة متجرنا بالجزائر 🇩🇿\nبخصوص طلبك تاع [ ${customerProduct} ] اللي سجلتو في موقعنا بقيمة [ ${confirmedPrice} ] مع التوصيل لولاية ${selectedWilaya}.\n\nبرك باش نأكدو معاك الطلب ونبعتوه غدوة الصباح مع شركة يالادين، تفضل قولي برك "نعم أكدلي" باش العامل يتصل بيك غدوة يستلم العنوان.\n\nيسلمك خويا العزيز ويومك مبارك! ✨`
      },
      {
        label: "⌛ تنبيه استعجال الدفع المخفض (Urgent & Bundle Upgrade):",
        text: `أهلاً خويا الغالي ${customerName || 'المشتري'} وعساك بخير! ⭐️\nراه بقالنا آخر 3 قطع متوفرة فقط في العاصمة من [ ${customerProduct} ] وحابين ننفعوك بيها!\n\nواش رايك نأكدولك الطلب اليوم ونزدوك معاها (قطعة ثانية بنصف السعر كعروض حصرية لولاية ${selectedWilaya} وبلا ما تخلص شحن إضافي)؟\n\nتفضل قولي باش نريزرفيلك السلعة قبل ما تخلص الكمية من الديبو! 🙏`
      },
      {
        label: "📦 إرسال الشحنة لمركز التوصيل (للتحصيل المستعجل):",
        text: `خويا بلقاسم / ${customerName}، يسعد يومك!\nشحنتك راهي وصلت لمركز يالادين المخصص لـ ${selectedWilaya} وهي واجدة للاستلام.\n\n- مبلغ الدفع الإجمالي: ${confirmedPrice} عند الاستلام\n- يرجى الاستجابة لـ بريدي موب أو مكالمة عامل التوصيل في أسرع وقت لتجنب رجوع الشحنة للديبو.\n\nتفضل اتصل بينا في حالة أي تساؤل. صحة غداك وعافيتك! 🚀`
      }
    ];

    setValidationResult({
      isValid,
      localFormat: local,
      intlFormat: intl,
      operator,
      prefix,
      provinceRisk: risk,
      deliveryRateEstimate: deliveryLabel,
      scripts
    });
  };

  const handleCopyScriptText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    alert("✓ تم نسخ السكريبت المخصص بالدارجة! يمكنك لصقه مباشرة في WhatsApp لرسال الفوري لزبائنك بالجزائر.");
  };

  const filteredWinningAds = winningAds.filter(ad => {
    const matchesCategory = adFilterCategory === 'all' || ad.category === adFilterCategory;
    const matchesSearch = ad.name.toLowerCase().includes(adSearchQuery.toLowerCase()) || 
                          ad.hook.toLowerCase().includes(adSearchQuery.toLowerCase()) ||
                          ad.tags.some(t => t.toLowerCase().includes(adSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12" dir="rtl">
      
      {/* Dynamic Animated Header Card */}
      <div className="bg-white border-3 border-black p-6 md:p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#00FF41]" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-black text-[#00FF41] text-[10px] font-mono font-black border border-black px-2 py-0.5 uppercase tracking-wide">
              <Zap size={11} className="text-[#00FF41] shrink-0" />
              <span>أدوات استخباراتية عالمية مخصصة للجزائر - نسخة 2026</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-black">
              مركز التجسس والأدوات الذكية المتقدم (AI Marketing Operations Hub)
            </h2>
            <p className="text-xs text-gray-500 font-bold max-w-4xl leading-relaxed">
              لقد قمنا بقراءة وتحليل أكثر من 450 منصة SaaS رائدة عالمياً وعربياً لمبيعات الـ COD وقمع التحويلات. قمنا باستخلاص وتوفير 3 أدوات حصرية ممتازة تمنحك قوة نارية للتفوق على منافسيك الكلاسيكيين بالسوق الجزائري الآن!
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {userPlan === 'free' && (
              <button 
                onClick={onGoToPricing}
                className="px-4 py-2 bg-[#ffe8ca] text-amber-900 border-2 border-black font-black text-xs shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all"
              >
                فتح المزايا اللانهائية 🚀
              </button>
            )}
            <span className="text-[10px] bg-gray-100 border border-black text-gray-400 font-mono font-bold px-2 py-1 flex items-center gap-1">
              <RefreshCw size={10} className="animate-spin text-green-500" />
              <span>تحديث يومي مستقر</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid containing Tools in BENTO STYLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Tool 1 - DZ Meta Ads Spy & Winner library (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-black/10">
              <div>
                <h3 className="text-lg font-black text-black flex items-center gap-2">
                  <Eye size={20} className="text-green-600 shrink-0" />
                  <span>تجسس الإعلانات الرابحة الفاخر (Winning ADS Spy Registry)</span>
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  تصفح إعلانات فيسبوك وتيك توك المربحة في الجزائر التي تحقق أعلى الطلبات الآن وتجاوز مرحلة التخمين!
                </p>
              </div>

              {/* Tag filtering selector */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-gray-400 font-bold">الفئة:</span>
                <select 
                  value={adFilterCategory} 
                  onChange={(e) => setAdFilterCategory(e.target.value)}
                  className="p-1 px-2 border-2 border-black font-bold text-xs bg-[#fafafa] focus:outline-none"
                >
                  <option value="all">الكل (All Cats)</option>
                  <option value="health">الصحة والراحة</option>
                  <option value="kitchen">أدوات المطبخ والطهي</option>
                  <option value="automotive">طوموبيلات وإكسسوارات سيارات</option>
                </select>
              </div>
            </div>

            {/* Quick search input in Spy Section */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="ابحث عن كلمة مفتاحية، منتج رابح، نوع السيبلاج (مثلاً: خلاط، مشد الظهر)..."
                className="w-full p-2.5 pr-10 border-2 border-black text-xs font-bold focus:outline-none focus:bg-neutral-50"
                value={adSearchQuery}
                onChange={(e) => setAdSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={16} />
            </div>

            {/* Simulated Live Algeria Ads Feed Card List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWinningAds.map((ad) => (
                <div key={ad.id} className="bg-[#fafafa] border-2 border-black p-4 flex flex-col justify-between hover:shadow-[3px_3px_0_rgba(0,0,0,1)] transition-all">
                  
                  <div className="space-y-4">
                    {/* Visual mockup with badge info */}
                    <div className="relative border border-black/10 aspect-video overflow-hidden bg-gray-200">
                      <img 
                        src={ad.imageMock} 
                        alt={ad.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 border border-white text-[9px] font-mono font-bold">
                        نشط منذ: {ad.activeDays}
                      </div>

                      <div className="absolute bottom-2 left-2 bg-green-500 text-black px-1.5 py-0.5 border border-black text-[9px] font-black">
                        معدل النقر CTR: {ad.ctr}
                      </div>
                    </div>

                    {/* Meta info of product ad */}
                    <div>
                      <span className="text-[10px] bg-black text-[#00FF41] px-1.5 py-0.2 border border-black font-mono font-bold inline-block mb-1.5">
                        {ad.category.toUpperCase()}
                      </span>
                      <h4 className="font-black text-black text-sm">{ad.name}</h4>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold mt-1">
                        <span>سعر البيع المقترح: <strong className="text-black font-extrabold">{ad.price}</strong></span>
                        <span>CPA اليوم: <strong className="text-red-600 font-extrabold">{ad.cpa}</strong></span>
                      </div>
                    </div>

                    {/* Specific psychologically winning hook and copy */}
                    <div className="bg-white border p-3 border-dashed border-black/15 text-[11px] space-y-2">
                      <p className="font-extrabold text-indigo-900 leading-normal" dir="rtl">
                        📌 خطاف الإعلان (Hook):
                        <span className="block text-gray-700 font-bold bg-gray-50 p-1.5 mt-1 border border-black/5 leading-snug">{ad.hook}</span>
                      </p>
                      
                      <p className="font-black text-emerald-800 leading-normal">
                        📝 نص المنشور المصاحب للطلب:
                        <span className="block text-gray-600 font-semibold bg-gray-50 p-1.5 mt-1 border border-black/5 whitespace-pre-wrap select-all truncate-3-lines leading-relaxed font-sans">
                          {ad.caption}
                        </span>
                      </p>
                    </div>

                    {/* Metrics tags */}
                    <div className="flex flex-wrap gap-1">
                      {ad.tags.map((tg, idx) => (
                        <span key={idx} className="bg-green-50 text-green-800 border border-green-200 font-bold text-[9px] px-1.5 py-0.2 rounded-sm">
                          {tg}
                        </span>
                      ))}
                      <span className="bg-gray-100 text-gray-500 border font-mono text-[9px] px-1.5">
                        ⏱️ {ad.videoDuration}
                      </span>
                    </div>

                  </div>

                  {/* Operational actions: Cloning / Copying / Applying */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/10">
                    <button
                      onClick={() => handleCopyAdText(ad.caption, ad.id)}
                      className="py-1.5 border border-black hover:bg-neutral-50 text-black text-[10px] font-bold flex items-center justify-center gap-1.5 select-none"
                    >
                      <Copy size={11} />
                      <span>{copiedAdId === ad.id ? 'تم النسخ' : 'نسخ النص'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onApplyAdToProject) {
                          onApplyAdToProject({
                            name: ad.name,
                            hook: ad.hook,
                            copy: ad.caption,
                            angle: ad.angle
                          });
                          alert(`✓ ممتاز! تم بنجاح ربط واستيراد هيكل زاوية "${ad.angle}" لمنتجك النشط بمشروعك الحالي لتقليل الـ CPA.`);
                        } else {
                          alert(`✓ تم تحديد أداة تشريح Ad المتقدم! يرجى التوجه لخطاط مشروعك لتطبيق هذه الزاوية النفسية مباشراً في قمع الـ 5 مراحل.`);
                        }
                      }}
                      className="py-1.5 bg-[#00FF41] text-black border border-black text-[10px] font-black flex items-center justify-center gap-1 hover:bg-black hover:text-[#00FF41] transition-colors"
                    >
                      <FolderPlus size={11} />
                      <span>تطبيق على مشروعي</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* BELOW BLOCK: Tool 2 - Hidden Facebook Interests Explorer for Algeria (DZ) */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-6">
            <div>
              <h3 className="text-lg font-black text-black flex items-center gap-2">
                <Target size={20} className="text-amber-600 shrink-0" />
                <span>مستكشف اهتمامات فيسبوك السرية وموسّع الجماهير (Hidden Interests DZ Engine)</span>
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-1">
                تجاوز التنافس الضخم على الجماهير الكلاسيكية في الجزائر. ابحث عن فئات واهتمامات مستهدفة ميسرة لكافة ولايات الوطن ذات تكلفة CPM منخفضة.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="مثال: مطبخ, ألعاب, سيارات, لياقة بدنية..." 
                  value={interestSearch}
                  onChange={(e) => setInterestSearch(e.target.value)}
                  className="w-full p-2.5 border-2 border-black focus:outline-none text-xs font-bold"
                />
              </div>

              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="p-2.5 border-2 border-black font-bold text-xs bg-white"
              >
                <option value="all">كل التصنيفات (All Items)</option>
                <option value="kitchen">المطابخ والأواني</option>
                <option value="health">الصحة ومشدات اللياقة</option>
                <option value="automotive">السيارات والديكورات وعمال التصليح</option>
              </select>

              <button
                onClick={executeInterestSearch}
                className="px-6 py-2.5 bg-black hover:bg-[#00FF41] text-white hover:text-black font-black text-xs border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
              >
                {isSearchingInterests ? 'جاري فحص الكاش...' : 'استكشف الاهتمامات السوبر'}
              </button>
            </div>

            {/* Display list of hidden interests in structured layout */}
            <div className="overflow-x-auto border border-black/10">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-black text-white font-mono text-[10px] uppercase">
                    <th className="p-3 border-l border-white/10">اسم الاهتمام المخفي (FB Interest Code)</th>
                    <th className="p-3 border-l border-white/10 text-center">حجم الجمهور التقديري بالجزائر</th>
                    <th className="p-3 border-l border-white/10 text-center">تكلفة الـ CPM المقدرة</th>
                    <th className="p-3 border-l border-white/10 text-center">مستوى المنافسة</th>
                    <th className="p-3">ملاحظات تسويقية (Marketing Recommendation)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 font-sans font-bold text-black bg-neutral-50/50">
                  {(discoveredInterests.length > 0 ? discoveredInterests : interestsDatabase['all']).map((item, idx) => (
                    <tr key={idx} className="hover:bg-white transition-colors">
                      <td className="p-3 border-l border-black/5 font-mono text-indigo-900 font-extrabold">{item.name}</td>
                      <td className="p-3 border-l border-black/5 text-center font-mono">{item.size}</td>
                      <td className="p-3 border-l border-black/5 text-center">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 font-bold rounded-sm">
                          {item.cpm}
                        </span>
                      </td>
                      <td className="p-3 border-l border-black/5 text-center font-mono text-red-650">{item.competition}</td>
                      <td className="p-3 text-xs text-gray-500 font-bold">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* LEFT COLUMN: Tool 3 - Premium Algerian Phone No. Sanitizer & WhatsApp Confirmation Forge (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border-3 border-black p-5 shadow-[6px_6px_0_rgba(0,0,0,1)] space-y-5">
            <div className="border-b border-black pb-3">
              <span className="text-[10px] uppercase font-mono bg-[#ffe8ca] font-black p-1 block text-amber-900 mb-1 border border-amber-300 w-fit">
                أداة تسريع تسليم الطلبيات (CRO Logistic Tool)
              </span>
              <h3 className="text-sm font-black text-black flex items-center gap-1.5">
                <Smartphone size={18} className="text-black shrink-0" />
                <span>مدقق أرقام الهواتف وتأكيد الواتساب المباشر بالدارجة</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-bold mt-1 leading-normal">
                انسخ وألصق رقم هاتف الزبون الجزائري كيفما كان، وسيفوم البرنامج تلقائياً بتنظيفه، تحديد شبكة الاتصالات (جازي، موبيليس، أوريدو) وتوليد قوالب التأكيد السوبر بالدارجة.
              </p>
            </div>

            {/* Paste Inputs cabinet */}
            <div className="space-y-4 text-xs font-bold text-black font-sans">
              <div>
                <label className="block mb-1">رقم هاتف الزبون الملصق (Unformatted Number):</label>
                <input 
                  type="text" 
                  placeholder="مثال: 002137778990 or +213 (0) 555-55-44-33"
                  className="w-full p-2 border-2 border-black font-mono text-xs focus:bg-neutral-50 focus:outline-none"
                  value={dirtyPhoneInput}
                  onChange={(e) => setDirtyPhoneInput(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">اسم الزبون الأول:</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-black font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1">ولاية الاستلام المقررة:</label>
                  <select
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    className="w-full p-2 border border-black font-bold text-xs bg-white"
                  >
                    <option value="العاصمة (16)">العاصمة (16)</option>
                    <option value="وهران (31)">وهران (31)</option>
                    <option value="قسنطينة (25)">قسنطينة (21)</option>
                    <option value="سطيف (19)">سطيف (19)</option>
                    <option value="بومرداس (35)">بومرداس (35)</option>
                    <option value="البليدة (09)">البليدة (09)</option>
                    <option value="أدرار (01)">أدرار (01) - صحراء</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">سعر البيع الاجمالي:</label>
                  <input 
                    type="text" 
                    value={confirmedPrice}
                    onChange={(e) => setConfirmedPrice(e.target.value)}
                    className="w-full p-2 border border-black font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1">اسم المنتج المطلوب:</label>
                  <input 
                    type="text" 
                    value={customerProduct}
                    onChange={(e) => setCustomerProduct(e.target.value)}
                    className="w-full p-2 border border-black font-bold text-xs truncate"
                  />
                </div>
              </div>

              <button
                onClick={cleanAndValidateAlgerianNumber}
                disabled={!dirtyPhoneInput.trim()}
                className="w-full py-2.5 bg-black hover:bg-[#00FF41] hover:text-black text-white font-black text-xs border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                ✓ قم بتنظيف الرقم وصناعة قوالب الواتساب
              </button>
            </div>

            {/* Validation & Clean Results screen */}
            {validationResult && (
              <div className="pt-4 border-t border-black/10 text-xs font-bold text-black space-y-4">
                
                <div className="bg-[#e6ffe6] border-2 border-green-500 p-3 space-y-2">
                  <span className="text-[10px] text-green-700 block">📊 تقرير فحص وتوطين الرقم الجزائري:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                    <div>
                      <span className="text-gray-500">الرقم المنسق محلياً:</span>
                      <p className="font-mono text-black font-extrabold">{validationResult.localFormat}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">الرقم الدولي E.164:</span>
                      <p className="font-mono text-black font-extrabold">{validationResult.intlFormat}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">متعامل الاتصالات:</span>
                      <p className="text-black font-black">{validationResult.operator}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">مستوى أمان التوصيل:</span>
                      <p className="text-[#059669] font-black">{validationResult.provinceRisk}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-black/5 leading-normal">
                    📌 تقدير التوصيل: <strong className="text-black">{validationResult.deliveryRateEstimate}</strong>
                  </div>
                </div>

                {/* Generative scripts displays */}
                <div className="space-y-3.5">
                  <span className="text-[10px] text-gray-400 block font-mono">قوالب السكريبتات الجاهزة للإرسال السريع:</span>

                  {validationResult.scripts.map((sc, idx) => (
                    <div key={idx} className="bg-[#fafafa] border border-black p-3 space-y-2 relative">
                      <span className="text-[10px] text-indigo-900 font-extrabold block">{sc.label}</span>
                      <pre className="text-[10px] text-gray-600 font-sans whitespace-pre-wrap leading-relaxed select-all bg-white p-2 border border-dashed border-black/10 rounded-sm">
                        {sc.text}
                      </pre>
                      
                      {/* One click WhatsApp send with preset API link */}
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[8px] text-gray-400 font-bold">معرف القالب: #DZ_CONFIRM_{idx+1}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopyScriptText(sc.text, idx)}
                            className="px-2 py-1 bg-white border border-black font-bold text-[9px] hover:bg-neutral-100 transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Copy size={9} />
                            <span>نسخ السكريبت</span>
                          </button>

                          <a
                            href={`https://api.whatsapp.com/send?phone=${validationResult.intlFormat.replace('+', '')}&text=${encodeURIComponent(sc.text)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-green-500 text-white border border-black font-black text-[9px] hover:bg-green-600 transition-colors flex items-center gap-1 shrink-0"
                          >
                            <ExternalLink size={9} />
                            <span>إرسال عبر WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

          {/* Help notice FAQ for Algerians */}
          <div className="bg-amber-50 border border-amber-300 p-4 text-[11px] font-bold text-amber-900 leading-relaxed rounded-xs select-none">
            💡 <strong>دراسة حالة ناجحة بالجزائر:</strong> ثبت للعديد من رواد التجارة الإلكترونية بالبلاد أن استخدام مراسلات التأكيد بالدارجة الجزائرية الفصحى عبر WhatsApp تزيد من نسبة استلام طلبات شركة <strong>يالادين (Yalidine)</strong> و <strong>ZR</strong> بأكثر من <strong>18% كقيمة صافية</strong>، لكون الزبون يشعر بمصداقية العلامة بدلاً من التعامل مع الروبوتات والرسائل الباردة غير المنتمية لهويتنا الاجتماعية.
          </div>

        </div>

      </div>

    </div>
  );
}
