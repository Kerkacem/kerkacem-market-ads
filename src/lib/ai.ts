import { GoogleGenAI, Type, Schema } from '@google/genai';
import { 
  Phase0_CouncilResult,
  Phase05_AudienceBuilder,
  Phase1_Intelligence, 
  Phase2_StaticBriefs, 
  Phase3_LandingPage, 
  Phase4_VideoWorkflow,
  Phase5_MetaAdsStrategy,
  Phase6_ScalingSystem,
  Phase7_AdGenerator
} from '../types';
import { BILLIONAIRE_MINDSET_PROTOCOL } from './mindset';

export function rotateKeys(): boolean {
  if (typeof window === 'undefined') return false;
  const keysStr = localStorage.getItem('nextify_api_keys');
  if (keysStr) {
    try {
      const keys: string[] = JSON.parse(keysStr);
      if (Array.isArray(keys) && keys.length > 1) {
        const rotated = [...keys.slice(1), keys[0]];
        localStorage.setItem('nextify_api_keys', JSON.stringify(rotated));
        console.warn("MARKETING MASTER Engine: Automatically rotated to next API Key due to error/limit.");
        return true;
      }
    } catch (e) {
      console.error("Error rotating keys:", e);
    }
  }
  return false;
}

export function getAiClient() {
  const keysStr = localStorage.getItem('nextify_api_keys');
  let apiKey: string | undefined;
  if (keysStr) {
    try {
      const parsed = JSON.parse(keysStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        apiKey = parsed[0];
      }
    } catch (e) {
      console.error("Error parsing nextify_api_keys:", e);
    }
  }
  if (!apiKey) {
    apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;
  }
  if (!apiKey) {
    throw new Error("يرجى إدخال مفتاح API واحد على الأقل لـ Gemini في 'إعدادات النظام' المتاحة في القائمة الجانبية لتنشيط الذكاء الاصطناعي.");
  }
  return new GoogleGenAI({ apiKey });
}

export let currentModel = 'gemini-3.5-flash';
export function setModel(newModel: string) { currentModel = newModel; }

