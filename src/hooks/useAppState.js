import { useCallback, useEffect, useState } from "react";
import { load, save, clear } from "../lib/storage.js";
import site from "../data/site.json";

// st = { g: 전역 슬롯, loc: 카드별 지역 슬롯, edit: 직접 고친 문장, done: 완료 체크 }
export function useAppState() {
  const [st, setSt] = useState(() => load(site.defaults));

  useEffect(() => {
    save(st);
  }, [st]);

  const setGlobal = useCallback((key, value) => setSt((s) => ({ ...s, g: { ...s.g, [key]: value } })), []);

  const setLocal = useCallback(
    (cardId, key, value) =>
      setSt((s) => ({ ...s, loc: { ...s.loc, [cardId]: { ...(s.loc[cardId] || {}), [key]: value } } })),
    []
  );

  // text가 null이면 고친 문장을 버리고 템플릿으로 돌아감
  const setEdit = useCallback(
    (cardId, text) =>
      setSt((s) => {
        const edit = { ...s.edit };
        if (text == null) delete edit[cardId];
        else edit[cardId] = text;
        return { ...s, edit };
      }),
    []
  );

  const setDone = useCallback(
    (cardId, on) =>
      setSt((s) => {
        const done = { ...s.done };
        if (on) done[cardId] = true;
        else delete done[cardId];
        return { ...s, done };
      }),
    []
  );

  const reset = useCallback(() => {
    clear();
    setSt({ g: { 학년: "", 교과: "", 단원: "" }, loc: {}, edit: {}, done: {} });
  }, []);

  return { st, setGlobal, setLocal, setEdit, setDone, reset };
}
