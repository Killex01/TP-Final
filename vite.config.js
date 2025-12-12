import { defineConfig } from "vite";

export default defineConfig({
    base: "/tp-final/",
    build: {
        emptyOutDir: true,
        rollupOptions:{
            input:{
                main: "index.html",
            },
        },
    },
});