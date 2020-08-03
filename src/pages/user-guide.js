import React from "react"
import { Row, Col, Container, Form, FormControl } from "react-bootstrap"
import { navigate } from '@reach/router'
import { graphql } from 'gatsby'
import $ from 'jquery'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Documentation from "../components/documents"

import { ApolloClient } from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo"
import fetch from 'cross-fetch';


const client = new ApolloClient({
    link: new HttpLink({
        uri: "http://127.0.0.1:9000/___graphql", fetch,
    }),
    cache: new InMemoryCache()
});


export default function UserGuide({ data }) {
    const isBr = typeof window !== `undefined`
    if (isBr) {
        // let child = document.getElementsByClassName('collapse')
        // child.parent('li').classList.add('head');
        // // if ( $('.collapse').is(':empty') ) {
        //     // $('.collapse').parent('li').addClass('head')
        // // }
        let currentParams = new URLSearchParams(window.location.search)
        let params = currentParams.get('pageId');

        function guideClicked(data, event) {
            console.log(data);
            event.stopPropagation();
            if (event.target.children.length !== 0) {
                if ( event.target.children[0].className === 'collapse' ) {
                    event.target.children[0].classList.remove('collapse')
                    event.target.children[0].classList.add('arrow')
                } else {
                    event.target.children[0].classList.remove('arrow')
                    event.target.children[0].classList.add('collapse')
                }
            }
            params = data;
            navigate(`?pageId=${data}`);
            currentParams.set('pageId', data);
        }
        return (
            <ApolloProvider client={client}>
                {
            <Layout pageInfo={{ pageName: "user-guide" }}>
                <SEO title="User Guide" />
                <Container fluid  >
                    <Row>
                        <Col>
                            <h1>User Guides</h1>
                        </Col>
                        <Col className="search">
                            <Form className="justify-content-end" inline onSubmit={e => e.preventDefault()}>
                                <Form.Group>
                                    <FormControl
                                        type="text"
                                        placeholder="Search Documentation..."
                                        className="mr-2"
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <Container fluid className="mt-5">
                    <Row>
                        <Col md={3} className="side-menu">
                            <ul>
                            {data.allWordpressWpManualDocumentation.edges.map(r => (
                                    r.node.parent_element === null ?
                                    <>
                                    <li className="list-head" onClick={(event) => guideClicked(r.node.wordpress_id, event)}>{r.node.title}
                                    <ul className="collapse">
                                    { data.allWordpressWpManualDocumentation.edges.map(sub1 => (
                                            sub1.node.parent_element != null ?
                                            sub1.node.parent_element.wordpress_id === r.node.wordpress_id ?
                                            <>
                                                <li className="list-head" onClick={(event) => guideClicked(sub1.node.wordpress_id, event)}>{sub1.node.title}
                                                    <ul className="collapse">
                                                        { data.allWordpressWpManualDocumentation.edges.map(sub2 => (
                                                            sub2.node.parent_element != null ?
                                                            sub2.node.parent_element.wordpress_id === sub1.node.wordpress_id ? 
                                                                <>
                                                                    <li className="list-head" onClick={(event) => guideClicked(sub2.node.wordpress_id, event)}>{sub2.node.title}
                                                                        <ul className="collapse">
                                                                            { data.allWordpressWpManualDocumentation.edges.map( sub3 => (
                                                                                sub3.node.parent_element != null ? 
                                                                                sub3.node.parent_element.wordpress_id === sub2.node.wordpress_id ?
                                                                                    <><li onClick={(event) => guideClicked(sub3.node.wordpress_id, event)}>{sub3.node.title}</li></>
                                                                                : null : null                                                                           
                                                                            ))}
                                                                        </ul>
                                                                    </li>
                                                                </>
                                                            : null : null
                                                        ))}
                                                    </ul>
                                                </li>
                                            </>  
                                            : null
                                            : null
                                        ))}
                                    </ul></li>
                                    </>
                                    : null
                            ))}
                            </ul>
                        </Col>
                            <Col md={9}>
                                { params === null ? 
                                <Row>
                                    {data.allWordpressWpManualDocumentation.edges.map(r => (
                                        r.node.wordpress_parent === 0 ?
                                            <Col md={4} sm={3} className="mb-4">
                                                <div className="user-guide" onClick={(event) => guideClicked(r.node.wordpress_id, event)}>
                                                    <div className="guideImage"></div>
                                                    <h4>{r.node.title}</h4>
                                                    <p>{r.node.uagb_excerpt}</p>
                                                </div>
                                            </Col>
                                            : null
                                    ))}
                                </Row> :
                                <Row>
                                    <Col className="pl-5">
                                        <Documentation wordpress_id={+params}/>
                                    </Col>
                                </Row> }
                            </Col>
                    </Row>
                </Container>
            </Layout>
            }
            </ApolloProvider>
        )
    }
    else {
        return (
            <div></div>
        )
    }
    


}



export const query = graphql`
    query MyQuery {
        allWordpressWpManualDocumentation(sort: {fields: wordpress_id}) {
            edges {
              node {
                id
                wordpress_id
                title
                uagb_excerpt
                wordpress_parent
                parent_element {
                    wordpress_id 
                }
              }
            }
          }
    }
  
`

