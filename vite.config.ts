import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    base: "/",
    // build: {
    //     rollupOptions: {
    //         output: {
    //             entryFileNames: `assets/[name]-ts${Date.now()}.js`,
    //             chunkFileNames: `assets/[name]-ts${Date.now()}.js`,
    //             assetFileNames: `assets/[name]-ts${Date.now()}.[ext]`,
    //         },
    //     },
    // },
    build: {
        sourcemap: process.env.NODE_ENV !== "production",
    },
    test: {
        globals: true,
    },
});
