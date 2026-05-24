// REVIT Algeria Data Module
// Includes 58 Wilayas with their codes, Arabic and French names, and Algerian phone validation utils.

export interface Wilaya {
  code: string;
  nameAr: string;
  nameFr: string;
  rtoRate: number; // Initial/Default RTO rate for heatmap coloring
}

export const ALGERIA_WILAYAS: Wilaya[] = [
  { code: "01", nameAr: "أدرار", nameFr: "Adrar", rtoRate: 15 },
  { code: "02", nameAr: "الشلف", nameFr: "Chlef", rtoRate: 25 },
  { code: "03", nameAr: "الأغواط", nameFr: "Laghouat", rtoRate: 18 },
  { code: "04", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi", rtoRate: 22 },
  { code: "05", nameAr: "باتنة", nameFr: "Batna", rtoRate: 28 },
  { code: "06", nameAr: "بجاية", nameFr: "Béjaïa", rtoRate: 46 }, // High linear COD/RTO risk
  { code: "07", nameAr: "بسكرة", nameFr: "Biskra", rtoRate: 19 },
  { code: "08", nameAr: "بشار", nameFr: "Béchar", rtoRate: 14 },
  { code: "09", nameAr: "البليدة", nameFr: "Blida", rtoRate: 48 }, // High Risk
  { code: "10", nameAr: "البويرة", nameFr: "Bouira", rtoRate: 31 },
  { code: "11", nameAr: "تمنراست", nameFr: "Tamanrasset", rtoRate: 12 },
  { code: "12", nameAr: "تبسة", nameFr: "Tébessa", rtoRate: 34 },
  { code: "13", nameAr: "تلمسان", nameFr: "Tlemcen", rtoRate: 21 },
  { code: "14", nameAr: "تيارت", nameFr: "Tiaret", rtoRate: 27 },
  { code: "15", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou", rtoRate: 38 },
  { code: "16", nameAr: "الجزائر العاصمة", nameFr: "Alger", rtoRate: 45 }, // High Risk
  { code: "17", nameAr: "الجلفة", nameFr: "Djelfa", rtoRate: 29 },
  { code: "18", nameAr: "جيجل", nameFr: "Jijel", rtoRate: 33 },
  { code: "19", nameAr: "سطيف", nameFr: "Sétif", rtoRate: 39 },
  { code: "20", nameAr: "سعيدة", nameFr: "Saïda", rtoRate: 24 },
  { code: "21", nameAr: "سكيكدة", nameFr: "Skikda", rtoRate: 35 },
  { code: "22", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès", rtoRate: 26 },
  { code: "23", nameAr: "عنابة", nameFr: "Annaba", rtoRate: 42 },
  { code: "24", nameAr: "قالمة", nameFr: "Guelma", rtoRate: 30 },
  { code: "25", nameAr: "قسنطينة", nameFr: "Constantine", rtoRate: 37 },
  { code: "26", nameAr: "المدية", nameFr: "Médéa", rtoRate: 32 },
  { code: "27", nameAr: "مستغانم", nameFr: "Mostaganem", rtoRate: 34 },
  { code: "28", nameAr: "المسيلة", nameFr: "M'Sila", rtoRate: 30 },
  { code: "29", nameAr: "معسكر", nameFr: "Mascara", rtoRate: 26 },
  { code: "30", nameAr: "ورقلة", nameFr: "Ouargla", rtoRate: 16 },
  { code: "31", nameAr: "وهران", nameFr: "Oran", rtoRate: 52 }, // Maximum COD fraud risk
  { code: "32", nameAr: "البيض", nameFr: "El Bayadh", rtoRate: 15 },
  { code: "33", nameAr: "إليزي", nameFr: "Illizi", rtoRate: 11 },
  { code: "34", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj", rtoRate: 29 },
  { code: "35", nameAr: "بومرداس", nameFr: "Boumerdès", rtoRate: 44 }, // High Risk
  { code: "36", nameAr: "الطارف", nameFr: "El Tarf", rtoRate: 28 },
  { code: "37", nameAr: "تندوف", nameFr: "Tindouf", rtoRate: 10 },
  { code: "38", nameAr: "تيسمسيلت", nameFr: "Tissemsilt", rtoRate: 26 },
  { code: "39", nameAr: "الوادي", nameFr: "El Oued", rtoRate: 18 },
  { code: "40", nameAr: "خنشلة", nameFr: "Khenchela", rtoRate: 25 },
  { code: "41", nameAr: "سوق أهراس", nameFr: "Souk Ahras", rtoRate: 24 },
  { code: "42", nameAr: "تيبازة", nameFr: "Tipaza", rtoRate: 39 },
  { code: "43", nameAr: "ميلة", nameFr: "Mila", rtoRate: 29 },
  { code: "44", nameAr: "عين الدفلى", nameFr: "Aïn Defla", rtoRate: 31 },
  { code: "45", nameAr: "النعامة", nameFr: "Naâma", rtoRate: 17 },
  { code: "46", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent", rtoRate: 22 },
  { code: "47", nameAr: "غرداية", nameFr: "Ghardaïa", rtoRate: 14 },
  { code: "48", nameAr: "غليزان", nameFr: "Relizane", rtoRate: 28 },
  { code: "49", nameAr: "المغير", nameFr: "El M'Ghair", rtoRate: 16 },
  { code: "50", nameAr: "المنيعة", nameFr: "El Meniaa", rtoRate: 13 },
  { code: "51", nameAr: "أولاد جلال", nameFr: "Ouled Djellal", rtoRate: 20 },
  { code: "52", nameAr: "برج باجي مختار", nameFr: "Bordj Baji Mokhtar", rtoRate: 12 },
  { code: "53", nameAr: "بني عباس", nameFr: "Béni Abbès", rtoRate: 14 },
  { code: "54", nameAr: "تيميمون", nameFr: "Timimoun", rtoRate: 15 },
  { code: "55", nameAr: "تقرت", nameFr: "Touggourt", rtoRate: 16 },
  { code: "56", nameAr: "جانت", nameFr: "Djanet", rtoRate: 10 },
  { code: "57", nameAr: "عين صالح", nameFr: "In Salah", rtoRate: 11 },
  { code: "58", nameAr: "عين قزام", nameFr: "In Guezzam", rtoRate: 9 }
];

// Sample list of major Algerian communes (municipalities) for the 1541 total
export const COMMUNE_SAMPLES: Record<string, string[]> = {
  "01": ["أدرار", "فنوغيل", "أولاد أحمد تيمي", "بودا", "زاوية كنتة", "رقان", "أولف"],
  "02": ["الشلف", "سنجاس", "الشطية", "أولاد فارس", "الزبوجة", "بوقادير", "تنس"],
  "03": ["الأغواط", "أفلو", "عين ماضي", "حاسي رمل", "قصر الحيران", "سيدي مخلوف"],
  "04": ["أم البواقي", "عين البيضاء", "عين مليلة", "عين كرشة", "مسكيانة", "عين فكرون"],
  "05": ["باتنة", "أريس", "بريكة", "عين التوتة", "مروانة", "المعذر", "تازولت"],
  "06": ["بجاية", "أقبو", "أميزور", "خراطة", "صدوق", "إغيل علي", "تيشي", "إوكسيلن"],
  "07": ["بسكرة", "أولاد جلال", "طولقة", "سيدي عقبة", "الزيبان", "الوطاية", "الدوسن"],
  "08": ["بشار", "القنادسة", "تاغيت", "بني عباس", "العبادلة", "لحمر", "موغل"],
  "09": ["البليدة", "أولاد يعيش", "بوفاريك", "العفرون", "موزاية", "الصومعة", "الشبلي", "حمام ملوان"],
  "10": ["البويرة", "الأخضرية", "سور الغزلان", "عين بسام", "مشد الله", "بشلول", "قاديرية"],
  "11": ["تمنراست", "عين صالح", "إين غار", "أبلسة", "تاظروك", "تين زواتين"],
  "12": ["تبسة", "بئر العاتر", "الشريعة", "الونزة", "الكويف", "عقلت قندوز", "العوينات"],
  "13": ["تلمسان", "مغنية", "منصورة", "ندرومة", "الغزوات", "أولاد ميمون", "سبدو"],
  "14": ["تيارت", "السوقر", "فرندة", "قصر الشلالة", "مهدية", "الدحموني", "مغيلة"],
  "15": ["تيزي وزو", "عزازقة", "ذراع الميزان", "لاربعاء ناث إيراثن", "عين الحمام", "واسيف", "أزفون"],
  "16": ["الجزائر الوسطى", "سيدي امحمد", "باب الواد", "الحراش", "الدار البيضاء", "برج البحري", "قبة", "بئر مراد رايس", "حي البدر", "شراقة", "الرويبة", "أولاد فايت", "سعيد حمدين", "الأبيار", "بن عكنون"],
  "17": ["الجلفة", "حاسي بحبح", "عين وسارة", "مسعد", "الشارف", "دار الشيوخ"],
  "18": ["جيجل", "الطاهير", "الميلية", "العوانة", "جيملة", "الشهنة", "زيامة منصورية"],
  "19": ["سطيف", "العلمة", "عين الكبيرة", "عين أرنات", "عين ولمان", "بوقاعة", "جميلة"],
  "20": ["سعيدة", "عين الحجر", "يوب", "الحساسنة", "اولاد خالد", "سيدي بوبكر"],
  "21": ["سكيكدة", "الحروش", "عزابة", "القل", "تمالوس", "رمضان جمال", "حمادي كرومة"],
  "22": ["سيدي بلعباس", "تسالة", "تلاغ", "سفيزف", "ابن باديس", "مولاي اسليسن"],
  "23": ["عنابة", "البوني", "الحجار", "سيدي عمار", "سرايدي", "برحال", "الشرفة"],
  "24": ["قالمة", "هيليوبوليس", "بوشقوف", "وادي الزناتي", "حمام الدباغ", "لخزارة"],
  "25": ["قسنطينة", "الخروب", "حامة بوزيان", "زيغود يوسف", "علي منجلي", "عين أعبيد", "بني حميدان"],
  "26": ["المدية", "البرواقية", "بني سليمان", "قصر البخاري", "وزرة", "تابلاط", "سي المحجوب"],
  "27": ["مستغانم", "سيدي علي", "عين تادلس", "بوقيرات", "عشعاشة", "مازغران", "حاسي ماماش"],
  "28": ["المسيلة", "بوسعادة", "سيدي عيسى", "مقرة", "أولاد دراج", "حمام الضلعة", "بلهادي"],
  "29": ["معسكر", "سيق", "المحمدية", "تيغنيف", "غريس", "عوف", "زهانة"],
  "30": ["ورقلة", "تقرت", "حاسي مسعود", "تماسين", "الرويسات", "عين البيضاء"],
  "31": ["وهران", "بئر الجير", "السانية", "قديل", "أرزيو", "عين الترك", "بطيوة", "حاسي بونيف", "مسيرغين", "سيدي الشحمي"],
  "32": ["البيض", "بوقطب", "الأبيض سيدي الشيخ", "بريزينة", "شلالة", "رقاصة"],
  "33": ["إليزي", "جانت", "إن أميناس", "برج عمر إدريس"],
  "34": ["برج بوعريريج", "رأس الوادي", "المنصورة", "مجانة", "الياشير", "برج غدير", "بليمور"],
  "35": ["بومرداس", "خميس الخشنة", "بودواو", "دلس", "برج منايل", "الثنية", "أولاد هداج", "يسر"],
  "36": ["الطارف", "القالة", "الذرعان", "بوثلجة", "شبيطة مختار", "البسباس"],
  "37": ["تندوف", "أم العسل"],
  "38": ["تيسمسيلت", "ثنية الحد", "لرجام", "خميستي", "عماري", "برج بونعامة"],
  "39": ["الوادي", "جامعة", "الدبيلة", "قمار", "المغير", "الرباح", "البهيمة"],
  "40": ["خنشلة", "ششار", "قايس", "بابار", "المحمل", "اولاد رشاش"],
  "41": ["سوق أهراس", "سدراتة", "مداوروش", "تاورة", "المراهنة", "الحدادة"],
  "42": ["تيبازة", "شرشال", "القليعة", "حجوط", "بوسماعيل", "الداموس", "قوراية", "فوكة"],
  "43": ["ميلة", "شلغوم العيد", "تاجنانت", "فرجيوة", "القرارم قوقة", "وادي العثمانية", "التلاغمة"],
  "44": ["عين الدفلى", "خميس مليانة", "مليانة", "العطاف", "العبادية", "جليدة", "جندل"],
  "45": ["النعامة", "مشرية", "عين الصفراء", "عسلة", "صفيصيفة", "المغار"],
  "46": ["عين تموشنت", "بني صاف", "حمام بوحجر", "العامرية", "المالح", "تارقة"],
  "47": ["غرداية", "متليلي", "القرارة", "العطف", "بني يزقن", "ضاية بن ضحوة", "زلفانة"],
  "48": ["غليزان", "وادي ارهيو", "مازونة", "عمي موسى", "المطمر", "يلل", "جديوية", "حمادنة"],
  // New Wilayas Details
  "49": ["المغير", "جامعة", "أم الطيور", "تندلة"],
  "50": ["المنيعة", "حاسي القارة", "حاسي الفحل"],
  "51": ["أولاد جلال", "الدوسن", "سيدي خالد", "البسباس", "الشعيبة"],
  "52": ["برج باجي مختار", "تيمياوين"],
  "53": ["بني عباس", "كرزاز", "الوائطة", "القصابي", "إقلي"],
  "54": ["تيميمون", "أوقروت", "شروين", "المطارفة", "طلمين"],
  "55": ["تقرت", "حاسي مسعود", "الرويسات", "نزلة", "تبسبست", "المنقر"],
  "56": ["جانت", "برج الحواس"],
  "57": ["إن صالح", "إن غار", "فقارة الزوى"],
  "58": ["إن قزام", "تين زواتين"]
};

// Validates Algerian phone number
// Output: isValid (boolean), message, operator, cleansed
export interface PhoneValidationResult {
  isValid: boolean;
  cleansed: string;
  operator: "Mobilis" | "Ooredoo" | "Djezzy" | "Landline" | "Unknown" | "Burner (Suspicious)";
  message: string;
}

export function validateAlgerianPhone(phone: string): PhoneValidationResult {
  if (!phone) {
    return { isValid: false, cleansed: "", operator: "Unknown", message: "الرقم غير متوفر أو فارغ" };
  }

  // Standardize digits and strip spacing/symbols
  let cleansed = phone.replace(/\s+/g, '').replace(/[\(\)\-\+]/g, '');

  if (cleansed.startsWith('213')) {
    cleansed = '0' + cleansed.substring(3);
  } else if (cleansed.startsWith('00213')) {
    cleansed = '0' + cleansed.substring(5);
  }

  // Check if string lacks 0 prefix but is 9 chars starting with 5, 6, 7
  if (/^(5|6|7)[0-9]{8}$/.test(cleansed)) {
    cleansed = '0' + cleansed;
  }

  // Validate duplicate plastic digits pattern (e.g., repeating same numbers 7 times or more)
  const digitsOnly = cleansed.replace(/\D/g, '');
  const counts: Record<string, number> = {};
  for (const char of digitsOnly) {
    counts[char] = (counts[char] || 0) + 1;
  }
  const maxRepetitions = Math.max(...Object.values(counts));
  if (digitsOnly.length >= 9 && maxRepetitions >= 8) {
    return {
      isValid: false,
      cleansed,
      operator: "Burner (Suspicious)",
      message: "رقم وهمي بلاستيكي (تكرار رقم واحد ثمان مرات أو أكثر)"
    };
  }

  // Operator checks
  let operator: PhoneValidationResult["operator"] = "Unknown";
  let isValid = false;
  let message = "صيغة غير صحيحة لرقم جزائري";

  const isMobilis = /^06[0-9]{8}$/.test(cleansed);
  const isOoredoo = /^05[0-9]{8}$/.test(cleansed);
  const isDjezzy = /^07[0-9]{8}$/.test(cleansed);
  const isLandline = /^02[0-9]{7,8}$/.test(cleansed);

  if (isMobilis) {
    operator = "Mobilis";
    isValid = true;
    message = "رقم هاتف صالح (موبيليس)";
  } else if (isOoredoo) {
    operator = "Ooredoo";
    isValid = true;
    message = "رقم هاتف صالح (أوريدو)";
  } else if (isDjezzy) {
    operator = "Djezzy";
    isValid = true;
    message = "رقم هاتف صالح (جازي)";
  } else if (isLandline) {
    operator = "Landline";
    isValid = true;
    message = "رقم خط أرضي جزائري صالح";
  }

  return { isValid, cleansed, operator, message };
}

// Helper to look up communes for a wilaya code
export function getCommunesByWilayaCode(code: string): string[] {
  return COMMUNE_SAMPLES[code] || ["البلدية الرئيسية", "بلدية أخرى"];
}

export function getWilayaByCode(code: string): Wilaya | undefined {
  const normCode = String(code).padStart(2, '0');
  return ALGERIA_WILAYAS.find(w => w.code === normCode);
}

export function getWilayaByName(name: string): Wilaya | undefined {
  if (!name) return undefined;
  const clean = name.toLowerCase().replace(/[-']/g, ' ').trim();
  return ALGERIA_WILAYAS.find(w => {
    const wAr = w.nameAr.toLowerCase();
    const wFr = w.nameFr.toLowerCase();
    return clean.includes(wAr) || clean.includes(wFr) || wAr.includes(clean) || wFr.includes(clean);
  });
}
