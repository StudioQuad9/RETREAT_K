// @/app/layout.jsx

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Noto_Sans_JP, Noto_Serif_JP, Ysabeau } from 'next/font/google';
import "@/styles/shared/reset.css";
import "./globals.scss";

// フォント設定
const notoSans = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  // 251014現在　Next.js v15は、『japanese』に対応してない。
  // subsets: ['latin', 'japanese'],
  display: 'swap',
  variable: "--font-gothic",
});

const notoSerif = Noto_Serif_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-mincho",
});

const ysabeau = Ysabeau({
  weight: ['200', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-title-en",
});

// meta要素の設定
export const metadata = {
  title: "This project concept here | RETREAT K",
  description: "This project description here",
};

// 開発中だとコンソールでエラーが発生する。
// コード自体は問題なし。
// どうしても開発中にこのエラーを抑え込みたい場合は、
// 以下のコードを入れる。
// => suppressHydrationWarning
export default function RootLayout({ children }) {
  return (
    <html 
      lang="ja" 
      className={`
        ${notoSans.variable}
        ${notoSerif.variable}
        ${ysabeau.variable}
      `}
      suppressHydrationWarning
    >
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};