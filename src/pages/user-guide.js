import React, { useEffect, useState } from "react"
import { Row, Col, Container, Form, FormControl } from "react-bootstrap"
import { navigate } from '@reach/router'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Content from "../components/content"

import fetch from 'cross-fetch';




export default function UserGuide({ data }) {
    const isBr = typeof window !== `undefined`

    //Fetching the Doc Tree from doc API
    const [appState, setAppState] = useState({
        loading: false,
        repos: null
    });
    useEffect( () => {
        setAppState({ loading: true });
        fetch("https://www.worksmart.net/wp-json/worksmart-custom/v1/docs-tree")
        .then((res) => res.json()) 
        .then((result)=> {setAppState({loading: false, repos: result})});
    }, [setAppState]);


    if (isBr) {
        let searchValue = 2;
        console.log(appState.repos)
        let currentParams = new URLSearchParams(window.location.search)
        let params = currentParams.get('pageId');

        function guideClicked(event, data) {
            event.stopPropagation();
            console.log(data[0])
            if (event.target.children.length !== 0) {
                if ( event.target.children[0].className === 'collapse' ) {
                    event.target.children[0].classList.remove('collapse')
                    event.target.children[0].classList.add('arrow')
                } else {
                    event.target.children[0].classList.remove('arrow')
                    event.target.children[0].classList.add('collapse')
                }
            }
            params = data[0];
            navigate(`?pageId=${data}`);
            currentParams.set('pageId', data);
        }
        return (
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
                            { appState.repos != null ? 
                                <ul>
                                    {appState.repos.documentation_tree.li.map( (res) => (
                                        <li className="list-head" onClick={(event) => guideClicked(event, res["@attributes"].class.match(/\d+/))}>{res.a}
                                            {res.ul ? 
                                                <ul className="collapse">
                                                    {res.ul.li.length > 1 ? 
                                                        res.ul.li.map((sub1) => (
                                                            <li className="list-head" onClick={(event) => guideClicked(event, sub1["@attributes"].class.match(/\d+/))}>{sub1.a}
                                                                {sub1.ul ? 
                                                                    <ul className="collapse">
                                                                        {sub1.ul.li.length > 1 ? 
                                                                            sub1.ul.li.map((sub2) => (
                                                                                <li className="list-head" onClick={(event) => guideClicked(event, sub2["@attributes"].class.match(/\d+/))}>{sub2.a}
                                                                                    {sub2.ul ? 
                                                                                        <ul className="collapse">
                                                                                            {sub2.ul.li.length > 1 ?
                                                                                                sub2.ul.li.map((sub3) => (
                                                                                                    <li onClick={(event) => guideClicked(event, sub3["@attributes"].class.match(/\d+/))}>{sub3.a}</li>
                                                                                                ))
                                                                                            :null}
                                                                                        </ul>
                                                                                    : null}
                                                                                </li>
                                                                            ))
                                                                        : null}
                                                                    </ul>
                                                                : null}
                                                            </li>
                                                        )) 
                                                    : null}
                                                </ul>
                                            : null }
                                        </li>
                                        
                                    ))}
                                </ul>
                            : null}
                        </Col>
                        <Col md={9}>
                            { params === null ? 
                            <Row>
                                {data.allWordpressWpManualDocumentation.edges.map(r => (
                                    r.node.wordpress_parent === 0 ?
                                        <Col md={4} sm={3} className="mb-4">
                                            <div className="user-guide" onClick={(event) => guideClicked(event, r.node.wordpress_id)}>
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
                                    <Content wordpress_id={+params}/>
                                </Col>
                            </Row> }
                        </Col>
                    </Row>
                </Container>
            </Layout>
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

