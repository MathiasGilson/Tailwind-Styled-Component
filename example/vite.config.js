const { defineConfig } = require("vite")
const react = require("@vitejs/plugin-react")

// https://vitejs.dev/config/
module.exports = defineConfig({
    plugins: [react()],
    // type: "module",
    resolve: {
        preserveSymlinks: true
    }
})
