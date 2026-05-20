import React from 'react';
import { MarkdownOutput } from './MarkdownOutput';
import { ProductProject } from '../types';

export function PhaseDisplay({ project, onNextPhase, isLoading }: { project: ProductProject, onNextPhase: (stage: number) => void, isLoading: boolean }) {
  return (
    <div className="flex flex-col gap-12 pb-24 max-w-4xl mx-auto">
      
      {/* PHASE 1 */}
      {project.phase1Result && (
        <div className="print-page-start bg-white border-2 md:border-4 border-black p-4 md:p-8 mb-6 md:mb-8 neo-shadow">
          <div className="text-xs md:text-sm font-black text-black uppercase tracking-widest mb-4 md:mb-6 border-b-2 md:border-b-4 border-black pb-2 inline-block bg-accent px-2 py-1">
            PHASE 1: PRODUCT INTELLIGENCE
          </div>
          <MarkdownOutput content={project.phase1Result} />
          {project.currentPhase === 1 && (
            <button 
              onClick={() => onNextPhase(2)}
              disabled={isLoading}
              className="no-print w-full md:w-auto mt-4 md:mt-6 bg-[#00FF41] text-black border-2 md:border-4 border-black px-4 md:px-8 py-3 md:py-4 text-sm md:text-base font-black uppercase tracking-wider neo-shadow-hover transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? 'جاري التحليل...' : 'اعتماد (الانتقال لـ PHASE 2)'}
            </button>
          )}
        </div>
      )}

      {/* PHASE 2 */}
      {project.phase2Result && (
        <div className="print-page-start bg-white border-2 md:border-4 border-black p-4 md:p-8 mb-6 md:mb-8 neo-shadow">
          <div className="text-xs md:text-sm font-black text-black uppercase tracking-widest mb-4 md:mb-6 border-b-2 md:border-b-4 border-black pb-2 inline-block bg-accent px-2 py-1">
            PHASE 2: VISUAL BRIEFS
          </div>
          <MarkdownOutput content={project.phase2Result} />
          {project.currentPhase === 2 && (
            <button 
              onClick={() => onNextPhase(3)}
              disabled={isLoading}
              className="no-print w-full md:w-auto mt-4 md:mt-6 bg-[#00FF41] text-black border-2 md:border-4 border-black px-4 md:px-8 py-3 md:py-4 text-sm md:text-base font-black uppercase tracking-wider neo-shadow-hover transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? 'جاري التحليل...' : 'اعتماد (الانتقال لـ PHASE 3)'}
            </button>
          )}
        </div>
      )}

      {/* PHASE 3 */}
      {project.phase3Result && (
        <div className="print-page-start bg-white border-2 md:border-4 border-black p-4 md:p-8 mb-6 md:mb-8 neo-shadow">
          <div className="text-xs md:text-sm font-black text-black uppercase tracking-widest mb-4 md:mb-6 border-b-2 md:border-b-4 border-black pb-2 inline-block bg-accent px-2 py-1">
            PHASE 3: LANDING PAGE CRO
          </div>
          <MarkdownOutput content={project.phase3Result} />
          {project.currentPhase === 3 && (
            <button 
              onClick={() => onNextPhase(4)}
              disabled={isLoading}
              className="no-print w-full md:w-auto mt-4 md:mt-6 bg-[#00FF41] text-black border-2 md:border-4 border-black px-4 md:px-8 py-3 md:py-4 text-sm md:text-base font-black uppercase tracking-wider neo-shadow-hover transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? 'جاري التحليل...' : 'اعتماد (الانتقال لـ PHASE 4)'}
            </button>
          )}
        </div>
      )}

      {/* PHASE 4 */}
      {project.phase4Result && (
        <div className="print-page-start bg-white border-2 md:border-4 border-black p-4 md:p-8 mb-6 md:mb-8 neo-shadow">
          <div className="text-xs md:text-sm font-black text-black uppercase tracking-widest mb-4 md:mb-6 border-b-2 md:border-b-4 border-black pb-2 inline-block bg-accent px-2 py-1">
            PHASE 4: VIDEO WORKFLOW
          </div>
          <MarkdownOutput content={project.phase4Result} />
          {project.currentPhase === 4 && (
            <button 
              onClick={() => onNextPhase(5)}
              disabled={isLoading}
              className="no-print w-full md:w-auto mt-4 md:mt-6 bg-[#00FF41] text-black border-2 md:border-4 border-black px-4 md:px-8 py-3 md:py-4 text-sm md:text-base font-black uppercase tracking-wider neo-shadow-hover transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? 'جاري التحليل...' : 'اعتماد (الانتقال لـ PHASE 5)'}
            </button>
          )}
        </div>
      )}

      {/* PHASE 5 */}
      {project.phase5Result && (
        <div className="print-page-start bg-white border-2 md:border-4 border-black p-4 md:p-8 mb-6 md:mb-8 neo-shadow">
          <div className="text-xs md:text-sm font-black text-black uppercase tracking-widest mb-4 md:mb-6 border-b-2 md:border-b-4 border-black pb-2 inline-block bg-accent px-2 py-1">
            PHASE 5: META ADS STRATEGY
          </div>
          <MarkdownOutput content={project.phase5Result} />
          {project.currentPhase === 5 && (
            <button 
              onClick={() => onNextPhase(6)}
              disabled={isLoading}
              className="no-print w-full md:w-auto mt-4 md:mt-6 bg-[#00FF41] text-black border-2 md:border-4 border-black px-4 md:px-8 py-3 md:py-4 text-sm md:text-base font-black uppercase tracking-wider neo-shadow-hover transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? 'جاري التحليل...' : 'اعتماد (الانتقال لـ PHASE 6)'}
            </button>
          )}
        </div>
      )}

      {/* PHASE 6 */}
      {project.phase6Result && (
        <div className="print-page-start bg-white border-2 md:border-4 border-black p-4 md:p-8 mb-6 md:mb-8 neo-shadow">
          <div className="text-xs md:text-sm font-black text-black uppercase tracking-widest mb-4 md:mb-6 border-b-2 md:border-b-4 border-black pb-2 inline-block bg-accent px-2 py-1">
            PHASE 6: SCALING SYSTEM
          </div>
          <MarkdownOutput content={project.phase6Result} />
          {project.currentPhase === 6 && (
            <div className="no-print mt-8 bg-[#00FF41] text-black border-2 md:border-4 border-black p-4 md:p-6 text-center font-black text-sm md:text-xl neo-shadow uppercase tracking-widest">
              تم اكتساب النظام بالكامل! الحملة جاهزة للتنفيذ 🚀
            </div>
          )}
        </div>
      )}

      {/* Designer Signature Footer */}
      <div className="no-print mt-12 pt-6 border-t-2 border-black/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400" dir="rtl">
        <span>سلسلة تشغيل وتطبيق الخوارزمية الفائقة</span>
        <div className="flex items-center gap-1.5 text-black">
          <span>تصميم وتطوير:</span>
          <span className="bg-black text-[#00FF41] px-2 py-0.5 border border-black font-extrabold uppercase font-mono tracking-wider text-[10px]">
            كرباني بلقاسم KERBANI BELKACEM
          </span>
        </div>
      </div>

    </div>
  );
}
