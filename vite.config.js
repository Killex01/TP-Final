import { defineConfig } from "vite";

export default defineConfig({
    base: "/tpfinal/",
    build: {
        emptyOutDir: true,
        rollupOptions:{
            input:{
                main: "index.html",
            },
        },
    },
});