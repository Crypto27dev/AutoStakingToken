import React, { useState } from "react";
import { Modal } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createGlobalStyle } from 'styled-components';
import NftClaimCard from "./NftClaimCard";
import SelectCoin from './SelectCoin';

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


const GlobalStyles = createGlobalStyle`
  .modal-content {
    background: #21273e;
    border-radius: 0.8rem;
    h5 {
      font-family: "Muli", sans-serif;
    }
    .dropdownSelect {
      margin-right: 0px;
    }
  }
  .btn2{
    background: transparent;
    border: solid 2px #5947FF;
  }
`;

const ClaimNft = () => {
  const [height, setHeight] = useState(0);
  const [collections, setCollections] = useState([]);
  const [openSell, setOpenSell] = useState(false);
  const [nft, setNft] = useState({});
  const [inputValue, setInputValue] = useState({});
  const [itemCoin, setItemCoin] = useState(0);
  const [method, setMethod] = useState('buy_now');
  const [endDate, setEndDate] = useState(new Date());
  const [page, setPage] = useState(0);

  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  }

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  }

  const onClaim = (nft) => {

  }

  const onSell = (nft) => {
    setNft(nft);
    setOpenSell(true);
  }

  const handleShow = () => {
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("tab_opt_1").classList.remove("hide");
    document.getElementById("tab_opt_2").classList.remove("show");
    document.getElementById("btn1").classList.add("active");
    document.getElementById("btn2").classList.remove("active");
    setMethod('buy_now');
  }
  const handleShow1 = () => {
    document.getElementById("tab_opt_1").classList.add("hide");
    document.getElementById("tab_opt_1").classList.remove("show");
    document.getElementById("tab_opt_2").classList.add("show");
    document.getElementById("btn2").classList.add("active");
    document.getElementById("btn1").classList.remove("active");
    setMethod('on_auction');
  }

  const handleChange = (event) => {
    setInputValue({ [event.target.name]: event.target.value })
  }

  const handleSelectCoin = (event) => {
    setItemCoin(event);
  }

  const handleSell = () => {
    console.log('[Value] = ', inputValue);
    console.log('[Coin] = ', itemCoin);
    console.log('[Method] = ', method);
  }

  return <>
    <GlobalStyles />
    <div className="row">
      <div className="mt-3"></div>
      {default_nfts && default_nfts.map((nft, index) => (
        <NftClaimCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} onCliam={onClaim} onSell={onSell} />
      ))}
      <div className='col-lg-12'>
        <div className="spacer-single"></div>
        <span onClick={onLoadMore} className="btn-main btn2 color-2 m-auto">Load More</span>
      </div>
    </div>

    <Modal
      show={openSell}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop={false}
      onHide={() => setOpenSell(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Sell NFT
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="form-create-item" className="form-border" action="#">
          <div className="field-set">
            <h5>Select method</h5>
            <div className="de_tab tab_methods">
              <ul className="de_nav">
                <li id='btn1' className="active" onClick={handleShow}><span><i className="fa fa-tag"></i>Fixed price</span>
                </li>
                <li id='btn2' onClick={handleShow1}><span><i className="fa fa-hourglass-1"></i>Timed auction</span>
                </li>
              </ul>

              <div className="spacer-20"></div>

              <div className="de_tab_content pt-3">
                <div id="tab_opt_1">
                  <div className="row">
                    <div className="col-md-8">
                      <h5>Price</h5>
                      <input type="number" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item" onChange={handleChange} autoComplete="off" />
                      {/* {error.item_price && (
                          <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
                        )} */}
                    </div>
                    <div className="col-md-4">
                      <h5>&nbsp;</h5>
                      <SelectCoin value={itemCoin} onChange={handleSelectCoin} />
                    </div>
                    <div className="spacer-10"></div>
                    <div className="col-md-12" style={{visibility: 'hidden'}}>
                      <h5>Duration</h5>
                      <input type="number" name="auction_period" id="auction_period" onChange={handleChange} className="form-control" placeholder="enter auction days" step="1" autoComplete="off" />
                      {/* {error.auction_period && (
                          <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the duration.</span>
                        )} */}
                    </div>
                  </div>
                </div>

                <div id="tab_opt_2" className='hide'>
                  <div className="row">
                    <div className="col-md-8">
                      <h5>Start Price</h5>
                      <input type="number" name="item_price_bid" id="item_price_bid" className="form-control" placeholder="enter start price" onChange={handleChange} autoComplete="off" />
                      {/* {error.item_price_bid && (
                          <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
                        )} */}
                    </div>
                    <div className="col-md-4">
                      <h5>&nbsp;</h5>
                      <SelectCoin value={itemCoin} onChange={handleSelectCoin} />
                    </div>
                    <div className="spacer-10"></div>
                    <div className="col-md-12">
                      <h5>Duration</h5>
                      <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                      {/* <input type="number" name="auction_period" id="auction_period" onChange={handleChange} className="form-control" placeholder="enter auction days" step="1" autoComplete="off" /> */}
                      {/* {error.auction_period && (
                          <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the duration.</span>
                        )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn-main" onClick={handleSell}>Sell Now</button>
        <button className="btn-main" onClick={() => setOpenSell(false)}>Cancel</button>
      </Modal.Footer>
    </Modal>
  </>
}

export default ClaimNft;