import CopyButton from "./CopyButton.jsx";

// 교과별 예시(접이식)
export default function ExampleBox({ text, group, onCopied }) {
  if (!text) return null;
  const summary = group.matched ? `${group.label} 예시 프롬프트` : `교과를 고르면 바뀜 · ${group.label} 예시 프롬프트`;
  return (
    <details className="fold fold-example">
      <summary>{summary}</summary>
      <div className="fold-body">
        <div className="line-item">
          <p className="line-text">{text}</p>
          <CopyButton getText={() => text} onResult={onCopied} ariaLabel={`${group.label} 예시 프롬프트 복사`} />
        </div>
      </div>
    </details>
  );
}
