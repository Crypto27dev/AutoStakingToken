import React, { memo } from 'react';
import api from '../../core/api';

//react functional component
const UserTopSeller = ({ user, no }) => {
    return (
        <>
            <span className="text-white">{no}.</span>
            <div className="author_list_pp">
                <span onClick={() => window.open("", "_self")}>
                    <img className="lazy" src={api.baseUrl + user.avatar.url} alt="" />
                </span>
            </div>
            <div className="author_list_info">
                <span className="text-white" onClick={() => window.open("", "_self")}>{user.username}</span>
                <span className="bot">{user.author_sale.sales} ETH</span>
            </div>
        </>
    );
};

export default memo(UserTopSeller);