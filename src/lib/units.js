import unitsData from "../data/units.json";
import subjectsData from "../data/subjects.json";
import { findSubject } from "./subject.js";

// "중학교 2학년" → "2"
export function gradeNo(grade) {
  const s = String(grade ?? "");
  const m = s.match(/([1-3])\s*학년/) || s.match(/[1-3]/);
  return m ? m[1] ?? m[0] : "";
}

// 학년·교과로 단원 목록 고르기
// 반환: { subject, kind, groups, need, note, note3, placeholder }
//   need: "subject"(교과 먼저) | "grade"(학년 먼저) | null
export function pickUnits(subjectInput, grade, units = unitsData, kindNote = subjectsData.kindNote) {
  const sub = findSubject(subjectInput);
  const info = sub && units[sub.name];
  if (!info) return { subject: null, kind: null, groups: [], need: "subject", note: "", note3: "", placeholder: "교과를 먼저 고르세요" };
  const placeholder = info.kind === "unit" ? "단원 고르기" : "영역·주제 고르기";
  const note = kindNote[info.kind] || "";
  if (info.all) return { subject: sub.name, kind: info.kind, groups: info.all, need: null, note, note3: "", placeholder };
  const g = gradeNo(grade);
  const groups = (info.byGrade && info.byGrade[g]) || [];
  if (!groups.length) return { subject: sub.name, kind: info.kind, groups: [], need: "grade", note, note3: "", placeholder: "학년을 먼저 고르세요" };
  return { subject: sub.name, kind: info.kind, groups, need: null, note, note3: g === "3" ? info.note3 || "" : "", placeholder };
}
