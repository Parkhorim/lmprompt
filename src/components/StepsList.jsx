// 진행 순서(접이식)
export default function StepsList({ steps }) {
  if (!steps || !steps.length) return null;
  return (
    <details className="fold">
      <summary>진행 순서</summary>
      <ol className="fold-body steps-list">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </details>
  );
}
