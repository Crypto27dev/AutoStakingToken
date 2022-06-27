import React, { useEffect, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import { getNftHolders, getTreasuryBalance } from '../../../web3/web3';
import { fadeInUp, numberWithCommas } from '../../../utils';

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
    transition: transform .5s;
    &:hover {
      transform: scale(1.1);
    }
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

const Statistics = () => {
  const [holders, setHolders] = useState(0);
  const [treasury, setTreasury] = useState(0);

  const getInfos = async () => {
    const count = await getNftHolders();
    setHolders(count);
    const result = await getTreasuryBalance();
    if (result.success) {
      setTreasury(result.balance);
    }
  };

  useEffect(() => {
    getInfos();
  }, []);
  return (
    <>
      <GlobalStyles />
      <div className="container statistics_container">
        <div className='d-flex flex-column flex-md-row justify-content-center gap-5'>
          <div className='p-sm-2 p-md-0'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={800} triggerOnce>
              <div className="stat_item" style={{ background: 'url(./img/home/treasury_bg.png)', backgroundSize: 'contain' }}>
                <img src="./img/home/treasury.png" alt=""></img>
                <div>
                  <h5>Treasury Balance</h5>
                  <h4>${numberWithCommas(treasury)}</h4>
                </div>
              </div>
            </Reveal>
          </div>
          <div className='p-sm-2 p-md-0'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={1200} triggerOnce>
              <div className='stat_item' style={{ background: 'url(./img/home/invest_bg.png)', backgroundSize: 'contain' }}>
                <img src="./img/home/invest.png" alt=""></img>
                <div>
                  <h5>Value Of Investment</h5>
                  <h4>$55,000</h4>
                </div>
              </div>
            </Reveal>
          </div>
          <div className='p-sm-2 p-md-0'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={900} duration={1600} triggerOnce>
              <div className='stat_item' style={{ background: 'url(./img/home/holder_bg.png)', backgroundSize: 'contain' }}>
                <img src="./img/home/holder.png" alt=""></img>
                <div>
                  <h5>Total Holders</h5>
                  <h4>{numberWithCommas(holders)}</h4>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
};
export default Statistics;