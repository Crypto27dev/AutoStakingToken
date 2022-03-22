import React, { Component } from "react";
import { Link } from '@reach/router';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  .mainside{
    .connect-wal{
      display: none;
    }
    .logout{
      display: flex;
      align-items: center;
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
`;

export default class Createpage extends Component {



  render() {
    return (
      <div>
        <GlobalStyles />

        <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>Create Collectible</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container'>
          <div className='row'>
            <div className="col-md-6 offset-md-3">
              <p>Choose "Single" if you want your collectible to be one of a kind or "Multiple" if you want to sell one collectible times</p>
            </div>
            <div className="col-md-3 offset-md-3">
              <Link to="/create2" className="opt-create">
                <img src="./img/misc/coll-single.png" alt="" />
                <h3>Single</h3>
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="/create3" className="opt-create">
                <img src="./img/misc/coll-multiple.png" alt="" />
                <h3>Multiple</h3>
              </Link>
            </div>
          </div>
        </section>



        <Footer />
      </div>
    );
  }
}