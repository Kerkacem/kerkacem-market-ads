import { validateAlgerianPhone, getWilayaByCode, getWilayaByName } from './algeria-data';

export interface FraudAnalysisResult {
  isSuspicious: boolean;
  score: number; // 0 to 100
  riskLevel: 'safe' | 'suspicious' | 'danger';
  factors: string[];
}

// Detect fake names common in fake Algerian orders
const FAKE_NAMES_REGEX = /^(عميل|زبون|تاجر|اختبار|تجربة|مجهول|تست|الزبون|التاجر|test|tester|client|customer|anonymous|admin|guest|asdf|asd|aaaa|zzzz|qqqq|user|abc|xyz|123)$/i;

// Words commonly denoting organic physical addresses in Algeria
const PHYSICAL_ADDRESS_KEYWORDS = [
  "نهج", "شارع", "حي", "دوار", "فيلا", "عمارة", "حومة", "طريق", "بلدية", "ولاية", "مسكن", 
  "قرية", "قرب", "بجوار", "بين", "مقابل", "طابق", "باب", "rue", "avenue", "cite", "cité", 
  "villa", "batiment", "bâtiment", "quartier", "route", "village", "en face", "etage", "étage"
];

// High-Risk Wilayas in Algeria
const HIGH_RISK_RTO_WILAYAS = ["16", "31", "09", "35", "06"]; // Alger, Oran, Blida, Boumerdes, Bejaia

export function analyzeOrder(data: {
  customerName: string;
  customerPhone: string;
  wilayaCode?: string;
  wilayaName?: string;
  commune?: string;
  address?: string;
  totalPrice: number;
}): FraudAnalysisResult {
  const factors: string[] = [];
  let score = 0;

  // 1. Validate Algerian phone quality and pattern
  const phoneRes = validateAlgerianPhone(data.customerPhone);
  if (!phoneRes.isValid) {
    if (phoneRes.operator === "Burner (Suspicious)") {
      score += 45;
      factors.push("رقم وهمي بلاستيكي (تكرار نفس الرقم بشكل مكثف)");
    } else {
      score += 35;
      factors.push("الرقم لا يطابق صيغة مشغلي الهاتف بالجزائر (موبيليس، جيزي، أوريدو، أرضي)");
    }
  } else {
    // If phone is valid but has very few unique digits
    const digitsOnly = phoneRes.cleansed.replace(/\D/g, '');
    const uniqueDigits = new Set(digitsOnly.split('')).size;
    if (uniqueDigits < 4) {
      score += 25;
      factors.push("رقم هاتف مشبوه (يحتوي على أقل من 4 أرقام فريدة ومختلفة)");
    }
  }

  // 2. Discover fake names
  const cleanName = data.customerName.trim().toLowerCase();
  
  // Single word names or regex matches
  if (FAKE_NAMES_REGEX.test(cleanName) || cleanName.length < 3) {
    score += 30;
    factors.push(`الاسم المشترك يبدو وهمياً أو غير مكتمل: "${data.customerName}"`);
  }
  
  // Repeating letter patterns (e.g., "zzzzz" or "aaaa")
  if (/([a-zA-Z\u0600-\u06FF])\1{3,}/.test(cleanName)) {
    score += 25;
    factors.push("الاسم يحتوي على حروف مكررة بشكل يثير الشبهات (تم العثور على نمط سبام)");
  }

  // 3. Address inspections
  const cleanAddress = (data.address || '').trim().toLowerCase();
  if (cleanAddress) {
    // Detect numbers-only string sequence inside address
    const totalDigits = (cleanAddress.match(/\d/g) || []).length;
    if (totalDigits > 15) {
      score += 20;
      factors.push("العنوان يحتوي على أرقام عشوائية متتالية غير معتادة (قد يكون مدخلاً عشوائياً)");
    }

    // Check presence of physical landmark/location keywords
    const hasLocationKeyword = PHYSICAL_ADDRESS_KEYWORDS.some(word => cleanAddress.includes(word));
    if (!hasLocationKeyword && cleanAddress.length < 10) {
      score += 15;
      factors.push("العنوان مقتضب جداً ويفتقر للكلمات الدلالية المعتادة (مثل حي، شارع، عمارة)");
    }
  } else {
    score += 10;
    factors.push("العنوان الفعلي للزبون غير مدخل");
  }

  // 4. Missing Wilaya or Commune
  let finalWilayaCode = data.wilayaCode;
  if (!finalWilayaCode && data.wilayaName) {
    const matched = getWilayaByName(data.wilayaName);
    if (matched) finalWilayaCode = matched.code;
  }

  if (!finalWilayaCode || finalWilayaCode === "00") {
    score += 20;
    factors.push("لم يتم تحديد ولاية الاستلام بالجزائر (عنصر حرج للتسليم)");
  } else {
    // Wilaya is set. Is it a high-risk RTO area?
    if (HIGH_RISK_RTO_WILAYAS.includes(finalWilayaCode)) {
      score += 15; // Does not block alone, but increases risk score
      const wilaya = getWilayaByCode(finalWilayaCode);
      factors.push(`ولاية الاستلام (${wilaya?.nameAr || wilaya?.nameFr}) تصنف كولاية عالية المرتجعات RTO`);
    }
  }

  if (!data.commune || data.commune.trim().length === 0) {
    score += 12;
    factors.push("بلدية التوصيل غير محددة (يصعب فرز الطرود بدون البلدية)");
  }

  // 5. Normal consumer price ranges check in Algeria (DZD)
  // Low limits (<200 DZD is probably testing/garbage ordering)
  if (data.totalPrice < 200) {
    score += 25;
    factors.push("قيمة الطلبية تافهة جداً (< 200 دج) وتثير الشبهة");
  } 
  // Excessive high limit (>100,000 DZD without prepay check is high-risk COD)
  else if (data.totalPrice > 100000) {
    score += 35;
    factors.push("قيمة الطلبية مرتفعة جداً (> 100,000 دج)، معدل المخاطرة في الدفع عند الاستلام عالي");
  }

  // 6. Deduce risk levels
  let riskLevel: 'safe' | 'suspicious' | 'danger' = 'safe';
  if (score >= 40) {
    riskLevel = 'danger';
  } else if (score >= 20) {
    riskLevel = 'suspicious';
  }

  return {
    isSuspicious: riskLevel !== 'safe',
    score: Math.min(100, score),
    riskLevel,
    factors
  };
}
