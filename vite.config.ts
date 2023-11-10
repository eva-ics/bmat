import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        "@emotion/react",
        "@emotion/styled",
        "@eva-ics/webengine",
        "@eva-ics/webengine-react",
        "@mui/base",
        "@mui/core-downloads-tracker",
        "@mui/icons-material",
        "@mui/material",
        "@mui/private-theming",
        "@mui/styled-engine",
        "@mui/system",
        "@mui/types",
        "@mui/utils",
        "mui-color-input",
        "react",
        "react/jsx-runtime",
        "react-dom"
      ],
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      }
    },
    lib: {
      entry: {
        bmat: "./src/lib.mts",
        dashtable: "./src/dashtable.ts",
        dom: "./src/dom.ts",
        hooks: "./src/hooks.ts",
        log: "./src/log.ts",
        numbers: "./src/numbers.ts",
        time: "./src/time.ts",
        tools: "./src/tools.ts"
      },
      formats: ["es", "cjs"]
    }
  }
});
