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
              <div className="nft_item block_1 text-center" key={index}>
                <div className="nft_avatar d-flex justify-content-center align-items-center">
                  <video className="nft-video-item" poster="" autoPlay={true} loop={true} muted>
                    <source id="video_source" src="./video/banner.m4v" type="video/mp4"></source>
                  </video>
                </div>
                <div className="px-4 mt-2">
                  <div className="d-flex flex-row justify-content-between">
                    <span className="fs-20 f-space text-white">{nft.symbol}</span>
                    <span className="fs-20 f-space color">${numberWithCommas(nft.priceUSDC)}</span>
                  </div>
                  <div className="single-line"></div>
                  {!showOnly && (
                    <>
                      <div className="nft_counter mb-1">
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
                  <div className="nft_total d-flex justify-content-between align-items-center">
                    <div className="nft_total_title">
                      Total
                    </div>
                    <div className="nft_total_value text-white">
                      {Number(nft.avax).toFixed(5)} AVAX
                    </div>
                  </div>
                  <div className="single-line"></div>
                  <div className="nft_btn mb-2 mt-4">
                    {showOnly ? (
                      <button className="btn-main btn-arrow-bg" onClick={() => handleEdit(index, nft)}>Edit a {nft.symbol}</button>
                    ) : (
                      <button className="btn-main btn-arrow-bg" onClick={() => handleMint(index, nft)}>Mint a {nft.symbol}</button>
                    )}
                  </div>
                  <div className="nft_left my-3">
                    {nft.supply - nft.soldCount} {nft.symbol} left
                  </div>
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
