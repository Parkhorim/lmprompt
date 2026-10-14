# 제미나이 노트북 실습 프롬프트 (lmprompt v2)

학년·교과·단원만 고르면 제미나이 노트북(NotebookLM) 실습 프롬프트 20개가 내 수업에 맞게 채워지는 웹앱입니다.

- 배포: https://lmprompt.vercel.app
- 기준 문서: [PRD.md](PRD.md)
- v1(단일 파일)은 `legacy/index.html`에 동작 참고용으로 남겨 둠(배포하지 않음)

## 명령

| 명령 | 용도 |
|---|---|
| `npm install` | 처음 한 번 패키지 설치 |
| `npm run dev` | 개발 서버 |
| `npm test` | 로직 테스트(Vitest) |
| `npx playwright test` | 화면 동작 테스트(PRD 9절) — 처음 한 번 `npx playwright install chromium` |
| `npm run build` / `npm run preview` | 배포용 빌드와 확인 |

## 문구 고치기

- 프롬프트·후속 프롬프트·참고 문구 → `src/data/stages.json` (카드 `id`는 저장 키이므로 바꾸지 않음)
- 교과별 예시 → `src/data/examples.json`
- 학년·교과별 단원 → `src/data/units.json`
- 교과 버튼·묶음 → `src/data/subjects.json`
- 연수명·학교명·바닥글 → `src/data/site.json` (다른 학교 연수는 `school`만 바꾸면 됨)

문구를 바꾸면 PRD.md 부록도 함께 고칩니다.
