import React, { Component } from "react";
import { connect } from 'react-redux';
import ImageUpload from "../components/ImageUpload";
import axios from "axios";
import Select from 'react-select';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { isEmpty, Toast } from "../../utils";
import api from "../../core/api";
import { navigate } from "@reach/router";

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
  .mainside{
    .connect-wal{
      display: none;
    }
    .logout{
      display: flex;
      align-items: center;
    }
  }
  .nav-image {
    background-size: cover;
    background-position: center;
    padding: 40px 0;
    margin-top: 92px;
    @media only screen and (max-width: 768px) {
      margin-top: 0px;
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

const defaultValue = [{
  value: 1,
  label: 'Art'
}, {
  value: 2,
  label: 'Game'
}, {
  value: 3,
  label: 'Photo'
}, {
  value: 4,
  label: 'Music'
}, {
  value: 5,
  label: 'Video'
}, {
  value: 6,
  label: 'Utility'
}];

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

class Createpage extends Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = {
      logo_image: {},
      selectLogoFile: null,
      featured_image: {},
      selectFeaturedFile: null,
      banner_image: {},
      selectBannerFile: null,
      name: '',
      desc: '',
      price: '',
      category: '',
      error: {
        name: false,
        desc: false,
        price: false,
        category: false
      }
    };
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    URL.revokeObjectURL(this.state.logo_image.preview);
    URL.revokeObjectURL(this.state.featured_image.preview);
    URL.revokeObjectURL(this.state.banner_image.preview);
  }

  addLogoImage = file => {
    this.setState({
      logo_image: Object.assign(file[0], {
        preview: URL.createObjectURL(file[0])
      }),
      selectLogoFile: file[0]
    });
  };

  addFeaturedImage = file => {
    this.setState({
      featured_image: Object.assign(file[0], {
        preview: URL.createObjectURL(file[0])
      }),
      selectFeaturedFile: file[0]
    });
  };

  addBannerImage = file => {
    this.setState({
      banner_image: Object.assign(file[0], {
        preview: URL.createObjectURL(file[0])
      }),
      selectBannerFile: file[0]
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCollection = (event) => {
    this.setState({ category: event.value });
  }

  onChange(e) {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    document.getElementById("file_name").style.display = "none";
    this.setState({ logo_image: [...this.state.logo_image, ...filesArr] });
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
    const { error } = this.state;
    if (Object.keys(this.state.logo_image).length === 0) {
      Toast.fire({
        icon: 'error',
        title: 'Please upload a logo image.'
      })
      return false;
    }
    if (Object.keys(this.state.featured_image).length === 0) {
      Toast.fire({
        icon: 'error',
        title: 'Please upload a featured image.'
      })
      return false;
    }
    if (Object.keys(this.state.banner_image).length === 0) {
      Toast.fire({
        icon: 'error',
        title: 'Please upload a banner image.'
      })
      return false;
    }
    if (isEmpty(this.state.name)) {
      error.name = true;
      return false;
    }
    if (isEmpty(this.state.desc)) {
      error.desc = true;
      return false;
    }
    if (isEmpty(this.state.price)) {
      error.price = true;
      return false;
    }
    if (isEmpty(this.state.category)) {
      error.category = true;
      return false;
    }
    return true;
  }
  
  saveCollection = async (params) => {
    await axios({
      method: "post",
      url: `${api.baseUrl}${api.collection}/`,
      data: params
    })
    .then(function (response) {
      console.log("response.data._id : ", response.data._id);
      Toast.fire({
        icon: "success",
        title: "Created a new collection successfully!"
      }).then(() => {
        navigate("/my_collection");
      })
    })
    .catch(function (error) {
      console.log(error);
    });  
  }

  handleSubmit = async () => {
    if (!this.validiation()) return;
    const { selectLogoFile, selectFeaturedFile, selectBannerFile, name, desc, price, category } = this.state;
    const { currentUser } = this.props;

    var formData = new FormData();
    formData.append("itemFile", selectLogoFile);
    formData.append("authorId", "hch");

    const params = {};
    await axios({
      method: "post",
      url: `${api.baseUrl}${api.utils}/upload_file`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        params.collectionLogoURL = response.data.path;
      })
      .catch(function (error) {
        console.log(error);
      });
      
    formData = new FormData();
    formData.append("itemFile", selectFeaturedFile);
    formData.append("authorId", "hch");

    await axios({
      method: "post",
      url: `${api.baseUrl}${api.utils}/upload_file`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        params.collectionFeaturedURL = response.data.path;
      })
      .catch(function (error) {
        console.log(error);
      });

    formData = new FormData();
    formData.append("itemFile", selectBannerFile);
    formData.append("authorId", "hch");
    let that = this;
    await axios({
      method: "post",
      url: `${api.baseUrl}${api.utils}/upload_file`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        params.collectionBannerURL = response.data.path;
        params.collectionName = name;
        params.collectionDescription = desc;
        params.collectionCategory = category;
        params.price = price;
        params.owner = currentUser._id;
        that.saveCollection(params);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  render() {
    return (
      <div>
        <GlobalStyles />

        <section className='jumbotron breadcumb nav-image' style={{ backgroundImage: `url(${'./img/background/create.png'})` }}>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>Create Collection</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container'>

          <div className="row">
            <div className="col-lg-12 mb-5">
              <form id="form-create-item" className="form-border" action="#">
                <div className="field-set">
                  <h5>Logo Image</h5>
                  <p className="text-grey">This image will also be used for navigation. 350 x 350 recommended.</p>
                  <ImageUpload addFile={this.addLogoImage} file={this.state.logo_image} width="150px" height="150px" radius="50%" />

                  <div className="spacer-single"></div>

                  <h5>Featured Image</h5>
                  <p className="text-grey">This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of OpenSea. 600 x 400 recommended.</p>
                  <ImageUpload addFile={this.addFeaturedImage} file={this.state.featured_image} width="300px" height="200px" radius="20px" />

                  <div className="spacer-single"></div>

                  <h5>Banner Image</h5>
                  <p className="text-grey">This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.</p>
                  <ImageUpload addFile={this.addBannerImage} file={this.state.banner_image} width="700px" height="400px" radius="20px" />

                  <div className="spacer-single"></div>

                  <h5>Name</h5>
                  <input type="text" name="name" id="name" className="form-control" placeholder="e.g. 'Crypto Funk" onChange={this.handleChange} autoComplete="off"/>

                  <div className="spacer-10"></div>

                  <h5>Description</h5>
                  <textarea data-autoresize name="desc" id="desc" className="form-control" placeholder="e.g. 'This is very limited item'" onChange={this.handleChange}></textarea>

                  <div className="spacer-10"></div>

                  <h5>Floor Price</h5>
                  <input type="number" name="price" id="price" className="form-control" placeholder="suggested: 1 (AVAX)" onChange={this.handleChange} autoComplete="off"/>

                  <div className="spacer-10"></div>

                  <h5>Category</h5>
                  <Select
                    styles={customStyles}
                    options={defaultValue}
                    onChange={this.handleCollection}
                  />

                  <div className="spacer-10"></div>

                  <input type="button" id="submit" className="btn-main" value="Create Item" onClick={this.handleSubmit} />
                </div>
              </form>
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
});

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Createpage);