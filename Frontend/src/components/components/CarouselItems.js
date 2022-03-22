import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import styled from "styled-components";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Clock from "./Clock";
import { carouselNew } from './constants';
import * as selectors from '../../store/selectors';
import { fetchNftList } from "../../store/actions/thunks";
import { getAvatar, getCoinName } from "../../utils";
import api from "../../core/api";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const CarouselItems = ({ collectionId }) => {

    const dispatch = useDispatch();
    const nftsState = useSelector(selectors.nftListState);
    const nfts = nftsState.data ? nftsState.data : [];
    const [height, setHeight] = useState(0);

    const onImgLoad = ({ target: img }) => {
        let currentHeight = height;
        if (currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }
    useEffect(() => {
        if (collectionId !== null) {
            dispatch(fetchNftList(collectionId));
        }
    }, [dispatch, collectionId]);

    return (
        <div className='nft'>
            {nfts && nfts.length > 0 && (
            <Slider {...carouselNew}>
                {nfts && nfts.map((nft, index) => (
                    <div className='itm' index={index + 1} key={index}>
                        <div className="d-item">
                            <div className="nft__item">
                                {nft.deadline &&
                                    <div className="de_countdown">
                                        <Clock deadline={nft.deadline} />
                                    </div>
                                }
                                <div className="author_list_pp">
                                    <span onClick={() => window.open("/home1", "_self")}>
                                        <img className="lazy" src={getAvatar(nft.owner)} alt="" />
                                        <i className="fa fa-check"></i>
                                    </span>
                                </div>
                                <div className="nft__item_wrap" style={{ height: `${height}px` }}>
                                    <Outer>
                                        <span>
                                            <img onLoad={onImgLoad} src={api.imgUrl + '/' + nft.logoURL} className="lazy nft__item_preview" alt="" />
                                        </span>
                                    </Outer>
                                </div>
                                <div className="nft__item_info">
                                    <span onClick={() => window.open("/#", "_self")}>
                                        <h4>{nft.name}</h4>
                                    </span>
                                    <div className="nft__item_price">
                                        {nft.isSale < 2 ? nft.price : nft.auctionPrice} {getCoinName(nft.chain)}<span>{nft.bid}/{nft.max_bid}</span>
                                    </div>
                                    <div className="nft__item_like">
                                        <i className="fa fa-heart"></i><span>{nft.likes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            )}
        </div>
    );
}

export default memo(CarouselItems);
