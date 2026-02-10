# RETREAT K – Cultural Experience Booking Site (Prototype)

## Overview

RETREAT K is a prototype booking website for authentic cultural experiences in Kyoto, Japan.
The project is designed as a pre-platform validation site prior to listing experiences on GetYourGuide and other global travel platforms.

This site demonstrates:
* Clear experience information
* A complete booking flow
* Post-booking communication design
* A review acquisition strategy aligned with platform policies

## Purpose of This Project

Before launching on GetYourGuide, this site serves to:
* Validate demand through direct bookings
* Accumulate verifiable experience delivery records
* Establish a legitimate review flow without violating platform rules
* Present a transparent and professional operation model

This site is not a demo UI, but a working operational prototype.

## Audience

This repository is intended for:
- Internal development and operational validation
- Partner review (temples, cultural hosts)
- Platform operators evaluating experience readiness

## What This Project Is Not

- This is not a public marketplace
- This is not a general-purpose booking SaaS
- This system is operated directly by the experience organizer

## Operational Principles

- No artificial review incentives
- No overbooking by design
- Manual fallback is always available
- Payment confirmation is treated as a system-of-record
  
## Implemented Experience Programs

1. Sokan Zen Meditation & Tea
  * Schedule: Thursday, 10:00
  * Duration: 90 minutes
  * Price: ¥16,000 per person
  * Small-group guided meditation and tea experience led by a Zen monk

2. Kyogen Experience at Daihoon-ji
  * Schedule: Saturday, 15:00
  * Duration: 180 minutes
  * Price: ¥40,000 per person
  * Rare traditional Kyogen experience held at Daihoon-ji Temple

## Booking Flow

The site implements a complete booking flow:
  1.	Experience list
  1.	Experience detail page
  1.	Booking form
  1.	Booking completion page

The booking completion page is intentionally designed to:
  * Confirm the reservation clearly
  * Explain next steps (email follow-up, meeting details)
  * Introduce review requests as a future action, not an immediate demand

This approach avoids forced or artificial reviews and aligns with global platform guidelines.

## Review Policy (Important)

Reviews are not collected on this website immediately after booking.

### Instead:
* Guests are informed that a review request will be sent after the experience
* Reviews are requested only after actual participation
* Feedback is positioned as a contribution to preserving authentic cultural programs

### This ensures:
* Authenticity
* Transparency
* Compliance with GetYourGuide and Google review policies

## Technical Stack
* Framework: Next.js (App Router)
* Rendering: Server Components
* Styling: SCSS (custom variables & mixins)
* Data Structure: Static data modules (prototype phase)
* Utilities: Shared formatting utilities for duration and pricing

### The codebase prioritizes:
* Readability
* Clear separation of concerns
* Defensive data handling (no trust in user input)

## Design Philosophy
* JSX is kept minimal and readable
* Display logic is extracted into reusable utilities
* No client-side state libraries are used at this stage
* The site is intentionally simple, focusing on operational clarity

### This allows easy transition to:
* Database-backed bookings
* Payment integration
* Automated email delivery
* Platform synchronization

## Environment

This project relies on environment variables for:
- Payment processing
- Email delivery
- Database access

See `.env.example` for required values.

## Status

This repository represents a pre-launch operational system.

### Planned next steps:
* Booking confirmation email delivery
* Post-experience review request automation
* Platform listing integration (GetYourGuide)

## Disclaimer

This site is a prototype for operational validation.
Payment processing is implemented using Stripe Checkout and is operated in a controlled pre-launch environment.

## Contact

RETREAT K
Kyoto, Japan
mail: takahiro@hokuto-p.co.jp

