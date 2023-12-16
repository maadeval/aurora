import { defineConfig } from "cypress";

export default defineConfig({
	video: false,
	component: {
		specPattern: "tests/**/*.cy.{js,jsx,ts,tsx}",
		devServer: {
			framework: "react",
			bundler: "vite",
		},
		viewportWidth: 1000,
		viewportHeight: 700,
	},
});