import CopyButton from "./CopyButton.jsx";

// 결과를 다듬는 후속 프롬프트(접이식)
export default function RefineList({ items, onCopied }) {
  if (!items || !items.length) return null;
  return (
    <details className="fold">
      <summary>결과를 다듬는 후속 프롬프트 {items.length}개</summary>
      <ul className="fold-body refine-list">
        {items.map((r, i) => (
          <li key={i} className="line-item">
            <p className="line-text">
              <span className="refine-label">{r.label}</span>
              {r.text}
            </p>
            <CopyButton getText={() => r.text} onResult={onCopied} ariaLabel={`후속 프롬프트 ${r.label} 복사`} />
          </li>
        ))}
      </ul>
    </details>
  );
}
