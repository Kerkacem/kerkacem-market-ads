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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'profile' | 'team' | 'whitelabel' | 'enterprise_portal'>('dashboard');
  
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
              NEXTIFY <span className="bg-[#00FF41] px-1 py-0.5 border border-black text-xs">SAAS</span>
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
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=Nextify`} 
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
          <div className="space-y-8">
            <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black text-black mb-4 flex items-center gap-2">
                <Globe size={20} />
                <span>تحليل مبيعات الولايات الـ 58 (COD Algeria Breakdown)</span>
              </h3>
              <p className="text-xs text-gray-500 mb-6 font-semibold">
                يقوم النظام بالربط مع تحليلات ميتا وسجلات التوصيل (Yalidine / ZR) لاستخلاص نسب النقر الإجمالية لمنتجاتك الأكثر مبيعاً:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Custom table widget */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-black uppercase tracking-wider">الولايات الأعلى أداءً (High conversion Wilayas)</h4>
                  <div className="space-y-3">
                    {wilayaStats.map((st) => (
                      <div key={st.code} className="p-3 border-2 border-black bg-gray-50 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono bg-black text-white px-1.5 py-0.5 rounded-sm text-[9px] inline-block mr-2">{st.code}</span>
                          <span className="font-black text-black">{st.name}</span>
                        </div>
                        <div className="flex gap-4 font-mono font-bold">
                          <span>الطلبات: {st.orders}</span>
                          <span className="text-green-600 bg-green-50 border border-green-200 px-1 py-0.2">CTR: {st.ctr}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated visual graphics chart crafted in Tailwind CSS */}
                <div className="border-2 border-black p-5 flex flex-col justify-between bg-white relative">
                  <div>
                    <h4 className="text-xs font-black text-black uppercase tracking-wider mb-2">منحنى النقر والإنفاق الأسبوعي</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mb-4">متوسط الأداء المسترجع عبر الذكاء الاصطناعي</p>
                  </div>
                  
                  {/* Tailwind custom bars graph */}
                  <div className="h-44 flex items-end justify-between gap-2 px-2 pb-2 mr-4 border-b border-black text-xs font-mono font-bold relative">
                    <div className="w-8 bg-[#00FF41] border border-black h-[40%] flex justify-center hover:scale-105 transition-transform"><span className="absolute -top-6 text-[10px]">1.2%</span></div>
                    <div className="w-8 bg-[#00FF41] border border-black h-[60%] flex justify-center hover:scale-105 transition-transform"><span className="absolute -top-6 text-[10px]">2.5%</span></div>
                    <div className="w-8 bg-[#22c55e] border border-black h-[85%] flex justify-center hover:scale-105 transition-transform"><span className="absolute -top-6 text-[10px]">4.1%</span></div>
                    <div className="w-8 bg-[#16a34a] border border-black h-[95%] flex justify-center hover:scale-105 transition-transform"><span className="absolute -top-6 text-[10px]">4.9%</span></div>
                    <div className="w-8 bg-[#15803d] border border-black h-[70%] flex justify-center hover:scale-105 transition-transform"><span className="absolute -top-6 text-[10px]">3.2%</span></div>
                  </div>
                  <div className="flex justify-between px-2 pt-2 font-mono text-[9px] text-gray-400 font-bold">
                    <span>سبت</span>
                    <span>أحد</span>
                    <span>اثنين</span>
                    <span>ثلاثاء</span>
                    <span>أربعاء</span>
                  </div>
                </div>

              </div>
            </div>
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

      </main>
    </div>
  );
}
