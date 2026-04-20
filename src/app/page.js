// @/app/page.js

import Link from "next/link";

export default function Home() {
  return (
    <div className="top-page hero">
      <h1 className="title">Awai</h1>
      <div className="wrapper">
        <p className="catch-copy">Where something begins between</p>
        <p className="copy-en">
          Quiet cultural experiences&nbsp;
          <br className="br-for-smartphone" />
          in Kyoto,&nbsp;
          <br className="br-for-smartphone" />
          through tea, silence, and reflection
        </p>
      </div>
      <p className="copy-jp">
        あわい &nbsp;
        <span className="horizontal-wide">–</span>
        &nbsp; 静けさのなかで<span className="tume-minus-1">、</span>
        <br className="br-for-smartphone" />
        ひらく体験へ
      </p>
      <Link className="btn btn--regular" href="/en/experiences">
        View Experiences
      </Link>
    </div>
  );
}