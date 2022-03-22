import React from 'react';
import ColumnCollectionRedux from '../components/ColumnCollectionRedux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import api from '../../core/api';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
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
  .explore-container {
    position: relative;
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

const collectionList = ({ categoryId }) => (
  <div>
    <GlobalStyles />

    <section className='jumbotron breadcumb nav-image'  style={{ backgroundImage: `url(${api.rootUrl}/img/background/${categoryId}.png)`}}>
      <div className='collection-breadcumb'>
        <div className='container'>
          <div className='row d-flex flex-row align-items-center justify-content-center gap-3'>
              <h1 className='text-center' style={{fontSize:"80px"}}>Explore </h1>
              <h1 className='text-center text-first-uppercase' style={{fontSize:"40px"}}>{categoryId.replace('-', ' ')}</h1>
          </div>
        </div>
      </div>
    </section>

    <div className="explore-container"
    //  style={{backgroundImage: 'url(./img/background/pattern_22.png), url(./img/background/pattern_11.png)'}}
     >
      <section className='container'>
        <ColumnCollectionRedux  categoryId={categoryId}/>
      </section>
    </div>
    <Footer />
  </div>

);
export default collectionList;