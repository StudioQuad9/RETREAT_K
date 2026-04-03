// @/app/page.js

export default function Home() {
  return (
    <main className="hero">
      <h1 className="title">Awai</h1>
      <div className="wrapper">
        <p className="catch-copy">Where something begins between</p>
        <p className="copy-en">
          Enter a quiet cultural experience <br className="br-for-smartphone" />
          in Japan
        </p>
      </div>
      <p className="copy-jp">
        あわい &nbsp;
        <span className="horizontal-wide">–</span>
        &nbsp; 静けさのなかで<span className="tume-minus-1">、</span>
        <br className="br-for-smartphone" />
        ひらく体験へ
      </p>
      <a className="btn btn--regular" href="/en/experiences">
        View Experiences
      </a>
    </main>
  );
}