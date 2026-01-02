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

## Status

This repository represents a working pre-launch system.

### Planned next steps:
* Booking confirmation email delivery
* Post-experience review request automation
* Platform listing integration (GetYourGuide)

## Disclaimer

This site is a prototype for operational validation.
It does not process payments at this stage and does not represent a public marketplace.

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
    │   │   └── review-test
    │   │       └── page.jsx
    │   ├── booking/
    │   │   ├── page.jsx
    │   │   └── complete/
    │   │       └── page.jsx
    │   └── experiences/
    │       ├── page.jsx
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
    │   │   ├── saveBooking.js
    │   │   ├── sendBookingEmail.js
    │   │   ├── sendReviewEmail.js
    │   │   └── supabaseAdmin.js
    │   └── utils/
    │       ├── buildSchedule.js
    │       ├── formatDuration.js
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

## 進捗

### 今どこまで出来ているか（到達済み）

あなたの現在の実装（提示されたコード）から、到達済みはこれです。

#### 予約フロー（最低限の要件）
* 体験詳細 → 予約ページ → 予約完了ページ（/booking/complete）まで動線が完成
* guests は state管理され、合計金額が動的に変わる（P2達成）
* カレンダーで日付を選び、hidden input name="date"で Server Action に渡す（P3の入口達成）
* 体験ごとの開催曜日（木のみ / 土のみ）に応じて、選択できる曜日を制御できている（超重要達成）

#### 予約の永続化（DB）
* Supabase bookings テーブルに保存できる
* unique (experience_slug, booking_date, email) 制約が効いている
* getRemainingSeats による残席チェックが入り、足りなければ弾ける（P4の土台）

#### メール
* Resend で顧客宛・管理者宛の通知が送れる（あなたが「メールできました」と確認済み）
* メール本文に予約日（date）も入れるところまで完了（あなたが「1です」で進めた箇所）

#### UI（重大ポイント）
* useActionState で
* 重複予約（unique違反）
* 残席不足
* 成功時redirect
をUIとして破綻しない形で出し分けできている（あなたが「3つ試した。全て意図通り」と確認済み）

---

### いま “最低限の完成形” として目標にすべき状態（MVP）

「GYG審査や実運用で事故らない最低限」を、明確にするとこうです。

#### 	1.	体験ごとに予約可能日を正しく出す
* 曜日制御（済）
* さらに “開催日生成”（例：今後90日分）を入れて「開催しない週は出さない」までやるのが理想
  
#### 	2.	残席が UI 上で見える
* 日付をクリックしたら「残席: 〇 / 定員: 〇」を表示（未）
* 満席日は選択不可にする（未）
  
#### 	3.	予約の保存と整合性が壊れない
* n残席チェック → 保存 → メール、の順序と競合対策（今はかなり良い所まで来てる）
* n同時アクセスの“取り合い”対策は次の段階（RPCやトランザクションで強化）
  
#### 	4.	文言（クレーム予防）
* 「最少催行人数」＝“あなたの予約人数”ではない、を明記（あなたの設計思想と一致）
* “予約はリクエストではなく確定か？” など、誤解が出ない文言整備（未）

---

### 次にやる順番（いまの実装を前提にした最新版）

あなたが言っていた「1→4で進める」の“今版”です。最短で成果が見える順で。

#### A. 予約日を確定したら「その日の残席」を即表示（超重要）
* BookingFormで日付を選択した瞬間に残席を取得して表示する
* 残席 0 の日付は 選択不可にする

ここができると「予約の安心感」と「事故防止」が一気に上がります。

#### B. 「開催日生成」を入れる（experienceごとに）
* 今は「曜日だけ」なので、極端に言えば未来永劫木曜が全部出ます
* 実務では「この寺はこの週は不可」等が必ず出るので、
* まずは簡易でもいいから
  * 直近90日分の開催候補日を生成
  * その配列だけを enabledDays として表示に寄せるのが良いです

#### C. 同時予約の取り合い（競合）への対策（P4の本丸）
* いまは「事前にremaining計算 → insert」なので、同時クリックでズレる可能性が残ります
* 最終的には Supabase 側で
  * RPC（関数）で「残席計算＋insert」を1回で行うへ寄せるのが安全です

#### D. 最小催行人数（minGuests）の扱い（仕様として明文化）
* 「予約は1人からOK、ただし最少催行に満たない場合は…」の運用ルールを文章化し、UIとメールにも入れる
* ここはコードよりも文言設計が重要（クレーム予防）

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
