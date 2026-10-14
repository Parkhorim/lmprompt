// 상단 고정 바
export default function StickyBar({ g, stages, doneCount, total }) {
  const summary = [g.학년, g.교과, g.단원]
    .map((v) => (v || "").trim())
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="sticky">
      <div className="sticky-inner">
        <p className="sticky-summary">{summary || "내 수업 정보를 입력하세요"}</p>
        <nav className="sticky-nav" aria-label="실습 단계">
          {stages.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              <span className="nav-no">{s.no}</span> {s.title}
            </a>
          ))}
        </nav>
        <p className="sticky-done" aria-live="polite">
          완료 {doneCount} / {total}
        </p>
      </div>
    </div>
  );
}
