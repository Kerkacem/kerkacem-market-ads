import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Zap, LayoutTemplate, Briefcase, PlaySquare, Settings, Compass, Users, Activity, Folder, ChevronDown, ChevronRight, PenTool, Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { AppState } from '../types';
import { ProjectData } from '../App';
import { SettingsModal } from './SettingsModal';

interface SidebarProps {
  appState: AppState;
  projects?: ProjectData[];
  currentProjectId?: string | null;
  onSelectProject?: (proj: ProjectData) => void;
  currentModel: string;
  onModelChange: (model: string) => void;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ appState, projects = [], currentProjectId, onSelectProject, currentModel, onModelChange, className, isOpen = false, onClose }: SidebarProps) {
  const [showProjects, setShowProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');
  const [filterState, setFilterState] = useState<AppState | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (filterState !== 'ALL' && p.appState !== filterState) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return b.updatedAt - a.updatedAt;
      if (sortBy === 'oldest') return a.updatedAt - b.updatedAt;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [projects, searchQuery, sortBy, filterState]);

  const navItems = [
    { icon: LayoutDashboard, label: 'لوحة القيادة', active: appState === 'IDLE' },
    { icon: Activity, label: 'تحليل المنتج العميق', active: appState === 'PHASE_1_DONE' },
    { icon: Zap, label: 'ملخصات بصرية إعلانية', active: appState === 'PHASE_2_DONE' },
    { icon: LayoutTemplate, label: 'صفحة الهبوط', active: appState === 'PHASE_3_DONE' },
    { icon: PlaySquare, label: 'سير عمل الفيديو', active: appState === 'PHASE_4_DONE' },
    { icon: Compass, label: 'خطة إعلانات ميتا', active: appState === 'PHASE_5_DONE' },
    { icon: Users, label: 'نظام التوسع والربحية', active: appState === 'PHASE_6_DONE' },
    { icon: PenTool, label: 'مولد النصوص الإعلانية', active: appState === 'PHASE_7_DONE' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      <aside className={`w-72 bg-[#f2f2f2] border-e-2 border-black flex flex-col h-screen shrink-0 fixed md:relative z-50 transition-transform duration-300 right-0 ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'} md:!translate-x-0 ${className || ''}`}>
        <div className="p-4 md:p-6 border-b-2 border-black relative">
          {onClose && (
            <button className="md:hidden absolute left-4 top-1/2 -translate-y-1/2" onClick={onClose}>
              <X size={20} />
            </button>
          )}
          <div className="flex items-center gap-3 font-display uppercase font-black text-xl md:text-2xl tracking-tighter text-black truncate pe-8 md:pe-0">
            MARKETING MASTER
          </div>
          <p className="text-[10px] text-black font-mono font-bold uppercase tracking-widest mt-1 opacity-80 truncate" dir="ltr">Engine v5.0 Ultimate</p>
        </div>

      <div className="flex-1 overflow-y-auto pt-6 flex flex-col custom-scrollbar">
        <div className="text-[10px] font-mono font-bold text-black uppercase tracking-widest mb-2 px-6 pt-6 opacity-40">
          مسارات التنفيذ
        </div>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
             <button
              key={idx}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-all border-b border-[#0000001A] text-start group ${
                item.active 
                  ? 'bg-white border-s-[8px] border-[#00FF41] font-bold text-black shadow-[inset_4px_0_0_#FFF]' 
                  : 'hover:bg-white text-black opacity-70 hover:opacity-100 hover:border-s-[4px] hover:border-black'
              }`}
            >
              <Icon size={18} className={`${item.active ? 'text-[#00FF41] fill-black' : 'text-black group-hover:scale-110 transition-transform'}`} />
              <span className={`font-display uppercase tracking-tight ${item.active ? 'font-black text-base' : 'font-bold text-sm'}`}>{item.label}</span>
            </button>
          )
        })}

        {/* مساحة العمل */}
        <div className="mt-8">
           <button 
             onClick={() => setShowProjects(!showProjects)}
             className="w-full text-[10px] font-mono font-bold text-black uppercase tracking-widest mb-2 px-6 flex items-center justify-between opacity-80 hover:opacity-100"
           >
             <span className="flex items-center gap-2">
                 <Folder size={12} fill="currentColor" />
                 مساحة العمل (WORKSPACE)
             </span>
             {showProjects ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
           </button>
           
           {showProjects && (
             <div className="flex flex-col gap-2 px-4 mt-2 mb-6">
                <div className="flex gap-1 items-center mb-2">
                  <div className="relative flex-1">
                    <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50" />
                    <input 
                      type="text" 
                      placeholder="بحث..." 
                      className="w-full text-xs p-1.5 pr-6 border border-[#00000033] focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] rounded-sm bg-white text-black placeholder:opacity-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-1.5 border rounded-sm transition-colors ${showFilters || filterState !== 'ALL' || sortBy !== 'newest' ? 'bg-[#00FF41] border-black text-black' : 'border-[#00000033] bg-white hover:border-black'}`}
                    title="فرز وتصفية"
                  >
                    <Filter size={14} />
                  </button>
                </div>

                {showFilters && (
                  <div className="flex flex-col gap-2 bg-white p-2 border border-[#00000033] rounded-sm mb-2 text-xs">
                    <select 
                      className="w-full p-1 border border-[#00000033] rounded-sm focus:outline-none focus:border-black"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      dir="rtl"
                    >
                      <option value="newest">الأحدث أولاً</option>
                      <option value="oldest">الأقدم أولاً</option>
                      <option value="name-asc">الاسم (أ-ي)</option>
                      <option value="name-desc">الاسم (ي-أ)</option>
                    </select>
                    
                    <select 
                      className="w-full p-1 border border-[#00000033] rounded-sm focus:outline-none focus:border-black"
                      value={filterState}
                      onChange={(e) => setFilterState(e.target.value as any)}
                      dir="rtl"
                    >
                      <option value="ALL">جميع المراحل</option>
                      <option value="IDLE">قيد الانتظار</option>
                      <option value="PHASE_1_DONE">تم التحليل</option>
                      <option value="PHASE_2_DONE">تم تصميم الإعلانات</option>
                      <option value="PHASE_3_DONE">تم بناء صفحة الهبوط</option>
                      <option value="PHASE_7_DONE">تم اكتمال الحملة</option>
                    </select>
                  </div>
                )}

                {filteredProjects.length === 0 ? (
                  <div className="text-xs opacity-50 px-2 py-2 font-mono">لا توجد مشاريع.</div>
                ) : (
                  filteredProjects.map(proj => (
                    <button
                      key={proj.id}
                      onClick={() => onSelectProject && onSelectProject(proj)}
                      className={`text-right px-3 py-2 text-xs font-bold truncate rounded-sm border-2 transition-all ${
                        currentProjectId === proj.id 
                          ? 'border-black bg-black text-[#00FF41]' 
                          : 'border-transparent text-black hover:border-[#00000033] hover:bg-white'
                      }`}
                      dir="rtl"
                    >
                      {proj.name}
                    </button>
                  ))
                )}
             </div>
           )}
        </div>
      </div>

      <div className="p-4 border-t-2 border-black bg-[#f2f2f2]">
        <div className="mb-4">
          <label className="text-[10px] font-mono font-bold text-black uppercase tracking-widest mb-2 block opacity-40">
            نموذج الذكاء الاصطناعي
          </label>
          <select 
            value={currentModel} 
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full text-xs p-2 border border-[#00000033] bg-white rounded-sm focus:outline-none focus:border-[#00FF41] cursor-pointer"
          >
            <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
            <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite Preview</option>
          </select>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-3 px-4 py-3 font-display font-bold uppercase text-sm group text-black border-2 border-transparent hover:border-black hover:bg-[#00FF41] transition-all mb-2">
          <Settings size={18} className="group-hover:rotate-90 transition-transform" />
          <span>إعدادات النظام</span>
        </button>
        <div className="text-center pt-3 border-t border-black/10" dir="rtl">
          <span className="text-[10px] text-gray-500 block font-bold leading-relaxed">
            تصميم كرباني بلقاسم
          </span>
          <span className="text-[10px] text-black block font-black uppercase tracking-wider">
            KERBANI BELKACEM
          </span>
        </div>
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </aside>
    </>
  );
}
