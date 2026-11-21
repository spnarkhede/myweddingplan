// Builds dist/ from src/ and public/. No dependencies.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => readFileSync(join(root, "src", p), "utf8");

// Order matters: modules share one script scope and run top to bottom.
export const MODULES = ["core.js", "load.js", "project-dates.js", "storage.js", "helpers.js", "views.js", "plan.js", "name-change.js", "visa-letters.js", "router.js", "events.js", "settings-backup.js", "documents.js", "invitations.js", "love.js"];

export function build() {
  const appJs = MODULES.map((m) => src("js/" + m)).join("\n");
  let html = src("index.html");
  const parts = {
    "/*MAKER_CSS*/": src("styles/certificate.css"),
    "/*SHELL_CSS*/": src("styles/app.css"),
    "<!--MAKER_MARKUP-->": src("partials/certificate.html"),
    "/*MAKER_JS*/": src("js/certificate.js"),
    "/*SHELL_JS*/": appJs,
  };
  for (const [token, content] of Object.entries(parts)) {
    if (!html.includes(token)) throw new Error("Missing placeholder " + token + " in src/index.html");
    html = html.split(token).join(content);
  }
  const dist = join(root, "dist");
  if (existsSync(dist)) rmSync(dist, { recursive: true });
  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, "index.html"), html);
  cpSync(join(root, "public"), dist, { recursive: true });
  return html;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const html = build();
  console.log("Built dist/index.html (" + Math.round(html.length / 1024) + " KB)");
}
