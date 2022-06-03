import React, { useEffect, useState } from 'react';
import Reveal from 'react-awesome-reveal';
import styled from "styled-components";
import { Modal } from 'react-bootstrap'
import ReactLoading from "react-loading";
import Backdrop from '@mui/material/Backdrop';
import Header from '../menu/header';
import Footer from '../components/footer';
import CarouselNFT from '../components/CarouselNFT';
import ImageUpload from '../components/NavImageUpload';
import { addNftCardInfo, setNFTCardInfo, isOwner, checkNetwork } from '../../web3/web3';
import { Toast, isEmpty, fadeInUp } from '../../utils';

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

const Prop = styled('h3')`f5 f4-ns mb0 white`;

const Admin = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nftId, setNftId] = useState(0);
  const [nftImage, setNftImage] = useState({});
  const [selectNft, setSelectNft] = useState(null);
  const [inputValue, setInputValue] = useState({
    symbol: '',
    priceUSDC: '',
    supply: ''
  });
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState({
    image: false,
    symbol: false,
    priceUSDC: false,
    supply: false
  });

  const checkOwnerState = async () => {
    if (await checkNetwork()) {
      const result = await isOwner();
      if (!result) {
        Toast.fire({
          icon: 'error',
          title: `You can't update NFT infos because you aren't a admin`
        })
      }
    }
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
    if (isEmpty(inputValue.priceUSDC)) {
      newError.priceUSDC = true;
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
      priceUSDC: false,
      supply: false
    });
    setInputValue({
      symbol: '',
      priceUSDC: '',
      supply: ''
    });
  }
  
  const handleModalNew = async() => {
    initValue();
    setNftImage({});
    setOpenNew(true)
  }

  const handleNew = async () => {
    setError({
      image: false,
      symbol: false,
      priceUSDC: false,
      supply: false
    });
    if (!validate()) return;
    setLoading(true);
    const result = await addNftCardInfo(inputValue, selectNft)
    if (result.success) {
      setReload(prevState => !prevState);
      setLoading(false);
      setOpenNew(false);
      Toast.fire({
        icon: 'success',
        title: 'Created a new NFT successfully!'
      })
    } else {
      setLoading(false);
      Toast.fire({
        icon: 'error',
        title: 'Something went wrong.'
      })
    }
  }

  const handleModalEdit = async (id, nft) => {
    initValue();
    setNftId(id);
    setInputValue({symbol: nft.symbol, priceUSDC: nft.priceUSDC, supply: nft.supply});
    setNftImage({preview: nft.imgUri});
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
      Toast.fire({
        icon: 'success',
        title: 'Updated a new NFT successfully!'
      })
    } else {
      setLoading(false);
      Toast.fire({
        icon: 'error',
        title: 'Something went wrong.'
      })
    }
  }

  return (
    <div>
      <Header />
      <section className='jumbotron breadcumb nav-image' style={{ backgroundImage: `url(${'./img/background/mint_banner.png'})` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                  <h1 className='banner-title text-center'>ADMIN</h1>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container p-0 mt-5'>
        <div className='row'>
          <div className='col-lg-12' align="right">
            <button className="btn-main btn2" onClick={handleModalNew}>Create a new NFT</button>
          </div>
        </div>
        <CarouselNFT showOnly={true} handleEdit={handleModalEdit} reload={reload} />
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
              <h5>Price USDC</h5>
              <input type="number" name="priceUSDC" id="priceUSDC" value={inputValue.priceUSDC} className="form-control" placeholder="enter price USDC" onChange={handleChange} autoComplete="off" />
              {error.priceUSDC && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
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
              <h5>Price USDC</h5>
              <input type="number" name="priceUSDC" id="priceUSDC" className="form-control" placeholder="enter price USDC" onChange={handleChange} autoComplete="off" />
              {error.priceUSDC && (
                <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
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
      {<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Loading>
          <ReactLoading type={'spinningBubbles'} color="#fff" />
          <Prop>Saving...</Prop>
        </Loading>
      </Backdrop>}
      <Footer />
    </div>
  )
};
export default Admin;