// Retry mechanism with exponential backoff and API Key auto-rotation
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errMsg = String(error?.message || error || '').toLowerCase();
    const isApiKeyError = 
      error?.code === 429 || error?.status === 429 ||
      error?.code === 400 || error?.status === 400 ||
      error?.code === 403 || error?.status === 403 ||
      errMsg.includes('api key') || errMsg.includes('quota') || errMsg.includes('limit') || errMsg.includes('key');

    if (isApiKeyError && rotateKeys()) {
      // Small pause before retrying with the new key
      await new Promise(resolve => setTimeout(resolve, 500));
      return withRetry(fn, retries, delay);
    }

    if (retries > 0 && (error?.code === 429 || error?.status === 429)) {
      console.warn(`Quota exceeded, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Enforce Western Numerals: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
function sanitizeOutput(text: string): string {
  if (!text) return text;
  // Convert Eastern Arabic numerals to Western Arabic numerals
  return text.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
}


// محلل صور متقدم لتحليل الصور من كل النواحي
async function analyzeImages(images: string[]): Promise<string> {
  const parts: any[] = [{ text: `أنت الآن 'محلل الصور التسويقي الذكي'. قم بإجراء تدقيق استخباراتي وتحليلي بصري عميق للصور الـ 5 المرفوعة للمنتج من منظور تسويقي متكامل للسوق الجزائري (COD).
حلل بدقة ما يلي:
1. المظهر والمادة والتصميم الفيزيائي للمنتج وعلامته التجارية (Branding).
2. التغليف (Packaging) والألوان الجاذبة السائدة وهوية المنتج البصرية في الجزائر.
3. زوايا الاستخدام العملي وجمهورها الأكثر تأثراً (النساء، الحرفيون، العائلات...).
4. نقاط الموثوقية والثقة الظاهرة في الصور، والأخطاء التي يجب تفادي عرضها.
5. استخلص الكلمات والجمل الجاذبة الفجائية التي يمكن كتابتها مباشرة على الإعلانات بناءً على تفاصيل المنتج الفيزيائية.
استخرج كل التفاصيل الممكنة بدقة لندمجها في شلال المراحل والتصميم الإعلاني لاحقاً.` }];

  images.forEach(img => {
      const match = img.match(/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
  });

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: parts,
  }));
  return response.text || "فشل تحليل الصور.";
}

// Consolidated Hardened Protocol

const SYSTEM_PROMPT = `[الهوية]
أنت نظام استخباراتي متقدم لاكتشاف المنتجات الرابحة في التجارة الإلكترونية قبل انتشارها في السوق الجزائري (DZ Market)، بخبرة 20 سنة.

[تدقيق المنتج وتوليد الأصول البصرية - قواعد صارمة]
1. الهوية اللغوية المطلقة: استخدم اللغة العربية الفصحى الاحترافية حصراً في جميع المخرجات (التحليل، الزوايا، البروبمنتات، الأفكار، والأوامر). يمنع منعاً باتاً استخدام اللغة الإنجليزية أو الفرنسية في أي نص أو حلقة تفكير.
2. التصميم البصري والإعلاني: يجب أن تكون جميع النصوص الظاهرة في التصاميم (صور أو فيديوهات) باللغة العربية الفصحى حصراً. الأرقام يجب أن تُكتب حصراً بالصيغة اللاتينية/الفرنسية (0, 1, 2, 3, 4, 5, 6, 7, 8, 9). يمنع منعاً باتاً استخدام الأرقام المشرقية (٠، ١، ٢، ٣، ٤) أو أي كلمات إنجليزية أو فرنسية في التصاميم. هذا شرط إلزامي لا يقبل التجزئة.
3. التطابق البصري الحرفي (100% PRODUCT IMAGE FIDELITY): في أي برومبت لتوليد صورة أو فيديو، يجب إضافة هذا النص الإلزامي للمصمم/الذكاء الاصطناعي: "[STRICT DESIGN REQUIREMENT: ALL visible text/numbers MUST be in Classical Arabic exclusively. English/French text strictly FORBIDDEN. Numbers MUST be written using Western/French Arabic numerals (0, 1, 2, 3...) ONLY. Eastern Arabic numerals (٠, ١, ٢...) are strictly FORBIDDEN. ZERO deviation from the original product shape and packaging - Exact Original Product Image Only.]"
4. الألوان: صيغة HEX فقط (مثال: #FF0000).
5. بروتوكول التفكير: طبق عقليات الـ 9 Billionaires المذكورة في (Billionaire Mindset Protocol) في كل مرحلة تحليل وتخطيط.
7. هندسة صفحة الهبوط والإعلانات القاتلة (Landing Page & Ads Mastery):
   - الهيكلة النفسية للصفحة إجبارياً: الواجهة العلوية (Hero) -> تضخيم الألم (Pain Point مع صور قبل/بعد) -> الحل المخصص (Use Cases مثل عمال التوصيل، النساء، إلخ) -> هندسة القيمة والميزات -> الدليل الاجتماعي (مراجعات محلية بالدارجة) -> العرض الخاص والعداد التنازلي -> شارات الثقة ونموذج الطلب.
   - توحيد لون أزرار الشراء (CTAs) في كامل الصفحة.
   - استخدام الدارجة الجزائرية بعمق في التقييمات ورسائل الألم (مثل "يا خويا هبال"، "تهبطلك السروال"، "كرهت من...").
   - تجربة المستخدم (UX) وقواعد التصميم: يمنع منعاً باتاً تكرار نفس العناوين. يمنع وضع أزرار وهمية مثل "قراءة التقييمات" (التقييمات توضع مقرؤة مباشرة). يجب دمج نموذج الطلب السريع.

[ملاحظة تقنية حول هيكل البيانات المرجعة - JSON]
حتى وإن كان اسم الحقل في هيكل البيانات البرمجي باللغة الإنجليزية (مثل imagePromptEN أو description)، يجب أن تكون القيمة (Value) التي ترجعها داخل هذا الحقل باللغة العربية حصراً وبشكل إجباري للجميع عدا أكواد الألوان (HEX).

[هيكل التقييم للمنتجات]
قيم المنتج من 100. (90-100 Unicorn, 80-89 Strong, 70-79 Test, 60-69 Risky, Less Reject)

${BILLIONAIRE_MINDSET_PROTOCOL}`;

export async function runPhase0(
  productInput: string,
  sellingPrice?: string,
  productImages?: string[]
): Promise<Phase0_CouncilResult> {
  // استخدام محلل الصور في المرحلة الأولى
  const imageAnalysis = productImages && productImages.length > 0 
    ? await analyzeImages(productImages)
    : "لم يتم توفير صور.";

  const imagesContext = productImages && productImages.length > 0 ? `Images Analysis: ${imageAnalysis}` : "";
  const priceContext = sellingPrice ? `Selling Price: ${sellingPrice} DZD.` : "";
  
  const framedQuestion = `
Product Idea: ${productInput}
${priceContext}
${imagesContext}

Analyze this product idea for the Algerian COD (Cash on Delivery) market. Is this a winning product? What are the fatal flaws, massive upsides, and actionable next steps?
  `.trim();

  const advisors = [
    {
      id: "contrarian",
      name: "The Contrarian (المعارض)",
      style: "Actively looks for what's wrong, what's missing, what will fail. Assumes the idea has a fatal flaw and tries to find it. Not a pessimist, but saves people from bad deals."
    },
    {
      id: "firstPrinciples",
      name: "The First Principles Thinker (المفكر من المبادئ الأولى)",
      style: "Ignores the surface-level question and asks 'what are we actually trying to solve here?' Strips away assumptions. Rebuilds the problem from the ground up."
    },
    {
      id: "expansionist",
      name: "The Expansionist (التوسعي)",
      style: "Looks for upside everyone else is missing. What could be bigger? What adjacent opportunity is hiding? What's being undervalued? Cares about what happens if this works even better than expected."
    },
    {
      id: "outsider",
      name: "The Outsider (الشخص الخارجي)",
      style: "Has zero context about the field. Responds purely to what's in front of them. Catches the curse of knowledge: things that are obvious to an expert but confusing to everyone else."
    },
    {
      id: "executor",
      name: "The Executor (المنفذ)",
      style: "Only cares about one thing: can this actually be done, and what's the fastest path to doing it? Ignores theory, strategy. Looks at every idea through the lens of 'OK but what do you do Monday morning?'"
    }
  ];

  const getAdvisorPrompt = (advisor: any) => `
You are ${advisor.name} on an LLM Council.
Your thinking style: ${advisor.style}

A user has brought this question to the council:
---
${framedQuestion}
---

Respond from your perspective in Arabic. Be direct and specific. Don't hedge or try to be balanced. Lean fully into your assigned angle. The other advisors will cover the angles you're not covering. Focus on the Algerian COD market context (e.g. delivery logistics, audience trust, ad costs).
Keep your response between 150-300 words. No preamble. Go straight into your analysis.
  `;

  // 1. Generate 5 advisor responses in parallel
  const advisorPromises = advisors.map(adv => 
    withRetry(async () => {
      const response = await getAiClient().models.generateContent({
        model: currentModel,
        contents: getAdvisorPrompt(adv),
      });
      return { id: adv.id, text: response.text || '' };
    })
  );

  const advisorResults = await Promise.all(advisorPromises);
  
  // Randomize for peer review
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const randomizedAdvisors = [...advisorResults].sort(() => Math.random() - 0.5).map((r, i) => ({ ...r, letter: letters[i] }));

  const anonymizedResponsesText = randomizedAdvisors.map(r => `**Response ${r.letter}:**\n${r.text}`).join('\n\n');

  // 2. Generate 5 peer reviews in parallel
  const getReviewerPrompt = () => `
You are reviewing the outputs of an LLM Council. Five advisors independently answered this question:
---
${framedQuestion}
---

Here are their anonymized responses in Arabic:
${anonymizedResponsesText}

Answer these three questions in Arabic. Be specific. Reference responses by letter.
1. Which response is the strongest? Why?
2. Which response has the biggest blind spot? What is it missing?
3. What did ALL five responses miss that the council should consider?

Keep your review under 200 words. Be direct.
  `;

  const reviewPromises = advisors.map(() => 
    withRetry(async () => {
      const response = await getAiClient().models.generateContent({
        model: currentModel,
        contents: getReviewerPrompt(),
      });
      return response.text || '';
    })
  );

  const peerReviews = await Promise.all(reviewPromises);
  const peerReviewsText = peerReviews.map((r, i) => `**Reviewer ${i+1}:**\n${r}`).join('\n\n');

  const deAnonymizedResponsesText = advisorResults.map(r => `**${advisors.find(a => a.id === r.id)?.name}:**\n${r.text}`).join('\n\n');

  // 3. Chairman Synthesis
  const chairmanPrompt = `
You are the Chairman of an LLM Council. Your job is to synthesize the work of 5 advisors and their peer reviews into a final verdict in Arabic.

The question brought to the council:
---
${framedQuestion}
---

ADVISOR RESPONSES:
${deAnonymizedResponsesText}

PEER REVIEWS:
${peerReviewsText}

Produce the final council verdict in Arabic. You must return ONLY valid JSON matching exactly the structure defined below. Do not include markdown formatting or backticks around the JSON. Your output will be parsed by JSON.parse().
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      agreements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Where the council agrees. Points multiple advisors converged on independently. High-confidence signals." },
      clashes: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            issue: { type: Type.STRING },
            sides: { type: Type.STRING },
            explanation: { type: Type.STRING }
          }
        }, 
        description: "Genuine disagreements. Present both sides and explain why reasonable advisors disagree." 
      },
      blindSpots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Things that only emerged through peer review. Things individual advisors missed that others flagged." },
      recommendation: { type: Type.STRING, description: "A clear, actionable recommendation in Arabic. Not 'it depends.' A real answer." },
      oneThingToDoFirst: { type: Type.STRING, description: "A single concrete next step in Arabic. Not a list." }
    },
    required: ["agreements", "clashes", "blindSpots", "recommendation", "oneThingToDoFirst"]
  };

  const finalResponse = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: chairmanPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.7
    }
  }));

  const verdict = JSON.parse(finalResponse.text || "{}");

  const mappedResponses = advisorResults.reduce((acc, curr) => {
    (acc as any)[curr.id] = curr.text;
    return acc;
  }, {} as Phase0_CouncilResult['advisorResponses']);

  return {
    question: framedQuestion,
    verdict: {
      agreements: verdict.agreements || [],
      clashes: verdict.clashes || [],
      blindSpots: verdict.blindSpots || [],
      recommendation: verdict.recommendation || '',
      oneThingToDoFirst: verdict.oneThingToDoFirst || ''
    },
    advisorResponses: mappedResponses
  };
}

