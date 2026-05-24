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
import { Loader2, Printer, Plus, Download, Menu, X, Settings, Key } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

// SaaS Core Imports
import { useAuth } from './context/AuthContext';
import { SaaSAuth } from './components/SaaSAuth';
import { SaaSLanding } from './components/SaaSLanding';
import { SaaSPricing } from './components/SaaSPricing';
import { ChargilyPaymentSim } from './components/ChargilyPaymentSim';
import { SaaSAdmin } from './components/SaaSAdmin';
import { SaaSPublicLanding } from './components/SaaSPublicLanding';
import { SettingsModal } from './components/SettingsModal';

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
  const { user, serverDbAvailable } = useAuth();
  
  // Public Landing / Auth Navigation States
  const [publicAuthView, setPublicAuthView] = useState<boolean>(false);
  const [initialIsLogin, setInitialIsLogin] = useState<boolean>(true);
  
  // SaaS Navigation States
  const [saasMode, setSaasMode] = useState<'dashboard' | 'workspace' | 'pricing' | 'payment-sim' | 'admin'>('dashboard');
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<'free' | 'pro' | 'agency' | 'enterprise'>('pro');
  const [selectedCheckoutAmount, setSelectedCheckoutAmount] = useState<number>(1500);

  const [appState, setAppState] = useState<AppState>('IDLE');
  const [currentModel, setCurrentModel] = useState<string>('gemini-3.5-flash');
  
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  // Sync projects from database with localStorage backup
  const fetchSaaSProjects = async () => {
    if (serverDbAvailable && user) {
      try {
        const res = await fetch('/api/projects', {
          headers: { 'Authorization': user.id }
        });
        if (res.ok) {
          const data = await res.json();
          const parsed = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            updatedAt: item.updatedAt,
            appState: item.data.appState,
            data0: item.data.data0 || null,
            data05: item.data.data05 || null,
            data1: item.data.data1 || null,
            data2: item.data.data2 || null,
            data3: item.data.data3 || null,
            data4: item.data.data4 || null,
            data5: item.data.data5 || null,
            data6: item.data.data6 || null,
            data7: item.data.data7 || null,
          }));
          setSavedProjects(parsed);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch SaaS projects from database backend", err);
      }
    }
    // Fallback to local storage
    try {
      const stored = localStorage.getItem('nextify_projects');
      if (stored) {
        setSavedProjects(JSON.parse(stored));
      } else {
        setSavedProjects([]);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchSaaSProjects();
  }, [user, serverDbAvailable]);

  useEffect(() => {
    setModel(currentModel);
  }, [currentModel]);

  // Save project automatically when state changes
  useEffect(() => {
    if (appState === 'IDLE' || appState === 'LOADING') return;
    if (!user) return; // Must be authenticated to trigger saves

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

    const saveFlow = async () => {
      // Local Storage Backup
      try {
        const localProjsStr = localStorage.getItem('nextify_projects') || '[]';
        const localProjs = JSON.parse(localProjsStr);
        const exists = localProjs.some((p: any) => p.id === id);
        const updated = exists ? localProjs.map((p: any) => p.id === id ? newProj : p) : [newProj, ...localProjs];
        localStorage.setItem('nextify_projects', JSON.stringify(updated));
        setSavedProjects(updated);
      } catch (e) {}

      // Server Data Sync
      if (serverDbAvailable && user) {
        try {
          const res = await fetch('/api/projects/save', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': user.id
            },
            body: JSON.stringify({
              id,
              name: productName,
              data: {
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
              }
            })
          });
          if (!res.ok) {
            const errData = await res.json();
            alert(errData.error || 'تم بلوغ الحد الأقصى للمشاريع في خطتك الحالية.');
          }
        } catch (err) {
          console.error("Failed to sync project save operation to server", err);
        }
      }
    };

    saveFlow();
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

  const handleDeleteProject = async (projId: string) => {
    // 1. Delete locally
    try {
      const localProjsStr = localStorage.getItem('nextify_projects') || '[]';
      const localProjs = JSON.parse(localProjsStr);
      const updated = localProjs.filter((p: any) => p.id !== projId);
      localStorage.setItem('nextify_projects', JSON.stringify(updated));
      setSavedProjects(updated);
    } catch (e) {}

    // 2. Delete on backend db
    if (serverDbAvailable && user) {
      try {
        await fetch(`/api/projects/${projId}`, {
          method: 'DELETE',
          headers: { 'Authorization': user.id }
        });
      } catch (e) {
        console.error("Failed to delete project on server", e);
      }
    }

    if (currentProjectId === projId) {
      startNewProject();
    }
  };

  const handleStartNewProjectSaaS = (name: string, price?: string, images?: string[]) => {
    // Limit checking
    const limit = user?.plan === 'free' ? 3 : user?.plan === 'pro' ? 20 : Infinity;
    if (savedProjects.length >= limit) {
      alert(`لقد بلغت الحد الأقصى للمشاريع في خطتك الحالية (${limit} مشاريع). يرجى الترقية لإضافة حزم جديدة!`);
      setSaasMode('pricing');
      return;
    }

    setCurrentProjectId(Date.now().toString());
    setProductName(name);
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
    
    try {
      localStorage.setItem('nextify_temp_data', JSON.stringify({
        msg: `/analyse-product ${name}`,
        sellingPrice: price,
        images: images
      }));
    } catch (e) {}

    setSaasMode('workspace');
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
      localStorage.setItem('nextify_temp_data', JSON.stringify({ msg, sellingPrice, images }));
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
          const result = await runPhase05(data0.question, data0);
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
          const result = await runPhase1(data0.question, sellingPrice, images, data0, data05);
          setData1(result);
          setAppState('PHASE_1_DONE');
        } catch (error) {
          console.error(error);
          setAppState('PHASE_05_DONE');
          alert('حدث خطأ في طلب المرحلة 1. تحقق من مفتاح API أو المدخلات.');
        }
      } else if (appState === 'PHASE_1_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 2: جاري إنشاء 5 MARKETING MASTER Visual Briefs للإعلانات الصورية...');
        try {
          const res = await runPhase2(data1, data05 || undefined);
          setData2(res);
          setAppState('PHASE_2_DONE');
        } catch (error) {
          console.error(error); setAppState('PHASE_1_DONE'); alert('فشل في هندسة الـ Briefs (المرحلة 2).');
        }
      } else if (appState === 'PHASE_2_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 3: جاري بناء Landing Page Brief من 6 مناطق بيع (CRO)...');
        try {
          const res = await runPhase3(data1, data2 || undefined);
          setData3(res);
          setAppState('PHASE_3_DONE');
        } catch (error) {
          console.error(error); setAppState('PHASE_2_DONE'); alert('فشل في تصميم الـ Landing Page.');
        }
      } else if (appState === 'PHASE_3_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 4: جاري هندسة الفيديو الإعلاني، المشاهد، وتعليقها الصوتي بالفصحى الاحترافية...');
        try {
          const res = await runPhase4(data1, data3 || undefined);
          setData4(res);
          setAppState('PHASE_4_DONE');
        } catch (error) {
          console.error(error); setAppState('PHASE_3_DONE'); alert('فشل في توليد الـ Video Workflow.');
        }
      } else if (appState === 'PHASE_4_DONE' && data1) {
        setAppState('LOADING');
        setLoadingMsg('PHASE 5: جاري بناء استراتيجية Meta Ads للسوق الجزائري...');
        try {
          const res = await runPhase5(data1, data2 || undefined, data4 || undefined);
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

  const handleRebuildPhase = async (phase: string) => {
    let savedMsg = productName || '';
    let savedPrice = undefined;
    let savedImages = undefined;
    try {
      const stored = localStorage.getItem('nextify_temp_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.msg) savedMsg = parsed.msg;
        if (parsed.sellingPrice) savedPrice = parsed.sellingPrice;
        if (parsed.images) savedImages = parsed.images;
      }
    } catch (e) {
      console.error("Failed to read nextify_temp_data from localStorage:", e);
    }

    const cleanMsg = savedMsg.replace(/\/analyse-product/g, '').replace(/بدء تشغيل النظام للمنتج:/g, '').trim();

    if (phase === '0') {
      setAppState('LOADING');
      setLoadingMsg('PHASE 0: إعادة بناء مجلس تقييم الفكرة (LLM Council)...');
      setData0(null);
      setData05(null);
      setData1(null);
      setData2(null);
      setData3(null);
      setData4(null);
      setData5(null);
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase0(cleanMsg, savedPrice, savedImages);
        setData0(result);
        setAppState('PHASE_0_DONE');
      } catch (error) {
        console.error(error);
        setAppState('IDLE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 0. يرجى تجربة مفتاح API آخر.');
      }
    } else if (phase === '0.5') {
      if (!data0) {
        alert('يجب بناء المرحلة 0 أولاً.');
        return;
      }
      setAppState('LOADING');
      setLoadingMsg('PHASE 0.5: إعادة بناء جماهير فيسبوك...');
      setData05(null);
      setData1(null);
      setData2(null);
      setData3(null);
      setData4(null);
      setData5(null);
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase05(data0.question, data0);
        setData05(result);
        setAppState('PHASE_05_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_0_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 0.5.');
      }
    } else if (phase === '1') {
      const targetQuery = data0 ? data0.question : cleanMsg;
      setAppState('LOADING');
      setLoadingMsg('PHASE 1: إعادة بناء تشريح المنتج واستخراج الذكاء الاستراتيجي...');
      setData1(null);
      setData2(null);
      setData3(null);
      setData4(null);
      setData5(null);
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase1(targetQuery, savedPrice, savedImages, data0 || undefined, data05 || undefined);
        setData1(result);
        setAppState('PHASE_1_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_05_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 1.');
      }
    } else if (phase === '2') {
      if (!data1) {
         alert('يجب بناء المرحلة 1 أولاً.');
         return;
      }
      setAppState('LOADING');
      setLoadingMsg('PHASE 2: إعادة بناء 5 MARKETING MASTER Visual Briefs للإعلانات الصورية...');
      setData2(null);
      setData3(null);
      setData4(null);
      setData5(null);
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase2(data1, data05 || undefined);
        setData2(result);
        setAppState('PHASE_2_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_1_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 2.');
      }
    } else if (phase === '3') {
      if (!data1) {
         alert('يجب بناء المرحلة 1 أولاً.');
         return;
      }
      setAppState('LOADING');
      setLoadingMsg('PHASE 3: إعادة بناء Landing Page Brief من 6 مناطق بيع (CRO)...');
      setData3(null);
      setData4(null);
      setData5(null);
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase3(data1, data2 || undefined);
        setData3(result);
        setAppState('PHASE_3_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_2_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 3.');
      }
    } else if (phase === '4') {
      if (!data1) {
         alert('يجب بناء المرحلة 1 أولاً.');
         return;
      }
      setAppState('LOADING');
      setLoadingMsg('PHASE 4: إعادة بناء الفيديو الإعلاني والمشاهد والتعليق الصوتي...');
      setData4(null);
      setData5(null);
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase4(data1, data3 || undefined);
        setData4(result);
        setAppState('PHASE_4_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_3_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 4.');
      }
    } else if (phase === '5') {
      if (!data1) {
         alert('يجب بناء المرحلة 1 أولاً.');
         return;
      }
      setAppState('LOADING');
      setLoadingMsg('PHASE 5: إعادة بناء استراتيجية Meta Ads للسوق الجزائري...');
      setData5(null);
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase5(data1, data2 || undefined, data4 || undefined);
        setData5(result);
        setAppState('PHASE_5_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_4_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 5.');
      }
    } else if (phase === '6') {
      if (!data1) {
         alert('يجب بناء المرحلة 1 أولاً.');
         return;
      }
      setAppState('LOADING');
      setLoadingMsg('PHASE 6: إعادة بناء نظام التوسع والربحية المستدامة...');
      setData6(null);
      setData7(null);
      try {
        const result = await runPhase6(data1);
        setData6(result);
        setAppState('PHASE_6_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_5_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 6.');
      }
    } else if (phase === '7') {
      setAppState('LOADING');
      setLoadingMsg('PHASE 7: إعادة بناء ونمذجة نصوص الإعلانات الصاروخية...');
      setData7(null);
      try {
        const result = await runPhase7_AdGenerator(productName, data1 || undefined);
        setData7(result);
        setAppState('PHASE_7_DONE');
      } catch (error) {
        console.error(error);
        setAppState('PHASE_6_DONE');
        alert('حدث خطأ أثناء إعادة بناء المرحلة 7.');
      }
    }
  };

  const handleNext = async () => {
    handleSendMessage('اعتماد');
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('printable-area');
    if (!element) return;

    // Helper to convert OKLAB to standard RGB
    const oklabToRgb = (L: number, a_lab: number, b_lab: number, alpha: number = 1): string => {
      const l_ = L + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
      const m_ = L - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
      const s_ = L - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

      const l3 = l_ * l_ * l_;
      const m3 = m_ * m_ * m_;
      const s3 = s_ * s_ * s_;

      let r_lin =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
      let g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413190470 * s3;
      let b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

      const gamma = (c: number) => {
        if (c <= 0.0031308) return 12.92 * c;
        return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
      };

      const r = Math.max(0, Math.min(255, Math.round(gamma(r_lin) * 255)));
      const g = Math.max(0, Math.min(255, Math.round(gamma(g_lin) * 255)));
      const b = Math.max(0, Math.min(255, Math.round(gamma(b_lin) * 255)));

      return alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Helper to convert OKLCH to standard RGB
    const oklchToRgb = (L: number, C: number, H: number, alpha: number = 1): string => {
      const hRad = (H * Math.PI) / 180;
      const a = C * Math.cos(hRad);
      const b = C * Math.sin(hRad);
      return oklabToRgb(L, a, b, alpha);
    };

    // Main translation function to parse oklab/oklch strings into standard rgb/rgba
    const translateColors = (cssVal: string): string => {
      if (typeof cssVal !== 'string') return cssVal;
      
      let val = cssVal.replace(/in\s+okl(ab|ch),?\s*/gi, '');

      // Translate oklch(L C H [ / A])
      const oklchRegex = /oklch\(\s*([\d.%]+)\s+([\d.%]+)\s+([\d.-]+(?:deg|rad|turn)?)(?:\s*\/\s*([\d.%]+))?\s*\)/gi;
      val = val.replace(oklchRegex, (_match, p1, p2, p3, p4) => {
        try {
          let l = parseFloat(p1);
          if (p1.endsWith('%')) l /= 100;
          let c = parseFloat(p2);
          if (p2.endsWith('%')) c /= 100;
          let h = parseFloat(p3);
          let alpha = 1;
          if (p4) {
            alpha = parseFloat(p4);
            if (p4.endsWith('%')) alpha /= 100;
          }
          return oklchToRgb(l, c, h, alpha);
        } catch (e) {
          return 'rgb(0, 0, 0)';
        }
      });

      // Translate oklab(L A B [ / Alpha])
      const oklabRegex = /oklab\(\s*([\d.%]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi;
      val = val.replace(oklabRegex, (_match, p1, p2, p3, p4) => {
        try {
          let l = parseFloat(p1);
          if (p1.endsWith('%')) l /= 100;
          let a = parseFloat(p2);
          let b = parseFloat(p3);
          let alpha = 1;
          if (p4) {
            alpha = parseFloat(p4);
            if (p4.endsWith('%')) alpha /= 100;
          }
          return oklabToRgb(l, a, b, alpha);
        } catch (e) {
          return 'rgb(0, 0, 0)';
        }
      });

      return val;
    };

    // Helper to apply the getComputedStyle proxy color fixer
    const patchWindowComputedStyle = (win: Window) => {
      const originalGetComputedStyle = win.getComputedStyle;
      win.getComputedStyle = function (elt, pseudoElt) {
        const style = originalGetComputedStyle(elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop) {
            if (prop === 'getPropertyValue') {
              return function (propertyName: string) {
                const originalValue = target.getPropertyValue(propertyName);
                return translateColors(originalValue);
              };
            }
            try {
              const val = (target as any)[prop];
              if (typeof val === 'function') {
                return val.bind(target);
              }
              if (typeof val === 'string' && (val.includes('oklab') || val.includes('oklch'))) {
                return translateColors(val);
              }
              return val;
            } catch (e) {
              return undefined;
            }
          }
        });
      };
      return originalGetComputedStyle;
    };

    // 1. Monkey-patch the parent window style computations
    const originalParentGetComputedStyle = patchWindowComputedStyle(window);

    // 2. Clone the printable area and place it under body (unbounded height layout)
    const clone = element.cloneNode(true) as HTMLElement;
    clone.id = 'printable-area-clone'; // Style with generic overrides
    clone.classList.add('pdf-active-print'); // Apply the release heights and scrolls styles
    
    // Clean up unnecessary UI widgets inside the cloned element
    const elementsToRemove = clone.querySelectorAll('.print-hide, .printable-hide, button, aside, header, form, .composer');
    elementsToRemove.forEach(el => el.remove());

    // Make the clone itself flow naturally on its own (no clipping ancestor bounds)
    clone.style.position = 'absolute';
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.width = '1024px'; // Ensure beautifully structured desktop-like proportions
    clone.style.height = 'auto';
    clone.style.minHeight = '100%';
    clone.style.overflow = 'visible';
    clone.style.display = 'block';
    clone.style.background = '#ffffff';
    clone.style.zIndex = '-9999';
    clone.style.opacity = '1';
    clone.style.pointerEvents = 'none';

    // Append clone to body directly so html2canvas computes perfect coordinates
    document.body.appendChild(clone);

    // Add classes to apply global PDF mode
    document.body.classList.add('pdf-export-mode');

    const cleanUpAndRestore = () => {
      window.getComputedStyle = originalParentGetComputedStyle;
      document.body.classList.remove('pdf-export-mode');
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    };

    // 3. Trigger html2pdf with full-fidelity desktop coordinates of the cloned node
    setTimeout(() => {
      const opt = {
        margin:       12,
        filename:     `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'project'}_marketing_master_report.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
        html2canvas:  { 
          scale: 2, // High resolution crisp text rendering
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc: Document) => {
            // Also patch style computations in the sandbox iframe container context
            const clonedWindow = clonedDoc.defaultView;
            if (clonedWindow) {
              patchWindowComputedStyle(clonedWindow);
            }
          }
        },
        jsPDF:        { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const 
        }
      };

      html2pdf().set(opt).from(clone).save().then(() => {
        cleanUpAndRestore();
      }).catch((err: any) => {
        console.error("PDF generation error:", err);
        cleanUpAndRestore();
      });
    }, 450); // Slight delay guarantees full rendering lifecycle completes
  };

  // Conditional SaaS view rendering
  if (!user) {
    if (publicAuthView) {
      return (
        <SaaSAuth 
          initialIsLogin={initialIsLogin} 
          onBackToLanding={() => setPublicAuthView(false)} 
        />
      );
    }
    return (
      <SaaSPublicLanding 
        onGoToAuth={(isLogin) => {
          setInitialIsLogin(isLogin);
          setPublicAuthView(true);
        }} 
      />
    );
  }

  if (saasMode === 'dashboard') {
    return (
      <SaaSLanding
        onSelectProject={(proj) => {
          loadProject(proj);
          setSaasMode('workspace');
        }}
        onStartNewProject={handleStartNewProjectSaaS}
        onGoToPricing={() => setSaasMode('pricing')}
        onGoToAdmin={() => setSaasMode('admin')}
        projects={savedProjects}
        onDeleteProject={handleDeleteProject}
        onCreateNewProjectTrigger={() => {
          const limit = user?.plan === 'free' ? 3 : user?.plan === 'pro' ? 20 : Infinity;
          if (savedProjects.length >= limit) {
            alert(`لقد بلغت الحد الأقصى للمشاريع في خطتك الحالية (${limit} مشاريع). يرجى الترقية لإضافة حزم جديدة!`);
            setSaasMode('pricing');
            return;
          }
          startNewProject();
          setSaasMode('workspace');
        }}
      />
    );
  }

  if (saasMode === 'pricing') {
    return (
      <SaaSPricing 
        onBackToDashboard={() => setSaasMode('dashboard')}
        onInitiatePayment={(plan, amount) => {
          setSelectedCheckoutPlan(plan);
          setSelectedCheckoutAmount(amount);
          setSaasMode('payment-sim');
        }}
      />
    );
  }

  if (saasMode === 'payment-sim') {
    return (
      <ChargilyPaymentSim
        userId={user?.id || ''}
        plan={selectedCheckoutPlan}
        amount={selectedCheckoutAmount}
        onPaymentSuccess={() => {
          fetchSaaSProjects();
          setSaasMode('dashboard');
        }}
        onPaymentCancel={() => {
          setSaasMode('pricing');
        }}
      />
    );
  }

  if (saasMode === 'admin') {
    return (
      <SaaSAdmin 
        onBackToDashboard={() => {
          fetchSaaSProjects();
          setSaasMode('dashboard');
        }}
      />
    );
  }

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
            <button onClick={() => setSaasMode('dashboard')} className="px-3 py-1.5 bg-black text-[#00FF41] hover:bg-gray-900 border-2 border-black text-xs font-bold uppercase flex items-center gap-1.5 transition-colors">
              <span>← العودة للوحة التحكم</span>
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
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="flex bg-black hover:bg-neutral-950 text-white hover:text-[#00FF41] p-1.5 md:p-2 px-3 md:px-4 gap-2 items-center text-xs md:text-sm font-bold uppercase border-2 border-black transition-all shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none"
               title="مفاتيح الـ API لـ Gemini"
             >
               <Key size={16} className="text-[#00FF41] shrink-0" />
               <span className="hidden sm:inline">إعدادات الـ API</span>
             </button>
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
                     {data0 && <Phase0View data={data0} onNext={handleNext} onRebuild={() => handleRebuildPhase('0')} hideNext={appState !== 'PHASE_0_DONE'} />}
                     {data05 && <Phase05View data={data05} onNext={handleNext} onRebuild={() => handleRebuildPhase('0.5')} hideNext={appState !== 'PHASE_05_DONE'} />}
                     {data1 && <Phase1View data={data1} onNext={handleNext} onRebuild={() => handleRebuildPhase('1')} hideNext={appState !== 'PHASE_1_DONE'} />}
                     {data2 && <Phase2View data={data2} onNext={handleNext} onRebuild={() => handleRebuildPhase('2')} hideNext={appState !== 'PHASE_2_DONE'} />}
                     {data3 && <Phase3View data={data3} onNext={handleNext} onRebuild={() => handleRebuildPhase('3')} hideNext={appState !== 'PHASE_3_DONE'} />}
                     {data4 && <Phase4View data={data4} onNext={handleNext} onRebuild={() => handleRebuildPhase('4')} hideNext={appState !== 'PHASE_4_DONE'} />}
                     {data5 && <Phase5View data={data5} onNext={handleNext} onRebuild={() => handleRebuildPhase('5')} hideNext={appState !== 'PHASE_5_DONE'} />}
                     {data6 && <Phase6View data={data6} onNext={handleNext} onRebuild={() => handleRebuildPhase('6')} hideNext={appState !== 'PHASE_6_DONE'} />}
                     {data7 && <Phase7View_AdGenerator data={data7} onRebuild={() => handleRebuildPhase('7')} />}
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
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
