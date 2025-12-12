import { defineConfig } from "vite";

export default defineConfig({
    base: "/tpFinal_Alex_Deandrade_Lim_Masato_Charbonneau/",
    build: {
        emptyOutDir: true,
        rollupOptions:{
            input:{
                main: "index.html",
            },
        },
    },
});