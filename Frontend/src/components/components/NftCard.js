import React, { memo } from 'react';
import styled from "styled-components";
import api from '../../core/api';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

//react functional component
const NftCard = ({ nft, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', height, onImgLoad, onBuyNow }) => {
  return (
    <div className={className}>
      <div className="nft__item m-0">
        <div className="nft__item_wrap" style={{ height: `${height}px` }}>
          <Outer>
            <span>
              <img onLoad={onImgLoad} src={api.rootUrl + nft.image} className="lazy nft__item_preview" alt="" />
            </span>
          </Outer>
        </div>
        <div className="nft__item_info">
          <span>
            <h4>{nft.name}</h4>
          </span>
        </div>
        <div className="spacer-10"></div>
        <hr />
        <div className='d-flex justify-content-between'>
          <div>
            <span>Purchase on</span>
            <div>10 Feb 2022</div>
          </div>
          <div align="right">
            <span>Days</span>
            <div>15/530</div>
          </div>
        </div>
        <div className="spacer-10"></div>
        <div className='d-flex justify-content-between'>
          <div>
            <span>Current ROI</span>
            <div>1%</div>
          </div>
          <div align="right">
            <span>Total Revenue</span>
            <div>$100</div>
          </div>
        </div>
        <div className="spacer-10"></div>
        <div className="d-flex justify-content-between">
          <button className='btn-main m-auto' onClick={onBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default memo(NftCard);