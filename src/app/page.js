// @/app/page.js
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        {/* VIDEO */}
        <div>
        {/* <div className={styles.videoWrapper}> */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
            // style={{ width: "100%", height: "100%", background: "#000"}}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.heroInner}>
          <h1>
            京の文化と時間を、
            <br />
            映像とWEBで静かに記録する。
          </h1>

          <div className={styles.ctaRow}>
            <a href="#about" className="btn btn--primary">
              活動について
            </a>

            <a href="mailto:takahiro@hokuto-p.co.jp" className="btn btn--ghost">
              お問い合わせ
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={styles.section}>
        <h2>About</h2>

        <p>
          京都を拠点に、寺社仏閣や庭園など文化空間の記録制作を行っています。
          写真・動画・WEB制作を通して、場所や人が持つ空気感と、
          その背景にある時間や思想を丁寧に伝えることを大切にしています。
        </p>
      </section>

      {/* WORK */}
      <section className={styles.section}>
        <h2>Work</h2>

        <h3>WEB制作</h3>

        <p>
          寺社・文化施設のWEB制作を中心に構築。
          情報整理から設計、撮影、公開まで一貫して対応しています。
        </p>

        <ul>
          <li>白峯神宮様（京都市）</li>
          <li>大報恩寺様（京都市）</li>
          <li>法華寺様（向日市）</li>
        </ul>

        <h3>Photo / Video</h3>

        <p>京都の寺院や庭園を中心に文化の風景を撮影。</p>

        <ul>
          <li>庭園風景</li>
          <li>禅の時間</li>
          <li>茶の準備</li>
          <li>香の制作風景</li>
        </ul>

        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="btn btn--ghost"
        >
          Instagram
        </a>

        <h3>授与品</h3>

        <p>授与品の企画から生産まで対応。</p>
      </section>

      {/* PHILOSOPHY */}
      <section className={styles.section}>
        <h2>Philosophy</h2>

        <p>
          文化は情報ではなく、体験として伝わるものだと考えています。
          静かな時間の中で生まれる所作や空気を記録し、
          次の世代へ残していきたいと思っています。
        </p>
      </section>

      {/* CONTACT */}
      <section className={styles.section}>
        <h2>Contact</h2>

        <p>
          京都を中心に活動しています。
          撮影・WEB制作・文化空間の記録に関するご相談は お気軽にご連絡ください。
        </p>

        <p>
          <a href="mailto:takahiro@hokuto-p.co.jp">takahiro@hokuto-p.co.jp</a>
        </p>
      </section>
    </main>
  );
}