# Styleing Memo

## 概要

このプロジェクトでは、スタイルを次の3層で分けている。

1. `global.scss`
2. `*.modules.scss`
3. `styles/shared/_*.scss`

目的は、『設計の土台』『ページ専用』『共通』として、後で見直しても理解しやすくすること。

# 1. global.scss

## 役割

サイト全体で共通して使うスタイルを書く場所。

##　現在の使用状況

* `html`, `body`
* `hero`
* `panel`
* `container`
* `btn`
* `ctaRow`
* `gap-image`
* `a`, `h1`, `h2`, `h3`, `p`
* `focus ring`
* `smooth scroll`

## 共通部品

ページをまたいでも同じ意味で使うものはここに置く。

## 例

* `.panel`
* `.btn`
* `.hero`
* `.gap-image`

## なぜここに置くか

これらは、`Quiet Kyoto Studio` だけでなく、将来の英語版や `Retreat K` でも似た役割で使う可能性が高いから。

## 判断基準

『他のページでも再利用しそうなスタイル』は `global` に置く。

## 注意点

`globals` にページ固有のスタイルを書きすぎると、後でどのページに効いているか分かりにくくなる。

# 2. module.scss

## 役割

そのページ、そのコンポーネントだけで使うスタイルを書く場所。

## 現在の使用状況

* `HomeClient.module.scss`
* `heroInner`
* `hero` 内の `h1` のスタイル
* 該当ページだけの余白や文字組

## なぜここに書くか

ページ固有のスタイルを `global` に混ぜると保守が煩雑になるので、ここにスタイルを閉じ込める。

## 例

```scss
.heroInner {
  justify-content: space-between;
  padding: 75% 0 3rem;
}
```

## 判断基準

『このページ、コンポーネントにしか意味が無いもの』は、`module` に置く。

## 注意点

共通化できるものを `module` に置きすぎると、同じCSSを別ページで繰り返すことになる。

# 3. styles/shared/_*.scss

## 役割

`SCSS` の設計部品を置く場所。

## 現状のファイル

* `_index.scss`
* `_variables.scss`
* `_mixins.scss`
* `_motion.scss`

## なぜここに書くか

CSSそのものというより『共通で使うルール』『設計の材料』をまとめる場所。

## _variables.scss

### 役割

色、サイズ、行間、フォントなどの定数をまとまる。

### 例

* `$color-black`
* `$fs-lg1`
* `lh-tight`

### 必要性

デザインの一貫性を保つため。と一度の修正で全体に効かせることができる。

## _mixins.scss

### 役割

繰り返し使う `SCSS` ロジックを書く。`SCSS` の関数集。

### 例

* `mq()`
* `content-width`

### 必要性

同じメディアクエリや幅指定を何度も書かないため。

## _motion.scss

### 役割

動きに関する共通スタイルを書く。

### 現状の使用例

* `.reveal`
* `.reveal.is-visible`
* `[data-dir]`
* `[data-delay]`
* `[data-effect="zoom"]`
* `.gap-image`
* `.gap-image__layer`

### 必要性

`Hook` が付ける `class` や `transform` と対応するスタイルをここで定義する。
動きは `Quiet Kyoto Studio` だけでなく、 `英語版` や `Retreat K` にも流用できるから。

### 注意点

`hook側` と `SCSS側` がセットなので、片方だけを変更すると動かなくなる。

# 4. 現在のスタイリング構造

## 主要クラスの意味

### .hero

固定背景の動画領域。ページ全体の最背面。

### .panel

本文セクションのベース。`.hero` の上に被さるようにスクロールする。

### .container

ページやセクションの横幅を揃えるための箱。

### .gap-image

`section` 要素間の背景演出用領域。


### .gap-image__layer

実際に `parallax風` に動かす背景レイヤー。

### .btn

共通のボタン。

### .ctaRow

ボタンの並びを調整するための行。

### .reveal

出現アニメーションの対象。

# 5. スタイリング時の判断基準

| 機能 | ファイル名 |
| ---- | ---- |
| 共通クラス | `global.scss` |
| ページ固有 | `HomeClient.module.scss` |
| 変数・mixin | shared ディレクトリ内<br />`_variable.scss`, `_mixins.scss` |
| 動きのロジック | `hook` と `_motion.scss` |

# 6. 動きが故障した際

| ケース | ファイル名 |
| ---- | ---- |
| ヒーロー | `@/global.scss` |
| スクロール・アニメーション | `@/hooks/useScrollAnimation.js`<br />`_motion.scss` |
| 背景のパララックス | `@/hooks/useParallaxGaps.js`<br />`_motion.scss` |
| ページ固有 | `*.module.scss` |

# 7. 新しくスタイル記述を始める時

新しいスタイルを書く前に確認する：

  1. これは他のページでも使うか？
  2. これはこのページだけのものか？
  3. 動きにスタイルか？　構造のスタイルか？
  4. `hook` と連動するクラスか？
