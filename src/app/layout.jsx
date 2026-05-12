// @/app/layout.jsx

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Noto_Sans_JP, Noto_Serif_JP, Cormorant_Garamond, Crimson_Text, Zen_Old_Mincho, Roboto } from 'next/font/google';
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

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-title-en",
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-en",
});

const roboto = Roboto({
  weight: ["100", "400", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-en-gothic",
});

const zenOldMincho = Zen_Old_Mincho({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-tegomin",
});

// meta要素の設定
export const metadata = {
  title: "Private Cultural Experiences in Kyoto | Awai Studio",
  description: "Awai Studio offers private cultural experiences in Kyoto for travelers seeking quiet, depth, and a more thoughtful encounter with Japanese culture.",
};

// 開発中だとコンソールでエラーが発生する。
// コード自体は問題なし。
// どうしても開発中にこのエラーを抑え込みたい場合は、
// 以下のコードを入れる。
// => suppressHydrationWarning
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${notoSans.variable}
        ${notoSerif.variable}
        ${cormorantGaramond.variable}
        ${crimsonText.variable}
        ${roboto.variable}
        ${zenOldMincho.variable}
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