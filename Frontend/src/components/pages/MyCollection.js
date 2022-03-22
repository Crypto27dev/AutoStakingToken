import React, { memo } from "react";
import { useSelector } from 'react-redux';
import { navigate } from "@reach/router";
import HotCollectionRedux from '../components/HotCollectionRedux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../store/selectors';

const GlobalStyles = createGlobalStyle`
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

const Colection = () => {
  const currentUser = useSelector(selectors.userState);

  return (
    <div>
      <GlobalStyles />
      <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(img/background/collectibles.png)` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row d-flex flex-row align-items-center justify-content-center gap-3'>
              <h1 className='text-center' style={{ fontSize: "60px" }}>My Collections </h1>
              <button className="btn-main" onClick={() => navigate("/create")}>Create a Collection</button>
            </div>
          </div>
        </div>
      </section>

      <section className='container'>
        { currentUser && currentUser._id && (
          <HotCollectionRedux authorId={currentUser._id} />
        )}
      </section>

      <Footer />
    </div>
  );
}
export default memo(Colection);