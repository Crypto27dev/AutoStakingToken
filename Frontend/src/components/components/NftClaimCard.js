import React, { memo } from 'react';
import { fromWei, getUTCDate } from '../../utils';

const NftClaimCard = ({ nft, className = 'd-item col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4', onClaim, onSell }) => {

  return (
    <div className={className}>
      <div className="nft__item m-0">
        <div className="nft__item_wrap">
          <img src={'/img/nfts/dolphin.png'} className="img-fluid" alt="img" />
          {/* <video className="nft-video-item" poster="" autoPlay={true} loop={true} muted>
            <source id="video_source" src="./video/banner.m4v" type="video/mp4"></source>
          </video> */}
        </div>
        <div className="nft__item_info mt-2">
          <span className='fs-20 f-space text-white'>Dolphin NFT{nft.symbol}</span>
        </div>
        <div className='d-flex justify-content-between'>
          <div>
            <span>Purchase on</span>
            <div className='text-white'>{getUTCDate(nft.createdTime)}</div>
          </div>
          <div align="right">
            <span>Days</span>
            <div className='text-white'>15/530</div>
          </div>
        </div>
        <div className="single-line"></div>
        <div className='d-flex justify-content-between'>
          <div>
            <span>Current ROI</span>
            <div className='text-white'>{nft.currentROI}%</div>
          </div>
          <div align="right">
            <span>Total Revenue</span>
            <div className='text-white'>${fromWei(nft.nftRevenue).toFixed(5)}</div>
          </div>
        </div>
        <div className="spacer-10"></div>
        <div className="d-flex justify-content-between">
          <button className='btn-main' onClick={() => onClaim(nft)}>Claim</button>
          <button className='btn-main' onClick={() => onSell(nft)}>Sell</button>
        </div>
      </div>
    </div>
  );
};

export default memo(NftClaimCard);