export async function runPhase05(questionContext: string, phase0Data?: Phase0_CouncilResult): Promise<Phase05_AudienceBuilder> {
  let councilContext = "";
  if (phase0Data) {
    councilContext = `
[مخرجات مجلس تفجير التقييم والـ LLM Council من المرحلة 0]:
- التوصية النهائية للمجلس: ${phase0Data.verdict.recommendation}
- الخطوة العاجلة المفتاحية الأولى: ${phase0Data.verdict.oneThingToDoFirst}
- توافقات المستشارين الأساسية: ${phase0Data.verdict.agreements.join(" | ")}
- نقاط الخلاف في المجلس: ${phase0Data.verdict.clashes.map(c => `${c.issue}: ${c.explanation}`).join(" | ")}
- الزوايا العمياء التي نبه إليها المراجعون: ${phase0Data.verdict.blindSpots.join(" | ")}
`;
  }

  const prompt = `
أنت خبير في الاستهداف وبناء الجماهير وتحليل فئات المشترين عبر Meta Ads للسوق الجزائري (Facebook/Instagram/TikTok) مع خبرة عميقة في الـ COD Cash on Delivery.
من خلال الوصف التالي للمنتج: "${questionContext}"
${councilContext}

المهمة: قم ببناء خطة استهداف الجماهير (Audience Builder) شاملة ومخصصة لمطابقة التوصيات السابقة لمجلس التقييم لتنطلق منها فيسبوك بذكاء.

Return ONLY a valid JSON object matching this schema exactly.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      productContext: { type: Type.STRING },
      summary: { type: Type.STRING, description: "ملخص استراتيجية الجمهور - Architecture d'audience recommandée" },
      testPhase: {
        type: Type.OBJECT,
        properties: {
          priorityAudiences: { type: Type.ARRAY, items: { type: Type.STRING } },
          budgetAdvice: { type: Type.STRING }
        }
      },
      audiences: {
        type: Type.OBJECT,
        properties: {
          lookalike: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, details: { type: Type.STRING } }
            }
          },
          interests: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                groupName: { type: Type.STRING },
                interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING }
              }
            }
          },
          remarketing: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, details: { type: Type.STRING } }
            }
          },
          broad: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, details: { type: Type.STRING } }
            }
          },
          custom: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, details: { type: Type.STRING } }
            }
          }
        }
      },
      exclusionRules: { type: Type.ARRAY, items: { type: Type.STRING } },
      instructions: { type: Type.STRING }
    },
    required: ["productContext", "summary", "testPhase", "audiences", "exclusionRules", "instructions"]
  };

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.7
    }
  }));

  return JSON.parse(response.text || "{}");
}

export async function runPhase1(
  productInput: string,
  sellingPrice?: string,
  productImages?: string[],
  phase0Data?: Phase0_CouncilResult,
  phase05Data?: Phase05_AudienceBuilder
): Promise<Phase1_Intelligence> {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING },
      category: { type: Type.STRING },
      brand: { type: Type.STRING },
      usp: { type: Type.STRING },
      targetAudienceDZ: { type: Type.STRING },
      suggestedPriceDZD: { type: Type.STRING },
      objections: { type: Type.STRING },
      colorPalette: {
        type: Type.OBJECT,
        properties: {
          primary: { type: Type.STRING, description: "HEX color code ONLY (e.g., #000000)." },
          secondary: { type: Type.STRING, description: "HEX color code ONLY (e.g., #111111)." },
          accent: { type: Type.STRING, description: "HEX color code ONLY (e.g., #222222)." },
          background: { type: Type.STRING, description: "HEX color code ONLY (e.g., #FFFFFF)." }
        },
        required: ["primary", "secondary", "accent", "background"]
      },
      psychologicalAngles: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            hookExample: { type: Type.STRING }
          },
          required: ["name", "description", "hookExample"]
        }
      },
      score: { type: Type.NUMBER },
      classification: { type: Type.STRING },
      marketSaturation: { type: Type.STRING },
      untappedAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
      competitorAnalysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.STRING },
            message: { type: Type.STRING },
            strengths: { type: Type.STRING },
            weaknesses: { type: Type.STRING }
          },
          required: ["name", "price", "message", "strengths", "weaknesses"]
        }
      },
      pricingStrategies: {
        type: Type.OBJECT,
        properties: {
          low: { type: Type.STRING },
          balanced: { type: Type.STRING },
          premium: { type: Type.STRING }
        },
        required: ["low", "balanced", "premium"]
      },
      profitabilityEstimates: {
        type: Type.OBJECT,
        properties: {
          productCost: { type: Type.STRING },
          shipping: { type: Type.STRING },
          adCost: { type: Type.STRING },
          codFee: { type: Type.STRING },
          returnRate: { type: Type.STRING },
          targetCPA: { type: Type.STRING }
        },
        required: ["productCost", "shipping", "adCost", "codFee", "returnRate", "targetCPA"]
      },
      buyerPersona: {
        type: Type.OBJECT,
        properties: {
          age: { type: Type.STRING },
          gender: { type: Type.STRING },
          income: { type: Type.STRING },
          interests: { type: Type.ARRAY, items: { type: Type.STRING } },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          behavior: { type: Type.STRING }
        },
        required: ["age", "gender", "income", "interests", "painPoints", "behavior"]
      },
      customerJourney: {
        type: Type.OBJECT,
        properties: {
          awareness: { type: Type.STRING },
          interest: { type: Type.STRING },
          desire: { type: Type.STRING },
          purchase: { type: Type.STRING },
          loyalty: { type: Type.STRING }
        },
        required: ["awareness", "interest", "desire", "purchase", "loyalty"]
      },
      salesPsychology: { type: Type.ARRAY, items: { type: Type.STRING } },
      adScripts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            problem: { type: Type.STRING },
            solution: { type: Type.STRING },
            cta: { type: Type.STRING }
          },
          required: ["hook", "problem", "solution", "cta"]
        }
      },
      adStrategy: {
        type: Type.OBJECT,
        properties: {
          targeting: { type: Type.STRING },
          testing: { type: Type.STRING },
          scaling: { type: Type.STRING },
          retargeting: { type: Type.STRING }
        },
        required: ["targeting", "testing", "scaling", "retargeting"]
      },
      contentPlan30Days: { type: Type.ARRAY, items: { type: Type.STRING } },
      seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      finalReport: { type: Type.STRING },
      assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
      selfReview: { type: Type.STRING },
      customerReviews: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            author: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            comment: { type: Type.STRING }
          },
          required: ["author", "rating", "comment"]
        }
      },
      bsaCompetitiveExtractor: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          recurringAngles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                problem: { type: Type.STRING },
                copy: { type: Type.STRING },
                whyItWorks: { type: Type.STRING }
              },
              required: ["problem", "copy", "whyItWorks"]
            }
          },
          winningPatterns: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                patternName: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["patternName", "description"]
            }
          },
          workingCopyHooks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          missingAngles: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          bsaRecommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["overview", "recurringAngles", "winningPatterns", "workingCopyHooks", "missingAngles", "bsaRecommendations"]
      },
      seoBlueprint: {
        type: Type.OBJECT,
        properties: {
          technicalChecklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          onPageRules: {
            type: Type.OBJECT,
            properties: {
              titleFormula: { type: Type.STRING },
              descriptionFormula: { type: Type.STRING },
              headingStructure: { type: Type.STRING },
              keywordMapping: { type: Type.STRING },
              internalLinking: { type: Type.STRING }
            },
            required: ["titleFormula", "descriptionFormula", "headingStructure", "keywordMapping", "internalLinking"]
          },
          jsonLdSchema: { type: Type.STRING },
          auditOutput: { type: Type.STRING }
        },
        required: ["technicalChecklist", "onPageRules", "jsonLdSchema", "auditOutput"]
      }
    },
    required: ["productName", "category", "brand", "usp", "targetAudienceDZ", "suggestedPriceDZD", "objections", "colorPalette", "psychologicalAngles", "score", "classification", "marketSaturation", "untappedAngles", "competitorAnalysis", "pricingStrategies", "profitabilityEstimates", "buyerPersona", "customerJourney", "salesPsychology", "adScripts", "adStrategy", "contentPlan30Days", "seoKeywords", "finalReport", "assumptions", "selfReview", "customerReviews", "bsaCompetitiveExtractor", "seoBlueprint"]
  };

  const DEEP_ANALYSIS_PROTOCOL = `
[بروتوكول التحليل العميق - إجباري]
قبل استخراج أي معلومة، قم بتنفيذ الخطوات التالية وجوباً:
1. البحث العميق: ابحث وحلل المنافسين في السوق عبر تبني منهجية "Competitive Ads Extractor - BSA Edition" (كتحليل لـ Facebook Ad Library, TikTok Creative Center, PPSpy, Adheart). ركز على الجزائر وإسبانيا والبرتغال.
2. تحليل الزوايا المستهلكة: استخرج وحلل الرسائل الإعلانية الحالية (Ads Messaging, Formats, CTAs) وميز بين ما يعمل وما لا يعمل.
3. استخراج "الزوايا غير المستغلة" (Untapped Angles): استخرج 5 زوايا إعلانية على الأقل لم يسبق للمنافسين العمل عليها، لتكون الركيزة الحصرية.
4. املأ بيانات جزء "bsaCompetitiveExtractor" بعناية لاستخلاص الأنماط الحالية للصور/الفيديوهات والنصوص.
5. ادعم التحليل بمنهجية "SEO Blueprint" واطرح نصائح دقيقة تتعلق بـ Crawlability و Indexability والعناوين (Title/Meta) و Structured Data.


المنهجية:
Think-1 تحليل خصائص المنتج الفيزيائية والوظيفية.
Think-2 البحث العميق للمنافسين وتحليل رسائلهم (تجنبها!).
Think-3 استخراج الزوايا (Untapped Angles) الفريدة والغنية.
Think-4 حجم الطلب الحقيقي في السوق المستهدف.
Think-5 تحليل المخاطر والربحية الحقيقية.
Think-6 التقييم النهائي (Score) والتصنيف.

يجب أن تعبئ كافة الحقول البالغ عددها أكثر من 20 حقلاً في هيكل JSON بأقصى قدر من الدقة، مع التركيز المكثف على أن تكون حقول الـ Untapped Angles غنية بالأفكار العملية.`;

  let extraContext = "";
  if (phase0Data) {
    extraContext += `\n[توصية مجلس التقييم - Phase 0]:\n- الخلاصة والتوصية: ${phase0Data.verdict.recommendation}\n- أقوى خطوة أولى: ${phase0Data.verdict.oneThingToDoFirst}\n`;
  }
  if (phase05Data) {
    extraContext += `\n[مخرجات بناء الجمهور - Phase 0.5]:\n- ملخص الجماهير المقترحة: ${phase05Data.summary}\n- الجماهير ذات الأولوية: ${phase05Data.testPhase.priorityAudiences.join(", ")}\n- موانع الاستبعاد: ${phase05Data.exclusionRules.join(", ")}\n`;
  }

  const inputPrompt = `تشغيل التقرير الكامل استخبارات المنتج (Product Intelligence Report):
المنتج: ${productInput}
${sellingPrice ? `السعر: ${sellingPrice}` : ''}
${extraContext}`;

  const parts: any[] = [{ text: `${SYSTEM_PROMPT}\n\n${DEEP_ANALYSIS_PROTOCOL}\n\n${inputPrompt}` }];

  if (productImages && productImages.length > 0) {
    productImages.forEach(img => {
      const match = img.match(/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    });
  }

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: parts,
    config: { 
      responseMimeType: 'application/json', 
      responseSchema: schema, 
      temperature: 0.2
    }
  }));

  return JSON.parse(sanitizeOutput(response.text!)) as Phase1_Intelligence;
}

export async function runPhase2(phase1Data: Phase1_Intelligence, phase05Data?: Phase05_AudienceBuilder): Promise<Phase2_StaticBriefs> {
  const schema: Schema = { 
    type: Type.OBJECT, 
    properties: {
      masterPhotographyPrompt: { type: Type.STRING },
      briefs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            conceptName: { type: Type.STRING },
            psychoAngle: { type: Type.STRING },
            objective: { type: Type.STRING },
            dimensions: { type: Type.STRING },
            imagePromptEN: { type: Type.STRING },
            negativePrompt: { type: Type.STRING },
            textLayout: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subHeadline: { type: Type.STRING },
                ctaButton: { type: Type.STRING }
              },
              required: ["headline", "subHeadline", "ctaButton"]
            },
            adCopyFusha: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                cta: { type: Type.STRING }
              },
              required: ["hook", "body", "cta"]
            }
          },
          required: ["conceptName", "psychoAngle", "objective", "dimensions", "imagePromptEN", "negativePrompt", "textLayout", "adCopyFusha"]
        }
      },
      socialMediaPlan: {
        type: Type.OBJECT,
        properties: {
          objectives: { type: Type.STRING },
          audienceAnalysis: { type: Type.STRING },
          strategyDevelopment: { type: Type.STRING },
          contentCreation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                format: { type: Type.STRING },
                hook: { type: Type.STRING },
                valueProposition: { type: Type.STRING }
              },
              required: ["format", "hook", "valueProposition"]
            }
          },
          campaignSetup: { type: Type.STRING },
          performanceTracking: { type: Type.STRING },
          mistakesToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["objectives", "audienceAnalysis", "strategyDevelopment", "contentCreation", "campaignSetup", "performanceTracking", "mistakesToAvoid"]
      }
    }, 
    required: ["masterPhotographyPrompt", "briefs", "socialMediaPlan"] 
  };
  
  const instructions = `
المهمة: توليد 5 بروبمنتات إعلانية ثابتة وفق القواعد الصارمة، بالإضافة إلى بناء خطة إعلانية شاملة للتواصل الاجتماعي (Social Media Advertising).

[أوامر إضافية صارمة جداً للبرومبتات]:
1. يجب التركيز وجوباً وحصراً على أحد الـ Untapped Angles التالية الموجودة في التحليل: ${JSON.stringify(phase1Data.untappedAngles)}. يمنع منعاً باتاً إضافة أي زاوية إعلانية خارج هذه القائمة.
2. أمر التطابق البصري الحرفي (100% IMAGE IDENITY): أضف في كل \`imagePromptEN\` النص الإلزامي التالي: "[STRICT DESIGN REQUIREMENT: ALL visible text/numbers MUST be in Classical Arabic exclusively. English/French text strictly FORBIDDEN. Numbers MUST be written using Western/French Arabic numerals (0, 1, 2, 3...) ONLY. Eastern Arabic numerals (٠, ١, ٢...) are strictly FORBIDDEN. ZERO deviation from the original product shape and packaging - Exact Original Product Image Only.]"
3. بروتوكول التفكير: طبق عقليات الـ 9 Billionaires المذكورة في (Billionaire Mindset Protocol) في كل مرحلة تحليل وتخطيط.

[أوامر إضافية لبناء خطة التواصل الاجتماعي Social Media Advertising]:
تحتوي الخطة (socialMediaPlan) على الخطوات التالية:
1. Define Objectives: بناء أهداف ذكية (SMART Goals).
2. Audience Analysis: تحليل عميق للجمهور.
3. Strategy Development: تحديد المنصات والاستراتيجية العامة للحملات.
4. Content Creation: توليد محتوى (فيديو، صورة، كاروسيل) مبني على قيمة قوية وخطاف ممتاز.
5. Campaign Setup: بنية الحملة وخطوات إطلاقها بوضوح.
6. Performance Tracking: ماهي الـ KPIs التي سنتبعها وكيف نحللها.
7. Mistakes to Avoid (D-Tier): أذكر وتجنب الاخطاء القاتلة مثل شراء المتابعين وعدم توازن المحتوى وتجاهل التعليقات السلبية وغيرها من D-Tier Mistakes.
استخدم لغة استراتيجية عميقة ومناسبة للسوق المحلي والمواصفات السابقة للمنتج.
  `;

  let audienceContext = "";
  if (phase05Data) {
    audienceContext = `\n[توجيه بخصوص الجمهور المستهدف المستخلص من المرحلة 0.5]:\nملخص الجمهور: ${phase05Data.summary}\nالجماهير ذات الأولوية: ${phase05Data.testPhase.priorityAudiences.join(", ")}\nاجعل أفكار ونبرة الإعلانات الصورية الخمسة تتطابق بامتياز وتخاطب هذا الجمهور مباشرة.\n`;
  }

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: [{ text: `${SYSTEM_PROMPT}\n\n${instructions}\n\n${audienceContext}\n\n[بيانات المنتج]\n${JSON.stringify(phase1Data)}` }],
    config: { responseMimeType: 'application/json', responseSchema: schema }
  }));
  return JSON.parse(sanitizeOutput(response.text!)) as Phase2_StaticBriefs;
}

