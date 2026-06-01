# LF QUIZ

LA FLAME(兵庫県神戸市のシーシャカフェ&バー)の **周年イベント用クイズサイト** です。
スマホ利用を前提とした 4 択 12 問のクイズで、正解数に応じて景品をプレゼントします。

公開URL: https://yeighta.github.io/lf-quiz/

## 特徴

- 4 択 × 12 問
- 回答後は **正解数のみ表示**(どの問題が正解だったかは出しません)
  - 複数回来店するユーザーや、正解を共有するユーザーへの対策
- 正解数に応じた **3 段階の景品判定**
- ブランドイメージに合わせたダーク基調のデザイン
- ビルド不要の静的サイト(HTML / CSS / Vanilla JS)

## 問題・景品の編集方法

`js/questions.js` を編集するだけで変更できます。

### 問題を変える

```js
const QUIZ_QUESTIONS = [
  {
    question: "問題文",
    choices: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"], // 必ず4つ
    answer: 0, // 正解の番号(0=A, 1=B, 2=C, 3=D)
  },
  // ... 全12問
];
```

### 景品(正解数の判定)を変える

```js
const PRIZE_TIERS = [
  { min: 12, title: "PERFECT",   label: "全問正解",   desc: "..." },
  { min: 8,  title: "GREAT",     label: "8問以上正解", desc: "..." },
  { min: 0,  title: "THANK YOU", label: "参加賞",     desc: "..." },
];
```

- `min` は「その点数以上」。上から順に判定されるので **点数の高い順** に並べてください。
- `title` は大きく表示される見出し、`label` は小さなラベル、`desc` は説明文です。

編集後、`main` ブランチに push すると GitHub Pages に自動反映されます。

## ローカル確認

```sh
cd lf-quiz
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## デプロイ

`main` ブランチのルートを GitHub Pages で公開しています。
push すると自動でビルド・反映されます。
