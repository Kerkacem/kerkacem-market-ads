import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface UserProfile {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl: string;
  plan: "free" | "pro" | "agency" | "enterprise";
  geminiApiKeyToken?: string;
  createdAt: number;
}

interface ProjectRecord {
  id: string;
  userId: string;
  name: string;
  updatedAt: number;
  data: any;
}

interface DB {
  users: UserProfile[];
  projects: ProjectRecord[];
  payments: any[];
}

const DB_FILE = path.join(process.cwd(), "db.json");

function readDB(): DB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading db.json", e);
  }
  return { users: [], projects: [], payments: [] };
}

function writeDB(db: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing db.json", e);
  }
}

// Ensure database file exits
if (!fs.existsSync(DB_FILE)) {
  writeDB({ users: [], projects: [], payments: [] });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // CORS headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check: 503 if Supabase setup is empty / unconfigured
  app.get("/api/health", (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
    const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseKey.length > 0;
    
    if (!isSupabaseConfigured) {
      return res.status(503).json({
        status: "degraded",
        message: "Supabase connection not configured. Operating in high-performance local persistent Fallback Mode.",
        supabaseConfigured: false
      });
    }

    res.json({
      status: "ok",
      message: "Database system healthy and synchronized.",
      supabaseConfigured: true
    });
  });

  // Auth endpoints
  app.post("/api/auth/signup", (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان." });
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    
    if (db.users.find(u => u.email === cleanEmail)) {
      return res.status(400).json({ error: "البريد الإلكتروني مسجل بالفعل." });
    }

    const newUser: UserProfile = {
      id: "usr_" + Math.random().toString(36).substring(2, 11),
      email: cleanEmail,
      passwordHash: password, // In plain demo/localStorage mode, simplify hashes
      fullName: fullName || "مستخدم جديد",
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      plan: "free",
      createdAt: Date.now()
    };

    db.users.push(newUser);
    writeDB(db);

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        avatarUrl: newUser.avatarUrl,
        plan: newUser.plan
      }
    });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان." });
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.find(u => u.email === cleanEmail && u.passwordHash === password);

    if (!user) {
      return res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        geminiApiKeyToken: user.geminiApiKeyToken
      }
    });
  });

  // Project Endpoints
  app.get("/api/projects", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "يجب تسجيل الدخول لجلب المشاريع." });
    }

    const db = readDB();
    const userProjects = db.projects.filter(p => p.userId === userId);
    res.json(userProjects);
  });

  app.post("/api/projects/save", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "غير مصرح لك بحفظ المشروع." });
    }

    const { id, name, data } = req.body;
    if (!name) {
      return res.status(400).json({ error: "اسم المشروع مطلوب." });
    }

    const db = readDB();
    const projId = id || "proj_" + Math.random().toString(36).substring(2, 15);
    
    // Check constraints based on plan
    const user = db.users.find(u => u.id === userId);
    const existingIndex = db.projects.findIndex(p => p.id === projId && p.userId === userId);
    
    if (existingIndex === -1) {
      // New project, check tier limits
      const userProjectsCount = db.projects.filter(p => p.userId === userId).length;
      const plan = user?.plan || "free";
      
      if (plan === "free" && userProjectsCount >= 3) {
        return res.status(403).json({ 
          error: "لقد وصلت للحد الأقصى للمشاريع في الخطة المجانية (3 مشاريع). يرجى الترقية لخطة Pro لتوليد مشاريع أكثر." 
        });
      } else if (plan === "pro" && userProjectsCount >= 20) {
        return res.status(403).json({ 
          error: "لقد وصلت للحجم الأقصى المتاح لخطة المحترفين Pro (20 مشروع). يرجى الترقية لوكالة Agency لمشاريع غير محدودة." 
        });
      }
    }

    const newRecord: ProjectRecord = {
      id: projId,
      userId,
      name,
      updatedAt: Date.now(),
      data
    };

    if (existingIndex !== -1) {
      db.projects[existingIndex] = newRecord;
    } else {
      db.projects.push(newRecord);
    }

    writeDB(db);
    res.json({ success: true, project: newRecord });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "غير مصرح." });
    }

    const db = readDB();
    const initialLen = db.projects.length;
    db.projects = db.projects.filter(p => !(p.id === req.params.id && p.userId === userId));
    
    if (db.projects.length === initialLen) {
      return res.status(404).json({ error: "المشروع غير موجود." });
    }

    writeDB(db);
    res.json({ success: true, message: "تم حذف المشروع بنجاح." });
  });

  // Settings Endpoints
  app.put("/api/user/profile", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "غير مصرح." });
    }

    const { fullName, avatarUrl } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "المستخدم غير موجود." });
    }

    if (fullName) db.users[userIndex].fullName = fullName;
    if (avatarUrl) db.users[userIndex].avatarUrl = avatarUrl;
    
    writeDB(db);
    res.json({ success: true, user: db.users[userIndex] });
  });

  app.put("/api/user/gemini-key", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "غير مصرح." });
    }

    const { key } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "المستند غير متوفر." });
    }

    db.users[userIndex].geminiApiKeyToken = key;
    writeDB(db);
    res.json({ success: true, message: "تم تحديث مفتاح Gemini بنجاح." });
  });

  // Payments / Subscription Simulation endpoints
  app.post("/api/payments/create-checkout", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "غير مصرح." });
    }

    const { plan, amount, currency } = req.body;
    if (!plan) {
      return res.status(400).json({ error: "نوع الاشتراك مطلوب." });
    }

    const checkoutId = "chg_" + Math.random().toString(36).substring(2, 11);
    
    res.json({
      checkoutUrl: `/payment/simulate?id=${checkoutId}&userId=${userId}&plan=${plan}&amount=${amount}`,
      checkoutId
    });
  });

  app.post("/api/payments/confirm", (req, res) => {
    const { userId, plan, amount, checkoutId } = req.body;
    if (!userId || !plan) {
      return res.status(400).json({ error: "البيانات المدخلة ناقصة." });
    }

    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "المستخدم غير موجود." });
    }

    db.users[userIndex].plan = plan;
    
    // Log Payment
    db.payments.push({
      id: checkoutId || "pay_" + Math.random().toString(36).substring(2, 11),
      userId,
      plan,
      amount: amount || "0",
      status: "paid",
      createdAt: Date.now()
    });

    writeDB(db);
    res.json({ success: true, plan });
  });

  // Admin Endpoints
  app.get("/api/admin/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
  });

  app.put("/api/admin/users/:id/plan", (req, res) => {
    const { plan } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "المستخدم غير موجود." });
    }

    db.users[userIndex].plan = plan;
    writeDB(db);
    res.json({ success: true, user: db.users[userIndex] });
  });

  // Handle Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Handle process unhandled rejections to prevent crashing
  process.on("unhandledRejection", (reason, promise) => {
    console.warn("Unhandled Rejection at:", promise, "reason:", reason);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nextify SAAS Framework] Server running on http://localhost:${PORT}`);
  });
}

startServer();
