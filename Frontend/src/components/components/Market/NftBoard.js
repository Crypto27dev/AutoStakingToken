import React, { memo, useEffect, useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap'
import Select from 'react-select';
import NftCard from '../NftCard';

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
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  }, {
    "name": "Dog",
    "image": "/img/nfts/dolphin.png",
    "price": 100000,
    "count": 5
  },

];

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
  const [openBuy, setOpenBuy] = useState(false);

  const handleSort = (event) => {
    setPage(1);
  }

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  }

  const onBuyNow = () => {

  }
  
  const handleBuy = () => {

  }

  return (
    <>
      <div className='row'>
        <div className="col-md-12 d-flex flex-row justify-content-between align-items-end">
          <span className='fs-16 f-space text-white'>150 result</span>
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
        {default_nfts && default_nfts.map((nft, index) => (
          <NftCard nft={nft} key={index} onBuyNow={onBuyNow} />
        ))}
        <div className='col-lg-12'>
          <div className="spacer-single"></div>
          <span onClick={onLoadMore} className="btn-main btn2 m-auto">Load More</span>
        </div>
      </div>
      <Modal
        show={openBuy}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={false}
        onHide={() => setOpenBuy(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Place a Bid
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-main" onClick={handleBuy}>Buy Now</button>
          <button className="btn-main" onClick={() => setOpenBuy(false)}>Cancel</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default memo(NftBoard);