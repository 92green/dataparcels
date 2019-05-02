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

// kill all jest child processes that hang around after build,
// which stop netlify from recognising that build is complete
// this likely happens due to the usage of setInterval within code that
// ends up in the gatsby site

const ChildProcess = require('child_process');

exports.onPostBuild = () => {
    console.log("Killing jest...");
    ChildProcess.execSync("ps aux | grep jest | grep -v grep | awk '{print $2}' | xargs kill");
    console.log("Jest is dead");
};
