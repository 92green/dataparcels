//@flow
module.exports = {
    pathPrefix: '/parcels',
    siteMetadata: {
        title: 'Parcels'
    },
    plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-transformer-blueflagdocs',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'parcels',
                path: `${__dirname}/../parcels/src`
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/docs`,
                name: 'markdown-pages'
            }
        },
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