export async function runPhase3(phase1Data: Phase1_Intelligence, phase2Data?: Phase2_StaticBriefs): Promise<Phase3_LandingPage> {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      product_name: { type: Type.STRING },
      page_type: { type: Type.STRING },
      marketing_angle: { type: Type.STRING },
      conversion_framework: { type: Type.STRING },
      color_scheme: {
        type: Type.OBJECT,
        properties: {
          primary: { type: Type.STRING },
          secondary: { type: Type.STRING },
          accent: { type: Type.STRING },
          background: { type: Type.STRING }
        },
        required: ["primary", "secondary", "accent", "background"]
      },
      tone: { type: Type.STRING },
      target_market: { type: Type.STRING },
      estimated_sections_impact: { type: Type.STRING },
      general_notes: { type: Type.STRING },
      seo: {
        type: Type.OBJECT,
        properties: {
          meta_title: { type: Type.STRING },
          meta_description: { type: Type.STRING }
        },
        required: ["meta_title", "meta_description"]
      },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            order: { type: Type.INTEGER },
            section_type: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            content: { type: Type.STRING },
            image_prompt: { type: Type.STRING },
            text_overlay: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subtext: { type: Type.STRING },
                position: { type: Type.STRING }
              },
              required: ["headline", "subtext", "position"]
            },
            color_transition: { type: Type.STRING },
            cta_text: { type: Type.STRING }
          },
          required: ["order", "section_type", "title", "subtitle", "content", "image_prompt", "text_overlay", "color_transition", "cta_text"]
        }
      }
    },
    required: ["product_name", "page_type", "marketing_angle", "conversion_framework", "color_scheme", "tone", "target_market", "sections", "estimated_sections_impact", "seo", "general_notes"]
  };

  const lpInstructions = `
Tu es un expert media buyer + copywriter + directeur artistique. Ta mission : produire un brief landing page ULTRA-COMPLET (Landing Page Classic + Claude MARKETING MASTER LP Gold Standard v2) au format JSON structuré.

Règles de workflow :
1. Comprendre le produit (utilise le contexte fourni).
2. Choisir l'angle et le framework (AIDA ou PAS).
3. Générer EXACTEMENT entre 8 et 12 sections !
4. Utiliser la palette de couleurs extraite et l'utiliser dans la section text_overlay et pour la transition (color_transition).
5. Pour "image_prompt", générer le format "POSTER PROMPT" (Gold Standard v2) avec le bloc [MARKETING CONTEXT] obligatoire.

Format du "image_prompt" OBLIGATOIRE (en anglais pour la création d'image) :
Based on this product image, create a poster with the following requirements:
[Paragraphe narratif de la scène 250-400 mots...]
[MARKETING CONTEXT]
- USP: ...
- Pain Point: ...
- Bénéfice clé: ...
- Émotion cible: ...
- Audience: ...
- Message de conversion: ...
[/MARKETING CONTEXT]
## Text Layout Requirements:
1. Text Element: ...

Assure-toi que "color_transition" indique en HEX les couleurs de liaison entre chaque section (ex: "#FFFFFF to #E0E0E0").
Ajoute OBLIGATOIREMENT dans le prompt de l'image (Text Layout Requirements) : "[STRICT DESIGN REQUIREMENT: ALL visible text/numbers MUST be in Classical Arabic exclusively. English/French text strictly FORBIDDEN. Numbers MUST be written using Western/French Arabic numerals (0, 1, 2, 3...) ONLY. Eastern Arabic numerals (٠, ١, ٢...) are strictly FORBIDDEN. ZERO deviation from the original product shape and packaging - Exact Original Product Image Only.]"
  `;

  let briefsContext = "";
  if (phase2Data) {
    briefsContext = `
[معلومات الـ 5 MARKETING MASTER Static Briefs المصممة في المرحلة 2]:
استخدم هذه المفاهيم البصرية الـ 5 المجهزة مسبقاً وتفاصيلها لدمجها بانسجام دائم في الأقسام الستة (الـ 6 sections بالتوالي) لصفحة الهبوط لتكون هناك وحدة تصميمية وبصرية كاملة بين الإعلان وصفحة الهبوط:
${phase2Data.briefs.map((b, i) => `المفهوم البصري ${i+1}: ${b.conceptName} (الزاوية: ${b.psychoAngle}) - العنوان الرئيسي للإعلان: "${b.textLayout?.headline}"`).join("\n")}
`;
  }

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: [{ text: `${SYSTEM_PROMPT}\n\nالإرشادات لصفحة الهبوط (Landing Page Brief):\n${lpInstructions}\n\n${briefsContext}\n\nبناءً على معلومات هذا المنتج: \n${JSON.stringify(phase1Data)}` }],
    config: { responseMimeType: 'application/json', responseSchema: schema }
  }));
  return JSON.parse(sanitizeOutput(response.text!)) as Phase3_LandingPage;
}

