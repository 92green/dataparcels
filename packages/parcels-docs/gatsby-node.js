const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path');
const fs = require('fs');

exports.createPages = ({graphql, boundActionCreators}) => {
    const {createPage} = boundActionCreators;

    // function createExamples() {
    //     return graphql(`
    //         {
    //           allFile(filter: {sourceInstanceName: {eq: "example-pages"}}, sort: {fields: relativePath, order: ASC}) {
    //             edges {
    //               next {
    //                 name
    //                 relativePath
    //               }
    //               node {
    //                 name
    //                 relativePath
    //               }
    //               previous {
    //                 name
    //                 relativePath
    //               }
    //             }
    //           }
    //         }
    //     `)
    //         .then(result => {
    //             if (result.errors) {
    //                 return Promise.reject(result.errors);
    //             }

    //             let getPath = (node) => `/examples/${node.name.split("-")[1]}`;
    //             result.data.allFile.edges.forEach(({next, node, previous}, index) => {
    //                 let component = path.resolve(`src/examples/${node.relativePath}`);

    //                 createPage({
    //                     path: getPath(node),
    //                     component,
    //                     context: {
    //                         next: next ? getPath(next) : null,
    //                         previous: previous ? getPath(previous) : null,
    //                         file: node.relativePath
    //                     }
    //                 });
    //             });
    //         });
    // }

    return Promise.resolve()
        //.then(createExamples)
    ;
};

const circleYml = `
general:
  branches:
    ignore:
      - gh-pages
`;

exports.onPostBuild = () => {
    fs.writeFileSync(`${__dirname}/public/circle.yml`, circleYml);
}
