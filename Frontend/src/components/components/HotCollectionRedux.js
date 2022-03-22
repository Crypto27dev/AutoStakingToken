import React, { memo, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../store/selectors';
import CustomSlide from './CustomSlide';
import { CustomLoadingButton } from './CustomLoadingButton';
import { fetchUserCollections } from "../../store/actions/thunks";
import api from '../../core/api';

//react functional component
const ColumnNewRedux = ({ authorId = null }) => {

    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [collections, setCollections] = useState([]);

    const hotCollectionsState = useSelector(selectors.userHotCollectionsState);
    const loading = useSelector(selectors.loadingState);
    const hotCollections = useMemo(() => {
        return hotCollectionsState.data ? hotCollectionsState.data : [];
      }, [hotCollectionsState])

    useEffect(() => {
        if (page === 0)
            setCollections(hotCollections);
        else
            setCollections(prevState => [...prevState, ...hotCollections]);
    }, [hotCollections]);

    useEffect(() => {
        dispatch(fetchUserCollections(page, authorId));
    }, [dispatch, page, authorId]);

    const loadMore = () => {
        if (hotCollections.length > 0)
            setPage((page) => page + 1);
    }

    return (
        <div className='row'>
            {collections && collections.map((item, index) => (
                <CustomSlide
                    key={index}
                    index={index + 1}
                    avatar={api.imgUrl + item.logoURL}
                    banner={api.imgUrl + item.featuredURL}
                    collectionName={item.name}
                    uniqueId={item.description}
                    collectionId={item._id}
                    className='col-lg-4 col-md-6 col-sm-6 col-xs-12'
                />
            ))}
            <div className="load-more col-lg-12 mt-3" align="center">
                {loading ? (
                    <CustomLoadingButton
                        loading
                    >
                        Loading...
                    </CustomLoadingButton>
                ) : (
                    <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                )}
                <div className="spacer-single"></div>
            </div>
        </div>
    );
};

export default memo(ColumnNewRedux);