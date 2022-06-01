import React from 'react';
import Header from '../menu/header';
import ColumnExplorer from '../components/ColumnExplorer';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import api from '../../core/api';

const GlobalStyles = createGlobalStyle`
  .nav-image {
    background-size: cover;
    background-position: center;
    padding: 40px 0;
    margin-top: 92px;
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
      {/* <section className='jumbotron breadcumb nav-image' style={{ backgroundImage: `url(${api.rootUrl}/img/background/explore.png)` }}>
        <div className='collection-breadcumb'>
          <div className='container'>
            <div className='row d-flex flex-row align-items-center justify-content-center gap-3'>
              <h1 className='text-center' style={{ fontSize: "80px" }}>Explore </h1>
              <h1 className='text-center text-first-uppercase' style={{ fontSize: "40px" }}>All NFTs</h1>
            </div>
          </div>
        </div>
      </section> */}

      <div className="explore-container">
        <ColumnExplorer />
      </div>

      <Footer />
    </div>

  );
}
export default Explore;