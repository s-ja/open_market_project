import * as path from "path";

import viteImagemin from "@vheemstra/vite-plugin-imagemin";
import react from "@vitejs/plugin-react";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminWebp from "imagemin-webp";
import { InlineConfig, UserConfig, defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";

interface VitestConfigExport extends UserConfig {
	test: InlineConfig;
}

export default defineConfig({
	plugins: [
		react(),
		svgrPlugin(),
		viteImagemin({
			plugins: {
				jpg: imageminMozjpeg(),
			},
			makeWebp: {
				plugins: {
					jpg: imageminWebp(),
				},
			},
		}),
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
