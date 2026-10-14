import PromptCard from "./PromptCard.jsx";

// 단계 머리말 + 카드 목록
export default function StageSection({ stage, st, group, examples, actions, onCopied }) {
  return (
    <section className="stage" id={stage.id} aria-labelledby={`${stage.id}-title`}>
      <header className="stage-head">
        <p className="stage-no">STEP {stage.no}</p>
        <h2 className="stage-title" id={`${stage.id}-title`}>
          {stage.title}
        </h2>
        <p className="stage-desc">{stage.desc}</p>
        {stage.tips && (
          <ul className="tips">
            {stage.tips.map((t) => (
              <li key={t.label}>
                <strong>{t.label}</strong> {t.text}
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className="cards">
        {stage.cards.map((card) => (
          <PromptCard
            key={card.id}
            card={card}
            st={st}
            group={group}
            example={card.ex ? (examples[card.ex] || {})[group.group] : ""}
            actions={actions}
            onCopied={onCopied}
          />
        ))}
      </div>
    </section>
  );
}
