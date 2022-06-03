import React from 'react';
import Reveal from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import { fadeInUp } from '../../utils';

const GlobalStyles = createGlobalStyle`
  .statistics_container {
    position: relative;
    text-align: center;
    margin-top: -120px;
    @media only screen and (max-width: 992px) {
      margin-top: 5px;
    }
  }
  .earn_item {
    background-size: contain;
    padding-left: 25px;
    padding-top: 35px;
    padding-bottom: 20px;
    width: 320px;
    aspect-ratio: 1.17;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    filter: drop-shadow(0px 10px 50px #000000);
    @media only screen and (max-width: 1199px) {
      width: 250px;
    }
    @media only screen and (max-width: 992px) {
      width: 300px;
      h5 {
        font-size: 16px;
      }
    }
    img {
      width: 75px;
      @media only screen and (max-width: 992px) {
        width: 55px;
      }
    }
  }
  .bg-icon {
    position: absolute;
    right: -90px;
    bottom: -400px;
    z-index: 0;
  }
`;

const EarningInfo = () => (
  <div className='relative'>
    <GlobalStyles />
    <div className="container statistics_container">
      <div className='d-flex flex-md-column flex-lg-row justify-content-center gap-5'>
        <div className='p-sm-2 p-md-0'>
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={800} triggerOnce>
            <div className='earn_item' style={{ background: 'url(./img/background/mint_item1.png)', backgroundSize: 'contain' }}>
              <img src="./img/icons/mint_icon1.png" width="75px" alt=""></img>
              <div>
                <h5 className='fs-14'>Total Earning in PeaceGiga</h5>
                <h4>$155,555.15</h4>
              </div>
            </div>
          </Reveal>
        </div>
        <div className='p-sm-2 p-md-0'>
          <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={1200} triggerOnce>
            <div className='earn_item' style={{ background: 'url(./img/background/mint_item2.png)', backgroundSize: 'contain' }}>
              <img src="./img/icons/mint_icon2.png" width="75px" alt=""></img>
              <div>
                <h5 className='fs-14'>Total NFTs</h5>
                <h4>1555</h4>
              </div>
            </div>
          </Reveal>
        </div>
        <div className='p-sm-2 p-md-0'>
          <Reveal className='onStep' keyframes={fadeInUp} delay={900} duration={1600} triggerOnce>
            <div className='earn_item' style={{ background: 'url(./img/background/mint_item3.png)', backgroundSize: 'contain' }}>
              <img src="./img/icons/mint_icon3.png" width="75px" alt=""></img>
              <div>
                <h5 className='fs-14'>Daily Earning</h5>
                <h4>$1200</h4>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
    <img className="bg-icon" src="./img/icons/bg-icon.png" alt=""></img>
  </div>
);
export default EarningInfo;