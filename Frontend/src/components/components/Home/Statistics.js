import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { createGlobalStyle } from 'styled-components';

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

const GlobalStyles = createGlobalStyle`
  .statistics_container {
    position: relative;
    text-align: center;
    margin-top: -120px;
    @media only screen and (max-width: 992px) {
      margin-top: 5px;
    }
  }
  .stat_item {
    background-size: contain;
    padding-left: 25px;
    padding-top: 35px;
    padding-bottom: 20px;
    width: 300px;
    aspect-ratio: 1;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    filter: drop-shadow(0px 10px 50px #000000);
    @media only screen and (max-width: 1199px) {
      width: 250px;
    }
    @media only screen and (max-width: 992px) {
      width: 200px;
      margin-bottom: 15px;
      h5 {
        font-size: 16px;
      }
    }
    img {
      width: 75px;
      @media only screen and (max-width: 992px) {
        width: 55px;
      }
    }
  }
`;

const Statistics = () => (
  <>
    <GlobalStyles />
    <div className="container statistics_container">
      <div className='row justify-content-evenly'>
        <div className='col-md-4 p-sm-2 p-md-0'>
          <div className="stat_item" style={{ background: 'url(./img/home/treasury_bg.png)', backgroundSize: 'contain' }}>
            <img src="./img/home/treasury.png" alt=""></img>
            <div>
              <h5>Treasury Balance</h5>
              <h4>$155,555.15</h4>
            </div>
          </div>
        </div>
        <div className='col-md-4 p-sm-2 p-md-0'>
          <div className='stat_item' style={{ background: 'url(./img/home/invest_bg.png)', backgroundSize: 'contain' }}>
            <img src="./img/home/invest.png" alt=""></img>
            <div>
              <h5>Value Of Investment</h5>
              <h4>$155,555.15</h4>
            </div>
          </div>
        </div>
        <div className='col-md-4 p-sm-2 p-md-0'>
          <div className='stat_item' style={{ background: 'url(./img/home/holder_bg.png)', backgroundSize: 'contain' }}>
            <img src="./img/home/holder.png" alt=""></img>
            <div>
              <h5>Total Holders</h5>
              <h4>155,555</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
export default Statistics;