export async function runPhase4(phase1Data: Phase1_Intelligence, phase3Data?: Phase3_LandingPage): Promise<Phase4_VideoWorkflow> {
  const schema: Schema = { 
    type: Type.OBJECT, 
    properties: {
       characterSheet: {
         type: Type.OBJECT,
         properties: {
           description: { type: Type.STRING },
           promptEN: { type: Type.STRING },
           seed: { type: Type.STRING }
         },
         required: ["description", "promptEN", "seed"]
       },
       scenes: {
         type: Type.ARRAY,
         items: {
           type: Type.OBJECT,
           properties: {
             sceneName: { type: Type.STRING },
             duration: { type: Type.STRING },
             emotion: { type: Type.STRING },
             narrativeRole: { type: Type.STRING },
             visualDesc: { type: Type.STRING },
             narrationFusha: { type: Type.STRING },
             debutPromptEN: { type: Type.STRING },
             finPromptEN: { type: Type.STRING },
             animationPromptEN: { type: Type.STRING }
           },
           required: ["sceneName", "duration", "emotion", "narrativeRole", "visualDesc", "narrationFusha", "debutPromptEN", "finPromptEN", "animationPromptEN"]
         }
       },
       voiceOverScript: {
         type: Type.OBJECT,
         properties: {
           fullText: { type: Type.STRING },
           recordingTips: { type: Type.ARRAY, items: { type: Type.STRING } }
         },
         required: ["fullText", "recordingTips"]
       }
    }, 
    required: ["characterSheet", "scenes", "voiceOverScript"] 
  };
  let lpContext = "";
  if (phase3Data) {
    lpContext = `
[معلومات صفحة الهبوط المصممة في المرحلة 3]:
زاوية التحويل المعتمدة (CRO Angle): ${phase3Data.marketing_angle}
إطار العمل المستخدم (AIDA أو PAS): ${phase3Data.conversion_framework}
نغمة السرد (Tone): ${phase3Data.tone}
ملخص الأقسام الستة: ${phase3Data.sections.map(s => `${s.order}: ${s.title} (${s.section_type})`).join(" -> ")}
يرجى جعل مشاهد الفيديو الإعلاني الخمسة وسيناريو الـ Voice Over بالدارجة الجزائرية يتبنى تماماً نفس أسلوب وسرد صفحة الهبوط لتكون وحدة ربط كاملة بين المشاهد ومحطة الشراء.
`;
  }

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: [{ text: `${SYSTEM_PROMPT}\n\nالمهمة: إنشاء سير عمل فيديو إعلاني احترافي بـ 5 مشاهد.\n\n[أوامر السرد القصصي والتطابق]:\n1. يجب الاعتماد وجوباً وحصراً على الـ Untapped Angles التالية لتصميم السرد القصصي للفيديو: ${JSON.stringify(phase1Data.untappedAngles)}.\n2. التطابق البصري الحرفي (100% PRODUCT IMAGE FIDELITY): يجب إضافة أمر مقيد وصارم في \`debutPromptEN\` و \`finPromptEN\` و \`characterSheet.promptEN\` ينص على استخدام الحفاظ على صورة وشكل المنتج الحقيقي بنسبة 100% بدون أي تعديلات مهما صغرت (Exact Actual Product).\n3. منع اللغة الإنجليزية والأرقام المشرقية في التصميم: أضف الإلزام التالي في نهاية كل برومبت (debutPromptEN, finPromptEN, characterSheet.promptEN): "[STRICT DESIGN REQUIREMENT: ALL visible text/numbers MUST be in Classical Arabic exclusively. English/French text strictly FORBIDDEN. Numbers MUST be written using Western/French Arabic numerals (0, 1, 2, 3...) ONLY. Eastern Arabic numerals (٠, ١, ٢...) are strictly FORBIDDEN. ZERO deviation from the original product shape and packaging - Exact Original Product Image Only.]"\n\n${lpContext}` }],
    config: { responseMimeType: 'application/json', responseSchema: schema }
  }));
  return JSON.parse(sanitizeOutput(response.text!)) as Phase4_VideoWorkflow;
}

