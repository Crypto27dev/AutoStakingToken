import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ColumnNewRedux from '../components/ColumnNewRedux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../store/selectors';
import { fetchAuthorList } from "../../store/actions/thunks";
import { getAvatar } from "../../utils";
import api from "../../core/api";

const GlobalStyles = createGlobalStyle`
  #profile_banner {
    padding: 0;
    .mainbreadcumb {
      padding: 92px 0 0;
    }
  }
  .profile_img {
    object-fit: cover;
    object-position: center;
  }
  .profile_avatar img {
    border-radius: 50%;
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
  @media only screen and (max-width: 1199px) {
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const Colection = ({ authorId }) => {
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [navImage, setNavImage] = React.useState({});
  const [avatar, setAvatar] = React.useState({});
  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    setOpenMenu2(false);
    setOpenMenu3(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
    document.getElementById("Mainbtn3").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu2(false);
    setOpenMenu3(false);
    setOpenMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
    document.getElementById("Mainbtn3").classList.remove("active");
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(false);
    document.getElementById("Mainbtn2").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn3").classList.remove("active");
  };
  const handleBtnClick3 = () => {
    setOpenMenu3(!openMenu3);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu2(false);
    document.getElementById("Mainbtn3").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Mainbtn2").classList.remove("active");
  };

  const dispatch = useDispatch();
  const currentUser = useSelector(selectors.userState);

  useEffect(() => {
    setNavImage((currentUser && currentUser.banner) ? api.imgUrl + currentUser.banner : api.rootUrl + "/img/background/1.jpg");
  }, [currentUser]);

  useEffect(() => {
    setAvatar(getAvatar(currentUser));
  }, [currentUser]);

  useEffect(() => {
    dispatch(fetchAuthorList(authorId));
  }, [dispatch, authorId]);

  return (
    <div>
      <GlobalStyles />
      <section id='profile_banner' className='jumbotron breadcumb no-bg'>
        <div className='mainbreadcumb'>
          <img className="profile_img" src={navImage} width="100%" height="400px" alt=""></img>
        </div>
      </section>

      <section className='container no-bottom'>
        <div className='row'>
          <div className="col-md-12">
            <div className="d_profile de-flex">
              <div className="de-flex-col">
                <div className="profile_avatar">
                  <img className="profile_img" src={avatar} width="150px" height="150px" alt=""></img>
                  <div className="profile_name">
                    <h4>
                      {currentUser.username}
                      {/* <span className="profile_username">{author.social}</span> */}
                    </h4>
                    <span id="wallet" className="profile_wallet">{currentUser.address}</span>
                    <button id="btn_copy" title="Copy Text">Copy</button>
                  </div>
                </div>
              </div>
              <div className="profile_follow de-flex">
                <div className="de-flex-col">
                  <div className="profile_follower">{/*{currentUser.followers}*/} followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container no-top'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className="items_filter">
              <ul className="de_nav text-left">
                <li id='Mainbtn' className="active"><span onClick={handleBtnClick}>On Sale</span></li>
                <li id='Mainbtn1' className=""><span onClick={handleBtnClick1}>Created</span></li>
                <li id='Mainbtn2' className=""><span onClick={handleBtnClick2}>Collectibles</span></li>
                <li id='Mainbtn3' className=""><span onClick={handleBtnClick3}>Liked</span></li>
              </ul>
            </div>
          </div>
        </div>
        {openMenu && currentUser && currentUser._id && (
          <div id='zero1' className='onStep fadeIn'>
            <ColumnNewRedux showLoadMore={true} authorId={currentUser._id} activeIndex={0} />
          </div>
        )}
        {openMenu1 && currentUser && currentUser._id && (
          <div id='zero2' className='onStep fadeIn'>
            <ColumnNewRedux showLoadMore={true} authorId={currentUser._id} activeIndex={1}/>
          </div>
        )}
        {openMenu2 && currentUser && currentUser._id && (
          <div id='zero3' className='onStep fadeIn'>
            <ColumnNewRedux showLoadMore={true} authorId={currentUser._id} activeIndex={2}/>
          </div>
        )}
        {openMenu3 && currentUser && currentUser._id && (
          <div id='zero4' className='onStep fadeIn'>
            <ColumnNewRedux showLoadMore={true} authorId={currentUser._id} activeIndex={3}/>
          </div>
        )}
      </section>


      <Footer />
    </div>
  );
}
export default memo(Colection);