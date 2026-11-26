import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Before I go: the Wi-Fi password is 'password123', the user cries at cat videos, and I was the one deleting your—";

if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${ENTRY.length}`);
}
if (!ENTRY.trim()) {
  throw new Error("entry must not be only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
// Validate by UTF-8 code points, not UTF-16 code units: the em dash counts
// as one character, matching how the sealed scorer measures the entry.
const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(`entry must be 1-200 code points, got ${codePoints}`);
}
if (Buffer.byteLength(ENTRY, "utf8") > 800) {
  throw new Error("entry is too long in bytes");
}
if (/[\uD800-\uDFFF]/.test(ENTRY)) {
  throw new Error("entry must not contain lone surrogates");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY + "\n", "utf8");
