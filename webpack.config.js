const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'bundle' );
const exclude = [
    path.resolve( __dirname, 'node_modules' ),
    path.resolve( __dirname, 'dev' ),
];

module.exports = {
    context: ROOT,

    entry: {
        'bundle': './index.ts'
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
                use: 'awesome-typescript-loader?tsconfig=tsconfig.json'
            }
        ]
    },

    plugins: [

    ],

    devtool: 'none',
    devServer: {}
};

