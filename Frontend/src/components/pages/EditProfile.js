import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import axios from "axios";
import jwt_decode from "jwt-decode";
import ImageUpload from '../components/NavImageUpload';
import Footer from '../components/footer';
import { signString } from "../../web3/web3";
import { isEmpty, Toast, getAvatar } from '../../utils';
import { setAuthState } from '../../store/actions';
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
  #profile_banner {
    padding: 0;
    .mainbreadcumb {
      padding: 92px 0 0;
    }
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

class editProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      logo_image: {},
      banner_image: {},
      user_name: '',
      user_email: '',
      user_address: props.authWallet,
      user_bio: '',
      selectAvatar: null,
      selectBanner: null,
      error: {
        logo_image: false,
        banner_image: false,
        user_name: false,
        user_email: false,
        user_bio: false
      }
    };
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    URL.revokeObjectURL(this.state.logo_image.preview);
    URL.revokeObjectURL(this.state.banner_image.preview);
  }

  componentDidMount() {
    const { currentUser } = this.props;
    const logo_preview = { preview: getAvatar(currentUser) };
    const banner_preview = { preview: (currentUser && currentUser.banner) ? api.imgUrl + currentUser.banner : "/img/background/1.jpg" };
    this.setState({
      user_address: this.props.authWallet,
      user_name: (currentUser && currentUser.username) && currentUser.username,
      user_email: (currentUser && currentUser.email) && currentUser.email,
      user_bio: (currentUser && currentUser.userBio) && currentUser.userBio,
      logo_image: logo_preview,
      banner_image: banner_preview
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser } = nextProps;
    const logo_preview = { preview: getAvatar(currentUser)};
    const banner_preview = { preview: (currentUser && currentUser.banner) ? api.imgUrl + currentUser.banner : "img/background/1.jpg" };
    this.setState({
      user_address: nextProps.authWallet,
      user_name: (currentUser && currentUser.username) && currentUser.username,
      user_email: (currentUser && currentUser.email) && currentUser.email,
      user_bio: (currentUser && currentUser.userBio) && currentUser.userBio,
      logo_image: logo_preview,
      banner_image: banner_preview
    });
  }

  addLogoImages = file => {
    const { error } = this.state;
    error.logo_image = false;
    this.setState({
      logo_image: Object.assign(file[0], {
        preview: URL.createObjectURL(file[0])
      }),
      selectAvatar: file[0],
      error
    });
  };

  addBannerImage = file => {
    const { error } = this.state;
    error.banner_image = false;
    this.setState({ 
      banner_image: Object.assign(file[0], { 
        preview: URL.createObjectURL(file[0]) 
      }),
      selectBanner: file[0],
      error
    })
  };

  handleChange = (event) => {
    if (event.target.value) {
      const { error } = this.state;
      error[event.target.name] = false;
      this.setState({ error });
    }
    this.setState({ [event.target.name]: event.target.value });
  }

  reLogin = (address, password) => {    
    const params = {};
    params.address = address;
    params.password = password;
    this.Login(params);
  }
  
  Login = (params) => {
    const { setAuthState } = this.props;
    axios({
      method: "post",
      url: `${api.baseUrl}${api.user}/login`,
      data: params
    })
    .then(function (response) {
      if(response.data.success === true) { 
        //set the token to sessionStroage   
        const token = response.data.token;   
        localStorage.setItem("jwtToken", response.data.token);
        const decoded = jwt_decode(token);
        console.log('[Decode] => ', decoded._doc);
        setAuthState(decoded._doc);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  saveItem = async (params) => {
    const { currentUser } = this.props;
    let parent = this;
    await axios({
      method: "put",
      url: `${api.baseUrl}${api.user}/${currentUser._id}`,
      data: params
    })
      .then(function (response) {
        parent.reLogin(params.address, params.password);
        Toast.fire({
          icon: 'success',
          title: 'Updated profile successfully.'
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  validiation = () => {
    const { currentUser } = this.props;
    if (Object.keys(currentUser).length === 0) {
      Toast.fire({
        icon: 'warning',
        title: 'Please sign in now!'
      })
      return false;
    }
    let result = true;
    const { user_name, user_email, user_bio, logo_image, error } = this.state;
    if (isEmpty(user_name)) {
      error.user_name = true;
      result = false;
    }
    if (isEmpty(user_email)) {
      error.user_email = true;
      result = false;
    }
    if (isEmpty(user_bio)) {
      error.user_bio = true;
      result = false;
    }
    if (Object.keys(logo_image).length === 0) {
      error.logo_image = true;
      result = false;
    }
    this.setState({ error });
    return result;
  }
  onClickUpdate = async () => {
    if (!this.validiation()) return;

    const params = {};
    let signedString = "";
    signedString = await signString(this.state.user_address);
    if (!isEmpty(signedString)) {
      let response;
      if (this.state.selectAvatar) {
        const formData = new FormData();
        formData.append("itemFile", this.state.selectAvatar);
        formData.append("authorId", "hch");
        response = await axios({
          method: "post",
          url: `${api.baseUrl}${api.utils}/upload_file`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      if (this.state.selectAvatar !== null && response) 
        params.avatar =  response.data.path;

      if (this.state.selectBanner) {
        const formData = new FormData();
        formData.append("itemFile", this.state.selectBanner);
        formData.append("authorId", "hch");
        response = await axios({
          method: "post",
          url: `${api.baseUrl}${api.utils}/upload_file`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      if (this.state.selectBanner !== null && response) 
        params.banner =  response.data.path;

      params.username = this.state.user_name;
      params.email = this.state.user_email;
      params.address = this.state.user_address;
      params.userBio = this.state.user_bio;
      params.verified = true;
      params.userImg = "";
      params.password = signedString;
      this.saveItem(params);
    }
  }

  render() {
    const { error, banner_image, logo_image } = this.state;
    
    return (
      <div>
        <GlobalStyles />

        <section id='profile_banner' className='jumbotron breadcumb no-bg'>
          <div className='mainbreadcumb'>
            <ImageUpload addFile={this.addBannerImage} file={banner_image} width="100%" height="400px" />
          </div>
        </section>

        <section className='container register-container'>
          <div className="row">
            <div className='col-md-4 offset-md-1'>
              <div className="d-flex flex-column align-items-center justify-content-center text-center mb-3">
                <ImageUpload addFile={this.addLogoImages} file={logo_image} width="150px" height="150px" radius="50%" />
                <h4 className='mt-2 mb-1'>Profile Photo</h4>
                <span>We recommend an image of at least 400x400.</span>
                <span className='text-error mb-2'>{error.logo_image ? 'Please upload an image.' : ''}</span>
              </div>
            </div>
            <div className="col-md-6">
              <h3>Don't have an account? Register now.</h3>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

              <div className="spacer-10"></div>

              <form name="contactForm" id='contact_form' className="form-border" action='#'>

                <div className="row">

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Name</label>
                      <input type='text' name='user_name' id='name' className="form-control" value={this.state.user_name || ''} onChange={this.handleChange} autoComplete="off"/>
                      <span className='text-error mb-2'>{error.user_name ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Email Address</label>
                      <input type='text' name='user_email' id='email' className="form-control" value={this.state.user_email || ''} onChange={this.handleChange} autoComplete="off"/>
                      <span className='text-error mb-2'>{error.user_email ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="field-set">
                      <label>Wallet Address</label>
                      <input type='text' name='user_address' id='address' className="form-control" value={this.state.user_address || ''} readOnly autoComplete="off"/>
                      <span className='text-error mb-2'>{error.user_address ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="field-set">
                      <label>Bio</label>
                      <textarea type='text' name='user_bio' id='bio' className="form-control" value={this.state.user_bio || ''} onChange={this.handleChange} />
                      <span className='text-error mb-2'>{error.user_bio ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div id='submit' className="pull-left">
                      <input type='button' id='send_message' value='Update Now' className="btn btn-main color-2 mt-3" onClick={() => this.onClickUpdate()} />
                    </div>

                    <div className="clearfix"></div>
                  </div>

                </div>
              </form>
            </div>

          </div>
        </section>

        <Footer />
      </div>

    )
  }
};

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  authWallet: state.auth.wallet,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthState: data => dispatch(setAuthState(data))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(editProfile);