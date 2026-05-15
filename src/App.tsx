import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Composer } from './components/Composer';
import { EmptyState, Phase0View, Phase05View, Phase1View, Phase2View, Phase3View, Phase4View, Phase5View, Phase6View, Phase7View_AdGenerator } from './components/Views';
import { runPhase0, runPhase05, runPhase1, runPhase2, runPhase3, runPhase4, runPhase5, runPhase6, runPhase7_AdGenerator, setModel } from './lib/ai';
import { 
  AppState,
  Phase0_CouncilResult,
  Phase05_AudienceBuilder,
  Phase1_Intelligence, 
  Phase2_StaticBriefs, 
  Phase3_LandingPage, 
  Phase4_VideoWorkflow,
  Phase5_MetaAdsStrategy,
  Phase6_ScalingSystem,
  Phase7_AdGenerator
} from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Printer, Plus, Download, Menu, X } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export interface ProjectData {
  id: string;
  name: string;
  updatedAt: number;
  appState: AppState;
  data0: Phase0_CouncilResult | null;
  data05: Phase05_AudienceBuilder | null;
  data1: Phase1_Intelligence | null;
  data2: Phase2_StaticBriefs | null;
  data3: Phase3_LandingPage | null;
  data4: Phase4_VideoWorkflow | null;
  data5: Phase5_MetaAdsStrategy | null;
  data6: Phase6_ScalingSystem | null;
  data7: Phase7_AdGenerator | null;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [currentModel, setCurrentModel] = useState<string>('gemini-3.1-flash-lite-preview');
  
  const [data0, setData0] = useState<Phase0_CouncilResult | null>(null);
  const [data05, setData05] = useState<Phase05_AudienceBuilder | null>(null);
  const [data1, setData1] = useState<Phase1_Intelligence | null>(null);
  const [data2, setData2] = useState<Phase2_StaticBriefs | null>(null);
  const [data3, setData3] = useState<Phase3_LandingPage | null>(null);
  const [data4, setData4] = useState<Phase4_VideoWorkflow | null>(null);
  const [data5, setData5] = useState<Phase5_MetaAdsStrategy | null>(null);
  const [data6, setData6] = useState<Phase6_ScalingSystem | null>(null);
  const [data7, setData7] = useState<Phase7_AdGenerator | null>(null);
  
  const [loadingMsg, setLoadingMsg] = useState('');
  const [productName, setProductName] = useState('UNINITIALIZED');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load projects from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nextify_projects');
      if (stored) setSavedProjects(JSON.parse(stored));
    } catch (err) {}
  }, []);

  useEffect(() => {
    setModel(currentModel);
  }, [currentModel]);

  // Save project automatically when state changes
  useEffect(() => {
    if (appState === 'IDLE' || appState === 'LOADING') return;
    
    setSavedProjects(prev => {
      const id = currentProjectId || Date.now().toString();
      if (!currentProjectId) setCurrentProjectId(id);
      
      const newProj: ProjectData = {
        id,
        name: productName,
        updatedAt: Date.now(),
        appState,
        data0,
        data05,
        data1,
        data2,
        data3,
        data4,
        data5,
        data6,
        data7
      };
      
      const exists = prev.some(p => p.id === id);
      const updated = exists ? prev.map(p => p.id === id ? newProj : p) : [newProj, ...prev];
      
      localStorage.setItem('nextify_projects', JSON.stringify(updated));
      return updated;
    });
  }, [appState, data0, data05, data1, data2, data3, data4, data5, data6, data7]);

  const loadProject = (proj: ProjectData) => {
    setCurrentProjectId(proj.id);
    setProductName(proj.name);
    setData0(proj.data0 || null);
    setData05(proj.data05 || null);
    setData1(proj.data1);
    setData2(proj.data2);
    setData3(proj.data3);
    setData4(proj.data4);
    setData5(proj.data5 || null);
    setData6(proj.data6 || null);
    setData7(proj.data7 || null);
    setAppState(proj.appState);
  };

  const startNewProject = () => {
    setCurrentProjectId(null);
    setProductName('UNINITIALIZED');
    setData0(null);
    setData05(null);
    setData1(null);
    setData2(null);
    setData3(null);
    setData4(null);
    setData5(null);
    setData6(null);
    setData7(null);
    setAppState('IDLE');
  };

  const handleSendMessage = async (msg: string, images?: string[], sellingPrice?: string) => {
    const lowerMsg = msg.toLowerCase();
    const isConfirm = lowerMsg.includes('اعتماد') || lowerMsg.includes('valider');

    if (lowerMsg.startsWith('/ad') || lowerMsg.startsWith('/copy')) {
      const cleanMsg = msg.replace(/^\/ad/i, '').replace(/^\/copy/i, '').trim();
      setProductName(cleanMsg || 'UNKNOWN_PRODUCT');
      setAppState('LOADING');
      setLoadingMsg('جاري توليد أفكار الإعلانات (Ad Creatives & Copywriting)...');
      
      try {
        const result = await runPhase7_AdGenerator(cleanMsg, undefined);
        setData7(result);
        setAppState('CUSTOM_AD_GENERATOR');
      } catch (error) {
        console.error(error);
        setAppState('IDLE');
        alert('حدث خطأ في طلب توليد الإعلانات.');
      }
      return;
    }

    if (appState === 'IDLE' || (!isConfirm && msg.length > 5)) {
      const cleanMsg = msg.replace(/\/analyse-product/g, '').replace(/بدء تشغيل النظام للمنتج:/g, '').trim();
      setProductName(cleanMsg || 'UNKNOWN_PRODUCT');
      setAppState('LOADING');
      setLoadingMsg('PHASE 0: LLM Council Analysis in progress...');
      
      try {
        const result = await runPhase0(cleanMsg, sellingPrice, images);
        setData0(result);
        setAppState('PHASE_0_DONE');
      } catch (error) {
        console.error(error);
        setAppState('IDLE');
        alert('حدث خطأ في طلب المرحلة 0.');
      }
    } else if (isConfirm) {
      if (appState === 'PHASE_0_DONE' && data0) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 0.5: Facebook Audience Builder - جاري بناء الجماهير...');
        try {
          const result = await runPhase05(data0.question);
          setData05(result);
          setAppState('PHASE_05_DONE');
        } catch (error) {
          console.error(error);
          setAppState('PHASE_0_DONE');
          alert('حدث خطأ في طلب المرحلة 0.5.');
        }
      } else if (appState === 'PHASE_05_DONE' && data05) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 1: جاري تشريح المنتج واستخراج الذكاء الاستراتيجي (DZ Market)...');
        try {
          const result = await runPhase1(data0.question, sellingPrice, images);
          setData1(result);
          setAppState('PHASE_1_DONE');
        } catch (error) {
          console.error(error);
          setAppState('PHASE_05_DONE');
          alert('حدث خطأ في طلب المرحلة 1. تحقق من مفتاح API أو المدخلات.');
        }
      } else if (appState === 'PHASE_1_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 2: جاري إنشاء 5 Nextify Visual Briefs للإعلانات الصورية...');
        try {
          const res = await runPhase2(data1);
          setData2(res);
          setAppState('PHASE_2_DONE');
        } catch (error) {
          console.error(error); setAppState('PHASE_1_DONE'); alert('فشل في هندسة الـ Briefs (المرحلة 2).');
        }
      } else if (appState === 'PHASE_2_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 3: جاري بناء Landing Page Brief من 6 مناطق بيع (CRO)...');
        try {
          const res = await runPhase3(data1);
          setData3(res);
          setAppState('PHASE_3_DONE');
        } catch (error) {
           console.error(error); setAppState('PHASE_2_DONE'); alert('فشل في تصميم الـ Landing Page.');
        }
      } else if (appState === 'PHASE_3_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 4: جاري هندسة الفيديو الإعلاني، المشاهد، وتعليقها الصوتي بالفصحى الاحترافية...');
        try {
          const res = await runPhase4(data1);
          setData4(res);
          setAppState('PHASE_4_DONE');
        } catch (error) {
           console.error(error); setAppState('PHASE_3_DONE'); alert('فشل في توليد الـ Video Workflow.');
        }
      } else if (appState === 'PHASE_4_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 5: جاري بناء استراتيجية Meta Ads للسوق الجزائري...');
        try {
          const res = await runPhase5(data1);
          setData5(res);
          setAppState('PHASE_5_DONE');
        } catch (error) {
           console.error(error); setAppState('PHASE_4_DONE'); alert('فشل في تصميم استراتيجية الإعلانات (المرحلة 5).');
        }
      } else if (appState === 'PHASE_5_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 6: جاري هندسة نظام التوسع (Scaling) والربحية المستدامة...');
        try {
          const res = await runPhase6(data1);
          setData6(res);
          setAppState('PHASE_6_DONE');
        } catch (error) {
           console.error(error); setAppState('PHASE_5_DONE'); alert('فشل في تصميم نظام التوسع (المرحلة 6).');
        }
      } else if (appState === 'PHASE_6_DONE' && productName) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 7: جاري توليد الكوبي رايتنج ونصوص الإعلانات الصاروخية...');
        try {
          const res = await runPhase7_AdGenerator(productName, data1);
          setData7(res);
          setAppState('PHASE_7_DONE');
        } catch (error) {
           console.error(error); setAppState('PHASE_6_DONE'); alert('فشل في توليد نصوص الإعلانات (المرحلة 7).');
        }
      }
    }
  };

  const handleNext = () => handleSendMessage('اعتماد');

  const handleDownloadPdf = () => {
    const element = document.getElementById('printable-area');
    if (!element) return;
    
    // Add global class to remove ALL scroll and height constraints across the DOM
    document.body.classList.add('pdf-export-mode');
    
    // Small timeout ensures the DOM has repainted with the full unrestricted height
    setTimeout(() => {
      const currentWidth = document.documentElement.clientWidth;
      
      const opt = {
        margin:       10,
        filename:     `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'project'}_marketing_master_report.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }, // Prevents cutting elements in half
        html2canvas:  { 
          scale: 2, // High resolution
          windowWidth: currentWidth, 
          scrollY: 0, // Force starting at the top
          useCORS: true,
          backgroundColor: '#ffffff'
        },
        jsPDF:        { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const 
        }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        // Restore normal bounds
        document.body.classList.remove('pdf-export-mode');
      }).catch((err: any) => {
        console.error("PDF generation error:", err);
        document.body.classList.remove('pdf-export-mode');
      });
    }, 400); // 400ms delay guarantees rendering
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden text-black" dir="rtl" id="app-root">
      <Sidebar 
        appState={appState} 
        projects={savedProjects} 
        currentProjectId={currentProjectId}
        onSelectProject={loadProject}
        currentModel={currentModel}
        onModelChange={setCurrentModel}
        className="print-hide" // Add this class to Sidebar component directly or handle in CSS
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white relative print-block">
        <header className="h-14 md:h-16 border-b-2 bg-white border-black flex items-center justify-between px-4 md:px-8 shrink-0 relative z-10 print-hide">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 flex items-center justify-center border-2 border-black text-black hover:bg-[#00FF41] transition-colors"
            >
              <Menu size={18} />
            </button>
            <button onClick={startNewProject} className="px-3 py-1.5 hover:bg-black hover:text-[#00FF41] bg-[#00FF41] text-black border-2 border-black text-xs font-bold uppercase flex items-center gap-2 transition-colors">
              <Plus size={14} /> <span className="hidden md:inline">NEW</span>
            </button>
            {appState !== 'IDLE' && (
              <span className="text-black font-mono font-bold text-xs md:text-sm tracking-tight border-s-2 border-black ps-2 md:ps-4 truncate max-w-[120px] md:max-w-sm shrink-0 uppercase" dir="ltr">
                PRJ: {productName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
             {appState !== 'IDLE' && (
                 <button onClick={handleDownloadPdf} className="hidden md:flex bg-black text-[#00FF41] hover:bg-[#00FF41] hover:text-black p-1.5 md:p-2 px-3 md:px-4 gap-2 items-center text-xs md:text-sm font-bold uppercase border-2 border-black transition-colors shadow-[2px_2px_0_#00FF41]" title="Download PDF / Print">
                   <Printer size={16} /> <span className="hidden md:inline">استخراج PDF</span>
                 </button>
             )}
             <div className="text-[10px] md:text-xs bg-black text-[#00FF41] px-2 md:px-4 py-1.5 font-bold tracking-widest uppercase truncate max-w-[80px] md:max-w-none" dir="ltr">
                ST: {appState.replace('_DONE', '')}
             </div>
          </div>
        </header>

        <div id="printable-area" className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-10 relative print-block custom-scrollbar">
          <AnimatePresence mode="wait">
            {appState === 'LOADING' ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-black"
              >
                <div className="p-6 bg-white border-2 border-black mb-6 flex items-center justify-center shadow-[4px_4px_0_#00FF41]">
                   <Loader2 size={40} className="animate-spin text-black" />
                </div>
                <p className="font-mono font-bold uppercase tracking-widest text-sm animate-pulse">{loadingMsg}</p>
              </motion.div>
            ) : appState === 'IDLE' ? (
              <motion.div key="idle" className="h-full"><EmptyState /></motion.div>
            ) : (
                  <motion.div key="workflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-24 pb-16">
                     {data0 && <Phase0View data={data0} onNext={handleNext} hideNext={appState !== 'PHASE_0_DONE'} />}
                     {data05 && <Phase05View data={data05} onNext={handleNext} hideNext={appState !== 'PHASE_05_DONE'} />}
                     {data1 && <Phase1View data={data1} onNext={handleNext} hideNext={appState !== 'PHASE_1_DONE'} />}
                     {data2 && <Phase2View data={data2} onNext={handleNext} hideNext={appState !== 'PHASE_2_DONE'} />}
                     {data3 && <Phase3View data={data3} onNext={handleNext} hideNext={appState !== 'PHASE_3_DONE'} />}
                     {data4 && <Phase4View data={data4} onNext={handleNext} hideNext={appState !== 'PHASE_4_DONE'} />}
                     {data5 && <Phase5View data={data5} onNext={handleNext} hideNext={appState !== 'PHASE_5_DONE'} />}
                     {data6 && <Phase6View data={data6} onNext={handleNext} hideNext={appState !== 'PHASE_6_DONE'} />}
                     {data7 && <Phase7View_AdGenerator data={data7} />}
                  </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Composer 
          onSendMessage={handleSendMessage} 
          isLoading={appState === 'LOADING'}
          disabled={appState === 'LOADING'}
          isConfirming={['PHASE_0_DONE', 'PHASE_05_DONE', 'PHASE_1_DONE', 'PHASE_2_DONE', 'PHASE_3_DONE', 'PHASE_4_DONE', 'PHASE_5_DONE', 'PHASE_6_DONE'].includes(appState)}
        />
      </main>
    </div>
  );
}
