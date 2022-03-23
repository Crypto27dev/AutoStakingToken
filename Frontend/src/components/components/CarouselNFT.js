import React, { memo, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import styled from "styled-components";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { navigate } from '@reach/router';
import { settings } from './constants';
import * as selectors from '../../store/selectors';
import { fetchNewNftList } from "../../store/actions/thunks";
import { numberWithCommas } from "../../utils";
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

const CarouselNFT = () => {

    const dispatch = useDispatch();
    const slickRef = useRef(null);
    const slides = ["1", "2", "3", "4", "5", "6"];

    const nftsState = useSelector(selectors.nftNewListState);
    const nfts = nftsState.data ? nftsState.data : [];
    const [height, setHeight] = useState(0);

    const onImgLoad = ({ target: img }) => {
        let currentHeight = height;
        if (currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }
    useEffect(() => {
        dispatch(fetchNewNftList());
    }, [dispatch]);

    return (
        <div className="dashboard_wrapper">
            <div className='mintnft_block'>
                <div className="align-items-stretch">
                    <Slider {...settings}  className="nft-carousel">
                        {default_nfts && default_nfts.map((nft, index) => (
                            <div className="nft_item block_1 p-3 text-center" key={index}>
                                <div className="nft_avatar mx-auto mb-3 d-flex justify-content-center align-items-center">
                                    <img src={api.rootUrl + nft.imgUri} className="rounded-circle img-fluid" alt="img" />
                                </div>
                                <div className="nft_title mb-3 text-center text-uppercase">{nft.symbol} NFT</div>
                                <div className="nft_amount">${nft.priceUSDC}/-</div>
                                <p className="text_info mt-2">You will receive {nft.symbol} NFT
                                    <span className="ms-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg></span></p>
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
                                <div className="nft_total mb-2 mt-2 d-flex justify-content-between align-items-center">
                                    <div className="nft_total_title">
                                        Total
                                    </div>
                                    <div className="nft_total_value text-white">
                                        {nft.priceAVAX} AVAX
                                    </div>
                                </div>
                                <div className="nft_btn mb-2 mt-4">
                                    <button className="btn btn-arrow-bg w-100 px-2">Mint a {nft.symbol} <i className="icon"></i></button>
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
