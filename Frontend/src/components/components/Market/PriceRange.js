import React, { memo, useCallback, useState } from 'react';
import { isEmpty } from '../../../utils';

const PriceRange = ({ range }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleMin = useCallback((event) => {
    setMinPrice(event.target.value);
  }, []);

  const handleMax = (event) => {
    setMaxPrice(event.target.value);
  }

  const handleApply = () => {

  }

  return (
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

  )
}

export default memo(PriceRange);