// @/components/layout/HomeClient/index.jsx

"use client";

import styles from "./HomeClient.module.scss";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import useParallaxGaps from "@/hooks/useParallaxGaps";
import Link from "next/link";


export default function HomeClient() {
  useScrollAnimation({
    parentSelector: ".panel",
    childSelector: ".reveal",
    threshold: 0.15,
    rootMargin: "0px 0px -8px 0px",
    once: true,
  });

  useParallaxGaps(".gap-image");

  return (
    <main>
      {/* HERO */}
      <div className="hero">
        {/* VIDEO */}
        <div className="hero__video">
          <video autoPlay muted loop playsInline>
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={`hero__inner ${styles.heroInner}`}>
          <h1 className="reveal is-visible">
            京の文化と時間を、
            <br />
            映像とWEBで静かに記録する。
          </h1>

          <div
            className="ctaRow reveal is-visible"
            data-effect="zoom"
            data-delay="1"
          >
            <a href="#about" className="btn btn--primary">
              活動について
            </a>
            <a href="mailto:takahiro@hokuto-p.co.jp" className="btn btn--ghost">
              お問い合わせ
            </a>
          </div>
        </div>
      </div>

      <div id="top-panel" className="panel">
        <div className="container">
          {/* ABOUT */}
          <section id="about" className={styles.section}>
            <h2 className="reveal" data-dir="bottom">
              About
            </h2>

            <p className="reveal" data-dir="bottom" data-delay="1">
              京都を拠点に、寺社仏閣や庭園などの文化空間を記録しています。
              写真・動画・WEB、そして手に取る授与品の企画から生産まで。
              多様な媒体を通して、場所や人が持つ空気感と、その背景にある時間や思想を
              丁寧に伝えることを大切にしています。
            </p>
          </section>
        </div>
      </div>

      <div className="gap-image" data-speed="0.25">
        <div
          className="gap-image__layer"
          style={{ "--panel-bg": "url(/images/sample1.jpg)" }}
        />
      </div>

      <div className="panel">
        <div className="container">
          {/* WORK */}
          <section className="reveal-group">
            <h2 className="reveal" data-dir="bottom">
              Work
            </h2>
            <div className="wrapper web-product">
              <h3 className="reveal" data-dir="left">
                WEB制作
              </h3>

              <p className="reveal" data-dir="bottom">
                寺社・文化施設のWEB制作を中心に構築。
                情報整理から設計、撮影、公開まで一貫して対応しています。
              </p>

              <ul className={styles.workSamples} data-dir="left">
                <li className={`reveal ${styles.mySample}`} data-dir="bottom" data-delay="1">
                  <Link href="https://shiraminejingu.or.jp/" target="_blank">
                    <div
                      className={`${styles.workName} reveal`}
                      data-dir="left"
                    >
                      白峯神宮様（京都市）
                    </div>
                    <div className="image-wrapper square page-sample grad-mask-to-bottom">
                      <img
                        src="/images/img_work_shiramine.png"
                        alt="白峯神宮のHPのスクリーンショット"
                      />
                    </div>
                  </Link>
                </li>
                <li className={`reveal ${styles.mySample}`} data-dir="bottom" data-delay="2">
                  <Link href="https://daihoonji.jp/" target="_blank">
                    <div
                      className={`${styles.workName} reveal`}
                      data-dir="left"
                    >
                      大報恩寺様（京都市）
                    </div>
                    <div className="image-wrapper square page-sample grad-mask-to-bottom">
                      <img
                        src="/images/img_work_daihouonji.png"
                        alt="大報恩寺のHPのスクリーンショット"
                      />
                    </div>
                  </Link>
                </li>
                <li className={`reveal ${styles.mySample}`} data-dir="bottom" data-delay="3">
                  <Link href="https://hokkeji.jp/" target="_blank">
                    <div
                      className={`${styles.workName} reveal`}
                      data-dir="left"
                    >
                      法華寺様（向日市）
                    </div>
                    <div className="image-wrapper square page-sample grad-mask-to-bottom">
                      <img
                        src="/images/img_work_hokkeji.png"
                        alt="法華寺のHPのスクリーンショット"
                      />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="wrapper photo-video-product">
              <h3 className="reveal" data-dir="left">
                Photo / Video
              </h3>

              <p className="reveal" data-dir="bottom">
                京都の寺院や庭園を中心に文化の風景を撮影。
              </p>

              <Link
                href="https://www.instagram.com/takahiro_nobuyuki/"
                target="_blank"
              >
                <ul
                  className={`reveal ${styles.toInstagramImages}`}
                  data-dir="bottom"
                  data-delay="1"
                >
                  <li
                    className={`reveal ${styles.toInstagramLinkList}`}
                    data-dir="left"
                    data-delay="1"
                  >
                    <div className={styles.imageTitle}>庭園</div>
                    <div
                      className={`image-wrapper grad-mask-to-bottom ${styles.aspectRatio3div1}`}
                    >
                      <img
                        src="/images/image-garden.jpg"
                        alt="庭園のイメージ"
                      />
                    </div>
                  </li>
                  <li
                    className={`reveal ${styles.toInstagramLinkList}`}
                    data-dir="right"
                    data-delay="2"
                  >
                    <div className={styles.imageTitle}>禅</div>
                    <div
                      className={`image-wrapper grad-mask-to-bottom ${styles.aspectRatio3div1}`}
                    >
                      <img src="/images/image-zen.jpg" alt="禅のイメージ" />
                    </div>
                  </li>
                  <li
                    className={`reveal ${styles.toInstagramLinkList}`}
                    data-dir="left"
                    data-delay="3"
                  >
                    <div className={styles.imageTitle}>茶</div>
                    <div
                      className={`image-wrapper grad-mask-to-bottom ${styles.aspectRatio3div1}`}
                    >
                      <img src="/images/image-tea.jpg" alt="茶のイメージ" />
                    </div>
                  </li>
                  <li
                    className={`reveal ${styles.toInstagramLinkList}`}
                    data-dir="right"
                    data-delay="4"
                  >
                    <div className={styles.imageTitle}>芸能</div>
                    <div
                      className={`image-wrapper grad-mask-to-bottom ${styles.aspectRatio3div1}`}
                    >
                      <img
                        src="/images/image-performing-arts.jpg"
                        alt="芸能のイメージ"
                      />
                    </div>
                  </li>
                </ul>
              </Link>

              <div className="ctaRow reveal" data-effect="zoom" data-delay="2">
                <a
                  className={`btn btn--ghost ${styles.toInstagram}`}
                  href="https://www.instagram.com/takahiro_nobuyuki/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className="wrapper Amulet">
              <h3 className="reveal" data-dir="left">
                授与品
              </h3>
              <p className="reveal" data-dir="bottom">
                神仏とのご縁を繋ぐ授与品。一つひとつ心を込めた企画・立案から高品質な生産まで。
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="gap-image" data-speed="0.25">
        <div
          className="gap-image__layer"
          style={{ "--panel-bg": "url(/images/sample2.jpg)" }}
        />
      </div>

      <div className="panel">
        <div className="container">
          {/* PHILOSOPHY */}
          <section id="philosophy" className={styles.section}>
            <h2 className="reveal" data-dir="bottom">
              Philosophy
            </h2>

            <p className="reveal" data-dir="bottom" data-delay="1">
              文化は情報ではなく、体験として伝わるものだと考えています。
              静かな時間の中で生まれる所作や空気を記録し、
              次の世代へ残していきたいと思っています。
            </p>
          </section>
        </div>
      </div>

      <div className="gap-image" data-speed="0.25">
        <div
          className="gap-image__layer"
          style={{ "--panel-bg": "url(/images/sample3.jpg)" }}
        />
      </div>

      <div className="panel bg-color-theme-light">
        <div className="container">
          {/* CONTACT */}
          <section id="contact" className={styles.section}>
            <h2 className="reveal" data-dir="bottom">
              Contact
            </h2>

            <p className="reveal" data-dir="bottom" data-delay="1">
              京都を中心に活動しています。
              <br />
              撮影・WEB制作・文化空間の記録に関するご相談は
              お気軽にご連絡ください。
            </p>

            <div className="ctaRow reveal" data-dir="bottom" data-delay="2">
              <a
                className=" btn btn--formail"
                href="mailto:takahiro@hokuto-p.co.jp"
              >
                MAIL
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
