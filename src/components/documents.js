import React from 'react'
import gql from "graphql-tag";
import { Query } from "react-apollo";

const DOC_QUERY = gql`
    query DOC($id: Int){
        allWordpressWpManualDocumentation(filter: {wordpress_id: {eq: $id}}) {
            edges {
              node {
                title
                content
              }
            }
          }
    }
`

const Documentation = (wpId) => (
    <Query query={DOC_QUERY} variables={{id: wpId.wordpress_id}} skip={!wpId} >
        {
            ({loading, error, data}) => {
                if (loading) return <p>"Loading..."</p>;
                if (error) return <p>Error --- {console.log(error)}</p>;
                if (data) return (
                    <div className="documentation">
                        {/* <h1 className="ml-4">{data.allWordpressWpManualDocumentation.edges[0].node.title}</h1> */}
                        <div dangerouslySetInnerHTML={{__html: data.allWordpressWpManualDocumentation.edges[0].node.content}}></div>
                    </div>
                )
            }
        }

    </Query>
)

export default Documentation