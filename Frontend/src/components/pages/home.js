import React from 'react';
import Header from '../menu/header';
import SliderMain from '../components/Home/SliderMain';
import FeatureBox from '../components/Home/FeatureBox';
import Statistics from '../components/Home/Statistics';
import OurStory from '../components/Home/OurStory';
import Chart from '../components/Home/Chart';
import CarouselNewRedux from '../components/Home/CarouselNewRedux';
import Faq from '../components/Home/Faq';
import Footer from '../components/footer';
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
      <Chart />
    </section>

    <section className='py-5'>
      <OurStory />
    </section>

    <section className='py-5'>
      <FeatureBox />
    </section>

    <section className='py-5'>
      <CarouselNewRedux />
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