# Others
## Site map
```
└── src/
    ├── app/
    │   ├── globals.scss
    │   ├── layout.jsx
    │   ├── page.js
    │   ├── page.module.scss
    │   ├── admin/
    │   │   ├── bookings
    │   │   │   ├── page.jsx
    │   │   │   └── page.module.scss
    │   │   └── review-test
    │   │       └── page.jsx
    │   ├── api/
    │   │   └── stripe
    │   │       └── webhook
    │   │           └── route.js
    │   ├── booking/
    │   │   ├── page.jsx
    │   │   ├── BookingForm.jsx
    │   │   └── complete/
    │   │       └── page.jsx
    │   └── experiences/
    │       ├── page.jsx
    │       │   └── page.module.scss
    │       └── [slug]/
    │           └── page.jsx
    ├── components/
    │   └── layout
    │       ├── Header
    │       │   ├── index.jsx
    │       │   └── Header.module.scss
    │       └── Footer
    │           ├── index.jsx
    │           └── Footer.module.scss
    ├── lib/
    │   ├── data
    │   │   ├── experiences.js
    │   │   └── reviews.js
    │   ├── server/
    │   │   ├── getRemainingSeats.js
    │   │   ├── getSoldOutDatesForMonth.js
    │   │   ├── saveBooking.js
    │   │   ├── sendBookingEmail.js
    │   │   ├── sendReviewEmail.js
    │   │   ├── stripe.js
    │   │   └── supabaseAdmin.js
    │   └── utils/
    │       ├── buildSchedule.js
    │       ├── formatBookingDateText.js
    │       ├── formatDuration.js
    │       ├── formatPad.js
    │       ├── formatYen.js
    │       └── toISODateString.js
    └── styles/
        └── shared
            ├── _daypicker.scss
            ├── _index.scss
            ├── _mixins.scss
            ├── _variables.scss
            └── reset.css
```

_Last updated: 2026-01-22_

---

了解。いまのあなたのアプリ（予約→Stripe決済→Webhook確定→メール→管理画面で確認）が「動き始めている」前提で、**“ちゃんと事業で使える完成”**までの道のりを、順番つきで整理して出します。
（来月に足が出てもOK＝品質寄りで進める想定で書きます）

⸻

ゴール定義（完成＝何ができればいいか）

最低限「事業開始できる完成」はこれです。

お客さん側
	1.	体験一覧 → 詳細 → 予約フォーム
	2.	日付選択、残席表示、満席日は選べない
	3.	支払い（Stripe Checkout）
	4.	支払い完了で「完了ページ」
	5.	予約確認メール（客）＋通知メール（管理者）

管理者側
	6.	予約一覧を見られる（新しい順）
	7.	予約内容（日時/人数/メール/決済ID）を確認できる
	8.	事故時に調べられるログと再送耐性（Webhook二重実行OK）

ここまでは、あなたの現状でかなり到達しています。

⸻

「ちゃんとした完成」までの道のり（推奨ロードマップ）

大きく 5フェーズに分けます。順番は「事故防止→運用→改善→拡張」です。

⸻

フェーズ1：決済・予約の“安全性”を固める（最優先）

目的：お金が絡む部分の事故をゼロに近づける

✅やること（必須）
	•	環境変数を一本化（NEXT_PUBLIC_SITE_URL）
	•	予約メール・レビューリンク・Stripe success/cancel を全部これで作る
	•	email 正規化（lowercase/trim）を統一
	•	page.jsx の既存予約チェック
	•	saveBooking.js の insert payload
	•	（Webhook metadata でも正規化）
	•	Webhookの処理条件を固定
	•	checkout.session.completed かつ payment_status === "paid" のみ確定
	•	重複（再送）耐性テストを手順化
	•	stripe events resend evt_xxx を「チェックリスト化」

✅できれば（強く推奨）
	•	予約の“重複ブロック（UI赤字）”を完成形にする
	•	既存予約チェックで止める（あなたが入れたやつを確実に）
	•	完了ページ /booking/complete は “表示専用” にする
	•	確定はWebhookだけ（今の設計が一番安全）

⸻

フェーズ2：管理画面を「本番運用できる」形にする

目的：あなた（管理者）が怖がらず運用できる

ここがあなたが言ってる
👉「requireAdmin を本番でどうするか」
👉「管理画面をどこまで作るか」
の中身です。

2-1 requireAdmin（本番での結論）

本番でのおすすめ順はこれ。

A案（最短・現実的）✅おすすめ
	•	Basic認証（ミドルウェア or hosting側）
	•	URLにtokenを付ける方式より安全・運用が楽
	•	Vercel / Cloudflare / Nginx などで実現可能
	•	Next.js側のコード変更が少ない

B案（今の仕組みを強化）
	•	ADMIN_TOKEN を URLに付けるのは “ローカル専用” にする
	•	本番は ADMIN_PASSWORD + cookie などに移行
	•	token漏洩の事故を減らす

C案（完成度MAX）
	•	Supabase Auth で管理者ログイン
	•	admin role 判定

