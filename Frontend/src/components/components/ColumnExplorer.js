import React, { memo, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import CollapseItem from '../components/Collapse';
import NftBoard from './Market/NftBoard';
import PriceRange from './Market/PriceRange';
import ROIRange from './Market/ROIRange';
import api from '../../core/api';

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

const ColumnExplorer = () => {
  const [chain, setChain] = useState({ avax: true, matic: true, bsc: true });
  const [RoiRange, setRoiRange] = useState({ min: 0, max: 100 });

  const handleCheck = (event) => {
    let newChain = chain;
    newChain[event.target.name] = event.target.checked;
    setChain(newChain);
    console.log(RoiRange);
  }
  
  return (
    <div className='container'>
      <div className="row explorer">
        <GlobalStyles />
        <div className="col-lg-3 col-md-4 col-xs-12 filter-container mb-2">
          <div className='d-flex flex-row justify-content-between align-items-center'>
            <h3><i className="fa fa-filter"></i> Filter</h3>
            <span className='color text-decoration-underline'>Reset</span>
          </div>
          <div className='single-w-line'></div>
          <CollapseItem title="Price Range" open={true}>
            <div className="onStep fadeIn">
              <PriceRange />
            </div>
          </CollapseItem>

          <CollapseItem title="ROI Range" open={true}>
            <div className="onStep fadeIn">
              <ROIRange range={setRoiRange} />
            </div>
          </CollapseItem>
                    
          <CollapseItem title="Chain" open={true}>
            <div className="onStep fadeIn">
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
        <div className="col-lg-9 col-md-8 col-xs-12 mb-2">
          <NftBoard />
        </div>
      </div>
    </div>
  );
};

export default memo(ColumnExplorer);