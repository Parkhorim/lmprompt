import { useState } from "react";

// 하단 안내 + 초기화
export default function Closing({ site, onReset }) {
  const [asking, setAsking] = useState(false);
  return (
    <footer className="closing">
      <section className="panel caution" aria-labelledby="caution-title">
        <h2 id="caution-title">{site.cautionTitle}</h2>
        <ul>
          {site.cautions.map((c) => (
            <li key={c.label}>
              <strong>{c.label}</strong> {c.text}
            </li>
          ))}
        </ul>
      </section>
      <div className="reset">
        {asking ? (
          <div className="reset-confirm" role="group" aria-label="입력한 내용 모두 지우기 확인">
            <span>입력한 내용을 모두 지울까요?</span>
            <button
              type="button"
              className="btn btn-danger"
              autoFocus
              onClick={() => {
                onReset();
                setAsking(false);
              }}
            >
              지우기
            </button>
            <button type="button" className="btn" onClick={() => setAsking(false)}>
              취소
            </button>
          </div>
        ) : (
          <button type="button" className="btn" onClick={() => setAsking(true)}>
            입력한 내용 모두 지우기
          </button>
        )}
      </div>
      <p className="footer-text">{site.footer}</p>
    </footer>
  );
}
