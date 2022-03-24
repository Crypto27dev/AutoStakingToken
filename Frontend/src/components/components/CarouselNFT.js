import React, { memo, useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from './constants';
import { numberWithCommas } from "../../utils";
import { getNFTCardInfos } from "../../web3/web3";
import api from "../../core/api";

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

const CarouselNFT = ({ showOnly = false, handleEdit, reload = false }) => {
    const slickRef = useRef(null);
    const slides = ["1", "2", "3", "4", "5", "6"];
    const [cardInfos, setCardInfos] = useState([]);

    const getCardInfos = async () => {
        const result = await getNFTCardInfos();
        if (result.success) {
            setCardInfos(result.cardInfos);
        }
    }

    useEffect(() => {
        getCardInfos();
    }, [reload]);

    return (
        <div className="dashboard_wrapper">
            <div className='mintnft_block'>
                <div className="align-items-stretch">
                    <Slider {...settings} className="nft-carousel">
                        {cardInfos && cardInfos.map((nft, index) => (
                            <div className="nft_item block_1 p-3 text-center" key={index}>
                                <div className="nft_avatar mx-auto mb-3 d-flex justify-content-center align-items-center">
                                    <img src={nft.imgUri} className="rounded-circle img-fluid" alt="img" />
                                </div>
                                <div className="nft_title mb-3 text-center text-uppercase">{nft.symbol} NFT</div>
                                <div className="nft_amount">${nft.priceUSDC}/-</div>
                                {!showOnly && (
                                    <>
                                        <p className="text_info mt-2">You will receive {nft.symbol}</p>
                                        <div className="nft_counter mb-3 mt-3">
                                            <Slider
                                                centerMode={true}
                                                swipe={false}
                                                focusOnSelect={false}
                                                infinite={false}
                                                ref={slickRef}
                                                slidesToShow={1}
                                                slidesToScroll={1}
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
                                        {nft.priceAVAX} AVAX
                                    </div>
                                </div>
                                <div className="nft_btn mb-2 mt-4">
                                    {showOnly ? (
                                        <button className="btn btn-arrow-bg w-100 px-2" onClick={() => handleEdit(index, nft)}>Edit a {nft.symbol} <i className="icon"></i></button>
                                    ) : (
                                        <button className="btn btn-arrow-bg w-100 px-2">Mint a {nft.symbol} <i className="icon"></i></button>
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
        </div>
    );
}

export default memo(CarouselNFT);
