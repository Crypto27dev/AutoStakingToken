import React, { memo, useState, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ROIBar from './Market/ROIBar';
import { numberWithCommas, getUTCDate, BackLoading, isEmpty } from '../../utils';
import { buyNow, compareWalllet } from '../../web3/web3';
import * as selectors from '../../store/selectors';

const Date_Range = [65, 365, 730];
const ROI_Range = [1.5, 0.7, 0.3];

//react functional component
const NftCard = ({ nft, className = 'd-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4', onReload }) => {
  const [rate, setRate] = useState(100);
  const [left_time, setLeftTime] = useState(0);
  const [roi, setRoi] = useState(0);
  const [loading, setLoading] = useState(false);
  const wallet = useSelector(selectors.userWallet);

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
  }, [nft.createdTime, nft.nftRevenue]);

  const onBuyNow = useCallback(() => {
    if (isEmpty(wallet)) {
      toast.error(`Please connect your wallet.`);
      return;
    }
    if (compareWalllet(nft.currentOwner, wallet)) {
      toast.error(`You can't buy this NFT because it's yours.`);
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: `You will pay ${numberWithCommas(nft.saleCost, 5)} ${nft.kindOfCoin === 0 ? 'BNB' : 'USDT'}`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (resp) => {
      if (resp.isConfirmed) {
        setLoading(true);
        const result = await buyNow(nft.tokenId, nft.saleCost, nft.kindOfCoin);
        setLoading(false);
        if (result.success) {
          onReload();
          toast.success('Created a new NFT successfully!');
        } else {
          toast.error(result.status);
        }
      }
    });
  }, [nft.currentOwner, nft.kindOfCoin, nft.saleCost, nft.tokenId, onReload, wallet]);

  return (
    <div className={className}>
      <div className="nft__item m-0">
        <div className="nft__item_wrap">
          <img src={nft.imgUri} className="img-fluid" alt="Can't load" />
          {/* <video className="nft-video-item" poster="" autoPlay={true} loop={true} muted>
            <source id="video_source" src="./video/banner.m4v" type="video/mp4"></source>
          </video> */}
        </div>
        <div className="spacer-10"></div>
        <div className="d-flex flex-row justify-content-between">
          <span className="fs-18 f-space text-white">{nft.symbol} {nft.tokenId}</span>
          <span className="fs-18 f-space color">${numberWithCommas(nft.price)}</span>
        </div>
        <div className="spacer-10"></div>
        <div className='d-flex justify-content-between'>
          <span>Selling Cost</span>
          <div className='d-flex align-items-center justify-content-center gap-1'>
            <img src="/img/icons/usdt.png" alt="" style={{ width: '20px', height: '20px' }}></img>
            <div className='text-white'>{numberWithCommas(nft.saleCost, 5)}{nft.kindOfCoin === 0 ? 'BNB' : 'USDT'}</div>
          </div>
        </div>
        <div className="single-line"></div>
        <div className='d-flex flex-row justify-content-between'>
          <div className='pe-0' style={{ width: '50%' }}>
            <ROIBar date={left_time} rate={rate} roi={roi} />
          </div>
          <div className='pe-0'>
            <div className='d-flex flex-column justify-content-between h-100'>
              <div>
                <span>Created at</span>
                <div className='text-white fs-15'>{getUTCDate(nft.createdTime).format("MMM DD, YYYY")}</div>
              </div>
              <div className="single-line"></div>
              <div>
                <span>Revenue</span>
                <div className='text-white'>---</div>
              </div>
            </div>
          </div>
        </div>
        <div className="spacer-10"></div>
        <div className="d-flex justify-content-between">
          <button className='btn-main m-auto' onClick={onBuyNow}>Buy Now</button>
        </div>
      </div>
      <BackLoading loading={loading} title='Pending...' />
    </div>
  );
};

export default memo(NftCard);