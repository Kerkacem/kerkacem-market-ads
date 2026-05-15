import React from 'react';
// @ts-ignore
import Markdown from 'react-markdown';
import { Copy } from 'lucide-react';

export function MarkdownOutput({ content }: { content: string }) {
  // A simple function to copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('تم النسخ!');
  };

  return (
    <div className="relative bg-[#f9fafb] p-4 md:p-8 rounded-none border-2 border-black mb-4 md:mb-6 print-break-inside-avoid">
      <button 
        onClick={handleCopy}
        className="no-print absolute top-2 left-2 md:top-4 md:left-4 bg-white border-2 border-black px-2 md:px-3 py-1 md:py-1.5 hover:bg-[#00FF41] hover:text-black text-xs md:text-sm font-bold uppercase transition-colors flex items-center gap-1 md:gap-2 shadow-[2px_2px_0_#000000]"
        dir="ltr"
      >
        <Copy size={16} className="hidden md:block" />
        <Copy size={14} className="md:hidden" />
        Copy All
      </button>

      <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-black font-sans leading-relaxed selection:bg-[#00FF41] selection:text-black prose-p:text-gray-800 prose-headings:text-black prose-strong:text-black break-words overflow-x-hidden prose-a:break-all">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
