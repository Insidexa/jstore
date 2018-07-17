const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV !== 'development';

const production = {
    root: 'src',
    destination: 'bundle',
    entry: {
        name: 'bundle',
        path: './index.ts'
    },
    rules: [],
    plugins: [],
    exclude: [
        path.resolve( __dirname, 'examples' )
    ],
    devtool: 'none',
    tsconfig: 'tsconfig.json',
    devServer: {}
};
const development = {
    root: 'examples',
    destination: this.root + '/dist/',
    entry: {
        name: 'main',
        path: './main.ts'
    },
    rules: [
        {
            enforce: 'pre',
            test: /\.js$/,
            use: 'source-map-loader'
        }
    ],
    plugins: [
        new htmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    exclude: [
        path.resolve( __dirname, 'bundle' )
    ],
    devtool: 'cheap-module-source-map',
    tsconfig: 'tsconfig-dev.json',
    devServer: {
        port: 8000,
        inline: true,
        hot: true,
        progress: true,
        hmr: true,
        contentBase: __dirname + '/examples/'
    }
};

const config = isProduction ? production : development;
const exclude = [
    path.resolve( __dirname, 'node_modules' ),
];
const rules = [
    /****************
     * PRE-LOADERS
     *****************/
    {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: exclude.concat(config.exclude),
        use: 'tslint-loader'
    },

    /****************
     * LOADERS
     *****************/
    {
        test: /\.ts$/,
        exclude: exclude.concat(config.exclude),
        use: {
            loader: 'ts-loader',
            options: {
                configFile: config.tsconfig
            }
        }
    }
];
const plugins = [];
const ROOT = path.resolve( __dirname, config.root );

const webpackConfig = {
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
    context: ROOT,

    entry: {},

    output: {
        filename: '[name].js',
        path: path.resolve( __dirname, config.destination )
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: rules.concat(config.rules)
    },

    plugins: plugins.concat(config.plugins),

    devtool: config.devtool,
    devServer: config.devServer
};

webpackConfig.entry[config.entry.name] = config.entry.path;

module.exports = webpackConfig;