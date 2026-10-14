// 참고(청록) / 유의(주황)
export default function Note({ text, warn }) {
  if (!text) return null;
  return (
    <p className={"note " + (warn ? "note-warn" : "note-info")}>
      <strong className="note-label">{warn ? "유의" : "참고"}</strong>
      {text}
    </p>
  );
}
