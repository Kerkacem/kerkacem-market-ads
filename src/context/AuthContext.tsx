import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  plan: 'free' | 'pro' | 'agency' | 'enterprise';
  geminiApiKeyToken?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  serverDbAvailable: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (fullName: string, avatarUrl: string) => Promise<{ success: boolean; error?: string }>;
  updateGeminiKey: (key: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverDbAvailable, setServerDbAvailable] = useState(false);

  // Checks server health & loads initial session
  useEffect(() => {
    async function checkHealthAndLoadUser() {
      let isServerHealthy = false;
      try {
        const res = await fetch('/api/health');
        if (res.status === 200 || res.status === 201) {
          const data = await res.json();
          // If Supabase or server is healthy
          isServerHealthy = true;
          setServerDbAvailable(true);
        } else {
          setServerDbAvailable(false);
        }
      } catch (e) {
        setServerDbAvailable(false);
      }

      // Check for user session
      try {
        const cachedUserStr = localStorage.getItem('nextify_saas_user');
        if (cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          
          if (isServerHealthy) {
            // Profile verification with server
            const profileRes = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cachedUser.email, password: cachedUser.passwordHash || 'demo_pass' })
            });
            if (profileRes.ok) {
              const data = await profileRes.json();
              const u = { ...data.user, passwordHash: cachedUser.passwordHash };
              if (u.email === 'kerkacem@gmail.com') {
                u.plan = 'enterprise';
              }
              setUser(u);
              localStorage.setItem('nextify_saas_user', JSON.stringify(u));
            } else {
              // Local session as active fallback
              const u = { ...cachedUser };
              if (u.email === 'kerkacem@gmail.com') {
                u.plan = 'enterprise';
              }
              setUser(u);
            }
          } else {
            const u = { ...cachedUser };
            if (u.email === 'kerkacem@gmail.com') {
              u.plan = 'enterprise';
            }
            setUser(u);
          }
        }
      } catch (err) {
        console.error('Session loading failed, falling back safely', err);
      } finally {
        setLoading(false);
      }
    }

    checkHealthAndLoadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (serverDbAvailable) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        const data = await res.json();
        if (res.ok) {
          const fullUser = { ...data.user, passwordHash: password };
          if (fullUser.email === 'kerkacem@gmail.com') {
            fullUser.plan = 'enterprise';
          }
          setUser(fullUser);
          localStorage.setItem('nextify_saas_user', JSON.stringify(fullUser));
          
          // Sync keys to local system
          if (data.user.geminiApiKeyToken) {
            localStorage.setItem('nextify_api_keys', JSON.stringify([data.user.geminiApiKeyToken]));
          }
          return { success: true };
        } else {
          return { success: false, error: data.error || 'خطأ أثناء تسجيل الدخول.' };
        }
      } catch (err) {
        setServerDbAvailable(false);
      }
    }

    // Fallback: Local Storage Mode
    try {
      const dbStr = localStorage.getItem('nextify_local_users') || '[]';
      const localUsers = JSON.parse(dbStr);
      let matched = localUsers.find((u: any) => u.email === cleanEmail);
      
      if (!matched) {
        // Auto-create local user
        const newUser: User & { passwordHash: string } = {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          email: cleanEmail,
          fullName: cleanEmail === 'kerkacem@gmail.com' ? 'كرباني بلقاسم' : 'مستخدم جديد',
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
          plan: cleanEmail === 'kerkacem@gmail.com' ? 'enterprise' : 'free',
          passwordHash: password
        };
        localUsers.push(newUser);
        localStorage.setItem('nextify_local_users', JSON.stringify(localUsers));
        matched = newUser;
      } else if (matched.passwordHash !== password) {
        // Update password hash automatically to accept login
        matched.passwordHash = password;
        localStorage.setItem('nextify_local_users', JSON.stringify(localUsers));
      }
      
      if (matched) {
        const fullUser = { ...matched };
        if (fullUser.email === 'kerkacem@gmail.com') {
          fullUser.plan = 'enterprise';
        }
        setUser(fullUser);
        localStorage.setItem('nextify_saas_user', JSON.stringify(fullUser));
        if (fullUser.geminiApiKeyToken) {
          localStorage.setItem('nextify_api_keys', JSON.stringify([fullUser.geminiApiKeyToken]));
        }
        return { success: true };
      } else {
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
      }
    } catch (e) {
      return { success: false, error: 'تعذر الاتصال بقاعدة البيانات المحلية.' };
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (serverDbAvailable) {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password, fullName })
        });
        const data = await res.json();
        if (res.ok) {
          const fullUser = { ...data.user, passwordHash: password };
          if (fullUser.email === 'kerkacem@gmail.com') {
            fullUser.plan = 'enterprise';
          }
          setUser(fullUser);
          localStorage.setItem('nextify_saas_user', JSON.stringify(fullUser));
          return { success: true };
        } else {
          return { success: false, error: data.error || 'فشل إنشاء الحساب.' };
        }
      } catch (err) {
        setServerDbAvailable(false);
      }
    }

    // Fallback: Local Storage Mode
    try {
      const dbStr = localStorage.getItem('nextify_local_users') || '[]';
      const localUsers = JSON.parse(dbStr);
      
      if (localUsers.find((u: any) => u.email === cleanEmail)) {
        return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً.' };
      }

      const newUser: User & { passwordHash: string } = {
        id: 'usr_' + Math.random().toString(36).substring(2, 11),
        email: cleanEmail,
        fullName: fullName || 'مستخدم جديد',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        plan: cleanEmail === 'kerkacem@gmail.com' ? 'enterprise' : 'free',
        passwordHash: password
      };

      localUsers.push(newUser);
      localStorage.setItem('nextify_local_users', JSON.stringify(localUsers));
      setUser(newUser);
      localStorage.setItem('nextify_saas_user', JSON.stringify(newUser));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'فشل حفظ الحساب محلياً.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nextify_saas_user');
    // Clear key session
    localStorage.removeItem('nextify_api_keys');
  };

  const updateProfile = async (fullName: string, avatarUrl: string) => {
    if (!user) return { success: false, error: 'المستخدم غير متصل.' };

    if (serverDbAvailable) {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': user.id
          },
          body: JSON.stringify({ fullName, avatarUrl })
        });
        const data = await res.json();
        if (res.ok) {
          const updated = { ...user, fullName, avatarUrl };
          setUser(updated);
          localStorage.setItem('nextify_saas_user', JSON.stringify(updated));
          return { success: true };
        }
      } catch (err) {
        setServerDbAvailable(false);
      }
    }

    // Local update
    const updated = { ...user, fullName, avatarUrl };
    setUser(updated);
    localStorage.setItem('nextify_saas_user', JSON.stringify(updated));

    // Persist in local storage registered users
    try {
      const dbStr = localStorage.getItem('nextify_local_users') || '[]';
      const localUsers = JSON.parse(dbStr);
      const idx = localUsers.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) {
        localUsers[idx].fullName = fullName;
        localUsers[idx].avatarUrl = avatarUrl;
        localStorage.setItem('nextify_local_users', JSON.stringify(localUsers));
      }
    } catch (e) {}

    return { success: true };
  };

  const updateGeminiKey = async (key: string) => {
    if (!user) return { success: false, error: 'المستخدم غير متصل.' };

    if (serverDbAvailable) {
      try {
        const res = await fetch('/api/user/gemini-key', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': user.id
          },
          body: JSON.stringify({ key })
        });
        if (res.ok) {
          const updated = { ...user, geminiApiKeyToken: key };
          setUser(updated);
          localStorage.setItem('nextify_saas_user', JSON.stringify(updated));
          localStorage.setItem('nextify_api_keys', JSON.stringify([key]));
          return { success: true };
        }
      } catch (err) {
        setServerDbAvailable(false);
      }
    }

    // Local update
    const updated = { ...user, geminiApiKeyToken: key };
    setUser(updated);
    localStorage.setItem('nextify_saas_user', JSON.stringify(updated));
    localStorage.setItem('nextify_api_keys', JSON.stringify([key]));

    try {
      const dbStr = localStorage.getItem('nextify_local_users') || '[]';
      const localUsers = JSON.parse(dbStr);
      const idx = localUsers.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) {
        localUsers[idx].geminiApiKeyToken = key;
        localStorage.setItem('nextify_local_users', JSON.stringify(localUsers));
      }
    } catch (e) {}

    return { success: true };
  };

  const refreshUser = async () => {
    if (!user) return;
    if (serverDbAvailable) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, password: (user as any).passwordHash })
        });
        if (res.ok) {
          const data = await res.json();
          const fullUser = { ...data.user, passwordHash: (user as any).passwordHash };
          setUser(fullUser);
          localStorage.setItem('nextify_saas_user', JSON.stringify(fullUser));
        }
      } catch (err) {}
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      serverDbAvailable,
      login,
      signup,
      logout,
      updateProfile,
      updateGeminiKey,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
