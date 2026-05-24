import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Users, ShieldAlert, Sparkles, Flame, Building, ShieldCheck, Database, Landmark, ChevronLeft, ArrowDownRight, RefreshCw } from 'lucide-react';

interface SaaSAdminProps {
  onBackToDashboard: () => void;
}

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  plan: 'free' | 'pro' | 'agency' | 'enterprise';
  createdAt: number;
}

export function SaaSAdmin({ onBackToDashboard }: SaaSAdminProps) {
  const { user, serverDbAvailable } = useAuth();
  
  // Strict admin authorization check
  if (!user || user.email !== 'kerkacem@gmail.com') {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 font-sans text-center" dir="rtl">
        <div className="w-full max-w-md bg-white border-3 border-black shadow-[10px_10px_0_rgba(0,0,0,1)] p-8 relative">
          <div className="absolute top-0 right-0 left-0 h-2 bg-red-600 border-b-2 border-black" />
          
          <div className="w-16 h-16 bg-red-100 border-2 border-red-600 rounded-full flex items-center justify-center mx-auto text-red-600 mb-6">
            <ShieldAlert size={36} />
          </div>
          
          <h2 className="text-xl font-black text-black mb-3">غير مصرح بالدخول للوحة الإدارة</h2>
          <p className="text-xs text-gray-500 font-bold mb-6 leading-relaxed">
            عذراً، هذا الحساب التابع لـ <span className="text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 font-mono">{user?.email || 'مجهول'}</span> ليس لديه الصلاحيات الإدارية المطلوبة.
            <br />
            المسؤول والمصمم الوحيد المعتمد هو <strong className="text-black font-black">كرباني بلقاسم (kerkacem@gmail.com)</strong>.
          </p>

          <button
            onClick={onBackToDashboard}
            className="w-full bg-black text-[#00FF41] hover:bg-gray-900 font-extrabold py-3.5 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs"
          >
            العودة إلى لوحة التحكم الرئيسية
          </button>
          
          <div className="mt-6 pt-4 border-t border-black/10 text-[9px] font-bold text-gray-400">
            طُور وصمم لحفظ الحقوق الفكرية بواسطة: كرباني بلقاسم KERBANI BELKACEM
          </div>
        </div>
      </div>
    );
  }

  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [mockEarnings, setMockEarnings] = useState(148500);

  const fetchUsers = async () => {
    setLoading(true);
    if (serverDbAvailable) {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': user?.id || '' }
        });
        if (res.ok) {
          const data = await res.json();
          setUsersList(data);
          // Calculate earnings based on plans
          const total = data.reduce((acc: number, item: any) => {
            if (item.plan === 'pro') return acc + 1500;
            if (item.plan === 'agency') return acc + 3500;
            if (item.plan === 'enterprise') return acc + 12000;
            return acc;
          }, 0);
          setMockEarnings(147000 + total);
        }
      } catch (err) {
        console.error('Failed to query users from Admin Route', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Load Local Storage fallback users list
      try {
        const localListStr = localStorage.getItem('nextify_local_users') || '[]';
        const localUsers = JSON.parse(localListStr);
        setUsersList(localUsers);
        const total = localUsers.reduce((acc: number, item: any) => {
          if (item.plan === 'pro') return acc + 1500;
          if (item.plan === 'agency') return acc + 3500;
          if (item.plan === 'enterprise') return acc + 12000;
          return acc;
        }, 0);
        setMockEarnings(15000 + total);
      } catch (e) {}
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [serverDbAvailable]);

  const changeUserPlan = async (targetUserId: string, newPlan: 'free' | 'pro' | 'agency' | 'enterprise') => {
    if (serverDbAvailable) {
      try {
        const res = await fetch(`/api/admin/users/${targetUserId}/plan`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': user?.id || ''
          },
          body: JSON.stringify({ plan: newPlan })
        });
        if (res.ok) {
          fetchUsers();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Local Storage Fallback update
      try {
        const dbStr = localStorage.getItem('nextify_local_users') || '[]';
        const localUsers = JSON.parse(dbStr);
        const idx = localUsers.findIndex((u: any) => u.id === targetUserId);
        if (idx !== -1) {
          localUsers[idx].plan = newPlan;
          localStorage.setItem('nextify_local_users', JSON.stringify(localUsers));
        }

        // Active session sync if updated user is self
        if (user && user.id === targetUserId) {
          const cachedUserStr = localStorage.getItem('nextify_saas_user');
          if (cachedUserStr) {
            const currentU = JSON.parse(cachedUserStr);
            currentU.plan = newPlan;
            localStorage.setItem('nextify_saas_user', JSON.stringify(currentU));
            window.location.reload(); // Refresh session instantly
          }
        }
        
        fetchUsers();
      } catch (e) {}
    }
  };

  const planIcons = {
    free: Sparkles,
    pro: Flame,
    agency: Building,
    enterprise: ShieldCheck
  };

  const planColors = {
    free: 'text-gray-500 bg-gray-100',
    pro: 'text-green-700 bg-green-100 border-green-300',
    agency: 'text-blue-700 bg-blue-100 border-blue-300',
    enterprise: 'text-red-700 bg-red-100 border-red-300'
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-12 font-sans selection:bg-[#00FF41]">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner with header info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b-2 border-black gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest bg-red-500 text-white px-2 py-1 border border-black inline-block">
                لوحة التحكم الإدارية (ADMIN CORE)
              </span>
              <span className="text-[10px] font-mono font-bold bg-white text-gray-500 border border-black/30 px-2 py-1 rounded-sm flex items-center gap-1">
                <Database size={12} />
                قراءة البيئة: {serverDbAvailable ? 'SERVER ACTIVE' : 'LOCAL FALLBACK'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-black">إدارة المستخدمين وعمليات المنصة</h1>
            <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-wider font-mono">
              MARKETING MASTER SaaS Administrator Control Desk
            </p>
          </div>
          <button 
            onClick={onBackToDashboard}
            className="px-6 py-3 border-2 border-black bg-white font-black text-xs hover:bg-black hover:text-[#00FF41] shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
          >
            ← عودة للوحة التحكم
          </button>
        </div>

        {/* Analytics row grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_rgba(0,0,0,1)] flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">إجمالي المسجلين</span>
              <span className="text-3xl font-black text-black font-mono">{usersList.length}</span>
              <span className="text-xs text-gray-500 block font-semibold mt-1">مشترك نشط حالياً</span>
            </div>
            <div className="p-3 bg-gray-100 border border-black/20 rounded">
              <Users size={24} className="text-black" />
            </div>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_rgba(0,0,0,1)] flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block font-sans">الأرباح المحاكاة Chargily</span>
              <span className="text-3xl font-black text-black font-mono">{mockEarnings.toLocaleString()}</span>
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-1 py-0.5 mt-1 inline-block font-sans font-black">
                DZD د.ج
              </span>
            </div>
            <div className="p-3 bg-green-100 border border-black/20 rounded">
              <Landmark size={24} className="text-green-700" />
            </div>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_rgba(0,0,0,1)] flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">سيرفر الاستخبارات</span>
              <span className="text-xl font-black text-green-600 font-mono">100% ONLINE</span>
              <span className="text-xs text-gray-500 block font-semibold mt-1">نسبة نجاح استدعاء المراحل</span>
            </div>
            <div className="p-3 bg-blue-100 border border-black/20 rounded-sm">
              <Database size={24} className="text-blue-700" />
            </div>
          </div>
        </div>

        {/* Users list table card */}
        <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-black text-black">قائمة مستخدمي الحسابات</h2>
            <button 
              onClick={fetchUsers}
              className="p-2 border border-black bg-white hover:bg-gray-50 font-semibold flex items-center gap-1.5 text-xs transition-all"
            >
              <RefreshCw size={14} />
              <span>تحديث البيانات</span>
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs opacity-60 flex flex-col items-center gap-2">
              <RefreshCw className="animate-spin text-black" size={24} />
              <span>جاري جلب قائمة المستخدمين...</span>
            </div>
          ) : usersList.length === 0 ? (
            <div className="py-20 text-center text-xs opacity-65 font-bold">
              لا توجد حسابات مسجلة على هذا السيرفر بعد. قم بالتسجيل للحساب أولاً!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-black font-extrabold text-[#475569] uppercase">
                    <th className="p-3 text-start">المعرف (ID)</th>
                    <th className="p-3 text-start">الاسم الكامل</th>
                    <th className="p-3 text-start">البريد الإلكتروني</th>
                    <th className="p-3 text-start">الخطة المفعلة</th>
                    <th className="p-3 text-start">تاريخ التسجيل</th>
                    <th className="p-3 text-end">تغيير الاشتراك الفوري</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersList.map((usr) => {
                    const PlanIcon = planIcons[usr.plan] || planIcons.free;
                    return (
                      <tr key={usr.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-mono text-gray-400 font-bold select-all">{usr.id}</td>
                        <td className="p-3 font-bold text-black">{usr.fullName}</td>
                        <td className="p-3 font-mono font-bold text-gray-600">{usr.email}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 border text-[10px] font-black uppercase rounded ${planColors[usr.plan] || planColors.free}`}>
                            <PlanIcon size={12} />
                            <span>{usr.plan}</span>
                          </span>
                        </td>
                        <td className="p-3 font-mono font-semibold text-gray-500">
                          {new Date(usr.createdAt || Date.now()).toLocaleDateString('ar-DZ')}
                        </td>
                        <td className="p-3 text-end">
                          <div className="flex gap-1 justify-end">
                            {['free', 'pro', 'agency', 'enterprise'].map((p) => (
                              <button
                                key={p}
                                disabled={usr.plan === p}
                                onClick={() => changeUserPlan(usr.id, p as any)}
                                className={`px-2 py-1 text-[10px] uppercase font-bold border transition-all ${
                                  usr.plan === p 
                                    ? 'bg-black text-[#00FF41] border-black scale-105'
                                    : 'bg-white hover:bg-gray-100 text-black border-gray-300'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Brand Copyright & Designer Signature Footer */}
        <div className="mt-12 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400" dir="rtl">
          <span>حقوق النشر © {new Date().getFullYear()} MARKETING MASTER SaaS الجزائر. جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-1.5 text-black">
            <span>طُور وتصمم بواسطة:</span>
            <span className="bg-black text-[#00FF41] px-2 py-0.5 border border-black font-extrabold uppercase font-mono tracking-wider">
              تصميم كرباني بلقاسم KERBANI BELKACEM
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
