/**
 * server.js — CAD Cost Estimator backend
 * Works with Bun OR Node (Express is compatible with both runtimes).
 *
 * Run with Bun:   bun run server.js
 * Run with Node:  node server.js
 *
 * Endpoints:
 *   POST /api/upload    -> multipart file upload (.dwg/.dxf/.dwt/.dws)
 *                          returns parsed geometry + cost breakdown
 *   GET  /api/health     -> quick check that parser + python env are working
 *   GET  /api/rate-card  -> returns the current rate card (for frontend display/edit)
 */
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn, spawnSync } = require("child_process");
const { computeCostBreakdown } = require("./costEngine");
const os = require("os");

// Windows only has "python" by default; Mac/Linux usually has "python3".
// Detect once at startup instead of hardcoding, so this works on any OS
// without editing code. Override anytime with: PYTHON_BIN=py node server.js
function detectPython() {
  if (process.env.PYTHON_BIN) return process.env.PYTHON_BIN;
  for (const candidate of ["python3", "python", "py"]) {
    try {
      const result = spawnSync(candidate, ["--version"]);
      if (result.status === 0) return candidate;
    } catch (_) { /* try next candidate */ }
  }
  return "python3"; // fall back to the original default; will error clearly if missing
}
const PYTHON_BIN = detectPython();

const app = express();
const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(express.json());
app.use((req, res, next) => {
  // permissive CORS for local prototype (tighten before real deployment)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Memory guard for Render free tier (512MB limit)
app.use((req, res, next) => {
  if (process.memoryUsage().heapUsed > 400 * 1024 * 1024) {
    return res.status(503).json({ error: "Server busy, try again" });
  }
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const stamp = Date.now();
    cb(null, `${stamp}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB cap for Render free tier
  fileFilter: (req, file, cb) => {
    const allowed = [".dwg", ".dxf", ".dwt", ".dws"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error(`Unsupported file type: ${ext}. Allowed: ${allowed.join(", ")}`));
    }
    cb(null, true);
  }
});

// Run parser.py on a DXF file and return parsed JSON (Promise-wrapped)
function runPythonParser(dxfPath) {
  return new Promise((resolve, reject) => {
    const py = spawn(PYTHON_BIN, [path.join(__dirname, "parser.py"), dxfPath]);
    let stdout = "";
    let stderr = "";
    py.stdout.on("data", (d) => (stdout += d.toString()));
    py.stderr.on("data", (d) => (stderr += d.toString()));
    py.on("close", (code) => {
      if (code !== 0 && !stdout) {
        return reject(new Error(stderr || "parser.py exited with error"));
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed.error) return reject(new Error(parsed.error));
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse parser.py output: ${e.message}`));
      }
    });
  });
}

// Run convert_dwg.py to turn DWG/DWT/DWS into DXF first
function runDwgConverter(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const py = spawn(PYTHON_BIN, [path.join(__dirname, "convert_dwg.py"), inputPath, outputPath]);
    let stdout = "";
    let stderr = "";
    py.stdout.on("data", (d) => (stdout += d.toString()));
    py.stderr.on("data", (d) => (stderr += d.toString()));
    py.on("close", (code) => {
      try {
        const result = JSON.parse(stdout);
        if (result.error) return reject(new Error(result.error + (result.hint ? ` (${result.hint})` : "")));
        resolve(result);
      } catch (e) {
        reject(new Error(stderr || "convert_dwg.py failed"));
      }
    });
  });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/rate-card", (req, res) => {
  res.json(require("./rate_card.json"));
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded (field name must be 'file')" });

  const uploadedPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  let dxfPath = uploadedPath;

  try {
    if (ext !== ".dxf") {
      // DWG / DWT / DWS need conversion first
      dxfPath = uploadedPath.replace(ext, ".dxf");
      await runDwgConverter(uploadedPath, dxfPath);
      if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
    }

    const parsed = await runPythonParser(dxfPath);
    const costEstimate = computeCostBreakdown(parsed);

    res.json({
      fileName: req.file.originalname,
      geometry: parsed,
      costEstimate
    });
  } catch (err) {
    res.status(422).json({ error: err.message });
  } finally {
    // ALWAYS cleanup — ephemeral disk disappears on spin-down anyway
    [uploadedPath, dxfPath].forEach(p => {
      if (p && fs.existsSync(p)) fs.unlinkSync(p);
    });
  }
});

app.use((err, req, res, next) => {
  // multer errors (file too big, bad type) land here
  res.status(400).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n  CAD Cost Estimator backend running`);
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → Upload endpoint: POST http://localhost:${PORT}/api/upload`);
  console.log(`  → Using python command: "${PYTHON_BIN}" (set PYTHON_BIN env var to override)\n`);
});