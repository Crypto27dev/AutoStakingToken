import React from "react";
import Reveal from 'react-awesome-reveal';
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { createGlobalStyle } from 'styled-components';
import { fadeInUp } from '../../../utils';

const GlobalStyles = createGlobalStyle`
	.bg-icon3 {
		position: absolute;
    left: -130px;
    bottom: -60px;
    z-index: 0;
	}
	.bg-icon4 {
		position: absolute;
    right: -90px;
    top: -20px;
    z-index: 0;
	}
`;

const Faq = () => {
  return (
    <div className="relative">
      <GlobalStyles />
      <img className="bg-icon3" src="./img/icons/bg-icon.png" alt=""></img>
      <Container>
        <div className="faqs_block"/* data-aos="zoom-in" data-aos-delay="700" data-aos-easing="ease-out-quart" data-aos-duration="500" data-aos-once="true"*/>
          <div className="faqs_inner">
            <Row className="justify-content-center mb-4">
              <Col xs={12} lg={9} className="text-center">
                <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                  <h1 className="fw-700">FREQUENTLY <span className='color'>ASKED</span> QUESTION</h1>
                </Reveal>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} lg={9}>
                <Accordion>
                  <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={300} triggerOnce cascade>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>What is HODL?</Accordion.Header>
                      <Accordion.Body className="pt-1">
                        HODL is an income generationg NFT project.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>How to mint NFTs?</Accordion.Header>
                      <Accordion.Body className="pt-1">
                        Our NFT's can be found once "Mint &amp; Earning" tab is pressed. New NFT's will be released on the first of every month.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>What token are your rewards given in?</Accordion.Header>
                      <Accordion.Body className="pt-1">
                        All our investors will receive daily rewards in stable coin.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>Are you guys safe?</Accordion.Header>
                      <Accordion.Body className="pt-1">
                        We believe we have taken every precaution possible to make our
                        investors as protected as possible. This includes having a publicly
                        DOXXED team as well as audited code. Our full safety plan is highlighted
                        in our white paper
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>What is the artistic value of your NFTs?</Accordion.Header>
                      <Accordion.Body className="pt-1">
                        The artistic value of our NFT’s vary from tier to tier. Some may be created
                        by your favorite artist, contact creator or brand.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="5">
                      <Accordion.Header>What's the value of making the NFT sellable?</Accordion.Header>
                      <Accordion.Body className="pt-1">
                        The value behind having sellable NFT’s the second they are minted is this
                        gives our users the ability to cash out at any point of their choosing. Giving
                        true ownership to the users.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="6">
                      <Accordion.Header>Is this a Passive Income Project?</Accordion.Header>
                      <Accordion.Body className="pt-1">
                        Yes! this is what's beautiful about HODL. Once you buy an NFT you
                        receive daily rewards with no input needed from the user. Allowing our
                        users to live life to its fullest without needing to constantly check there
                        computer.
                      </Accordion.Body>
                    </Accordion.Item>
                  </Reveal>
                </Accordion>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
      <img className="bg-icon4" src="./img/icons/bg-icon.png" alt=""></img>
    </div>
  )
}

export default Faq;