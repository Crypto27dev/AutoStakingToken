import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select'
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../store/selectors';
import { fetchAuthorRanking } from "../../store/actions/thunks";
import api from "../../core/api";
import { numberWithCommas } from "../../utils";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);;
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

const customStyles = {
  option: (base, state) => ({
    ...base,
    color: "white",
    background: "#151B34",
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
    color: 'white',
    background: "#151B34",
    border: '1px solid #5947FF',
    borderRadius: '10px',
    boxShadow: 'none',
    zIndex: 0,
    padding: '8px',
    "&:hover": {
      borderColor: '#5947FF',
    },
  }),
  singleValue: (base, select) => ({
    ...base,
    color: 'white'
  })
};

const options = [
  { value: 10000, label: 'All time' },
  { value: 1, label: 'Last 1 day' },
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' }
]
const options1 = [
  { value: 0, label: 'All categories' },
  { value: 1, label: 'Art' },
  { value: 2, label: 'Game' },
  { value: 3, label: 'Photo' },
  { value: 4, label: 'Music' },
  { value: 5, label: 'Video' },
  { value: 6, label: 'Utility' }
]


const RankingRedux = ({ showLoadMore = true }) => {

  const dispatch = useDispatch();
  const authorsState = useSelector(selectors.authorRankingsState);
  const authors = authorsState.data ? authorsState.data.list : [];
  const [selectTime, setSelectTime] = useState(10000);
  const [selectCategory, setSelectCategory] = useState(0);

  useEffect(() => {
    dispatch(fetchAuthorRanking(selectTime, selectCategory));
  }, [selectTime, selectCategory]);

  const handleSelectCategory = (event) => {
    setSelectCategory(event.value);
  }

  const handleSelectTime = (event) => {
    setSelectTime(event.value);
  }

  const onLoadMore = () => {
  }

  return (
    <div>
      <GlobalStyles />
      <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <h1 className='text-center'>Top NFTs</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container'>
        <div className='row'>
          <div className="col-lg-4 offset-lg-2 col-md-12 dropdownSelect one mb-2">
            <Select className='select1' styles={customStyles} menuContainerStyle={{ 'zIndex': 999 }} defaultValue={options[0]} options={options} onChange={handleSelectTime} />
          </div>
          <div className="col-lg-4 col-md-12 dropdownSelect two">
            <Select className='select1' styles={customStyles} defaultValue={options1[0]} options={options1} onChange={handleSelectCategory} />
          </div>
          <div className='col-lg-12'>
            <table className="table de-table table-rank">
              <thead>
                <tr>
                  <th scope="col">Collection</th>
                  <th scope="col">Volume</th>
                  {/* <th scope="col">24h %</th>
                  <th scope="col">7d %</th> */}
                  <th scope="col">Floor Price</th>
                  <th scope="col">Owners</th>
                  <th scope="col">Assets</th>
                </tr>
                <tr></tr>
              </thead>
              <tbody>
                {
                  authors && authors.map((author, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <div className="coll_list_pp">
                          {author.collection_info &&
                            <img className="lazy" src={api.imgUrl + author.collection_info.logoURL} alt="" />
                          }
                          <i className="fa fa-check"></i>
                        </div>
                        {author.collection_info.owner}
                      </th>
                      <td>{numberWithCommas(author.totalPrice)}</td>
                      {/* <td className={author.author_sale.daily_sales < 0 ? "d-min" : "d-plus"}>{`${author.author_sale.daily_sales < 0 ? '' : '+'}${author.author_sale.daily_sales}%`}</td>
                      <td className={author.author_sale.weekly_sales < 0 ? "d-min" : "d-plus"}>{`${author.author_sale.weekly_sales < 0 ? '' : '+'}${author.author_sale.weekly_sales}%`}</td> */}
                      <td>{numberWithCommas(author.collection_info.price)}</td>
                      <td>{author.cnt / 1000}k</td>
                      <td>{author.assets / 1000}k</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className="spacer-double"></div>
            {showLoadMore &&
              <div className='col-lg-12'>
                <div className="spacer-single"></div>
                <span onClick={onLoadMore} className="btn-main lead m-auto">Load More</span>
              </div>
            }
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
};

export default memo(RankingRedux);