import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap'
import Select from 'react-select';
import styled from "styled-components";
import ReactLoading from "react-loading";
import Reveal from 'react-awesome-reveal';
import Backdrop from '@mui/material/Backdrop';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import NftClaimCard from "./NftClaimCard";
import SelectCoin from './SelectCoin';
import { getAllNFTInfos, claimByNft, claimAll, createSale } from '../../web3/web3';
import { Toast, fromWei, isEmpty, fadeInUp } from "../../utils";
import * as selectors from '../../store/selectors';

const Logo = styled.img`
  position: absolute;
  left: -100px;
  bottom: -60px;
  width: 250px;
  z-index: 0;
`;

const customStyles = {
  container: (base, state) => ({
    ...base,
    width: '100%'
  }),
  option: (base, state) => ({
    ...base,
    color: "white",
    background: "#151B34",
    borderColor: '#5A45FF',
    borderRadius: state.isFocused ? "0" : 0,
    "&:hover": {
      background: "#080f2a",
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
    background: "transparent",
    border: '1px solid #cccccc ',
    borderRadius: '6px',
    boxShadow: 'none',
    zIndex: 0,
    padding: '4px',
    "&:hover": {
      borderColor: '#cccccc',
    },
  }),
  singleValue: (base, select) => ({
    ...base,
    color: 'white'
  })
};

const defaultSort = [{
  value: 0,
  label: 'Recently minted'
}, {
  value: 1,
  label: 'Highest revenue'
}];

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

const Prop = styled('h3')`f5 f4-ns mb0 white`;

const ClaimNft = () => {
  const [height, setHeight] = useState(0);
  const [openSell, setOpenSell] = useState(false);
  const [nftInfos, setNftInfos] = useState([]);
  const [nftDetail, setNftDetail] = useState({});
  const [inputValue, setInputValue] = useState({
    item_price: '',
    item_price_bid: ''
  });
  const [itemCoin, setItemCoin] = useState(0);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('buy_now');
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState({
    item_price: false,
    description: false,
    item_price_bid: false
  });
  const wallet = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);

  const getNFTInfos = useCallback(async () => {
    console.log('[Wallet] = ', wallet);
    if (!web3) {
      return;
    }
    const result = await getAllNFTInfos();
    if (result.success) {
      const data = result.nftInfos;
      let nftArray = [];
      for (let i = 0; i < data.tokenIDs.length; i++) {
        const createdTime = data.createdTime[i];
        const currentROI = data.currentROI[i];
        const nftRevenue = data.nftRevenue[i];
        const tokenID = data.tokenIDs[i];
        const imgUri = data.uris[i];
        const nft = { createdTime, currentROI, nftRevenue, tokenID, imgUri };
        nftArray.push(nft);
      }
      setNftInfos(nftArray);
    }
  }, [web3, wallet]);

  useEffect(() => {
    getNFTInfos();
  }, [getNFTInfos]);

  const onClaim = async (nft) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: `You will receive $${fromWei(nft.nftRevenue).toFixed(5)}`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const result = await claimByNft(nft.tokenID);
        setLoading(false);
        if (result.success) {
          Toast.fire({
            icon: 'success',
            title: 'Created a new NFT successfully!'
          })
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Something went wrong.'
          })
        }
      }
    });
  }

  const onSell = (nft) => {
    setNftDetail(nft);
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
    setError(prevState => {
      return { ...prevState, [event.target.name]: false }
    });
    setInputValue(prevState => {
      return { ...prevState, [event.target.name]: event.target.value }
    });
  }

  const handleSelectCoin = (event) => {
    setItemCoin(event);
  }

  const handleSort = (event) => {
    switch (event.value) {
      case 0:
        break;
      case 1:
        setNftInfos(prevState => {
          prevState.sort((a, b) => {
            return a.nftRevenue - b.nftRevenue;
          });
        })
        break;
      case 2:
        break;
      default:
        break;
    }
  }

  const validate = () => {
    let result = true;
    let newError = {};
    if (method === 'buy_now') {
      if (isEmpty(inputValue.item_price)) {
        newError.item_price = true;
        result = false;
      }
    } else {
      if (isEmpty(inputValue.item_price_bid)) {
        newError.item_price_bid = true;
        result = false;
      }
    }
    setError(newError);
    return result;
  }

  const handleSell = async () => {
    console.log('[Value] = ', inputValue);
    console.log('[Coin] = ', itemCoin);
    console.log('[Method] = ', method);
    if (!validate()) return;
    setLoading(true);
    // await createSale()
    setLoading(false);
  }

  const handleClaimAll = () => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: `You will receive $${fromWei(0).toFixed(5)}`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const result = await claimAll();
        setLoading(false);
        if (result.success) {
          Toast.fire({
            icon: 'success',
            title: 'Created a new NFT successfully!'
          })
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Something went wrong.'
          })
        }
      }
    });
  }

  return (
    <div className="relative">
      <Logo src="./img/icons/bg-icon.png" alt=""></Logo>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
              <h1 className='fw-700 text-center'><span className='color'>MY</span> EARNINGS</h1>
            </Reveal>
          </div>
        </div>
        {nftInfos && nftInfos.map((nft, index) => (
          <div className="row" key={index}>
            <div className="col-md-3 offset-md-6">
              {/* <Select
          styles={customStyles}
          options={defaultSort}
          onChange={handleSort}
        /> */}
            </div>
            <div className="col-md-3">
              <button className='btn-main' onClick={handleClaimAll}>Claim All</button>
            </div>
            <div className="mt-3"></div>
            <NftClaimCard nft={nft} key={index} onClaim={onClaim} onSell={onSell} />
          </div>
        ))}
      </div>

      <Modal
        show={openSell}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={true}
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
                        {error.item_price && (
                          <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
                        )}
                      </div>
                      <div className="col-md-4">
                        <h5>&nbsp;</h5>
                        <SelectCoin value={itemCoin} onChange={handleSelectCoin} />
                      </div>
                      <div className="spacer-10"></div>
                      <div className="col-md-12" style={{ visibility: 'hidden' }}>
                        <h5>Duration</h5>
                        <input type="number" name="auction_period" id="auction_period" onChange={handleChange} className="form-control" placeholder="enter auction days" step="1" autoComplete="off" />
                      </div>
                    </div>
                  </div>

                  <div id="tab_opt_2" className='hide'>
                    <div className="row">
                      <div className="col-md-8">
                        <h5>Start Price</h5>
                        <input type="number" name="item_price_bid" id="item_price_bid" className="form-control" placeholder="enter start price" onChange={handleChange} autoComplete="off" />
                        {error.item_price_bid && (
                          <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
                        )}
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
          <button className="btn-main" onClick={() => setOpenSell(false)}>Cancel</button>
          <button className="btn-main" onClick={handleSell}>Sell Now</button>
        </Modal.Footer>
      </Modal>
      {<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Loading>
          <ReactLoading type={'spinningBubbles'} color="#fff" />
          <Prop>Saving...</Prop>
        </Loading>
      </Backdrop>}
    </div>
  )
}

export default ClaimNft;