import React from "react";

import { Col, Container, Nav, Row } from "react-bootstrap";
import {Link} from 'react-scroll'

import 'aos/dist/aos.css';

import footerLogo from "../../../assets/images/logo-footer.png";
import navIcon1 from "../../../assets/images/nav-icon-1.svg";
import navIcon2 from "../../../assets/images/nav-icon-2.svg";
import navIcon3 from "../../../assets/images/nav-icon-3.svg";

const Footer = () => {
    return <>
        <footer className="footer" data-aos="fade" data-aos-delay="500" data-aos-easing="ease-out-quart" data-aos-duration="1000" data-aos-once="true">
            <Container>
                <Row className="justify-content-center mb-5">
                    <Col xs={12} lg={9} className="text-center">
                        <img src={footerLogo} className="footer_logo" alt="'" />
                    </Col>
                </Row>
                <Row className="justify-content-center mt-2 mb-4">
                    <Col xs={12} lg={9} className="d-flex justify-content-center footer_links">
                        <Nav className="d-flex flex-column flex-md-row justify-content-center w-100 text-center">
                            <Nav.Item className="ms-2 me-2 mb-3 mb-2">
                                <Link href="" className="footer-link mx-0 mx-lg-3 mb-2 mb-xl-0 text-decoration-none" to="ourstory" activeClass="active" duration={1000} offset={-100} delay={100}>Our Story</Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Link href="" className="footer-link mx-0 mx-lg-3 mb-2 mb-xl-0 text-decoration-none" to="ourmission" activeClass="active" duration={1000} offset={-100} delay={100}>Our Mission</Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Link href="" className="footer-link mx-0 mx-lg-3 mb-2 mb-xl-0 text-decoration-none" to="howitwork" activeClass="active" duration={1000} offset={-100} delay={100}>How it Works</Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Link href="" className="footer-link mx-0 mx-lg-3 mb-2 mb-xl-0 text-decoration-none" to="ourteam" activeClass="active" duration={1000} offset={-100} delay={100}>Team</Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Link href="" className="footer-link mx-0 mx-lg-3 mb-2 mb-xl-0 text-decoration-none" to="faq" activeClass="active" duration={1000} offset={-100} delay={100}>Faq</Link>
                            </Nav.Item>
                        </Nav>
                        {/* <Nav className="d-flex flex-column flex-md-row justify-content-center w-100 text-center">
                            <Nav.Item className="ms-2 me-2 mb-3 mb-2">
                                <Nav.Link href="#ourstory">Our Story</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Nav.Link href="#ourstory">Our Mission</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Nav.Link href="#howitwork">How it Works</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Nav.Link href="#ourteam">Team</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="ms-2 me-2 mb-3">
                                <Nav.Link href="#faq">FAQS</Nav.Link>
                            </Nav.Item>
                        </Nav> */}
                    </Col>
                </Row>
                <Row className="justify-content-center mt-2 mb-1">
                    <Col xs={12} lg={9} className="d-flex justify-content-center">
                        <Nav>
                            <Nav.Item>
                                <Nav.Link href="#" className="ms-2 me-2"> <img src={navIcon1} className="social_icon" alt="Twitter" /></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" className="ms-2 me-2"><img src={navIcon2} className="social_icon" alt="Discord" /></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" className="ms-2 me-2"> <img src={navIcon3} className="social_icon" alt="Twitter" /></Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col xs={12} lg={9} className="d-flex justify-content-center copyright pt-3 pt-md-4 pb-3 pb-md-4 mt-4">
                        Copyright&copy; 100days.com
                    </Col>
                </Row>
            </Container>
        </footer>
    </>
}

export default Footer;