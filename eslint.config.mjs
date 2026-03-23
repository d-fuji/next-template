import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**", "src/hooks/use-mobile.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["useMemo", "useCallback", "memo"],
              message: "React Compiler が自動メモ化するため useMemo/useCallback/memo は不要です。",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
