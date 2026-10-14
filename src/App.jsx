import { useCallback, useEffect, useRef, useState } from "react";
import site from "./data/site.json";
import stages from "./data/stages.json";
import examples from "./data/examples.json";
import { useAppState } from "./hooks/useAppState.js";
import { findGroup } from "./lib/subject.js";
import Hero from "./components/Hero.jsx";
import SetupPanel from "./components/SetupPanel.jsx";
import StickyBar from "./components/StickyBar.jsx";
import StageSection from "./components/StageSection.jsx";
import Closing from "./components/Closing.jsx";
import Toast from "./components/Toast.jsx";

const ALL_IDS = stages.flatMap((s) => s.cards.map((c) => c.id));

export default function App() {
  const { st, setGlobal, setLocal, setEdit, setDone, reset } = useAppState();
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const showToast = useCallback((msg) => {
    clearTimeout(timer.current);
    setToast({ msg, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const onCopied = useCallback(
    (ok) => showToast(ok ? "복사했어요. 노트북에 붙여 넣으세요" : "복사가 막혀 있어요. 문장 직접 고치기를 눌러 전체 선택 후 복사하세요"),
    [showToast]
  );

  const group = findGroup(st.g.교과);
  const doneCount = ALL_IDS.filter((id) => st.done[id]).length;
  const actions = { setGlobal, setLocal, setEdit, setDone };

  return (
    <>
      <div className="wrap">
        <Hero site={site} />
        <SetupPanel g={st.g} setGlobal={setGlobal} howto={site.howto} />
      </div>
      <StickyBar g={st.g} stages={stages} doneCount={doneCount} total={ALL_IDS.length} />
      <main className="wrap">
        {stages.map((stage) => (
          <StageSection key={stage.id} stage={stage} st={st} group={group} examples={examples} actions={actions} onCopied={onCopied} />
        ))}
        <Closing site={site} onReset={reset} />
      </main>
      <Toast toast={toast} />
    </>
  );
}
