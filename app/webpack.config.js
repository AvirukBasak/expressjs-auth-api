/* If you do not know webpack, DO NOT TOUCH this file.
   IDK webpack so I don't know 80% of WTF is going on. */

/* This file is in CommonJS syntax.
   Converting it into ES modules syntax MAY NOT work. */

const path = require('path');
const HWP = require('html-webpack-plugin');
const CWP = require('copy-webpack-plugin');

/* list of paths of this project */
const Paths = {
    src: path.join(__dirname, 'src'),          // jsx, styles and browser js
    build: path.join(__dirname, '../static'),  // output can be served statically
    public: path.join(__dirname, 'public'),    // public resources
};

module.exports = {
    /* webpack entry point */
    entry: path.join(Paths.src, 'index.js'),
    resolve: {
        /* no idea why I put it and at this point am too
           afraid to remove it */
        extensions: ['', '.js', '.jsx', '.json'],
        /* the magic that allows accessing public res via `/`
           and src files via `@/` prefixes */
        alias: {
            '@public': Paths.public,
            '@': Paths.src,
        },
    },
    /* webpack build directory and bundle script name.
       the bundle script is the result of compiling
       all js and jsx code into one js script.
       this compilation is done by webpack and babel. */
    output: {
        filename: '[name].bundle.js',
        path: Paths.build,
    },
    /* to prevent a warning coz bundle size exceeds a certain limit */
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        rules: [
            /* loader rules for jsx and js files */
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            /* loader rules for css files */
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            /* loader rules for public resource type files viz. images
               and fonts are not added so that they be accessed wrt `/` */
        ]
    },
    plugins: [
        /* browser entry point html, hooked up with *.bundle.js */
        new HWP({ template: path.join(Paths.src, 'index.html') }),
        /* copy public resources into build dir, otherwise you cannot
           access the public resources in browser */
        new CWP({
            patterns: [
                { from: Paths.public, to: Paths.build },
            ],
        }),
    ]
}
