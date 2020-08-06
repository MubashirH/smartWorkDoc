import React from 'react'
import { StaticQuery, graphql } from "gatsby"

let result
function filtering(data, id) {
    result = data.allWordpressWpManualDocumentation.edges.filter(res => res.node.wordpress_id === id)
}

const Content = (wpId) => (
    <StaticQuery
        query= {graphql`
            query Query {
                allWordpressWpManualDocumentation {
                    edges {
                        node {
                            wordpress_id
                            title
                            content
                        }
                    }
                }
            }
        `}
        render= { data => (
            <>{filtering(data, wpId.wordpress_id)}
                <div className="documentation">
                    <div dangerouslySetInnerHTML={{__html: result[0].node.content}}></div>
                </div>
            </>
        )}
    />
)

export default Content