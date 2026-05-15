export interface Phase0_CouncilResult {
  question: string;
  verdict: {
    agreements: string[];
    clashes: {
      issue: string;
      sides: string;
      explanation: string;
    }[];
    blindSpots: string[];
    recommendation: string;
    oneThingToDoFirst: string;
  };
  advisorResponses: {
    contrarian: string;
    firstPrinciples: string;
    expansionist: string;
    outsider: string;
    executor: string;
  };
}

export interface Phase05_AudienceBuilder {
  productContext: string;
  summary: string;
  testPhase: {
    priorityAudiences: string[];
    budgetAdvice: string;
  };
  audiences: {
    lookalike: { name: string; details: string }[];
    interests: { groupName: string; interests: string[]; description: string }[];
    remarketing: { name: string; details: string }[];
    broad: { name: string; details: string }[];
    custom: { name: string; details: string }[];
  };
  exclusionRules: string[];
  instructions: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface BSACompetitiveExtractor {
  overview: string;
  recurringAngles: { problem: string; copy: string; whyItWorks: string }[];
  winningPatterns: { patternName: string; description: string }[];
  workingCopyHooks: string[];
  missingAngles: string[];
  bsaRecommendations: string[];
}

export interface SEOBlueprint {
  technicalChecklist: string[];
  onPageRules: {
    titleFormula: string;
    descriptionFormula: string;
    headingStructure: string;
    keywordMapping: string;
    internalLinking: string;
  };
  jsonLdSchema: string;
  auditOutput: string;
}

export interface Phase1_Intelligence {
  productName: string;
  category: string;
  brand: string;
  usp: string;
  targetAudienceDZ: string;
  suggestedPriceDZD: string;
  objections: string;
  colorPalette: ColorPalette;
  psychologicalAngles: { name: string; description: string; hookExample: string }[];
  score: number;
  classification: string;
  marketSaturation: string;
  untappedAngles: string[];
  competitorAnalysis: { name: string; price: string; message: string; strengths: string; weaknesses: string }[];
  pricingStrategies: { low: string; balanced: string; premium: string };
  profitabilityEstimates: { productCost: string; shipping: string; adCost: string; codFee: string; returnRate: string; targetCPA: string };
  buyerPersona: { age: string; gender: string; income: string; interests: string[]; painPoints: string[]; behavior: string };
  customerJourney: { awareness: string; interest: string; desire: string; purchase: string; loyalty: string };
  salesPsychology: string[];
  adScripts: { hook: string; problem: string; solution: string; cta: string }[];
  adStrategy: { targeting: string; testing: string; scaling: string; retargeting: string };
  contentPlan30Days: string[];
  seoKeywords: string[];
  finalReport: string;
  assumptions: string[];
  selfReview: string;
  customerReviews?: { author: string; rating: number; comment: string }[];
  bsaCompetitiveExtractor?: BSACompetitiveExtractor;
  seoBlueprint?: SEOBlueprint;
}

export interface VisualBrief {
  conceptName: string;
  psychoAngle: string;
  objective: string;
  dimensions: string;
  imagePromptEN: string;
  textLayout: {
    headline: string;
    subHeadline: string;
    ctaButton: string;
  };
  negativePrompt: string;
  adCopyFusha: {
    hook: string;
    body: string;
    cta: string;
  };
}

export interface SocialMediaAdvertisingPlan {
  objectives: string;
  audienceAnalysis: string;
  strategyDevelopment: string;
  contentCreation: {
    format: string;
    hook: string;
    valueProposition: string;
  }[];
  campaignSetup: string;
  performanceTracking: string;
  mistakesToAvoid: string[];
}

export interface Phase2_StaticBriefs {
  masterPhotographyPrompt: string;
  briefs: VisualBrief[];
  socialMediaPlan?: SocialMediaAdvertisingPlan;
}

export interface Phase3_LandingPage {
  product_name: string;
  page_type: string;
  marketing_angle: string;
  conversion_framework: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  tone: string;
  target_market: string;
  sections: LPSection[];
  estimated_sections_impact: string;
  seo: {
    meta_title: string;
    meta_description: string;
  };
  general_notes: string;
}

export interface LPSection {
  order: number;
  section_type: string;
  title: string;
  subtitle: string;
  content: string;
  image_prompt: string;
  text_overlay: {
    headline: string;
    subtext: string;
    position: string;
  };
  color_transition: string;
  cta_text: string;
}

export interface VideoScene {
  sceneName: string;
  duration: string;
  emotion: string;
  narrativeRole: string;
  visualDesc: string;
  narrationFusha: string;
  debutPromptEN: string;
  finPromptEN: string;
  animationPromptEN: string;
}

export interface Phase4_VideoWorkflow {
  characterSheet: {
    description: string;
    promptEN: string;
    seed: string;
  };
  scenes: VideoScene[];
  voiceOverScript: {
    fullText: string;
    recordingTips: string[];
  };
}

export interface Phase5_MetaAdsStrategy {
  campaignStructure: {
    overview: string;
    advantagePlus: string;
    aboTest: string;
  };
  anglesTesting: {
    statutVsConfort: string;
    painVsDesire: string;
  };
  targetingDZ: {
    broad: string;
    narrow: string;
  };
  kpis: {
    ctr: string;
    cpc: string;
    cvr: string;
  };
  bulkLauncher?: {
    mode: string;
    budget: string;
    path: string;
    template: string;
    geo: string;
    structureVisual: string[];
    targetingSummary: string;
  };
}

export interface Phase6_ScalingSystem {
  testingPlan7Days: string;
  scalingWinners: string;
  creativeIterations: string;
  killStrategy: string;
}

export interface Phase7_AdGenerator {
  analysis: {
    psychologicalTriggers: string[];
    painPoints: string[];
    competitorMistakes: string[];
    commonAngles: string[];
  };
  uniqueAngle: {
    title: string;
    description: string;
  };
  adIdeas: {
    hook: string;
    copywriting: string;
    creativeDirection: string;
    cta: string;
    successReason: string;
    variations: string[];
  }[];
}

export type AppState = 
  | 'IDLE' 
  | 'LOADING'
  | 'PHASE_0_DONE'
  | 'PHASE_05_DONE'
  | 'PHASE_1_DONE' 
  | 'PHASE_2_DONE'
  | 'PHASE_3_DONE'
  | 'PHASE_4_DONE'
  | 'PHASE_5_DONE'
  | 'PHASE_6_DONE'
  | 'PHASE_7_DONE'
  | 'CUSTOM_AD_GENERATOR';


export interface ProductProject {
  currentPhase: number;
  phase1Result?: string;
  phase2Result?: string;
  phase3Result?: string;
  phase4Result?: string;
  phase5Result?: string;
  phase6Result?: string;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
