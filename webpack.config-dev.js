const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT = path.resolve( __dirname, 'examples' );
const DESTINATION = path.resolve( ROOT, 'dist' );
const exclude = [
    path.resolve( __dirname, 'node_modules' ),
    path.resolve( __dirname, 'bundle' ),
];

module.exports = {
    context: ROOT,

    entry: {
        'main': './main.ts'
    },
    
    output: {
        filename: '[name].js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: exclude,
                use: 'tslint-loader'
            },

            /****************
            * LOADERS
            *****************/
            {
                test: /\.ts$/,
                exclude: exclude,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        configFileName: 'tsconfig-dev.json'
                    }
                }
            }
        ]
    },

    plugins: [
	    new HtmlWebpackPlugin({
	      template: 'index.html'
	    })
    ],

    devtool: 'cheap-module-source-map',
    devServer: {}
};

