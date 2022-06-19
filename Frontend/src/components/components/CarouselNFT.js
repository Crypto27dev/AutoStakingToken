import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Reveal from 'react-awesome-reveal';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { numberWithCommas, fadeIn, fadeInUp, BackLoading, SingleLoading, isEmpty } from "../../utils";
import { getNFTCardInfos, getBNBPrice, mintNfts } from "../../web3/web3";
import * as selectors from '../../store/selectors';

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

const CarouselNFT = ({ showOnly = false, handleEdit, onReload, cardInfoArr, cardPriceArr }) => {
  const slickRef = useRef(null);
  const slides = ["1", "2", "3", "4", "5", "6"];
  const [cardInfos, setCardInfos] = useState(null);
  const [cardPrices, setCardPrices] = useState(null);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const wallet = useSelector(selectors.userWallet);

  const getCardInfos = useCallback(async () => {
    setCardPrices(cardPriceArr);
    setCardInfos(cardInfoArr);
  }, [cardInfoArr, cardPriceArr]);

  useEffect(() => {
    getCardInfos();
  }, [getCardInfos]);

  const handleSlide = (index, currentSlide) => {
    let countArr = counts;
    countArr[index] = currentSlide + 1;
    let newCardInfos = cardPrices;
    newCardInfos[index] = Number(cardInfos[index].bnb) * (currentSlide + 1);
    setCardPrices(newCardInfos);
    setCounts(countArr);
    setRefresh(prevState => !prevState);
  }

  const handleMint = async (index, nft) => {
    const count = counts[index] === undefined ? 1 : counts[index];
    if (isEmpty(wallet)) {
      toast.error(`Please connect your wallet.`);
      return;
    }
    if ((nft.supply - nft.soldCount) <= 0) {
      toast.error(`You can't mint anymore.`);
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: `You are about to mint a new NFT.`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (resp) => {
      if (resp.isConfirmed) {
        setLoading(true);
        const result = await mintNfts(index, count, nft.bnb);
        setLoading(false);
        if (result.success) {
          onReload();
          toast.success('Created a new NFT successfully!');
        } else {
          toast.error(result.status);
        }
      }
    });
  }

  return (
    <div className="container">
      <div className='row'>
        <div className='col-lg-12'>
          <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
            <h1 className='fw-700 text-center'><span className='color'>MINT</span> NFTs</h1>
          </Reveal>
        </div>
      </div>
      <div className='mintnft_block'>
        <div className="align-items-stretch h-100">
          {cardInfos === null && (
            <SingleLoading />
          )}
          {(cardInfos !== null && cardInfos.length === 0) && (
            <span className="d-block text-white text-center color fs-24 my-4">No Minted NFTs</span>
          )}
          {cardInfos !== null && cardInfos.length > 0 && (
            <Reveal className='onStep' keyframes={fadeIn} delay={200} duration={600} triggerOnce>
              <Slider {...settings} className="nft-carousel">
                {cardInfos && cardInfos.map((nft, index) => (
                  <div className="nft_item block_1 text-center" key={index}>
                    <div className="nft_avatar d-flex justify-content-center align-items-center">
                      <img src={'/img/nfts/dolphin.png'} className="img-fluid" alt="img" />
                      {/* <video className="nft-video-item" poster="" autoPlay={true} loop={true} muted>
                      <source id="video_source" src="./video/banner.m4v" type="video/mp4"></source>
                    </video> */}
                    </div>
                    <div className="px-4 mt-2">
                      <div className="d-flex flex-row justify-content-between">
                        <span className="fs-20 f-space text-white">{nft.symbol}</span>
                        <span className="fs-20 f-space color">${numberWithCommas(nft.priceBUSD)}</span>
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
                        <div className='d-flex flex-row justify-content-center align-items-center gap-1'>
                          <img src="/img/icons/bnb.png" alt="" style={{ width: '20px', height: '20px' }}></img>
                          <div className="nft_total_value text-white">
                            {numberWithCommas(cardPrices[index], 10)} BNB
                          </div>
                        </div>
                      </div>
                      <div className="single-line"></div>
                      <div className="nft_btn mb-2 mt-4">
                        {showOnly ? (
                          <button className="btn-main btn-arrow-bg" onClick={() => handleEdit(index, nft)}>Edit a {nft.symbol}</button>
                        ) : (
                          <button className="btn-main btn-arrow-bg" onClick={() => handleMint(index, nft)} disabled={(nft.supply - nft.soldCount) <= 0}>Mint a {nft.symbol}</button>
                        )}
                      </div>
                      <div className="nft_left my-3">
                        {nft.supply - nft.soldCount} {nft.symbol} left
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </Reveal>
          )}
        </div>
      </div>
      <BackLoading loading={loading} />
    </div>
  );
}

export default memo(CarouselNFT);
