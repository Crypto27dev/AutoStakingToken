import React, { Component } from "react";
import Select from 'react-select';
import { navigate } from '@reach/router';
import { connect } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import Slider from '@mui/material/Slider';
import axios from 'axios';
import Swal from 'sweetalert2';
import { singleMintOnSale } from "../../web3/web3";
import Clock from "../components/Clock";
import Footer from '../components/footer';
import SelectCoin from "../components/SelectCoin";
import { fetchUserCollections, fetchNftDetail } from "../../store/actions/thunks";
import { getCoinName, getAvatar, Toast, isEmpty } from "../../utils";
import { checkNetwork } from "../../web3/web3";
import api from '../../core/api';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  .MuiSwitch-track {
    background-color: white !important;
  }
  .mainside{
    .connect-wal{
      display: none;
    }
    .logout{
      display: flex;
      align-items: center;
    }
  }
  .nft__collection-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
  }
  @media only screen and (max-width: 1199px) {
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;


const defaultValue = {
  value: null,
  label: 'Select Collection'
};

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

class EditItem extends Component {

  constructor() {
    super();
    this.state = {
      selectFile: null,
      item_price: '',
      item_chain: 0, // 0: AVAX, 1: MATIC, 2: BNB
      item_price_bid: '',
      auction_period: '',
      item_title: '',
      item_royalties: 0,
      item_desc: '',
      selectedColl: {},
      collectionId: null,
      collectionName: '',
      isSale: true,
      method: 'buy_now',
      error: {
        item_price: false,
        item_price_bid: false,
        auction_period: false,
        item_title: false,
        item_royalties: false,
        item_desc: false,
        collectionId: false
      }
    };
  }

  componentDidMount() {
    const { currentUser, nftId } = this.props;
    if (currentUser && currentUser._id) {
      this.props.getUserCollections(currentUser._id);
      this.props.getNFTDetail(nftId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser, nftId, nftDetail } = nextProps;
    if (currentUser && currentUser._id && this.props.currentUser._id !== currentUser._id) {
      nextProps.getUserCollections(currentUser._id);
      nextProps.getNFTDetail(nftId);
    }
    this.loadNFTDetail(nftDetail);
  }

  loadNFTDetail = (nftDetail) => {
    if (nftDetail.data) {
      const data = nftDetail.data;
      document.getElementById("get_file_2").src = api.imgUrl + data.logoURL;
      this.setState({
        item_price: data.price,
        item_chain: data.chain, // 0: AVAX, 1: MATIC, 2: BNB
        item_price_bid: data.auctionPrice,
        auction_period: data.auctionPeriod,
        item_title: data.name,
        item_royalties: Number(data.royalty),
        item_desc: data.description,
        selectedColl: {value: data.collection_id._id, label: data.collection_id.name},
        collectionId: data.collection_id._id,
        collectionName: data.collection_id.name,
        isSale: true,
        method: data.isSale < 2 ? 'buy_now' : 'on_auction',
      });
      if (data.isSale < 2) this.handleShow();
      else this.handleShow1();
    }
  }

  handleShow = () => {
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("tab_opt_1").classList.remove("hide");
    document.getElementById("tab_opt_2").classList.remove("show");
    document.getElementById("btn1").classList.add("active");
    document.getElementById("btn2").classList.remove("active");
    this.setState({ method: 'buy_now' });
  }
  handleShow1 = () => {
    document.getElementById("tab_opt_1").classList.add("hide");
    document.getElementById("tab_opt_1").classList.remove("show");
    document.getElementById("tab_opt_2").classList.add("show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.add("active");
    this.setState({ method: 'on_auction' });
  }

  handleChange = (event) => {
    if (event.target.value) {
      const { error } = this.state;
      error[event.target.name] = false;
      this.setState({ error });
    }
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeSwitch = (event) => {
    this.setState({ isSale: event.target.checked });
  }

  handleSelectCoin = (event) => {
    this.setState({ item_chain: event })
  }

  handleSlider = (event) => {
    this.setState({ item_royalties: event.target.value });
  }

  handleCollection = (event) => {
    if (event.value !== null) {
      const { error } = this.state;
      error.collectionId = false;
      this.setState({ error });
    }
    this.setState({ selectedColl: event, collectionId: event.value });
  }

  saveItem = (params) => {
    let parent = this;
    axios({
      method: "post",
      url: `${api.baseUrl + api.nfts}/create`,
      data: params
    })
      .then(async function (response) {
        if (params.isSale === true) {
          var aucperiod = (response.data.isSale === 1 ? 0 : response.data.auctionPeriod);
          var price = (response.data.isSale === 1 ? response.data.price : response.data.auctionPrice)
          let ret = await singleMintOnSale(
            parent.props.currentUser.address,
            response.data._id,
            aucperiod * 24 * 3600,
            price,
            0);
          if (ret.success === true) {
            Toast.fire({
              icon: 'success',
              title: 'Created new NFT successfully!'
            })
          } else {
            Toast.fire({
              icon: 'error',
              title: 'Created new NFT without putting on sale!'
            })
            console.log("failed in put on sale : ", ret.status);
          }
        } else {
          Toast.fire({
            icon: 'success',
            title: 'Created new NFT successfully!'
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  validation = () => {
    const { error, method, item_price, item_price_bid, auction_period, item_title, item_royalties, item_desc, collectionId } = this.state;
    const validate = { item_title, item_royalties, item_desc, collectionId };
    const validateFixed = { ...validate, item_price };
    const validateTime = { ...validate, item_price_bid, auction_period };
    let isSucceed = true;
    if (method === 'buy_now') {
      Object.entries(validateFixed).forEach(([key, value]) => {
        if (value === null || isEmpty(value)) {
          error[key] = true;
          console.log(key, value);
          isSucceed = false;
        }
      });
    } else {
      Object.entries(validateTime).forEach(([key, value]) => {
        if (value === null || isEmpty(value)) {
          error[key] = true;
          isSucceed = false;
        }
      });
    }
    this.setState({ error });
    return isSucceed;
  }

  updateItem = async () => {
    if (!this.validation()) {
      return;
    }
    const { nftId } = this.props;
    
    const params = {};
    params._id = nftId;
    params.name = this.state.item_title;
    params.description = this.state.item_desc;
    params.royalty = this.state.item_royalties;
    params.isSale = 0;
    if (this.state.method === 'buy_now') {
      params.price = !this.state.isSale ? 0 : this.state.item_price;
      params.auctionPrice = 0;
      params.auctionPeriod = 0;
    } else {
      params.price = 0;
      params.auctionPrice = !this.state.isSale ? 0 : this.state.item_price_bid;
      params.auctionPeriod = isEmpty(this.state.auction_period) ? 0 : this.state.auction_period;
    }
    const { data } = await axios({
      method: "put",
      url: `${api.baseUrl + api.nfts}/update`,
      data: params
    })
    if (data.success) {
      Toast.fire({
        icon: 'success',
        title: 'Updated a item successfully!'
      }).then(() => {
        navigate(`/ItemDetail/${nftId}`);
      })
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Sorry! Updating failed. Please try again later!'
      })
    }
  }

  putOnSale = async () => {
		let checkResult = await checkNetwork();
    const { item_price, item_price_bid, auction_period } = this.state;
    const { currentUser, nftId } = this.props;
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
				const price = auction_period > 0 ? item_price_bid : item_price;
				const result = await singleMintOnSale(currentUser.address, nftId, auction_period * 24 * 3600, price, 0);
				if (result.success) {
					Toast.fire({
						icon: 'success',
						title: 'Put on sale successfully!'
					}).then(() => {
            navigate(`/ItemDetail/${nftId}`);
          })
				} else {
					Toast.fire({
						icon: 'error',
						title: 'Sorry! Transaction failed.'
					})
				}
			}
		})

	}

  render() {
    const subCollections = [];
    if (this.props.collections.data != null) {
      for (var i = 0; i < this.props.collections.data.length; i++) {
        subCollections.push({ value: this.props.collections.data[i]._id, label: this.props.collections.data[i].name });
      }
    }
    const { error } = this.state;
    const { currentUser } = this.props;
    const chainName = getCoinName(this.state.item_chain);
    const item_price = this.state.method === 'buy_now' ? this.state.item_price : this.state.method === 'on_auction' ? this.state.item_price_bid : this.state.item_priceover;

    return (
      <div>
        <GlobalStyles />

        <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${api.rootUrl + '/img/background/subheader.jpg'})` }}>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>Single Edit Item</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container'>

          <div className="row">
            <div className="col-lg-7 offset-lg-1 mb-5">
              <form id="form-create-item" className="form-border" action="#">
                <div className="field-set">
                  <h5>Select method</h5>
                  <div className="de_tab tab_methods">
                    <ul className="de_nav">
                      <li id='btn1' className="active" onClick={this.handleShow}><span><i className="fa fa-tag"></i>Fixed price</span>
                      </li>
                      <li id='btn2' onClick={this.handleShow1}><span><i className="fa fa-hourglass-1"></i>Timed auction</span>
                      </li>
                      {/* <li id='btn3' onClick={this.handleShow2}><span><i className="fa fa-users"></i>Open for bids</span>
                      </li> */}
                    </ul>

                    <div className="spacer-20"></div>

                    <div className="de_tab_content pt-3">

                      <div id="tab_opt_1">
                        <div className="row">
                          <div className="col-md-8">
                            <h5>Price</h5>
                            <input type="number" name="item_price" id="item_price" value={this.state.item_price} className="form-control" placeholder="enter price for one item" onChange={this.handleChange} autoComplete="off" />
                            {error.item_price && (
                              <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
                            )}
                          </div>
                          <div className="col-md-4">
                            <h5>&nbsp;</h5>
                            <SelectCoin value={this.state.item_chain} onChange={this.handleSelectCoin} />
                          </div>
                        </div>
                      </div>

                      <div id="tab_opt_2" className='hide'>
                        <div className="row">
                          <div className="col-md-8">
                            <h5>Start Price</h5>
                            <input type="number" name="item_price_bid" id="item_price_bid" value={this.state.item_price_bid} className="form-control" placeholder="enter start price" onChange={this.handleChange} autoComplete="off" />
                            {error.item_price_bid && (
                              <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the price.</span>
                            )}
                          </div>
                          <div className="col-md-4">
                            <h5>&nbsp;</h5>
                            <SelectCoin value={this.state.item_chain} onChange={this.handleSelectCoin} disabled />
                          </div>
                          <div className="spacer-10"></div>
                          <div className="col-md-12">
                            <h5>Duration</h5>
                            <input type="number" name="auction_period" id="auction_period" value={this.state.auction_period} onChange={this.handleChange} className="form-control" placeholder="enter auction days" step="1" autoComplete="off" />
                            {error.auction_period && (
                              <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the duration.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="spacer-20"></div>

                  <h5>Title</h5>
                  <input type="text" name="item_title" id="item_title" value={this.state.item_title} className="form-control" placeholder="e.g. 'Crypto Funk" onChange={this.handleChange} autoComplete="off" />
                  {error.item_title && (
                    <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the title.</span>
                  )}

                  <div className="spacer-10"></div>

                  <h5>Description</h5>
                  <textarea data-autoresize name="item_desc" id="item_desc" value={this.state.item_desc} className="form-control" placeholder="e.g. 'This is very limited item'" onChange={this.handleChange} ></textarea>
                  {error.item_desc && (
                    <span className='text-error mb-2'><i className="fa fa-warning" /> Please insert the description.</span>
                  )}

                  <div className="spacer-10"></div>

                  <h5>Collection</h5>
                  <div className="nft__collection-wrap">
                    <Select
                      styles={customStyles}
                      options={[defaultValue, ...subCollections]}
                      value={this.state.selectedColl}
                      isDisabled={true}
                    />
                  </div>
                  {error.collectionId && (
                    <span className='text-error mb-2'><i className="fa fa-warning" /> Please select a collection.</span>
                  )}

                  <div className="spacer-10"></div>

                  <h5>Royalties</h5>
                  <Slider
                    sx={{
                      height: '5px'
                    }}
                    aria-label="Royalties"
                    value={this.state.item_royalties}
                    onChange={this.handleSlider}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={70}
                  />
                  <span>suggested: 0, 10%, 20%, 30%. Maximum is 70%</span>

                  <div className="spacer-10"></div>
                  <div className="d-flex flex-row gap-2">
                    <input type="button" id="submit" className="btn-main" value="Update Item" onClick={() => this.updateItem()} />
                    <input type="button" id="submit" className="btn-main" value="Put on Sale" onClick={() => this.putOnSale()} />
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-3 col-sm-6 col-xs-12">
              <h5>Preview item</h5>
              <div className="nft__item m-0">
                <div className="de_countdown">
                  <Clock deadline="December, 30, 2021" />
                </div>
                <div className="author_list_pp">
                  <span>
                    <img className="lazy" src={getAvatar(currentUser)} alt="" />
                  </span>
                </div>
                <div className="nft__item_wrap">
                  <span>
                    <img src={api.rootUrl + "/img/collections/coll-item-3.jpg"} id="get_file_2" className="lazy nft__item_preview" alt="" />
                  </span>
                </div>
                <div className="nft__item_info">
                  <span >
                    <h4>{this.state.item_title}</h4>
                  </span>
                  <div className="nft__item_price">
                    <img src={api.rootUrl + `/img/icons/${chainName.toLowerCase()}.png`} alt="" />&nbsp;&nbsp;
                    {item_price} {chainName}
                  </div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i><span>0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  collections: state.hotCollection.userHotCollections,
  nftDetail: state.NFT.nftDetail
});

const mapDispatchToProps = (dispatch) => {
  return {
    getUserCollections: id => dispatch(fetchUserCollections(0, id, true)),
    getNFTDetail: id => dispatch(fetchNftDetail(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);