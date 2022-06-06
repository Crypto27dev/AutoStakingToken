import React from 'react';
import Reveal from 'react-awesome-reveal';
import Header from '../menu/header';
import Footer from '../components/footer';
import EarningInfo from '../components/EarningInfo';
import CarouselNFT from '../components/CarouselNFT';
import ClaimNft from '../components/ClaimNft';
import { fadeInUp } from '../../utils';

const mintEarning = () => (
  <div>
    <Header />
    <section className='jumbotron breadcumb mint-banner' style={{ backgroundImage: `url('./img/background/mint_banner.png')` }}>
      <div className='mainbreadcumb'>
        <div className='container'>
          <div className='row m-10-hor'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
              <h1 className="banner-title">MINT & EARNING</h1>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <section className='py-5'>
      <EarningInfo />
    </section>

    <section className='py-0'>
      <CarouselNFT />
    </section>

    <section>
      <ClaimNft />
    </section>
    <Footer />
  </div>
);
export default mintEarning;