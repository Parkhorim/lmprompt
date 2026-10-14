import { findStyle, styleGroups } from "../lib/styles.js";

// 슬라이드 디자인 스타일 고르기 (49종)
export default function StylePicker({ cardId, value, group, onChange }) {
  const id = `style-${cardId}`;
  const groups = styleGroups(group.matched ? group.group : "", group.label);
  const current = findStyle(value);
  return (
    <div className="style-picker">
      <label htmlFor={id}>디자인 스타일</label>
      <select id={id} value={current ? value : ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">고르지 않음</option>
        {groups.map((gr) => (
          <optgroup key={gr.id} label={gr.label}>
            {gr.styles.map((s) => (
              <option key={gr.id + s.id} value={s.id}>
                {s.no}. {s.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {current && current.caution && <p className="style-caution">{current.caution}</p>}
    </div>
  );
}
