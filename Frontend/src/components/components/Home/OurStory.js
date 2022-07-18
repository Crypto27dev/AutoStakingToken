import React from 'react';
import Reveal from 'react-awesome-reveal';
import Slider from "react-slick";
import { createGlobalStyle } from 'styled-components';
import { fadeInUp } from '../../../utils';

const GlobalStyles = createGlobalStyle`
  .story-box {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 34px;
    margin-left: auto;
    margin-right: auto;
  }
  .logo-video {
    width: 100%;
    border-radius: 10px;
  }
  .logo-carousel {
    .slick-next {
      right: 10px;
      z-index: 99;
      &:before {
        font-size: 22px;
      }
    }
    .slick-prev {
      left: 10px;
      z-index: 99;
      &:before {
        font-size: 22px;
      }
    }
  }
`;


const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
};

const OurStory = () => (
  <>
    <GlobalStyles />
    <div className="container text-center">
      <div className='row align-items-center'>
        <div className='col-lg-5 col-md-5 col-sm-12'>
          <Slider {...settings} className="logo-carousel">
            <img className="logo-video" src="./img/nfts/Transportor.png" alt=""></img>
            <img className="logo-video" src="./img/nfts/Carrier.png" alt=""></img>
            {/* <video poster="" autoPlay={true} loop={true} muted className='logo-video' controls>
              <source src="./video/promote1.mp4" type="video/mp4"></source>
            </video>
            <video poster="" autoPlay={true} loop={true} muted className='logo-video' controls>
              <source src="./video/promote2.mp4" type="video/mp4"></source>
            </video> */}
          </Slider>
        </div>
        <div className='col-lg-7 col-md-7 col-sm-12'>
          <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={300} triggerOnce cascade>
            <h1 className='fw-700'>OUR <span className='color'>STORY</span></h1>
            <p className='story-box text-white'>
              Our passion for crypto stems from an interest in productive time-based investments. We see the future of finance moving toward that which can be used in a wide variety of ways, rather than those which are limited to a few applications. Our goal is to create safe and reliable opportunities for those who are interested in gaining exposure to the crypto market without having to invest large amounts at once.
            </p>
            <div className='space-single'></div>
            <span onClick={() => window.open("/whitepaper.pdf", "_target")} className="btn-main mt-4 mx-auto">Whitepaper</span>
          </Reveal>
        </div>
      </div>
    </div>
  </>
);
export default OurStory;