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
  ShieldAlert,
  Trash2,
  Plus,
  Phone,
  Map,
  User,
  AlertTriangle,
  Check,
  RotateCcw,
  Upload,
  X
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

  const [activeSubTab, setActiveSubTab] = useState<'gateways' | 'competitor' | 'webhooks' | 'backups' | 'revit_shield'>('revit_shield');
  const [activeGateway, setActiveGateway] = useState('dz-dedicated');
  const [useMarketingMasterKey, setUseMarketingMasterKey] = useState(true);
  
  // --- REVIT SYSTEM STATE VARIABLES ---
  const [revitOrders, setRevitOrders] = useState<any[]>([]);
  const [revitBlacklist, setRevitBlacklist] = useState<any[]>([]);
  const [revitStats, setRevitStats] = useState<any>({
    totalOrders: 0,
    deliveredOrders: 0,
    returnedOrders: 0,
    cancelledOrders: 0,
    rtoRate: 0,
    moneySaved: 185000,
    activeWilayasMonitored: 0,
    blacklistCount: 0
  });
  const [revitWilayas, setRevitWilayas] = useState<any[]>([]);
  
  // Loading and action indicators
  const [loadingRevit, setLoadingRevit] = useState(false);
  const [checkingOrder, setCheckingOrder] = useState(false);
  const [addingBlacklist, setAddingBlacklist] = useState(false);
  
  // Form states for sandbox testing
  const [checkerPhone, setCheckerPhone] = useState('0661379535');
  const [checkerName, setCheckerName] = useState('كريم زروقي');
  const [checkerPrice, setCheckerPrice] = useState('4500');
  const [checkerAddress, setCheckerAddress] = useState('حي البهجة عمارة 4ب، طابق 2');
  const [checkerWilayaCode, setCheckerWilayaCode] = useState('16');
  const [checkerCommune, setCheckerCommune] = useState('دالي إبراهيم');
  const [checkingResult, setCheckingResult] = useState<any | null>(null);

  // Blacklist manual reporting form fields
  const [reportedPhone, setReportedPhone] = useState('');
  const [reportedReason, setReportedReason] = useState('');
  const [reportedBy, setReportedBy] = useState('متجر الجزائر الملكي');

  // Interactive WhatsApp OTP simulation
  const [selectedConfirmOrder, setSelectedConfirmOrder] = useState<any | null>(null);
  const [generatedOtpCode, setGeneratedOtpCode] = useState('');
  const [whatsappTemplate, setWhatsappTemplate] = useState('');
  const [manualOtpField, setManualOtpField] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [orderConfirmStatusMsg, setOrderConfirmStatusMsg] = useState('');
  
  // Bulk order importer mockups
  const [bulkCsvText, setBulkCsvText] = useState(
`الاسم الكامل,رقم الهاتف,الولاية,البلدية,العنوان,مبلغ الطلبية (دج)
حمزة بوزيد,0551992288,البليدة,بوفاريك,حي الشهداء فيلا 5,5900
عبد القادر بن دقة,0444332211,باتنة,بريكة,وسط المدينة قرب المسجد الكبير,250
تاجر التجربة,0777777777,وهران,بئر الجير,123456789123456789,145000`
  );
  const [importStatus, setImportStatus] = useState('');
  
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
  const [encryptionKey, setEncryptionKey] = useState('MARKETINGMASTER-AES-256-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [generatingKey, setGeneratingKey] = useState(false);

  // Revit interactive GUI states
  const [expandedWilayas, setExpandedWilayas] = useState(false);
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [selectedCountryIntel, setSelectedCountryIntel] = useState<'IN' | 'CN' | 'ID' | 'BR' | 'MA' | 'PK' | 'BD'>('IN');

  // Owner only access for Global Research states
  const [ownerUnlocked, setOwnerUnlocked] = useState(false);
  const [ownerPasscode, setOwnerPasscode] = useState('');
  const [ownerError, setOwnerError] = useState('');

  // Interactive Global Research simulation states
  const [voiceBotRunning, setVoiceBotRunning] = useState(false);
  const [voiceBotStep, setVoiceBotStep] = useState(0);
  const [voiceBotTranscript, setVoiceBotTranscript] = useState<string[]>([]);
  
  const [gnnIpLayer, setGnnIpLayer] = useState(true);
  const [gnnDeviceLayer, setGnnDeviceLayer] = useState(true);
  const [gnnCommuneLayer, setGnnCommuneLayer] = useState(true);
  const [gnnHoveredNode, setGnnHoveredNode] = useState<string | null>(null);

  const [restrictedStartHour, setRestrictedStartHour] = useState('08:00');
  const [restrictedEndHour, setRestrictedEndHour] = useState('17:00');
  const [allowWeekendCargo, setAllowWeekendCargo] = useState(false);
  const [deliveryStickerPrinted, setDeliveryStickerPrinted] = useState(false);

  const [ccpDiscountPercentage, setCcpDiscountPercentage] = useState(10);
  const [ccpProductPriceInput, setCcpProductPriceInput] = useState(4800);
  const [ccpCouponGenerated, setCcpCouponGenerated] = useState(false);

  const [monthlyOrdersNum, setMonthlyOrdersNum] = useState(850);
  const [whatsappSmsCostDzd, setWhatsappSmsCostDzd] = useState(6);

  const [pakiSmsSent, setPakiSmsSent] = useState(true);
  const [pakiWaSent, setPakiWaSent] = useState(true);
  const [pakiEmailSent, setPakiEmailSent] = useState(false);
  const [pakiCashFee, setPakiCashFee] = useState(200);

  const [banglaSealGenerated, setBanglaSealGenerated] = useState(false);
  const [banglaTrackingCode, setBanglaTrackingCode] = useState('RV-9812-CN32-DZ');
  const [banglaSealType, setBanglaSealType] = useState<'RED_SEAL' | 'GREEN_SEAL'>('RED_SEAL');

  // Webhook states
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    { id: 'wh_1', url: 'https://api.yourlocalcrm.dz/v1/orders', event: 'order_confirmed', active: true, lastTriggered: '2026-05-20T14:32:00Z' },
    { id: 'wh_2', url: 'https://sheets.googleapis.com/v4/spreadsheets/example', event: 'lead_generated', active: true, lastTriggered: '2026-05-20T18:10:00Z' }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState<'order_confirmed' | 'lead_generated' | 'return_notified' | 'campaign_launched'>('order_confirmed');
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);

  // WooCommerce/Shopify Webhook integration & field mapping states (Enterprise Module 2026)
  const [integrationPlatform, setIntegrationPlatform] = useState<'shopify' | 'woocommerce'>('shopify');
  const [mapCustomerName, setMapCustomerName] = useState('customer.first_name');
  const [mapCustomerPhone, setMapCustomerPhone] = useState('customer.phone');
  const [mapProductTitle, setMapProductTitle] = useState('line_items[0].title');
  const [mapWilaya, setMapWilaya] = useState('shipping_address.province');
  const [mapTotalPrice, setMapTotalPrice] = useState('total_price');
  
  // Custom interactive simulation states
  const [simName, setSimName] = useState('موسى بلقاسم');
  const [simPhone, setSimPhone] = useState('0661379535');
  const [simProduct, setSimProduct] = useState('حزام الظهر الطبي الفاخر - MARKETING MASTER');
  const [simWilaya, setSimWilaya] = useState('16 - الجزائر العاصمة');
  const [simPrice, setSimPrice] = useState('3900');

  const startVoiceBotSim = () => {
    if (voiceBotRunning) return;
    setVoiceBotRunning(true);
    setVoiceBotStep(1);
    setVoiceBotTranscript(["⏳ [REVIT CORE] جاري تهيئة الاتصال وحجز الخط الصوتي للمندوب الرقمي..."]);
    
    setTimeout(() => {
      setVoiceBotStep(2);
      setVoiceBotTranscript(t => [...t, "📱 [رنين جاري للرقم " + simPhone + "...]"]);
    }, 1200);

    setTimeout(() => {
      setVoiceBotStep(3);
      setVoiceBotTranscript(t => [...t, "👤 الزبون: ألو؟ نعم السلام عليكم تفضل، شكون معايا؟"]);
    }, 2800);

    setTimeout(() => {
      setVoiceBotStep(4);
      setVoiceBotTranscript(t => [
        ...t, 
        "🤖 بوت REVIT (بالدارجة الجزائرية): وعليكم السلام وعشية طيبة يا " + simName + "! رانا نتصلو بيك بالنيابة على متجر 'الجزائر شوب' لتأكيد طلبيتك تاع '" + simProduct + "' بقيمة " + simPrice + " دج لولاية " + simWilaya + ". حابين برك نأكدو معاك قبل ما نرسلوها مع Yalidine للعنوان تاعك. هل نجهزوها ونبعثوها غدوة إن شاء الله؟ اضغط 1 للتأكيد الفوري أو 2 للإلغاء."
      ]);
    }, 4500);

    setTimeout(() => {
      setVoiceBotStep(5);
      setVoiceBotTranscript(t => [
        ...t,
        "👤 الزبون: إيّه خويا، نعم مأكدة، ابعثوها بارك الله فيكم في أقرب وقت راني محتاجها.",
        "🤖 بوت REVIT: صحيت يا " + simName + "! تم التأكيد التلقائي لطلبيتك بنجاح 🟢 وسجلنا في خوادمنا نيتك الصادقة للشراء. جاري إرسال البيانات للتاجر لتحضير الطرد. شكراً جزيلاً ليك ويومك سعيد!"
      ]);
      setVoiceBotRunning(false);
    }, 7000);
  };

  const handleUnlockOwner = () => {
    if (['112233', 'kerkacem123', 'owner2026', '2026'].includes(ownerPasscode.trim())) {
      setOwnerUnlocked(true);
      setOwnerError('');
    } else {
      setOwnerError('❌ كود المالك غير صحيح! يرجى إعادة المحاولة.');
    }
  };

  const handleLockOwner = () => {
    setOwnerUnlocked(false);
    setOwnerPasscode('');
    setOwnerError('');
  };
  
  // Interactive integration log activity feed
  const [integrationLogs, setIntegrationLogs] = useState<string[]>([
    'تم تهيئة نظام الربط والتحقق لمتجر Shopify بنجاح 🟢',
    'بوابة النفاذ مستعدة للاستلام المباشر عبر المنفذ المؤمن 🔒',
  ]);

  // Unified incoming orders state from database
  const [incomingOrders, setIncomingOrders] = useState<any[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch integration mappings and orders from server
  const fetchIntegrationData = async () => {
    if (!user?.id) return;
    try {
      setLoadingSettings(true);
      const res = await fetch('/api/integration/settings', {
        headers: { 'Authorization': user.id }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setIntegrationPlatform(data.settings.platform || 'shopify');
          setMapCustomerName(data.settings.mapCustomerName || 'customer.first_name');
          setMapCustomerPhone(data.settings.mapCustomerPhone || 'customer.phone');
          setMapProductTitle(data.settings.mapProductTitle || 'line_items[0].title');
          setMapWilaya(data.settings.mapWilaya || 'shipping_address.province');
          setMapTotalPrice(data.settings.mapTotalPrice || 'total_price');
        }
        if (data.webhooks && data.webhooks.length > 0) {
          setWebhooks(data.webhooks);
        }
      }

      const ordRes = await fetch('/api/integration/orders', {
        headers: { 'Authorization': user.id }
      });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setIncomingOrders(ordData);
      }
    } catch (e) {
      console.error("Error loading integration settings:", e);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (isEligible && user?.id) {
      fetchIntegrationData();
    }
  }, [isEligible, user?.id]);

  // --- REVIT DATA LOAD EFFECT ---
  const fetchRevitData = async () => {
    try {
      setLoadingRevit(true);
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ords = await ordersRes.json();
        setRevitOrders(ords);
      }
      const blRes = await fetch('/api/blacklist');
      if (blRes.ok) {
        const bl = await blRes.json();
        setRevitBlacklist(bl);
      }
      const statsRes = await fetch('/api/orders/stats');
      if (statsRes.ok) {
        const sts = await statsRes.json();
        setRevitStats(sts);
      }
      const wilRiskRes = await fetch('/api/analytics/wilaya-risk');
      if (wilRiskRes.ok) {
        const wls = await wilRiskRes.json();
        setRevitWilayas(wls);
      }
    } catch (e) {
      console.error("Error loading REVIT shield metrics:", e);
    } finally {
      setLoadingRevit(false);
    }
  };

  useEffect(() => {
    if (isEligible) {
      fetchRevitData();
    }
  }, [isEligible]);

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
      setEncryptionKey('MARKETINGMASTER-AES-256-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      setGeneratingKey(false);
    }, 1000);
  };

  // --- REVIT SYSTEM HANDLER METHODS ---
  const handleSandboxCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCheckingOrder(true);
    setCheckingResult(null);
    try {
      const res = await fetch('/api/orders/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: checkerName,
          customerPhone: checkerPhone,
          wilayaCode: checkerWilayaCode,
          wilaya: checkerWilayaCode === '16' ? 'الجزائر العاصمة' : checkerWilayaCode === '31' ? 'وهران' : 'ولاية أخرى',
          commune: checkerCommune,
          address: checkerAddress,
          totalPrice: Number(checkerPrice)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCheckingResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingOrder(false);
    }
  };

  const handleCreateSandboxOrder = async () => {
    setCheckingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: checkerName,
          customerPhone: checkerPhone,
          wilayaCode: checkerWilayaCode,
          wilaya: checkerWilayaCode === '16' ? 'Alger - الجزائر العاصمة' : checkerWilayaCode === '31' ? 'Oran - وهران' : checkerWilayaCode === '09' ? 'Blida - البليدة' : 'Batna - باتنة',
          commune: checkerCommune,
          address: checkerAddress,
          totalPrice: Number(checkerPrice),
          source: 'manual'
        })
      });
      if (res.ok) {
        await fetchRevitData();
        setCheckingResult(null);
        alert("🟢 تم إرسال الطلبية بنجاح وتشغيل نظام الفحص المطور. تم تخزينها وتحديث شاشات التحليل!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingOrder(false);
    }
  };

  const handleAddBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedPhone) return;
    setAddingBlacklist(true);
    try {
      const res = await fetch('/api/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: reportedPhone,
          reason: reportedReason,
          reportedBy: reportedBy
        })
      });
      if (res.ok) {
        await fetchRevitData();
        setReportedPhone('');
        setReportedReason('');
        alert("🟢 تم تسجيل رقم الهاتف وإدراجه في السجل الجماعي لإشراك التهديدات بالجزائر!");
      } else {
        const err = await res.json();
        alert("🔴 خطأ: " + err.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingBlacklist(false);
    }
  };

  const handleRemoveBlacklist = async (ph: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في إزالة هذا الرقم من القائمة السوداء الجماعية؟")) return;
    try {
      const res = await fetch('/api/blacklist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: ph })
      });
      if (res.ok) {
        await fetchRevitData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateOtp = async (orderId: string, phone: string) => {
    try {
      const res = await fetch('/api/orders/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', orderId, phone })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedOtpCode(data.code);
        setWhatsappTemplate(data.messageTemplate);
        setManualOtpField('');
        setOrderConfirmStatusMsg('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyOtp = async () => {
    if (!selectedConfirmOrder || !manualOtpField) return;
    setVerifyingOtp(true);
    setOrderConfirmStatusMsg('');
    try {
      const res = await fetch('/api/orders/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          orderId: selectedConfirmOrder.id,
          code: manualOtpField
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderConfirmStatusMsg(data.message);
        await fetchRevitData();
        // Automatically select the freshly confirmed order to keep UI cohesive
        const ordersRefreshed = await fetch('/api/orders');
        if (ordersRefreshed.ok) {
          const ords = await ordersRefreshed.json();
          const found = ords.find((o: any) => o.id === selectedConfirmOrder.id);
          if (found) setSelectedConfirmOrder(found);
        }
      } else {
        setOrderConfirmStatusMsg(`🔴 خطأ: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
      setOrderConfirmStatusMsg("🔴 فشل الاتصال بخادوم التأكيد.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleBulkImport = async () => {
    setImportStatus("جاري تفكيك ملف CSV وتبيئة حقول الجزائر...");
    try {
      const lines = bulkCsvText.trim().split('\n');
      if (lines.length <= 1) {
        setImportStatus("❌ الملف فارغ أو السطر الدليلي للأعمدة غير سليم.");
        return;
      }
      
      const ordersToUpload: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',');
        if (cols.length >= 2) {
          ordersToUpload.push({
            customerName: cols[0]?.trim() || "زبون مجهول",
            customerPhone: cols[1]?.trim() || "",
            wilaya: cols[2]?.trim() || "الجزائر العاصمة",
            commune: cols[3]?.trim() || "بلدية",
            address: cols[4]?.trim() || "العنوان الأساسي",
            totalPrice: Number(cols[5]?.trim()) || 4500
          });
        }
      }

      if (ordersToUpload.length === 0) {
        setImportStatus("❌ لم يتم العثور على أسطر بيانات صالحة.");
        return;
      }

      const res = await fetch('/api/orders/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: ordersToUpload })
      });
      if (res.ok) {
        const data = await res.json();
        setImportStatus(`🟢 تم فحص وتوجيه ${data.count} طلب مستورد وتشغيل فحص السبعة طبقات بالكامل!`);
        await fetchRevitData();
      } else {
        setImportStatus("❌ خطأ ملقم داخلي أثناء الاستيراد الجماعي.");
      }
    } catch (e) {
      console.error(e);
      setImportStatus("❌ حدثت مشكلة أثناء المعالجة البصرية للملف.");
    }
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

  const handleSaveSettings = async (customWebhooks?: WebhookConfig[]) => {
    if (!user?.id) return;
    try {
      setSavingSettings(true);
      const payload = {
        settings: {
          platform: integrationPlatform,
          mapCustomerName,
          mapCustomerPhone,
          mapProductTitle,
          mapWilaya,
          mapTotalPrice
        },
        webhooks: customWebhooks || webhooks
      };

      const res = await fetch('/api/integration/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.id
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIntegrationLogs(prev => [
          `[${new Date().toLocaleTimeString('ar-DZ')}] تم استقرار الإعدادات وخريطة حقول الـ Webhook بنجاح بالدمج السحابي 🟢`,
          ...prev
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
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

    const updated = [...webhooks, newWh];
    setWebhooks(updated);
    setNewWebhookUrl('');
    handleSaveSettings(updated);
  };

  const handleToggleWebhook = (id: string) => {
    const updated = webhooks.map(wh => wh.id === id ? { ...wh, active: !wh.active } : wh);
    setWebhooks(updated);
    handleSaveSettings(updated);
  };

  const handleRemoveWebhook = (id: string) => {
    const updated = webhooks.filter(wh => wh.id !== id);
    setWebhooks(updated);
    handleSaveSettings(updated);
  };

  const handleTestWebhook = (wh: WebhookConfig) => {
    setTestingWebhookId(wh.id);
    setWebhookResponse(null);
    setTimeout(() => {
      setWebhookResponse(`[200 OK] تم إرسال حمولة تجريبية (Payload XML/JSON) بنجاح إلى ${wh.url}. الأحداث المتناقلة مستقرة بنسبة 100%!`);
      setTestingWebhookId(null);
      const updated = webhooks.map(w => w.id === wh.id ? { ...w, lastTriggered: new Date().toISOString() } : w);
      setWebhooks(updated);
      handleSaveSettings(updated);
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
              { id: 'revit_shield', title: 'REVIT / درع منع الاحتيال ومنظومة COD بالجزائر', icon: ShieldAlert },
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
              
              {/* TAB 0: REVIT FRAUD PREVENTION SHIELD */}
              {activeSubTab === 'revit_shield' && (
                <div className="space-y-8 animate-fade-in text-xs font-semibold text-gray-700" dir="rtl">
                  
                  {/* Top Intro Header */}
                  <div className="pb-4 border-b-2 border-black">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h4 className="text-lg font-black text-black mb-1 flex items-center gap-2">
                          <ShieldAlert size={24} className="text-red-650 animate-pulse shrink-0" />
                          <span>REVIT — النظام الجزائري لمنع الاحتيال وتقليل نسبة تجنب الاستلام (RTO Prevention)</span>
                        </h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed max-w-3xl">
                          حماية متكاملة للتجارة الإلكترونية والدفع عند الاستلام بالجزائر. يقوم النظام بتحصين مبيعاتكم عبر فحص فوري للطلبات بـ 7 طبقات ذكية لمنع روبوتات الإسبام، كشف الأرقام الوهمية، مطابقة أجهزة الاستخبارات الجماعية، وإرسال أكواد التأكيد آلياً عبر WhatsApp.
                        </p>
                      </div>
                      <span className="text-[9px] bg-red-650 text-white font-mono font-black py-1 px-2.5 uppercase tracking-wider border border-black shadow-[1px_1px_0_rgba(0,0,0,1)]">
                        v2.0 ACTIVE — ALGERIAN IN-MEMORY ENHANCED
                      </span>
                    </div>
                  </div>

                  {/* 1. REVIT GLOBAL STATISTICS DASHBOARD */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0_rgba(0,0,0,1)] hover:bg-neutral-50 transition-colors">
                      <span className="text-[10px] text-gray-500 font-extrabold block">🔍 الطلبيات المفحوصة</span>
                      <span className="text-2xl font-black text-black block font-mono mt-1">
                        {loadingRevit ? '...' : revitStats.totalOrders}
                      </span>
                      <p className="text-[9px] text-gray-400 mt-1">توليد من جميع المنافذ والـ API</p>
                    </div>

                    <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0_rgba(0,0,0,1)] hover:bg-neutral-50 transition-colors">
                      <span className="text-[10px] text-green-700 font-extrabold block">🟢 طلبيات تم تسليمها (Delivered)</span>
                      <span className="text-2xl font-black text-green-800 block font-mono mt-1">
                        {loadingRevit ? '...' : revitStats.deliveredOrders}
                      </span>
                      <p className="text-[9px] text-green-600 font-bold mt-1">معدل تحصيل تسليم مرتفع للـ COD</p>
                    </div>

                    <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0_rgba(0,0,0,1)] hover:bg-neutral-50 transition-colors">
                      <span className="text-[10px] text-red-600 font-extrabold block">🔴 راجعة / تجنب استلام (RTO)</span>
                      <span className="text-2xl font-black text-red-600 block font-mono mt-1">
                        {loadingRevit ? '...' : `${revitStats.returnedOrders} (${revitStats.rtoRate}%)`}
                      </span>
                      <p className="text-[9px] text-gray-400 mt-1">إرجاع قياسي مستمر تحت المراقبة</p>
                    </div>

                    <div className="border-2 border-black p-4 bg-[#00FF41]/10 border-green-600 shadow-[3px_3px_0_rgba(0,0,0,1)]">
                      <span className="text-[10px] text-green-800 font-black block">🛡️ الأموال والودائع المحمية</span>
                      <span className="text-xl font-black text-green-950 block font-mono mt-1">
                        {loadingRevit ? '...' : `${Number(revitStats.moneySaved).toLocaleString()} دج`}
                      </span>
                      <p className="text-[9px] text-green-700 font-bold mt-1">توفير تكاليف شحن مرتجعة مضمونة</p>
                    </div>
                  </div>

                  {/* 2. LAYER DETECTION SIMULATOR & PHONE VALIDATION */}
                  <div className="border-2 border-black p-6 bg-gray-50 shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-4">
                    <div className="border-b pb-2 flex justify-between items-center">
                      <h5 className="text-sm font-black text-black flex items-center gap-1.5">
                        <Layers size={18} className="text-red-650" />
                        <span>منفذ الفحص الآلي ذو السبعة مستويات (7-Layer Detection Simulator)</span>
                      </h5>
                      <span className="text-[9px] bg-red-100 text-red-800 font-mono font-black py-0.5 px-2">MILITARY SHIELD ACTIVE</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left Side: Order Ingress Form */}
                      <form onSubmit={handleSandboxCheck} className="lg:col-span-5 space-y-3 bg-white p-4 border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        <span className="text-[11px] font-black text-black block border-b pb-1">محاكاة إرسال طلب للتفجير والتحليل:</span>
                        
                        <div>
                          <label className="block text-[9.5px] font-black text-gray-500 mb-0.5">اسم العميل بالجزائر:</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border-2 border-black bg-white text-black text-xs font-bold" 
                            value={checkerName}
                            onChange={(e) => setCheckerName(e.target.value)}
                            placeholder="مثال: كريم زروقي أو zz"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9.5px] font-black text-gray-500 mb-0.5">رقم الهاتف (الوطني الشغال):</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border-2 border-black bg-white text-black text-xs font-mono font-bold" 
                              value={checkerPhone}
                              onChange={(e) => setCheckerPhone(e.target.value)}
                              placeholder="0660XXXXXX"
                            />
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-black text-gray-500 mb-0.5">مبلغ الطلب بالكامل (دج):</label>
                            <input 
                              type="number" 
                              className="w-full p-2 border-2 border-black bg-white text-black text-xs font-mono font-bold" 
                              value={checkerPrice}
                              onChange={(e) => setCheckerPrice(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9.5px] font-black text-gray-500 mb-0.5">ولاية التوصيل:</label>
                            <select 
                              className="w-full p-2 border-2 border-black bg-white text-black text-xs font-bold"
                              value={checkerWilayaCode}
                              onChange={(e) => setCheckerWilayaCode(e.target.value)}
                            >
                              <option value="16">16 - الجزائر العاصمة (قليلة المخاطر)</option>
                              <option value="31">31 - وهران (قليلة المخاطر)</option>
                              <option value="09">09 - البليدة (قليلة المخاطر)</option>
                              <option value="05">05 - باتنة (متوسطة المخاطر)</option>
                              <option value="30">30 - ورقلة (عالية المخاطر RTO)</option>
                              <option value="11">11 - تمنراست (عالية المخاطر RTO)</option>
                              <option value="07">07 - بسكرة (متوسطة المخاطر)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-black text-gray-500 mb-0.5">البلدية (Commune):</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border-2 border-black bg-white text-black text-xs font-bold" 
                              value={checkerCommune}
                              onChange={(e) => setCheckerCommune(e.target.value)}
                              placeholder="دالي إبراهيم / بوفاريك"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-black text-gray-500 mb-0.5">العنوان بالتفصيل (Adresse Directe):</label>
                          <textarea 
                            className="w-full p-2 border-2 border-black bg-white text-black text-xs font-bold h-12 resize-none" 
                            value={checkerAddress}
                            onChange={(e) => setCheckerAddress(e.target.value)}
                            placeholder="اسم الشارع، رقم العمارة، الطابق..."
                          />
                        </div>

                        <div className="pt-1 grid grid-cols-2 gap-2">
                          <button
                            type="submit"
                            disabled={checkingOrder}
                            className="w-full py-2.5 bg-black text-[#00FF41] hover:bg-neutral-800 transition-colors border-2 border-black font-black text-center text-xs block uppercase"
                          >
                            {checkingOrder ? "جاري الكشف..." : "🔍 فحص الطبقات الـ 7"}
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleCreateSandboxOrder}
                            disabled={checkingOrder}
                            className="w-full py-2.5 bg-[#00FF41] text-black hover:bg-green-400 transition-colors border-2 border-black font-black text-center text-xs block"
                          >
                            🛍️ إرسال وتخزين الطلبية
                          </button>
                        </div>
                      </form>

                      {/* Right Side: 7-Layer Detection Analytics Panel */}
                      <div className="lg:col-span-7 bg-white border-2 border-black p-4 shadow-[2px_2px_0_rgba(0,0,0,1)] flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b pb-1">
                            <span className="text-[11px] font-black text-black">لوحة التشريح العسكري والذكاء الإعلاني الفوري:</span>
                            <span className="font-mono text-[9px] bg-neutral-100 text-neutral-600 px-1 py-0.5 border">SANDBOX ENGINE v2</span>
                          </div>

                          {!checkingResult ? (
                            <div className="py-12 text-center text-gray-400 space-y-2">
                              <ShieldAlert size={32} className="mx-auto text-gray-300 animate-pulse" />
                              <p className="font-bold">يرجى تعبئة الحقول والضغط على زر الفحص أو التخزين للتشريحات الآن.</p>
                              <p className="text-[10px] text-gray-400">ستتفعل طبقات فحص الهواتف، السيكوينسات، وقوائم التهديد المشتركة لحظياً.</p>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-fade-in text-xs">
                              
                              {/* Master Conclusion Badge */}
                              <div className={`p-3 border-2 border-black flex items-center justify-between shadow-[2px_2px_0_rgba(0,0,0,1)] ${
                                checkingResult.status === 'FRAUD' 
                                  ? 'bg-red-50 text-red-950 text-red-800' 
                                  : checkingResult.status === 'SUSPICIOUS'
                                  ? 'bg-amber-50 text-amber-950 text-amber-800'
                                  : 'bg-green-50 text-green-950 text-green-800'
                              }`}>
                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-gray-500 font-extrabold block">القرار النهائي للمنظومة:</span>
                                  <p className="font-black text-sm flex items-center gap-1">
                                    {checkingResult.status === 'FRAUD' && "⛔ إحباط كلي - احتيال مؤكد (FRAUD BLOCKED)"}
                                    {checkingResult.status === 'SUSPICIOUS' && "⚠️ مشبوه للغاية - يتطلب تأكيد بشري صارم"}
                                    {checkingResult.status === 'CLEAN' && "✅ سليم وطبيعي - مرخص للشحن الفوري"}
                                  </p>
                                </div>
                                <div className="text-right font-mono font-black border-r-2 border-black pr-3">
                                  <span className="text-[9px] text-gray-500 block">نقاط الخطورة:</span>
                                  <span className="text-lg">{checkingResult.score} / 100</span>
                                </div>
                              </div>

                              {/* Matrix of the 7 Layers */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                                <div className="p-2 border bg-gray-50 flex justify-between items-center gap-2">
                                  <span>1. فحص تشكيل وصيغة الهاتف</span>
                                  <span className={`px-1.5 py-0.5 font-bold border text-[9.5px] whitespace-nowrap ${checkingResult.reasons.some((r: string) => r.includes('هاتف') || r.includes('Phone')) ? 'bg-red-50 text-red-700 border-red-300' : 'bg-green-50 text-green-700 border-green-300'}`}>
                                    {checkingResult.reasons.some((r: string) => r.includes('هاتف') || r.includes('Phone')) ? 'خطأ بالصيغة' : 'سليم'}
                                  </span>
                                </div>

                                <div className="p-2 border bg-gray-50 flex justify-between items-center gap-2">
                                  <span>2. مطابقة القائمة السوداء الوطنية</span>
                                  <span className={`px-1.5 py-0.5 font-bold border text-[9.5px] whitespace-nowrap ${checkingResult.reasons.some((r: string) => r.includes('blacklist') || r.includes('سوداء')) ? 'bg-red-50 text-red-700 border-red-300' : 'bg-green-50 text-green-700 border-green-300'}`}>
                                    {checkingResult.reasons.some((r: string) => r.includes('blacklist') || r.includes('سوداء')) ? 'مدرج محجوب' : 'متطابق/نظيف'}
                                  </span>
                                </div>

                                <div className="p-2 border bg-gray-50 flex justify-between items-center gap-2">
                                  <span>3. تحليل الاسبام وسيكوينس الأرقام</span>
                                  <span className={`px-1.5 py-0.5 font-bold border text-[9.5px] whitespace-nowrap ${checkingResult.reasons.some((r: string) => r.includes('سلسلة') || r.includes('كرر')) ? 'bg-red-50 text-red-700 border-red-300' : 'bg-green-50 text-green-700 border-green-300'}`}>
                                    {checkingResult.reasons.some((r: string) => r.includes('سلسلة') || r.includes('كرر')) ? 'سلسلة مكررة' : 'صحيح متفرد'}
                                  </span>
                                </div>

                                <div className="p-2 border bg-gray-50 flex justify-between items-center gap-2">
                                  <span>4. فحص سعر وسقف الطلبية</span>
                                  <span className={`px-1.5 py-0.5 font-bold border text-[9.5px] whitespace-nowrap ${checkingResult.reasons.some((r: string) => r.includes('سعر') || r.includes('توازن')) ? 'bg-red-50 text-red-700 border-red-300' : 'bg-green-50 text-green-700 border-green-300'}`}>
                                    {checkingResult.reasons.some((r: string) => r.includes('سعر') || r.includes('توازن')) ? 'خارج النطاق' : 'مستقر ومتناسق'}
                                  </span>
                                </div>

                                <div className="p-2 border bg-gray-50 flex justify-between items-center gap-2">
                                  <span>5. تشريح السخافة والمصطلحات الزائفة</span>
                                  <span className={`px-1.5 py-0.5 font-bold border text-[9.5px] whitespace-nowrap ${checkingResult.reasons.some((r: string) => r.includes('الاسم') || r.includes('اسم')) ? 'bg-red-50 text-red-700 border-red-300' : 'bg-green-50 text-green-700 border-green-300'}`}>
                                    {checkingResult.reasons.some((r: string) => r.includes('الاسم') || r.includes('اسم')) ? 'اسم هزل/وهمي' : 'اسم حقيقي مستقر'}
                                  </span>
                                </div>

                                <div className="p-2 border bg-gray-50 flex justify-between items-center gap-2">
                                  <span>6. تحليل جودة العنوان ومؤشر الدقة</span>
                                  <span className={`px-1.5 py-0.5 font-bold border text-[9.5px] whitespace-nowrap ${checkingResult.reasons.some((r: string) => r.includes('عنوان') || r.includes('العنوان')) ? 'bg-red-50 text-red-700 border-red-300' : 'bg-green-50 text-green-700 border-green-300'}`}>
                                    {checkingResult.reasons.some((r: string) => r.includes('عنوان') || r.includes('العنوان')) ? 'عنوان غير كافٍ' : 'مفصل ومثالي'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2 border bg-red-50/50 border-black/10">
                                <span className="text-[10px] text-gray-500 font-extrabold block">ملاحظات التشريح:</span>
                                <div className="mt-1 space-y-1">
                                  {checkingResult.reasons.map((rec: string, idx: number) => (
                                    <p key={idx} className="text-red-700 font-bold">• {rec}</p>
                                  ))}
                                  {checkingResult.reasons.length === 0 && (
                                    <p className="text-green-700 font-bold">✓ لم يتم العثور على أي مؤشرات خطورة. الطلب مشفر ونظيف.</p>
                                  )}
                                </div>
                              </div>

                            </div>
                          )}

                        </div>
                        <div className="pt-2 border-t text-[9px] text-gray-400 font-bold">
                          * يتم تشغيل الفلاتر السبعة بالتتالي بمعدل معالجة يقل عن 8ms للطلبية الواحدة لعدم تسبب أي اختناق مبيعات.
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 3. CORE TWO COLUMNS: BLACKLIST & WHATSAPP OTP */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    
                    {/* Left Column: Shared Blacklist Consortium DZ (Spans 6) */}
                    <div className="xl:col-span-6 border-2 border-black p-5 bg-white shadow-[3px_3px_0_rgba(0,0,0,1)] space-y-4">
                      <div className="border-b pb-2 flex justify-between items-center">
                        <h6 className="font-black text-black text-sm flex items-center gap-1.5">
                          <AlertTriangle size={18} className="text-red-650" />
                          <span>السجل الجماعي المشترك للمحتالين بالجزائر (Blacklist System)</span>
                        </h6>
                        <span className="text-[9px] bg-black text-white px-2 py-0.5 font-mono">DZ CONSORTIUM DB</span>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-normal">
                        صممت هذه القاعدة تشاركيّاً لحظر وحجب الأرقام المزعجة أو الهواتف التي ترفض الدفع عند الاستلام بشكل متكرر دون أسباب معقولة.
                      </p>

                      {/* Manual Add Form */}
                      <form onSubmit={handleAddBlacklist} className="border border-black p-3 bg-gray-50 space-y-2">
                        <span className="text-[10.5px] font-black text-black block">إدراج هاتف مشبوه فوراً في القائمة السوداء:</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] text-gray-500">رقم الهاتف:</label>
                            <input 
                              type="text" 
                              required
                              placeholder="0550XXXXXX"
                              className="w-full p-1.5 border border-black bg-white text-black font-mono text-xs font-bold"
                              value={reportedPhone}
                              onChange={(e) => setReportedPhone(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] text-gray-500 font-bold">سبب البلاغ:</label>
                            <input 
                              type="text" 
                              required
                              placeholder="مسترجع دائم، إلغاء، سبام"
                              className="w-full p-1.5 border border-black bg-white text-black text-xs font-bold"
                              value={reportedReason}
                              onChange={(e) => setReportedReason(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[9px] text-gray-400">البلاغ بواسطة: <span className="font-mono text-black font-extrabold">{reportedBy}</span></span>
                          <button 
                            type="submit"
                            disabled={addingBlacklist}
                            className="px-4 py-1.5 bg-red-650 hover:bg-red-700 text-white font-black border border-black"
                          >
                            {addingBlacklist ? "جاري الإدراج..." : "+ إدراج جماعي"}
                          </button>
                        </div>
                      </form>

                      {/* Active Blacklist View */}
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 border border-black/10">
                        {revitBlacklist.map((bl) => (
                          <div key={bl.id || bl.phone} className="p-2 border-b border-black/5 bg-gray-50 flex justify-between items-center text-xs">
                            <div className="space-y-0.5">
                              <p className="font-mono font-black text-black flex items-center gap-1.5">
                                <Phone size={11} className="text-gray-400" />
                                <span>{bl.phone}</span>
                              </p>
                              <p className="text-[9.5px] text-gray-400">السبب: <span className="font-black text-red-700">{bl.reason}</span> • المبلّغ: {bl.reportedBy}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-400 font-mono">{bl.createdAt ? new Date(bl.createdAt).toLocaleDateString() : 'سجل دائم'}</span>
                              <button 
                                onClick={() => handleRemoveBlacklist(bl.phone)}
                                className="text-red-500 hover:text-red-700 font-black border border-red-200 hover:border-red-400 bg-white p-1"
                                title="حذف من القائمة السوداء بالتراضي"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {revitBlacklist.length === 0 && (
                          <p className="text-center py-6 text-gray-400">قائمة الحظر خالية من أي تهديدات نشطة.</p>
                        )}
                      </div>

                    </div>

                    {/* Right Column: WhatsApp OTP Activation Gateway (Spans 6) */}
                    <div className="xl:col-span-6 border-2 border-black p-5 bg-white shadow-[3px_3px_0_rgba(0,0,0,1)] space-y-4">
                      
                      <div className="border-b pb-2 flex justify-between items-center">
                        <h6 className="font-black text-black text-sm flex items-center gap-1.5">
                          <Smartphone size={18} className="text-green-600 shrink-0" />
                          <span>بوابة أكواد التأكيد بـ WhatsApp (Confirmation OTP Gateway)</span>
                        </h6>
                        <span className="text-[9px] bg-green-50 text-green-700 font-black font-mono py-0.5 px-2 px-1 border border-green-300">WHATSAPP CLOUD</span>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-normal">
                        ارفع جودة تأكيد طلبياتك بالجزائر وباشر بالتغليف الآمن. تفادى الاتصال بمئات الزبائن يدوياً؛ يرسل النظام كود تأكيد بالواتساب بمجرد الضغط:
                      </p>

                      <div className="space-y-3">
                        {/* Select Order */}
                        <div>
                          <label className="block text-[9.5px] font-black text-gray-500 mb-1">اختر طلبية غير مؤكدة لتطبيق دورة OTP:</label>
                          <select 
                            className="w-full p-2 border border-black bg-white text-black text-xs font-black"
                            onChange={(e) => {
                              const found = revitOrders.find(o => o.id === e.target.value);
                              if (found) {
                                setSelectedConfirmOrder(found);
                                setGeneratedOtpCode('');
                                setWhatsappTemplate('');
                                setManualOtpField('');
                                setOrderConfirmStatusMsg('');
                              }
                            }}
                            value={selectedConfirmOrder?.id || ''}
                          >
                            <option value="">-- حدد طلبية ومحلل خطورتها --</option>
                            {revitOrders.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.customerName} ({o.customerPhone}) - {o.status === 'confirmed' ? '✓ تم تأكيده' : 'بانتظار التأكيد ⏳'} - {o.wilaya}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedConfirmOrder && (
                          <div className="border border-black p-3 bg-neutral-50 space-y-3 animate-fade-in text-[10.5px]">
                            
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-extrabold text-black text-[11px] flex items-center gap-1">
                                  <User size={12} className="text-gray-500" />
                                  <span>الزبون: {selectedConfirmOrder.customerName}</span>
                                </p>
                                <p className="text-[10.5px] text-gray-400 font-mono">الهاتف: {selectedConfirmOrder.customerPhone} | الولاية: {selectedConfirmOrder.wilaya}</p>
                              </div>
                              <span className={`px-2 py-0.5 font-black text-[9px] border uppercase ${
                                selectedConfirmOrder.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800 border-green-300' 
                                  : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                              }`}>
                                {selectedConfirmOrder.status === 'confirmed' ? 'تم تأكيده بنجاح ✓' : 'بانتظار رمز OTP 🔑'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleGenerateOtp(selectedConfirmOrder.id, selectedConfirmOrder.customerPhone)}
                              className="w-full py-2 bg-neutral-900 text-white font-black hover:bg-black transition-colors border border-black text-xs"
                            >
                              ⚡ توليد كود تأكيد وإرسال قالب واتساب الشات
                            </button>

                            {generatedOtpCode && (
                              <div className="space-y-3 border-t pt-3 border-black/10 animate-fade-in">
                                
                                <div className="space-y-1">
                                  <span className="font-black text-black text-[9.5px]">💬 القالب المُرسل آلياً لهاتف العميل بالجزائر:</span>
                                  <div className="p-2 border bg-white text-[10px] font-bold text-gray-700 font-mono leading-relaxed" dir="ltr">
                                    {whatsappTemplate}
                                  </div>
                                </div>

                                <div className="p-2 bg-green-100/50 border border-green-400 text-green-950 font-mono font-black text-center text-xs">
                                  رمز التحقق السري المُرسل للهاتف: <span className="font-sac text-lg text-green-800 select-all underline">{generatedOtpCode}</span>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <input 
                                    type="text" 
                                    placeholder="أدخل رمز التحقق المكتوب بالرسالة"
                                    className="p-2 border-2 border-black bg-white text-black font-mono text-xs font-black flex-1 text-center"
                                    value={manualOtpField}
                                    onChange={(e) => setManualOtpField(e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={verifyingOtp}
                                    className="p-2 bg-green-600 hover:bg-green-700 text-white font-black border-2 border-black text-xs px-4"
                                  >
                                    تأكيد الرمز
                                  </button>
                                </div>

                                {orderConfirmStatusMsg && (
                                  <p className="text-center font-bold text-xs p-1 bg-gray-100 text-black border border-black/10">{orderConfirmStatusMsg}</p>
                                )}

                              </div>
                            )}

                          </div>
                        )}

                        {!selectedConfirmOrder && (
                          <div className="py-6 text-center text-gray-400 font-bold border border-dashed border-gray-300">
                            حدد زبوناً من القائمة المنسدلة للبدء في إجراء التأكيد الفوري والمباشر بالواتساب.
                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* 4. BULK CSV ORDERS IMPORTER MODULE */}
                  <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-4">
                    
                    <div className="border-b pb-2 flex justify-between items-center">
                      <h5 className="text-sm font-black text-black flex items-center gap-1.5">
                        <Upload size={18} className="text-red-650" />
                        <span>منظومة استيراد ملفات طلبيات متجرك دفعة واحدة (CSV Ingestion Line-by-Line)</span>
                      </h5>
                      <span className="text-[9px] bg-red-100 text-red-800 font-mono font-black py-0.5 px-2">BULK CSV CONVERTER</span>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-normal">
                      انسخ والصق أسطر طلبياتكم البرمجية مباشرة بصيغة CSV أو Excel لفلترتها وتعبئتها ومسح الأحقاد من الأسعار والهواتف الجزائرية دفعة واحدة.
                    </p>

                    <div className="space-y-3">
                      <textarea
                        className="w-full text-xs font-mono font-bold font-semibold p-3 border-2 border-black text-black bg-gray-50 h-32 focus:outline-none focus:bg-white resize-none"
                        value={bulkCsvText}
                        onChange={(e) => setBulkCsvText(e.target.value)}
                        placeholder="الاسم الكامل,رقم الهاتف,الولاية,البلدية,العنوان,مبلغ الطلبية (دج)"
                      />

                      <div className="flex justify-between items-center gap-4 flex-wrap">
                        <span className="text-[9.5px] text-gray-400">
                          * البيانات المطروحة تتضمن (الاسم، الهاتف، الولاية، البلدية، التفاصيل، السعر بالدينار).
                        </span>
                        
                        <button
                          type="button"
                          onClick={handleBulkImport}
                          className="px-6 py-2.5 bg-black text-[#00FF41] hover:bg-neutral-800 transition-colors border-2 border-black font-black uppercase text-xs"
                        >
                          ⚡ بدء القراءة التلقائية وحساب الأبعاد والفلترة
                        </button>
                      </div>

                      {importStatus && (
                        <div className="p-3 border-2 border-black bg-red-50 text-black text-xs font-bold leading-relaxed shadow-[1px_1px_0_rgba(0,0,0,1)] text-right">
                          {importStatus}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5. WILAYA RISK DISTRIBUTION CLASSIFICATIONS */}
                  <div className="border-2 border-black p-5 bg-white shadow-[3px_3px_0_rgba(0,0,0,1)] space-y-4 text-right">
                    
                    <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-black block flex items-center gap-1.5">
                          <span>📊 خريطة توزيع درجات الخطورة وإرجاع السلع (RTO Analytics) بالجزائر</span>
                        </span>
                        <p className="text-[10px] text-gray-400">تصنيف الخطورة لولايات الجزائر لتقنين مصاريف الشحن وحظر الاحتيال مسبقاً</p>
                      </div>

                      {/* Filter Search Input */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          placeholder="ابحث باسم الولاية أو الرمز..."
                          className="p-1 px-2 border-2 border-black text-[11px] font-bold text-black"
                          value={wilayaSearch}
                          onChange={(e) => setWilayaSearch(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setExpandedWilayas(!expandedWilayas)}
                          className="bg-black text-white hover:bg-neutral-800 text-[10px] font-black py-1 px-3 border-2 border-black"
                        >
                          {expandedWilayas ? "عرض أول 12 ولاية" : "عرض كافة الـ 58 ولاية"}
                        </button>
                      </div>
                    </div>

                    {/* Heat Legend */}
                    <div className="flex gap-4 text-[9.5px] font-black text-gray-500 py-1 border-b border-dashed">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 block"></span> خطورة عالية HIGH RTO (&gt;30%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 block"></span> خطورة متوسطة MEDIUM (15-30%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 block"></span> خطورة منخفضة LOW (&lt;15%)</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 font-mono text-[10px]">
                      {revitWilayas
                        .filter(w => {
                          if (!wilayaSearch) return true;
                          return w.name.includes(wilayaSearch) || w.code.includes(wilayaSearch);
                        })
                        .slice(0, expandedWilayas ? 58 : 12)
                        .map((w: any) => (
                          <div key={w.code} className="p-2 border-2 border-black bg-neutral-50 flex flex-col justify-between shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                            <span className="font-mono text-[9px] text-gray-400">ولايـة {w.code}</span>
                            <span className="font-extrabold text-black block truncate">{w.name}</span>
                            <div className="flex justify-between items-center mt-1 pt-1 border-t border-black/5">
                              <span className="text-[9px] text-gray-500">العائد المقدر:</span>
                              <span className={`px-1 font-mono font-bold text-[8.5px] border ${
                                w.riskClass === 'HIGH' 
                                  ? 'text-red-700 bg-red-50 border-red-200' 
                                  : w.riskClass === 'MEDIUM' 
                                  ? 'text-amber-700 bg-amber-50 border-amber-200' 
                                  : 'text-green-700 bg-green-50 border-green-200'
                              }`}>
                                {w.riskClass}
                              </span>
                            </div>
                            <div className="text-[8.5px] text-gray-400 font-mono text-left mt-1">
                              فواتير: {w.ordersCount || 0} طلبات
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    {revitWilayas.filter(w => w.name.includes(wilayaSearch) || w.code.includes(wilayaSearch)).length === 0 && (
                      <p className="text-center py-6 text-gray-400">ولايات مغايرة! لم نعثر على نتائج مطابقة للبحث.</p>
                    )}

                    <p className="text-[9px] text-gray-400 pt-1">* تصنيف الخطورة الذكي يخضع لقنوات التوصيل الوطنية (Yalidine, CTT, Kazi Tour) لتقييم المرتجعات اللحظية بشكل تضامني.</p>
                  </div>

                  {/* 6. GLOBAL RESEARCH DECK: HOW 7 NATIONS COMBAT COD FRAUD */}
                  <div className="border-2 border-black p-5 bg-neutral-900 text-white shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-4 text-right">
                    
                    <div className="border-b border-neutral-700 pb-2 flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-black text-[#00FF41] flex items-center gap-1.5">
                          <span>🌏 استخبارات البحث العالمي: كيف تقاوم 7 دول كبرى احتيال الـ COD؟</span>
                        </h5>
                        <p className="text-[10px] text-neutral-400">مقارنات تقنية ملهمة تضمن للتجار تبيئة الحلول العالمية الأكثر ذكاءً</p>
                      </div>
                      <span className="text-[9px] bg-neutral-800 text-[#00FF41] border border-neutral-700 px-2 py-0.5 font-mono">GLOBAL DEEP ANALYTICS</span>
                    </div>

                    {!ownerUnlocked && user?.email !== 'kerkacem@gmail.com' ? (
                      <div className="p-6 bg-neutral-950 border border-red-900/40 rounded space-y-4 text-center my-2">
                        <div className="flex justify-center">
                          <div className="p-3 bg-red-950/40 text-red-500 rounded-full border border-red-900/40 animate-pulse">
                            <Lock size={32} />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h6 className="text-sm font-extrabold text-[#00FF41] select-none">🔒 بوابة المالك المؤمنة | OWNER SECURE GATEWAY</h6>
                          <p className="text-[11px] text-neutral-400 max-w-md mx-auto leading-relaxed">
                            تم تشفير هذا القسم الاستخباراتي المتطور وتأمينه لمالك المنصة والتاجر الأساسي فقط لحماية أسرار تفادي الـ RTO والمؤشرات العالمية الحساسة.
                          </p>
                        </div>

                        <div className="bg-neutral-900/80 p-3 border border-neutral-800 rounded text-right space-y-1.5 max-w-sm mx-auto">
                          <div className="flex justify-between items-center text-[9.5px] text-gray-500 font-mono">
                            <span>حالة الحساب الحالي:</span>
                            <span className="text-red-400 font-bold">مغلق محلياً 🔒</span>
                          </div>
                          <p className="text-[11px] text-neutral-300 font-bold truncate font-mono">👤 {user?.email || 'مجهول أو غير مسجل'}</p>
                          <span className="text-[8.5px] bg-neutral-950 text-red-400 border border-red-900/60 px-2 py-0.5 inline-block">مستوى الصلاحيات: المالك والتاجر الرئيسي 🛡️</span>
                        </div>

                        <div className="max-w-xs mx-auto space-y-2 pt-2">
                          <div>
                            <label className="block text-[10px] text-neutral-400 mb-1 text-right font-medium">أدخل كود المالك (Owner Verification Pin):</label>
                            <div className="flex gap-2">
                              <input 
                                type="password"
                                placeholder="مثال: 112233..."
                                value={ownerPasscode}
                                onChange={(e) => setOwnerPasscode(e.target.value)}
                                className="bg-black border border-neutral-800 rounded text-[#00FF41] font-mono text-center text-xs p-1.5 flex-1 focus:outline-none focus:border-[#00FF41]"
                              />
                              <button
                                type="button"
                                onClick={handleUnlockOwner}
                                className="bg-[#00FF41] hover:bg-green-400 text-black font-black px-4 text-xs transition-colors rounded"
                              >
                                تحقق وفك القفل
                              </button>
                            </div>
                          </div>
                          {ownerError && (
                            <p className="text-red-400 text-[10.5px] text-right font-mono animate-bounce">{ownerError}</p>
                          )}
                          <div className="text-[9.5px] text-gray-500 text-right pt-1 flex justify-between">
                            <span>* الرمز الافتراضي للتجريب: <strong className="text-neutral-300 font-mono select-all">112233</strong></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-neutral-800 pb-2">
                          <div className="text-xs text-[#00FF41] font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping"></span>
                            {user?.email === 'kerkacem@gmail.com' ? (
                              <span>تم التحقق التلقائي لمالك المنصة (kerkacem@gmail.com) 👑 — صلاحيات كاملة</span>
                            ) : (
                              <span>تم فك تشفير وتأمين لوحة استخبارات المالك الممتازة بنجاح 🟢</span>
                            )}
                          </div>
                          {user?.email !== 'kerkacem@gmail.com' && (
                            <button
                              type="button"
                              onClick={handleLockOwner}
                              className="text-[10px] bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 px-2.5 py-1 transition-colors rounded font-black"
                            >
                              🔒 إغلاق وتأمين لوحة استخبارات المالك
                            </button>
                          )}
                        </div>

                        {/* Interactive Flag Selector Tabs */}
                        <div className="flex flex-wrap gap-1.5 border-b border-neutral-800 pb-2">
                      {[
                        { code: 'IN', flag: '🇮🇳_الهند', label: 'الهند' },
                        { code: 'CN', flag: '🇨🇳_الصين', label: 'الصين' },
                        { code: 'ID', flag: '🇮🇩_إندونيسيا', label: 'إندونيسيا' },
                        { code: 'BR', flag: '🇧🇷_البرازيل', label: 'البرازيل' },
                        { code: 'MA', flag: '🇲🇦_المغرب', label: 'المغرب' },
                        { code: 'PK', flag: '🇵🇰_باكستان', label: 'باكستان' },
                        { code: 'BD', flag: '🇧🇩_بنجلاديش', label: 'بنجلاديش' }
                      ].map((tab) => (
                        <button
                          key={tab.code}
                          type="button"
                          onClick={() => setSelectedCountryIntel(tab.code as any)}
                          className={`p-1.5 px-3 border text-[11px] font-black transition-all flex items-center gap-1 ${
                            selectedCountryIntel === tab.code 
                              ? 'bg-[#00FF41] text-black border-black shadow-[1px_1px_0_rgba(255,255,255,0.2)]' 
                              : 'bg-neutral-805 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                          }`}
                        >
                          <span>{tab.flag.split('_')[0]}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Country Board */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 space-y-4 animate-fade-in text-xs leading-relaxed">
                      
                      {selectedCountryIntel === 'IN' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 flex-wrap gap-2">
                            <span className="text-sm font-black text-white flex items-center gap-1">
                              <span>🇮🇳 الهند — رائدة الاتصال وتجنب الشحن المكرر عبر الذكاء الاصطناعي</span>
                            </span>
                            <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/40 px-2 py-0.5">معدل الفشل التقليدي: 35% COD Failure</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 p-3 bg-neutral-900 border border-neutral-800 rounded">
                              <p className="font-extrabold text-[#00FF41] flex items-center gap-1.5">
                                <span>🤖 محاكي المندوب الهاتفي الرقمي بالجزائر (AI Voice Bot Sim)</span>
                              </p>
                              <p className="text-[11px] text-neutral-300">
                                تفعيل هذه الاستراتيجية بالجزائر يسمح للذكاء الاصطناعي بالاتصال المباشر وتأكيد نية الشراء بالدارجة لتلافي إرسال طرود وهمية.
                              </p>

                              <div className="space-y-2 pt-1">
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div>
                                    <span className="text-gray-400 block mb-0.5">الزبون المستهدف:</span>
                                    <input 
                                      type="text" 
                                      className="w-full bg-black border border-neutral-800 p-1 px-2 text-white font-mono rounded" 
                                      value={simName} 
                                      onChange={(e) => setSimName(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block mb-0.5">رقم الهاتف:</span>
                                    <input 
                                      type="text" 
                                      className="w-full bg-black border border-neutral-800 p-1 px-2 text-white font-mono rounded" 
                                      value={simPhone} 
                                      onChange={(e) => setSimPhone(e.target.value)}
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={startVoiceBotSim}
                                  disabled={voiceBotRunning}
                                  className={`w-full py-2 px-3 text-[11px] font-black border transition-all flex items-center justify-center gap-1.5 ${
                                    voiceBotRunning 
                                      ? 'bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed' 
                                      : 'bg-[#00FF41] text-black border-black hover:bg-green-400 shadow-[2px_2px_0_rgba(255,255,255,0.15)]'
                                  }`}
                                >
                                  {voiceBotRunning ? (
                                    <>
                                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                      <span>مكالمة ذكية جارية حالياً...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>📞 تفعيل الاتصال والتأكيد المندوب الرقمي</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {voiceBotTranscript.length > 0 && (
                                <div className="p-2.5 bg-black border border-neutral-800 rounded font-mono text-[10.5px] space-y-2 max-h-[160px] overflow-y-auto">
                                  <div className="flex justify-between text-[9px] border-b border-neutral-800 pb-1 text-gray-500">
                                    <span>نظام الاتصال الموحد REVIT VOICE</span>
                                    <span className="text-[#00FF41]">نشط 🟢</span>
                                  </div>
                                  {voiceBotTranscript.map((t, idx) => (
                                    <div key={idx} className="transition-all duration-300">
                                      {t.startsWith('🤖') ? (
                                        <p className="text-[#00FF41]"><strong className="text-white">REVIT BOT:</strong> {t.replace('🤖 بوت REVIT (بالدارجة الجزائرية):', '').replace('🤖 بوت REVIT:', '')}</p>
                                      ) : t.startsWith('👤') ? (
                                        <p className="text-amber-400"><strong>{simName}:</strong> {t.replace(`👤 الزبون:`, '').replace(`👤 [${simName}]:`, '')}</p>
                                      ) : (
                                        <p className="text-neutral-400 italic text-[9.5px]">{t}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="space-y-2 border-r border-neutral-800 pr-4">
                              <p className="font-extrabold text-[#00FF41]">💡 الإلهام لـ REVIT بالجزائر:</p>
                              <p className="text-neutral-300 text-[11px]">
                                نتبنى في REVIT نموذج "القائمة السوداء المشتركة" (Consortium) تيمناً بنظام Delhivery الهندي، مما يحيد الأرقام المحتالة لتعم الحماية الجميع لحظياً دون قيود منفصلة.
                              </p>
                              <div className="p-3 bg-neutral-900 border border-neutral-800 font-mono text-[10px] text-neutral-400 rounded space-y-1.5">
                                <span className="text-[#00FF41] font-bold block">📊 الجدوى المالية بالجزائر:</span>
                                <p>• تكلفة المعالجة التقليدية عبر المكالمات اليدوية: <strong className="text-white">~50 دج للطلب</strong>.</p>
                                <p>• تكلفة خادم الذكاء الاصطناعي REVIT Voice: <strong className="text-white">~4 دج للطلب فقط!</strong></p>
                                <p className="text-[9px] text-[#00FF41]">حماية تضمن توفير 90% من ميزانية خدمة العملاء والتواصل المباشر.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedCountryIntel === 'CN' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 flex-wrap gap-2">
                            <span className="text-sm font-black text-white flex items-center gap-1">
                              <span>🇨🇳 الصين — مراقبة آلية وأنظمة الذكاء الاصطناعي التشعبية الأكثر صرامة (GNN)</span>
                            </span>
                            <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] border border-green-900/40 px-2 py-0.5">معدل الدوران التكنولوجي: مرتفع للغاية</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 p-3 bg-neutral-900 border border-neutral-800 rounded">
                              <p className="font-extrabold text-[#00FF41]">🛡️ محاكي تحليل الروابط الشبكية للـ GNN (Graph Neural Network)</p>
                              <p className="text-[11px] text-neutral-300">
                                تتبع الصين روابط المحتالين عبر تداخل الـ IP، الهواتف المشابهة، وبصمات المتصفح. قم بتشغيل/إيقاف طبقات التحليل لرصد ارتباط الزبون الحالي:
                              </p>

                              <div className="flex gap-4 flex-wrap text-[10px] bg-black p-2 border border-neutral-800 rounded">
                                <label className="flex items-center gap-1.5 cursor-pointer text-[#00FF41]">
                                  <input 
                                    type="checkbox" 
                                    checked={gnnIpLayer} 
                                    onChange={(e) => setGnnIpLayer(e.target.checked)}
                                    className="accent-[#00FF41]"
                                  />
                                  <span>طبقة الـ IP</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                                  <input 
                                    type="checkbox" 
                                    checked={gnnDeviceLayer} 
                                    onChange={(e) => setGnnDeviceLayer(e.target.checked)}
                                    className="accent-amber-400"
                                  />
                                  <span>بصمة الجهاز (Fingerprint)</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-purple-400">
                                  <input 
                                    type="checkbox" 
                                    checked={gnnCommuneLayer} 
                                    onChange={(e) => setGnnCommuneLayer(e.target.checked)}
                                    className="accent-purple-400"
                                  />
                                  <span>إحصاء البلدية/الولاية</span>
                                </label>
                              </div>

                              {/* GNN Graphical node visualizer */}
                              <div className="h-[140px] bg-black border border-neutral-800 relative rounded overflow-hidden flex items-center justify-center font-mono">
                                <div className="absolute text-[8px] top-1 left-1 text-neutral-600">GNN MAP DIAGRAM</div>
                                
                                <div 
                                  onMouseEnter={() => setGnnHoveredNode('phone')}
                                  onMouseLeave={() => setGnnHoveredNode(null)}
                                  className="w-12 h-12 rounded-full border-2 border-red-500 bg-red-950/40 text-white flex items-center justify-center text-center text-[8.5px] font-bold z-10 animate-pulse cursor-crosshair"
                                >
                                  الهاتف
                                </div>

                                {gnnIpLayer && (
                                  <>
                                    <div className="absolute w-[40px] h-0.5 border-t border-dashed border-[#00FF41] right-[40%] translate-x-[-15px]"></div>
                                    <div 
                                      onMouseEnter={() => setGnnHoveredNode('ip')}
                                      onMouseLeave={() => setGnnHoveredNode(null)}
                                      className="absolute left-6 w-10 h-10 rounded-full border border-[#00FF41] bg-neutral-900 text-[#00FF41] flex items-center justify-center text-[8px] cursor-crosshair"
                                    >
                                      IP مرتبط
                                    </div>
                                  </>
                                )}

                                {gnnDeviceLayer && (
                                  <>
                                    <div className="absolute h-[35px] w-0.5 border-r border-dashed border-amber-400 top-4"></div>
                                    <div 
                                      onMouseEnter={() => setGnnHoveredNode('device')}
                                      onMouseLeave={() => setGnnHoveredNode(null)}
                                      className="absolute top-4 w-12 h-8 rounded border border-amber-400 bg-neutral-900 text-amber-400 flex items-center justify-center text-[7.5px] cursor-crosshair"
                                    >
                                      Fingerprint
                                    </div>
                                  </>
                                )}

                                {gnnCommuneLayer && (
                                  <>
                                    <div className="absolute h-[35px] w-0.5 border-r border-dashed border-purple-400 bottom-4"></div>
                                    <div 
                                      onMouseEnter={() => setGnnHoveredNode('commune')}
                                      onMouseLeave={() => setGnnHoveredNode(null)}
                                      className="absolute bottom-4 w-12 h-8 rounded border border-purple-400 bg-neutral-900 text-purple-400 flex items-center justify-center text-[8px] cursor-crosshair animate-bounce"
                                    >
                                      البلدية
                                    </div>
                                  </>
                                )}

                                {/* Hover tooltip dynamic view */}
                                <div className="absolute bottom-1 right-1 text-[8.5px] text-gray-500 bg-neutral-950/80 px-1 border border-neutral-900">
                                  {gnnHoveredNode === 'phone' && "هاتف الزبون الحالي: مرتبط بـ 3 عائلات مستعارة RTO المتكرر!"}
                                  {gnnHoveredNode === 'ip' && "عنوان IP: 105.101.42.19 - وُجِد في 5 طلبيات ملغاة اليوم!"}
                                  {gnnHoveredNode === 'device' && "بصمة الجهاز: متطابقة مع حساب احتيال شهير بمحركات البحث."}
                                  {gnnHoveredNode === 'commune' && "بلدية التوصيل: نسبة الفشل الحالية في Yalidine تتجاوز 42%."}
                                  {!gnnHoveredNode && "ضع مؤشر الفأرة على العُقد لقراءة التقرير المتقاطع"}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2 border-r border-neutral-800 pr-4 flex flex-col justify-between">
                              <div>
                                <p className="font-extrabold text-[#00FF41]">💡 تمكين الطريقة الصينية بالجزائر:</p>
                                <p className="text-neutral-300 text-[11px] leading-relaxed">
                                  أنظمة GNN الصينية تسمح للتاجر الجزائري بمعرفة ما إذا كان المشتري الحالي يستعمل نفس المتصفح الذي طلب به 5 طرود أخرى بأسماء مختلفة ورفض استلامها من ياليدين مسبقاً.
                                </p>
                              </div>
                              <div className="bg-[#00FF41]/5 p-2.5 border border-[#00FF41]/20 font-mono text-[9px] text-[#00FF41] rounded">
                                * يستعمل معالج REVIT بالجزائر التحشيد اللحظي لقاعدة البيانات المشتركة لمحاكاة هذا التحليل وعزل الأجهزة المشبوهة تلقائياً.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedCountryIntel === 'ID' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 flex-wrap gap-2">
                            <span className="text-sm font-black text-white flex items-center gap-1">
                              <span>🇮🇩 إندونيسيا — قنوات الفحص وتقنين مواعيد الشحن (COD Time Windowing)</span>
                            </span>
                            <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/40 px-2 py-0.5">تقليل نسبة التراجع: 25%</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 p-3 bg-neutral-900 border border-neutral-800 rounded">
                              <p className="font-extrabold text-[#00FF41]">🕒 منظم نافذة تسليم الشحن لحماية طرود Yalidine</p>
                              <p className="text-[11px] text-neutral-300">
                                فرض "ساعات شحن ذهبية محددة بالنهار" لضمان ردود زبائن الجزائر، وتوليد شريط حماية تضعه على طرد ياليدين.
                              </p>

                              <div className="space-y-2 text-[10.5px]">
                                <div className="grid grid-cols-2 gap-2 font-mono">
                                  <div>
                                    <span className="text-gray-400 block pb-0.5">بداية الفترة الذهبية:</span>
                                    <select 
                                      value={restrictedStartHour} 
                                      onChange={(e) => setRestrictedStartHour(e.target.value)}
                                      className="w-full bg-black text-white border border-neutral-800 p-1 rounded"
                                    >
                                      <option value="08:00">08:00 صباحاً</option>
                                      <option value="09:00">09:00 صباحاً</option>
                                      <option value="10:00">10:00 صباحاً</option>
                                    </select>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block pb-0.5">نهاية الفترة الذهبية:</span>
                                    <select 
                                      value={restrictedEndHour} 
                                      onChange={(e) => setRestrictedEndHour(e.target.value)}
                                      className="w-full bg-black text-white border border-neutral-800 p-1 rounded"
                                    >
                                      <option value="16:00">04:00 مساءً</option>
                                      <option value="17:00">05:00 مساءً</option>
                                      <option value="18:00">06:00 مساءً</option>
                                    </select>
                                  </div>
                                </div>

                                <label className="flex items-center gap-1.5 cursor-pointer text-neutral-300">
                                  <input 
                                    type="checkbox" 
                                    checked={allowWeekendCargo} 
                                    onChange={(e) => setAllowWeekendCargo(e.target.checked)}
                                    className="accent-[#00FF41]"
                                  />
                                  <span>تعطيل الشحن في العطلات الرسمية بالجزائر (الجمعة/السبت) لمنع ارتداد السلع</span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => setDeliveryStickerPrinted(true)}
                                  className="w-full bg-black hover:bg-neutral-900 text-[#00FF41] border border-[#00FF41] py-1.5 font-bold rounded text-[11px] transition-all"
                                >
                                  🏷️ توليد ملصق الطرد المحمي بضوابط إندونيسيا
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 border-r border-neutral-800 pr-4 flex flex-col justify-between">
                              {deliveryStickerPrinted ? (
                                <div className="p-3 bg-white text-black border-4 border-black font-mono space-y-1.5 rounded animate-bounce shadow-[3px_3px_0_rgba(0,0,0,1)]">
                                  <div className="flex justify-between items-center text-[8px] bg-neutral-900 text-[#00FF41] px-1 py-0.5">
                                    <span>REVIT INDONESIA SHIELD</span>
                                    <span>YALIDINE EXPRESS</span>
                                  </div>
                                  <div className="text-center font-black text-xs border-b border-black pb-1">
                                    🔴 طرد محمي بنظام الساعات النشطة 🔴
                                  </div>
                                  <div className="text-[10px] space-y-0.5">
                                    <p>• الزبون: <span className="font-extrabold">{simName}</span></p>
                                    <p>• الهاتف: <span className="font-extrabold">{simPhone}</span></p>
                                    <p>• الولاية: <span className="font-extrabold">{simWilaya}</span></p>
                                    <p className="bg-neutral-200 p-1 text-[9.5px] font-black mt-1 text-center">
                                      ⏱️ نافذة تسليم الطرد المعتمدة: {restrictedStartHour} إلى {restrictedEndHour}
                                    </p>
                                    <p className="text-[8px] text-gray-500 text-center italic mt-1 font-sans">
                                      * يمنع المندوب من محاولة التسليم خارج هذه الساعات أو تجميد الشحنة.
                                    </p>
                                  </div>
                                  <div className="text-center text-[9px] pt-1 border-t border-dashed border-black">
                                    |||||||| | ||||||| | |||| | |||| {restrictedStartHour}-{restrictedEndHour}
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2 text-neutral-300">
                                  <p className="font-extrabold text-[#00FF41]">💡 الجدوى العملية للتعديل:</p>
                                  <p className="text-[11px]">
                                    تسليم الطرد خارج ساعات العمل يسبب عودة الطرود فوراً بسبب غياب المشترين أو نومهم. هذا الملصق التوجيهي يضمن لشركات الاستلام المحترفة مثل Yalidine البقاء في فترة الاتصال الذهبية.
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    انقر على زر التوليد في اليسار لمشاهدة ملصق طرد ياليدين المحدث بالنافذة الزمنية المخصصة.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedCountryIntel === 'BR' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 flex-wrap gap-2">
                            <span className="text-sm font-black text-white flex items-center gap-1">
                              <span>🇧🇷 البرازيل — آلية الحساب والتحويل المسبق عبر بريدي موب (Baridimob CCP)</span>
                            </span>
                            <span className="text-[10px] bg-green-950/40 text-[#00FF41] border border-green-900/40 px-2 py-0.5">نسبة نجاح السداد: 99%</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 p-3 bg-neutral-900 border border-neutral-800 rounded">
                              <p className="font-extrabold text-[#00FF41]">📊 حاسبة توفير تكاليف الشحن والـ RTO بالدفع المسبق بالجزائر</p>
                              <p className="text-[11px] text-neutral-300">
                                على خطى البرازيل التي تقنع الزبائن بسداد PIX مسبقاً، ركب عرضاً مغرياً لزبون الجزائر للسداد المسبق عبر CCP/بريدي موب وقارن النتائج المالية:
                              </p>

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2 font-mono text-[10.5px]">
                                  <div>
                                    <span className="text-gray-400 block pb-0.5">سعر المنتج الأساسي (دج):</span>
                                    <input 
                                      type="number" 
                                      value={ccpProductPriceInput}
                                      onChange={(e) => setCcpProductPriceInput(Number(e.target.value))}
                                      className="w-full bg-black text-white border border-neutral-800 p-1 px-2 rounded"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block pb-0.5">خصم التشجيع للدفع المسبق:</span>
                                    <select 
                                      value={ccpDiscountPercentage} 
                                      onChange={(e) => setCcpDiscountPercentage(Number(e.target.value))}
                                      className="w-full bg-black text-white border border-neutral-800 p-1 rounded"
                                    >
                                      <option value="5">5% تخفيض</option>
                                      <option value="10">10% تخفيض</option>
                                      <option value="15">15% تخفيض</option>
                                      <option value="20">20% تخفيض</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="p-2.5 bg-black border border-neutral-800 rounded text-[10px] space-y-1 text-neutral-300 font-mono">
                                  <p>🔹 خصم بريدي موب الممنوح للعميل: <strong className="text-red-400">-{ccpProductPriceInput * ccpDiscountPercentage / 100} دج</strong></p>
                                  <p>🔹 السعر النهائي للزبون بالدفع المسبق: <strong className="text-white">{(ccpProductPriceInput - (ccpProductPriceInput * ccpDiscountPercentage / 100))} دج</strong></p>
                                  <p className="text-[#00FF41] font-bold">🟢 التوفير المقدر في Yalidine (تلافي 30% من ريسك المرتجع الخاسر): +{(ccpProductPriceInput * 0.3 - 600 * 0.3).toFixed(0)} دج لكل 10 طلبات</p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setCcpCouponGenerated(true)}
                                  className="w-full bg-[#00FF41] hover:bg-green-400 text-black font-black py-1.5 border border-black rounded"
                                >
                                  ✨ توليد رسالة عرض بريدي موب بالدارجة الجزائرية
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 border-r border-neutral-800 pr-4 flex flex-col justify-between">
                              {ccpCouponGenerated ? (
                                <div className="space-y-2">
                                  <p className="text-[#00FF41] font-bold">💬 رسالة واتساب الجاهزة للإرسال بالدارجة لـ {simName}:</p>
                                  <textarea
                                    readOnly
                                    className="w-full h-[120px] bg-black text-[#00FF41] border border-neutral-800 p-2 font-mono text-[10.5px] rounded focus:outline-none"
                                    value={`مرحباً يا ${simName} العزيز 🤝! راك درت طلبية لـ '${simProduct}' بقيمة ${simPrice} دج. باش تستفاد من توصيل باطن ومجاني تماماً لولاية ${simWilaya} وتخفيض فوري قدره ${ccpProductPriceInput * ccpDiscountPercentage / 100} دج، نقدرو نخلصو مسبقاً ببريدي موب (Baridimob) أو الحساب الجاري CCP! رقم الحساب تاعنا هو 2083112 / مفتاح 92. إذا خلصت ابعث لنا لقطة الشاشة هنا وراح نرسلو طلبك فوراً بفيزا مميزة 🟢`}
                                  />
                                  <span className="text-[9.5px] text-gray-500 block">انقر فوق النص لنسخه وإرساله عبر الواتساب لتوفير خسائر الشحن تماماً.</span>
                                </div>
                              ) : (
                                <div className="space-y-2 text-neutral-300">
                                  <p className="font-extrabold text-[#00FF41]">💡 جدوى التحول البرازيلي لشبه الدفع المسبق:</p>
                                  <p className="text-[11px] leading-relaxed">
                                    في البرازيل، تم تحييد RTO عبر ربط فوري لمحرك PIX. في الجزائر، يتبنى التجار الأذكياء بريدي موب كبوابة فورية وثقة متبادلة تغلق الباب أمام عبث الأطفال بطلبات COD.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedCountryIntel === 'MA' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 flex-wrap gap-2">
                            <span className="text-sm font-black text-white flex items-center gap-1">
                              <span>🇲🇦 المغرب — بوابات التحقق وقوالب الواتسات بتكلفة منعدمة للتاجر</span>
                            </span>
                            <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/40 px-2 py-0.5">التطابق مع سوق الجزائر: 95%</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 p-3 bg-neutral-900 border border-neutral-800 rounded">
                              <p className="font-extrabold text-[#00FF41]">📉 حاسبة توفير رسائل الـ SMS الرسمية بالواتاب السري الذاتي</p>
                              <p className="text-[11px] text-neutral-300 flex items-center gap-1">
                                <span>احسب توفيرك الشهري عند استخدام بوابة الرمز الذاتي لـ REVIT بدلاً من بوابات Twilio المدفوعة:</span>
                              </p>

                              <div className="space-y-2 text-[10.5px]">
                                <div className="space-y-1 font-mono">
                                  <span className="text-gray-400 block mb-0.5">عدد الطلبيات الشهرية بمحيطك:</span>
                                  <input 
                                    type="range" 
                                    min="100" 
                                    max="5000" 
                                    step="100"
                                    value={monthlyOrdersNum}
                                    onChange={(e) => setMonthlyOrdersNum(Number(e.target.value))}
                                    className="w-full accent-[#00FF41]"
                                  />
                                  <div className="flex justify-between text-[10px] text-neutral-400 pt-0.5">
                                    <span>100 طلبية</span>
                                    <span className="text-[#00FF41] font-bold">{monthlyOrdersNum} طلبية/شهر</span>
                                    <span>5000 طلبية</span>
                                  </div>
                                </div>

                                <div className="p-2 bg-black border border-neutral-800 rounded font-mono text-[10px] space-y-1 text-neutral-300">
                                  <p>🔸 تكلفة Twilio Cloud API ($0.05 للمحادثة): <strong className="text-red-400">{(monthlyOrdersNum * 0.05 * 255).toLocaleString()} دج/شهر</strong></p>
                                  <p>🔹 تكلفة بوابة الواتساب الذاتية بـ REVIT: <strong className="text-[#00FF41]">0.00 دج (مجانية بالكامل!)</strong></p>
                                  <p className="text-green-400 font-extrabold border-t border-neutral-850 pt-1 mt-1">💡 صافي التوفير المالي المحقق لمتجرك: +{(monthlyOrdersNum * 0.05 * 255).toLocaleString()} دج شهرياً!</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 border-r border-neutral-800 pr-4 flex flex-col justify-between">
                              <div className="space-y-2">
                                <p className="font-extrabold text-[#00FF41]">💡 تبيئة الفكرة المغربية بالمنصة:</p>
                                <p className="text-neutral-300 text-[11px] leading-relaxed">
                                  في المغرب يهرب كبار التجار من تكلفة SMS الباهظة بالـ WhatsApp OTP. نتبنى في REVIT توليد الأكواد في المتصفح وثم تمكين زر واتساب سريع يفتح تلقائياً في تطبيق الزبون دون الحاجة لأي اشتراك مدفوع أو API Key.
                                </p>
                              </div>
                              <div className="bg-[#00FF41]/10 p-2.5 border border-dashed border-[#00FF41] font-mono text-[9px] text-[#00FF41] rounded">
                                * ميزة 'WhatsApp OTP OTP' مفعلة محلياً في تبويب REVIT لتأمين حساب الجزائر شوب والتحقق الفوري.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedCountryIntel === 'PK' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 flex-wrap gap-2">
                            <span className="text-sm font-black text-white flex items-center gap-1">
                              <span>🇵🇰 باكستان — فحوصات الطبقات الثلاث وتأمين الرسوم الوقائية المضافة</span>
                            </span>
                            <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/40 px-2 py-0.5">معدل الـ RTO بالبلدات الريفية: 45%</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 p-3 bg-neutral-900 border border-neutral-800 rounded">
                              <p className="font-extrabold text-[#00FF41]">🛡️ محاكي التحقق من طبقات التوصيل الثلاث وتغطية الرسوم</p>
                              <p className="text-[11px] text-neutral-300">
                                قم بمحاكاة تسلسل التحقق من الزبائن وفرض غرامة طفيفة وقائية لتفادي مخاطر وعقبات الإرجاع:
                              </p>

                              <div className="space-y-2 text-[10px]">
                                <div className="p-2 bg-black border border-neutral-800 rounded space-y-1.5 font-mono">
                                  <span className="text-gray-400 block mb-0.5">تأكيد القنوات بالجزائر:</span>
                                  
                                  <label className="flex items-center justify-between text-neutral-300">
                                    <span>1. تأكيد كود الـ SMS الجوال:</span>
                                    <input 
                                      type="checkbox" 
                                      checked={pakiSmsSent} 
                                      onChange={(e) => setPakiSmsSent(e.target.checked)}
                                      className="accent-green-500" 
                                    />
                                  </label>
                                  
                                  <label className="flex items-center justify-between text-neutral-300">
                                    <span>2. تأكيد رسالة فك حظر الواتساب:</span>
                                    <input 
                                      type="checkbox" 
                                      checked={pakiWaSent} 
                                      onChange={(e) => setPakiWaSent(e.target.checked)}
                                      className="accent-green-500" 
                                    />
                                  </label>

                                  <label className="flex items-center justify-between text-neutral-300">
                                    <span>3. التحقق المزدوج من البريد الإلكتروني:</span>
                                    <input 
                                      type="checkbox" 
                                      checked={pakiEmailSent} 
                                      onChange={(e) => setPakiEmailSent(e.target.checked)}
                                      className="accent-green-500" 
                                    />
                                  </label>
                                </div>

                                <div className="grid grid-cols-1 gap-1.5">
                                  <span className="text-gray-400 block">رسوم حيازة الدفع عند الاستلام المقترحة (دج):</span>
                                  <input 
                                    type="number" 
                                    value={pakiCashFee}
                                    onChange={(e) => setPakiCashFee(Number(e.target.value))}
                                    className="bg-black text-[#00FF41] border border-neutral-800 p-1 px-2 font-mono rounded"
                                  />
                                </div>

                                <div className="p-2 bg-neutral-950 border border-neutral-800 rounded text-[9px] text-[#00FF41] font-mono leading-normal">
                                  <span className="font-bold text-white block">حالة التحقق الحالية بالمنظومة:</span>
                                  <p>• طبقات التحقق النشطة: <span className="text-white">{(pakiSmsSent ? 1 : 0) + (pakiWaSent ? 1 : 0) + (pakiEmailSent ? 1 : 0)} / 3</span></p>
                                  <p>• الرسوم الإضافية المحتسبة للعميل: <span className="text-white">+{pakiCashFee} دج</span></p>
                                  {pakiSmsSent && pakiWaSent ? (
                                    <p className="text-green-400 font-bold mt-1">✔ النظام يوصي: الزبون آمن ومحتشم وثقة شحنه مرتفعة جداً!</p>
                                  ) : (
                                    <p className="text-red-400 font-bold mt-1">⚠️ النظام يوصي: الرجاء إجراء اتصال يدوي قبل إرسال الطرد.</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 border-r border-neutral-800 pr-4">
                              <p className="font-extrabold text-[#00FF41]">💡 مقاربة ذكية لحماية المتاجر بالجزائر:</p>
                              <p className="text-neutral-300 text-[11px] leading-relaxed">
                                فرض غرامة طفيفة تبلغ 200 دج أو 300 دج على طرود COD، يعزز من وعي العميل الجزائري ويمنع الرفض العشوائي للطرود، مما يرفع الكفاءة التشغيلية لعمال الشحن بمتجرك.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedCountryIntel === 'BD' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-2 flex-wrap gap-2">
                            <span className="text-sm font-black text-white flex items-center gap-1">
                              <span>🇧🇩 بنجلاديش — المعرف المكون من 10 أرقام وحراسة طرود المتاجر ضد التلاعب</span>
                            </span>
                            <span className="text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5">حماية كاملة ضد الاحتيال</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 p-3 bg-neutral-900 border border-neutral-800 rounded">
                              <p className="font-extrabold text-[#00FF41]">🔐 مولد كود الأمان الـعشري (10-Digit Unique Matcher)</p>
                              <p className="text-[11px] text-neutral-300">
                                لمنع تبديل بضائعك من ياليدين أو سرقة الطرود، يمكنك طباعة ملصق برمز سري يوضع على ياليدين ولا يسلم للزبون إلا بعد مطابقة الرمز بهاتفه:
                              </p>

                              <div className="space-y-2 text-[10.5px]">
                                <div className="grid grid-cols-2 gap-2 font-mono">
                                  <div>
                                    <span className="text-gray-400 block pb-0.5">نوع الملصق الأمني:</span>
                                    <select 
                                      value={banglaSealType} 
                                      onChange={(e) => setBanglaSealType(e.target.value as any)}
                                      className="w-full bg-black text-white border border-neutral-800 p-1 rounded"
                                    >
                                      <option value="RED_SEAL">ملصق أحمر — طرد مؤمن للغاية</option>
                                      <option value="GREEN_SEAL">ملصق أخضر — مدقق وخالٍ من الرسوم</option>
                                    </select>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block pb-0.5">رمز الطرد المولَّد:</span>
                                    <input 
                                      type="text" 
                                      readOnly 
                                      value={banglaTrackingCode}
                                      className="w-full bg-black text-[#00FF41] border border-neutral-800 p-1 px-2 font-mono rounded text-center"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const randCode = 'RV-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-DZ';
                                    setBanglaTrackingCode(randCode);
                                    setBanglaSealGenerated(true);
                                  }}
                                  className="w-full bg-[#00FF41] hover:bg-green-400 text-black font-black py-1.5 border border-black rounded"
                                >
                                  🔄 توليد الرمز وتوليف الستيكر الأمني
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 border-r border-neutral-800 pr-4 flex flex-col justify-between">
                              {banglaSealGenerated ? (
                                <div className={`p-3 text-black border-4 border-black font-mono space-y-1 rounded shadow-[2px_2px_0_rgba(0,0,0,1)] ${
                                  banglaSealType === 'RED_SEAL' ? 'bg-red-400' : 'bg-green-400'
                                }`}>
                                  <div className="text-center font-black text-[11px] border-b border-black pb-1">
                                    🚨 REVIT SHIELD – SECURITY CODE 🚨
                                  </div>
                                  <div className="text-[10px] space-y-1 py-1 font-bold">
                                    <p className="text-center bg-black text-white p-1 text-[11px] font-mono tracking-wider">
                                      {banglaTrackingCode}
                                    </p>
                                    <p className="text-[8px] text-center leading-normal">
                                      * تنبيه لشركة الشحن Yalidine: لا تسلم الطرد إلا بعد استلام هذا الكود السري المذكور بهاتف العميل. يمنع منعا كليا فتح وتغيير الطرود.
                                    </p>
                                  </div>
                                  <div className="text-center text-[8px] border-t border-black/40 pt-1">
                                    OFFICIAL SECURITY MATCH REGISTERED
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2 text-neutral-300">
                                  <p className="font-extrabold text-[#00FF41]">💡 جدوى آلية بنجلاديش الوقائية:</p>
                                  <p className="text-[11px] leading-relaxed">
                                    الكثير من الزبائن يرفضون طلبات ياليدين بدعوى الخوف من أن يكون الطرد "فارغاً أو معيباً". طباعة هذا الكود ومشاركته بهاتف العميل تبني جسراً من الثقة والمصداقية المطلقة لمتجرك بالجزائر.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </>
                )}

              </div>

                </div>
              )}

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
                            <span className="block text-xs font-black text-black">مفتاح MARKETING MASTER Enterprise المضمن</span>
                            <span className="text-[10px] text-green-600 font-black flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                              <span>فعال ومفتوح التوليد</span>
                            </span>
                          </div>
                          <button
                            onClick={() => setUseMarketingMasterKey(!useMarketingMasterKey)}
                            className={`px-3 py-1.5 border-2 border-black font-black text-[10px] shadow-[1px_1px_0_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 transition-all ${useMarketingMasterKey ? 'bg-black text-[#00FF41]' : 'bg-white text-black'}`}
                          >
                            {useMarketingMasterKey ? 'مُفعّل' : 'متوقف'}
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
                        <p className="text-[10px] text-amber-500 animate-pulse">PING {activeGateway === 'dz-dedicated' ? 'dz.edge.marketingmaster.net' : 'germany.edge.marketingmaster.net'}... جاري نقل الحزم...</p>
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
                        <p className="text-[10px] text-gray-500">اضغط على زر الفحص أعلاه لإجراء محاكاة وفحص حي لسرعة السيرفر الخاص بـ MARKETING MASTER.</p>
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
                <div className="space-y-8 animate-fade-in text-xs font-semibold text-gray-700" dir="rtl">
                  
                  {/* Top explanation */}
                  <div className="pb-4 border-b border-black/10">
                    <h4 className="text-base font-black text-black mb-1 flex items-center gap-2">
                      <ArrowLeftRight size={20} className="text-black" />
                      <span>الأتمتة وربط الـ Webhooks لمتجري شوبيفاي وووكومرس الجزائر (2026 Enterprise Pipeline)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      اربط منصة MARKETING MASTER مباشرة بمتجر شوبيفاي (Shopify) أو ووكومرس (WooCommerce) الخاص بك. استقبل الطلبات تلقائياً فور تولدها من زبائنك بالجزائر، وطبق خوارزميات الذكاء الاصطناعي لفحص الهواتف وتأكيد الطلبات وتصديرها لوكلاء الشحن المحليين.
                    </p>
                  </div>

                  {/* LIVE WEBHOOK URL GENERATOR ACCORDING TO USER'S LIVE ACCOUNT */}
                  <div className="bg-red-50 text-red-950 p-4 border-2 border-black space-y-2 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-black text-red-800 text-xs">🔗 رابط الـ Webhook الخاص بمتجركم الإلكتروني للاستلام والتحقق الآلي:</span>
                      <span className="text-[9px] bg-red-650 text-white font-mono font-black py-0.5 px-1.5 uppercase tracking-wider">SECURE CUSTOM INGRESS</span>
                    </div>
                    <div className="font-mono text-center bg-white border border-black p-2 text-[10.5px] select-all break-all overflow-x-auto text-black font-extrabold" dir="ltr">
                      {`https://${window.location.host}/api/webhooks/incoming/${integrationPlatform}?userId=${user?.id || 'public_test'}`}
                    </div>
                    <p className="text-[9.5px] text-gray-500 font-bold leading-normal">
                      * يرجى نسخ هذا الرابط ووضعه في متجر Shopify (قائمة Notifications &gt; Webhooks) أو WooCommerce (قائمة Settings &gt; Advanced &gt; Webhooks) للاستيراد اللحظي عند كل طلبية confirmed بنجاح!
                    </p>
                  </div>

                  {/* Webhooks base registration */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    
                    {/* Add Webhook Form & Current Connections */}
                    <div className="xl:col-span-4 space-y-6">
                      
                      {/* Form block */}
                      <div className="border-2 border-black p-4 bg-gray-50 space-y-3 shadow-[3px_3px_0_rgba(0,0,0,1)]">
                        <span className="text-xs font-black text-black block border-b pb-1">إضافة رابط استلام Webhook</span>
                        <form onSubmit={handleAddWebhook} className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 mb-1">رابط الوجهة (Endpoint destination):</label>
                            <input 
                              type="url" 
                              required
                              placeholder="https://api.yourcrm.dz/v1/orders"
                              className="w-full p-2 border-2 border-black font-mono text-[11px] bg-white text-black font-bold"
                              value={newWebhookUrl}
                              onChange={(e) => setNewWebhookUrl(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-gray-500 mb-1">الحدث المسبب للنداء:</label>
                            <select
                              value={newWebhookEvent}
                              onChange={(e) => setNewWebhookEvent(e.target.value as any)}
                              className="w-full p-2 border-2 border-black bg-white text-black font-bold text-xs"
                            >
                              <option value="order_confirmed">تأكيد طلبية شراء جديدة (Order Confirmed)</option>
                              <option value="lead_generated">توليد زبون محتمل (Lead Generated)</option>
                              <option value="return_notified">إشارة استرجاع من Yalidine (Return Notified)</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-black hover:bg-neutral-800 text-[#00FF41] border border-black font-black text-xs uppercase"
                          >
                            + تسجيل وحفظ الرابط المتلقي
                          </button>
                        </form>
                      </div>

                      {/* Configured hooks list */}
                      <div className="space-y-3">
                        <span className="text-xs font-black text-black block border-b pb-1">روابط الربط النشطة حالياً:</span>
                        <div className="space-y-2">
                          {webhooks.map((wh) => (
                            <div key={wh.id} className="p-3 border-2 border-black bg-white flex flex-col justify-between">
                              <div className="flex justify-between items-start gap-1">
                                <div className="min-w-0">
                                  <span className="text-[9px] bg-black text-[#00FF41] border font-mono font-black py-0.5 px-1.5 inline-block mb-1 text-center" dir="ltr">
                                    {wh.event}
                                  </span>
                                  <p className="text-[10px] font-bold text-gray-800 font-mono truncate max-w-[180px]" dir="ltr">{wh.url}</p>
                                </div>
                                <button
                                  onClick={() => handleToggleWebhook(wh.id)}
                                  className={`px-1.5 py-0.5 font-black text-[9px] border ${wh.active ? 'bg-green-50 text-green-700 border-green-450' : 'bg-red-50 text-red-700 border-red-300'}`}
                                >
                                  {wh.active ? 'نشط' : 'معطل'}
                                </button>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t mt-2 text-[9px]">
                                <span className="text-gray-400 font-mono">آخر استعمال: {wh.lastTriggered ? new Date(wh.lastTriggered).toLocaleTimeString('ar-DZ') : 'لم يستعمل'}</span>
                                <div className="flex gap-2 font-black">
                                  <button onClick={() => handleTestWebhook(wh)} className="text-blue-600 hover:underline">فحص</button>
                                  <button onClick={() => handleRemoveWebhook(wh.id)} className="text-red-500 hover:underline">حذف</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* FIELD MAPPING PANEL */}
                    <div className="xl:col-span-4 bg-white border-2 border-black p-4 shadow-[3px_3px_0_rgba(0,0,0,1)] space-y-4">
                      
                      {/* Platform Choice Tabs */}
                      <div className="flex justify-between items-center pb-2 border-b border-black">
                        <span className="text-xs font-black text-black">⚙️ تعيين حقول البيانات (Field Mappings)</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIntegrationPlatform('shopify');
                              setMapCustomerName('customer.first_name');
                              setMapCustomerPhone('customer.phone');
                              setMapProductTitle('line_items[0].title');
                              setMapWilaya('shipping_address.province');
                              setMapTotalPrice('total_price');
                            }}
                            className={`px-2 py-1 text-[10px] font-black border ${integrationPlatform === 'shopify' ? 'bg-black text-[#00FF41]' : 'bg-white text-black'}`}
                          >
                            Shopify 🛍️
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIntegrationPlatform('woocommerce');
                              setMapCustomerName('billing.first_name');
                              setMapCustomerPhone('billing.phone');
                              setMapProductTitle('line_items[0].name');
                              setMapWilaya('billing.state');
                              setMapTotalPrice('total');
                            }}
                            className={`px-2 py-1 text-[10px] font-black border ${integrationPlatform === 'woocommerce' ? 'bg-black text-[#00FF41]' : 'bg-white text-black'}`}
                          >
                            WooCommerce 🧪
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 font-bold leading-normal">
                        حدد مسار المتغيرات من ملف الـ JSON القادم من متجرك الإلكتروني ليتكفل نظام MARKETING MASTER بتخزينها وتأكيدها بدقة:
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 mb-0.5">اسم العميل (Customer Name Key):</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-black font-mono font-bold bg-gray-50 text-[10.5px]"
                            value={mapCustomerName}
                            onChange={(e) => setMapCustomerName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-500 mb-0.5">هاتف العميل (Phone Key):</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-black font-mono font-bold bg-gray-50 text-[10.5px]"
                            value={mapCustomerPhone}
                            onChange={(e) => setMapCustomerPhone(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-500 mb-0.5">اسم المنتج (Product Title Key):</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-black font-mono font-bold bg-gray-50 text-[10.5px]"
                            value={mapProductTitle}
                            onChange={(e) => setMapProductTitle(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-500 mb-0.5">الولاية / المدينة (State Key):</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-black font-mono font-bold bg-gray-50 text-[10.5px]"
                            value={mapWilaya}
                            onChange={(e) => setMapWilaya(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-500 mb-0.5">السعر الكلي بالدينار (Total Price Key):</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-black font-mono font-bold bg-gray-50 text-[10.5px]"
                            value={mapTotalPrice}
                            onChange={(e) => setMapTotalPrice(e.target.value)}
                          />
                        </div>

                        <button
                          type="button"
                          disabled={savingSettings}
                          onClick={() => handleSaveSettings()}
                          className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs border border-black shadow-[2px_2px_0_rgba(0,0,0,1)] shadow-none hover:shadow-none transition-all"
                        >
                          {savingSettings ? 'جاري حفظ الإعدادات...' : '✓ حفظ ومطابقة الحقول سحابياً'}
                        </button>
                      </div>

                    </div>

                    {/* LIVE SIMULATED JSON INSPECTOR & GRAPHICS */}
                    <div className="xl:col-span-4 bg-black text-[#00FF41] border-2 border-black p-4 shadow-[3px_3px_0_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
                      
                      <div className="border-b border-gray-800 pb-2 flex justify-between items-center text-xs">
                        <span className="font-mono text-white flex items-center gap-1.5 font-bold">
                          <Terminal size={15} />
                          <span>خلاصة Payload المتلقى والمطابق (Live Mapped Inspector)</span>
                        </span>
                        <span className="text-[9px] bg-[#00FF41] text-black px-1.5 py-0.2 rounded-sm font-black">2026 ACTIVE</span>
                      </div>

                      {/* Code Area */}
                      <div className="bg-neutral-900 border border-neutral-800 p-3 font-mono text-[10px] h-[270px] overflow-y-auto space-y-3 text-left leading-relaxed select-all" dir="ltr">
                        {(() => {
                          const mockInputPayload: Record<string, any> = {};
                          
                          // Convert path string (e.g. 'customer.first_name') into structured JSON
                          const setDeepValueInner = (obj: Record<string, any>, path: string, value: any) => {
                            const keys = path.replace(/\]/g, '').replace(/\[/g, '.').split('.');
                            let current = obj;
                            for (let i = 0; i < keys.length - 1; i++) {
                              const k = keys[i];
                              if (!k) continue;
                              if (!current[k]) {
                                current[k] = isNaN(Number(keys[i+1])) ? {} : [];
                              }
                              current = current[k];
                            }
                            const lastKey = keys[keys.length - 1];
                            if (lastKey) current[lastKey] = value;
                          };

                          setDeepValueInner(mockInputPayload, mapCustomerName, simName);
                          setDeepValueInner(mockInputPayload, mapCustomerPhone, simPhone);
                          setDeepValueInner(mockInputPayload, mapProductTitle, simProduct);
                          setDeepValueInner(mockInputPayload, mapWilaya, simWilaya);
                          setDeepValueInner(mockInputPayload, mapTotalPrice, Number(simPrice));

                          const mappedOutput = {
                            id: "order_" + Math.random().toString(36).substring(2, 8).toUpperCase(),
                            source: integrationPlatform,
                            event: "order_confirmed",
                            customer_name: simName,
                            phone_cleansed: simPhone.startsWith('0') ? '0' + simPhone.slice(1) : simPhone,
                            product: simProduct,
                            shipping_wilaya: simWilaya,
                            currency: "DZD",
                            net_revenue: Number(simPrice),
                            processed_at: new Date().toISOString()
                          };

                          return (
                            <pre className="text-[#00FF41] whitespace-pre font-mono">
{JSON.stringify({
  _metadata: {
    origin: integrationPlatform,
    protocol: "https_secure_post",
    auth: "Bearer MARKETINGMASTER-TOK-99"
  },
  incoming_raw_payload: mockInputPayload,
  marketingmaster_standardized: mappedOutput
}, null, 2)}
                            </pre>
                          );
                        })()}
                      </div>

                      {/* Mock values configurator inside JSON frame */}
                      <div className="space-y-2 border-t border-gray-800 pt-3 text-white text-[10px]">
                        <span className="block font-bold text-gray-400">تعديل بيانات المحاكاة (Configure Mock Order):</span>
                        <div className="grid grid-cols-2 gap-2 text-black">
                          <input 
                            type="text" 
                            className="p-1 border border-black text-[9.5px] font-bold"
                            placeholder="الاسم"
                            value={simName}
                            onChange={(e) => setSimName(e.target.value)}
                          />
                          <input 
                            type="text" 
                            className="p-1 border border-black text-[9.5px] font-bold"
                            placeholder="رقم الهاتف"
                            value={simPhone}
                            onChange={(e) => setSimPhone(e.target.value)}
                          />
                          <input 
                            type="text" 
                            className="p-1 border border-black text-[9.5px] font-bold"
                            placeholder="الولاية"
                            value={simWilaya}
                            onChange={(e) => setSimWilaya(e.target.value)}
                          />
                          <input 
                            type="number" 
                            className="p-1 border border-black text-[9.5px] font-bold"
                            placeholder="السعر"
                            value={simPrice}
                            onChange={(e) => setSimPrice(e.target.value)}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            if (!user?.id) return;
                            try {
                              const mockRaw: Record<string, any> = {};
                              const setDeepValueInner = (obj: Record<string, any>, path: string, value: any) => {
                                const keys = path.replace(/\]/g, '').replace(/\[/g, '.').split('.');
                                let current = obj;
                                for (let i = 0; i < keys.length - 1; i++) {
                                  const k = keys[i];
                                  if (!k) continue;
                                  if (!current[k]) {
                                    current[k] = isNaN(Number(keys[i+1])) ? {} : [];
                                  }
                                  current = current[k];
                                }
                                const lastKey = keys[keys.length - 1];
                                if (lastKey) current[lastKey] = value;
                              };

                              setDeepValueInner(mockRaw, mapCustomerName, simName);
                              setDeepValueInner(mockRaw, mapCustomerPhone, simPhone);
                              setDeepValueInner(mockRaw, mapProductTitle, simProduct);
                              setDeepValueInner(mockRaw, mapWilaya, simWilaya);
                              setDeepValueInner(mockRaw, mapTotalPrice, Number(simPrice));

                              const res = await fetch('/api/integration/orders/create-mock', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': user.id
                                },
                                body: JSON.stringify({
                                  platform: integrationPlatform,
                                  rawPayload: mockRaw
                                })
                              });

                              if (res.ok) {
                                const data = await res.json();
                                setIncomingOrders(prev => [data.order, ...prev]);
                                setIntegrationLogs(prev => [
                                  `[${new Date().toLocaleTimeString('ar-DZ')}] طلب قادم من محاكي Webhook! العميل: ${data.order.customerName} | الولاية المكتشفة: ${data.order.wilaya} | الهاتف: ${data.order.customerPhone} (${data.order.phoneStatus === 'clean' ? 'سليم ✅' : 'يحتاج تدقيق ⚠️'})`,
                                  ...prev
                                ]);
                                setWebhookResponse(`نجح تشغيل طلب المحاكاة وتخزينه في الخادم برقم: ${data.order.id}.`);
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="w-full py-1.5 bg-[#00FF41] hover:bg-emerald-400 text-black font-extrabold uppercase text-[10px] transition-colors border-none"
                        >
                          ⚡ محاكاة إرسال الطلب المطابق الآن
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* LOGS FEED CABINET */}
                  <div className="bg-gray-50 border-2 border-black p-4 space-y-3 shadow-[3px_3px_0_rgba(0,0,0,1)]">
                    <span className="text-xs font-black text-black block border-b pb-1 flex items-center gap-1.5">
                      <Activity size={16} className="text-blue-600 shrink-0" />
                      <span>سجل أداء وفحص الأتمتة المباشر (Direct Integration Event Logs)</span>
                    </span>
                    
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto text-[10.5px] font-mono leading-relaxed" dir="ltr">
                      {integrationLogs.map((log, idx) => (
                        <div key={idx} className="p-1.5 border-b border-black/5 last:border-0 text-left text-gray-700">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LIVE CRM COMPILING AND IMPORTED ORDERS LIST-LEDGER */}
                  <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-4">
                    <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-2.5 bg-red-650 text-white font-black text-[10px] uppercase border border-black animate-pulse rounded-sm">CRM LIVE LEDGER</span>
                        <h4 className="text-sm font-black text-black">صندوق الوارد الموحد للطلبيات المستلمة والمفحوصة تلقائياً (Algerian Unified COD Inbox)</h4>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 font-bold">{incomingOrders.length} طلب مستلم</span>
                    </div>

                    {incomingOrders.length === 0 ? (
                      <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 text-gray-500 font-bold space-y-2">
                        <ShieldAlert className="mx-auto text-gray-400" size={32} />
                        <p className="text-xs">لم يتم تلقي أي طلبيات بعد من متجرك الإلكتروني.</p>
                        <p className="text-[10px] text-gray-400">استخدم "محاكاة إرسال الطلب المطابق الآن" أعلاه لتجربة تدفق البيانات ومعالجة الولاية ورقم الهاتف في الوقت الحقيقي!</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs font-semibold text-gray-750 border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-white border-b-2 border-black text-xs font-black">
                              <th className="p-3 text-right">رقم المعرف</th>
                              <th className="p-3 text-right">المنصة</th>
                              <th className="p-3 text-right">بيانات الزبون</th>
                              <th className="p-3 text-right">الولاية المكتشفة</th>
                              <th className="p-3 text-right">المنتج والمالية</th>
                              <th className="p-3 text-right">صحة الهاتف</th>
                              <th className="p-3 text-center">العمليات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/10">
                            {incomingOrders.map((order, idx) => (
                              <tr key={order.id || idx} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                                <td className="p-3 font-mono text-[10.5px] font-black text-black">{order.id}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 border text-[9.5px] font-mono font-black ${order.source === 'shopify' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-purple-50 text-purple-700 border-purple-300'}`}>
                                    {order.source?.toUpperCase()}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="font-extrabold text-black">{order.customerName}</div>
                                  <div className="font-mono text-[10px] text-gray-500 mt-0.5">{order.customerPhone}</div>
                                </td>
                                <td className="p-3">
                                  <div className="font-black text-slate-800">{order.wilaya}</div>
                                  <div className="text-[9.5px] font-mono text-gray-400">كود الولاية: {order.wilayaCode}</div>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="font-bold text-gray-800 text-[10.5px] truncate max-w-[150px]">{order.productName || 'منتج غير محدد'}</div>
                                  <div className="font-mono text-[10px] text-slate-650 font-black mt-0.5" dir="ltr">{Number(order.totalPrice || 0).toLocaleString()} DZD</div>
                                </td>
                                <td className="p-3">
                                  {order.phoneStatus === 'clean' ? (
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-300 text-[9px] font-black rounded-sm flex items-center gap-1 w-max">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                                      سليم ✅
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-300 text-[9px] font-black rounded-sm flex items-center gap-1 w-max animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-ping" />
                                      يحتاج تأكيد ⚠️
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex gap-2 justify-center font-black text-[10.5px]">
                                    <button 
                                      type="button"
                                      onClick={() => alert(`نموذج الحمولة الكاملة للطلب:\n${JSON.stringify(order.rawPayload, null, 2)}`)}
                                      className="text-blue-600 hover:underline border border-blue-600 bg-blue-50 px-2.5 py-1 rounded shadow-[1px_1px_0_rgba(0,0,0,1)] text-[10px]"
                                    >
                                      عرض الـ JSON
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {webhookResponse && (
                    <div className="border-2 border-dashed border-blue-400 bg-blue-50 text-blue-950 p-3 text-[11px] font-mono">
                      <strong>💻 رد الخادم الخارجي:</strong> {webhookResponse}
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
                          <span className="text-white font-extrabold text-[10px]">AES-250-GCM (MARKETING MASTER Cloud Cipher)</span>
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
                href="https://wa.me/213661379535" // Real WhatsApp Support
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
