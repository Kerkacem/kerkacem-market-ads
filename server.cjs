var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var DB_FILE = import_path.default.join(process.cwd(), "db.json");
function readDB() {
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const data = import_fs.default.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading db.json", e);
  }
  return { users: [], projects: [], payments: [] };
}
function writeDB(db) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing db.json", e);
  }
}
if (!import_fs.default.existsSync(DB_FILE)) {
  writeDB({ users: [], projects: [], payments: [] });
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
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
  app.post("/api/auth/signup", (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0627\u0646." });
    }
    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    if (db.users.find((u) => u.email === cleanEmail)) {
      return res.status(400).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644." });
    }
    const newUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 11),
      email: cleanEmail,
      passwordHash: password,
      // In plain demo/localStorage mode, simplify hashes
      fullName: fullName || "\u0645\u0633\u062A\u062E\u062F\u0645 \u062C\u062F\u064A\u062F",
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
      return res.status(400).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0627\u0646." });
    }
    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email === cleanEmail && u.passwordHash === password);
    if (!user) {
      return res.status(401).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629." });
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
  app.get("/api/projects", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "\u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u062C\u0644\u0628 \u0627\u0644\u0645\u0634\u0627\u0631\u064A\u0639." });
    }
    const db = readDB();
    const userProjects = db.projects.filter((p) => p.userId === userId);
    res.json(userProjects);
  });
  app.post("/api/projects/save", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0644\u0643 \u0628\u062D\u0641\u0638 \u0627\u0644\u0645\u0634\u0631\u0648\u0639." });
    }
    const { id, name, data } = req.body;
    if (!name) {
      return res.status(400).json({ error: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0645\u0637\u0644\u0648\u0628." });
    }
    const db = readDB();
    const projId = id || "proj_" + Math.random().toString(36).substring(2, 15);
    const user = db.users.find((u) => u.id === userId);
    const existingIndex = db.projects.findIndex((p) => p.id === projId && p.userId === userId);
    if (existingIndex === -1) {
      const userProjectsCount = db.projects.filter((p) => p.userId === userId).length;
      const plan = user?.plan || "free";
      if (plan === "free" && userProjectsCount >= 3) {
        return res.status(403).json({
          error: "\u0644\u0642\u062F \u0648\u0635\u0644\u062A \u0644\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0645\u0634\u0627\u0631\u064A\u0639 \u0641\u064A \u0627\u0644\u062E\u0637\u0629 \u0627\u0644\u0645\u062C\u0627\u0646\u064A\u0629 (3 \u0645\u0634\u0627\u0631\u064A\u0639). \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0644\u062E\u0637\u0629 Pro \u0644\u062A\u0648\u0644\u064A\u062F \u0645\u0634\u0627\u0631\u064A\u0639 \u0623\u0643\u062B\u0631."
        });
      } else if (plan === "pro" && userProjectsCount >= 20) {
        return res.status(403).json({
          error: "\u0644\u0642\u062F \u0648\u0635\u0644\u062A \u0644\u0644\u062D\u062C\u0645 \u0627\u0644\u0623\u0642\u0635\u0649 \u0627\u0644\u0645\u062A\u0627\u062D \u0644\u062E\u0637\u0629 \u0627\u0644\u0645\u062D\u062A\u0631\u0641\u064A\u0646 Pro (20 \u0645\u0634\u0631\u0648\u0639). \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0644\u0648\u0643\u0627\u0644\u0629 Agency \u0644\u0645\u0634\u0627\u0631\u064A\u0639 \u063A\u064A\u0631 \u0645\u062D\u062F\u0648\u062F\u0629."
        });
      }
    }
    const newRecord = {
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
      return res.status(401).json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D." });
    }
    const db = readDB();
    const initialLen = db.projects.length;
    db.projects = db.projects.filter((p) => !(p.id === req.params.id && p.userId === userId));
    if (db.projects.length === initialLen) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F." });
    }
    writeDB(db);
    res.json({ success: true, message: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0628\u0646\u062C\u0627\u062D." });
  });
  app.put("/api/user/profile", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D." });
    }
    const { fullName, avatarUrl } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F." });
    }
    if (fullName) db.users[userIndex].fullName = fullName;
    if (avatarUrl) db.users[userIndex].avatarUrl = avatarUrl;
    writeDB(db);
    res.json({ success: true, user: db.users[userIndex] });
  });
  app.put("/api/user/gemini-key", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D." });
    }
    const { key } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0633\u062A\u0646\u062F \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631." });
    }
    db.users[userIndex].geminiApiKeyToken = key;
    writeDB(db);
    res.json({ success: true, message: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0645\u0641\u062A\u0627\u062D Gemini \u0628\u0646\u062C\u0627\u062D." });
  });
  app.post("/api/payments/create-checkout", (req, res) => {
    const userId = req.headers.authorization || "";
    if (!userId) {
      return res.status(401).json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D." });
    }
    const { plan, amount, currency } = req.body;
    if (!plan) {
      return res.status(400).json({ error: "\u0646\u0648\u0639 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0645\u0637\u0644\u0648\u0628." });
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
      return res.status(400).json({ error: "\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062F\u062E\u0644\u0629 \u0646\u0627\u0642\u0635\u0629." });
    }
    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F." });
    }
    db.users[userIndex].plan = plan;
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
  app.get("/api/admin/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
  });
  app.put("/api/admin/users/:id/plan", (req, res) => {
    const { plan } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F." });
    }
    db.users[userIndex].plan = plan;
    writeDB(db);
    res.json({ success: true, user: db.users[userIndex] });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  process.on("unhandledRejection", (reason, promise) => {
    console.warn("Unhandled Rejection at:", promise, "reason:", reason);
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nextify SAAS Framework] Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
