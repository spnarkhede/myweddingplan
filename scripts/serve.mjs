// Builds, then serves dist/ at http://localhost:5173
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const types = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };
build();
const port = Number(process.env.PORT) || 5173;
createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  const file = join(dist, path.endsWith("/") ? path + "index.html" : path);
  try { const body = await readFile(file); res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }); res.end(body); }
  catch { res.writeHead(404); res.end("Not found"); }
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
