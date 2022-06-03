import React from 'react';
import Reveal from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import { navigate } from '@reach/router';
import { fadeInUp, fadeIn } from '../../../utils';

const GlobalStyles = createGlobalStyle`
  .banner-container {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    .row {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
    }
  }
  .banner-subtitle {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 36px;
    color: white;
    @media only screen and (max-width: 992px) {
      font-size: 20px;
      text-align: center;
    }
  }
  .banner-video-item {
    width: 400px;
    border-radius: 20px;
  }
  .btn-banners {
    .btn-main {
      width: 140px;
    }
    @media only screen and (max-width: 992px) {
      justify-content: center;
    }
  }
`;

const slidermain = () => (
  <>
    <GlobalStyles />
    <div className="banner-video">
      <video poster="" autoPlay={true} loop={true} muted>
        <source id="video_source" src="./video/video.mp4" type="video/mp4"></source>
      </video>
    </div>
    <div className="container banner-container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
            <h1 className="banner-title"><span className='color'>MINT</span> & EARNING BUSD, <span className="color">NFT</span></h1>
          </Reveal>
          <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={600} triggerOnce>
            <p className="banner-subtitle">
              Mint NFTs, Receive BUSD And Buy/Sell NFTs on Marketplace
            </p>
          </Reveal>
          <div className="spacer-10"></div>
          <Reveal className='onStep' keyframes={fadeInUp} delay={800} duration={900} triggerOnce>
            <div className="d-flex flex-row gap-2 btn-banners">
              <span onClick={() => navigate('mint')} className="btn-main btn-mint">MINT</span>
              <span onClick={() => navigate('explore')} className="btn-main btn-more">EXPLORE</span>
            </div>
          </Reveal>
        </div>
        <div className="col-md-6 xs-hide">
          <Reveal className='onStep text-center' keyframes={fadeIn} delay={900} duration={1500} triggerOnce>
            <video className="banner-video-item" poster="" autoPlay={true} loop={true} muted>
              <source id="video_source" src="./video/banner.m4v" type="video/mp4"></source>
            </video>
          </Reveal>
        </div>
      </div>
    </div>
  </>
);
export default slidermain;