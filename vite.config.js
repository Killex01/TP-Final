import { defineConfig } from "vite";

export default defineConfig({
    base: "/TP-Final/",
    build: {
        emptyOutDir: true,
        rollupOptions:{
            input:{
                main: "index.html",
            },
        },
    },
});