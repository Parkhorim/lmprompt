// 템플릿 문법: {키} 또는 {키=기본값}
export const SLOT_RE = /\{([^{}=]+?)(?:=([^{}]*))?\}/g;

// 설정 패널과 모든 카드가 함께 쓰는 슬롯
export const GLOBAL_KEYS = ["학년", "교과", "단원"];

export const isGlobal = (key) => GLOBAL_KEYS.includes(key);

// 템플릿을 글자 조각과 슬롯 조각으로 나눔
export function parseTemplate(tpl) {
  const parts = [];
  let last = 0;
  for (const m of tpl.matchAll(SLOT_RE)) {
    if (m.index > last) parts.push({ type: "text", value: tpl.slice(last, m.index) });
    const key = m[1];
    parts.push({ type: "slot", key, def: m[2] ?? "", global: isGlobal(key) });
    last = m.index + m[0].length;
  }
  if (last < tpl.length) parts.push({ type: "text", value: tpl.slice(last) });
  return parts;
}

// 슬롯 하나의 현재 값. 지역 슬롯은 저장값이 없으면 기본값
export function slotValue(part, g = {}, loc = {}) {
  if (part.global) return g[part.key] ?? "";
  return Object.prototype.hasOwnProperty.call(loc, part.key) ? loc[part.key] : part.def;
}

// 슬롯을 현재 값으로 바꾼 문장. 값이 비면 [키]로 남김
export function assemble(tpl, g = {}, loc = {}) {
  return parseTemplate(tpl)
    .map((p) => {
      if (p.type === "text") return p.value;
      const v = String(slotValue(p, g, loc)).trim();
      return v || `[${p.key}]`;
    })
    .join("");
}
