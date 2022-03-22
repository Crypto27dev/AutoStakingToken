import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { createGlobalStyle } from 'styled-components';
import axios from "axios";
import jwt_decode from "jwt-decode";
import ImageUpload from '../components/ImageUpload';
import Footer from '../components/footer';
import { signString } from "../../web3/web3";
import { isEmpty } from '../../utils';
import api from '../../core/api';
import { setAuthState } from '../../store/actions';

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
  @media only screen and (max-width: 1199px) {
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

class register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      logo_image: {},
      user_name: '',
      user_email: '',
      user_address: props.authWallet,
      user_bio: '',
      saveMode: 0,
      detailedUserInfo: 0,
      selectFile: null,
      error: {
        logo_image: false,
        user_name: false,
        user_email: false,
        user_bio: false
      }
    };
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    URL.revokeObjectURL(this.state.logo_image.preview);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user_address: nextProps.authWallet })
  }

  addLogoImages = file => {
    const { error } = this.state;
    error.logo_image = false;
    this.setState({
      logo_image: Object.assign(file[0], {
        preview: URL.createObjectURL(file[0])
      }),
      selectFile: file[0],
      error
    });
  };

  handleChange = (event) => {
    if (event.target.value) {
      const { error } = this.state;
      error[event.target.name] = false;
      this.setState({ error });
    }
    this.setState({ [event.target.name]: event.target.value });
  }

  Login = (params) => {
    const { setAuthState } = this.props;
    axios({
      method: "post",
      url: `${api.baseUrl}${api.user}/login`,
      data: params
    })
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          //set the token to sessionStroage   
          const token = response.data.token;
          localStorage.setItem("jwtToken", response.data.token);
          const decoded = jwt_decode(token);
          console.log(decoded);
          setAuthState(decoded._doc);
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Login failed, Please sign up. : ", error.message);
      });
  }

  doLogin = (address, password) => {
    const params = {};
    params.address = address;
    params.password = password;
    this.Login(params);
  }

  saveItem = async (params) => {
    if (this.state.saveMode === 0) {
      let that = this;
      await axios({
        method: "post",
        url: `${api.baseUrl}${api.user}/create`,
        data: params
      })
        .then(function (response) {
          that.doLogin(params.address, params.password);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (this.state.saveMode === 1) {
      await axios({
        method: "put",
        url: `${api.baseUrl}${api.user}${this.state.detailedUserInfo._id}`,
        data: params
      })
        .then(function (response) {
          console.log(response);
          navigate("/");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  validiation = () => {
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

    let signedString = "";
    signedString = await signString(this.state.user_address);
    if (!isEmpty(signedString)) {
      const formData = new FormData();
      formData.append("itemFile", this.state.selectFile);
      formData.append("authorId", "hch");

      let parent = this;
      await axios({
        method: "post",
        url: `${api.baseUrl}${api.utils}/upload_file`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          const params = {};
          params.address = parent.state.user_address;
          params.username = parent.state.user_name;
          params.avatar = response.data.path;
          params.userBio = parent.state.user_bio;
          params.email = parent.state.user_email;
          params.verified = true;
          params.userImg = "";
          params.password = signedString;
          parent.saveItem(params);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <GlobalStyles />

        <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
          <div className='register-breadcumb'>
            <div className='container'>
              <div className='row'>
                <div className="col-md-12 text-center">
                  <h1>Register</h1>
                  <p>Anim pariatur cliche reprehenderit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container register-container'>
          <div className="row">
            <div className='col-md-4 offset-md-1'>
              <div className="d-flex flex-column align-items-center justify-content-center text-center mb-3">
                <ImageUpload addFile={this.addLogoImages} file={this.state.logo_image} width="150px" height="150px" radius="50%" />
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
                      <input type='text' name='user_name' id='name' className="form-control" onChange={this.handleChange} autoComplete="off"/>
                      <span className='text-error mb-2'>{error.user_name ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-set">
                      <label>Email Address</label>
                      <input type='text' name='user_email' id='email' className="form-control" onChange={this.handleChange} autoComplete="off"/>
                      <span className='text-error mb-2'>{error.user_email ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="field-set">
                      <label>Wallet Address</label>
                      <input type='text' name='user_address' id='address' className="form-control" value={this.state.user_address} readOnly autoComplete="off"/>
                      <span className='text-error mb-2'>{error.user_address ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="field-set">
                      <label>Bio</label>
                      <textarea type='text' name='user_bio' id='bio' className="form-control" onChange={this.handleChange} />
                      <span className='text-error mb-2'>{error.user_bio ? 'Please insert a vaild value.' : ''}</span>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div id='submit' className="pull-left">
                      <input type='button' id='send_message' value='Register Now' className="btn btn-main color-2 mt-3" onClick={() => this.onClickUpdate()} />
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
  authWallet: state.auth.wallet,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthState: data => dispatch(setAuthState(data))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(register);