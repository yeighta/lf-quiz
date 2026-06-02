/* ============================================================
 *  LF QUIZ - アプリロジック
 *  ・1問ずつ回答し、最後に正解数のみ表示(どれが正解かは出さない)
 *  ・問題データは js/questions.js (QUIZ_QUESTIONS。正解はハッシュ h のみ)
 *  ・採点は選択肢を同じSALTでハッシュ化し h と照合して行う
 * ============================================================ */

(function () {
  "use strict";

  /* build.mjs の SALT と必ず一致させること(ハッシュ照合に使用) */
  const SALT = "lf-flame-2026-anniv";

  /* 回答済み記録のキー。問題を大幅に入れ替えて再挑戦を許可したい場合は
     末尾の番号(v1)を上げると、全員が再度挑戦できるようになります。 */
  const STORAGE_KEY = "lf-quiz-done-v1";

  const total = QUIZ_QUESTIONS.length;

  /** 回答インデックスを保持 (未回答は null) */
  const answers = new Array(total).fill(null);
  let current = 0;

  // --- DOM 参照 ---
  const screens = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
  };
  const el = {
    startBtn: document.getElementById("start-btn"),
    qCurrent: document.getElementById("q-current"),
    qTotal: document.getElementById("q-total"),
    barFill: document.getElementById("bar-fill"),
    question: document.getElementById("question"),
    choices: document.getElementById("choices"),
    nextBtn: document.getElementById("next-btn"),
    scoreNum: document.getElementById("score-num"),
    scoreTotal: document.getElementById("score-total"),
    resultDone: document.getElementById("result-done"),
  };

  /* localStorage 安全アクセス(プライベートモード等で例外が出ても落ちないように) */
  function saveDone(score) {
    try {
      localStorage.setItem(STORAGE_KEY, String(score));
    } catch (e) {
      /* 保存できない環境では再回答防止は効かないが、進行は妨げない */
    }
  }
  function loadDone() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === null) return null;
      const n = parseInt(v, 10);
      return isNaN(n) ? null : n;
    } catch (e) {
      return null;
    }
  }

  /* SHA-256 を16進文字列で返す(build.mjs と同一アルゴリズム) */
  async function sha256hex(str) {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(str)
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  el.qTotal.textContent = total;
  el.scoreTotal.textContent = "/ " + total;

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function renderQuestion() {
    const q = QUIZ_QUESTIONS[current];
    const marks = ["A", "B", "C", "D"];

    el.qCurrent.textContent = current + 1;
    el.barFill.style.width = (current / total) * 100 + "%";
    el.question.textContent = q.question;

    el.choices.innerHTML = "";
    q.choices.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      if (answers[current] === i) btn.classList.add("is-selected");
      btn.innerHTML =
        '<span class="choice__mark">' + (marks[i] || i + 1) + "</span>" +
        '<span class="choice__text"></span>';
      btn.querySelector(".choice__text").textContent = text;
      btn.addEventListener("click", () => selectChoice(i));
      el.choices.appendChild(btn);
    });

    el.nextBtn.disabled = answers[current] === null;
    el.nextBtn.textContent = current === total - 1 ? "結果を見る" : "次へ";
  }

  function selectChoice(i) {
    answers[current] = i;
    Array.from(el.choices.children).forEach((c, idx) =>
      c.classList.toggle("is-selected", idx === i)
    );
    el.nextBtn.disabled = false;
  }

  function goNext() {
    if (answers[current] === null) return;
    if (current < total - 1) {
      current += 1;
      renderQuestion();
    } else {
      showResult();
    }
  }

  /* 選択肢を同じSALTでハッシュ化し、保存された h と照合して正解数を数える */
  async function calcScore() {
    let score = 0;
    for (let i = 0; i < total; i++) {
      const sel = answers[i];
      if (sel === null) continue;
      const h = await sha256hex(SALT + "|" + i + "|" + QUIZ_QUESTIONS[i].choices[sel]);
      if (h === QUIZ_QUESTIONS[i].h) score += 1;
    }
    return score;
  }

  /** 結果画面を描画する。already=true は回答済み記録からの再表示 */
  function renderResult(score, already) {
    el.barFill.style.width = "100%";
    el.scoreNum.textContent = score;
    el.resultDone.hidden = !already;
    showScreen("result");
  }

  async function showResult() {
    el.nextBtn.disabled = true;
    const score = await calcScore();
    saveDone(score);
    renderResult(score, false);
  }

  // --- イベント ---
  el.startBtn.addEventListener("click", () => {
    showScreen("quiz");
    renderQuestion();
  });
  el.nextBtn.addEventListener("click", goNext);

  // --- 初期化: 既に回答済みなら結果画面を直接表示し、再回答を防ぐ ---
  (function init() {
    const done = loadDone();
    if (done !== null) {
      renderResult(done, true);
    }
  })();
})();
