import React from 'react';
import Reveal from 'react-awesome-reveal';
import Header from '../menu/header';
import ColumnExplorer from '../components/ColumnExplorer';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { fadeInUp } from '../../utils';

const GlobalStyles = createGlobalStyle`
  .nav-image {
    background-size: cover;
    background-position: center;
    padding: 40px 0;
    @media only screen and (max-width: 768px) {
      margin-top: 0px;
    }
  }
  @media only screen and (max-width: 1199px) {
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
  .back-image {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    justify-content: space-between;
    flex-direction: column;
    .pattern-image {
      width: 100%;
      height: auto;
    }
  }
`;

const Explore = () => {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <section className='jumbotron breadcumb nav-image' style={{ backgroundImage: 'url(/img/background/explore_banner.png)' }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='d-flex flex-row align-items-center justify-content-center'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={800} triggerOnce>
                <h1 className='banner-title text-center'>OPEN MARKET FOR NFTS</h1>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="explore-container">
        <ColumnExplorer />
      </div>

      <Footer />
    </div>

  );
}
export default Explore;