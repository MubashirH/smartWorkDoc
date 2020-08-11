import React from 'react'
import { StaticQuery, graphql, navigate } from "gatsby"

let result
function filtering(data, id) {
    if (!isNaN(id)) {
        result = data.allWordpressWpManualDocumentation.edges.filter(res => res.node.wordpress_id === id)
    } 
    else {
        result = data.allWordpressWpManualDocumentation.edges.filter((res) => {
            let value = res.node.title.toLowerCase()
            let content = res.node.uagb_excerpt
            if ( value.includes(id.toLowerCase()) ) {
                return res
            } else if ( content != null ) {
                if ( content.toLowerCase().includes(id.toLowerCase())) {
                    return res
                }
            }
        })
        console.log(result);
    }
}
function navigation(id) {
    navigate(`?pageId=${id}`)
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
                            uagb_excerpt
                        }
                    }
                }
            }
        `}
        render= { (data) => 
            <div>
                { wpId.wordpress_id ? 
                    <>
                    {filtering(data, +wpId.wordpress_id)}
                        <div className="documentation">
                            <h1>{result[0].node.title}</h1>
                            <div dangerouslySetInnerHTML={{__html: result[0].node.content}}></div>
                        </div>
                    </>
                : 
                    <>
                    {/* {filtering(data, wpId.searchValue)}
                        <div className="documentation">
                            <div dangerouslySetInnerHTML={{__html: result[0].node.content}}></div>
                        </div> */}
                        <div>
                            {filtering(data, wpId.searchValue)}
                            {result.length === 0 ? 
                                <div className="no-results">
                                    <h3>No Results</h3>
                                </div>
                            : 
                                <div className="searching">
                                    <h3>Matching Results..</h3>
                                    {result.map( (res) => (
                                        <h3 className="mb-3" onClick={() => navigation(res.node.wordpress_id)}>- {res.node.title}</h3>
                                    ))}
                                </div>
                            }
                        </div>
                    </>
                }
            </div>
            
        }
    />
)

export default Content