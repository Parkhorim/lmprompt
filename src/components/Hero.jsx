// 상단 소개
export default function Hero({ site }) {
  return (
    <header className="hero">
      <p className="eyebrow">
        {site.eyebrow} · {site.school}
      </p>
      <h1 className="hero-title">{site.title}</h1>
      <p className="lead">{site.lead}</p>
      <ol className="flow" aria-label="작업 흐름">
        {site.flow.map((f, i) => (
          <li key={f}>
            <span className="flow-no">{i + 1}</span>
            {f}
          </li>
        ))}
      </ol>
    </header>
  );
}
