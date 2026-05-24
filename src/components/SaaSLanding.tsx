import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  FolderPlus, 
  Folder, 
  Trash2, 
  LogOut, 
  Settings, 
  Compass, 
  LayoutDashboard, 
  CreditCard, 
  Activity, 
  BadgeAlert, 
  TrendingUp, 
  Eye, 
  Users, 
  Globe, 
  Target, 
  ShieldAlert,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { ProjectData } from '../App';
import { SaaSTeamManager } from './SaaSTeamManager';
import { SaaSWhiteLabel } from './SaaSWhiteLabel';
import { SaaSEnterprisePortal } from './SaaSEnterprisePortal';
import { SaaSMarketingHub } from './SaaSMarketingHub';

interface SaaSLandingProps {
  onSelectProject: (proj: ProjectData) => void;
  onStartNewProject: (name: string, price?: string, images?: string[]) => void;
  onGoToPricing: () => void;
  onGoToAdmin: () => void;
  projects: ProjectData[];
  onDeleteProject: (id: string) => Promise<void>;
  onCreateNewProjectTrigger: () => void;
}

export function SaaSLanding({
  onSelectProject,
  onStartNewProject,
  onGoToPricing,
  onGoToAdmin,
  projects,
  onDeleteProject,
  onCreateNewProjectTrigger
}: SaaSLandingProps) {
  const { user, logout, serverDbAvailable, updateProfile, updateGeminiKey } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'profile' | 'team' | 'whitelabel' | 'enterprise_portal' | 'marketing_hub'>('dashboard');
  
  // Profile settings state
  const [fullNameInput, setFullNameInput] = useState(user?.fullName || '');
  const [geminiKeyInput, setGeminiKeyInput] = useState(user?.geminiApiKeyToken || '');
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);
  
  // Interactive DZ State stats mock
  const [wilayaStats] = useState([
    { code: '16', name: 'الجزائر العاصمة', orders: 154, ctr: '4.8%', color: 'bg-green-500' },
    { code: '31', name: 'وهران', orders: 98, ctr: '3.9%', color: 'bg-green-400' },
    { code: '25', name: 'قسنطينة', orders: 84, ctr: '4.2%', color: 'bg-green-400' },
    { code: '19', name: 'سطيف', orders: 76, ctr: '3.5%', color: 'bg-amber-400' },
    { code: '09', name: 'البليدة', orders: 72, ctr: '4.1%', color: 'bg-green-400' },
    { code: '35', name: 'بومرداس', orders: 45, ctr: '3.1%', color: 'bg-amber-400' },
  ]);

  // COD ROI Forecast Dashboard State Variables (Algeria B2B SaaS 2026 Strategy)
  const [roiAdsSpend, setRoiAdsSpend] = useState<number>(10000); // DZD
  const [roiSourcingCost, setRoiSourcingCost] = useState<number>(1200); // DZD
  const [roiSalePrice, setRoiSalePrice] = useState<number>(3900); // DZD
  const [roiDeliveryRate, setRoiDeliveryRate] = useState<number>(65); // %
  const [roiShippingFee, setRoiShippingFee] = useState<number>(750); // DZD
  const [roiConfirmFee, setRoiConfirmFee] = useState<number>(150); // DZD
  const [roiReturnPenalty, setRoiReturnPenalty] = useState<number>(400); // DZD
  const [roiCpa, setRoiCpa] = useState<number>(800); // DZD

  useEffect(() => {
    if (user) {
      setFullNameInput(user.fullName);
      setGeminiKeyInput(user.geminiApiKeyToken || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveProfileSuccess(false);
    
    // Save profile settings
    const profileRes = await updateProfile(fullNameInput, user?.avatarUrl || '');
    const keyRes = await updateGeminiKey(geminiKeyInput);
    
    if (profileRes.success && keyRes.success) {
      setSaveProfileSuccess(true);
      setTimeout(() => setSaveProfileSuccess(false), 3000);
    }
  };

  // Limits based on plans
  const planLimits = {
    free: 3,
    pro: 20,
    agency: Infinity,
    enterprise: Infinity
  };

  const currentLimit = planLimits[user?.plan || 'free'];
  const percentageUsed = currentLimit === Infinity ? 0 : Math.min(100, (projects.length / currentLimit) * 100);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col md:flex-row font-sans selection:bg-[#00FF41]">
      
      {/* Side Control Cabinet */}
      <aside className="w-full md:w-64 bg-white border-b-2 md:border-b-0 md:border-l-3 border-black shrink-0 flex flex-col justify-between p-6">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-black text-black tracking-tighter flex items-center gap-2">
              MARKETING MASTER <span className="bg-[#00FF41] px-1 py-0.5 border border-black text-xs">SAAS</span>
            </h2>
            <p className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase mt-1">Core Engine Workspace</p>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-right py-3 px-4 border-2 border-black font-black text-xs flex items-center justify-between transition-all ${
                activeTab === 'dashboard' ? 'bg-[#00FF41] text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                <span>لوحة التحكم الرئيسية</span>
              </span>
              <span className="font-mono bg-black text-white text-[10px] px-1.5 py-0.5 rounded-sm">{projects.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-right py-3 px-4 border-2 border-black font-black text-xs flex items-center justify-between transition-all ${
                activeTab === 'analytics' ? 'bg-[#ffe8ca] text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Compass size={16} />
                <span>إحصائيات وتحليلات القيمة</span>
              </span>
              <span className="text-[9px] bg-red-400 text-white font-mono px-1.5 py-0.5 rounded-sm">شائع (DZ)</span>
            </button>

            <button 
              onClick={() => setActiveTab('marketing_hub')}
              className={`w-full text-right py-3 px-4 border-2 border-black font-black text-xs flex items-center justify-between transition-all ${
                activeTab === 'marketing_hub' ? 'bg-[#c084fc] text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Target size={16} className="text-purple-950 shrink-0" />
                <span className="text-neutral-900 font-extrabold text-xs">مركز التجسس والأدوات الذكية</span>
              </span>
              <span className="text-[9px] bg-purple-600 text-white font-mono px-1.5 py-0.5 font-bold rounded-xs">جديد ⭐️</span>
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-right py-3 px-4 border-2 border-black font-black text-xs flex items-center gap-2 transition-all ${
                activeTab === 'profile' ? 'bg-[#dfebff] text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <Settings size={16} />
              <span>إعدادات الملف الشخصي</span>
            </button>

            {/* Team Seat Manager Tab */}
            <button 
              onClick={() => setActiveTab('team')}
              className={`w-full text-right py-3 px-4 border-2 border-black font-black text-xs flex items-center justify-between transition-all ${
                activeTab === 'team' ? 'bg-[#99f6e4] text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users size={16} />
                <span>إدارة فرق العمل والحسابات</span>
              </span>
              {!(user?.plan === 'agency' || user?.plan === 'enterprise') && (
                <span className="text-[8px] bg-amber-100 text-amber-800 border border-amber-300 font-extrabold px-1.5 py-0.2 rounded-xs">PRO+</span>
              )}
            </button>

            {/* White Label Settings Tab */}
            <button 
              onClick={() => setActiveTab('whitelabel')}
              className={`w-full text-right py-3 px-4 border-2 border-black font-black text-xs flex items-center justify-between transition-all ${
                activeTab === 'whitelabel' ? 'bg-[#fef08a] text-black shadow-[4px_4px_0_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe size={16} />
                <span>العلامة البيضاء (White Label)</span>
              </span>
              {!(user?.plan === 'agency' || user?.plan === 'enterprise') && (
                <span className="text-[8px] bg-amber-100 text-amber-800 border border-amber-300 font-extrabold px-1.5 py-0.2 rounded-xs">AGENCY+</span>
              )}
            </button>

            {/* Enterprise Portal Tab */}
            <button 
              onClick={() => setActiveTab('enterprise_portal')}
              className={`w-full text-right py-3 px-4 border-2 border-black font-black text-xs flex items-center justify-between transition-all ${
                activeTab === 'enterprise_portal' ? 'bg-[#fecdd3] text-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-black' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-red-600" />
                <span>بوابة الشركات Enterprise</span>
              </span>
              {user?.plan !== 'enterprise' && (
                <span className="text-[8px] bg-red-100 text-red-800 border border-red-300 font-extrabold px-1.5 py-0.2 rounded-xs">SENSATIVE</span>
              )}
            </button>

            <button 
              onClick={onGoToPricing}
              className="w-full text-right py-3 px-4 border-2 border-black bg-white hover:bg-gray-100 text-black font-black text-xs flex items-center gap-2 transition-all"
            >
              <CreditCard size={16} className="text-amber-600" />
              <span>ترقية خطط الأسعار</span>
            </button>

            {/* Admin trigger rendering only for Authorized Admin */}
            {user?.email === 'kerkacem@gmail.com' && (
              <button 
                onClick={onGoToAdmin}
                className="w-full text-right py-3 px-4 border-2 border-black/30 border-dashed bg-white hover:bg-red-50 text-red-600 font-bold text-xs flex items-center gap-2 transition-all animate-pulse"
              >
                <ShieldAlert size={16} />
                <span>لوحة الإدارة للرئيس كرباني بلقاسم (ADMIN)</span>
              </button>
            )}
          </div>
        </div>

        {/* User profile capsule bottom */}
        <div className="pt-6 border-t font-sans space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=MarketingMaster`} 
              alt={user?.fullName} 
              className="w-10 h-10 border border-black bg-gray-100"
            />
            <div className="truncate">
              <span className="text-xs font-black block text-black truncate">{user?.fullName}</span>
              <span className="text-[9px] font-mono text-gray-400 block truncate">{user?.email}</span>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full py-2.5 border-2 border-black bg-red-100 text-red-900 font-black text-xs flex items-center justify-center gap-2 hover:bg-red-200 transition-all select-none"
          >
            <LogOut size={14} />
            <span>تسجيل الخروج</span>
          </button>

          <div className="text-center pt-3 border-t border-gray-100" dir="rtl">
            <span className="text-[10px] text-gray-400 block font-bold leading-relaxed">
              تصميم كرباني بلقاسم
            </span>
            <span className="text-[10px] text-gray-500 block font-black uppercase tracking-wider">
              KERBANI BELKACEM
            </span>
          </div>
        </div>
      </aside>

      {/* Main panel body */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto custom-scrollbar">
        
        {/* Top bar indicators */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-black uppercase bg-[#00FF41] border border-black px-2 py-0.5">
              خطة {user?.plan === 'free' ? 'مستخدِم عادي' : user?.plan === 'pro' ? 'المحترفين Pro' : user?.plan === 'agency' ? 'الوكالة Agency' : user?.plan === 'enterprise' ? 'الشركات والمؤسسات Enterprise' : user?.plan}
            </span>
            <span className="text-[10px] text-gray-400 font-bold font-mono">
              بوابة: {serverDbAvailable ? 'SERVER ACTIVE' : 'LOCAL INTEGRATION'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentLimit !== Infinity && (
              <div className="text-left">
                <span className="text-[10px] font-black mr-2 text-black">المشاريع المستعملة: {projects.length} / {currentLimit}</span>
                <div className="w-28 h-2 bg-gray-200 border border-black rounded-sm inline-block overflow-hidden">
                  <div className="h-full bg-black transition-all" style={{ width: `${percentageUsed}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Callout box upgrade */}
            {user?.plan === 'free' && (
              <div className="bg-[#fff9eb] border-2 border-amber-500 p-5 shadow-[4px_4px_0_rgba(245,158,11,0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-3 items-start">
                  <BadgeAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-black text-[#854d0e] text-xs">ترقية الاشتراك لفتح القوة الكاملة المنظومة!</h4>
                    <p className="text-[11px] text-amber-700 leading-relaxed mt-1">
                      أنت حالياً على الاشتراك المجاني. الترقية لخطة **Pro** تتيح لك تخزين حتى 20 مشروعاً على شبكة قاعدة البيانات السحابية بشكل فوري دون الخوف من فقد البيانات عند حذف كاش المتصفح. تفعيل Chargily Pay آمن 100%.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onGoToPricing}
                  className="px-4 py-2 bg-amber-500 text-white font-black text-xs border border-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-0.5 hover:bg-amber-600"
                >
                  اشترك الآن بالدينار
                </button>
              </div>
            )}

            {/* Grid statistics summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">إجمالي المشاريع</span>
                <span className="text-2xl font-black text-black font-mono mt-1 block">{projects.length}</span>
              </div>
              <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">متوسط CTR حملاتك</span>
                <span className="text-2xl font-black text-green-600 font-mono mt-1 block">4.33%</span>
              </div>
              <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">الطلبات المقدرة (COD)</span>
                <span className="text-2xl font-black text-black font-mono mt-1 block">425</span>
              </div>
              <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">تكلفة النقرة (DZD)</span>
                <span className="text-2xl font-black text-black font-mono mt-1 block">15.5 ج</span>
              </div>
            </div>

            {/* Projects list panel */}
            <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-black flex items-center gap-2">
                  <Folder size={20} className="text-black" />
                  <span>مشاريعك الحالية</span>
                </h3>
                <button
                  onClick={onCreateNewProjectTrigger}
                  className="px-4 py-2 border-2 border-black bg-[#00FF41] hover:bg-black hover:text-[#00FF41] font-black text-xs shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-1.5"
                >
                  <FolderPlus size={14} />
                  <span>بدء مشروع إعلاني جديد</span>
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="py-16 text-center text-xs opacity-60 space-y-4">
                  <div className="border border-dashed border-gray-400 p-8 rounded-sm max-w-md mx-auto">
                    <p className="font-bold mb-4">لا توجد مشاريع مسجلة حالياً.</p>
                    <button
                      onClick={onCreateNewProjectTrigger}
                      className="px-4 py-2.5 bg-[#00FF41] text-black font-extrabold border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all"
                    >
                      اضغط هنا لتصميم أول مشروع
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-[#fcfcfc] border-2 border-black p-4 hover:bg-white transition-all flex justify-between items-start group"
                    >
                      <div className="space-y-2 truncate flex-1 pl-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <h4 
                            onClick={() => onSelectProject(p)}
                            className="font-black text-black cursor-pointer hover:underline text-sm truncate"
                          >
                            {p.name}
                          </h4>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono font-bold flex gap-3">
                          <span>المرحلة: <span className="text-black font-extrabold">{p.appState}</span></span>
                          <span>•</span>
                          <span>{new Date(p.updatedAt).toLocaleDateString('ar-DZ')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="p-2 border border-black hover:bg-[#00FF41] text-black transition-colors"
                          title="فتح المشروع"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('هل أنت متأكد من رغبتك في حذف هذا المشروع؟')) {
                              await onDeleteProject(p.id);
                            }
                          }}
                          className="p-2 border border-black hover:bg-red-50 text-red-600 transition-colors"
                          title="حذف المشروع"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8" dir="rtl">
            
            {/* Main Header with Algerian Flag indicator */}
            <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-green-600 via-white to-red-600" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[9px] font-mono font-black text-black bg-[#ffe8ca] border border-black px-2 py-0.5 uppercase tracking-wide inline-block mb-1.5 rounded-sm">
                    أدوات التخطيط المالي المتطورة لعام 2026
                  </span>
                  <h3 className="text-xl font-black text-black flex items-center gap-2">
                    <Globe size={22} className="text-green-600 shrink-0" />
                    <span>محاكي العائد على الاستثمار وحساب الأرباح التفاعلي (MARKETING MASTER COD ROI Forecast Engine)</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-bold mt-1 leading-relaxed max-w-3xl">
                    خطط لنجاح مشاريعك الإضافية في الجزائر بثقة تامة. يدمج هذا المخطط الذكي تكاليف الإعلانات الحقيقية (DZD)، سعر السورسينغ بالجملة، مصاريف الشحن لشركة يالادين (Yalidine) أو ZR، مصاريف تأكيد مركز الاتصال، ونسب الاسترجاع (Returns) لتوفير دقة تامة لصنع قرارك المالي.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculations & Formulas block */}
            {(() => {
              const calculatedOrders = roiCpa > 0 ? Math.floor(roiAdsSpend / roiCpa) : 0;
              const calculatedDelivered = Math.floor(calculatedOrders * (roiDeliveryRate / 100));
              const calculatedFailed = Math.max(0, calculatedOrders - calculatedDelivered);
              const calculatedSourcingCost = calculatedDelivered * roiSourcingCost;
              const calculatedCallCenterCost = calculatedOrders * roiConfirmFee;
              const calculatedShippingCost = (calculatedDelivered * roiShippingFee) + (calculatedFailed * roiReturnPenalty);
              
              const calculatedGrossRevenue = calculatedDelivered * roiSalePrice;
              const calculatedTotalCosts = calculatedSourcingCost + calculatedShippingCost + calculatedCallCenterCost + roiAdsSpend;
              const calculatedNetProfit = calculatedGrossRevenue - calculatedTotalCosts;
              const calculatedRoi = calculatedTotalCosts > 0 ? (calculatedNetProfit / calculatedTotalCosts) * 105 : 0; 

              const deliveryPct = roiDeliveryRate / 100;
              const calculatedBreakEvenCpa = Math.max(0, deliveryPct * (roiSalePrice - roiSourcingCost - roiShippingFee) - (1 - deliveryPct) * roiReturnPenalty - roiConfirmFee);
              const calculatedSafeTargetCpa = Math.round(calculatedBreakEvenCpa * 0.7);

              let alertText = "";
              let alertType: 'danger' | 'warning' | 'success' | 'info' = 'info';
              
              if (roiDeliveryRate < 45) {
                alertText = `⚠️ تحذير صارم: نسبة التوصيل منخفضة جداً (${roiDeliveryRate}%)! أنت تسجل معدل استرجاع مرتفع (${100 - roiDeliveryRate}%) وتخسر نقوداً طائلة في تغطية شحن العودة وتأكيد مركز الاتصال. يرجى توجيه فريقك لتنظيف فوري للجماهير وقائمة المستلمين المستهدفة.`;
                alertType = 'danger';
              } else if (calculatedNetProfit < 0) {
                alertText = `💸 خسارة مالية متوقعة: صافي الأرباح سلبي بحوالي (${Math.round(calculatedNetProfit).toLocaleString('ar-DZ')} دج). نوصيك بزيادة سعر بيع منتجك النهائي أو البحث عن مورد آخر يمنحك أسعار جملة أقل، أو تحسين جودة الإبداع لخفض سعر الـ CPA.`;
                alertType = 'warning';
              } else if (calculatedRoi > 80) {
                alertText = `🔥 منجم ذهب حقيقي! العائد المتوقع استثنائي ويتجاوز الحدود الآمنة (${Math.round(calculatedRoi)}%). هذا المنتج يمتلك ملاءمة مثالية لنمط حياة المستهلك الجزائري الحالي. ضاعف ميزانتك على الحملات الفائزة وباشر بالتوسع السريع!`;
                alertType = 'success';
              } else {
                alertText = `📊 أداء متزن ومستقر: مبيعاتك تحقق هامش ربح آمن وجيد للعمل بالجزائر. واصل العمل بحذر وحافظ على سرعة شحن الطلبيات ومتابعتها عبر Yalidine لضمان التدفق السلس للسيولة النقدية (Cash Flow).`;
                alertType = 'info';
              }

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* SLIDERS & CONTROLS CABINET */}
                  <div className="lg:col-span-5 bg-white border-2 border-black p-5 shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-5">
                    <h4 className="text-xs font-black text-black border-b border-black pb-2 mb-3 flex items-center gap-1.5">
                      <span>⚙️ معطيات ومؤشرات التشغيل بالدينار (DZD)</span>
                    </h4>

                    {/* Ad Spend & CPA */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[11px] font-black text-black mb-1">
                          <span>الميزانية الإعلانية اليومية:</span>
                          <span className="font-mono text-green-700">{roiAdsSpend.toLocaleString('ar-DZ')} دج / يوم</span>
                        </div>
                        <input 
                          type="range" 
                          min={2000} 
                          max={100000} 
                          step={1000}
                          value={roiAdsSpend} 
                          onChange={(e) => setRoiAdsSpend(Number(e.target.value))}
                          className="w-full accent-black cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-black text-black mb-1">
                          <span>تكلفة الحصول على طلبية (Meta Ads CPA):</span>
                          <span className="font-mono text-red-650">{roiCpa.toLocaleString('ar-DZ')} دج / طلب</span>
                        </div>
                        <input 
                          type="range" 
                          min={200} 
                          max={5000} 
                          step={50}
                          value={roiCpa} 
                          onChange={(e) => setRoiCpa(Number(e.target.value))}
                          className="w-full accent-black cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 mb-1">سعر المورد بالجملة:</label>
                          <input 
                            type="number"
                            value={roiSourcingCost}
                            onChange={(e) => setRoiSourcingCost(Math.max(0, Number(e.target.value)))}
                            className="w-full p-2 border-2 border-black font-mono font-bold text-xs bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 mb-1">سعر بيع المنتج النهائي:</label>
                          <input 
                            type="number"
                            value={roiSalePrice}
                            onChange={(e) => setRoiSalePrice(Math.max(0, Number(e.target.value)))}
                            className="w-full p-2 border-2 border-black font-mono font-bold text-xs bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-black text-black mb-1">
                          <span>نسبة تسليم وتوصيل يالادين (Delivery Rate):</span>
                          <span className="font-mono text-indigo-700">{roiDeliveryRate}%</span>
                        </div>
                        <input 
                          type="range" 
                          min={20} 
                          max={100} 
                          step={1}
                          value={roiDeliveryRate} 
                          onChange={(e) => setRoiDeliveryRate(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 mb-0.5">تكلفة التوصيل ( Yalidine ):</label>
                          <input 
                            type="number"
                            value={roiShippingFee}
                            onChange={(e) => setRoiShippingFee(Math.max(0, Number(e.target.value)))}
                            className="w-full p-1 border border-black font-mono font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 mb-0.5">عمولات التأكيد (Call Center):</label>
                          <input 
                            type="number"
                            value={roiConfirmFee}
                            onChange={(e) => setRoiConfirmFee(Math.max(0, Number(e.target.value)))}
                            className="w-full p-1 border border-black font-mono font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 mb-0.5">غرامة التوصيل الملغي (Return):</label>
                          <input 
                            type="number"
                            value={roiReturnPenalty}
                            onChange={(e) => setRoiReturnPenalty(Math.max(0, Number(e.target.value)))}
                            className="w-full p-1 border border-black font-mono font-bold text-xs"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* FINANCIAL METRICS DISPLAY SCREEN */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Dynamic Alert Banner */}
                    <div className={`p-4 border-2 border-black font-semibold text-xs leading-relaxed ${
                      alertType === 'danger' ? 'bg-red-50 border-red-500 text-red-900' :
                      alertType === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-900' :
                      alertType === 'success' ? 'bg-[#e6ffe6] border-green-500 text-green-900' :
                      'bg-indigo-50 border-indigo-500 text-indigo-900'
                    }`}>
                      <p className="font-black mb-1 shadow-sm">💡 تشخيص ذكاء النظام المالي من كرباني بلقاسم:</p>
                      <p className="text-[11px] font-bold">{alertText}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      
                      <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0_rgba(0,0,0,1)] relative">
                        <span className="text-[9px] font-bold text-gray-400 block">إجمالي المبيعات المستلمة</span>
                        <span className="text-xl font-black text-black mt-1 block font-mono">
                          {calculatedDelivered} <span className="text-xs text-gray-400">/ {calculatedOrders} طلبيات</span>
                        </span>
                      </div>

                      <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        <span className="text-[9px] font-bold text-gray-400 block">العائدات الإجمالية</span>
                        <span className="text-xl font-black text-black mt-1 block font-mono">
                          {calculatedGrossRevenue.toLocaleString('ar-DZ')} <span className="text-[10px] text-gray-500">دج</span>
                        </span>
                      </div>

                      <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        <span className="text-[9px] font-bold text-gray-400 block">مجموع التكاليف الكلي</span>
                        <span className="text-xl font-black text-red-600 mt-1 block font-mono">
                          {calculatedTotalCosts.toLocaleString('ar-DZ')} <span className="text-[10px] text-gray-500">دج</span>
                        </span>
                      </div>

                      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,1)] col-span-2">
                        <span className="text-[9px] font-black text-gray-400 block">صافي الأرباح المقدر (Net Profit)</span>
                        <span className={`text-2xl font-black mt-1.5 block font-mono ${calculatedNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {calculatedNetProfit.toLocaleString('ar-DZ')} دج / يوم
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold block mt-1">شهرياً: ~ {(calculatedNetProfit * 30).toLocaleString('ar-DZ')} دج</span>
                      </div>

                      <div className="bg-black text-[#00FF41] border-2 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        <span className="text-[9px] font-mono block text-gray-400">معدل الـ ROI المتوقع</span>
                        <span className="text-2xl font-black mt-1.5 block font-mono">
                          {calculatedRoi >= 0 ? '+' : ''}{Math.round(calculatedRoi)} %
                        </span>
                      </div>

                    </div>

                    {/* Target CPA Guidelines inside neo cabinet */}
                    <div className="bg-gray-50 border-2 border-black p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-black">
                      <div className="bg-white border p-3">
                        <span className="text-[10px] text-gray-400 block font-bold mb-1">نقطة التعادل القصوى (Break-Even CPA)</span>
                        <p className="text-sm font-black text-red-700 font-mono">{Math.round(calculatedBreakEvenCpa).toLocaleString('ar-DZ')} دج</p>
                        <p className="text-[9px] text-gray-450 mt-1">إذا تجاوزت تكلفة إعلانك هذا الرقم، فستبدأ في الخسارة فوراً!</p>
                      </div>

                      <div className="bg-white border p-3 border-[#00FF41]">
                        <span className="text-[10px] text-[#22c55e] block font-extrabold mb-1">تكلفة الإعلان المستهدفة (Target CPA)</span>
                        <p className="text-sm font-black text-green-700 font-mono">{calculatedSafeTargetCpa.toLocaleString('ar-DZ')} دج</p>
                        <p className="text-[9px] text-gray-450 mt-1">تكلفة التحويل المثالية لتأمين هامش ربح COD Alger ممتاز وصافي.</p>
                      </div>
                    </div>

                    {/* Wilayas Breakdown merged beautifully */}
                    <div className="bg-white border-2 border-black p-5">
                      <span className="text-xs font-black text-black block mb-3 border-b-2 border-black pb-1">📊 أفضل الولايات من حيث نسبة التوصيل وسعر الـ CPA بالجزائر:</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {wilayaStats.map((st) => (
                          <div key={st.code} className="p-2 border border-black bg-gray-50 text-[11px] font-bold">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-black">{st.name}</span>
                              <span className="font-mono bg-black text-white px-1 py-0.2 text-[9px]">{st.code}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                              <span>معدل التوصيل:</span>
                              <span className="text-green-700 font-black">74%</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                              <span>متوسط CPA:</span>
                              <span className="text-red-600 font-mono">650 دج</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] max-w-xl">
              <h3 className="text-lg font-black text-black mb-6 flex items-center gap-2">
                <Settings size={20} />
                <span>إعدادات الملف والمفاتيح السحابية</span>
              </h3>

              {saveProfileSuccess && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 text-green-900 text-xs font-bold rounded-sm">
                  ✓ تم تحديث الملف الشخصي ومفاتيح Gemini السحابية بنجاح على السيرفر!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold text-black">
                <div>
                  <label className="block mb-1">الاسم الكامل:</label>
                  <input 
                    type="text"
                    required
                    className="w-full p-2.5 border-2 border-black focus:outline-none focus:bg-gray-50 text-sm font-semibold"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1">البريد الإلكتروني حسابك (غير قابل للتعديل):</label>
                  <input 
                    type="email"
                    disabled
                    className="w-full p-2.5 border-2 border-gray-300 bg-gray-50 focus:outline-none text-sm font-semibold text-gray-400 cursor-not-allowed"
                    value={user?.email || ''}
                  />
                </div>

                <div>
                  <label className="block mb-1">مفتاح الذكاء الاصطناعي الافتراضي لـ Gemini (مخزن سحابياً بأمان):</label>
                  <div className="relative">
                    <input 
                      type="password"
                      placeholder="AIzaSy..."
                      className="w-full p-2.5 border-2 border-black font-mono text-sm focus:outline-none"
                      value={geminiKeyInput}
                      onChange={(e) => setGeminiKeyInput(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal font-semibold">
                    يحفظ هذا المفتاح تلقائياً ويستخدم في إتمام جميع مراحل تشريح وتحليل المنتجات.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00FF41] hover:bg-black hover:text-[#00FF41] text-black font-black py-3 px-6 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
                >
                  حفظ البيانات الشخصية المفاتيح
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8">
            <SaaSTeamManager onGoToPricing={onGoToPricing} />
          </div>
        )}

        {activeTab === 'whitelabel' && (
          <div className="space-y-8">
            <SaaSWhiteLabel onGoToPricing={onGoToPricing} />
          </div>
        )}

        {activeTab === 'enterprise_portal' && (
          <div className="space-y-8">
            <SaaSEnterprisePortal onGoToPricing={onGoToPricing} />
          </div>
        )}

        {activeTab === 'marketing_hub' && (
          <div className="space-y-8">
            <SaaSMarketingHub 
              userPlan={user?.plan} 
              onGoToPricing={onGoToPricing}
            />
          </div>
        )}

      </main>
    </div>
  );
}
