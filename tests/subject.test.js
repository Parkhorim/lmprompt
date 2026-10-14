import { describe, it, expect } from "vitest";
import { findSubject, findGroup } from "../src/lib/subject.js";
import { pickUnits, gradeNo } from "../src/lib/units.js";
import examples from "../src/data/examples.json";
import subjects from "../src/data/subjects.json";
import units from "../src/data/units.json";

describe("findSubject", () => {
  it("이름이 같으면 판별", () => {
    expect(findSubject("국어").group).toBe("kor");
    expect(findSubject(" 과 학 ").name).toBe("과학");
  });
  it("이름을 포함하면 판별", () => {
    expect(findSubject("중학교 수학").name).toBe("수학");
    expect(findSubject("한국사 역사").name).toBe("역사");
  });
  it("기술·가정은 '기술'만 있어도 판별", () => {
    expect(findSubject("기술").name).toBe("기술·가정");
    expect(findSubject("기술가정").name).toBe("기술·가정");
  });
  it("못 찾으면 null", () => {
    expect(findSubject("")).toBeNull();
    expect(findSubject("한문")).toBeNull();
  });
});

describe("findGroup", () => {
  it("판별 실패 시 과학 묶음", () => {
    expect(findGroup("한문")).toEqual({ group: "sci", label: "과학", matched: false });
  });
  it("묶음 표시명", () => {
    expect(findGroup("도덕")).toEqual({ group: "soc", label: "사회·역사·도덕", matched: true });
  });
});

describe("데이터 완결성", () => {
  it("예시 9종 × 8묶음", () => {
    const groups = Object.keys(subjects.groups);
    expect(Object.keys(examples)).toHaveLength(9);
    for (const k of Object.keys(examples)) for (const gr of groups) expect(examples[k][gr], `${k}.${gr}`).toBeTruthy();
  });
  it("교과 버튼 14개 모두 단원 목록이 있음", () => {
    expect(subjects.subjects).toHaveLength(14);
    for (const s of subjects.subjects) expect(units[s.name], s.name).toBeTruthy();
  });
});

describe("pickUnits", () => {
  it("학년 숫자 추출", () => {
    expect(gradeNo("중학교 3학년")).toBe("3");
    expect(gradeNo("중2")).toBe("2");
    expect(gradeNo("")).toBe("");
  });
  it("교과 미선택", () => {
    expect(pickUnits("", "중학교 1학년")).toMatchObject({ need: "subject", placeholder: "교과를 먼저 고르세요" });
  });
  it("학년별 목록인데 학년 미선택", () => {
    expect(pickUnits("수학", "")).toMatchObject({ need: "grade", placeholder: "학년을 먼저 고르세요" });
  });
  it("학년별 목록과 중3 안내", () => {
    const r = pickUnits("과학", "중학교 3학년");
    expect(r.groups[0].items).toContain("기권과 날씨");
    expect(r.note3).toBe("2026학년도 중3은 2015 개정 교과서 단원입니다");
    expect(pickUnits("과학", "중학교 2학년").note3).toBe("");
  });
  it("all 목록은 학년과 무관, 첫 항목 문구는 kind별", () => {
    expect(pickUnits("국어", "")).toMatchObject({ need: null, kind: "area", placeholder: "영역·주제 고르기" });
    expect(pickUnits("사회", "")).toMatchObject({ need: null, kind: "unit", placeholder: "단원 고르기" });
  });
});
