import React, { useEffect, useState } from "react"
import { Row, Col, Container } from "react-bootstrap"
import { navigate } from '@reach/router'
import { graphql, Link } from 'gatsby'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Content from "../components/content"

import fetch from 'cross-fetch';
import $ from 'jquery';




export default function UserGuide({ data }) {
    const isBr = typeof window !== `undefined`
    const childAttribute = "page_item_has_children" 

    //Fetching the Doc Tree from doc API
    const [appState, setAppState] = useState({
        loading: false,
        repos: null
    });
    useEffect( () => {
        setAppState({ loading: true });
        fetch("https://www.worksmart.net/wp-json/worksmart-custom/v1/docs-tree")
        .then((res) => res.json()) 
        .then((result)=> {
            console.log(result);
            setAppState({loading: false, repos: result});
            let cParams = new URLSearchParams(window.location.search)
            let listId = cParams.get('pageId');
            if (listId != null) { 
                $(`#`+listId).children().removeClass('collapse').addClass('arrow');
                $(`#`+listId).parents().removeClass('collapse').addClass('arrow');
                $(`#`+listId).addClass('selected')
            }
        })
    }, [setAppState]);


    if (isBr) {
        let currentParams = new URLSearchParams(window.location.search)
        let idParams = currentParams.get('pageId');
        let searchParams = currentParams.get('search');


        function handleKeyPress (event) {
            navigate(`?search=${event.target.value}`);
            currentParams.set('search', event.target.value);
            searchParams = event.target.value
          }
        

        function guideClicked(event, data, box) {
            event.stopPropagation();
            $('li').removeClass('selected')
            $(`#`+data).addClass('selected');
            console.log(data)

            if (!isNaN(box)) {
                console.log(data)
                $(`#`+data).children().removeClass('collapse')
                $(`#`+data).children().addClass('arrow');
            }
            if (event.target.children.length !== 0) {
                if ( event.target.children[0].className === 'collapse' ) {
                    event.target.children[0].classList.remove('collapse')
                    event.target.children[0].classList.add('arrow')
                } else {
                    event.target.children[0].classList.remove('arrow')
                    event.target.children[0].classList.add('collapse')
                }
            }
            navigate(`?pageId=${data}`);
            currentParams.set('pageId', data);
        }
        return (
            <Layout pageInfo={{ pageName: "user-guide" }}>
                <SEO title="User Guide" />
                <Container fluid  >
                    <Row>
                        <Col>
                            <h1 className="link"><Link to="/user-guide">User Guides</Link></h1>
                        </Col>
                        <Col className="search">
                            <div className="form">
                                <input id="search" type="text" placeholder="Search Documentation..." className="mr-2" onKeyDown={(event) => handleKeyPress(event)}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container fluid className="mt-5">
                    <Row>
                        <Col md={3} className="side-menu">
                            { appState.repos != null ? 
                                <ul>
                                    <li><Link to="/user-guide">Getting Started</Link></li>
                                    {appState.repos.documentation_tree.li.map( (res) => (
                                        <li id={res["@attributes"].class.match(/\d+/)} className={res["@attributes"].class.includes(childAttribute) ? "list-head": null}
                                        onClick={(event) => guideClicked(event, res["@attributes"].class.match(/\d+/))}>{res.a}
                                            {res.ul ? 
                                                <ul className="collapse">
                                                    {res.ul.li.length > 1 ? 
                                                        res.ul.li.map((sub1) => (
                                                            <li id={sub1["@attributes"].class.match(/\d+/)} className={sub1["@attributes"].class.includes(childAttribute) ? "list-head": null}
                                                            onClick={(event) => guideClicked(event, sub1["@attributes"].class.match(/\d+/))}>{sub1.a}
                                                                {sub1.ul ? 
                                                                    <ul className="collapse">
                                                                        {sub1.ul.li.length > 1 ? 
                                                                            sub1.ul.li.map((sub2) => (
                                                                                <li id={sub2["@attributes"].class.match(/\d+/)} className={sub2["@attributes"].class.includes(childAttribute) ? "list-head": null} 
                                                                                onClick={(event) => guideClicked(event, sub2["@attributes"].class.match(/\d+/))}>{sub2.a}
                                                                                    {sub2.ul ? 
                                                                                        <ul className="collapse">
                                                                                            {sub2.ul.li.length > 1 ?
                                                                                                sub2.ul.li.map((sub3) => (
                                                                                                    <li id={sub3["@attributes"].class.match(/\d+/)} 
                                                                                                    onClick={(event) => guideClicked(event, sub3["@attributes"].class.match(/\d+/))}>{sub3.a}</li>
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
                            { idParams === null && searchParams === null ? 
                            <Row>
                                {data.allWordpressWpManualDocumentation.edges.map(r => (
                                    r.node.wordpress_parent === 0 ?
                                        <Col md={4} sm={3} className="mb-4">
                                            <div className="user-guide" onClick={(event) => guideClicked(event, r.node.wordpress_id, 1)}>
                                                <div className="guideImage"></div>
                                                <h4>{r.node.title}</h4>
                                                <p>{r.node.uagb_excerpt}</p>
                                            </div>
                                        </Col>
                                        : null
                                ))}
                            </Row> :
                                <>
                                    { idParams ? <Content wordpress_id={idParams}/> : <Content searchValue={searchParams}/> }
                                </>
                            }
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

