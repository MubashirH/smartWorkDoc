/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.createPages = async ({ actions, graphql }) => {
    const { data } = await graphql(`
        query MyQuery {
            allWordpressWpManualDocumentation {
                nodes {
                title
                wordpress_parent
                uagb_excerpt
                wordpress_id
                slug
                }
            }
        }
    `)
    data.forEach(res => {
        const slug = res.nodes.slug
        actions.createPage({
            path: slug,
            component: require.resolve(`./src/templates/documentation.js`),
            context: { slug: slug },
        })
    })
}