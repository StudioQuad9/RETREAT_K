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
    │   ├── layout.js
    │   ├── page.js
    │   ├── page.module.scss
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
    │   │   └── sendBookingEmail.js
    │   └── utils/
    │       ├── formatDuration.js
    │       └── formatYen.js
    └── styles/
        └── shared
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
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
