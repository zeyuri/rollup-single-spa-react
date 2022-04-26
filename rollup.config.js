import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import styles from "rollup-plugin-styles";
import ts from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import smartAsset from "rollup-plugin-smart-asset";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: "src/zeasy-main.tsx",
  preserveEntrySignatures: true,
  output: {
    file: "dist/zeasy-main.js",
    format: "system", // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
    assetFileNames: "[name]-[hash][extname]",
    name: null, // ensure anonymous System.register
  },
  external: ["react", "react-dom", "single-spa"],
  watch: {
    clearScreen: false,
  },
  plugins: [
    esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // by default inferred from rollup's `output.sourcemap` option
      minify: Boolean(isProduction),
      target: "esnext", // default, or 'es20XX', 'esnext'
      jsx: "transform", // default, or 'preserve'
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
      // Like @rollup/plugin-replace
      define: {
        __VERSION__: '"x.y.z"',
      },
      tsconfig: "tsconfig.json", // default
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        ".json": "json",
        // Enable JSX in .js files too
        ".js": "jsx",
      },
    }),
    isProduction && ts({ tsconfig: "./tsconfig.json" }),
    !isProduction && livereload("dist"),
    !isProduction &&
      serve({
        contentBase: ["dist"],
        // historyApiFallback: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }),
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    styles(),
    smartAsset({
      url: "copy",
      keepImport: false,
      publicPath: "http://localhost:10001",
      keepName: true,
      extensions: [".gif", ".png", ".jpg", ".webp", ".jpeg"],
    }),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
      },
    }),
  ],
};
