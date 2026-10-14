import { defineConfig } from "vite";

// 플러그인 없이 esbuild로 JSX 변환(런타임 의존성은 react, react-dom뿐)
export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    include: ["tests/**/*.test.js"],
  },
});
