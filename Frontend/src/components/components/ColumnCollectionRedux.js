import React, { memo, useState, useEffect } from 'react';
import { CustomLoadingButton } from './CustomLoadingButton';
import CustomSlide from './CustomSlide';
import { getHotCollections } from "../../store/actions/thunks";
import { categories } from './constants';
import api from '../../core/api';

//react functional component
const ColumnNewRedux = ({ showLoadMore = true, shuffle = false, categoryId = null }) => {

    const [page, setPage] = useState(0);
    const [collections, setCollections] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const loadHotCollections = async (_page, _categoryId) => {
        setLoading(true);
        const data = await getHotCollections(_page, categories[_categoryId]);
        if (data.success) {
            if (page === 0)
                setCollections(data.data);
            else
                setCollections((prevState) => [...prevState, ...data.data]);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadHotCollections(page, categoryId);
    }, [page, categoryId]);

    const loadMore = () => {
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
            {showLoadMore && (
                <div className="load-more col-lg-12 mt-3" align="center">
                    {isLoading ? (
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
            )}
        </div>
    );
};

export default memo(ColumnNewRedux);