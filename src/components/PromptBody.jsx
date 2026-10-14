import { parseTemplate, slotValue } from "../lib/template.js";
import Slot from "./Slot.jsx";

// 슬롯이 섞인 본문, 또는 직접 고친 문장 textarea
export default function PromptBody({ card, g, loc, edited, style, onGlobal, onLocal, onEdit }) {
  if (edited != null) {
    return (
      <textarea
        className="prompt prompt-edit"
        value={edited}
        aria-label={`${card.title} 프롬프트 직접 고치기`}
        rows={Math.max(3, edited.split("\n").length + 1)}
        onChange={(e) => onEdit(e.target.value)}
      />
    );
  }
  const parts = parseTemplate(card.tpl);
  return (
    <div className="prompt">
      {parts.map((p, i) =>
        p.type === "text" ? (
          <span key={i}>{p.value}</span>
        ) : (
          <Slot
            key={i}
            name={p.key}
            global={p.global}
            value={slotValue(p, g, loc)}
            onChange={(v) => (p.global ? onGlobal(p.key, v) : onLocal(p.key, v))}
          />
        )
      )}
      {style && (
        <>
          {"\n\n"}
          <span className="style-line">{style}</span>
        </>
      )}
    </div>
  );
}
