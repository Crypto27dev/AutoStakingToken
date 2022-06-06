import React, { memo, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';

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

const ROI = ({ setRoiRange }) => {
  const minDistance = 10;
  const [value, setValue] = useState([0, 100]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue([clamped - minDistance, clamped]);
      }
    } else {
      setValue(newValue);
    }
  };

  const handleApply = () => {

  }

  return (
    <div className='row'>
      <GlobalStyles />
      <div className="col-md-12">
        <Slider
          getAriaLabel={() => 'Minimum distance shift'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          components={{
            ValueLabel: ValueLabelComponent,
          }}
          getAriaValueText={valuetext}
          disableSwap
        />
      </div>
      <div className='d-flex flex-row justify-content-between'>
        <span className='fs-14 f-inter'>Min: <span className='fs-16 text-white'>{value[0]}%</span></span>
        <span className='fs-14 f-inter'>Max: <span className='fs-16 text-white'>{value[1]}%</span></span>
      </div>
      <div className="spacer-10"></div>
      <div className="col-md-12">
        <button className='btn-main' onClick={handleApply}>Apply</button>
      </div>
    </div>
  )
}

export default memo(ROI);