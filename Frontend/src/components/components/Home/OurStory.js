import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { createGlobalStyle } from 'styled-components';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const GlobalStyles = createGlobalStyle`
  .story-box {
    font-family: 'Inter';
    max-width: 1000px;
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 34px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const OurStory = () => (
  <>
    <GlobalStyles />
    <div className="container text-center">
      <h1 className='fw-700'>OUR <span className='color'>STORY</span></h1>
      <p className='story-box text-white'>
        Our passion for crypto stems from an interest in productive time-based investments. We see the future of finance moving toward that which can be used in a wide variety of ways, rather than those which are limited to a few applications. Our goal is to create safe and reliable opportunities for those who are interested in gaining exposure to the crypto market without having to invest large amounts at once.
      </p>
      <div className='space-single'></div>
      <p className='story-box text-white'>
        From the moment we realised that the current market environment had a gap in it, we went all in and dedicated ourselves to becoming experts on the subject. Consequently, we discovered how this new phenomenon worked and how to exploit it. A name was then added to reflect our findings - Hold on for dear life!
      </p>
      <span onClick={() => window.open("/#", "_self")} className="btn-main mt-4 mx-auto">Whitepaper</span>
    </div>
  </>
);
export default OurStory;