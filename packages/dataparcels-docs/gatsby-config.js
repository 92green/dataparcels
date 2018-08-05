//@flow
module.exports = {
    pathPrefix: '/dataparcels',
    siteMetadata: {
        title: 'Dataparcels'
    },
    plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-resolve-src',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/src/examples`,
                name: 'example-pages'
            }
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    `gatsby-remark-prismjs`
                ]
            }
        }
    ]
};
