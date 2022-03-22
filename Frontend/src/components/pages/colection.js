import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import ColumnExplorer from "../components/ColumnExplorer";
import * as selectors from '../../store/selectors';
import { fetchOneCollection } from "../../store/actions/thunks";
import api from "../../core/api";

const GlobalStyles = createGlobalStyle`
  .profile_avatar img {
    aspect-ratio: 1;
    background: white;
  }
  .item_desc {
    color: #727272;
    font-size: 16px;
    max-width: 400px;
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

const Colection = function ({ collectionId = 1 }) {
  const dispatch = useDispatch();
  const hotCollectionState = useSelector(selectors.oneCollectionState);
  const hotCollection = hotCollectionState.data ? hotCollectionState.data : {};

  
  useEffect(() => {
    dispatch(fetchOneCollection(collectionId));
  }, [dispatch, collectionId]);

  return (
    <div>
      <GlobalStyles />
      {hotCollection.bannerURL && (
        <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${api.imgUrl + hotCollection.bannerURL})` }}>
          <div className='mainbreadcumb'>
          </div>
        </section>
      )}

      <section className='container d_coll no-top no-bottom'>
        <div className='row'>
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                {hotCollection.logoURL &&
                  <div className="d_profile_img">
                    <img src={api.imgUrl + hotCollection.logoURL} alt="" />
                  </div>
                }
                <div className="profile_name">
                  <h4>
                    {hotCollection.name}
                    <div className="clearfix"></div>
                    {hotCollection && hotCollection.description &&
                      <span className="item_desc">{hotCollection.description}</span>
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='explore-container'>
        { hotCollection && hotCollection._id && (
          <ColumnExplorer collectionId={hotCollection._id} showCategory={false}/>
        )}
      </div>
      <Footer />
    </div>
  );
}
export default memo(Colection);