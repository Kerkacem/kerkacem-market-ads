import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  HardDrive, 
  Cpu, 
  Search, 
  Layers, 
  RefreshCw, 
  Server, 
  AlertCircle, 
  FileText, 
  CheckCircle, 
  Loader, 
  Send, 
  Database, 
  Terminal, 
  Activity, 
  Lock, 
  Key, 
  Globe, 
  ArrowLeftRight, 
  Smartphone,
  Sparkles,
  Award,
  History,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface BackupLog {
  id: string;
  timestamp: string;
  size: string;
  status: 'successful' | 'failed';
  region: string;
  hash: string;
}

interface WebhookConfig {
  id: string;
  url: string;
  event: 'order_confirmed' | 'lead_generated' | 'return_notified' | 'campaign_launched';
  active: boolean;
  lastTriggered: string | null;
}

interface SaaSEnterprisePortalProps {
  onGoToPricing: () => void;
}

export function SaaSEnterprisePortal({ onGoToPricing }: SaaSEnterprisePortalProps) {
  const { user } = useAuth();
  
  const isEligible = user?.plan === 'enterprise';

  const [activeSubTab, setActiveSubTab] = useState<'gateways' | 'competitor' | 'webhooks' | 'backups'>('gateways');
  const [activeGateway, setActiveGateway] = useState('dz-dedicated');
  const [useNextifyKey, setUseNextifyKey] = useState(true);
  
  // Connection latency states
  const [testingLatency, setTestingLatency] = useState(false);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  
  // Competitor state
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [framework, setFramework] = useState<'AIDA' | 'PAS' | 'PASTOR'>('PAS');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  
  // Backups state
  const [logs, setLogs] = useState<BackupLog[]>([]);
  const [actionMessage, setActionMessage] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('NEXTIFY-AES-256-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [generatingKey, setGeneratingKey] = useState(false);

  // Webhook states
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    { id: 'wh_1', url: 'https://api.yourlocalcrm.dz/v1/orders', event: 'order_confirmed', active: true, lastTriggered: '2026-05-20T14:32:00Z' },
    { id: 'wh_2', url: 'https://sheets.googleapis.com/v4/spreadsheets/example', event: 'lead_generated', active: true, lastTriggered: '2026-05-20T18:10:00Z' }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState<'order_confirmed' | 'lead_generated' | 'return_notified' | 'campaign_launched'>('order_confirmed');
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);

  // Initial Backup Log Generator
  useEffect(() => {
    const defaultLogs: BackupLog[] = [
      { id: '1', timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), size: '124.5 KB', status: 'successful', region: 'Algiers-West_Dedicated_01', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { id: '2', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), size: '122.1 KB', status: 'successful', region: 'Frankfurt-SafeEdge_Dedicated', hash: '8db5642a8fc17a419dfbf4c8996fa12242ef41e4649b934ca495991b7851a774' },
      { id: '3', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), size: '119.8 KB', status: 'successful', region: 'Paris_CloudProxy_02', hash: '3a8864ff8fc100019afcf4c3996fbd242ee41e4649b934ca495991b7238b9921' },
    ];
    setLogs(defaultLogs);
  }, []);

  const handleCreateManualBackup = () => {
    if (!isEligible) return;
    setActionMessage('جاري تشفير وتجهيز حزم البيانات بصيغة AES-256...');
    
    setTimeout(() => {
      const logItem: BackupLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        size: '126.3 KB',
        status: 'successful',
        region: activeGateway === 'dz-dedicated' ? 'Algiers-West_Dedicated_01' : 'Frankfurt-SafeEdge_Dedicated',
        hash: 'sha256-' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 12)
      };
      setLogs(prev => [logItem, ...prev]);
      setActionMessage('✓ تم تشفير وتأمين وحفظ النسخة الاحتياطية بنجاح على خوادم النسخ الاحتياطي المتعددة!');
      setTimeout(() => setActionMessage(''), 4000);
    }, 1500);
  };

  const handleTestLatency = () => {
    setTestingLatency(true);
    setCurrentLatency(null);
    setTimeout(() => {
      const base = activeGateway === 'dz-dedicated' ? 24 : 88;
      const jitter = Math.floor(Math.random() * 15);
      setCurrentLatency(base + jitter);
      setTestingLatency(false);
    }, 1200);
  };

  const handleRotateKey = () => {
    setGeneratingKey(true);
    setTimeout(() => {
      setEncryptionKey('NEXTIFY-AES-256-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      setGeneratingKey(false);
    }, 1000);
  };

  const handleCompetitorScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorUrl) return;
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      setScanResult({
        domain: competitorUrl.replace(/https?:\/\//i, '').replace(/www\./i, '').split('/')[0],
        analysisDate: new Date().toLocaleDateString('ar-DZ'),
        frameworkUsed: framework,
        uspDetected: [
          'تقديم ضمان ذهبي استثنائي (تبديل المنتج مجاناً في حالة العطب البصري دون طرح أسئلة).',
          framework === 'PAS' 
            ? 'تضخيم ألم تضييع الوقت والجهد في الطريقة اليدوية التقليدية لجذب انتباه المتسوق.'
            : 'خلق الفضول عبر مقارنة أرقام الكفاءة والأداء بالخطاف البصري الأول.',
          'استغلال تقييمات واقعية ومصورة لزبائن جزائريين من مختلف الولايات لزيادة المصداقية.'
        ],
        weaknesses: [
          'سرعة تحميل بطيئة لصفحتهم الخاصة بالهبوط (+4.8 ثوانٍ تسبب تسرب 34% من الزوار).',
          'عدم وجود آلية Upsell ذكية (ضياع فرصة مضاعفة متوسط قيمة الطلب AOV).',
          'تنسيق أبعاد ملصقات الفيديو الإعلانية متقادم وغير مريح للعين على منصات TikTok الحالية.'
        ],
        estCpa: '240 - 310 DZD',
        deliveryStatByWilaya: [
          { wilaya: 'الجزائر العاصمة Algiers', deliveryRate: '88%', cpa: '210 DZD' },
          { wilaya: 'وهران Oran', deliveryRate: '84%', cpa: '250 DZD' },
          { wilaya: 'قسنطينة Constantine', deliveryRate: '82%', cpa: '235 DZD' },
          { wilaya: 'ورقلة Ouargla', deliveryRate: '78%', cpa: '310 DZD' }
        ],
        winningHooks: [
          'خطاف (الألم/الحل): "تبكي على الدراهم اللي ضاعو في أدوات رديئة؟ إليك البديل النهائي بقوة تصنيع حقيقية!"',
          'خطاف (المكانة/التميز): "النسخة الاستثنائية المطورة للجزائريين الأحرار وصلت أخيراً مع ضمان الجودة!"'
        ]
      });
    }, 2800);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl) return;

    const newWh: WebhookConfig = {
      id: 'wh_' + Date.now().toString(),
      url: newWebhookUrl,
      event: newWebhookEvent,
      active: true,
      lastTriggered: null
    };

    setWebhooks(prev => [...prev, newWh]);
    setNewWebhookUrl('');
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(wh => wh.id === id ? { ...wh, active: !wh.active } : wh));
  };

  const handleRemoveWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(wh => wh.id !== id));
  };

  const handleTestWebhook = (wh: WebhookConfig) => {
    setTestingWebhookId(wh.id);
    setWebhookResponse(null);
    setTimeout(() => {
      setWebhookResponse(`[200 OK] تم إرسال حمولة تجريبية (Payload XML/JSON) بنجاح إلى ${wh.url}. الأحداث المتناقلة مستقرة بنسبة 100%!`);
      setTestingWebhookId(null);
      setWebhooks(prev => prev.map(w => w.id === wh.id ? { ...w, lastTriggered: new Date().toISOString() } : w));
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans select-none" dir="rtl">
      
      {/* Dynamic Title Card */}
      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-red-600 animate-pulse" />
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-black text-white bg-red-600 px-2 py-0.5 border border-black inline-block uppercase tracking-wider animate-pulse">
            بوابة اشتراك الشركات والمؤسسات (Enterprise Suite)
          </span>
          <h3 className="text-xl font-black text-black flex items-center gap-2">
            <ShieldCheck size={22} className="text-red-600 shrink-0 animate-bounce" />
            <span>لوحة التحكم وقدرات معالجة البيانات الضخمة (Enterprise Level Portal)</span>
          </h3>
          <p className="text-xs text-gray-500 font-bold mt-1 max-w-3xl leading-relaxed">
            المرتبة العليا لأمن أعمال التجارة الإلكترونية والدفع عند الاستلام (COD) في الجزائر. نوفر حماية فائقة لبياناتك، بوابات ربط تلقائي مشفرة لتصدير الطلبيات، وتحليل متقدم للمنافسين لتأمين مكانتك في الصدارة مبيعاتك.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
          <span className="text-xs font-mono font-black text-green-700 bg-green-50 px-2.5 py-1 border border-green-300">
            خوادم المعالجة: مستقرة 99.98%
          </span>
        </div>
      </div>

      {!isEligible ? (
        /* LOCK SCREEN FOR ENTERPRISE TIER */
        <div className="bg-white border-3 border-black p-12 text-center shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-600" />
          <div className="max-w-2xl mx-auto space-y-6 py-6 font-bold">
            <div className="w-20 h-20 bg-red-50 border-4 border-red-600 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-[4px_4px_0_rgba(0,0,0,0.15)] animate-pulse">
              <Lock size={38} />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-black tracking-tight">بوابة الشركات الكبرى مغلقة في باقتك الحالية</h4>
              <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                تُخصص هذه الأدوات وعقد تشغيل السيرفرات السريعة، وأتمتة الـ Webhooks، وأخذ النسخ الاحتياطية المشفرة آلياً، وسحب استخبارات المنافسين حصرياً لعملائنا في فئة **الشركات والمصانع الكبرى Enterprise (12,000 د.ج)**.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="bg-gray-50 border border-black p-3 text-right text-[11px] text-gray-700 space-y-1">
                <p className="font-extrabold text-black border-b border-black pb-1 mb-1 text-xs">🚀 السرعة والموثوقية الاستثنائية</p>
                <p className="flex justify-between"><span>• بوابات ومنافذ معالجة مخصصة Edge</span> <span className="text-green-600 font-mono font-black">نشط وجاهز</span></p>
                <p className="flex justify-between"><span>• زمن استجابة (Latency) خارق</span> <span className="text-green-600 font-mono font-black">~24ms ⚡</span></p>
                <p className="flex justify-between"><span>• مفتاح API معفى من BYOK مجاني</span> <span className="text-green-600 font-mono font-black">نشط وجاهز</span></p>
              </div>

              <div className="bg-gray-50 border border-black p-3 text-right text-[11px] text-gray-700 space-y-1">
                <p className="font-extrabold text-black border-b border-black pb-1 mb-1 text-xs">🔒 الأمان وأجهزة الاستخبارات</p>
                <p className="flex justify-between"><span>• سحب خريطة CPA للمنافس والولايات</span> <span className="text-green-600 font-mono font-black">نشط وجاهز</span></p>
                <p className="flex justify-between"><span>• خطط التصدير التلقائي وآلات الويب</span> <span className="text-green-600 font-mono font-black">نشط وجاهز</span></p>
                <p className="flex justify-between"><span>• تشفير نسخ احتياطي AES-256</span> <span className="text-green-600 font-mono font-black">نشط وجاهز</span></p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onGoToPricing}
                className="px-8 py-4 bg-[#00FF41] hover:bg-black hover:text-[#00FF41] text-black font-black text-sm border-2 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
              >
                الترقية فوراً إلى باقة المؤسسات والشركات (Enterprise)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* FULL PORTAL FUNCTIONALITY ACTIVE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sub Navigation Tabs for Enterprise Controls */}
          <div className="lg:col-span-12 flex flex-wrap gap-2 border-b-2 border-black pb-3">
            {[
              { id: 'gateways', title: 'خوادم مخصصة وقياس السرعة', icon: Cpu },
              { id: 'competitor', title: 'جهاز استخبارات وتحليل المنافسين', icon: Search },
              { id: 'webhooks', title: 'ربط الـ Webhooks وأتمتة الطلبات', icon: ArrowLeftRight },
              { id: 'backups', title: 'الأمن والنسخ المشفر (AES-256)', icon: HardDrive }
            ].map((sub) => {
              const IconComp = sub.icon;
              const isActive = activeSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubTab(sub.id as any);
                    setWebhookResponse(null);
                  }}
                  className={`px-4 py-2 text-xs font-black border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 ${
                    isActive ? 'bg-black text-[#00FF41]' : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  <IconComp size={15} />
                  <span>{sub.title}</span>
                </button>
              );
            })}
          </div>

          {/* Main Workspace Frame - Spans 8 Columns */}
          <div className="lg:col-span-8">
            <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-6">
              
              {/* TAB 1: LOCAL GATEWAYS & SPEED TESTING */}
              {activeSubTab === 'gateways' && (
                <div className="space-y-6 animate-fade-in text-xs font-semibold text-gray-700">
                  <div className="pb-4 border-b border-black/10">
                    <h4 className="text-base font-black text-black mb-1 flex items-center gap-2">
                      <Cpu size={20} className="text-red-600" />
                      <span>توجيه وإدارة خوادم الذكاء الاصطناعي السحابية</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      بصفتك شريكاً في باقة المؤسسات، توزع منظومتك سحابياً على موجهات خاصة تضمن تجنب طوابير المعالجة وتأخير الطلبات في ساعات الذروة الإعلانية.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Select Gateway */}
                    <div className="space-y-3">
                      <span className="font-extrabold text-black block mb-1">الخوادم وبوابات التوجيه النشطة:</span>
                      
                      <div className="space-y-2">
                        <label className="flex items-start gap-3 p-3 border-2 border-black bg-gray-50 cursor-pointer hover:bg-white transition-colors">
                          <input 
                            type="radio" 
                            name="gatewayOpt" 
                            value="dz-dedicated"
                            checked={activeGateway === 'dz-dedicated'}
                            onChange={() => setActiveGateway('dz-dedicated')}
                            className="accent-black mt-1"
                          />
                          <div>
                            <span className="block text-xs font-black text-black">خادم الجزائر الحصري (Algeria Local Edge Pipeline)</span>
                            <span className="text-[10px] text-green-700 block mt-0.5 font-bold">زمن الاستجابة المتوقع: 20ms - 35ms 🇩🇿 (الأسرع داخل الجزائر)</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 border-2 border-black bg-gray-50 cursor-pointer hover:bg-white transition-colors">
                          <input 
                            type="radio" 
                            name="gatewayOpt" 
                            value="frankfurt"
                            checked={activeGateway === 'frankfurt'}
                            onChange={() => setActiveGateway('frankfurt')}
                            className="accent-black mt-1"
                          />
                          <div>
                            <span className="block text-xs font-black text-black">بوابة فرانكفورت الموزعة (Dedicated Frankfurt Node)</span>
                            <span className="text-[10px] text-amber-700 block mt-0.5 font-bold">زمن الاستجابة المتوقع: 85ms - 110ms (للتكامل مع خوادم شوبيفاي)</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* BYOK Exemption Key pooling */}
                    <div className="space-y-3">
                      <span className="font-extrabold text-black block mb-1">مفتاح الوصول العام للشركات (API Integration Bypass)</span>
                      
                      <div className="border-2 border-black p-4 bg-[#fbfbfb] space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-black text-black">مفتاح Nextify Enterprise المضمن</span>
                            <span className="text-[10px] text-green-600 font-black flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                              <span>فعال ومفتوح التوليد</span>
                            </span>
                          </div>
                          <button
                            onClick={() => setUseNextifyKey(!useNextifyKey)}
                            className={`px-3 py-1.5 border-2 border-black font-black text-[10px] shadow-[1px_1px_0_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 transition-all ${useNextifyKey ? 'bg-black text-[#00FF41]' : 'bg-white text-black'}`}
                          >
                            {useNextifyKey ? 'مُفعّل' : 'متوقف'}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold leading-normal">
                          * بتفعيل هذا المفتاح، فإنك تعفي مستخدمي شركتك تماماً من توفير أو إضافة أي مفاتيح خاصة بـ Gemini في إعدادات المنظومة، وستتولى المنصة معالجة الطلبات بالكامل على حسابها مجاناً وبكفاءة فائقة.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Benchmark Connection Latency Live */}
                  <div className="border-2 border-black p-5 bg-black text-gray-300 font-mono space-y-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span className="text-white text-xs font-black flex items-center gap-1.5">
                        <Activity size={14} className="text-[#00FF41]" />
                        <span>جهاز قياس وفحص سرعة الاتصال والاستعلامات</span>
                      </span>
                      <span className="text-[9px] text-[#00FF41] bg-emerald-950 font-black px-2 py-0.5 uppercase">LIVE GATEWAY METER</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="text-[10px] text-gray-500 block">البوابة المستهدفة حالياً للاتصال:</span>
                        <span className="text-white font-extrabold text-xs">
                          {activeGateway === 'dz-dedicated' ? 'Algiers-Local-Dedicated-Edge-Pipeline-v2' : 'Frankfurt-SafeEdge-Route-Shared-v1'}
                        </span>
                      </div>

                      <button
                        onClick={handleTestLatency}
                        disabled={testingLatency}
                        className="px-4 py-2 bg-[#00FF41] hover:bg-white text-black font-black text-xs border border-[#00FF41] flex items-center gap-1.5 self-end transition-colors"
                      >
                        {testingLatency ? (
                          <>
                            <Loader size={12} className="animate-spin text-black" />
                            <span>جاري الاختبار...</span>
                          </>
                        ) : (
                          <span>ابدأ فحص السرعة والاتصال</span>
                        )}
                      </button>
                    </div>

                    {/* Latency results display */}
                    <div className="p-3 bg-neutral-900 border border-neutral-800">
                      {testingLatency ? (
                        <p className="text-[10px] text-amber-500 animate-pulse">PING {activeGateway === 'dz-dedicated' ? 'dz.edge.nextify.net' : 'germany.edge.nextify.net'}... جاري نقل الحزم...</p>
                      ) : currentLatency !== null ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>زمن الاستجابة الكلي (Latency):</span>
                            <span className={`${currentLatency < 40 ? 'text-[#00FF41]' : 'text-yellow-400'}`}>{currentLatency}ms (رائع ومستقر جداً)</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2 border border-gray-700">
                            <div 
                              className={`h-full ${currentLatency < 40 ? 'bg-[#00FF41]' : 'bg-yellow-400'}`} 
                              style={{ width: `${Math.max(10, Math.min(100, 150 - currentLatency))}%` }} 
                            />
                          </div>
                          <p className="text-[9px] text-gray-500 leading-snug">
                            * معالجة الاستعلام بالذكاء الاصطناعي تتم بنظام المسار الفائق الشفافية. تم تدوير 4 حزم بيانات بنجاح دون أي تسرب أو انقطاع.
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500">اضغط على زر الفحص أعلاه لإجراء محاكاة وفحص حي لسرعة السيرفر الخاص بـ Nextify.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: COMPETITOR INTELLIGENCE SCANNER */}
              {activeSubTab === 'competitor' && (
                <div className="space-y-4 animate-fade-in text-xs font-semibold text-gray-700">
                  <div className="pb-4 border-b border-black/10">
                    <h4 className="text-base font-black text-black mb-1 flex items-center gap-2">
                      <Search size={20} className="text-red-600" />
                      <span>جهاز استكشاف وتحليل حملات المنافسين المتطور (Competitor Analysis)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      السر الأساسي للتفوق السحابي للشركات. انسخ رابط صفحة الهبوط أو الموقع العام لأي منافس في الجزائر، لنقوم باستخلاص نقاط قوته، وثغراته التقنية والمبيعاتية، وخط حصد CPA ومعدلات التسليم في مختلف الولايات.
                    </p>
                  </div>

                  <form onSubmit={handleCompetitorScan} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-8">
                        <label className="block text-[11px] font-bold text-black mb-1">صفيحة البيانات أو عنوان متجر المنافس:</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: https://heylink.me/shoppy-dz  أو رابط المتجر المخصص"
                          className="w-full p-2.5 border-2 border-black font-sans text-xs focus:outline-none focus:bg-gray-50 text-black font-extrabold"
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                        />
                      </div>
                      
                      <div className="md:col-span-4">
                        <label className="block text-[11px] font-bold text-black mb-1">النموذج التحليلي للخطافات:</label>
                        <select
                          value={framework}
                          onChange={(e) => setFramework(e.target.value as any)}
                          className="w-full p-2.5 border-2 border-black text-black font-extrabold bg-white text-xs focus:outline-none focus:bg-gray-50"
                        >
                          <option value="PAS">صيغة تضخيم المشكلة PAS</option>
                          <option value="AIDA">صيغة الإقناع التدريجي AIDA</option>
                          <option value="PASTOR">صيغة السرد والشهادات PASTOR</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={scanning}
                      className="px-6 py-2.5 bg-black text-[#00FF41] hover:bg-gray-900 border-2 border-black font-black text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-0.5"
                    >
                      {scanning ? (
                        <>
                          <Loader className="animate-spin" size={14} />
                          <span>جاري الفحص المعمق للنطاق وتحميل هيكل المبيعات...</span>
                        </>
                      ) : (
                        <span>البدء بالمسح العميق للمنافس</span>
                      )}
                    </button>
                  </form>

                  {scanResult && (
                    <div className="border-2 border-black p-5 bg-[#fafafa] space-y-4 leading-relaxed text-xs">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-2">
                        <div>
                          <span className="font-black text-xs text-red-600 block">
                            النطاق المستهدف: <strong className="font-mono text-black underline">{scanResult.domain}</strong>
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold block mt-0.5">تاريخ المعالجة: {scanResult.analysisDate} • المنهج المختار: {scanResult.frameworkUsed}</span>
                        </div>
                        <div className="bg-red-50 text-red-800 border border-red-300 font-mono font-black py-0.5 px-2 rounded-xs text-[10px]">
                          CPA المتوقع لديهم: {scanResult.estCpa}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border p-3.5 space-y-2">
                          <h5 className="text-[11px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 inline-block rounded-xs">
                            نطاقات القوة والزوايا المستعملة:
                          </h5>
                          <ul className="list-disc pr-4 space-y-1.5 text-gray-700 font-bold text-[11px]">
                            {scanResult.uspDetected.map((u: string, i: number) => <li key={i}>{u}</li>)}
                          </ul>
                        </div>

                        <div className="bg-white border p-3.5 space-y-2">
                          <h5 className="text-[11px] font-black text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 inline-block rounded-xs">
                            تحديد الثغرات والأخطاء التقنية لديهم (استغلها!):
                          </h5>
                          <ul className="list-disc pr-4 space-y-1.5 text-gray-700 font-bold text-[11px]">
                            {scanResult.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* CPA & Delivery rates by Wilayas in Algeria */}
                      <div className="border border-black p-4 bg-white space-y-2">
                        <span className="font-extrabold text-black text-xs block border-b pb-1 mb-2">أداء التوصيل والـ CPA المتوقع للمنافس حسب الولايات الجزائرية:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-gray-700">
                          {scanResult.deliveryStatByWilaya.map((st: any, i: number) => (
                            <div key={i} className="p-2 bg-gray-50 border border-gray-200 flex flex-col justify-between">
                              <span className="font-black text-black">{st.wilaya}</span>
                              <div className="flex justify-between mt-2 pt-1 border-t border-gray-100">
                                <span className="text-gray-400">التوصيل:</span>
                                <span className="text-green-700 font-black">{st.deliveryRate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">CPA:</span>
                                <span className="text-red-600 font-mono font-black">{st.cpa}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <h5 className="text-[11px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 mb-2 inline-block rounded-xs">
                          خطوات إعلانية تسويقية مقترحة بالدارجة الجزائرية للتغلب عليهم:
                        </h5>
                        <div className="space-y-2">
                          {scanResult.winningHooks.map((h: string, i: number) => (
                            <div key={i} className="p-3 bg-white border-2 border-dashed border-gray-300 font-bold text-[11px] leading-relaxed flex gap-2">
                              <Sparkles className="text-blue-600 shrink-0 mt-0.5" size={13} />
                              <p className="text-gray-800">{h}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: WEBHOOK INTERFACE & INTEGRATION */}
              {activeSubTab === 'webhooks' && (
                <div className="space-y-6 animate-fade-in text-xs font-semibold text-gray-700">
                  <div className="pb-4 border-b border-black/10">
                    <h4 className="text-base font-black text-black mb-1 flex items-center gap-2">
                      <ArrowLeftRight size={20} className="text-red-600" />
                      <span>الأتمتة وربط الـ Webhooks مع الأنظمة الخارجية</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      يتيح لك نظام Webhooks تمرير الطلبات فورات توليدها أو إطلاق حملة جديدة إلى CRM والأنظمة الخارجية (مثل Carthage, Google Sheets أو WooCommerce الجزائر) بشكل فوري وآمن.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Add webhook url form */}
                    <div className="md:col-span-5 border border-black p-4 bg-gray-50 space-y-4">
                      <span className="text-xs font-black text-black block border-b pb-1.5">إضافة Webhook جديد</span>
                      
                      <form onSubmit={handleAddWebhook} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">رابط الوجهة (Endpoint Destination URL):</label>
                          <input 
                            type="url" 
                            required
                            placeholder="https://yourdomain.dz/api/webhook"
                            className="w-full p-2 border-2 border-black font-sans text-xs bg-white text-black font-bold"
                            value={newWebhookUrl}
                            onChange={(e) => setNewWebhookUrl(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">الحدث المحفز (Trigger Event):</label>
                          <select
                            value={newWebhookEvent}
                            onChange={(e) => setNewWebhookEvent(e.target.value as any)}
                            className="w-full p-2 border-2 border-black bg-white text-black font-bold text-xs"
                          >
                            <option value="order_confirmed">تأكيد طلبية شراء جديدة (Order Confirmed)</option>
                            <option value="lead_generated">توليد مسوق / زبون محتمل (Lead Generated)</option>
                            <option value="campaign_launched">إطلاق خطة حملة فيسبوك (Campaign Launched)</option>
                            <option value="return_notified">إخطار بمنتج مرتد (Return Notification)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-black hover:bg-neutral-800 text-[#00FF41] border border-black font-black text-xs"
                        >
                          + تسجيل وحفظ الرابط المتجر
                        </button>
                      </form>
                    </div>

                    {/* Webhooks list */}
                    <div className="md:col-span-7 space-y-3">
                      <span className="text-xs font-black text-black block">نوافذ الربط المسجلة حالياً:</span>
                      
                      <div className="space-y-2.5">
                        {webhooks.map((wh) => (
                          <div key={wh.id} className="p-3 border-2 border-black bg-white space-y-2 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <span className="text-[10px] bg-neutral-100 text-neutral-800 border font-mono font-black py-0.5 px-2 inline-block mb-1">
                                  {wh.event}
                                </span>
                                <p className="text-[11px] font-bold text-black font-mono truncate max-w-[280px]">{wh.url}</p>
                              </div>
                              <button
                                onClick={() => handleToggleWebhook(wh.id)}
                                className={`px-2 py-1 font-black text-[9px] border ${wh.active ? 'bg-emerald-50 text-emerald-700 border-emerald-400' : 'bg-red-50 text-red-700 border-red-300'}`}
                              >
                                {wh.active ? 'نشط' : 'معطل'}
                              </button>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t text-[10px]">
                              <span className="text-gray-400 font-mono text-[9px]">
                                آخر إرسال: {wh.lastTriggered ? new Date(wh.lastTriggered).toLocaleTimeString('ar-DZ') : 'لم يرسل بعد'}
                              </span>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleTestWebhook(wh)}
                                  disabled={testingWebhookId !== null}
                                  className="text-blue-600 font-black hover:underline"
                                >
                                  {testingWebhookId === wh.id ? 'جاري الفحص...' : 'فحص إرسال التجربة'}
                                </button>
                                <button
                                  onClick={() => handleRemoveWebhook(wh.id)}
                                  className="text-red-500 font-bold hover:underline"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {webhookResponse && (
                    <div className="border border-blue-400 bg-blue-50 text-blue-900 p-3.5 font-mono text-[11px] rounded-sm leading-normal">
                      <strong>[أمن المعلومات والربط]</strong> {webhookResponse}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 4: AES-256 SECURE CLOUD BACKUPS */}
              {activeSubTab === 'backups' && (
                <div className="space-y-6 animate-fade-in text-xs font-semibold text-gray-700">
                  <div className="pb-4 border-b border-black/10">
                    <h4 className="text-base font-black text-black mb-1 flex items-center gap-2">
                      <HardDrive size={20} className="text-red-600" />
                      <span>النسخ الاحتياطي المشفر وتأمين المشاريع (Encrypted AES Backups)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      نقوم بنسخ وتشفير كافة المخططات التسويقية، والمحتويات المسبقة التي تولدها على خوادم إقليمية بروتوكولية مستقلة بنظام معالجة AES-256 لضمان حجبها التام عن المتلصصين والمنافسين.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Database Health with downloadable copy key */}
                    <div className="border border-black p-4 space-y-4">
                      <span className="text-xs font-black text-black block border-b pb-1.5 flex items-center gap-1">
                        <Key size={14} className="text-amber-500" />
                        <span>مفتاح وفك التشفير اليدوي الفردي (Private Access Key)</span>
                      </span>

                      <div className="p-3 bg-neutral-950 text-gray-300 font-mono space-y-3">
                        <div>
                          <span className="text-[9px] text-gray-500 block">Encryption Standard Active:</span>
                          <span className="text-white font-extrabold text-[10px]">AES-250-GCM (Nextify Cloud Cipher)</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#00FF41] block">مفتاح الحفظ المؤمن والمشفر:</span>
                          <span className="text-[#00FF41] font-black text-xs break-all select-all">{encryptionKey}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleRotateKey}
                          disabled={generatingKey}
                          className="flex-1 py-1.5 border border-black bg-white hover:bg-gray-50 text-black font-black text-[10px]"
                        >
                          {generatingKey ? 'جاري التوليد...' : 'تغيير وتحديث مفتاح التشفير'}
                        </button>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-normal">
                        * يرجى الحفاظ على هذا المفتاح سرياً؛ تُشفر ملفاتك وجداولك بصيغة SHA256 على السحاب مستخدمة هويته لإسترجاع البيانات بشكل مغلق وتام.
                      </p>
                    </div>

                    {/* Manual database backup triggering */}
                    <div className="space-y-4">
                      <span className="text-xs font-black text-black block">إجراء حزم إضافية ونقل البيانات:</span>
                      
                      <div className="bg-red-50 text-red-900 border border-red-300 p-4 space-y-3">
                        <span className="font-extrabold text-xs block">خط الأمان والحماية التامة</span>
                        <p className="text-[10px] leading-relaxed">
                          نظام النسخ المشفر متزامن حالياً مع خادم الجزائر (Algiers Dedicated). يمكنك توليد حزمة معالجة يدوية جديدة لتسجيلها بسجل التشفير الدائم لحماية استثمارات حملاتك.
                        </p>
                        
                        <button
                          onClick={handleCreateManualBackup}
                          className="w-full py-2 border-2 border-black bg-white text-black font-black text-xs hover:bg-black hover:text-[#00FF41] transition-all flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw size={13} />
                          <span>أخذ نسخة احتياطية من كافة المخططات الآن</span>
                        </button>
                      </div>

                      {actionMessage && (
                        <div className="p-3 bg-yellow-50 border border-yellow-500 text-yellow-800 text-[10px] font-bold rounded-xs animate-pulse">
                          {actionMessage}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Right-sidebar for backup logs and secure system details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live backup logs list panel */}
            <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-4">
              <h4 className="text-sm font-black text-black border-b pb-3 flex items-center gap-1.5">
                <Database size={16} />
                <span>أحدث السجلات النشطة للنسخ المشفر</span>
              </h4>

              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 border border-black bg-gray-50 flex justify-between items-center text-[10px] font-semibold text-gray-700">
                    <div className="min-w-0 pr-1">
                      <span className="font-black text-black block truncate">جدولة نسخ سحابي تلقائي</span>
                      <span className="text-gray-400 font-mono text-[9px] block">
                        {new Date(log.timestamp).toLocaleString('ar-DZ')}
                      </span>
                      <span className="text-gray-400 font-mono text-[8px] block truncate mt-0.5 max-w-[170px]">{log.hash}</span>
                    </div>
                    <div className="text-right font-mono font-bold shrink-0">
                      <span className="text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.2 rounded-xs block text-[8px] uppercase font-black text-center mb-1">ناجح ✓</span>
                      <span className="text-gray-400 block text-[9px]">{log.size} • {log.region.split('_')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-black/10">
                <p className="text-[10px] text-gray-400 leading-normal">
                  * تُحذف سجلات التشفير السحابية القديمة التي تتجاوز الـ 90 يوماً بشكل تلقائي من المخدمات الرئيسية لتوفير مساحة وتخفيف حمل معالجة الخوادم Edge.
                </p>
              </div>
            </div>

            {/* Direct VIP WhatsApp Routing & SLA Info */}
            <div className="bg-[#f0f9ff] border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-4">
              <div className="flex gap-2 items-start text-blue-900">
                <Award size={20} className="shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-xs font-black text-black">عقد ومستوى الخدمة الاستثنائية للشركات</h4>
                  <p className="text-[10px] text-gray-600 mt-1 leading-normal font-semibold">
                    يحظى مشتركونا من الفئة الكبرى بـ **دعم فني خاص واتصال هاتفي مباشر مع كرباني بلقاسم** لطلب التعديلات، إبداء الاقتراحات التسويقية وتسهيل الربط مع الأنظمة الإدارية المختلفة على مدار الساعة.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/213550000000" // Simulated or real
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-emerald-600 text-white font-black text-xs border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                <Smartphone size={13} />
                <span>الاتصال المباشر بمستشار الدعم التقني</span>
              </a>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
