import React from 'react';
import Header from '../menu/header';
import SliderMain from '../components/Home/SliderMain';
import FeatureBox from '../components/Home/FeatureBox';
import Statistics from '../components/Home/Statistics';
import OurStory from '../components/Home/OurStory';
import CarouselNewRedux from '../components/Home/CarouselNewRedux';
import Faq from '../components/Home/Faq';
import Footer from '../components/footer';
import api from '../../core/api';
import RoadMap from '../components/Home/RoadMap';

const home = () => (
  <div className="home">
    <Header />
    <section className="jumbotron p-0 relative">
      <SliderMain />
    </section>

    <section className='py-5'>
      <Statistics />
    </section>

    <section className='py-5'>
      <OurStory />
    </section>

    <section className='py-5'>
      <FeatureBox />
    </section>

    <section className='py-5'>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h1 className="fw-700">RECENT NFTs</h1>
          </div>
        </div>
      </div>
      <div className='container'>
        <CarouselNewRedux />
      </div>
    </section>

    <section className="py-5">
      <RoadMap />
    </section>

    <section className='faqs_section py-5'>
      <Faq />
    </section>
    <Footer />
  </div>
);
export default home;