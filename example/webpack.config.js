const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = {
    entry: "./src/index.tsx",
    mode: "development",
    target: "web",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "bundle.js",
        publicPath: "/",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: "index.html",
            template: "./public/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "css/styles.css"
        })
    ],
    devServer: {
        compress: true,
        hot: true,
        inline: true,
        historyApiFallback: {
            disableDotRule: true
        },
        stats: "minimal"
    }
}
