import { assemble } from "../lib/template.js";
import { STYLE_KEY, styleLine, withStyle } from "../lib/styles.js";
import StylePicker from "./StylePicker.jsx";
import CopyButton from "./CopyButton.jsx";
import PromptBody from "./PromptBody.jsx";
import ExampleBox from "./ExampleBox.jsx";
import RefineList from "./RefineList.jsx";
import StepsList from "./StepsList.jsx";
import Note from "./Note.jsx";

// 실습 카드 한 장
export default function PromptCard({ card, st, group, example, actions, onCopied }) {
  const loc = st.loc[card.id] || {};
  const edited = st.edit[card.id];
  const isEdited = edited != null;
  const done = !!st.done[card.id];
  const styleId = card.styles ? loc[STYLE_KEY] : "";
  const original = () => withStyle(assemble(card.tpl, st.g, loc), styleId);
  const text = () => (isEdited ? edited : original());
  const doneId = `done-${card.id}`;

  return (
    <article className={"card" + (done ? " is-done" : "")} id={`card-${card.id}`} data-card={card.id}>
      <header className="card-head">
        <div className="card-titles">
          <p className="where">{card.where}</p>
          <h3 className="card-title">{card.title}</h3>
        </div>
        <label className="done-check" htmlFor={doneId}>
          <input id={doneId} type="checkbox" checked={done} onChange={(e) => actions.setDone(card.id, e.target.checked)} />
          <span>완료</span>
        </label>
      </header>

      {card.when && <p className="when">{card.when}</p>}

      {card.files && card.files.length > 0 && (
        <div className="files">
          <span className="files-label">체크할 소스</span>
          {card.files.map((f) => (
            <span key={f} className="file-tag">
              {f}
            </span>
          ))}
        </div>
      )}

      <PromptBody
        card={card}
        g={st.g}
        loc={loc}
        edited={edited}
        style={styleLine(styleId)}
        onGlobal={actions.setGlobal}
        onLocal={(k, v) => actions.setLocal(card.id, k, v)}
        onEdit={(v) => actions.setEdit(card.id, v)}
      />

      {card.styles && !isEdited && (
        <StylePicker cardId={card.id} value={styleId || ""} group={group} onChange={(v) => actions.setLocal(card.id, STYLE_KEY, v)} />
      )}

      <div className="card-actions">
        <CopyButton primary label="프롬프트 복사" getText={text} onResult={onCopied} ariaLabel={`${card.title} 프롬프트 복사`} />
        {isEdited ? (
          <button type="button" className="btn" onClick={() => actions.setEdit(card.id, null)}>
            원래 문장으로
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => actions.setEdit(card.id, original())}>
            문장 직접 고치기
          </button>
        )}
        {isEdited && <span className="edited-flag">직접 고친 문장 사용 중</span>}
      </div>

      {card.ex && <ExampleBox text={example} group={group} onCopied={onCopied} />}
      <RefineList items={card.refine} onCopied={onCopied} />
      <StepsList steps={card.steps} />
      <Note text={card.note} warn={card.warn} />
    </article>
  );
}
