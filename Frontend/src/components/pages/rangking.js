import React from 'react';
import Select from 'react-select'
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
  { value: 'Last 7 days', label: 'Last 7 days' },
  { value: 'Last 24 hours', label: 'Last 24 hours' },
  { value: 'Last 30 days', label: 'Last 30 days' },
  { value: 'All time', label: 'All time' }
]
const options1 = [
  { value: 'All categories', label: 'All categories' },
  { value: 'Art', label: 'Art' },
  { value: 'Music', label: 'Music' },
  { value: 'Domain Names', label: 'Domain Names' },
  { value: 'Virtual World', label: 'Virtual World' },
  { value: 'Trading Cards', label: 'Trading Cards' },
  { value: 'Collectibles', label: 'Collectibles' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Utility', label: 'Utility' }
]


const explore= () => (
<div>
<GlobalStyles/>
  <section className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
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
          <div className='col-lg-12'>

            <div className="items_filter centerEl">
                <div className='dropdownSelect one'><Select className='select1' styles={customStyles} menuContainerStyle={{'zIndex': 999}} defaultValue={options[0]} options={options} /></div>
                <div className='dropdownSelect two'><Select className='select1' styles={customStyles} defaultValue={options1[0]} options={options1} /></div>
            </div>

            <table className="table de-table table-rank">
              <thead>
                <tr>
                  <th scope="col">Collection</th>
                  <th scope="col">Volume</th>
                  <th scope="col">24h %</th>
                  <th scope="col">7d %</th>
                  <th scope="col">Floor Price</th>
                  <th scope="col">Owners</th>
                  <th scope="col">Assets</th>
                </tr>
                <tr></tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-1.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  Abstraction</th>
                  <td>15,225.87</td>
                  <td className="d-plus">+87.54%</td>
                  <td className="d-plus">+309.49%</td>
                  <td>5.9</td>
                  <td>2.8k</td>
                  <td>58.5k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-2.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  Sketchify</th>
                  <td>14,304.78</td>
                  <td className="d-plus">+35.11%</td>
                  <td className="d-plus">+239.83%</td>
                  <td>2.9</td>
                  <td>2.3k</td>
                  <td>28.4k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-3.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  Cartoonism</th>
                  <td>13,705.58</td>
                  <td className="d-min">-33.56%</td>
                  <td className="d-plus">+307.97%</td>
                  <td>4.5</td>
                  <td>2.2k</td>
                  <td>48.8k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-4.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  Papercut</th>
                  <td>12,516.75</td>
                  <td className="d-plus">+23.45%</td>
                  <td className="d-plus">+171.25%</td>
                  <td>6.3</td>
                  <td>5.3k</td>
                  <td>54.2k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-5.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  Virtuland</th>
                  <td>11,586.26</td>
                  <td className="d-plus">+80.91%</td>
                  <td className="d-plus">+241.18%</td>
                  <td>2.2</td>
                  <td>1.8k</td>
                  <td>23.9k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-6.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  CoolThings</th>
                  <td>10,645.96</td>
                  <td className="d-plus">+51.99%</td>
                  <td className="d-min">-29.82%</td>
                  <td>6.6</td>
                  <td>1.8k</td>
                  <td>23.6k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-7.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  DigiPunks</th>
                  <td>9,219.13</td>
                  <td className="d-plus">+42.24%</td>
                  <td className="d-plus">+95.45%</td>
                  <td>1.2</td>
                  <td>3.8k</td>
                  <td>58.4k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-8.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  RockToonz</th>
                  <td>8,436.15</td>
                  <td className="d-plus">+61.31%</td>
                  <td className="d-plus">+347.19%</td>
                  <td>2.4</td>
                  <td>1.4k</td>
                  <td>63.3k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-9.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  BeeFriends</th>
                  <td>7,505.16</td>
                  <td className="d-plus">+64.46%</td>
                  <td className="d-plus">+240.94%</td>
                  <td>2.3</td>
                  <td>5.2k</td>
                  <td>70.3k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-10.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  Patternlicious</th>
                  <td>6,593.91</td>
                  <td className="d-min">-33.78%</td>
                  <td className="d-plus">+82.32%</td>
                  <td>4.5</td>
                  <td>6.5k</td>
                  <td>53.3k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-11.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  FlyingFox</th>
                  <td>5,605.97</td>
                  <td className="d-plus">+48.67%</td>
                  <td className="d-plus">+101.33%</td>
                  <td>4.6</td>
                  <td>5.1k</td>
                  <td>36.2k</td>
                </tr>
                <tr>
                  <th scope="row">
                  <div className="coll_list_pp">
                    <img className="lazy" src="./img/author/author-12.jpg" alt=""/>
                    <i className="fa fa-check"></i>
                  </div>  
                  Autoglyphs</th>
                  <td>4,904.27</td>
                  <td className="d-plus">+86.15%</td>
                  <td className="d-plus">+391.49%</td>
                  <td>4.5</td>
                  <td>6.2k</td>
                  <td>21.1k</td>
                </tr>
              </tbody>
            </table>

            <div className="spacer-double"></div>

            <ul className="pagination justify-content-center">
                <li className="active"><span>1 - 20</span></li>
                <li><span>21 - 40</span></li>
                <li><span>41 - 60</span></li>
            </ul> 

          </div>
        </div>
      </section>


  <Footer />
</div>

);
export default explore;