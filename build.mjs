/* ============================================================
 *  LF QUIZ - ビルドスクリプト
 * ------------------------------------------------------------
 *  questions.src.js (平文の正解) を読み込み、正解をハッシュ化した
 *  配信用ファイル js/questions.js を生成します。
 *
 *      node build.mjs
 *
 *  ※ SALT は js/app.js 側と必ず一致させること(採点時に同じ値で
 *    ハッシュを再計算して照合するため)。SALT を変えた場合は
 *    app.js の SALT も同じ値に更新してください。
 * ============================================================ */

import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { QUIZ_QUESTIONS } = require("./questions.src.js");

// app.js の SALT と一致させること
const SALT = "lf-flame-2026-anniv";

function hash(index, text) {
  return createHash("sha256").update(`${SALT}|${index}|${text}`).digest("hex");
}

// バリデーション
QUIZ_QUESTIONS.forEach((q, i) => {
  if (!Array.isArray(q.choices) || q.choices.length !== 4) {
    throw new Error(`Q${i + 1}: choices は必ず4つにしてください`);
  }
  if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) {
    throw new Error(`Q${i + 1}: answer は 0〜3 で指定してください`);
  }
});

const items = QUIZ_QUESTIONS.map((q, i) => {
  const h = hash(i, q.choices[q.answer]);
  return (
    "  {\n" +
    `    question: ${JSON.stringify(q.question)},\n` +
    `    choices: ${JSON.stringify(q.choices)},\n` +
    `    h: ${JSON.stringify(h)},\n` +
    "  },"
  );
}).join("\n");

const out =
  "/* ============================================================\n" +
  " *  LF QUIZ - 配信用 問題データ【自動生成ファイル】\n" +
  " * ------------------------------------------------------------\n" +
  " *  ★このファイルは直接編集しないでください★\n" +
  " *  問題は questions.src.js を編集し、`node build.mjs` で再生成します。\n" +
  " *\n" +
  " *  正解は h(ハッシュ値)としてのみ保持しており、正解番号は\n" +
  " *  含まれていません。検証ツールで開いても正解は直接読めません。\n" +
  " * ============================================================ */\n\n" +
  "const QUIZ_QUESTIONS = [\n" +
  items +
  "\n];\n";

writeFileSync(new URL("./js/questions.js", import.meta.url), out);
console.log(`生成しました: js/questions.js (${QUIZ_QUESTIONS.length}問)`);
