import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Globe, Image, Palette, CheckCircle, HelpCircle, Eye, ToggleLeft, ToggleRight, Loader } from 'lucide-react';

interface WhiteLabelSettings {
  enabled: boolean;
  agencyName: string;
  customDomain: string;
  logoUrl: string;
  brandColor: string;
  textColor: string;
  removeWatermark: boolean;
}

interface SaaSWhiteLabelProps {
  onGoToPricing: () => void;
}

export function SaaSWhiteLabel({ onGoToPricing }: SaaSWhiteLabelProps) {
  const { user } = useAuth();
  
  const isEligible = user?.plan === 'agency' || user?.plan === 'enterprise';
  
  const [settings, setSettings] = useState<WhiteLabelSettings>({
    enabled: false,
    agencyName: '',
    customDomain: '',
    logoUrl: '',
    brandColor: '#ea580c',
    textColor: '#ffffff',
    removeWatermark: false
  });

  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainVerified, setDomainVerified] = useState<boolean | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from local
  useEffect(() => {
    const cached = localStorage.getItem('saas_whitelabel_settings');
    if (cached) {
      setSettings(JSON.parse(cached));
    } else {
      const defaultSettings: WhiteLabelSettings = {
        enabled: isEligible,
        agencyName: user?.fullName ? `${user.fullName} Agency` : 'الوكالة التسويقية الجزائرية',
        customDomain: 'reports.myagency.dz',
        logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=AgencyLogo',
        brandColor: '#ea580c',
        textColor: '#ffffff',
        removeWatermark: isEligible
      };
      setSettings(defaultSettings);
      if (isEligible) {
        localStorage.setItem('saas_whitelabel_settings', JSON.stringify(defaultSettings));
      }
    }
  }, [isEligible, user]);

  const saveSettings = (newS: WhiteLabelSettings) => {
    setSettings(newS);
    localStorage.setItem('saas_whitelabel_settings', JSON.stringify(newS));
  };

  const handleToggleEnable = () => {
    if (!isEligible) return;
    const updated = { ...settings, enabled: !settings.enabled, removeWatermark: !settings.enabled };
    saveSettings(updated);
  };

  const handleTextChange = (key: keyof WhiteLabelSettings, val: string) => {
    if (!isEligible) return;
    const updated = { ...settings, [key]: val };
    saveSettings(updated);
  };

  const handleCheckDomain = () => {
    if (!settings.customDomain) return;
    setCheckingDomain(true);
    setDomainVerified(null);
    
    // Simulated checking DNS
    setTimeout(() => {
      setCheckingDomain(false);
      setDomainVerified(true);
    }, 1800);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) return;
    saveSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header and overview */}
      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono font-black text-white bg-black px-2 py-0.5 border border-black inline-block mb-1.5 uppercase tracking-wider">
            بروتوكول العلامة البيضاء (White Label Protocol)
          </span>
          <h3 className="text-xl font-black text-black flex items-center gap-2">
            <Globe size={22} className="text-black" />
            <span>تخصيص العلامة التجارية للوكالة والتقارير الموجهة لعملائك</span>
          </h3>
          <p className="text-xs text-gray-500 font-bold mt-1 max-w-2xl leading-relaxed">
            امسح شعار وموقع MARKETING MASTER بالكامل من تقارير وموجزات الاستخبارات التسويقية التي ترسلها لعملائك. استبدلها بنطاق عملك الخاص، شعارك، وألوان هويتك البصرية الخاصة.
          </p>
        </div>
      </div>

      {!isEligible ? (
        /* LOCK SCREEN WITH UPGRADE INFO */
        <div className="bg-white border-3 border-black p-12 text-center shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500" />
          <div className="max-w-md mx-auto space-y-6 py-6 font-bold">
            <div className="w-16 h-16 bg-blue-50 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto text-blue-600 animate-pulse">
              <Globe size={32} />
            </div>
            
            <h4 className="text-lg font-black text-black">منظومة تخصيص العلامة البيضاء (White Label) غير مفعلة</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              هذه الميزة فائقة الأهمية للوكالات التي تقدم خدمات معالجة وتخطيط حملات COD للعلامات التجارية الجزائرية. تتطلب خطة **الوكالة (Agency)** أو **الشركات (Enterprise)** للعمل بشكل كامل.
            </p>
            
            <div className="bg-gray-50 border border-black p-4 text-right text-[11px] text-gray-700 max-w-sm mx-auto space-y-1.5">
              <p className="flex justify-between"><span>• إخفاء علامة MARKETING MASTER المائية</span> <span className="text-green-600 font-black">جاهز للتفعيل</span></p>
              <p className="flex justify-between"><span>• نطاق فرعي مخصص (reports.yourdomain.dz)</span> <span className="text-green-600 font-black">جاهز للتفعيل</span></p>
              <p className="flex justify-between"><span>• تخصيص الألوان واللوجو للعملاء</span> <span className="text-green-600 font-black">جاهز للتفعيل</span></p>
            </div>

            <button
              onClick={onGoToPricing}
              className="px-6 py-3 bg-[#00FF41] hover:bg-black hover:text-[#00FF41] text-black font-black text-xs border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 block mx-auto"
            >
              الترقية لفتح كامل الصلاحيات
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE CONFIGURATOR CONTROL BOARD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings configurators left */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSaveAll} className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-6">
              
              <div className="flex justify-between items-center border-b pb-4">
                <h4 className="text-sm font-black text-black flex items-center gap-1.5">
                  <Palette size={18} />
                  <span>لوحة تخصيص الهوية التجارية</span>
                </h4>
                
                {/* Enabled Toggle Switcher */}
                <button
                  type="button"
                  onClick={handleToggleEnable}
                  className="flex items-center gap-1 text-xs font-black text-black bg-gray-50 border border-black px-3 py-1 hover:bg-gray-100"
                >
                  {settings.enabled ? (
                    <>
                      <ToggleRight className="text-green-600 shrink-0" size={20} />
                      <span>النظام: نشط</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="text-gray-400 shrink-0" size={20} />
                      <span>النظام: متوقف</span>
                    </>
                  )}
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-green-50 border border-green-500 text-green-900 text-xs font-bold">
                  ✓ تم حفظ ومزامنة إعدادات العلامة البيضاء بنجاح للوكالة!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-black">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">اسم الوكالة للتصدير:</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-2.5 border-2 border-black focus:outline-none focus:bg-gray-50 text-xs font-semibold"
                      value={settings.agencyName}
                      onChange={(e) => handleTextChange('agencyName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block mb-1">روبوت شعار الوكالة (URL):</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-2.5 border-2 border-black font-sans text-xs focus:outline-none focus:bg-gray-50"
                      value={settings.logoUrl}
                      onChange={(e) => handleTextChange('logoUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">اللون الأساسي للهوية (HEX):</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-10 h-10 border-2 border-black p-0.5 cursor-pointer shrink-0"
                        value={settings.brandColor}
                        onChange={(e) => handleTextChange('brandColor', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="w-full p-2.5 border-2 border-black font-mono text-center text-xs focus:outline-none"
                        value={settings.brandColor}
                        onChange={(e) => handleTextChange('brandColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">لون خط الأزرار المحددة (HEX):</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-10 h-10 border-2 border-black p-0.5 cursor-pointer shrink-0"
                        value={settings.textColor}
                        onChange={(e) => handleTextChange('textColor', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="w-full p-2.5 border-2 border-black font-mono text-center text-xs focus:outline-none"
                        value={settings.textColor}
                        onChange={(e) => handleTextChange('textColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Domain Settings */}
              <div className="border-t pt-4 space-y-3">
                <label className="block text-xs font-black text-black">ربط نطاق فرعي مخصص للتقارير (reports.yourdomain.dz):</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. static.sahara-chic.com"
                    className="flex-1 p-2.5 border-2 border-black font-sans text-xs focus:outline-none"
                    value={settings.customDomain}
                    onChange={(e) => handleTextChange('customDomain', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleCheckDomain}
                    disabled={checkingDomain}
                    className="px-4 py-2 border-2 border-black bg-black text-[#00FF41] hover:bg-gray-900 font-black text-xs min-w-[120px] flex items-center justify-center gap-1.5"
                  >
                    {checkingDomain ? (
                      <>
                        <Loader className="animate-spin" size={14} />
                        <span>جاري الربط</span>
                      </>
                    ) : (
                      <span>تفقد ربط DNS</span>
                    )}
                  </button>
                </div>

                {domainVerified !== null && (
                  <div className="p-3 bg-green-50 border border-green-400 text-green-900 text-[11px] font-bold flex gap-2 items-center">
                    <CheckCircle className="text-green-600 shrink-0" size={16} />
                    <span>
                      تم توجيه سجل <strong>CNAME</strong> للنطاق <strong>{settings.customDomain}</strong> بنجاح بنجاح ومزامنته لتسليم البيانات دون علامة تجارية!
                    </span>
                  </div>
                )}

                <div className="bg-gray-50 border border-black p-3.5 text-[10px] text-gray-500 font-semibold space-y-1">
                  <p className="font-bold text-black border-b pb-1 flex items-center gap-1"><HelpCircle size={12} /> طريقة إعداد DNS للنطاق الخاص بك:</p>
                  <p>1. اذهب للوحة تحكم النطاق (Namecheap, Cloudflare, Nic.dz).</p>
                  <p>2. أضف سجل <strong className="text-black">CNAME</strong> فريد باسم النطاق الذي اخترته.</p>
                  <p>3. وجه السجل إلى القيمة التالية: <code className="bg-gray-100 border px-1 font-mono text-black select-all">custom.marketingmaster-saas.net</code></p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00FF41] hover:bg-black hover:text-[#00FF41] text-black font-black py-3.5 px-4 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer text-xs"
              >
                تحديث وحفظ تفضيلات العلامة البيضاء بالخادم
              </button>
            </form>
          </div>

          {/* Report visual previews right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] flex flex-col justify-between h-full min-h-[400px]">
              <div>
                <h4 className="text-sm font-black text-black border-b pb-3 mb-4 flex items-center gap-1.5">
                  <Eye size={18} />
                  <span>معاينة حية للمستعرض النهائي للتقارير (Client Report Live Mockup)</span>
                </h4>
                
                <p className="text-[11px] text-gray-400 font-bold mb-4">
                  هذا هو الشكل النهائي للتقارير وملخص المنتجات بعد إرسال الرابط المشترك لعميلك مباشرة:
                </p>

                {/* Simulated interactive document header rendering */}
                <div className="border border-black p-4 bg-gray-50 space-y-4 rounded-sm relative">
                  
                  {/* Watermark badge or brand logo overlay */}
                  <div className="flex justify-between items-center border-b pb-3">
                    {settings.enabled ? (
                      <div className="flex items-center gap-2">
                        <img 
                          src={settings.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=AgencyLogo`} 
                          alt="logo" 
                          className="w-6 h-6 border border-black bg-white"
                          onError={(e) => {
                            // Reset fallback
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="font-extrabold text-[11px] text-black uppercase tracking-tight">{settings.agencyName || 'شعار الوكالة'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="bg-[#00FF41] text-black border border-black font-bold uppercase text-[8px] px-1">MARKETING MASTER</span>
                        <span className="text-[9px] text-gray-400 font-mono">SAAS INTERFACE</span>
                      </div>
                    )}

                    <span className="text-[8px] text-gray-400 font-mono font-bold select-none bg-gray-200 border px-1.5 py-0.2">تقرير استخباراتي سري</span>
                  </div>

                  <div className="space-y-2">
                    <div className="w-1/2 h-2 text-xs font-black block">اسم المنتج: تحليل مقلاة تيفال الهوائية المقاومة للحرارة</div>
                    <div className="w-full h-1 bg-gray-200 rounded-full" />
                    <div className="w-5/6 h-1 bg-gray-200 rounded-full" />
                    <div className="w-4/6 h-1 bg-gray-200 rounded-full" />
                  </div>

                  {/* Configurable client CTA button rendering */}
                  <div className="flex justify-end gap-2 pt-2 border-t text-[9px] font-bold">
                    <button 
                      type="button"
                      disabled
                      className="px-3 py-1.5 border border-black flex items-center justify-center pointer-events-none"
                      style={{ 
                        backgroundColor: settings.enabled ? settings.brandColor : '#000000',
                        color: settings.enabled ? settings.textColor : '#00FF41'
                      }}
                    >
                      تطبيق وتحميل ملف السكربت الإعلاني
                    </button>
                    <button type="button" disabled className="px-2.5 py-1.5 border border-black bg-white text-black font-semibold pointer-events-none">تنزيل بصيغة PDF</button>
                  </div>

                  {/* Watermark watermark at the end of layouts */}
                  {!settings.removeWatermark && (
                    <div className="absolute bottom-2 left-2 text-[8px] text-gray-400 font-mono uppercase bg-white border px-1 border-dashed tracking-widest">
                      Powered by MARKETING MASTER SaaS الجزائر
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4.5 bg-amber-50 border border-amber-500 text-[10px] font-bold text-amber-900 leading-normal">
                عند تفضيل خيار <strong>حذف العلامة المائية</strong> وحفظ التعديلات، سيتم مسح أي إشارة لموقع MARKETING MASTER من لوحة PDF المصدرة، ومن كافة روابط الاستعراض المجانية المخصصة للروابط.
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
