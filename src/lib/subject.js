import data from "../data/subjects.json";

const strip = (s) => String(s ?? "").replace(/\s+/g, "");

// 교과 입력값 → 교과 버튼 항목 { name, group } (못 찾으면 null)
export function findSubject(input, subjects = data.subjects) {
  const s = strip(input);
  if (!s) return null;
  const exact = subjects.find((x) => strip(x.name) === s);
  if (exact) return exact;
  return (
    subjects.find((x) => s.includes(strip(x.name)) || (x.name === "기술·가정" && s.includes("기술"))) || null
  );
}

// 교과 입력값 → 예시 묶음 { group, label, matched }
export function findGroup(input, d = data) {
  const sub = findSubject(input, d.subjects);
  const group = sub ? sub.group : d.fallbackGroup;
  return { group, label: d.groups[group], matched: !!sub };
}
