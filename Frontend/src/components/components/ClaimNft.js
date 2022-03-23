import React, { useState } from "react";
import NftClaimCard from "./NftClaimCard";

import avtarImg from "../../assets/images/avatar-img.png";
import nftBlockBg1 from "../../assets/images/nft-block-bg-1.jpg";
import nftBlockBg2 from "../../assets/images/nft-block-bg-2.jpg";
import nftBlockBg3 from "../../assets/images/nft-block-bg-3.jpg";
import nftBlockBg4 from "../../assets/images/nft-block-bg-4.jpg";


const default_nfts = [
  {
    "name": "Dolphin",
    "image": "/img/nfts/dolphin.png",
    "price": 500,
    "count": 5
  },
  {
    "name": "Dog",
    "image": "/img/nfts/dog.png",
    "price": 2500,
    "count": 5
  },
  {
    "name": "Phoenix",
    "image": "/img/nfts/dolphin.png",
    "price": 5000,
    "count": 5
  },
  {
    "name": "Astro",
    "image": "/img/nfts/astro.png",
    "price": 10000,
    "count": 5
  },
  {
    "name": "Dolphin",
    "image": "/img/nfts/dog.png",
    "price": 15000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  },
];

const ClaimNft = () => {
  const [height, setHeight] = useState(0);
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(0);

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  }

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  }

  return <>
    <div className="row">
      <div className="mt-3"></div>
      {default_nfts && default_nfts.map((nft, index) => (
        <NftClaimCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
      ))}
      <div className='col-lg-12'>
        <div className="spacer-single"></div>
        <span onClick={onLoadMore} className="btn-main m-auto">Load More</span>
      </div>
    </div>
  </>
}

export default ClaimNft;