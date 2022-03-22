import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";

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

const featurebox = () => (
  <>
    <div className="ellipse box-1 xs-hide"></div>
    <div className="ellipse box-2 xs-hide"></div>
    <div className="ellipse box-3 xs-hide"></div>
    <div className="ellipse box-4 xs-hide"></div>
    <div className='container'>
      <div className='row'>
        <div className="col-lg-4 col-md-6 mb-3">
          <div className="feature-box f-boxed style-3">
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
              <img className='i-boxed' src="img/icons/feature_1.png" alt=""></img>
            </Reveal>
            <div className="text">
              <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                <h4 className="">Set up your wallet</h4>
              </Reveal>
              <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                <p className="">Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner.</p>
              </Reveal>
            </div>
            <i className="wm icon_wallet"></i>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-3">
          <div className="feature-box f-boxed style-3">
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
              <img className='i-boxed' src="img/icons/feature_2.png" alt=""></img>
            </Reveal>
            <div className="text">
              <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                <h4 className="">Add your NFT's</h4>
              </Reveal>
              <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                <p className="">Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties, stats.</p>
              </Reveal>
            </div>
            <i className="wm icon_cloud-upload_alt"></i>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-3">
          <div className="feature-box f-boxed style-3">
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
              <img className='i-boxed' src="img/icons/feature_3.png" alt=""></img>
            </Reveal>
            <div className="text">
              <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                <h4 className="">Sell your NFT's</h4>
              </Reveal>
              <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                <p className="">Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!</p>
              </Reveal>
            </div>
            <i className="wm icon_tags_alt"></i>
          </div>
        </div>
      </div>
    </div>
  </>
);
export default featurebox;