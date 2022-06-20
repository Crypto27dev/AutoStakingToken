import React, { useEffect } from "react";
import { navigate } from '@reach/router';
import AOS from 'aos';

import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import {
    ScrollingProvider,
    Section,
  } from "react-scroll-section";

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import ReactTypingEffect from 'react-typing-effect';

import Slider from "react-slick";
import 'aos/dist/aos.css';

import Header from './Header';
import Footer from "./Footer";
import BannerAnim from "./BannerAnim";

import floatImg1 from "../../../assets/images/dots-img.png";
import storyRoungImg from "../../../assets/images/round-image.png";
import omsImg1 from "../../../assets/images/oms-icon-1.svg";
import omsImg2 from "../../../assets/images/oms-icon-2.svg";
import omsImg3 from "../../../assets/images/oms-icon-3.svg";
import ourteamImg1 from "../../../assets/images/team-member-1.png";
import ourteamImg2 from "../../../assets/images/team-member-2.png";
import ourteamImg3 from "../../../assets/images/team-member-3.png";
import bannerLeftBg from "../../../assets/images/banner-bg-left.jpg";
import bannerGridBg from "../../../assets/images/banner-grid-img.png";
import bannerRocketOrange from "../../../assets/images/rocket-orange.svg";
import howitImage from "../../../assets/images/how-it-img.png";
import '../../../assets/home.scss';

const settings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                settings: "unslick"
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                settings: "unslick"
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
};

const omsSettings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
                settings: "unslick"
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 1,
                settings: "unslick"
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
};

const omsData = [
    {
        key: 1,
        icon: omsImg1,
        title: 'NTFS',
        content: 'We are harnessing the untapped potential of NFT’s. Using the existing mechanics to build financial modeling overarching, iconic digital art. Providing investors consistent fixed income in Stablecoins while maintaining an established art presence. Each NFT will provide intrinsic art value, stablecoin returns along with exclusive future benefits. Every NFT we issue will be backed via our treasury in a multitude of assets.',
    },
    {
        key: 2,
        icon: omsImg2,
        title: 'Investments',
        content: 'We believe the key to having successful investments is by having a plan for everything. We combine the deep expertise of our team who live and breathe crypto along with our community members who do the same. Allowing us to gather a broader range and perspective. Leading us to make the best investment decisions possible. Applying advanced hedging techniques and solid expertise, the team is able to reliably outperform major assets, while barely gaining exposure to risk throughout the process.',
    },
    {
        key: 3,
        icon: omsImg3,
        title: 'Exclusive',
        content: 'A key aspect to our project is our set supply of NTfs for every drop. By being an early part of our investment community, you will not only get fixed income & high quality art but also unlock exclusive benefits to our community. These will include everything from real-world perks to future airdrops and many more unique benefits.',
    },
]



