import React from 'react';
import SliderMain from '../components/SliderMain';
import FeatureBox from '../components/FeatureBox';
import CarouselCollectionRedux from '../components/CarouselCollectionRedux';
import CarouselNewRedux from '../components/CarouselNewRedux';
import AuthorListRedux from '../components/AuthorListRedux';
import Catgor from '../components/Catgor';
import Footer from '../components/footer';
import api from '../../core/api';

const home = () => (
  <div>
    <section className="jumbotron breadcumb no-bg" style={{ background: `#1F213DB2` }}>
      <SliderMain />
    </section>

    <section className='feature-container'>
      <FeatureBox />
    </section>

    <section style={{ background: `url(${api.rootUrl}/img/background/collection.png)`, backgroundSize: 'cover' }}>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='text-center'>
              <h2>Hot Collections</h2>
              <div className="small-border"></div>
            </div>
          </div>
          <div className='col-lg-12'>
            <CarouselCollectionRedux />
          </div>
        </div>
      </div>
    </section>

    <section className='news-new_checkbox'>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>New Items</h2>
            <div className="small-border"></div>
          </div>
        </div>
      </div>
      <div className="news-content" style={{ backgroundImage: `url(${api.rootUrl}/img/background/pattern_1.png)` }}></div>
      <div className='container'>
        <CarouselNewRedux />
      </div>
    </section>

    <section className='seller-new_checkbox'>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>Top Sellers</h2>
            <div className="small-border"></div>
          </div>
        </div>
      </div>
      <div className="seller-content" style={{ backgroundImage: `url(${api.rootUrl}/img/background/pattern_3.png)` }}></div>
      <div className='container'>
        <AuthorListRedux />
      </div>
    </section>

    <section className='category-new_checkbox' style={{ backgroundImage: `url(${api.rootUrl}/img/background/category.png)` }}>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <h2>Browse by category</h2>
            <div className="small-border"></div>
          </div>
        </div>
      </div>
      <div className='container'>
        <Catgor />
      </div>
    </section>
    <Footer />
  </div>
);
export default home;