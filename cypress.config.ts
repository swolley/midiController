import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        //excludeSpecPattern: ["./cypress/e2e/1-getting-started", "./cypress/e2e/2-advanced-examples"],
    },

    component: {
        devServer: {
            framework: "vue",
            bundler: "vite",
        },
        excludeSpecPattern: [],
    },
});