「来月に足が出てもいい」なら、最終的には C が綺麗。
ただ、事業開始を優先するなら Aが最速で堅い。

2-2 管理画面をどこまで作るか（段階）

まずはここまででOK（MVP）
	•	予約一覧（今ある）
	•	limit切替
	•	1件の詳細（カードクリックで詳細ページ or モーダル）
	•	“コピー”ボタン（email / stripe_session_id）
	•	フィルタ（experience_slug / booking_date）

次の段階（運用が回ってから）
	•	返金済み/キャンセル済みなどの状態表示（status列が必要）
	•	CSVダウンロード
	•	お客さん検索

⸻

フェーズ3：体験（Experience）の運用設計を固める

目的：日々の更新に強い構造にする

✅必須
	•	体験データ（価格・定員・曜日）をどこで管理するか確定
	•	いま experiences.js なら、当面それでOK
	•	画像・説明文・注意事項・集合場所・キャンセルポリシーを整備

✅強く推奨（後で効く）
	•	体験ごとの「開始時刻」を持たせる（将来の24h締切に必須）
	•	多言語（最低でも英語の自然さは整える）

⸻

フェーズ4：法務・信頼（最低限）

目的：トラブル回避と信頼獲得
	•	利用規約 / 返金規定 / キャンセルポリシー（英日）
	•	特商法表示（日本で決済するならほぼ必要）
	•	プライバシーポリシー
	•	お問い合わせ導線
	•	送信メールの署名（会社情報、所在地、連絡先）

⸻

フェーズ5：公開・運用・改善

目的：公開して回しながら改善する
	•	監視：Webhook失敗時に気づける（ログ or 通知）
	•	バックアップ：Supabaseのバックアップ方針
	•	SEO：体験ページのtitle/description/OGP
	•	広告/導線：LP、SNS、予約導線短縮

⸻

今日やること（仕事が忙しい前提で“確実に前進”するタスク）

今日のゴールは「管理画面を本番へ持っていける設計にする」です。

今日のToDo（おすすめ順）
	1.	requireAdmin を “ローカル限定”にする方針決め

	•	いまの ADMIN_TOKEN + ?token= はローカル向け
	•	本番は Basic認証にするかどうか決める（僕のおすすめはBasic認証）

	2.	管理画面の最低要件を固定

	•	一覧＋詳細＋検索（email検索）までやるか？
→ 事業開始なら「一覧＋検索」までで十分

	3.	環境変数の最終セットを確定

	•	NEXT_PUBLIC_SITE_URL に統一
	•	APP_URL を消す（または両方必須にするならチェックを書く）
	•	本番の .env 相当（Vercelの環境変数）に入れる一覧を作る

⸻

すぐ確認したいこと（あなたが次に貼ると一気に進む）

今日はコードを直し始める前に、これだけ貼ってくれたら「本番設計」に落とし込みます。
	•	requireAdmin を含む admin/bookings/page.jsx の最新版
	•	デプロイ先（Vercel？別サーバ？）だけ一言

⸻

やりましょう。
まずは今日の1つ目：本番の管理画面は “Basic認証” でいく（おすすめ）／Supabase Auth まで作る（しっかり）、どっちのルートで行きたいですか？（迷うならおすすめのBasic認証ルートで、今すぐ進めます）

---

## Supabase

* Project URL
  * https://dwshcpqnzrdruqovhoep.supabase.co
* anon public
  * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3c2hjcHFuenJkcnVxb3Zob2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzUyOTQsImV4cCI6MjA4MjY1MTI5NH0.lXsRsgloE70I8baAzo6vSUJbWof4uDc-C7V1tr6GMII
* service_role

---

### テーブルを生成する

```sql
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  experience_slug text not null,
  booking_date date not null,

  guests int not null check (guests > 0),
  name text,
  email text
);
```

---

### experience_slug, booking_dateで検索するためのSQL
```sql
create index if not exists experience_slug_booking_date_idx
on public.bookings (experience_slug, booking_date);
```

* もし、`booking`テーブルに`experience_slug_booking_date_idx`という`インデックス`（検索用のオブジェクトのようなもの）がなければ、
* `experience_slug`, `booking_date`の既に存在するカラムを使って、
* `複合インデックス`（2列同時）を作れ。というSQL

---

```sql
alter table public.bookings
add constraint bookings_unique
unique (experience_slug, booking_date, email);
```

