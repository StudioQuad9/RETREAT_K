## 今日の最終に戻るべきターン

了解です。ここからは 「Stripeを事故らせない最小実装」= Stripe Checkout（ホスト決済画面）で、支払いの正当性をサーバーで検証してから予約を “確定” する 方向がいちばん安全です。

理由：フロント側でカード情報を触らない（PCI/実装ミスの地雷が激減）＋支払い結果を Stripe側の事実 で判定できるからです（改ざん耐性）。StripeもまずCheckout Sessionを推してます。 ￼

⸻

今やるべき「最小・安全」な設計（MVP）

結論（おすすめの順序）
	1.	残席チェック（今のまま）
	2.	（DBに）仮予約を作る status="pending"（この時点で席を確保する）
	3.	Stripe Checkout Sessionを作成して redirect
	4.	決済完了の事実をサーバーで確認（Webhookが理想 / まずは success ページでセッション照合でも可）
	5.	予約を“確定” status="paid" にして、確認メール送信（ここで一度だけ）

これで「支払ったのに予約が無い」「予約はあるのに払ってない」「決済中に売り切れて揉める」を避けやすいです。

⸻

24時間前の締切・最少催行未達・キャンセルはどうする？

あなたが気づいた通り、ここは本来重要です。ただ、いきなり100%自動化はコストが跳ねます。

なので段階案：

フェーズ1（今）
	•	「予約=確定」（決済も同時）
	•	キャンセル/最少催行未達は 運用で返金（Stripeダッシュボードで返金、または簡単な管理画面から返金）
	•	24時間前締切は UI + サーバーの両方でブロック（“日付”だけの今のモデルだと時間が無いので、まずは「前日になったら予約不可」のような粗いルールでもOK）

フェーズ2（商品が回り出してから）
	•	体験に 開始時刻 を持たせる（例：10:00 / 15:00）
	•	締切=開始24h前 を厳密化
	•	最少催行未達を自動通知＆自動返金（Webhook + 定期バッチ/cron）

いまはフェーズ1で十分です。ここで背伸びすると開発が止まります。

⸻

Stripe 最小実装で増やすファイル（これが「事故らせない」型）

Stripe公式の「Checkout Session作成」フローはこれです： ￼
Webhook署名検証もStripeの手順に沿います： ￼

追加する（または新規作成する）候補ファイル
	•	src/lib/server/stripe.js（Stripe初期化：secret keyを読む）
	•	src/app/api/stripe/checkout/route.js（Checkout Session作成）
	•	src/app/api/stripe/webhook/route.js（決済完了イベントを受けて予約確定）※最終的にここが本命
	•	予約テーブル（Supabase）の列追加（最小で）
	•	status（pending/paid/cancelled）
	•	stripe_session_id
	•	amount_total（任意）

⸻

まず、あなたの現状コードに合わせて「どこを差分にするか」

あなたのBookingは今こうです：
	•	submitBooking が 保存 → メール → redirect まで全部やってる
	•	ここにStripeを入れるなら、最低限 保存と確定を分ける 必要があります

最小差分の方針
	•	submitBooking の役割を「仮予約作成 → Checkoutへ飛ばす」に変更
	•	決済完了は（最初は）/booking/complete で session_id をサーバーで照合して 確定
（あとでWebhookに移行するとさらに堅牢）

⸻

次にあなたから欲しいファイル（差分パッチを“正確に”出すため）

いまのツリーだと、Stripeを差し込む“芯”はここです。これを貼ってください（コピペでOK）：
	1.	src/lib/server/saveBooking.js（予約保存の中身。status列をどう扱うか決めるため）
	2.	src/app/booking/complete/page.jsx（ここで決済完了の照合→確定の場所にするのが最短）
	3.	Supabase bookings テーブル定義（列一覧だけでOK：booking_date 型も確認したい）

この3つが揃ったら、**「あなたの現状コードに完全追従した差分パッチ」**で出します。
（今の page.jsx と BookingForm.jsx はすでに十分あります）

⸻

先に決め打ちで言う「MVPのルール」（迷わないための仕様）
	•	予約画面のボタン文言：Proceed to payment
	•	成功後：Booking complete (Paid)
	•	失敗/キャンセル：Payment canceled. Your booking was not completed.
	•	予約確定の定義：Stripeで paid が確認できたら確定