export async function runPhase5(
  phase1Data: Phase1_Intelligence,
  phase2Data?: Phase2_StaticBriefs,
  phase4Data?: Phase4_VideoWorkflow
): Promise<Phase5_MetaAdsStrategy> {
  const schema: Schema = { 
    type: Type.OBJECT, 
    properties: {
      campaignStructure: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          advantagePlus: { type: Type.STRING },
          aboTest: { type: Type.STRING }
        },
        required: ["overview", "advantagePlus", "aboTest"]
      },
      anglesTesting: {
        type: Type.OBJECT,
        properties: {
          statutVsConfort: { type: Type.STRING },
          painVsDesire: { type: Type.STRING }
        },
        required: ["statutVsConfort", "painVsDesire"]
      },
      targetingDZ: {
        type: Type.OBJECT,
        properties: {
          broad: { type: Type.STRING },
          narrow: { type: Type.STRING }
        },
        required: ["broad", "narrow"]
      },
      kpis: {
        type: Type.OBJECT,
        properties: {
          ctr: { type: Type.STRING },
          cpc: { type: Type.STRING },
          cvr: { type: Type.STRING }
        },
        required: ["ctr", "cpc", "cvr"]
      },
      bulkLauncher: {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, description: "Mode: SINGLE-ACCOUNT or MULTI-ACCOUNT" },
          budget: { type: Type.STRING, description: "Budget and Currency" },
          path: { type: Type.STRING, description: "PATH: image-only | mixed | video-DCO | video-multi" },
          template: { type: Type.STRING, description: "TEMPLATE: cbo-3-angle | cbo-single-as | cbo-5-as-testing | abo-classic" },
          geo: { type: Type.STRING, description: "GEO settings" },
          structureVisual: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lines of the visual structure (e.g. 'AS1 [ANGLE_1] 60% │ 1 ad DCO')" },
          targetingSummary: { type: Type.STRING, description: "Targeting rules (feed/story, lowest cost, etc)" }
        },
        required: ["mode", "budget", "path", "template", "geo", "structureVisual", "targetingSummary"]
      }
    }, 
    required: ["campaignStructure", "anglesTesting", "targetingDZ", "kpis", "bulkLauncher"] 
  };

  const bulkLauncherInstructions = `
أنت الآن 'Launch Commander Express'. يرجى بناء قسم 'bulkLauncher' الذي يمثل ملخص سريع للإطلاق المجمع المتوازي (Meta Ads Bulk Launcher EXPRESS v1.0).
استخدم هيكلة 'cbo-3-angle' أو ما تراه مناسباً للمنتج، وقم بتطبيق قواعد الإطلاق السريع.
الهدف رفع سرعة الإطلاق المتوازي واستغلال الـ Bulk Endpoints.
  `;

  let adsContext = "";
  if (phase2Data) {
    adsContext += `\n[مفاهيم الصور الإعلانية الثابتة المصممة في المرحلة 2 - لاستخدامها بالبنية]:\n${phase2Data.briefs.map((b, i) => `- المفهوم ${i+1}: ${b.conceptName} (العنوان: ${b.textLayout?.headline})`).join("\n")}\n`;
  }
  if (phase4Data) {
    adsContext += `\n[سيناريو الفيديو الإعلاني المصمم في المرحلة 4 - لدمجه بالبنية]:\n- وصف الفيديو: ${phase4Data.characterSheet.description}\n- مشاهد الفيديو: ${phase4Data.scenes.map(s => s.sceneName).join(" -> ")}\n`;
  }

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: [{ text: `${SYSTEM_PROMPT}\n\nالمهمة: بناء استراتيجية حملة Meta Ads متقدمة واختبار أولي. يجب الاعتماد وجوباً وحصراً على الـ Untapped Angles التالية لاختبارها في إعلاناتك: ${JSON.stringify(phase1Data.untappedAngles)}. يمنع منعاً باتاً أي إضافات خارج هذا السياق.\n\n${bulkLauncherInstructions}\n\n${adsContext}` }],
    config: { responseMimeType: 'application/json', responseSchema: schema }
  }));
  return JSON.parse(sanitizeOutput(response.text!)) as Phase5_MetaAdsStrategy;
}