* bookingsテーブルを変更する。
* 制約名は bookings_unique。
* 体験名、予約日、Eメールアドレスのセットが重複していないこと。というSQL。

---

```sql
alter table public.bookings
add constraint bookings_guests_check check (guests > 0);
```

* bookingsテーブルを変更する。
* 制約名は bookings_guests_check。
* 予約人数は必ず 1人以上。というSQL。

---

```sql
select sum(guests) from bookings where experience_slug = ? and booking_date = ?
```

* すでに予約されている人数の合計を計算する。
* bookingテーブルから、
* 指定した体験・開催日に対して
  といSQL。

---

### 残席計算用の SQL

これで「その日その体験の予約人数合計」を Supabase側で計算できる。

```sql
create or replace function public.booked_guests(
  p_experience_slug text,
  p_booking_date date
)
returns integer
language sql
stable
as $$
  select coalesce(sum(guests), 0)::int
  from public.bookings
  where experience_slug = p_experience_slug
    and booking_date = p_booking_date;
$$;
```

---

## ということはカレンダーがヤバいか？

  ISO = International Organization for Standardization（国際標準化機構）
  ISO 8601 という日付の国際規格がある。

  代表例：
  | 形式 | 意味 |
  | ---- | ---- |
  | 2025-01-03 | 日付のみ（date） |
  | 2025-01-03T10:30:00Z | 日付＋時刻（UTC） |
  | 2025-01-03T19:30:00+09:00 | 日付＋時刻（JST） |

ということは、
**アメリカや、ヨーロッパで予約されたらヤバいことが起こる**のか？
**基礎工事が終わったら解決させる案件となる。**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## server actionについて理解する

### 結論（まず答え）

今回の構造を一言で言うと

**Server Action を親（Server Component）で定義し、**
**Client Component（BookingForm）から 呼べる形で 渡しているです。**

---

#### なぜ `checkRemainingSeats` 親コンポーネントで定義しているのか

```jsx
async function checkRemainingSeats(experienceSlug, bookingDateISO, capacity) {
  "use server";
  return await getRemainingSeats({
    experienceSlug,
    bookingDateISO,
    capacity,
  });
}
```

サーバーでのやり取りをするコンポーネントと、
Stateを使うコンポーネントではファイルを分けないといけないから。

もう一段だけ正確に言うと
* Server Component（page.jsx）
  * DB / Supabase / fs / server-only を扱える
  * "use server" な関数（Server Action）を定義できる
* Client Component（BookingForm.jsx）
  * useState, useEffect, useTransition が使える
  * ただし DB には直接触れない
  * Server Action を「関数として呼ぶ」ことはできる

👉 だから「橋渡し役」として親に関数を書く必要がある。

---

#### なぜ `use server` を「あえて」書く必要があるのか

重要ポイントです

```jsx
async function checkRemainingSeats(...) {
  "use server";
  ...
}
```

#### "use server" の意味（正確）

> この関数は、`ブラウザ`ではなく `サーバーで実行される` ことを Next.js に宣言する。

という意味です。

これを書かないとどうなるか？

* Next.js はその関数を `クライアントで実行される普通の関数` 
と解釈する。
* すると中で、以下の不具合が出てできて、
`ビルドエラー` or `実行時エラー`になる。
  * supabaseAdmin
  * server-only
  * Node API

👉 だから 「あえて必須」 なのです。

---

#### props で渡している理由（ここ重要）

```jsx
<BookingForm
  ...
  checkRemainingSeats={checkRemainingSeats}
  submitBooking={submitBooking}
/>
```

ここで起きていること（内部的）
* Client Component 側では `await checkRemainingSeats(...)` と普通の関数呼び出しのように見える。
* でも実際には：
  * Next.js が
  * 「サーバーに POST」
  * 「Server Action 実行」
  * 「結果を返す」
を 全部自動でやってくれている

👉 これが Server Actions の魔法です。

---

#### あなたの文章を「完成形」に直すなら

この関数は Client Component から呼ばれるが、
実行は必ずサーバーで行わせたいので "use server" を明示する必要がある。

---

## webhook

専門用語を全部外して、生活レベルの比喩 → 技術 → あなたの今のコードの順で説明します。

---

### まず一言で言うと Webhook とは？

「相手の側で“何かが起きたら”、向こうからこちらに“知らせに来る仕組み」
です。

