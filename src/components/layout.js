/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"

import { Container, Row, Col, Button } from "react-bootstrap"

import Header from "./header"
import Navbar from "./navBar"

const Layout = ({ children, pageInfo }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Container fluid className="px-0 main">
          <Row noGutters className="header justify-content-center">
            <Col>
              <Header siteTitle={data.site.siteMetadata.title} />
            </Col>
            <Col>
              <Navbar pageInfo={pageInfo} />
            </Col>
          </Row>
          <Row noGutters>
            <Col>
              <Container fluid className="mt-5">
                <main>{children}</main>
              </Container>
            </Col>
          </Row>
        </Container>
        <Container fluid className="px-0">
          <Row noGutters className="footer">
            <Col md={8} sm={6}>
              <img src={`../../worklogo.png`} alt={`Work Smart logo`}/>
              <p className="mt-3">Copyright © 2020 Desinglinks International.<br/>All Rights Reserved.</p>
            </Col>
            <Col md={2} sm={3}>
              <h6 className="mb-4">About WorkSmart</h6>
              <ul>
                <li><a href="https://www.worksmart.net/about-us/" target="blank">Corporate Overview</a></li>
                <li><a href="https://www.worksmart.net/contact-us/" target="blank">Contact Us</a></li>
                <li><a href="" target="blank">Developers</a></li>
                <li><a href="https://www.worksmart.net/terms-of-use/" target="blank">Terms of Use</a></li>
                <li><a href="https://www.worksmart.net/trust/" target="blank">Trust © worksmart</a></li>
              </ul>
            </Col>
            <Col md={2} sm={3}>
              <Button >SIGN-UP. IT's FREE</Button>
            </Col>
          </Row>
        </Container>
      </>
    )}
  />
)

export default Layout
