import * as path from "path";

import react from "@vitejs/plugin-react";
import { InlineConfig, UserConfig, defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";

interface VitestConfigExport extends UserConfig {
	test: InlineConfig;
}

export default defineConfig({
	plugins: [
		react(),
		svgrPlugin(),
	],
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/tests/setup.ts",
	},
} as VitestConfigExport);
