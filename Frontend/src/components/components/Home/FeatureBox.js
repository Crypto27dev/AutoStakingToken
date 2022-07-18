import React, { useEffect } from 'react';
import $ from 'jquery';
import Reveal from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import { fadeInUp } from '../../../utils';

const GlobalStyles = createGlobalStyle`
  .stat_1 {
    margin-top: 140px;
  }
  .stat_2 {
    margin-top: 70px;
  }
  .stat_3 {
    margin-top: 0px;
  }
  .stat_1 img:before {
    content: url('img/home/work_1_2.png');
    width: 0;
    height: 0;
    visibility: hidden;
  }
  .stat_2 img:before {
    content: url('img/home/work_2_2.png');
    width: 0;
    height: 0;
    visibility: hidden;
  }
  .stat_3 img:before {
    content: url('img/home/work_2_2.png');
    width: 0;
    height: 0;
    visibility: hidden;
  }
  .bg-icon1 {
    position: absolute;
    left: -130px;
    bottom: -160px;
    z-index: 0;
  }
  .bg-icon2 {
    position: absolute;
    right: -90px;
    top: -140px;
    z-index: 0;
  }
`;

const Featurebox = () => {
  useEffect(() => {
    $('.stat_1').hover(() => {
      $('.stat_1 img').attr('src', 'img/home/work_1_2.png');
    }, () => {
      $('.stat_1 img').attr('src', 'img/home/work_1_1.png');
    });
    $('.stat_2').hover(() => {
      $('.stat_2 img').attr('src', 'img/home/work_2_2.png');
    }, () => {
      $('.stat_2 img').attr('src', 'img/home/work_2_1.png');
    });
    $('.stat_3').hover(() => {
      $('.stat_3 img').attr('src', 'img/home/work_3_2.png');
    }, () => {
      $('.stat_3 img').attr('src', 'img/home/work_3_1.png');
    });
  }, []);

  return (
    <div className='relative'>
      <GlobalStyles />
      <img className="bg-icon1" src="./img/icons/bg-icon.png" alt=""></img>
      <div className='container relative'>
        <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
          <h1 className='fw-700 text-center'>HOW DOES IT <span className='color'>WORK</span></h1>
        </Reveal>
        <div className='row'>
          <div className="col-md-4 px-3">
            <div className="feature-box f-boxed style-3 stat_1">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <img className='i-boxed' src="img/home/work_1_1.png" alt=""></img>
              </Reveal>
              <div className="text">
                <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                  <h2 className="text-center">Set up your wallet</h2>
                </Reveal>
                <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                  <p className="">Once you’ve set up your wallet of choice, connect it to HODL by clicking the wallet icon in the top right corner.</p>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="col-md-4 px-3">
            <div className="feature-box f-boxed style-3 stat_2">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <img className='i-boxed' src="img/home/work_2_1.png" alt=""></img>
              </Reveal>
              <div className="text">
                <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                  <h2 className="text-center">Mint your NFT's</h2>
                </Reveal>
                <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                  <p className="">Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties, stats.</p>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="col-md-4 px-3">
            <div className="feature-box f-boxed style-3 stat_3">
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <img className='i-boxed' src="img/home/work_3_1.png" alt=""></img>
              </Reveal>
              <div className="text">
                <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                  <h2 className="text-center">Sell your NFT's</h2>
                </Reveal>
                <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                  <p className="">Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!</p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className="bg-icon2" src="./img/icons/bg-icon.png" alt=""></img>
    </div>
  )
};
export default Featurebox;