⸻

必要ファイルのうち、まず saveBooking.js を貼ってください。
貼ってくれた瞬間に、その内容に合わせて「最小・安全Stripe Checkout」の差分パッチを出します。

---


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
    │   │   ├── BookingForm.jsx
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
    │   │   ├── getSoldOutDatesForMonth.js
    │   │   ├── saveBooking.js
    │   │   ├── sendBookingEmail.js
    │   │   ├── sendReviewEmail.js
    │   │   └── supabaseAdmin.js
    │   └── utils/
    │       ├── buildSchedule.js
    │       ├── formatBookingDateText.js
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

260103からやること

全体を見たとき、いちばん筋が良くて事故が少ない進め方はこれです。

⸻

進め方（推奨順）

① UIの残席表示を「完成形」にする（あなたのメモの②をまず完了）

理由：ユーザー事故（満席予約・勘違い）を最速で減らせる。UXの安心感も一気に上がる。

やることは3つだけに絞る：
	1.	日付クリックで 「残席: X / 定員: C」 を表示
	2.	満席（remainingCount === 0）なら
	•	その日を選択不可（クリックできない）にする
	3.	「残席確認中」「確認失敗」を表示

※ここで “人数変更時の再計算” はまだ必須じゃない。まず日付単位でOK。

⸻

② 「満席日は選択不可」を“確実に”する（UIだけでなく、データでも）

理由：UIで塞いでも、別タブ・別端末・同時アクセスでズレるので、最後はサーバーで止める必要がある。

すでにあなたは submitBooking 側で
	•	残席チェック
	•	保存（unique含む）
をしているので土台は良い。

ここでやるのは1点だけ：
	•	保存前の残席チェック → 保存 →（成功したら）メール
という順番を維持しつつ、
残席不足なら保存しない（もう出来てる）

この段階では「取り合い対策（同時アクセス）」はまだ次でOK。

⸻

③ “人数変更で再計算” を追加（設計の選択ではなく、実質必須に近い）

理由：今のUIは「日付を選んだ瞬間の残席」を出している。
でもユーザーが人数を 1→6 に変えたら、その場で不足が分かる方が事故が減る。

ここは実装は軽いです：
	•	selectedDate と guests が変わったら再取得
	•	remainingCount < guests なら赤で警告＋ボタン無効

⸻

④ 文言（クレーム予防）を、UIに組み込む（あなたのメモ④）

理由：予約体験のクレームはUIの説明不足で起きます。
ここは後回しにすると、あとで全部書き直しになります。

最小限入れるべき場所は3つ：
	1.	予約フォーム直下（送信前）
	2.	予約完了ページ
	3.	メール本文

特に重要：
	•	「最少催行人数 = あなたの人数ではない」
	•	「予約が確定か／催行判断が後か」
	•	キャンセル規定・遅刻規定（ここは短くても必須）

⸻

⑤ 同時アクセスの“取り合い”対策（RPC / トランザクション）で堅牢化

理由：ここまでで 通常運用は十分。
本当に必要になったら強化するのがコスパ良い。

やるなら：
	•	RPCで「残席確認＋insert」を一発でやる（原子的にする）
	•	もしくは bookings に対して日付・体験単位で集計を安全に扱う

⸻

今日の指示（あなたに今すぐやってほしい順）
	1.	②のUI完成：
	•	「残席: X / 定員: C」表示
	•	満席日は選択不可（クリックもできない）
	2.	次に ③：人数変更でも再計算して、足りなければ送信不可
	3.	仕上げに ④文言（フォーム・完了ページ・メールで統一）

⸻

ここから先、私が差分で出すなら

あなたの現状コード（BookingForm / page.jsx / getRemainingSeats）が揃っているので、
	•	満席日の disabled を “実際にDayPickerに反映する”差分
	•	人数変更で再取得する差分
	•	表示文言を追加する差分

この3つを、あなたのファイル構成のままパッチで出せます。

次はどれから出します？
指示どおり進めるなら 「満席日は選択不可（DayPicker disabled に反映）」の差分 を先に出します。

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
