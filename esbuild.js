const makeAllPackagesExternalPlugin = {
    name: "make-all-packages-external",
    setup(build) {
        const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, (args) => ({ path: args.path, external: true }))
    }
}

const pkg = require("./package.json")

require("esbuild").build({
    entryPoints: ["./src/index.ts"],
    format: "esm",
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["chrome70"],
    outfile: "build/index.js",
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
    // plugins: [makeAllPackagesExternalPlugin]
})
