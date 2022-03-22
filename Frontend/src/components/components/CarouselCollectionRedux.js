import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "./CustomSlide";
import * as selectors from '../../store/selectors';
import { fetchNewCollections } from "../../store/actions/thunks";
import api from "../../core/api";

const CarouselCollectionRedux = () => {

  const dispatch = useDispatch();
  const newHotCollectionsState = useSelector(selectors.newHotCollectionsState);
  const newHotCollections = newHotCollectionsState.data ? newHotCollectionsState.data : [];
  
  useEffect(() => {
    dispatch(fetchNewCollections());
  }, [dispatch]);

  return (
    <div className='nft'>
      <Slider {...settings}>
        {newHotCollections && newHotCollections.map((item, index) => (
          <CustomSlide
            key={index}
            index={index + 1}
            avatar={api.imgUrl + item.logoURL}
            banner={api.imgUrl + item.featuredURL}
            username={(item.owner && item.owner.username) ? item.owner.username : ''}
            uniqueId={item.description}
            collectionId={item._id}
          />
        ))}
      </Slider>
    </div>
  );
}

export default memo(CarouselCollectionRedux);
