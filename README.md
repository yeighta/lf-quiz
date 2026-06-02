# LF QUIZ

LA FLAME(兵庫県神戸市のシーシャカフェ&バー)の **周年イベント用クイズサイト** です。
スマホ利用を前提とした 4 択 12 問のクイズです。

公開URL: https://yeighta.github.io/lf-quiz/

## 特徴

- 4 択 × 12 問
- 回答後は **正解数のみ表示**(どの問題が正解だったかは出しません)
  - 複数回来店するユーザーや、正解を共有するユーザーへの対策
- **挑戦は一度きり**(`localStorage` に記録し、再訪時は結果画面を直接表示)
- **正解はハッシュ化**して配信し、検証ツールで開いても正解番号が平文では見えない
- 景品は表示せず、当日の正解率を見てスタッフが柔軟に判断
- ブランドロゴはベクター(SVG)で常にシャープ
- 静的サイト(HTML / CSS / Vanilla JS)

## 問題の編集方法

正解を平文で持たないため、**編集用ソース**と**配信用ファイル**を分けています。

| ファイル | 役割 | Git |
|---|---|---|
| `questions.src.js` | 編集用。平文の正解(`answer`)を記述 | **非公開**(.gitignore) |
| `js/questions.js` | 配信用。正解はハッシュ(`h`)のみ。自動生成 | 公開・直接編集しない |

### 手順

```sh
# 初回のみ: テンプレートから編集用ソースを作成
cp questions.src.example.js questions.src.js

# 1. questions.src.js を編集(問題文・選択肢・answer)
#    choices は必ず4つ、answer は 0=A,1=B,2=C,3=D

# 2. 配信用ファイルを生成
node build.mjs

# 3. push(questions.src.js は .gitignore 済みなので公開されません)
git add js/questions.js
git commit -m "Update quiz questions"
git push
```

`main` に push すると GitHub Pages に自動反映されます(1〜2分)。

> **注意:** `questions.src.js` には平文の正解が入っているため、公開リポジトリには
> 含めていません(各自ローカルに保管)。本番の正解を控えておきたい場合は、この
> ファイルを安全な場所にバックアップしてください。

## 一度きりの挑戦をリセットしたい場合

問題を入れ替えて全員に再挑戦してもらう場合は、`js/app.js` の
`STORAGE_KEY = "lf-quiz-done-v1"` の末尾番号を上げてください(`v1`→`v2`)。
全端末の回答済み記録が無効になり、再度挑戦できます。

## 正解隠しについて(難読化の限界)

配信ファイルには正解番号を平文で含めず、ハッシュ値のみを保存しています。
検証ツールで開いても **パッと見では正解が分かりません**。
ただし選択肢は 4 つなので、本気で解析(各選択肢のハッシュを総当たり計算)すれば
判明し得ます。バー来場者への抑止策としては十分ですが、完全に防ぐにはサーバー側
採点が必要です。

## ローカル確認

```sh
cd lf-quiz
node build.mjs            # questions.src.js から js/questions.js を生成
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

※ 採点に Web Crypto を使うため、`file://` 直開きではなく `http://localhost` で確認してください。

## デプロイ

`main` ブランチのルートを GitHub Pages で公開しています。push すると自動反映されます。
