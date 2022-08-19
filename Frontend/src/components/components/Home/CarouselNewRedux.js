import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { navigate } from '@reach/router';
import Reveal from 'react-awesome-reveal';
import { numberWithCommas, fadeInUp, SingleLoading, fromWei } from "../../../utils";
import { getNFTCardInfos } from "../../../web3/web3";
import * as selectors from '../../../store/selectors';

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1900,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};

const CarouselNewRedux = () => {
  const [cardInfos, setCardInfos] = useState(null);
  const web3 = useSelector(selectors.web3State);

  const getCardInfos = useCallback(async () => {
    if (!web3) {
      return;
    }
    const result = await getNFTCardInfos();
    if (result.success) {
      let cardInfoArr = [];
      for (let i = 0; i < result.cardInfos.length; i++) {
        let card = result.cardInfos[i];
        const priceUSDT = fromWei(card.priceUSDT);
        card = { ...card, priceUSDT };
        cardInfoArr.push(card);
      }
      setCardInfos(cardInfoArr);
    }
  }, [web3]);

  useEffect(() => {
    getCardInfos();
  }, [getCardInfos]);

  return (
    <div className="container">
      <div className='row'>
        <div className='col-lg-12'>
          <div className='text-center'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
              <h1 className="fw-700">RECENT <span className="color">NFTs</span></h1>
            </Reveal>
          </div>
        </div>
      </div>
      <div className='mintnft_block'>
        <div className="align-items-stretch">
          {cardInfos === null && (
            <SingleLoading />
          )}
          {(cardInfos !== null && cardInfos.length === 0) && (
            <span className="d-block text-white text-center color fs-24 my-4">No Minted NFTs</span>
          )}
          {cardInfos !== null && cardInfos.length > 0 && (
            <Slider {...settings} className="nft-carousel">
              {cardInfos && cardInfos.map((nft, index) => (
                <div className="nft_item recent_nft block_1 text-center" key={index}>
                  <div className="nft_avatar d-flex justify-content-center align-items-center">
                    <img src={nft.imgUri} className="img-fluid" alt="Can't load" />
                    {/* <video className="nft-video-item" poster="" autoPlay={true} loop={true} muted>
                      <source id="video_source" src="./video/banner.m4v" type="video/mp4"></source>
                    </video> */}
                  </div>
                  <div className="px-4 mt-2">
                    <div className="d-flex flex-row justify-content-between">
                      <span className="fs-20 f-space text-white">{nft.symbol}</span>
                      <span className="fs-20 f-space color">${numberWithCommas(nft.priceUSDT)}</span>
                    </div>
                    <div className="single-line"></div>
                    <div className="nft_total d-flex justify-content-between align-items-center">
                      <div className="nft_total_title">
                        Total
                      </div>
                      <div className="nft_total_value text-white">
                        {numberWithCommas(nft.priceUSDT, 10)} USDT
                      </div>
                    </div>
                    <div className="single-line"></div>
                    <button className="btn-main btn-arrow-bg" onClick={() => navigate('mint')}>VIEW</button>
                    <div className="spacer-10"></div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(CarouselNewRedux);