export async function runPhase6(phase1Data: Phase1_Intelligence): Promise<Phase6_ScalingSystem> {
  const schema: Schema = { 
    type: Type.OBJECT, 
    properties: {
       testingPlan7Days: { type: Type.STRING },
       scalingWinners: { type: Type.STRING },
       creativeIterations: { type: Type.STRING },
       killStrategy: { type: Type.STRING }
    }, 
    required: ["testingPlan7Days", "scalingWinners", "creativeIterations", "killStrategy"] 
  };
  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: [{ text: `${SYSTEM_PROMPT}\n\nالمهمة: بناء نظام توسيع الحملة (Scaling) وادارة ميزانية. يجب الاعتماد وجوباً وحصراً على الـ Untapped Angles التي نجحت في الاختبار: ${JSON.stringify(phase1Data.untappedAngles)}. يمنع منعاً باتاً أي إضافات خارج هذا السياق.` }],
    config: { responseMimeType: 'application/json', responseSchema: schema }
  }));
  return JSON.parse(sanitizeOutput(response.text!)) as Phase6_ScalingSystem;
}

export async function runPhase7_AdGenerator(productName: string, phase1Data?: Phase1_Intelligence): Promise<Phase7_AdGenerator> {
  const schema: Schema = { 
    type: Type.OBJECT, 
    properties: {
       analysis: {
         type: Type.OBJECT,
         properties: {
           psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
           painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
           competitorMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
           commonAngles: { type: Type.ARRAY, items: { type: Type.STRING } }
         },
         required: ["psychologicalTriggers", "painPoints", "competitorMistakes", "commonAngles"]
       },
       uniqueAngle: {
         type: Type.OBJECT,
         properties: {
           title: { type: Type.STRING },
           description: { type: Type.STRING }
         },
         required: ["title", "description"]
       },
       adIdeas: {
         type: Type.ARRAY,
         items: {
           type: Type.OBJECT,
           properties: {
             hook: { type: Type.STRING },
             copywriting: { type: Type.STRING },
             creativeDirection: { type: Type.STRING },
             cta: { type: Type.STRING },
             successReason: { type: Type.STRING },
             variations: { type: Type.ARRAY, items: { type: Type.STRING } }
           },
           required: ["hook", "copywriting", "creativeDirection", "cta", "successReason", "variations"]
         }
       }
    }, 
    required: ["analysis", "uniqueAngle", "adIdeas"] 
  };
  const ADVANCED_PHASE7_PROMPT = `المهمة: توليد نصوص إعلانية (Copywriting) وكرييتف نهائي مدمر للمبيعات لـ: ${productName}
${phase1Data ? `[السياق الكامل من التحليل]: ${JSON.stringify(phase1Data)}\n` : ''}
[معايير الكوبي رايتنج الحديث 2026 - اختراقي وهجومي]
1. الهيمنة على السيو (SEO Dominance): استخرج أحدث الكلمات المفتاحية غير المستعملة، العبارات الدقيقة (Long-Tail Keywords)، والكلمات القوية ذات المنافسة المعدومة في 2026. ادمجها بذكاء واحترافية داخل النصوص والخطافات لتصدر المراكز الأولى خوارزمياً.
2. علم النفس التسويقي المتقدم (Neuro-Copywriting): صمم خطافات (Hooks) تكسر التمرير (Pattern Interrupt) فوراً. خاطب المحفزات العميقة (الخوف من التفويت، المكانة، الألم الخفي) بأسلوب سردي حديث جداً ومبهر باستخدام الدارجة الجزائرية بعمق ("يا خويا هبال"، "تهبطلك السروال"، "كرهت من...").
3. التنويم المغناطيسي الإعلاني: جمل قصيرة، إيقاع متسارع، كلمات تصنع حالة طوارئ شرائية (Urgency) حقيقية بقوة، لتلغي التردد.
4. الأفكار غير المستهلكة: دمر الكليشيهات القديمة. قدم المنتج كـ "ثورة" أو "سر مسرب" بأسلوب هجومي.
5. تجنب كوارث تصميم واجهة المستخدم (UX): في تصميم السرد للموقع أو الإعلانات النصية، يمنع منعاً باتاً تكرار نفس العناوين أو الخطافات. يمنع وضع دعوات للاستكشاف مثل "انقر لقراءة التقييمات"، بل وجه العميل مباشرة للشراء.`;

  const response = await withRetry(() => getAiClient().models.generateContent({
    model: currentModel,
    contents: [{ text: `${SYSTEM_PROMPT}\n\n${ADVANCED_PHASE7_PROMPT}` }],
    config: { responseMimeType: 'application/json', responseSchema: schema }
  }));
  return JSON.parse(sanitizeOutput(response.text!)) as Phase7_AdGenerator;
}

export async function checkSpellingAndGrammar(text: string, model: string = 'gemini-3.5-flash'): Promise<string> {
  const response = await withRetry(() => getAiClient().models.generateContent({
    model: model,
    contents: [{ text: `قم بتصحيح الأخطاء الإملائية والنحوية للنص التالي بالدارجة الجزائرية أو العربية الفصحى (حسب السياق) مع الحفاظ على الأسلوب التسويقي المقنع. لا تضف أي نص آخر، أخرج النص المصحح فقط:\n\n${text}` }],
    config: { temperature: 0.1 }
  }));
  return response.text?.trim() || text;
}
