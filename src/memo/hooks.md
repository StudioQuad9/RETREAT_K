# Hooks Memo

## 概要

このプロジェクトでは、画面の見た目の動きに関する処理を hook に分けている。

理由：
* JSX を読みやすくする。
* 動きの処理をまとめる。
* 将来、Retreat K や 英語版でも使い回せるようにする。

現在、使っている hooks は次の2つ。

* **useScrollAnimation**
* **useParallaxGaps**

# useScrollAnimation

## ファイルの在処

`@/hooks/useScrollAnimation.js`

## 役割

画面に入った要素へ **is-visible** を付与して、CSS の transition で表示アニメーションを発火させる。

## ターゲット要素

* 親：`.panel`
* 子：`.reveal` （表す）

## どうやって動いているか

1. `parentSelector` で親要素を取得する。
2. その中から `childSelector` の要素を取得する。
3. `IntersectionObserver` で監視する。
4. 要素が veiwport に入ったら `.is-visible` を付ける。
5. CSS 側の `.reveal.is-visible` が効いて表示される。

## なぜhookを分けて書くのか

`IntersectionObserver` の処理を page や component の中で直接書くと長くなってしまい見通しが悪くなるから。

## なぜ client なのか

内部で、`useEffect`, `window`, `document`, `IntersectionObserver` を使うので `browser` でしか動かない。
そのために `HomeClient` から呼ぶ。

## 効果のオプション

* **parentSelector**
  * どの範囲の要素を監視するか？
    * 現在は、`.panel`
* **childSelector**
  * 何に `reveal` 効果をかけるか？
    * 現在は、`.reveal`
* **threshold**
  * 要素がどれだけ見えたら反応するか？
    * 現在は、`0.15`
* **rootMargin**
  * どのタイミングで少し早め／遅めに発火するか？
    * 現在は、`"0px 0px -8% 0px"`
* **once**
  * ページが読み込まれてから一度だけ表示するか？
    * 現在は、`true`
* **current meaning**
  * 現在の設定では、panel要素の中にある `.reveal` 要素が、画面下から少し入ってきた時に、一度だけ表示される。
* CSSから見ると
  * 見た目は `_motion.scss` 側で側で定義している。
  * 対応する CSS：
    * `.reveal`
    * `.reveal.is-visible`
    * `.data-dir`
    * `.data-delay`
    * `.data-effect`

## もしhookを消すとどうなるか

この `hook` を消すと、
* `.reveal` がずっと `opacity: 0` のままになる。
* 要素が表示されない。

## 注意点

* `childSelector` に　`.reveal` をつけ忘れると動かない。
* `HomeClient` から呼ばないと `server/client` のエラーになる。

# useParallexGaps

## ファイルの在処

`@/hooks/useparallaxGaps.js`

## 役割

`.gap-image__layer` を scroll に応じて少しだけ動かし、fixed 背景に似せる。

## なぜこれが必要なのか

`background-attachment: fixed;` は iPhone ではバグになる。
代替手段として、`transform: translate3d(...)` で擬似的に parallax に見せている。

## ターゲットとなる要素

* 対象要素：`.gap-image`
* 実際に動かす要素： `.gap-image__layer`

## どうやって動いているか

1. `.gap-image` を全部取得する。
2. 各 `gap` の中の `.gap-image__layer` を取得する。
3. `scroll` 時に `getBoundingClientReact()` で位置を取得する。
4. `react.top` と `data-speed` を使って移動量を計算する。
5. `translate3d()` を　layer　に書き込む。

## なぜ hook を使うのか

`gap-image` ごとの `parallax` 処理を `page/component` から切り離したいから。

## なぜ client なのか

内部で `useEffect`, `window`, `document`, `getBoundingClientReact()` を使うため。

## 現状の構文

現状では、`scroll` 量に応じて `layer` を少しだけ動かしている。

考え方は：
* `gap` 自体はその場にある。
* 背景 `layer` だけ少し遅れて動く。
* その結果、`fixed` に近い印象に見える。

## data-speed

`gap-image` ごとに速度を変えられる。

例：

```jsx
<div className="gap-image" data-speed="0.25">
```

## 意味

* 値が大きい => よく動く
* 値が小さい　=> fixed に近い

## 対応するCSSについて

見た目は `__motion.scss` に記述している。

### 対応するCSS：
* `.gap-image`
* `.gap-image__layer`

### 重要な点：
* `overflow: hidden;`
* `inset`
* `background-image: var(--panel-bg);`
* `transform: translate3d(0, 0, 0);`

## もし取り去ると

この hook を取り去ると、

* `gap-image` はただの静止画になる。
* `parallax 風`の動きがなくなる。

## 注意点

* `inset` が足りないと `hero` 動画が隙間から見えてしまう。
* `PC` と `モバイル` で見え方がかなり変わる。
* `speed` を上げすぎると `fixed` ではなく流れて見える。
* `background-image: var(--panel-bg)` が無いと画像が出ない。

# なぜHomeClient.js　は　両方のhookを呼ぶのか

## 現在の構造

* `app/page.js` は `server component`。
* `HomeClient` は `client component`。
* `hook` は `HomeClient` で呼ぶ。

## 理由

動きの処理は `browser側` でしか動かないので、`server compoennt` から直接呼ばないため。

## その恩恵として

* `page.js` は軽い。
* 動きだけを `client` に限定できる。
* 今後英語版や `Retreat K` に流用しやすい。

## 理解を深めるためにメモする

* `useScrollAnimation`
  * 「見えたら出す `hook`」
* `useParallaxGaps`
  * 「隙間背景を `fixed` 的に見せる `hook`」

## コーディング力を上げるためのルール

hook を触る時は必ず確認する：
1.	どの `selector` を見ているか
1.	どの `class` を付けたり `transform` を書いたりしているか
1.	対応する `CSS` はどれか
1.	消したら何が止まるか