import React, { useEffect } from 'react'
import { StaticQuery, graphql, navigate } from "gatsby"
import $ from 'jquery'

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
    }
}
function navigation(id) {
    navigate(`?pageId=${id}`)
    $('li').removeClass('selected')
    $(`#`+id).children().removeClass('collapse').addClass('arrow');
    $(`#`+id).parents().removeClass('collapse').addClass('arrow');
    $(`#`+id).addClass('selected')
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
            <>
                { wpId.wordpress_id ? 
                    <>
                    {filtering(data, +wpId.wordpress_id)}
                        <div className="documentation pl-5">
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
                        <>
                            {filtering(data, wpId.searchValue)}
                            {result.length === 0 ? 
                                <div className="no-results">
                                    <img src={`../../warning.svg`}/>
                                    <h3>No Results</h3>
                                </div>
                            : 
                                <div className="searching pl-5">
                                    <div className="mb-3 d-flex">
                                        <img className="mr-3" src={`../../check.svg`}/>
                                        <h3 >Matching Results..</h3>
                                    </div>
                                    <div className="results">
                                        {result.map( (res) => (
                                            <p onClick={() => navigation(res.node.wordpress_id)}>-> <strong>{res.node.title}</strong></p>
                                        ))}
                                    </div>
                                </div>
                            }
                        </>
                    </>
                }
            </>
            
        }
    />
)

export default Content