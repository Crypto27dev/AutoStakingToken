import React, { memo, useEffect, useState } from 'react';
import NftCard from './NftCard';
import axios from "axios";
import api from '../../core/api';

//react functional component
const ColumnNewRedux = ({ showLoadMore = true, activeIndex = 0, authorId = null }) => {
    const limit = 12;
    const [height, setHeight] = useState(0);
    const [nfts, setNFTs] = useState([]);
    const [page, setPage] = useState(0);

    const onImgLoad = ({ target: img }) => {
        let currentHeight = height;
        if (currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    useEffect(() => {
        getCollectionList();
    }, [page])

    const onLoadMore = () => {
        setPage(prevState => prevState + 1);
    }

    const getCollectionList = async () => {
        var param = { userId: authorId, start: page, limit: limit, activeindex: activeIndex };

        const { data } = await axios.post(`${api.baseUrl + api.nfts}/get_items_of_user`, param);
        if (data.success) {
            if (page === 0) {
                setNFTs(data.data);
            } else {
                setNFTs(prevState => [...prevState, ...data.data]);
            }
        }
    }

    return (
        <div className='row'>
            {nfts && nfts.map((nft, index) => (
                <NftCard showAvatar={false} nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
            ))}
            {showLoadMore &&
                <div className='col-lg-12'>
                    <div className="spacer-single"></div>
                    <span onClick={onLoadMore} className="btn-main lead m-auto">Load More</span>
                </div>
            }
        </div>
    );
};

export default memo(ColumnNewRedux);