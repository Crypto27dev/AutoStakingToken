import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from "styled-components";
import ReactLoading from "react-loading";
import Backdrop from '@mui/material/Backdrop';
import Swal from 'sweetalert2';
import { settings } from './constants';
import { numberWithCommas, Toast } from "../../utils";
import { getNFTCardInfos, getAvaxPrice, mintNfts } from "../../web3/web3";
import * as selectors from '../../store/selectors';

const default_nfts = [
  {
    "symbol": "Dolphin",
    "imgUri": "/img/nfts/dolphin.png",
    "priceUSDC": 500,
    "priceAVAX": 5,
    "supply": 1000,
    "soldCount": 5
  },
  {
    "symbol": "Dog",
    "imgUri": "/img/nfts/dog.png",
    "priceUSDC": 2500,
    "priceAVAX": 5,
    "supply": 1000,
    "soldCount": 5
  },
  {
    "symbol": "Phoenix",
    "imgUri": "/img/nfts/dolphin.png",
    "priceUSDC": 5000,
    "priceAVAX": 5,
    "supply": 1000,
    "soldCount": 5
  },
  {
    "symbol": "Astro",
    "imgUri": "/img/nfts/astro.png",
    "priceUSDC": 10000,
    "priceAVAX": 5,
    "supply": 2000,
    "soldCount": 5
  },
  {
    "symbol": "Dolphin",
    "imgUri": "/img/nfts/dog.png",
    "priceUSDC": 15000,
    "priceAVAX": 10,
    "supply": 1000,
    "soldCount": 15
  }, {
    "symbol": "Dog",
    "imgUri": "/img/nfts/dolphin.png",
    "priceUSDC": 100000,
    "priceAVAX": 100,
    "supply": 1000,
    "soldCount": 15
  },
];

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

const Prop = styled('h3')`f5 f4-ns mb0 white`;

const CarouselNFT = ({ showOnly = false, handleEdit, reload = false }) => {
  const slickRef = useRef(null);
  const slides = ["1", "2", "3", "4", "5", "6"];
  const [cardInfos, setCardInfos] = useState([]);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const web3 = useSelector(selectors.web3State);

  const getCardInfos = useCallback(async () => {
    if (!web3) {
      return;
    }
    const result = await getNFTCardInfos();
    console.log('[CardInfo] = ', result)
    if (result.success) {
      let cardInfoArr = [];
      for (let i = 0; i < result.cardInfos.length; i++) {
        let card = result.cardInfos[i];
        const avax = await getAvaxPrice(card.priceUSDC);
        // console.log('[Card USDC] = ', card.priceUSDC, '[Avax] = ', avax);
        card = { ...card, avax };
        cardInfoArr.push(card);
      }
      setCardInfos(cardInfoArr);
    }
  }, [web3]);

  useEffect(() => {
    getCardInfos();
  }, [getCardInfos]);

  const handleSlide = async (index, currentSlide) => {
    let countArr = counts;
    countArr[index] = currentSlide + 1;
    setCounts(countArr);
  }

  const handleMint = async (_id, nft) => {
    const count = counts[_id] === undefined ? 1 : counts[_id];
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: `You are about to mint a new NFT`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const result = await mintNfts(_id, count, nft.avax);
        if (result.success) {
          Toast.fire({
            icon: 'success',
            title: 'Created a new NFT successfully!'
          })
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Something went wrong.'
          })
        }
        setLoading(false);
      }
    });
  }

  return (
    <div className="dashboard_wrapper">
      <div className='mintnft_block'>
        <div className="align-items-stretch">
          {cardInfos.length === 0 && (
            <Loading>
              <ReactLoading type={'spinningBubbles'} color="#fff" />
            </Loading>
          )}
          <Slider {...settings} className="nft-carousel">
            {cardInfos && cardInfos.map((nft, index) => (
              <div className="nft_item block_1 p-3 text-center" key={index}>
                <div className="nft_avatar d-flex justify-content-center align-items-center">
                  <img src={'/img/nfts/dolphin.png'} className="img-fluid" alt="img" />
                </div>
                <div className="nft_title text-center text-uppercase">{nft.symbol}</div>
                <div className="nft_amount">${numberWithCommas(nft.priceUSDC)}</div>
                {!showOnly && (
                  <>
                    {/* <p className="text_info mt-2">You will receive {nft.symbol}</p> */}
                    <div className="nft_counter mb-3 mt-3">
                      <Slider
                        centerMode={true}
                        swipe={false}
                        focusOnSelect={false}
                        infinite={false}
                        ref={slickRef}
                        slidesToShow={1}
                        slidesToScroll={1}
                        vertical={true}
                        afterChange={(value) => handleSlide(index, value)}
                      >
                        {slides.map((slide) => (
                          <div key={slide} className="counter_num">
                            {slide}
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </>
                )}
                <div className="nft_total mb-2 mt-2 d-flex justify-content-between align-items-center">
                  <div className="nft_total_title">
                    Total
                  </div>
                  <div className="nft_total_value text-white">
                    {Number(nft.avax).toFixed(5)} AVAX
                  </div>
                </div>
                <div className="nft_btn mb-2 mt-4">
                  {showOnly ? (
                    <button className="btn-main btn-arrow-bg" onClick={() => handleEdit(index, nft)}>Edit a {nft.symbol}</button>
                  ) : (
                    <button className="btn-main btn-arrow-bg" onClick={() => handleMint(index, nft)}>Mint a {nft.symbol}</button>
                  )}
                </div>
                <div className="nft_left mb-2 mt-4">
                  {nft.supply - nft.soldCount} {nft.symbol} left
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Loading>
          <ReactLoading type={'spinningBubbles'} color="#fff" />
          <Prop>Saving...</Prop>
        </Loading>
      </Backdrop>}
    </div>
  );
}

export default memo(CarouselNFT);