あなたが「取りに行く」のではなく、
__向こうが「知らせに来る」__ のが最大の特徴です。

---

### 生活の例で説明します（超重要）

#### ❌ Webhook じゃない世界（ポーリング）

あなたが宅配を待っているとします。
* 5分おきに玄関を開けて
* 「来たかな？」
* 「まだかな？」
* 「まだかな？」

これが あなたが Stripe に毎回確認しに行く方式です。

👉 非効率・見逃し・事故りやすい。

---

#### ✅ Webhook の世界

宅配業者がこう言います。

「荷物が届いた瞬間に、こちらからインターホン鳴らします」

あなたは：
* ずっと玄関に張り付く必要なし
* 「届いた」という事実を確実に知れる

👉 これが Webhook です。

---

### 技術的に言うと（やさしめ）

Webhook とは：「**あるサービス（Stripeなど）が、イベント発生時に、あなたのサーバーのURLへHTTPリクエストを送る仕組み**」です。

つまり：
* Stripe 側で「支払いが完了した」
* その瞬間に Stripe がPOST https://あなたのURL/api/stripe/webhookという HTTPリクエストを自動で送ってくる

あなたはそれを受け取って処理するだけ。

---

### Stripe で言うと、何を「知らせてくる」の？

Stripe はこんなことを 勝手に知らせてきます。
* 支払いが開始された
* 支払いが成功した
* 支払いが失敗した
* 返金された
* セッションが期限切れになった

あなたが今使っているのは：
**checkout.session.completed** ＝「**Checkout画面での支払いが完了した**」

という Stripe公式の事実通知です。

---

### あなたの今のコードと結びつける

1. ユーザーが支払う
**予約画面 → Stripe Checkout → 支払い完了**

2. Stripe が「事実」を確定する
**Stripe 側で：「この支払いは paid になった」**

3. Stripe が Webhook を送る
**Stripe があなたに向かって：**

```
POST /api/stripe/webhook
{
  type: "checkout.session.completed",
  payment_status: "paid",
  metadata: {...}
}
```

4. あなたのサーバーが反応する
**あなたのこのコードが動く：**

```
if (event.type === "checkout.session.completed") {
  if (session.payment_status === "paid") {
    saveBooking(...)
    sendBookingEmail(...)
  }
}
```

👉 ここで初めて
* *DB保存*
* *メール送信*

が行われます。

---

### 「じゃあ完了ページだけじゃダメなの？」という疑問

完了ページだけだと起こりうる事故
* ユーザーがページを閉じる
* 通信が切れる
* 悪意のある人がURLを直接叩く

👉 「本当に払ったか？」を 100%信用できない

---

### Webhook は何が違う？

Webhook は：
* Stripeが「公式に」認めた事実
* 改ざん不可
* 再送もされる

👉 裁判でも通るレベルの事実

だから：**「予約確定はWebhookで」という設計になります。**

---

### じゃあ、なぜ stripe listen が必要だったの？

Stripe はこう言います
**「Webhookは インターネット上のURL にしか送れません」**

でもあなたの開発環境は： `http://localhost:3000`

これは あなたのPCの中だけ。

---

### stripe listen の役割

Stripe CLI がやっているのは：
```
Stripe（クラウド）
  ↓
Stripe CLI（トンネル）
  ↓
localhost:3000
```

つまり：**「StripeからのWebhookを、あなたのPCに中継する代理人」**

これが stripe listen。

---

### 本番ではどうなる？

あなたが Vercel などにデプロイしたら：
`https://your-domain.com/api/stripe/webhook`

ここは 世界中からアクセス可能。

👉 もう stripe listen は不要。

---

今のあなたの理解を一文にすると
もし誰かに説明するなら、これでOKです：
**Webhookとは「Stripe側で支払いが確定した瞬間に、Stripeがこちらに“公式通知”を送ってくる仕組み」です。**

---

---
## Getting Started

```
npx create-next-app@latest my-app
cd my-app
npm run dev
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.


ローカルでstripeの返事を待つ場所を起動。

```
[tk-mba]$ stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

---

## 電話での問い合わせをなくす（世界標準の仕様）

結論：現実的です。しかも、RETREAT K の文脈では「正しい」判断です

* 電話での問い合わせがないようにしたい
* ページを見たら全て分かるようにしたい
* 人的リソースがない／英語対応ができない

