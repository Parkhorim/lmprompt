import { useMemo } from "react";
import subjectsData from "../data/subjects.json";
import { findSubject } from "../lib/subject.js";
import { pickUnits } from "../lib/units.js";

const GRADES = ["중학교 1학년", "중학교 2학년", "중학교 3학년"];

function GradeSelect({ value, onChange }) {
  const custom = value && !GRADES.includes(value);
  return (
    <div className="field field-grade">
      <label htmlFor="set-grade">학년</label>
      <select id="set-grade" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">학년 선택</option>
        {GRADES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
        {custom && <option value={value}>{value}</option>}
      </select>
    </div>
  );
}

function SubjectInput({ value, onChange }) {
  return (
    <div className="field field-subject">
      <label htmlFor="set-subject">교과</label>
      <input id="set-subject" type="text" value={value} autoComplete="off" placeholder="예: 과학" onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SubjectChips({ value, onPick }) {
  const current = findSubject(value);
  return (
    <div className="chips" role="group" aria-label="교과 고르기">
      {subjectsData.subjects.map((s) => {
        const on = !!current && current.name === s.name;
        return (
          <button key={s.name} type="button" className={"chip" + (on ? " is-on" : "")} aria-pressed={on} onClick={() => onPick(s.name)}>
            {s.name}
          </button>
        );
      })}
    </div>
  );
}

function UnitPicker({ subject, grade, value, onChange }) {
  const subjectName = (findSubject(subject) || {}).name || "";
  // 같은 교과·학년 조합이면 목록을 다시 만들지 않음
  const info = useMemo(() => pickUnits(subjectName, grade), [subjectName, grade]);
  const all = info.groups.flatMap((gr) => gr.items);
  const selected = all.includes(value) ? value : "";
  return (
    <div className="field field-unit">
      <label htmlFor="set-unit-list">단원·주제</label>
      <div className="unit-row">
        <select
          id="set-unit-list"
          value={selected}
          disabled={!!info.need}
          aria-describedby="unit-note"
          onChange={(e) => e.target.value && onChange(e.target.value)}
        >
          <option value="">{info.placeholder}</option>
          {info.groups.map((gr) => (
            <optgroup key={gr.label} label={gr.label}>
              {gr.items.map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <input
          id="set-unit"
          type="text"
          value={value}
          autoComplete="off"
          aria-label="단원·주제 직접 입력"
          placeholder="직접 입력"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <p className="unit-note" id="unit-note">
        {info.note}
        {info.note3 && <span className="unit-note3">{info.note3}</span>}
      </p>
    </div>
  );
}

// 내 수업 정보
export default function SetupPanel({ g, setGlobal, howto }) {
  return (
    <section className="panel setup" aria-labelledby="setup-title">
      <div className="panel-head">
        <h2 id="setup-title">내 수업 정보</h2>
        <p className="panel-sub">여기에 적은 값이 모든 프롬프트의 노란 칸에 한꺼번에 들어갑니다</p>
      </div>
      <div className="setup-grid">
        <GradeSelect value={g.학년 || ""} onChange={(v) => setGlobal("학년", v)} />
        <SubjectInput value={g.교과 || ""} onChange={(v) => setGlobal("교과", v)} />
        <UnitPicker subject={g.교과 || ""} grade={g.학년 || ""} value={g.단원 || ""} onChange={(v) => setGlobal("단원", v)} />
      </div>
      <SubjectChips value={g.교과 || ""} onPick={(v) => setGlobal("교과", v)} />
      <ul className="howto">
        {howto.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </section>
  );
}
