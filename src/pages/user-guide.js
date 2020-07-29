import React from "react"
import { Row, Col, Container, Form, FormControl } from "react-bootstrap"
import { navigate } from '@reach/router'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Documentation from "../components/documents"

import { ApolloClient } from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo"

const client = new ApolloClient({
    link: new HttpLink({
        uri: "http://127.0.0.1:8000/___graphql"
    }),
    cache: new InMemoryCache()
});

let wordpress_id = 0 ;
let currentParams = new URLSearchParams(window.location.search)

function guideClicked(data) {
    let path = window.location.pathname
    wordpress_id = data;
    currentParams.set('pageId', data);
    navigate(`?pageId=${data}`)
    console.log(data, path, currentParams)
    // value()
}

export default function UserGuide({ data }) {

    // constructor(props) {
    //     super(props)
    //     this.state = {isClicked: false};
    // }

    // console.log(data)
    return (
        <ApolloProvider client={client}>
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
                    <Col md={3}>
                        <ul>
                        {data.allWordpressWpManualDocumentation.edges.map(r => (
                                <li onClick={() => guideClicked(r.node.wordpress_id)}>{r.node.title}</li>
                        ))}
                        </ul>
                    </Col>
                    <Col md={9}>
                        { wordpress_id === 0 ? 
                        <Row>
                            {data.allWordpressWpManualDocumentation.edges.map(r => (
                                // r.node.wordpress_parent === 0 ?
                                    <Col md={4} sm={3} className="mb-4">
                                        <div className="user-guide" onClick={() => guideClicked(r.node.wordpress_id)}>
                                            <div className="guideImage"></div>
                                            <h4>{r.node.title}</h4>
                                            <p>{r.node.uagb_excerpt}</p>
                                        </div>
                                    </Col>
                                    // : null
                            ))}
                        </Row> :
                        <Row>
                            <Col>
                                <Documentation wordpress_id={wordpress_id}/>
                            </Col>
                        </Row> }
                    </Col>
                </Row>
            </Container>
        </Layout>
        </ApolloProvider>
    )
}



export const query = graphql`
    query MyQuery {
        allWordpressWpManualDocumentation(sort: {fields: wordpress_id}, filter: {wordpress_parent: {eq: 0}}) {
            edges {
              node {
                id
                wordpress_id
                title
                uagb_excerpt
                
              }
            }
          }
    }
  
`

