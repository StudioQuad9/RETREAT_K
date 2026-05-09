// @/app/page.js

import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {

  const topBGImg = [
    "images/top/hero-image-tea-room.jpg",
    "images/top/hero-image-zen.jpg"
  ];

  return (
    <div className={`${styles.topPage} ${styles.hero}`}>
      {topBGImg.map((path, idx) => (
        <div
          key={path}
          className={`
            ${styles.topBackGroundImage} ${idx === 1 ? styles.secondOne : ""}
          `}
          style={{ backgroundImage: `url(${path})`}}
        ></div>
      ))}
      <div className={styles.topContent}>
        <h1 className={styles.title}>Awai</h1>
        <div className={styles.wrapper}>
          <p className={styles.catchCopy}>Where something begins between</p>
          <p className={styles.copyEn}>
            Quiet cultural experiences&nbsp;
            <br className="br-for-smartphone" />
            in Kyoto,&nbsp;
            <br className="br-for-smartphone" />
            through tea, silence, and reflection
          </p>
        </div>
        <p className={styles.copyJp}>
          あわい &nbsp;
          <span className="horizontal-wide">–</span>
          &nbsp; 静けさのなかで<span className="tume-minus-1">、</span>
          <br className="br-for-smartphone" />
          ひらく体験へ
        </p>
        <div className="cta">
          <Link className="btn btn--regular" href="/en/experiences">
            View Experiences
          </Link>
        </div>
      </div>
    </div>
  );
}