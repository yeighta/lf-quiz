/* ============================================================
 *  LF QUIZ - 問題データ【編集用ソースのテンプレート】
 * ------------------------------------------------------------
 *  このファイルをコピーして questions.src.js を作成し、編集します:
 *
 *      cp questions.src.example.js questions.src.js
 *
 *  ・QUIZ_QUESTIONS に 4択の問題を 12 問設定してください。
 *  ・choices は必ず 4 つ。answer は正解の番号(0=A, 1=B, 2=C, 3=D)。
 *  ・編集後、`node build.mjs` で配信用 js/questions.js を生成して push。
 *
 *  ※ questions.src.js は平文の正解を含むため .gitignore で公開対象外。
 *    実際の正解は各自ローカルに保管してください。
 * ============================================================ */

const QUIZ_QUESTIONS = [
  {
    question: "サンプル問題1: 正しいのはどれ?",
    choices: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    answer: 0,
  },
  {
    question: "サンプル問題2: 正しいのはどれ?",
    choices: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    answer: 1,
  },
  // ... 全12問になるように追加してください
];

/* Node(build.mjs)からも、ブラウザからも読めるようにエクスポート */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUIZ_QUESTIONS };
}
