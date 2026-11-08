/**
 * 台灣多機場出發 × 全球 102 大目的地機票自動比價系統 - 後端伺服器
 * 零外部套件依賴，原生支援 Node.js v18/v20/v22+
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const {
  TAIWAN_AIRPORTS,
  DESTINATION_REGIONS,
  searchSingleRoute,
  searchMultiRoutes
} = require("./services/flightEngine");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(body);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  // 1. 取得台灣出發機場與 7 大區域 (102 個目的地) 清單
  if (req.method === "GET" && pathname === "/api/destinations") {
    return sendJson(res, 200, {
      ok: true,
      taiwanAirports: TAIWAN_AIRPORTS,
      regions: DESTINATION_REGIONS
    });
  }

  // 2. 批次比價搜尋 API
  if (req.method === "POST" && pathname === "/api/search") {
    try {
      const body = await parseJsonBody(req);
      const {
        origins = ["TPE", "TSA", "RMQ", "KHH"],
        destinations = [],
        departDate,
        returnDate,
        adults = 1,
        cabin = 1,
        useLiveScrape = true
      } = body;

      if (!departDate) {
        return sendJson(res, 400, { ok: false, error: "請選擇出發日期" });
      }
      if (!Array.isArray(destinations) || destinations.length === 0) {
        return sendJson(res, 400, { ok: false, error: "請至少選擇一個目的地城市" });
      }

      const data = await searchMultiRoutes({
        origins,
        destinations,
        departDate,
        returnDate,
        adults: Number(adults) || 1,
        cabin: Number(cabin) || 1,
        useLiveScrape: Boolean(useLiveScrape)
      });

      return sendJson(res, 200, {
        ok: true,
        ...data
      });
    } catch (err) {
      return sendJson(res, 500, {
        ok: false,
        error: err.message || "搜尋過程發生錯誤"
      });
    }
  }

  // 3. 單一航線即時深度比價 API
  if (req.method === "POST" && pathname === "/api/deep-compare") {
    try {
      const body = await parseJsonBody(req);
      const { originCode, destId, departDate, returnDate, adults = 1, cabin = 1 } = body;
      const routeResult = await searchSingleRoute({
        originCode,
        destId,
        departDate,
        returnDate,
        adults: Number(adults) || 1,
        cabin: Number(cabin) || 1,
        useLiveScrape: true
      });
      if (!routeResult) {
        return sendJson(res, 404, { ok: false, error: "找不到指定航線資料" });
      }
      return sendJson(res, 200, {
        ok: true,
        route: routeResult
      });
    } catch (err) {
      return sendJson(res, 500, {
        ok: false,
        error: err.message || "深度比價失敗"
      });
    }
  }

  // 4. 靜態檔案服務 (Frontend UI)
  let filePath = pathname === "/" ? path.join(PUBLIC_DIR, "index.html") : path.join(PUBLIC_DIR, pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, "index.html");
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        return res.end("Internal Server Error");
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`✈️  台灣北中南出發 × 全球 102 大目的地機票自動比價系統已啟動`);
  console.log(`🌐 請在瀏覽器開啟: http://localhost:${PORT}`);
  console.log(`============================================================`);
});
