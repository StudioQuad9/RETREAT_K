# Next.js Notes

## 概要

このプロジェクトは、`Next.js App Router` を使っている。
`App Router` では、

* `server component`
* `client component`

を分けて考える必要がある。

# 1. Server Component とは

## 趣旨

**サーバーで実行される**コンポーネント。
ブラウザに送る前に `HTML` を作る。

## 特徴

* 軽い
* 初期表示が速い
* `JS` を減らせる
* `SEO` に強い

## コンポーネント内で使えないもの

* **useState**
* **useEffect**
* **window**
* **document**
* **browser event**

## 何故か

`server` にはブラウザが無いから。

# 2. Client Component とは

## 趣旨

**ブラウザ側で動く**コンポーネント。

## 特徴

* `interaction` ができる
* `hook` が使える
* `event` が使える

## コンポーネント内で使えるもの

* **useState**
* **useEffect**
* **window**
* **document**
* **IntersectionObserver**

## 宣言

ファイルの先頭に宣言を書く必要がある。

```jsx
"use client";
```

# 3. なぜ宣言するのか

## 理由

`Next.js App Router` は **デフォルト**が `server component` だから。
つまり、何も書かなければ `server` 扱いになる。

## 何のためにあるか

『**このコンポーネントはブラウザで動かす**』と宣言するため。

# 4. 現在のプロジェクトの構造

## page.js

```jsx
import HomeClient from "@/components/layout/HomeClient/index.jsx";

export default function HomePage() {
  return <HomeClient />;
}
```

### 役割

`page.js` は、 `server component`。

### なぜserver component

* hookを持たない。
* HTMLの入口だけ
* 軽くできるから

### 何のためにあるか

`server tree` の中に `client component` を差し込んでいる。
場合によっては、`props` を渡す場合がある。

## HomeClient

### file

`@/components/layout/HomeClient/index.jsx`

### 宣言

`"use client";`

### 役割

画面の動きや `hook` を担当する。

### なぜclient

内部で `hook` を使っている：

* `useScrollAnimation`
* `useParallaxGaps`

これらは、ブラウザのAPIを使っているから。
ちなみに、ブラウザのAPIとは、
**ブラウザに対して、HTML（スクリーンで）上で表現や動きを実現させるために使わせてもらう決まった入口のこと。**
