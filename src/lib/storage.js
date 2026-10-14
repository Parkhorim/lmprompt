// localStorage는 이 파일에서만 다룸. 키·구조는 v1과 같게 유지(참가자 저장값 이어받기)
export const KEY = "gnb-prompts-v1";

const empty = () => ({ g: {}, loc: {}, edit: {}, done: {} });
const obj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

export function load(defaults = {}) {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch (e) {
    raw = null;
  }
  if (!raw) return { ...empty(), g: { ...defaults } };
  try {
    const p = JSON.parse(raw);
    return { g: obj(p.g), loc: obj(p.loc), edit: obj(p.edit), done: obj(p.done) };
  } catch (e) {
    return { ...empty(), g: { ...defaults } };
  }
}

export function save(st) {
  try {
    localStorage.setItem(KEY, JSON.stringify(st));
  } catch (e) {
    /* 저장이 막힌 브라우저: 화면 동작은 그대로 */
  }
}

export function clear() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    /* 무시 */
  }
}
