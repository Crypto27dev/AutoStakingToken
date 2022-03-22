import React, { memo } from "react";

const CustomSlide = ({ index, avatar, banner, collectionName, uniqueId, collectionId, className='' }) => {
  return (
    <div className={className} index={index}>
      <div className="nft_coll" onClick={()=> window.open("/colection/" + collectionId, "_self")}>
          <div className="nft_wrap">
              <span><img src={banner} className="lazy img-ratio" alt=""/></span>
          </div>
          <div className="nft_coll_pp">
              <span><img className="lazy" src={avatar} alt=""/></span>
          </div>
          <div className="nft_coll_info">
              <span><h4>{ collectionName }</h4></span>
              <span>{ uniqueId }</span>
          </div>
      </div>
    </div>
  )
}

export default memo(CustomSlide);