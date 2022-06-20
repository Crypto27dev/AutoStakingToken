import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap'
import SelectCoin from './SelectCoin';
import { createSale } from '../../web3/web3';
import ROIBar from './Market/ROIBar';
import { claimByNft } from '../../web3/web3';
import { isEmpty, fromWei, getUTCDate, BackLoading } from '../../utils';

const Date_Range = [80, 365, 730];
const ROI_Range = [1.25, 0.5, 0.16];

const NftClaimCard = ({ nft, className = 'd-item col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4', onReload }) => {
  const [left_time, setLeftTime] = useState(0);
  const [rate, setRate] = useState(100);
  const [roi, setRoi] = useState(0);
  const [openSell, setOpenSell] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [itemCoin, setItemCoin] = useState(0);
  const [error, setError] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  const bonus = useMemo(() => {
    const price = Number(nft.tokenPrice);
    return price * roi / (3600 * 24 * 100);
  }, [nft.tokenPrice, roi]);

  const calcRevenue = useCallback(() => {
    const temp = revenue + bonus;
    setRevenue(temp);
  }, [bonus, revenue]);

  useEffect(() => {
    const timerId = setInterval(() => calcRevenue(), 1000);
    return () => {
      clearInterval(timerId);
    }
  }, [calcRevenue]);

  useEffect(() => {
    const curDate = parseInt((Date.now() / 1000 - Number(nft.createdTime)) / (3600 * 24));
    let leftDate = 0, percent = 100, tempRoi = 0;
    for (var index in Date_Range) {
      const element = Date_Range[index];
      if (curDate <= element) {
        leftDate = element - curDate;
        percent = leftDate / element * 100;
        tempRoi = ROI_Range[index];
        break;
      }
    }
    setLeftTime(leftDate);
    setRate(percent);
    setRoi(tempRoi);
    setRevenue(fromWei(nft.nftRevenue));
  }, [nft.createdTime, nft.nftRevenue]);

  const onClaim = async (nft) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: `You will receive $${revenue.toFixed(8 - revenue.toString().split('.')[0].length)}`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (resp) => {
      if (resp.isConfirmed) {
        setLoading(true);
        const result = await claimByNft(nft.tokenID);
        setLoading(false);
        if (result.success) {
          onReload();
          toast.success('Successfully claimed!');
        } else {
          toast.error(result.error);
        }
      }
    });
  }

  const onSell = () => {
    setOpenSell(true);
  }

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setError(false);
  }

  const handleSelectCoin = (event) => {
    setItemCoin(event);
  }

  const validate = useCallback(() => {
    if (isEmpty(inputValue) || inputValue === 0) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  }, [inputValue]);

  const handleSell = useCallback(async (id) => {
    if (!validate()) return;
    setOpenSell(false);
    setLoading(true);
    await createSale(id, inputValue, itemCoin);
    onReload();
    setLoading(false);
  }, [inputValue, itemCoin, onReload, validate]);

  return (
    <div className={className}>
      <div className="nft__item m-0">
        <div className="nft__item_wrap">
          <img src={'/img/nfts/dolphin.png'} className="img-fluid" alt="img" />
          {/* <video className="nft-video-item" poster="" autoPlay={true} loop={true} muted>
            <source id="video_source" src="./video/banner.m4v" type="video/mp4"></source>
          </video> */}
        </div>
        <div className="nft__item_info mt-2">
          <span className='fs-20 f-space text-white'>{nft.symbol} {nft.tokenID}</span>
        </div>
        <div className='d-flex flex-row justify-content-between gap-2'>
          <div style={{ width: '50%' }}>
            <ROIBar date={left_time} rate={rate} roi={roi} />
          </div>
          <div style={{ width: '50%' }}>
            <div className='d-flex flex-column justify-content-between h-100'>
              <div>
                <span>Purchase on</span>
                <div className='text-white'>{getUTCDate(nft.createdTime)}</div>
              </div>
              <div className="single-line"></div>
              <div>
                <span>Revenue</span>
                <div className='text-white'>${revenue.toFixed(8 - revenue.toString().split('.')[0].length)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="spacer-10"></div>
        <div className="d-flex justify-content-between">
          <button className='btn-main' onClick={() => onClaim(nft)}>Claim</button>
          <button className='btn-main' onClick={onSell}>Sell</button>
        </div>
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
        <div className="single-w-line"></div>
        <Modal.Body>
          <form id="form-create-item" className="form-border" action="#">
            <div className="field-set">
              <div className="row">
                <div className="col-md-8">
                  <h5>Price</h5>
                  <input type="number" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item" onChange={handleChange} autoComplete="off" />
                  {error && (
                    <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
                  )}
                </div>
                <div className="col-md-4">
                  <h5>&nbsp;</h5>
                  <SelectCoin value={itemCoin} onChange={handleSelectCoin} />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-main" onClick={() => setOpenSell(false)}>Cancel</button>
          <button className="btn-main" onClick={() => handleSell(nft.tokenID)}>Sell Now</button>
        </Modal.Footer>
      </Modal>
      <BackLoading loading={loading} title='Pending...' />
    </div>
  );
};

export default memo(NftClaimCard);