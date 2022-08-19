import React, { useEffect, useCallback, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap'
import { createGlobalStyle } from 'styled-components';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import moment from 'moment';
import Header from '../menu/header';
import Footer from '../components/footer';
import CarouselNFT from '../components/CarouselNFT';
import ImageUpload from '../components/NavImageUpload';
import { addNftCardInfo, setNFTCardInfo, isOwner, checkNetwork, getNFTCardInfos, getMintStartTime, setMintStartTime, transferToken } from '../../web3/web3';
import { isEmpty, fadeInUp, BackLoading, fromWei, getUTCDate } from '../../utils';
import * as selectors from '../../store/selectors';

const GlobalStyles = createGlobalStyle`
  .modal-dialog {
    width: 400px !important;
  }
  .modal-content {
    background: #212224 !important;
    border-radius: 0.8rem !important;
  
    h5 {
      font-family: "Muli", sans-serif;
    }
  
    .dropdownSelect {
      margin-right: 0px;
    }
  }

  .btn-new {
    margin-left: auto;
    @media only screen and (max-width: 768px) {
      margin: auto;
    }
  }
`;

const Admin = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nftId, setNftId] = useState(0);
  const [nftImage, setNftImage] = useState({});
  const [selectNft, setSelectNft] = useState(null);
  const [mintTime, setMintTime] = useState(new Date());
  const [inputValue, setInputValue] = useState({
    symbol: '',
    priceUSDT: '',
    roi: '',
    token: '',
    supply: ''
  });
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState({
    image: false,
    symbol: false,
    priceUSDT: false,
    roi: false,
    token: false,
    supply: false
  });
  const [cardInfos, setCardInfos] = useState(null);
  const [cardPrices, setCardPrices] = useState(null);
  const [curMintTime, setCurMintTime] = useState(0);
  const web3 = useSelector(selectors.web3State);

  const checkOwnerState = async () => {
    if (await checkNetwork()) {
      const result = await isOwner();
      if (!result) {
        toast.error(`You can't update NFT infos because you aren't a admin.`);
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    checkOwnerState();
  }, []);

  const handleChange = async (event) => {
    setError(prevState => {
      return { ...prevState, [event.target.name]: false }
    });
    setInputValue(prevState => {
      return { ...prevState, [event.target.name]: event.target.value }
    });
  }

  const addNftImages = files => {
    setNftImage(Object.assign(files[0], {
      preview: URL.createObjectURL(files[0])
    }));
    setSelectNft(files[0]);
    setError(prevState => {
      return { ...prevState, image: false }
    });
  };

  const validate = () => {
    let result = true;
    let newError = {};
    if (Object.keys(nftImage).length === 0) {
      newError.image = true;
      result = false;
    }
    if (isEmpty(inputValue.symbol)) {
      newError.symbol = true;
      result = false;
    }
    if (isEmpty(inputValue.priceUSDT)) {
      newError.priceUSDT = true;
      result = false;
    }
    if (isEmpty(inputValue.roi)) {
      newError.roi = true;
      result = false;
    }
    if (isEmpty(inputValue.token)) {
      newError.token = true;
      result = false;
    }
    if (isEmpty(inputValue.supply)) {
      newError.supply = true;
      result = false;
    }
    setError(newError);
    return result;
  }

  const initValue = () => {
    setError({
      image: false,
      symbol: false,
      priceUSDT: false,
      roi: false,
      token: false,
      supply: false
    });
    setInputValue({
      symbol: '',
      priceUSDT: '',
      roi: '',
      token: '',
      supply: ''
    });
  }

  const handleModalNew = async () => {
    if (!await checkOwnerState()) {
      return;
    }
    initValue();
    setNftImage({});
    setOpenNew(true)
  }

  const handleNew = async () => {
    setError({
      image: false,
      symbol: false,
      priceUSDT: false,
      supply: false
    });
    if (!validate()) return;
    setLoading(true);
    const result = await addNftCardInfo(inputValue, selectNft)
    if (result.success) {
      setReload(prevState => !prevState);
      setLoading(false);
      setOpenNew(false);
      toast.success('Created a new NFT successfully!');
    } else {
      setLoading(false);
      toast.error(result.status);
    }
  }

  const handleMintTime = (newValue) => {
    setMintTime(newValue);
  };

  const handleModalEdit = async (id, nft) => {
    initValue();
    setNftId(id);
    setInputValue({ symbol: nft.symbol, priceUSDT: nft.priceUSDT, roi: Number(nft.nftROI) / 100, token: nft.nftTOKEN, supply: nft.supply });
    setNftImage({ preview: nft.imgUri });
    setOpenEdit(true);
  }

  const handleEdit = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await setNFTCardInfo(nftId, nftImage.preview, inputValue);
    if (result.success) {
      setReload(prevState => !prevState);
      setLoading(false);
      setOpenEdit(false);
      toast.success('Updated a new NFT successfully!');
    } else {
      setLoading(false);
      toast.error(result.status);
    }
  }

  const handleTransfer = async () => {
    const result = await transferToken();
    if (result.success) {
      console.log('Success');
    }
  }

  const getCardInfos = useCallback(async () => {
    if (!web3) {
      console.log(reload);
      return;
    }
    const result = await getNFTCardInfos();
    if (result.success) {
      let cardPriceArr = [], cardInfoArr = [];
      for (let i = 0; i < result.cardInfos.length; i++) {
        let card = result.cardInfos[i];
        const priceUSDT = fromWei(card.priceUSDT);
        card = { ...card, priceUSDT };
        cardPriceArr.push(priceUSDT);
        cardInfoArr.push(card);
      }
      setCardPrices(cardPriceArr);
      setCardInfos(cardInfoArr);

      const result_2 = await getMintStartTime();
      setCurMintTime(result_2);
    }
     
  }, [web3, reload]);

  const onClick_SetMintTime = async () => {
    setLoading(true);
    const end = Math.floor(moment(mintTime).valueOf() / 1000);
    const timezoneOffset = new Date().getTimezoneOffset() * 60;
    const real_time = end - timezoneOffset;
    let result = await setMintStartTime(real_time);
    if (result.success) {
      toast.success('Updated the end time successfully.');
    } else {
      toast.error(result.status);
    }
    setLoading(false);
  }

  useEffect(() => {
    getCardInfos();
  }, [getCardInfos]);

  return (
    <div>
      <GlobalStyles />
      <Header />
      <section className='jumbotron breadcumb mint-banner' style={{ backgroundImage: `url('./img/background/mint_banner.png')` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <h1 className='banner-title text-center'>ADMIN</h1>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className='container p-0 mt-5'>
        <div className='row'>
          <div className='col-md-12'>
            <div className="admin-input-section select-date">
              <span className='fs-20 text-white'>Mint Time: </span>
              <span className='fs-20 text-white'>{getUTCDate(curMintTime).format("MMM DD, YYYY")}</span>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  value={mintTime}
                  onChange={handleMintTime}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <button className='btn-main btn4' onClick={() => { onClick_SetMintTime() }}>SET</button>
            </div>
          </div>
          <div className='col-lg-12'>
            <button className="btn-main btn2 btn-new" onClick={handleModalNew}>Create a new NFT</button>
            <button className="btn-main" onClick={handleTransfer}>Transfer</button>
          </div>
        </div>
        <CarouselNFT showOnly={true} handleEdit={handleModalEdit} reload={reload} onReload={() => setReload(prevState => !prevState)} cardInfoArr={cardInfos} cardPriceArr={cardPrices} />
      </section>
      <Modal
        show={openEdit}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={true}
        onHide={() => setOpenEdit(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit a NFT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className='col-md-12'>
              <div className="d-flex flex-column align-items-center justify-content-center text-center mb-3">
                <ImageUpload addFile={addNftImages} file={nftImage} width="150px" height="150px" radius="12px" />
                <span className='mt-2 mb-1 text-white'>New NFT image</span>
                {error.image && (
                  <span className='text-error mb-2'><i className="fa fa-warning" /> Please select a NFT image.</span>
                )}
              </div>
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Symbol</h5>
              <input type="text" name="symbol" id="symbol" value={inputValue.symbol} className="form-control" placeholder="enter symbol name" onChange={handleChange} autoComplete="off" />
              {error.symbol && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the symbol.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Price USDT</h5>
              <input type="number" name="priceUSDT" id="priceUSDT" value={inputValue.priceUSDT} className="form-control" placeholder="enter price USDC" onChange={handleChange} autoComplete="off" />
              {error.priceUSDT && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>ROI</h5>
              <input type="number" name="roi" id="roi" value={inputValue.roi} className="form-control" placeholder="enter ROI (1.7%)" onChange={handleChange} autoComplete="off" />
              {error.roi && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the ROI.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Token Per Day</h5>
              <input type="number" name="token" id="token" value={inputValue.token} className="form-control" placeholder="enter token amount" onChange={handleChange} autoComplete="off" />
              {error.roi && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the token amount per day.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Total Supply</h5>
              <input type="number" name="supply" id="supply" value={inputValue.supply} className="form-control" placeholder="enter supply" onChange={handleChange} autoComplete="off" />
              {error.supply && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the total supply.</span>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-main" onClick={() => setOpenEdit(false)}>Cancel</button>
          <button className="btn-main" onClick={handleEdit}>Update Now</button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={openNew}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={true}
        onHide={() => setOpenNew(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a new NFT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className='col-md-12'>
              <div className="d-flex flex-column align-items-center justify-content-center text-center mb-3">
                <ImageUpload addFile={addNftImages} file={nftImage} width="150px" height="150px" radius="12px" />
                <span className='mt-2 mb-1 text-white'>New NFT image</span>
                {error.image && (
                  <span className='text-error mb-2'><i className="fa fa-warning" /> Please select a NFT image.</span>
                )}
              </div>
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Symbol</h5>
              <input type="text" name="symbol" id="symbol" className="form-control" placeholder="enter symbol name" onChange={handleChange} autoComplete="off" />
              {error.symbol && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the symbol.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Price USDT</h5>
              <input type="number" name="priceUSDT" id="priceUSDT" className="form-control" placeholder="enter price USDC" onChange={handleChange} autoComplete="off" />
              {error.priceUSDT && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>ROI</h5>
              <input type="number" name="roi" id="roi" className="form-control" placeholder="enter ROI (1.7%)" onChange={handleChange} autoComplete="off" />
              {error.roi && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the ROI.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Token Per Day</h5>
              <input type="number" name="token" id="token" className="form-control" placeholder="enter token amount" onChange={handleChange} autoComplete="off" />
              {error.roi && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the token amount per day.</span>
              )}
            </div>
            <div className="spacer-10"></div>
            <div className='col-md-12'>
              <h5>Total Supply</h5>
              <input type="number" name="supply" id="supply" className="form-control" placeholder="enter supply" onChange={handleChange} autoComplete="off" />
              {error.supply && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the total supply.</span>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-main" onClick={() => setOpenNew(false)}>Cancel</button>
          <button className="btn-main" onClick={handleNew}>Create Now</button>
        </Modal.Footer>
      </Modal>
      <BackLoading loading={loading} title='Pending...' />
      <Footer />
    </div>
  )
};
export default Admin;