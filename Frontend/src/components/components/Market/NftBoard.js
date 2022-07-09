import React, { memo, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import NftCard from '../NftCard';
import { getAllSaleInfos } from '../../../web3/web3';
import * as selectors from '../../../store/selectors';

const defaultValue = [{
  value: 1,
  label: 'Recently Created'
}, {
  value: 2,
  label: 'ROI: Low to High'
}, {
  value: 3,
  label: 'ROI: High to Low'
}, {
  value: 4,
  label: 'Price: Low to High'
}, {
  value: 5,
  label: 'Price: High to Low'
}];

const customStyles = {
  container: (base, state) => ({
    ...base,
    width: '100%'
  }),
  option: (base, state) => ({
    ...base,
    color: "white",
    background: "#151612",
    borderColor: '#5A45FF',
    borderRadius: state.isFocused ? "0" : 0,
    "&:hover": {
      background: "#273110",
    }
  }),
  menu: base => ({
    ...base,
    zIndex: 9999,
    borderRadius: 0,
    marginTop: 0,
  }),
  menuList: base => ({
    ...base,
    padding: 0,
  }),
  control: (base, state) => ({
    ...base,
    color: "white",
    background: "#1C1E11",
    border: '1px solid #5f5f60 ',
    borderRadius: '10px',
    boxShadow: 'none',
    zIndex: 0,
    padding: '4px',
    "&:hover": {
      borderColor: '#9d9d9e',
    },
  }),
  singleValue: (base, select) => ({
    ...base,
    color: 'white'
  }),
  placeholder: (base) => ({
    ...base,
    color: '#ffffff'
  })
};

const NftBoard = ({ range }) => {
  const [page, setPage] = useState(0);
  const [nftInfos, setNftInfos] = useState([]);
  const [reload, setReload] = useState(false);
  const web3 = useSelector(selectors.web3State);

  const handleSort = (event) => {
    console.log(page);
    setPage(1);
  }

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  }

  const loadNFTs = useCallback(async () => {
    if (!web3) {
      console.log(reload)
      return;
    }
    const result = await getAllSaleInfos();
    if (result.success) {
      setNftInfos(result.nftInfos);
    }
  }, [web3, reload]);

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs]);

  return (
    <>
      <div className='row'>
        <div className="col-md-12 d-flex flex-row justify-content-between align-items-end">
          <span className='fs-16 f-space text-white'>{nftInfos.length} result</span>
          <div className='select-sort'>
            <Select
              styles={customStyles}
              options={defaultValue}
              onChange={handleSort}
              isSearchable={false}
              placeholder={'Sort By'}
            />
          </div>
        </div>
        <div className='col-md-12'>
          <div className='single-w-line'></div>
          <div className='spacer-10'></div>
        </div>
        {(nftInfos !== null && nftInfos.length === 0) && (
          <div className="col-md-12 text-center my-4">
            <span className="text-white color fs-24">No Sold NFTs</span>
          </div>
        )}
        {nftInfos && nftInfos.map((nft, index) => (
          <NftCard nft={nft} key={index} onReload={() => setReload(prevState => !prevState)} />
        ))}
        <div className='col-lg-12'>
          <div className="spacer-single"></div>
          <span onClick={onLoadMore} className="btn-main btn2 m-auto">Load More</span>
        </div>
      </div>
    </>
  )
}

export default memo(NftBoard);