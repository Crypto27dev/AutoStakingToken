import React from 'react';
import Turntable from 'turntable-react';
import Reveal from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import Header from '../menu/header';
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
  .lottery-container {
    padding-bottom: 135px;
  }
  .turntable {
    width: 300px;
    margin: auto;
    position: relative;
    box-shadow: 0 0 20px 20px black;
    border-radius: 50%;
    .__turntable-container {
      margin: auto;
    }
    .turntable-pointer {
      box-shadow: 0 0 50px 5px black;
      border-radius: 50%;
    }
    .inner-shadow {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      box-shadow: inset 0 0 15px 10px black;
      position: absolute;
      top: -1px;
      left: 0px;
    }
    .background {
      position: absolute;
      width: 330px;
      top: -25px;
      left: -15px;
    }
  }
`;

const prizeBackgrounds = [
  '#cd3b7a', '#3c86cd', '#f4b003', '#e34544', '#d5d3c6', '#951a49', '#194f95', '#cb7c03',
  '#bd2b2c', '#bebbac', '#269272', '#9c1c4d', '#2365b1', '#eea403', '#ea4f4d', '#ecece2'
];
const prizes = Array(16).fill(0).map((_, index) => ({
  texts: [
    {
      text: `${index * 10 / 100}`, fontStyle: '18px Arial', fontColor: 'rgba(70, 47, 47, 1)', fromCenter: 0.6,
    }
  ],
  background: prizeBackgrounds[index],
  // images: index === 0 ? undefined : [
  //   {
  //     src: './img/lottery/background.png',
  //     width: 25,
  //     height: 25,
  //     fromCenter: 1,
  //   },
  // ],
}));

const Lottery = () => {
  const canStart = true;

  const toast = (msg) => {
    console.log(msg);
  };

  const fetchPrizeResult = (abort) => {
    if (!canStart) {
      return false;
    }
    return new Promise((resolve, reject) => {
      // setTimeout
      setTimeout(() => {
        const resultPrizeIndex = Math.floor(Math.random() * 16);
        if (resultPrizeIndex < 0) {
          reject();
          toast('something is wrong!');
        } else {
          resolve(resultPrizeIndex);
        }
      }, 90);
    });
  };

  const complete = (index) => {
    console.log(`Congratulation - ${[index]} `, prizes[index]);
  };

  const timeout = () => {
  };

  const stateChange = (drawing) => {
  };

  return (
    <div>
      <GlobalStyles />
      <Header />
      <section className='jumbotron breadcumb nav-image' style={{ backgroundImage: 'url(/img/lottery/banner.png)' }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={800} triggerOnce>
                <img className='banner-title' src="/img/lottery/title.png" alt=""></img>
                <h2>Coming Soon</h2>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="container lottery-container">
        <div className='turntable'>
          <Turntable
            mode='mode'
            size={300}
            prizes={prizes}
            onStart={fetchPrizeResult}
            onComplete={complete}
            onTimeout={timeout}
            onStateChange={stateChange}
            auto={false}
          >
            {/* Dial pointer click button */}
            <div className="inner-shadow" />
            <div className="turntable-pointer">
              <img className="pointer-img" src={'./img/lottery/center.png'} alt="" width="60" />
            </div>
          </Turntable>
          <img className="background" src="./img/lottery/back.png" alt="" />
        </div>
      </section>
    </div>

  );
}

export default Lottery;