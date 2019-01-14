const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path');

exports.modifyWebpackConfig = ({ config, stage }) => {

    config
        .loader("mdx", {
            test: /\.mdx?$/,
            loaders: [
                'babel-loader',
                'mdx-loader'
            ]
        })

    return config;
};
