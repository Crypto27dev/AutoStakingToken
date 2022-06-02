import React, { memo, useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Modal } from 'react-bootstrap'
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import CollapseItem from '../components/Collapse';
import NftCard from './NftCard';
import api from '../../core/api';
import axios from "axios";
import { isEmpty } from '../../utils';


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

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="bottom" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

function valuetext(value) {
  return `${value}`;
}

const GlobalStyles = createGlobalStyle`
  .filter-container {
    padding: 20px;
    background: #1C1E11;
    border: 1px solid #3B3C3E;
    border-radius: 20px;
    height: fit-content;
  }
  .MuiChip-root {
    color: white;
  }
  .MuiToggleButton-root {
    border: 1px solid white !important;
    border-radius: 10px !important;
    color: white !important;
    width: 100% !important;
    margin-bottom: 10px !important;
    &.Mui-selected {
      border: 1px solid #5947FF !important;
      color: rgb(91 69 255) !important;
    }
  }
  .category-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    padding: 8px 17px;
    cursor: pointer;
    color: white;
    &.selected {
      background: rgba(255, 255, 255, 0.1);
      color: #FF0;
    }
  }
  .MuiSlider-thumb {
    background-color: #CFFD33 !important;
    &:hover {
      box-shadow: 0px 0px 0px 8px rgb(206 252 51 / 10%) !important;
    }
  }
  .MuiSlider-rail {
    color: #494B3E;
  }
  .MuiSlider-track {
    color: #CFFD33;
  }
  .select-sort {
    width: 160px;
  }
`;


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

const ColumnExplorer = ({ showLoadMore = true }) => {

  const limit = 12;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [chain, setChain] = useState({ avax: true, matic: true, bsc: true });
  const [refresh, setRefresh] = useState(false);
  const [height, setHeight] = useState(0);
  const [openBuy, setOpenBuy] = useState(false);
  const [page, setPage] = useState(0);

  const handleMin = (event) => {
    setMinPrice(event.target.value);
  }

  const handleMax = (event) => {
    setMaxPrice(event.target.value);
  }

  const handleApply = (event) => {
    setPage(0);
    setRefresh(prev => !prev);
  }

  const handleCheck = (event) => {
    let newChain = chain;
    newChain[event.target.name] = event.target.checked;
    setPage(0);
    setChain(newChain);
    setRefresh(prev => !prev);
  }

  const handleSort = (event) => {
    this.setState({ category: event.value });
  }

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  }

  const onBuyNow = () => {

  }

  const handleBuy = () => {

  }

  const minDistance = 10;
  const [value2, setValue2] = React.useState([20, 37]);

  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue);
    }
  };

  return (
    <div className='container'>
      <div className="row explorer">
        <GlobalStyles />
        <div className="col-lg-3 col-md-4 col-xs-12 filter-container">
          <div className='d-flex flex-row justify-content-between align-items-center'>
            <h3><i className="fa fa-filter"></i> Filter</h3>
            <span className='color text-decoration-underline'>Reset</span>
          </div>
          <div className='single-w-line'></div>
          <CollapseItem title="Price Range" open={true}>
            <div className="tab-2 onStep fadeIn">
              <div className='row'>
                <div className="col-md-6 items_filter">
                  <input className="form-control" type='number' placeholder="Min..." onChange={handleMin} autoComplete="off"></input>
                </div>
                <div className="col-md-6 items_filter">
                  <input className="form-control" type='number' placeholder="Max..." onChange={handleMax} autoComplete="off"></input>
                </div>

                <div className="spacer-10"></div>

                <div className="col-md-12">
                  <button className='btn-main ml-auto' disabled={(!isEmpty(maxPrice) && !isEmpty(minPrice) && maxPrice < minPrice) ? true : false} onClick={handleApply}>Apply</button>
                </div>
              </div>
            </div>
          </CollapseItem>

          <CollapseItem title="ROI Range" open={true}>
            <div className="tab-2 onStep fadeIn">
              <div className='row'>
                <div className="col-md-12">
                  <Slider
                    getAriaLabel={() => 'Minimum distance shift'}
                    value={value2}
                    onChange={handleChange2}
                    valueLabelDisplay="auto"
                    components={{
                      ValueLabel: ValueLabelComponent,
                    }}
                    getAriaValueText={valuetext}
                    disableSwap
                  />
                </div>
                <div className='d-flex flex-row justify-content-between'>
                  <span className='fs-14 f-inter'>Min: <span className='fs-16 text-white'>{value2[0]}%</span></span>
                  <span className='fs-14 f-inter'>Max: <span className='fs-16 text-white'>{value2[1]}%</span></span>
                </div>
                <div className="spacer-10"></div>
                <div className="col-md-12">
                  <button className='btn-main' disabled={(!isEmpty(maxPrice) && !isEmpty(minPrice) && maxPrice < minPrice) ? true : false} onClick={handleApply}>Apply</button>
                </div>
              </div>
            </div>
          </CollapseItem>

          <CollapseItem title="Chain" open={true}>
            <div className="tab-2 onStep fadeIn">
              <div className='row'>
                <div className='col-md-12 d-flex flex-column'>
                  <label className="new_checkbox"><img src={api.rootUrl + "/img/icons/bnb.png"} alt="" width="30px"></img> Binance Smart Chain
                    <input type="checkbox" name="bsc" onChange={handleCheck} disabled defaultChecked />
                    <span className="checkmark"></span>
                  </label>
                  <label className="new_checkbox"><img src={api.rootUrl + "/img/icons/avax.png"} alt="" width="30px"></img> Avalanche
                    <input type="checkbox" name="avax" onChange={handleCheck} disabled />
                    <span className="checkmark"></span>
                  </label>
                  <label className="new_checkbox"><img src={api.rootUrl + "/img/icons/matic.png"} alt="" width="30px"></img> Polygon
                    <input type="checkbox" name="matic" onChange={handleCheck} disabled />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
          </CollapseItem>
        </div>
        <div className="col-lg-9 col-md-8 col-xs-12">
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
            {showLoadMore &&
              <div className='col-lg-12'>
                <div className="spacer-single"></div>
                <span onClick={onLoadMore} className="btn-main btn2 m-auto">Load More</span>
              </div>
            }
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
      </div>
    </div>
  );
};

export default memo(ColumnExplorer);