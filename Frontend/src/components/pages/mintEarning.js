import React from 'react';
import Header from '../menu/header';
import Footer from '../components/footer';
import EarningInfo from '../components/EarningInfo';
import CarouselNFT from '../components/CarouselNFT';
import ClaimNft from '../components/ClaimNft';

const mintEarning = () => (
  <div>
    <Header />
    <section className='jumbotron breadcumb mint-banner' style={{ backgroundImage: `url('./img/background/mint_banner.png')` }}>
      <div className='mainbreadcumb'>
        <div className='container'>
          <div className='row m-10-hor'>
            <h1 className="banner-title">MINT & EARNING</h1>
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