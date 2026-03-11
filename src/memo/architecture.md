# Architecture Memo

## 現在の構造

* **app/page.js** は、Server Component
* **HomeClient** を呼び出すだけにしている
* 理由：動きの処理を **Client** 側だけに分離するため

## page.js

### 役割

ページの入り口。

### なぜ server か？

Next.js App Router は server component が標準だから。
静的HTMLを軽く返すことができる。
client では、useState, useEffect, window, 非同期処理を書く。

### 現在のコード

```jsx
// @/app/page.js

import HomeClient from "@/components/layout/HomeClient/index.jsx";

export default function HomePage() {
  return <HomeClient />;
}
```

## HomeClient

### 役割

画面表示本体。

### なぜ client か？

scroll animation と parallax hook を使うため。

### 理由

hook 内で useEffect, window, document を使うので browser 実行が必要だから。

### 現在のhooks

* useScrollAnimation
* useParallaxGaps

## useScrollAnimation

### 役割

intersectionObserver で .raveal を監視する。

### 振る舞い

* viewport に入れる。
* .is-visible で表示。
* CSS transition で表示。
  
## useParallaxGaps

### 役割

.gap-image__layer を スクロール量に応じて translate する。

### バグ対応

background-attachment: fixed の代替。
iPhone に対応させるための fixed 風表現をする。

### 現在の振る舞い

* gap-image ごとに data-speed。
* layer に translate3d を付与。

##　globals.scss

### 役割

共通レイアウト。

### 含まれている要素

* hero
* panel
* gap-image
* button
* container

### 留意点

共通のスタイリングはこのSCSSを使うこと。

## HomeClient.module.scss

### 役割

homeページ固有のスタイルを適用させるため。

### 含まれる要素

* heroInner
* h1 typography

## gap-imageのデザイン・ノート

### 現状の目的

section 間に静かな余白と視覚のリズムを作る。

### 調整のポイント

* height
* inset
* background-position
* speed

### 注意点

PCとモバイルで見え方が変わるので、メディア・クエリで調整する。

## コーディング力を上げるためのルール

AI のコードを貼ったら必ず確認する事項：
1. 何のためのコードか？
1. どこに置くべきか？
1. 消すと何が壊れるか？