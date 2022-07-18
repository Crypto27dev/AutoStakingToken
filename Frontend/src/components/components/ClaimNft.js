import React, { useCallback, useState } from "react";
import { useSelector } from 'react-redux';
// import Select from 'react-select';
import styled from "styled-components";
import Reveal from 'react-awesome-reveal';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { createGlobalStyle } from 'styled-components';
import NftClaimCard from "./NftClaimCard";
import { getAllNFTInfos, claimAll } from '../../web3/web3';
import { fromWei, fadeIn, fadeInUp, BackLoading } from "../../utils";
import * as selectors from '../../store/selectors';

const Logo = styled.img`
  position: absolute;
  left: -100px;
  bottom: -60px;
  width: 250px;
  z-index: 0;
`;

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
`;

// const customStyles = {
//   container: (base, state) => ({
//     ...base,
//     width: '100%'
//   }),
//   option: (base, state) => ({
//     ...base,
//     color: "white",
//     background: "#151612",
//     borderColor: '#5A45FF',
//     borderRadius: state.isFocused ? "0" : 0,
//     "&:hover": {
//       background: "#273110",
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
//     color: "white",
//     background: "#1C1E11",
//     border: '1px solid #5f5f60 ',
//     borderRadius: '10px',
//     boxShadow: 'none',
//     zIndex: 0,
//     padding: '4px',
//     "&:hover": {
//       borderColor: '#9d9d9e',
//     },
//   }),
//   singleValue: (base, select) => ({
//     ...base,
//     color: 'white'
//   }),
//   placeholder: (base) => ({
//     ...base,
//     color: '#ffffff'
//   })
// };

// const defaultSort = [{
//   value: 0,
//   label: 'Recently minted'
// }, {
//   value: 1,
//   label: 'Highest revenue'
// }];

const ClaimNft = ({ onReload, nftInfos }) => {
  const [loading, setLoading] = useState(false);
  const web3 = useSelector(selectors.web3State);

  // const handleSort = (event) => {
  //   switch (event.value) {
  //     case 0:
  //       break;
  //     case 1:
  //       setNftInfos(prevState => {
  //         prevState.sort((a, b) => {
  //           return a.nftRevenue - b.nftRevenue;
  //         });
  //       })
  //       break;
  //     case 2:
  //       break;
  //     default:
  //       break;
  //   }
  // }

  const handleClaimAll = useCallback(async () => {
    if (!web3) {
      return;
    }
    let totalUSDT = 0, totalHODL = 0;
    const result = await getAllNFTInfos();
    if (result.success) {
      const data = result.nftInfos;
      for (let i = 0; i < data.tokenIDs.length; i++) {
        const nftUSDT = fromWei(data.nftUSDT[i]);
        const nftHODL = fromWei(data.nftHODL[i]);
        totalUSDT += nftUSDT;
        totalHODL += nftHODL;
      }
    }

    let text = "You will receive ";
    if (totalUSDT > 0) {
      text += totalUSDT.toFixed(8 - totalUSDT.toString().split('.')[0].length) + ' USDT ';
    }
    if (totalHODL > 0) {
      text += totalHODL.toFixed(8 - totalHODL.toString().split('.')[0].length) + ' HODL';
    }

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: text,
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
          onReload();
          toast.success('Successfully claimed!');
        } else {
          toast.error(result.status);
        }
      }
    });
  }, [onReload, web3]);

  return (
    <div className="relative">
      <GlobalStyles />
      <Logo src="./img/icons/bg-icon.png" alt=""></Logo>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
              <h1 className='fw-700 text-center'><span className='color'>MY</span> EARNINGS</h1>
            </Reveal>
          </div>
        </div>
        <Reveal className='onStep' keyframes={fadeIn} delay={400} duration={600} triggerOnce>
          <div className="row">
            {nftInfos === null && (
              <div className="col-md-12 text-center my-4">
                <span className="text-white color fs-22">CONNECT WALLET</span>
              </div>
            )}
            {(nftInfos !== null && nftInfos.length === 0) && (
              <div className="col-md-12 text-center my-4">
                <span className="text-white color fs-24">No Minted NFTs</span>
              </div>
            )}
            {nftInfos && nftInfos.length > 0 && (
              <div className="col-md-3 offset-md-6">
                {/* <Select
                  styles={customStyles}
                  options={defaultSort}
                  onChange={handleSort}
                /> */}
              </div>
            )}
            {nftInfos && nftInfos.length > 0 && (
              <div className="col-md-3">
                <button className='btn-main' onClick={handleClaimAll}>Claim All</button>
              </div>
            )}
            <div className="mt-3"></div>
            {nftInfos && nftInfos.map((nft, index) => (
              <NftClaimCard nft={nft} key={index} onReload={() => onReload()} />
            ))}
          </div>
        </Reveal>
      </div>
      <BackLoading loading={loading} title='Pending...' />
    </div >
  )
}

export default ClaimNft;