これは **弱点ではなく**、設計思想にできます。

あなたのプロジェクトは
「大量対応型」ではなく**少数・高品質・説明完結型の体験提供**です。

---

なぜ「問い合わせゼロ設計」は可能か

### ① そもそも対象顧客が違う

あなたが想定している顧客は：
* 価格に納得している
* 体験の文脈（文化・宗教・所作）を尊重する
* 説明文を読むリテラシーがある

👉 **「電話で聞きたい人」は、最初から対象外（これはGetYourGuideの上位体験と同じです）**

⸻

### ② 世界の体験予約サイトは、基本「問い合わせ前提」ではない

実例：
* GetYourGuide
* Airbnb Experiences
* Klook

すべて共通点があります：

* 電話番号が前面に出ない
* Q&A / 説明文 / キャンセル規定で完結
* どうしても必要な場合だけメール

👉 **電話前提の体験サイトは、むしろ古い**

---

### ③ 「電話が来ない設計」は作れる（しかも今すぐ）

これは技術ではなく 情報設計 です。

#### －　では何を書けば「問い合わせ不要」になるか

最低限、以下がページに「明確に」書いてあればOKです

#### ① Who this experience is for / not for（向いている人・向いていない人）

例：
* English-only guidance
* Not suitable for children under 12
* Requires ability to sit quietly for 60 minutes

👉 **これが書いてないと、質問が来ます**

---

#### ② 当日の流れ（Minuteレベルで）

例：
* 09:50 Meet at the temple gate
* 10:00 Opening explanation
* 10:15 Meditation
* 11:00 Tea experience
* 11:30 End

👉 **「何をするのか」が分からないと質問が来る**

---

#### ③ 服装・持ち物・注意点

例：
* Dress code
* Shoes
* Photography rules
* Religious etiquette

👉 **ここが曖昧だと、必ず問い合わせが来ます**

---

#### ④ キャンセル・返金ポリシー（明文化）
* 何日前まで無料か
* 当日キャンセルはどうなるか
* 最少催行人数未達時はどうなるか

👉 **ここを曖昧にすると、トラブルになります**

---

### 「問い合わせが来ない」設計の核心

🔑 重要なのはこれです

    問い合わせ先を消すことではない
    問い合わせする理由を消すこと

---

## 結論

**「完全英語のみ・英語が読める人だけ対象」は、RETREAT K にとって最も安全で現実的な運営方針です。**

これは
* **逃げ**
* **妥協**
* **簡略化**

ではなく、**戦略的な制限**です。

---

## なぜあなたのリスクが下がるのか（重要）

### ① トラブルの9割は「言語のズレ」から起きる

体験ビジネスで起きる問題の多くは：
* 説明を読んでいない
* 理解したつもりだった
* ニュアンスが伝わっていない
* 日本的な前提が通じていない

👉 **英語が読める人だけに限定すると、これが激減します**

---

### ② 電話・即時対応を「設計上」不要にできる

英語オンリーにすると、次が成立します：
* 問い合わせは原則しない
* 書いてあることが全て
* 書いていないことは提供しない

これは冷たくありません。**海外の高単価体験では標準**です。

---

### ③ 法的・運営的な防御になる

明示的に：

    This experience is conducted in English only.
    Please ensure you are comfortable reading and understanding English before booking.

と書いておくことで：
* 誤解によるクレーム
* 「聞いていない」
* 「分からなかった」

を**事前に排除**できます。

---

### これは「切り捨て」ではなく重要な視点

あなたが切っているのは「顧客」ではなく

#### 👉 「運営コスト」と「不確実性」
* 英語が読めない人は「悪い客」ではない
* ただし この体験には向いていない

それだけです。

---

### GetYourGuide との相性も良い

GetYourGuide / Airbnb Experiences の上位体験は：
* 英語オンリーが多い
* 少人数・高価格
* 説明が異常に丁寧
* 電話番号が出てこない

👉 **あなたは今、完全に同じ設計思想に立っています**

---

### サイト上で「必ず明示すべき一文」

これは Experience Detail Page の最上部 or Booking直前に入れます。

例（強くおすすめ）

    Language
    This experience is conducted entirely in English.
    All instructions, explanations, and communications are provided in English only.

さらに一段強くするなら：

    Please note:
    This experience is suitable only for guests who are comfortable reading and understanding English.

