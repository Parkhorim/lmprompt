// 노란 빈칸 하나: 내용 폭만큼 늘어나는 <input>
// 폭은 같은 칸에 겹쳐 둔 숨은 글자(data-size)로 맞춤
export default function Slot({ name, value, global, onChange }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  // 붙여넣기: 서식 없이, 줄바꿈은 공백으로 바꿔 한 줄로
  const onPaste = (e) => {
    const text = e.clipboardData && e.clipboardData.getData("text/plain");
    if (text == null) return;
    e.preventDefault();
    const el = e.currentTarget;
    const clean = text.replace(/\s*[\r\n]+\s*/g, " ");
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + clean + el.value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      try {
        el.setSelectionRange(start + clean.length, start + clean.length);
      } catch (err) {
        /* 무시 */
      }
    });
  };

  return (
    <span className={"slot " + (global ? "slot-global" : "slot-local")} data-size={value || `[${name}]`}>
      <input
        type="text"
        value={value}
        placeholder={`[${name}]`}
        aria-label={global ? `${name} (모든 카드에 함께 적용)` : name}
        spellCheck={false}
        autoComplete="off"
        size={1}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />
    </span>
  );
}
