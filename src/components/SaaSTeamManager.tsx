import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Users, UserPlus, Trash2, Shield, Mail, CheckCircle2, AlertTriangle, Crown, Sparkles } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'analyst' | 'approver';
  status: 'active' | 'pending';
  joinedAt: string;
}

interface SaaSTeamManagerProps {
  onGoToPricing: () => void;
}

export function SaaSTeamManager({ onGoToPricing }: SaaSTeamManagerProps) {
  const { user } = useAuth();
  
  // Agency (max 5), Enterprise (Unlimited), Free/Pro (0)
  const isEligible = user?.plan === 'agency' || user?.plan === 'enterprise';
  const maxSeats = user?.plan === 'enterprise' ? Infinity : 5;
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor' | 'analyst' | 'approver'>('editor');
  const [actionSuccess, setActionSuccess] = useState('');

  // Initial Seed & Load
  useEffect(() => {
    const cached = localStorage.getItem('saas_team_members');
    if (cached) {
      setMembers(JSON.parse(cached));
    } else {
      const defaultMembers: TeamMember[] = [
        {
          id: '1',
          name: 'كرباني بلقاسم',
          email: 'kerkacem@gmail.com',
          role: 'admin',
          status: 'active',
          joinedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'أحمد بن علي',
          email: 'ahmed.b@agency.dz',
          role: 'editor',
          status: 'active',
          joinedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'ياسمين بودية',
          email: 'yas.b@agency.dz',
          role: 'analyst',
          status: 'pending',
          joinedAt: new Date().toISOString()
        }
      ];
      setMembers(defaultMembers);
      localStorage.setItem('saas_team_members', JSON.stringify(defaultMembers));
    }
  }, []);

  const saveToLocal = (newMembers: TeamMember[]) => {
    setMembers(newMembers);
    localStorage.setItem('saas_team_members', JSON.stringify(newMembers));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) return;

    if (members.length >= maxSeats) {
      alert(`عذراً، لقد استغليت الحد الأقصى للمقاعد في خطتك الحالية (${maxSeats} مقاعد). يرجى الترقية لخطة الشركات.`);
      return;
    }

    const newM: TeamMember = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'pending',
      joinedAt: new Date().toISOString()
    };

    const updated = [...members, newM];
    saveToLocal(updated);
    setNewName('');
    setNewEmail('');
    setActionSuccess('✓ تم إرسال دعوة الانضمام بنجاح للعضو الجديد!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleDeleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    if (target?.email === 'kerkacem@gmail.com') {
      alert('يمنع حذف المالك الإداري الرئيسي للمنظومة!');
      return;
    }
    if (confirm('هل أنت متأكد من إلغاء دعوة أو حذف هذا العضو من فريق العمل؟')) {
      const updated = members.filter(m => m.id !== id);
      saveToLocal(updated);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'إداري (Admin)';
      case 'editor': return 'محرر ومصمم (Editor)';
      case 'analyst': return 'محلل بيانات (Analyst)';
      case 'approver': return 'صلاحية الموافقة (Approver)';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Visual Header */}
      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono font-black text-black bg-[#99f6e4] px-2 py-0.5 border border-black inline-block mb-1.5 uppercase tracking-wider">
            بوابة الإدارة المشتركة v1.4
          </span>
          <h3 className="text-xl font-black text-black flex items-center gap-2">
            <Users size={22} />
            <span>إدارة فرق العمل والحسابات الفرعية (Team Access Controls)</span>
          </h3>
          <p className="text-xs text-gray-500 font-bold mt-1 max-w-2xl leading-relaxed">
            قم بتنظيم الصلاحيات، وإضافة أعضاء فريقك في الوكالة لتوزيع تقارير MARKETING MASTER، والعمل سوياً على نفس المشاريع وحملات COD دون تضارب.
          </p>
        </div>
        <div className="bg-gray-50 border border-black px-4 py-2 font-mono text-xs text-center min-w-[120px]">
          <span className="text-[9px] text-gray-400 block font-bold">المقاعد المستعملة</span>
          <span className="text-lg font-black text-black">
            {isEligible ? members.length : 0} / {maxSeats === Infinity ? '∞' : maxSeats}
          </span>
        </div>
      </div>

      {!isEligible ? (
        /* LOCK SCREEN WITH UPGRADE MOTIVATION */
        <div className="bg-white border-3 border-black p-12 text-center shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
          <div className="max-w-md mx-auto space-y-6 py-6">
            <div className="w-16 h-16 bg-amber-100 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-600 animate-bounce">
              <Shield size={32} />
            </div>
            
            <h4 className="text-lg font-black text-black">إدارة فرق العمل مغلقة في اشتراكك الحالي ({user?.plan === 'pro' ? 'المحترفين Pro' : 'المجاني'})</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">
              ميزة إدارة الفرق والحسابات الفرعية مصممة حصرياً لوكالات التسويق والشركات الكبرى DZ لتنظيم سير العمل. قم بترقية اشتراكك للوصول إلى:
            </p>
            
            <ul className="grid grid-cols-2 gap-2 text-right text-[11px] font-bold text-gray-700 bg-gray-50 p-4 border border-black max-w-sm mx-auto">
              <li className="flex items-center gap-1">✓ حتى 5 أعضاء بالوكالة</li>
              <li className="flex items-center gap-1">✓ مشاريع لا نهائية</li>
              <li className="flex items-center gap-1">✓ صلاحيات دقيقة ومستقلة</li>
              <li className="flex items-center gap-1">✓ تبادل فوري للتقارير</li>
            </ul>

            <button
              onClick={onGoToPricing}
              className="px-6 py-3 bg-[#00FF41] hover:bg-black hover:text-[#00FF41] text-black font-black text-xs border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 block mx-auto"
            >
              الترقية إلى خطة الوكالة / الشركات
            </button>
          </div>
        </div>
      ) : (
        /* FULL TEAM CONFIGURATION ACTIVE PORTAL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Invitation Form */}
          <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] lg:col-span-1 h-fit">
            <h4 className="text-sm font-black text-black border-b pb-3 mb-4 flex items-center gap-1.5">
              <UserPlus size={16} />
              <span>إرسال دعوة لعضو جديد</span>
            </h4>

            {actionSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-500 text-green-900 text-[10px] font-bold">
                {actionSuccess}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4 text-xs font-bold text-black">
              <div>
                <label className="block mb-1">اسم العضو الكامِل:</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: محمد بوعمامة"
                  className="w-full p-2.5 border-2 border-black focus:outline-none focus:bg-gray-50 text-xs font-semibold"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">البريد الإلكتروني للعمل:</label>
                <input 
                  type="email" 
                  required
                  placeholder="example@youragency.dz"
                  className="w-full p-2.5 border-2 border-black font-sans text-xs focus:outline-none"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">الصلاحية ونطاق الوصول:</label>
                <select 
                  className="w-full p-2.5 border-2 border-black focus:outline-none focus:bg-gray-50 text-xs"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                >
                  <option value="editor">محرر ومصمم (Editor) - تعديل وتوليد</option>
                  <option value="analyst">محلل بيانات (Analyst) - قراءة وتحليل الإحصائيات</option>
                  <option value="approver">صلاحية الموافقة (Approver) - تدقيق وموافقة</option>
                  <option value="admin">إداري فرعي (Admin) - تحكم كامل</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00FF41] hover:bg-black hover:text-[#00FF41] text-black font-black py-3 px-4 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer text-xs"
              >
                إرسال دعوة انضمام آلية
              </button>
            </form>
          </div>

          {/* Members List Table Grid */}
          <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] lg:col-span-2">
            <h4 className="text-sm font-black text-black border-b pb-3 mb-4 flex items-center justify-between">
              <span>أعضاء وكالتك النشطين وصلاحياتهم</span>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-sm font-mono">{members.length} نشط</span>
            </h4>

            <div className="space-y-4">
              {members.map((member) => (
                <div 
                  key={member.id}
                  className="border-2 border-black p-4 bg-[#fafafa] hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 border border-black bg-[#99f6e4] flex items-center justify-center font-bold text-black shrink-0 relative">
                      {member.role === 'admin' ? <Crown className="text-black" size={18} /> : <Users className="text-black" size={18} />}
                      {member.status === 'pending' && (
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-black">{member.name}</span>
                        {member.email === 'kerkacem@gmail.com' && (
                          <span className="bg-[#ffe4e6] text-[#991b1b] border border-red-300 text-[8px] font-black px-1.5 py-0.2 rounded-sm">مالك</span>
                        )}
                        <span className={`text-[9px] font-bold px-2 py-0.2 border rounded-sm ${
                          member.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-amber-100 text-amber-700 border-amber-300 animate-pulse'
                        }`}>
                          {member.status === 'active' ? 'مفعل' : 'انتظار الموافقة'}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5 flex flex-wrap items-center gap-2.5">
                        <span className="flex items-center gap-0.5"><Mail size={12} /> {member.email}</span>
                        <span>•</span>
                        <span>تاريخ الإضافة: {new Date(member.joinedAt).toLocaleDateString('ar-DZ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end sm:justify-start border-t sm:border-0 pt-3 sm:pt-0">
                    <span className="text-[11px] font-bold text-gray-600 bg-gray-100 border px-2.5 py-1">
                      {getRoleLabel(member.role)}
                    </span>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className={`p-2 border border-black ${member.email === 'kerkacem@gmail.com' ? 'opacity-30 cursor-not-allowed' : 'hover:bg-red-50 text-red-600'}`}
                      disabled={member.email === 'kerkacem@gmail.com'}
                      title="سحب الصلاحية والوصول"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-400 text-[11px] font-bold text-blue-900 leading-relaxed flex gap-2">
              <Sparkles className="shrink-0 text-blue-600" size={16} />
              <span>
                <strong>التكامل التجريبي:</strong> فريق العمل النشط يتشارك تلقائياً نفس قاعدة البيانات السحابية لقراءة وتصميم وتحليل مشاريع التجارة الإلكترونية، مما يسهل تشغيل حملات Meta Ads والتواصل في البيئة الجزائرية.
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
