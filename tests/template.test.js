import { describe, it, expect } from "vitest";
import { parseTemplate, assemble, slotValue } from "../src/lib/template.js";
import stages from "../src/data/stages.json";

describe("parseTemplate", () => {
  it("글자와 슬롯을 나눔", () => {
    const parts = parseTemplate("{단원}에서 {범위=핵심 개념} 부분만");
    expect(parts).toEqual([
      { type: "slot", key: "단원", def: "", global: true },
      { type: "text", value: "에서 " },
      { type: "slot", key: "범위", def: "핵심 개념", global: false },
      { type: "text", value: " 부분만" },
    ]);
  });

  it("키에 공백·슬래시가 있어도 읽음", () => {
    const [p] = parseTemplate("{상황/목적=중학생 대상}");
    expect(p).toMatchObject({ key: "상황/목적", def: "중학생 대상", global: false });
  });

  it("빈 기본값 {키=}도 지역 슬롯", () => {
    const [p] = parseTemplate("{메모=}");
    expect(p).toMatchObject({ key: "메모", def: "" });
  });
});

describe("assemble", () => {
  const g = { 학년: "중학교 2학년", 교과: "과학", 단원: "물질의 구성" };

  it("전역·지역 값을 채움", () => {
    expect(assemble("{학년} {교과} {개수=5}개", g, {})).toBe("중학교 2학년 과학 5개");
    expect(assemble("{개수=5}개", g, { 개수: "7" })).toBe("7개");
  });

  it("값이 비면 [키]로 남김", () => {
    expect(assemble("{학년} {개수=5}", { 학년: "" }, { 개수: "" })).toBe("[학년] [개수]");
  });

  it("줄바꿈을 유지", () => {
    expect(assemble("가\n- {단원}", g)).toBe("가\n- 물질의 구성");
  });

  it("지역 슬롯 값이 저장되어 있으면 빈 값도 존중", () => {
    expect(slotValue({ key: "개수", def: "5", global: false }, g, { 개수: "" })).toBe("");
  });
});

describe("stages.json", () => {
  const cards = stages.flatMap((s) => s.cards);
  it("카드 20장, id 중복 없음", () => {
    expect(cards).toHaveLength(20);
    expect(new Set(cards.map((c) => c.id)).size).toBe(20);
  });
  it("모든 템플릿이 슬롯으로 깨끗이 조립됨(남는 중괄호 없음)", () => {
    for (const c of cards) expect(assemble(c.tpl, { 학년: "a", 교과: "b", 단원: "c" })).not.toMatch(/[{}]/);
  });
  it("형성평가 난이도 기본값 합 = 문항 수", () => {
    const f = cards.find((c) => c.id === "formative");
    const d = Object.fromEntries(parseTemplate(f.tpl).filter((p) => p.type === "slot").map((p) => [p.key, p.def]));
    expect(Number(d.하) + Number(d.중) + Number(d.상)).toBe(Number(d.개수));
  });
});
