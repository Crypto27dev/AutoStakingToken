import React from 'react';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';

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

const Activity = function () {

  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [openMenu4, setOpenMenu4] = React.useState(false);
  const handleBtnClick = (): void => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    setOpenMenu2(false);
    setOpenMenu3(false);
    setOpenMenu4(false);
    document.getElementById("follow").classList.remove("active");
    document.getElementById("sale").classList.remove("active");
    document.getElementById("offer").classList.remove("active");
    document.getElementById("like").classList.remove("active");
  };
  const handleBtnClick1 = (): void => {
    setOpenMenu1(!openMenu1);
    setOpenMenu2(false);
    setOpenMenu(false);
    setOpenMenu3(false);
    setOpenMenu4(false);
    document.getElementById("follow").classList.add("active");
    document.getElementById("sale").classList.remove("active");
    document.getElementById("offer").classList.remove("active");
    document.getElementById("like").classList.remove("active");
  };
  const handleBtnClick2 = (): void => {
    setOpenMenu2(!openMenu2);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(false);
    setOpenMenu4(false);
    document.getElementById("follow").classList.remove("active");
    document.getElementById("sale").classList.add("active");
    document.getElementById("offer").classList.remove("active");
    document.getElementById("like").classList.remove("active");
  };
  const handleBtnClick3 = (): void => {
    setOpenMenu3(!openMenu3);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu2(false);
    setOpenMenu4(false);
    document.getElementById("follow").classList.remove("active");
    document.getElementById("sale").classList.remove("active");
    document.getElementById("offer").classList.remove("active");
    document.getElementById("like").classList.add("active");
  };
  const handleBtnClick4 = (): void => {
    setOpenMenu4(!openMenu4);
    setOpenMenu(false);
    setOpenMenu1(false);
    setOpenMenu3(false);
    setOpenMenu2(false);
    document.getElementById("follow").classList.remove("active");
    document.getElementById("sale").classList.remove("active");
    document.getElementById("offer").classList.add("active");
    document.getElementById("like").classList.remove("active");
  };


  return (
    <div>
      <GlobalStyles />

      <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <h1 className='text-center'>Activity</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container'>
        <div className='row'>

          <div className="col-md-8">

            {openMenu && (
              <ul className="activity-list">
                <li className="act_follow">
                  <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Monica Lucas</h4>
                    started following <span className='color'>Gayle Hicks</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_sale">
                  <img className="lazy" src="./img/items/thumbnail-2.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Deep Sea Phantasy</h4>
                    1 edition purchased by <span className='color'>Stacy Long</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_follow">
                  <img className="lazy" src="./img/author/author-2.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Mamie Barnett</h4>
                    started following <span className='color'>Claude Banks</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_sale">
                  <img className="lazy" src="./img/items/thumbnail-4.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Two Tigers</h4>
                    1 edition purchased by <span className='color'>Jimmy Wright</span> for 0.02 ETH
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_like">
                  <img className="lazy" src="./img/items/thumbnail-7.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Cute Astronout</h4>
                    liked by <span className='color'>Nicholas Daniels</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_offer">
                  <img className="lazy" src="./img/items/thumbnail-5.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Purple Planet</h4>
                    <span className='color'>Franklin Greer</span> offered 0.002 ETH
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_like">
                  <img className="lazy" src="./img/items/thumbnail-6.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Cute Astronout</h4>
                    liked by <span className='color'>Nicholas Daniels</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
              </ul>
            )}

            {openMenu1 && (
              <ul className="activity-list">
                <li className="act_follow">
                  <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Monica Lucas</h4>
                    started following <span className='color'>Gayle Hicks</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_follow">
                  <img className="lazy" src="./img/author/author-2.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Mamie Barnett</h4>
                    started following <span className='color'>Claude Banks</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
              </ul>
            )}

            {openMenu2 && (
              <ul className="activity-list">
                <li className="act_sale">
                  <img className="lazy" src="./img/items/thumbnail-2.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Deep Sea Phantasy</h4>
                    1 edition purchased by <span className='color'>Stacy Long</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_sale">
                  <img className="lazy" src="./img/items/thumbnail-4.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Two Tigers</h4>
                    1 edition purchased by <span className='color'>Jimmy Wright</span> for 0.02 ETH
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
              </ul>
            )}

            {openMenu3 && (
              <ul className="activity-list">
                <li className="act_like">
                  <img className="lazy" src="./img/items/thumbnail-7.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Cute Astronout</h4>
                    liked by <span className='color'>Nicholas Daniels</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
                <li className="act_like">
                  <img className="lazy" src="./img/items/thumbnail-6.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Cute Astronout</h4>
                    liked by <span className='color'>Nicholas Daniels</span>
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
              </ul>
            )}

            {openMenu4 && (
              <ul className="activity-list">
                <li className="act_offer">
                  <img className="lazy" src="./img/items/thumbnail-5.jpg" alt="" />
                  <div className="act_list_text">
                    <h4>Purple Planet</h4>
                    <span className='color'>Franklin Greer</span> offered 0.002 ETH
                    <span className="act_list_date">
                      10/07/2021, 12:40
                    </span>
                  </div>
                </li>
              </ul>
            )}
          </div>


          <div className="col-md-4">
            <span className="filter__l">Filter</span>
            <span className="filter__r" onClick={handleBtnClick}>Reset</span>
            <div className="spacer-half"></div>
            <div className="clearfix"></div>
            <ul className="activity-filter">
              <li id='sale' className="filter_by_sales" onClick={handleBtnClick2}><i className="fa fa-shopping-basket"></i>Sales</li>
              <li id='like' className="filter_by_likes" onClick={handleBtnClick3}><i className="fa fa-heart"></i>Likes</li>
              <li id='offer' className="filter_by_offers" onClick={handleBtnClick4}><i className="fa fa-gavel"></i>Offers</li>
              <li id='follow' className="filter_by_followings" onClick={handleBtnClick1}><i className="fa fa-check"></i>Followings</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>

  );
}

export default Activity;