import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import { createGlobalStyle } from 'styled-components';
import SubjectIcon from '@mui/icons-material/Subject';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import Swal from 'sweetalert2';
import ExClock from "../components/ExClock";
import Footer from '../components/footer';
import CollapseItem from '../components/Collapse';
import CarouselItems from "../components/CarouselItems";
import * as selectors from '../../store/selectors';
import { fetchNftDetail } from "../../store/actions/thunks";
import { getCoinName, getTime, getAvatar, Toast } from "../../utils";
import { singleMintOnSale, destroySale, checkNetwork, updateBalanceOfAccount } from "../../web3/web3";
import api from "../../core/api";
import { navigate } from "@reach/router";

const GlobalStyles = createGlobalStyle`
  .mr40{
    margin-right: 40px;
  }
  .mr15{
    margin-right: 15px;
  }
	.btn-main {
		background: #5947FF;
	}
  .btn2{
    background: transparent;
    border: solid 2px #5947FF;
  }
  .downcounter_info, .item_price_info {
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid #5947FF;
		box-sizing: border-box;
		border-radius: 15px;
		margin-bottom: 10px;
  }
	.info_title {
		color: white;
		margin: 15px;
	}
	.info_content {
		display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 30px;
		margin-bottom: 20px;
		.Clock-item {
			text-align: center;
			color: white;
		}
		.Clock-days, .Clock-hours, .Clock-minutes, .Clock-seconds {
			padding: 10px;
			background: #5947FF;
			color: white;
		}
		&.info_price {
			gap: 10px;
			h2, span {
				margin: 0;
			}
		}
	}
	.info_button {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		margin-bottom: 20px;
	}
	.nft_info {
		justify-content: space-between;
		background: #36427F;
		padding: 10px;
		h2 {
			margin: 0;
		}
	}
	.nft-description {
		margin-top: 2rem;
		.desc-title {
			text-align: left;
			background: #ffffff66;
			border-radius: 15px 15px 0px 0px;
			padding: 10px;
			font-size: 18px;
			color: white;
		}
		.about-title {
			border-radius: 0;
		}
		.desc-content {
			color: white;
			text-align: left;
			background: rgba(54, 66, 127, 0.5);
			padding: 20px;
		}
		.about-content {
			border-radius: 0 0 15px 15px;
		}
	}
  @media only screen and (max-width: 1199px) {
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const ItemDetailRedux = ({ nftId }) => {
	const dispatch = useDispatch();
	const currentUser = useSelector(selectors.userState);
	const userBalance = useSelector(selectors.userBalance);
	const nftDetailState = useSelector(selectors.nftDetailState);
	const nft = nftDetailState.data ? nftDetailState.data : {};

	const [openCheckoutNow, setOpenCheckoutNow] = React.useState(false);
	const [openCheckout, setOpenCheckout] = React.useState(false);
	const [openCheckoutbid, setOpenCheckoutbid] = React.useState(false);

	const putOnSale = async () => {
		let checkResult = await checkNetwork();
		if (!checkResult) return;
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then(async (result) => {
			if (result.isConfirmed) {
				const price = nft.auctionPeriod > 0 ? nft.auctionPrice : nft.price;
				const result = await singleMintOnSale(currentUser.address, nft._id, nft.auctionPeriod * 24 * 3600, price, 0);
				if (result.success) {
					Toast.fire({
						icon: 'success',
						title: 'Put on sale successfully!'
					})
					dispatch(fetchNftDetail(nftId));
				} else {
					Toast.fire({
						icon: 'error',
						title: 'Sorry! Something went wrong.'
					})
				}
			}
		})

	}

	const removeSale = async () => {
		let checkResut = await checkNetwork();
		if (!checkResut) return;
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then(async (result) => {
			if (result.isConfirmed) {
				const result = await destroySale(currentUser.address, nft._id);
				if (result.success) {
					Toast.fire({
						icon: 'success',
						title: 'Canceled successfully!'
					})
					dispatch(fetchNftDetail(nftId));
				} else {
					Toast.fire({
						icon: 'error',
						title: 'Sorry! Something went wrong.'
					})
				}
			}
		})
	}

	useEffect(() => {
		updateBalanceOfAccount();
	}, []);

	useEffect(() => {
		dispatch(fetchNftDetail(nftId));
	}, [dispatch, nftId]);

	return (
		<div>
			<GlobalStyles />
			<section className='container'>
				<div className='row mt-md-5 pt-md-4'>
					<div className="col-md-6 text-center">
						<img src={nft.logoURL ? api.imgUrl + nft.logoURL : ''} className="img-fluid img-rounded mb-sm-30" alt="" />
						<div className="d-flex align-items-center flex-row nft_info mt-3">
							<img src={api.rootUrl + `/img/icons/${getCoinName(nft.chain).toLowerCase()}.png`} width="30" alt="" />
							<h3 className="m-0">{nft.name}</h3>
							<div className="text-white">
								<i className="fa fa-heart"></i><span> {nft.likes}</span>
							</div>
						</div>
						<div className="nft-description">
							<div className="desc-title">
								<SubjectIcon /> Description
							</div>
							<div className="desc-content">
								Created by <span className="color">{nft.owner && nft.owner.username}</span>
							</div>
						</div>
						{nft.collection_id && (
							<div className="nft-description mt-0">
								<div className="desc-title about-title">
									<WysiwygIcon /> About {nft.collection_id.name}
								</div>
								<div className="desc-content about-content">
									<img src={api.imgUrl + nft.collection_id.logoURL} alt="" width="40px"></img> {nft.collection_id.description}
								</div>
							</div>
						)}
					</div>
					<div className="col-md-6">
						<div className="item_info">
							{Object.keys(nft).length > 0 && nft.creator._id === currentUser._id && (
								<div className="mb-3 d-flex justify-content-end gap-2">
									{(nft.isSale === 0 || nft.bids.length === 0) && (
										<button className="btn-main btn2 lead" onClick={() => navigate(`/edit_item/${nft._id}`)}>Edit</button>
									)}
									{(nft.isSale > 0 && nft.bids.length === 0) && (
										<button className="btn-main btn2 lead" onClick={removeSale}>Cancel</button>
									)}
									{nft.isSale === 0 && (
										<button className="btn-main btn2 lead" onClick={putOnSale}>Sell</button>
									)}
								</div>
							)}
							{(nft.isSale === 2 || nft.auctionPeriod > 0) && // if auction
								<div className="downcounter_info">
									<div className="info_title">Auctions ends in {new Date().toUTCString()}</div>
									<div className="info_content">
										<ExClock deadline={getTime(nft.auctionPeriod)} />
									</div>
								</div>
							}
							<div className="item_price_info">
								<div className="info_title">Current price</div>
								<div className="info_content info_price">
									<img src={api.rootUrl + `/img/icons/${getCoinName(nft.chain).toLowerCase()}.png`} width="40" alt="" />&nbsp;&nbsp;
									<h2>{(nft.isSale < 2 && nft.auctionPeriod === 0) ? nft.price : nft.auctionPrice} {getCoinName(nft.chain)}</h2>
									<span>($300)</span>
								</div>
								{/* button for checkout */}
								{Object.keys(nft).length > 0 && nft.creator._id !== currentUser._id && (
									<>
										<div className="info_button">
											{nft.isSale === 1 && (
												<button className='btn-main lead' onClick={() => setOpenCheckoutNow(true)}><i className="fa icon_wallet" />&nbsp; Buy Now</button>
											)}
											{nft.isSale < 2 && (
												<button className='btn-main lead' onClick={() => setOpenCheckout(true)}><i className="fa icon_tag_alt" />&nbsp; Make offer</button>
											)}
											{nft.isSale === 2 && (
												<button className='btn-main btn2 lead' onClick={() => setOpenCheckoutbid(true)}><i className="fa wm icon_wallet" />&nbsp; Place a Bid</button>
											)}
										</div>
									</>
								)}
							</div>
							<CollapseItem title="Price History" open={true}>
								<div className="tab-2 onStep fadeIn">
									{nft.history && nft.history.map((bid, index) => (
										<div className="p_list" key={index}>
											<div className="p_list_pp">
												<span>
													<img className="lazy" src={api.baseUrl + bid.author.avatar.url} alt="" />
													<i className="fa fa-check"></i>
												</span>
											</div>
											<div className="p_list_info">
												Bid {bid.author.id === nft.author.id && 'accepted'} <b>{bid.value} ETH</b>
												<span>by <b>{bid.author.username}</b> at {moment(bid.created_at).format('L, LT')}</span>
											</div>
										</div>
									))}
								</div>
							</CollapseItem>
							<CollapseItem title="Listing">
								<div className="tab-2 onStep fadeIn">
									{nft.history && nft.history.map((bid, index) => (
										<div className="p_list" key={index}>
											<div className="p_list_pp">
												<span>
													<img className="lazy" src={api.baseUrl + bid.author.avatar.url} alt="" />
													<i className="fa fa-check"></i>
												</span>
											</div>
											<div className="p_list_info">
												Bid {bid.author.id === nft.author.id && 'accepted'} <b>{bid.value} ETH</b>
												<span>by <b>{bid.author.username}</b> at {moment(bid.created_at).format('L, LT')}</span>
											</div>
										</div>
									))}
								</div>
							</CollapseItem>
							<CollapseItem title="Offers">
								<div className="tab-2 onStep fadeIn">
									{nft.history && nft.history.map((bid, index) => (
										<div className="p_list" key={index}>
											<div className="p_list_pp">
												<span>
													<img className="lazy" src={getAvatar(nft.owner)} alt="" />
													<i className="fa fa-check"></i>
												</span>
											</div>
											<div className="p_list_info">
												Bid {bid.author.id === nft.author.id && 'accepted'} <b>{bid.value} ETH</b>
												<span>by <b>{bid.author.username}</b> at {moment(bid.created_at).format('L, LT')}</span>
											</div>
										</div>
									))}
								</div>
							</CollapseItem>
						</div>
					</div>
					<div className="col-lg-12 col-md-12">
						<CollapseItem title="More From This Collection" open={true}>
							<div className="tab-2 onStep fadeIn">
								<CarouselItems collectionId={(nft.collection_id && nft.collection_id._id) ? nft.collection_id._id : null} />
							</div>
						</CollapseItem>
					</div>
				</div>
			</section>
			<Footer />
			{openCheckoutNow &&
				<div className='checkout'>
					<div className='maincheckout'>
						<button className='btn-close' onClick={() => setOpenCheckoutNow(false)}>x</button>
						<div className='heading'>
							<h3 className="text-black">Checkout</h3>
						</div>
						<p>You are about to purchase a <span className="bold">{nft.name}</span>
						<span className="bold"> from {currentUser.username}</span></p>
						<div className='heading mt-3'>
							<p>Your balance</p>
							<div className='subtotal'>
								{userBalance} {getCoinName(nft.chain)}
							</div>
						</div>
						{/* <div className='heading'>
							<p>Service fee 2.5%</p>
							<div className='subtotal'>
								0.00325 ETH
							</div>
						</div> */}
						<div className='heading'>
							<p>You will pay</p>
							<div className='subtotal'>
								{nft.price} {getCoinName(nft.chain)}
							</div>
						</div>
						<button className='btn-main lead mb-5'>Checkout</button>
					</div>
				</div>
			}
			{openCheckout &&
				<div className='checkout'>
					<div className='maincheckout'>
						<button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
						<div className='heading'>
							<h3 className="text-black">Checkout</h3>
						</div>
						<p>You are about to purchase a <span className="bold">{nft.name}</span>
						<span className="bold"> from {currentUser.username}</span></p>
						<div className='detailcheckout mt-4'>
							<div className='listcheckout'>
								<h6 className="text-black">
									Enter quantity.
									<span className="color">10 available</span>
								</h6>
								<input type="text" name="buy_now_qty" id="buy_now_qty" className="form-control" autoComplete="off" />
							</div>

						</div>
						<div className='heading mt-3'>
							<p>Your balance</p>
							<div className='subtotal'>
								{userBalance} {getCoinName(nft.chain)}
							</div>
						</div>
						{/* <div className='heading'>
							<p>Service fee 2.5%</p>
							<div className='subtotal'>
								0.00325 ETH
							</div>
						</div> */}
						<div className='heading'>
							<p>You will pay</p>
							<div className='subtotal'>
								{nft.price} {getCoinName(nft.chain)}
							</div>
						</div>
						<button className='btn-main lead mb-5'>Checkout</button>
					</div>
				</div>
			}
			{openCheckoutbid &&
				<div className='checkout'>
					<div className='maincheckout'>
						<button className='btn-close' onClick={() => setOpenCheckoutbid(false)}>x</button>
						<div className='heading'>
							<h3>Place a Bid</h3>
						</div>
						<p>You are about to purchase a <span className="bold">{nft.name}</span>
						<span className="bold"> from {currentUser.username}</span></p>
						<div className='detailcheckout mt-4'>
							<div className='listcheckout'>
								<h6>
									Your bid (ETH)
								</h6>
								<input type="text" className="form-control" autoComplete="off" />
							</div>
						</div>
						<div className='detailcheckout mt-3'>
							<div className='listcheckout'>
								<h6>
									Enter quantity.
									<span className="color">10 available</span>
								</h6>
								<input type="text" name="buy_now_qty" id="buy_now_qty" className="form-control" autoComplete="off" />
							</div>
						</div>
						<div className='heading mt-3'>
							<p>Your balance</p>
							<div className='subtotal'>
								{userBalance} {getCoinName(nft.chain)}
							</div>
						</div>
						{/* <div className='heading'>
							<p>Service fee 2.5%</p>
							<div className='subtotal'>
								0.00325 ETH
							</div>
						</div> */}
						<div className='heading'>
							<p>You will pay</p>
							<div className='subtotal'>
								{nft.price} {getCoinName(nft.chain)}
							</div>
						</div>
						<button className='btn-main lead mb-5'>Checkout</button>
					</div>
				</div>
			}

		</div>
	);
}

export default memo(ItemDetailRedux);