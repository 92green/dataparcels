/* eslint-disable */

const path = require('path');

exports.onCreateWebpackConfig = ({
 stage, getConfig, rules, loaders, actions
}) => {
  console.log("...onCreateWebpackConfig");
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            //loaders.js(),
            //'babel-loader'
            'mdx-loader'
          ]
        }
      ]
    }
    // resolve: {
    //   alias: {
    //     'dataparcels': path.resolve(__dirname, "../dataparcels/"),
    //     'react-dataparcels': path.resolve(__dirname, "../react-dataparcels/")
    //     'react-dataparcels-drag': path.resolve(__dirname, "../react-dataparcels-drag/")
    //   }
    // }
  });
}

console.log("...gatsby-node.js is valid");
