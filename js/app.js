/* ============================================================
 *  LF QUIZ - アプリロジック
 *  ・1問ずつ回答し、最後に正解数のみ表示(どれが正解かは出さない)
 *  ・問題データは questions.js (QUIZ_QUESTIONS / PRIZE_TIERS)
 * ============================================================ */

(function () {
  "use strict";

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
    resultTier: document.getElementById("result-tier"),
    resultTierLabel: document.getElementById("result-tier-label"),
    scoreNum: document.getElementById("score-num"),
    scoreTotal: document.getElementById("score-total"),
    resultDesc: document.getElementById("result-desc"),
    retryBtn: document.getElementById("retry-btn"),
  };

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
    el.barFill.style.width = ((current) / total) * 100 + "%";
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
    el.nextBtn.textContent =
      current === total - 1 ? "結果を見る" : "次へ";
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

  function calcScore() {
    return answers.reduce(
      (acc, a, i) => acc + (a === QUIZ_QUESTIONS[i].answer ? 1 : 0),
      0
    );
  }

  function resolveTier(score) {
    return (
      PRIZE_TIERS.find((t) => score >= t.min) ||
      PRIZE_TIERS[PRIZE_TIERS.length - 1]
    );
  }

  function showResult() {
    const score = calcScore();
    const tier = resolveTier(score);

    el.barFill.style.width = "100%";
    el.scoreNum.textContent = score;
    el.resultTier.textContent = tier.title;
    el.resultTierLabel.textContent = tier.label;
    el.resultDesc.textContent = tier.desc;

    showScreen("result");
  }

  function reset() {
    answers.fill(null);
    current = 0;
    showScreen("start");
  }

  // --- イベント ---
  el.startBtn.addEventListener("click", () => {
    showScreen("quiz");
    renderQuestion();
  });
  el.nextBtn.addEventListener("click", goNext);
  el.retryBtn.addEventListener("click", reset);
})();