これで 運営上の責任線が明確になります。

---

### あなたにとっての心理的メリット（重要）

正直な話をします。
* 英語対応を「頑張らなければならない」と思わなくていい
* 電話が鳴る恐怖がなくなる
* 「説明できなかったらどうしよう」という不安が消える

👉 **これは事業を続ける上で、ものすごく大きい**

---

# 規約を決める

概要
体験内容
参加対象者
参加に適さない方
スケジュール・所要時間
集合場所
料金・含まれるもの
持ち物
アクセシビリティ・健康上の注意
キャンセル・変更について
よくある質問

# Sokan Zen Meditation & Tea

## At a glance
**（概要）**


- Location: Kyoto (Sokan)
- Day/Time: Thursday 10:00
- Duration: 90 minutes
- Group size: Up to [X] guests
- Price: ¥16,000 / person
- Language: English only
- Booking: Online only (no phone support)

## What you’ll do
**（体験内容）**

- [ ] Short introduction
- [ ] Guided Zen meditation
- [ ] Tea session
- [ ] Q&A (time permitting)

## Who it’s for
**（参加対象者）**

- [ ] First-time visitors to Zen/meditation
- [ ] Guests who want a calm cultural experience

## Who it’s not for
**（参加に適さない方）**

- [ ] Guests expecting a sightseeing tour
- [ ] Guests who need interpretation in Japanese
- [ ] Guests who cannot sit quietly for short periods

## Schedule & duration
**（スケジュール・所要時間）**

- Start: 10:00
- End: ~11:30
- Notes: Please arrive 10 minutes early.

## Meeting point
**（集合場所）**

- Address: [exact address]
- Map link: [URL]
- How to enter: [simple instruction]
- Contact on the day: [optional — if none, say “Email only”]

## Price & what’s included
**（料金・含まれるもの）**

Included:
- [ ] Guided session
- [ ] Tea

Not included:
- [ ] Transportation

## What to bring
**（持ち物）**

- [ ] Comfortable clothing
- [ ] Socks (if needed)
- [ ] Please avoid strong perfume

## Accessibility & health notes
**（アクセシビリティ・健康上の注意）**

- Seating style: [chair / floor / both]
- Mobility: [stairs?]
- Health: If you have concerns, contact us by email before booking.

## Cancellation & changes
**（キャンセル・変更について）**

- Cancellation policy: [your policy]
- Changes: [your policy]
- Weather: [what happens]

## FAQ
**（よくある質問）**

Q. Can beginners join?
A. Yes.

Q. Can I take photos?
A. [rule]

Q. Is it private?
A. [private / small group]

## レビュー依頼を送る

```
http://localhost:3000/admin/review-token?bookingId=ここにトークンを入れる
```

http://localhost:3000/admin/review-token?bookingId=3f4f2595-d1f1-4603-88cc-256266aa474c


http://localhost:3000/admin/review-token?bookingId=ffdcb0a0-68b0-4e8e-89db-339b26e5d76a


http://localhost:3000/admin/review-token?bookingId=182d047b-1c22-42ea-9746-0efff79d1a72


http://localhost:3000/admin/review-token?bookingId=d76d7c93-57fd-4220-b2c4-441cafbf3736


http://localhost:3000/admin/review-token?bookingId=36a92e12-7ee1-4bcb-830b-2dd8e4c110bb


http://localhost:3000/admin/review-token?bookingId=ae8b47d9-6b18-480c-9654-17c6d0c28d08

http://localhost:3000/admin/review-token?bookingId=ae8b47d9-6b18-480c-9654-17c6d0c28d08

http://localhost:3000/admin/review-token?bookingId=2cd42032-d0fc-4e33-8a7c-dede3ee71c83


http://localhost:3000/admin/review-token?bookingId=c4f229f0-03d8-4d27-9bb4-8f99906aa88c


http://localhost:3000/admin/review-token?bookingId=2cd42032-d0fc-4e33-8a7c-dede3ee71c83


http://localhost:3000/admin/review-token?bookingId=22189500-4d87-4a88-9f7d-7a33d9c166f6

http://localhost:3000/admin/review-token?bookingId=8560c5d8-e374-43d7-8c9e-62c62c4e5014

http://localhost:3000/admin/review-token?bookingId=59dbc5fb-075b-4023-a90d-d2bc24c319f4