const HomePage = () => {
    useEffect(() => {
        AOS.init();
    }, []);
    // const { pathname } = window.location;
    // useEffect(() => {
    //     window.scrollTo(50, 0);
    // }, [pathname]);


    return (
        <div className="home_page">
            <ScrollingProvider scrollBehavior="smooth">
                <Header />
                <Section className="home_banner" style={{ background: `url(${bannerLeftBg}) no-repeat left center`, }}>
                    <Container>
                        <Row className="justify-content-center align-items-center flex-row-reverse">
                            <Col xs={12} md={7} lg={6} className="pe-2 pe-md-0 pe-lg-5 order-1">
                                <div className="banner_left" data-aos='fade-left' data-aos-delay='350' data-aos-duration="1000">
                                    <div className="d-flex align-items-center me-2 mb-4">
                                        <span className="d-inline-block me-1 me-md-2 anim_text_icon">
                                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.0323 23.4668L14.949 29.9173L12.8656 23.4671C12.3813 21.9637 11.5465 20.5972 10.4303 19.4802C9.31411 18.3633 7.94843 17.528 6.44602 17.0433L0 14.9587L6.44602 12.874C7.94843 12.3893 9.31411 11.554 10.4303 10.4371C11.5465 9.32013 12.3813 7.95358 12.8656 6.45019L14.949 0L17.0323 6.45019C17.5167 7.95358 18.3514 9.32013 19.4677 10.4371C20.5839 11.554 21.9495 12.3893 23.4519 12.874L29.898 14.9587L23.4519 17.0433C21.9499 17.5287 20.5846 18.3642 19.4685 19.4809C18.3524 20.5977 17.5174 21.9639 17.0323 23.4668V23.4668Z" fill="white" />
                                            </svg>
                                        </span>
                                        <ReactTypingEffect
                                            text={["ROI in about 100 Days", "Cash Out Anytime", "Up to 4.5x return over 24 months", "Collectable NFT Art", "Sellable", "Secure & Transparent", "7 Rewards paid in Stablecoins", "8 Continuous Innovation"]}
                                            speed={"60"} eraseSpeed={"30"} eraseDelay={"3000"} typingDelay={"30"}
                                            className={"type_text"}
                                            cursorClassName={"type_cursor"}

                                        />
                                    </div>
                                    <h1 className="banner_title mb-4" data-aos='fade-up'>Income <span className="rocket_icon"><img src={bannerRocketOrange} alt="Can't load" /></span> Generating NFTs</h1>
                                    <p className="mb-4" data-aos='fade-up' data-aos-delay='150'>100 days will allow our investors to earn consistent returns in stablecoins while maintaining an established art presence.</p>
                                    <div className="pt-3 d-lg-flex" data-aos='fade-up' data-aos-delay='250'>
                                        <Button variant="primary" className="me-3 me-md-3">Let’s Start it</Button>
                                        <Button className="btn-arrow ms-2 ms-lg-4 mt-0 mt-sm-0 mt-md-4 mt-lg-0">Explore more <i className="icon"></i></Button>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={5} lg={6} className="d-none d-md-block">
                                <div className="home_banner_img" data-aos='zoom-in' data-aos-delay='350' data-aos-duration="1000">
                                    <img src={bannerGridBg} className="banner_grid_img" alt="Can't load" />
                                    {/* <img src={bannerImg} className="img-fluid" alt="Can't load" /> */}
                                    <BannerAnim />
                                </div>
                            </Col>
                        </Row>
                        <div className="float-img float-img1 d-none d-md-block" data-aos='fade' data-aos-delay='450'>
                            <img src={floatImg1} alt="Can't load" />
                        </div>
                    </Container>
                </Section>

                <Section id="ourstory" className="our_story">
                    <Container>
                        <div className="story_block_outer">
                            <div className="story_block_inner">
                                <div className="story_round_img">
                                    <img src={storyRoungImg} className="" alt="Can't load" />
                                </div>
                                <Row className="justify-content-center align-items-center flex-row-reverse">
                                    <Col xs={12} md={12} lg={6} className="pe-3 pe-xl-5 order-1" data-aos='fade-up' data-aos-delay='50' data-aos-once="true">
                                        <h2 className="section_title mb-4">Our Story</h2>
                                        <p className="mb-4 text-common">
                                            Time is an increasing concept. Once it passes there is no going back, only memories to be had. Our current world sees work as the more time you put in, the more monetary value one will receive. Unlike time, which is very linear, finance is not. Growing up these are the only constructs we’ve ever known. We all, as humans, go through hardship – reminiscing the times we could have had, if only there was a way to get this future time back in our hands. This is where our journey began. A hunger to get our time back, and to provide for our families in a safe and secure way. To achieve this dream, one must think out of the box. Crypto opens up the world to these possibilities. In identifying this, we dove head first, learning anything and everything we could about this paradigm shift and identifying gaps; what worked and what didn’t. From this 100 days was born. Innovating in a world where technology, art and finance merge to be one. Imagine you buy an art piece you love. Now imagine this artwork pays you a fixed amount daily in dollars, getting every dollar you spent back in about 100 days - with rewards lasting much longer. This is 100 days.
                                        </p>
                                        <div className="pt-2 pt-md-3 d-flex">
                                            <Button variant="primary" className="me-3 me-md-3">Whitepaper</Button>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={12} lg={6} className="mb-4 mb-lg-0 pb-4 pb-lg-0" data-aos='fade-left' data-aos-delay='50' data-aos-once="true">
                                        <div className="story_img_block">
                                            {/* <div className="play_icon d-flex justify-content-center align-items-center">
                                        <svg width="49" height="55" viewBox="0 0 49 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M46 22.3038C50 24.6132 50 30.3868 46 32.6962L9.25 53.9138C5.25 56.2232 0.249997 53.3364 0.249997 48.7176L0.249999 6.28237C0.25 1.66357 5.25 -1.22318 9.25 1.08622L46 22.3038Z" fill="#D7E3F4" />
                                        </svg>
                                    </div> */}

                                            {/* <img src={storyImg} className="story_img" alt="Can't load" /> */}
                                            <iframe width="560" height="415" src="https://www.youtube-nocookie.com/embed/cI4ryatVkKw?controls=0" title="Astro Introduction" allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"></iframe>
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Container>
                </Section>

                <Section id="ourmission" className="our_mission">
                    <Container>
                        <Row className="justify-content-center mb-4">
                            <Col xs={12} lg={9} className="text-center">
                                <h2 className="section_title mb-4" data-aos='fade-up' data-aos-delay='50' data-aos-once="true">Our Mission</h2>
                                <p className="mb-4 text-common" data-aos='fade-up' data-aos-delay='200' data-aos-once="true">We look to provide our investors stable consistent returns beyond the traditional financial world. We all know the power of bonds, real estate, indexes and the security they can provide. However, we also know these will take decades before we see the fruits of our labor. Therefore, we are maximizing the opportunity crypto presents us with, to emerge as market leaders in research and innovation in this dawn of a new financial age. Too many projects have failed, rug pulled, overpromised and under-delivered – and thus, we look to change this narrative. Here, at 100 days, we pride ourselves on safety, transparency, strategic investments, and innovation.
                                </p>
                            </Col>

                        </Row>


                        <Row className="mb-5 mt-5">
                            <Col>
                                <Slider {...omsSettings}>
                                    {omsData.map(item => {
                                        return (
                                            <div key={item.key}>
                                                <div className="our_mission_item">
                                                    <div className="oms_item_inner">
                                                        <div className="os_icon mb-4 mt-3 mt-lg-4 d-flex justify-content-start">
                                                            <img src={item.icon} className="team_member_img" alt="Can't load" />
                                                        </div>
                                                        <h3 className="block_title mb-3">{item.title}</h3>
                                                        <p className="mb-4 text-common">{item.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </Col>
                        </Row>
                        {/* <Row>
                    <Col xs={12} md={6} lg={4} className="mb-3 mb-lg-0" data-aos='fade-left' data-aos-delay='250' data-aos-once="true">
                        <div className="our_mission_item">
                            <div className="oms_item_inner">
                                <div className="os_icon mb-4 mt-3 mt-lg-4 d-flex justify-content-start">
                                    <img src={omsImg1} className="oms_img" alt="Can't load" />
                                </div>
                                <h3 className="block_title mb-3">NTFS</h3>
                                <p className="mb-4 text-common">We are harnessing the untapped potential of NFT’s. Using the existing mechanics to build financial modeling overarching, iconic digital art. Providing investors consistent fixed income in Stablecoins while maintaining an established art presence. Each NFT will provide intrinsic art value, stablecoin returns along with exclusive future benefits. Every NFT we issue will be backed via our treasury in a multitude of assets.
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-3 mb-lg-0" data-aos='fade-left' data-aos-delay='350' data-aos-once="true">
                        <div className="our_mission_item">
                            <div className="oms_item_inner">
                                <div className="os_icon mb-4 mt-3 mt-lg-4 d-flex justify-content-start">
                                    <img src={omsImg2} className="oms_img" alt="Can't load" />
                                </div>
                                <h3 className="block_title mb-3">Investments</h3>
                                <p className="mb-4 text-common">We believe the key to having successful investments is by having a plan for everything. We combine the deep expertise of our team who live and breathe crypto along with our community members who do the same. Allowing us to gather a broader range and perspective. Leading us to make the best investment decisions possible. Applying advanced hedging techniques and solid expertise, the team is able to reliably outperform major assets, while barely gaining exposure to risk throughout the process.
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-3 mb-lg-0" data-aos='fade-left' data-aos-delay='500' data-aos-once="true">
                        <div className="our_mission_item">
                            <div className="oms_item_inner">
                                <div className="os_icon mb-4 mt-3 mt-lg-4 d-flex justify-content-start">
                                    <img src={omsImg3} className="oms_img" alt="Can't load" />
                                </div>
                                <h3 className="block_title mb-3">Exclusive</h3>
                                <p className="mb-4 text-common">A key aspect to our project is our set supply of NTfs for every drop. By being an early part of our investment community, you will not only get fixed income &amp; high quality art but also unlock exclusive benefits to our community. These will include everything from real-world perks to future airdrops and many more unique benefits.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row> */}
                    </Container>
                </Section>

                <Section id="howitwork" className="howit_works">
                    <Container fluid>
                        <Row className="align-items-center">
                            <Col xs={12} md={4} lg={4} className="mb-3 mb-lg-0 ps-0 pe-0 pe-lg-3" data-aos='fade-left' data-aos-delay='500' data-aos-duration="1200" data-aos-once="true">
                                <div className="howit_image_block">
                                    <div className="play_icon d-flex justify-content-center align-items-center">
                                        <svg width="49" height="55" viewBox="0 0 49 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M46 22.3038C50 24.6132 50 30.3868 46 32.6962L9.25 53.9138C5.25 56.2232 0.249997 53.3364 0.249997 48.7176L0.249999 6.28237C0.25 1.66357 5.25 -1.22318 9.25 1.08622L46 22.3038Z" fill="#D7E3F4" />
                                        </svg>
                                    </div>
                                    <img src={howitImage} className="team_member_img" alt="Can't load" />
                                </div>
                            </Col>
                            <Col xs={12} md={8} lg={8} className="mb-3 mb-lg-0 mt-4 mt-md-0 pb-5 px-4">
                                <h2 className="section_title mb-3" data-aos='zoom-in' data-aos-delay='700' data-aos-once="true">How it works</h2>
                                <p className="mb-4 text-common subtext mb-4" data-aos='zoom-in' data-aos-delay='900' data-aos-once="true">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
                                </p>
                                <div className="howit_slider pt-3 pb-4" data-aos='fade-up' data-aos-delay='1000' data-aos-duration="1000" data-aos-once="true">
                                    <Slider {...settings}>
                                        <div>
                                            <div className="howit_slider_block">
                                                <div className="slider_block_inner">
                                                    <h3 className="block_title mb-3">Open Browser compatible with MetaMask</h3>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="howit_slider_block">
                                                <div className="slider_block_inner">
                                                    <h3 className="block_title mb-3">Make sure you are on the Avalanche Network</h3>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="howit_slider_block">
                                                <div className="slider_block_inner">
                                                    <h3 className="block_title mb-3">Connect Wallet to website</h3>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="howit_slider_block">
                                                <div className="slider_block_inner">
                                                    <h3 className="block_title mb-3">Find the active NFT sale group and pick your favorite NFT (s)</h3>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Slider>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Section>

                <Section id="ourteam" className="our_team">
                    <Container>
                        <Row className="justify-content-center mb-4">
                            <Col xs={12} lg={9} className="text-center" data-aos="zoom-in" data-aos-delay="100" data-aos-easing="ease-out-quart" data-aos-once="true">
                                <h2 className="section_title mb-4">Our Team</h2>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12} md={6} lg={4} className="mb-3 mb-lg-0" data-aos="fade-up" data-aos-delay="100" data-aos-easing="ease-out-quart" data-aos-once="true">
                                <div className="our_team_item d-flex justify-content-center">
                                    <div className="our_team_item_inner">
                                        <div className="ot_image_block">
                                            <img src={ourteamImg1} className="team_member_img" alt="Can't load" />
                                        </div>
                                        <div className="team_hover_content p-3 p-lg-4 d-flex justify-content-center flex-column">

                                            <h3 className="block_title mb-2">Arsh Johri</h3>
                                            <SimpleBar style={{ maxHeight: "84%" }}>
                                                <p className="mb-0 text-common text-white">Arsh is a Co-founder of 100 days. He is currently enrolled at Princeton University as a double major in Financial Engineering and Neuroscience. He is a researcher by nature, as we all know, once someone starts researching crypto they never stop. This is what fascinates and drives Arsh, in what he believes to be the new age of finance. In his eyes, crypto is where Finance, Technology and Art merge in harmony. Arsh has been a leader of both Financial and Neuroscience boards hosting events with several fortune 500 companies raising over 15 million in funding for local organizations. He believes the best way to learn anything is via a collaborative effort truly being in tune with the community and leveraging their knowledge in every way possible.
                                                </p>
                                            </SimpleBar>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={4} className="mb-3 mb-lg-0" data-aos="fade-up" data-aos-delay="300" data-aos-easing="ease-out-quart" data-aos-once="true">
                                <div className="our_team_item d-flex justify-content-center">
                                    <div className="our_team_item_inner">
                                        <div className="ot_image_block">
                                            <img src={ourteamImg2} className="team_member_img" alt="Can't load" />
                                        </div>
                                        <div className="team_hover_content p-3 p-md-4 d-flex justify-content-center flex-column">
                                            <h3 className="block_title mb-2">Rohit Chopra</h3>
                                            <SimpleBar style={{ maxHeight: "84%" }} forceVisible="y" autoHide={false}>
                                                <p className="mb-0 text-common text-white">Rohit is a Co-founder of 100 days. He started as a crypto enthusiast turned investor.
                                                    Quickly realizing the true utility and power of the underlying blockchain technology and
                                                    the positive impact it can have on society as a whole. Giving power back to the people.
                                                    The change is much bigger than we can imagine. Before that, Rohit worked in several
                                                    leadership and strategy roles in Technology across multiple industries. He was a Tech
                                                    Executive at T-mobile. Others at Walt Disney Company, PriceWaterhouseCoopers,
                                                    Citigroup and Microsoft. In his 20’s, Rohit formed a private Real Estate Trust Fund and
                                                    built it up to a 30M fund in less than a year. Along with that he has formed a Boutique
                                                    Fitness business from scratch and scaled it to multiple locations across the Greater
                                                    Seattle area. Rohit dropped out of Harvard to pursue his dreams. He has a growth
                                                    mindset &amp; is a Trusted leader with proven capability to successfully navigate uncharted
                                                    waters, devise the big picture and execute with strategy and tactics to drive it all the way
                                                    through multiple domains, delivering high value to its community
                                                </p>
                                            </SimpleBar>
                                        </div>

                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={6} lg={4} className="mb-3 mb-lg-0" data-aos="fade-up" data-aos-delay="500" data-aos-easing="ease-out-quart" data-aos-once="true">
                                <div className="our_team_item d-flex justify-content-center">
                                    <div className="our_team_item_inner">
                                        <div className="ot_image_block">
                                            <img src={ourteamImg3} className="team_member_img" alt="Can't load" />
                                        </div>
                                        <div className="team_hover_content p-3 p-md-4 d-flex justify-content-center flex-column">
                                            <h3 className="block_title mb-2">Arsh Johri</h3>
                                            <SimpleBar style={{ maxHeight: "84%", paddingRight: "10px" }} className="pe-1">
                                                <p className="mb-0 text-common text-white">Arsh is the CEO and Co-founder of 100 days. He is currently enrolled at Princeton University as a double major in Financial Engineering and Neuroscience. He is a researcher by nature, as we all know, once someone starts researching crypto they never stop. This is what fascinates and drives Arsh, in what he believes to be the new age of finance. In his eyes, crypto is where Finance, Technology and Art merge in harmony. Arsh has been a leader of both Financial and Neuroscience boards hosting events with several fortune 500 companies raising over 15 million in funding for local organizations
                                                </p>
                                            </SimpleBar>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </Container>
                </Section>

                <Section id="faq" className="faqs_section">
                    <Container>
                        <div className="faqs_block" data-aos="zoom-in" data-aos-delay="700" data-aos-easing="ease-out-quart" data-aos-duration="500" data-aos-once="true">
                            <div className="faqs_inner">
                                <Row className="justify-content-center mb-4">
                                    <Col xs={12} lg={9} className="text-center">
                                        <h2 className="section_title mb-4">FAQ’s</h2>
                                        <p className="mb-4 text-common">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
                                        </p>
                                    </Col>
                                </Row>

                                <Row className="justify-content-center">
                                    <Col xs={12} lg={9}>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>What is 100 Days?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    100 days is an Income generating NFT project
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="1">
                                                <Accordion.Header>Who created 100 days?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    100 days was created by Rohit &amp; Arsh. However none of this would be
                                                    possible without our talented team.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="2">
                                                <Accordion.Header>How to buy 100 days?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    Our NFT’s can be found once “Launch App” is pressed. This will take you
                                                    to our website where they will be available for purchase under the “Mint”
                                                    tab. New NFT’s will be released on the first of every month.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="3">
                                                <Accordion.Header>What token are your rewards given in?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    All our investors will receive daily rewards in stablecoins.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="4">
                                                <Accordion.Header>Are you guys safe?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    We believe we have taken every precaution possible to make our
                                                    investors as protected as possible. This includes having a publicly
                                                    DOXXED team as well as audited code. Our full safety plan is highlighted
                                                    in our white paper
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="5">
                                                <Accordion.Header>What is the artistic value of your NFTs?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    The artistic value of our NFT’s vary from tier to tier. Some may be created
                                                    by your favorite artist, contact creator or brand.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="6">
                                                <Accordion.Header>What's the value of making the NFT sellable?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    The value behind having sellable NFT’s the second they are minted is this
                                                    gives our users the ability to cash out at any point of their choosing. Giving
                                                    true ownership to the users.

                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="7">
                                                <Accordion.Header>Is this a Passive Income Project?</Accordion.Header>
                                                <Accordion.Body className="pt-1">
                                                    Yes this is what's beautiful about 100 days. Once you buy an NFT you
                                                    receive daily rewards with no input needed from the user. Allowing our
                                                    users to live life to its fullest without needing to constantly check there
                                                    computer.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col xs={12} className="mt-4 d-flex justify-content-center faq_more_btn">
                                        <span onClick={() => navigate('/faq')} className="btn btn-primary me-3 me-md-3">Read More</span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Container>
                </Section>
                <Footer />
            </ScrollingProvider>
        </div>)
}
export default HomePage;