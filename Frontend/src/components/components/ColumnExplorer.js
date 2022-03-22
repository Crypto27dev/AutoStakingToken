import React, { memo, useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import styled from "styled-components";
import ToggleButton from '@mui/material/ToggleButton';
import NftCard from './NftCard';
import api from '../../core/api';
import axios from "axios";
import { isEmpty } from '../../utils';

const CustomInput = styled.input`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 9px;
  width: 100%;
`;

const GlobalStyles = createGlobalStyle`
  .filter-container {
    padding: 20px;
    border-right: dashed;
    border-width: 1px;
    border-color: #5947ff;
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
`;

// const defaultValue = [{
//   value: 0,
//   label: 'Avalanche (AVAX)'
// }, {
//   value: 1,
//   label: 'Polygon (MATIC)'
// }, {
//   value: 2,
//   label: 'Binance Smart Chain (BNB)'
// }];

// const customStyles = {
//   option: (base, state) => ({
//     ...base,
//     color: "white",
//     background: "#151B34",
//     borderRadius: state.isFocused ? "0" : 0,
//     "&:hover": {
//       background: "#080f2a",
//     }
//   }),
//   menu: base => ({
//     ...base,
//     zIndex: 9999,
//     borderRadius: 0,
//     marginTop: 0,
//   }),
//   menuList: base => ({
//     ...base,
//     padding: 0,
//   }),
//   control: (base, state) => ({
//     ...base,
//     color: 'white',
//     background: "#151B34",
//     border: '1px solid #5947FF',
//     borderRadius: '10px',
//     boxShadow: 'none',
//     zIndex: 0,
//     padding: '8px',
//     "&:hover": {
//       borderColor: '#5947FF',
//     },
//   }),
//   singleValue: (base, select) => ({
//     ...base,
//     color: 'white'
//   })
// };

// const navLinks = [{ value: 0, text: "All items" },
// { value: 1, text: "Art" },
// { value: 2, text: "Game" },
// { value: 3, text: "Photography" },
// { value: 4, text: "Music" },
// { value: 5, text: "Video" }];
// const dateOptions = [{ value: 0, text: "Recently added" }, { value: 1, text: "Long added" }];
// const priceOptions = [{ value: 0, text: "Highest price" }, { value: 1, text: "The lowest price" }];
// const creatorOptions = [{ value: 0, text: "All" }, { value: 1, text: "Verified only" }];
// const likesOptions = [{ value: 0, text: "Most liked" }, { value: 1, text: "Least liked" }];
// const sortingOptions = [];
// if (navLinks && navLinks.length > 0) navLinks.map((x) => sortingOptions.push(x));

//react functional component
const ColumnExplorer = ({ showLoadMore = true, showCategory = true, shuffle = false, authorId = null, collectionId = null }) => {

  const limit = 12;
  const [category, setCategory] = useState(0);
  const [buyNow, setBuyNow] = useState(false);
  const [auction, setAuction] = useState(false);
  const [newItem, setNewItem] = useState(false);
  const [offer, setOffer] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [chain, setChain] = useState({ avax: true, matic: true, bsc: true });
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  // const [date, setDate] = useState(dateOptions[0]);
  // const [price, setPrice] = useState(priceOptions[0]);
  // const [likes, setLikes] = useState(likesOptions[0]);
  // const [creator, setCreator] = useState(creatorOptions[0]);
  // const [sorting, setSorting] = useState(sortingOptions[0]);
  // const [range, setRange] = useState([]);

  // const [values, setValues] = useState([5]);
  // const [visible, setVisible] = useState(false);

  const [height, setHeight] = useState(0);
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(0);

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  }

  const toggleNow = () => {
    setBuyNow(value => !value);
  };

  const toggleAuction = () => {
    setAuction(value => !value);
  };

  const toggleNew = () => {
    setNewItem(value => !value);
  };

  const toggleOffer = () => {
    setOffer(value => !value);
  };

  // const handlePrice = (option) => {
  //   const { value } = option;
  // }

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

  const handleSearch = (event) => {
    setSearch(event.target.value);
  }

  const getCollectionList = async () => {
    var param = { start: page, limit: limit, category: category };
    param.type = [];
    param.range = [];
    param.chain = [];
    if (buyNow) param.type.push(0);
    if (auction) param.type.push(1);
    if (offer) param.type.push(2);
    if (isEmpty(minPrice))
      param.range.push(-1);
    else
      param.range.push(Number(minPrice));
    if (isEmpty(maxPrice))
      param.range.push(-1);
    else
      param.range.push(Number(maxPrice));
    if (!isEmpty(search)) {
      param.search = search;
    }
    if (chain.avax) param.chain.push(0);
    if (chain.matic) param.chain.push(1);
    if (chain.bsc) param.chain.push(2);
    // param.likes = likes.value;
    // param.creator = creator.value;

    if (collectionId) param.collection_id = collectionId;

    const result = await axios.post(`${api.baseUrl}/collection/get_collection_list`, param);
    var list = [];
    for (var i = 0; i < result.data.list.length; i++) {
      var item = result.data.list[i].item_info;
      item.users = [{ _id: result.data.list[i].owner_info._id, avatar: result.data.list[i].owner_info.avatar }];
      list.push(item);
    }
    if (page === 0) {
      setCollections(list);
    } else {
      setCollections(prevState => [...prevState, ...list]);
    }
  }

  useEffect(() => {
    getCollectionList();
  }, [page, refresh])

  useEffect(() => {
    setPage(0);
    setRefresh(prev => !prev);
  }, [category, buyNow, auction, newItem, offer, search])

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  }

  return (
    <div className="row explorer">
      <GlobalStyles />
      <div className="col-lg-3 col-md-4 col-xs-12 filter-container">
        <h3><i className="fa fa-search"></i> Filter</h3>
        <div className='row'>
          <div className="col-md-12">Status</div>
          <div className='col-md-6 col-sm-12'>
            <ToggleButton selected={buyNow} value="now" onClick={toggleNow}>Buy Now</ToggleButton>
          </div>
          <div className='col-md-6 col-sm-12'>
            <ToggleButton selected={auction} value="auction" onClick={toggleAuction}>On Auction</ToggleButton>
          </div>
          <div className='col-md-6 col-sm-12'>
            <ToggleButton selected={newItem} value="new" onClick={toggleNew}>New</ToggleButton>
          </div>
          <div className='col-md-6 col-sm-12'>
            <ToggleButton selected={offer} value="offers" onClick={toggleOffer}>Has Offers</ToggleButton>
          </div>
          <div className='col-md-12 mt-3'>Price</div>
          {/* <div className='col-md-12'>
            <Select
              styles={customStyles}
              options={defaultValue}
              onChange={handlePrice}
            />
          </div> */}
          <div className="col-md-6 mt-3">
            <input className="form-control" type='number' placeholder="Min..." onChange={handleMin} autoComplete="off"></input>
          </div>
          <div className="col-md-6 mt-3">
            <input className="form-control" type='number' placeholder="Max..." onChange={handleMax} autoComplete="off"></input>
          </div>
          <div className="col-md-12 mt-3">
            <button className='btn-main' disabled={(!isEmpty(maxPrice) && !isEmpty(minPrice) && maxPrice < minPrice) ? true : false} onClick={handleApply}>Apply</button>
          </div>
          <div className='col-md-12 mt-4'>Chain</div>
          <div className='col-md-12 d-flex flex-column'>
            <label className="new_checkbox"><img src={api.rootUrl + "/img/icons/avax.png"} alt="" width="30px"></img> Avalanche
              <input type="checkbox" name="avax" defaultChecked onChange={handleCheck} disabled/>
              <span className="checkmark"></span>
            </label>
            <label className="new_checkbox"><img src={api.rootUrl + "/img/icons/matic.png"} alt="" width="30px"></img> Polygon
              <input type="checkbox" name="matic" onChange={handleCheck} disabled/>
              <span className="checkmark"></span>
            </label>
            <label className="new_checkbox"><img src={api.rootUrl + "/img/icons/bnb.png"} alt="" width="30px"></img> Binance Smart Chain
              <input type="checkbox" name="bsc" onChange={handleCheck} disabled/>
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="col-lg-9 col-md-8 col-xs-12">
        <div className='row items_filter'>
          <div className={"quick_search mt-3 " + (!showCategory ? 'col-lg-4 offset-lg-8' : 'col-lg-4')}>
            <CustomInput
              id="name_1"
              name="name_1"
              placeholder="search item here..."
              type="text"
              onChange={handleSearch}
            />
          </div>
          {showCategory && (
            <div className="col-lg-8 d-flex flex-row flex-wrap gap-2 mt-3">
              <span className={'category-item ' + (category === 0 ? 'selected' : '')} onClick={() => setCategory(0)}>All NFTs</span>
              <span className={'category-item ' + (category === 1 ? 'selected' : '')} onClick={() => setCategory(1)}>Art</span>
              <span className={'category-item ' + (category === 2 ? 'selected' : '')} onClick={() => setCategory(2)}>Game</span>
              <span className={'category-item ' + (category === 3 ? 'selected' : '')} onClick={() => setCategory(3)}>Photo</span>
              <span className={'category-item ' + (category === 4 ? 'selected' : '')} onClick={() => setCategory(4)}>Music</span>
              <span className={'category-item ' + (category === 5 ? 'selected' : '')} onClick={() => setCategory(5)}>Video</span>
              <span className={'category-item ' + (category === 6 ? 'selected' : '')} onClick={() => setCategory(6)}>Utility</span>
            </div>
          )}
          <div className="mt-3"></div>
          {collections && collections.map((nft, index) => (
            <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
          ))}
          {showLoadMore &&
            <div className='col-lg-12'>
              <div className="spacer-single"></div>
              <span onClick={onLoadMore} className="btn-main lead m-auto">Load More</span>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default memo(ColumnExplorer);