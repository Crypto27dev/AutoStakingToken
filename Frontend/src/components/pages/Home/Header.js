import React, { useEffect } from "react";
import { navigate } from '@reach/router';
import { Link } from 'react-scroll'
import { useScrollSection } from "react-scroll-section";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

import logoMain from "../../../assets/images/logo.png";
import navIcon1 from "../../../assets/images/nav-icon-1.svg";
import navIcon2 from "../../../assets/images/nav-icon-2.svg";
import navIcon3 from "../../../assets/images/nav-icon-3.svg";

const Header = () => {
    const ourstory = useScrollSection('ourstory');
    const ourmission = useScrollSection('ourmission');
    const howitwork = useScrollSection('howitwork');
    const ourteam = useScrollSection('ourteam');
    const faq = useScrollSection('faq');
    
    useEffect(() => {
        const header = document.getElementById("my_nav");
        const totop = document.getElementById("scroll-to-top");
        const sticky = header.offsetTop;
        const scrollCallBack = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
                totop.classList.add("show");

            } else {
                header.classList.remove("sticky");
                totop.classList.remove("show");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, []);

    return <>
        <Navbar id="my_nav" collapseOnSelect expand="xl" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand href="/"><img src={logoMain} className="img-fluid" alt="Astro" data-aos="zoom-in" data-aos-delay="400" data-aos-easing="ease-out-quart" data-aos-duration="800" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto mt-4 mt-lg-0">
                        <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0" onClick={() => ourstory.onClick()} selected={ourstory.selected} to="">Our Story</Link>
                        <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" onClick={() => ourmission.onClick()} selected={ourmission.selected} to="">Our Mission</Link>
                        <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" onClick={() => howitwork.onClick()} selected={howitwork.selected} to="">How it Works</Link>
                        <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" onClick={() => ourteam.onClick()} selected={ourteam.selected} to="">Team</Link>
                        <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" onClick={() => faq.onClick()} selected={faq.selected} to="">FAQs</Link>

                        {/* <Nav.Link href="#ourstory" className="ms-0 ms-lg-2 me-0 me-lg-2" to="ourstory" activeClass="active" spy={true} smooth={true} duration={1000} >Our Story</Nav.Link>
                        <Nav.Link href="#ourmission" className="ms-0 ms-lg-2 me-0 me-lg-2" to="ourmission" activeClass="active" spy={true} smooth={true} duration={1000}>Our Mission</Nav.Link>
                        <Nav.Link href="#howitwork" className="ms-0 ms-lg-2 me-0 me-lg-2" to="howitwork" activeClass="active" spy={true} smooth={true} duration={1000}>How it Works</Nav.Link>
                        <Nav.Link href="#ourteam" className="ms-0 ms-lg-2 me-0 me-lg-2" to="ourteam" activeClass="active" spy={true} smooth={true} duration={1000}>Team</Nav.Link>
                        <Nav.Link href="#faq" className="ms-0 ms-lg-2 me-0 me-lg-2" to="faq" activeClass="active" spy={true} smooth={true} duration={1000}>FAQs</Nav.Link> */}
                        {/* offset={50} */}
                        {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    <Nav className="flex-row mb-3 mb-xl-0 mt-2 mt-xl-0">
                        <Nav.Link href="#" className="ms-0 ms-lg-3 me-4 me-lg-2"><img src={navIcon1} alt="Twitter" /></Nav.Link>
                        <Nav.Link href="#" className="ms-0 ms-lg-2 me-4 me-lg-2"><img src={navIcon2} alt="Discord" /></Nav.Link>
                        <Nav.Link href="#" className="ms-0 ms-lg-2 me-4 me-lg-4"><img src={navIcon3} alt="Medium" /></Nav.Link>
                    </Nav>
                    <Button variant="primary" className="me-3 btn-arrow-bg mb-3 mb-xl-0" onClick={() => navigate('/dashboard')}>Launch App <i className="icon"></i></Button>
                    {/* <Link to="/dashboard" className="btn me-3 btn-arrow-bg mb-3 mb-xl-0">Launch App <i className="icon"></i></Link> */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}

export default Header;