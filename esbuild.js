const makeAllPackagesExternalPlugin = {
    name: "make-all-packages-external",
    setup(build) {
        const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, (args) => ({ path: args.path, external: true }))
    }
}

require("esbuild").build({
    entryPoints: ["./src/index.ts"],
    // format: "esm",
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["chrome58", "firefox57", "safari11", "edge18"],
    outfile: "build/index.js",
    plugins: [makeAllPackagesExternalPlugin]
})
