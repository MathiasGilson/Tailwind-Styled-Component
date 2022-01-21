const pkg = require("./package.json")

const build = require("esbuild").build

const buildOptions = [
    { format: "esm", outfile: "build/tailwind-styled-components.esm.js" },
    { format: "cjs", outfile: "build/tailwind-styled-components.cjs.js" }
]
const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]

const buildAll = async () => {
    const bundleFiles = buildOptions.map(async ({ format, outfile }) =>
        build({
            entryPoints: ["./src/index.ts"],
            format,
            bundle: true,
            minify: true,
            sourcemap: true,
            outfile,
            external // exclude dependencies from bundle
        })
    )

    await Promise.all(bundleFiles)
}

buildAll()
