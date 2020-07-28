import React from "react"
import { Row, Col, Container, Form, FormControl } from "react-bootstrap"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Documentation from "../components/documents"


// const userGuide = ({data}) => (

// )

function guideClicked(data) {
    console.log(data)
}

export default function UserGuide({ data }) {
    // console.log(data)
    return (
        <Layout pageInfo={{ pageName: "user-guide" }}>
            <SEO title="User Guide" />
            <Container fluid >
                <Row>
                    <Col>
                        <h1>User Guides</h1>
                    </Col>
                    <Col >
                        <Form className="justify-content-end" inline onSubmit={e => e.preventDefault()}>
                            <Form.Group>
                                <FormControl
                                    type="text"
                                    placeholder="Search"
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
                        {data.allWordpressWpManualDocumentation.edges.map(r => (
                            <ul>
                                <li>{r.node.title}</li>
                            </ul>
                        ))}
                    </Col>
                    <Col md={9}>
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
                        </Row>
                        <Row>
                            <Documentation/>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}



export const query = graphql`
    query MyQuery {
        allWordpressWpManualDocumentation(sort: {fields: menu_order}, filter: {wordpress_parent: {eq: 0}}) {
            edges {
              node {
                id
                title
                excerpt
              }
            }
          }
    }
  
`

