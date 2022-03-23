import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import Header from '../menu/header';
import Footer from '../components/footer';
import EarningInfo from '../components/EarningInfo';
import CarouselNFT from '../components/CarouselNFT';
import ClaimNft from '../components/ClaimNft';

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

const mintEarning = () => (
  <div>
    <Header />
    <section className='jumbotron breadcumb nav-image' style={{ backgroundImage: `url(${'./img/background/create.png'})` }}>
      <div className='mainbreadcumb'>
        <div className='container'>
          <div className='row m-10-hor'>
            <div className='col-12'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <h1 className='text-center'>Mint & Earning</h1>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className='container'>
      <EarningInfo />
    </section>

    <section className='container p-0'>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>Mint NFT's</h2>
            <div className="small-border"></div>
          </div>
        </div>
      </div>
      <CarouselNFT />
    </section>

    <section className='container'>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>My Earnings</h2>
            <div className="small-border"></div>
          </div>
        </div>
      </div>
      <ClaimNft />
    </section>
    <Footer />
  </div>
);
export default mintEarning;