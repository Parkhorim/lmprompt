import data from "../data/styles.json";

// 카드별 지역 슬롯 저장소(loc)에 이 키로 고른 스타일 id를 둠 (저장 구조는 그대로)
export const STYLE_KEY = "@스타일";

export const findStyle = (id, d = data) => d.styles.find((s) => s.id === id) || null;

// 프롬프트 끝에 붙일 줄 (안 골랐으면 "")
export const styleLine = (id, d = data) => {
  const s = findStyle(id, d);
  return s ? d.prefix + s.text : "";
};

export const withStyle = (text, id, d = data) => {
  const line = styleLine(id, d);
  return line ? `${text}\n\n${line}` : text;
};

// 선택 상자용 묶음: 교과 추천 → 분류별
export function styleGroups(group, groupLabel, d = data) {
  const out = [];
  if (group) {
    const rec = d.styles.filter((s) => s.for.includes(group));
    if (rec.length) out.push({ id: "rec", label: `${groupLabel} 추천`, styles: rec });
  }
  for (const c of d.categories) out.push({ id: c.id, label: c.label, styles: d.styles.filter((s) => s.cat === c.id) });
  return out;
}
