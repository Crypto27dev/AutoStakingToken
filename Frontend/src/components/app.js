import React, { useEffect } from 'react';
import { Router, Location, Redirect } from '@reach/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useSelector } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import ScrollToTopBtn from './menu/ScrollToTop';
import Dashboard from './pages/home';
import MintEarning from './pages/mintEarning';
import Explore from './pages/explore';
import Lottery from './pages/lottery';
import Admin from './pages/admin';
// import { numberWithCommas } from '../utils';
// import { getBNBPrice } from '../web3/web3';
// import * as selectors from '../store/selectors';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  useEffect(() => window.scrollTo(0, 0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const App = () => {
  // const [bnbPrice, setBNBPrice] = useState(0);
  // const web3 = useSelector(selectors.web3State);

  // const getBNBValue = useCallback(async () => {
  //   if (!web3) return;
  //   const price = await getBNBPrice(1);
  //   setBNBPrice(1 / Number(price));
  // }, [web3]);

  // useEffect(() => {
  //   getBNBValue();
  //   const timerId = setInterval(() => getBNBValue(), 1000 * 60);
  //   return () => {
  //     clearInterval(timerId);
  //   }
  // }, [getBNBValue]);

  return (
    <div className="wraper" style={{ background: 'url(./img/background/page-bg.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
      <nav className='vertical-scroll'>
        <ul>
          <li>
            <a href="https://t.me/holdOFDL" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-telegram"></i>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/HODLDefiFinance" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://discord.gg/hodldefi" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-discord"></i>
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/channel/UCRQbHptK6N3iE63YV_MxRmg" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-youtube fs-24"></i>
            </a>
          </li>
          <li>
            <a href="https://www.reddit.com/user/HODLDefiFinance/" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-reddit fs-24"></i>
            </a>
          </li>
          <li>
            <a href="https://hodldefinance.gitbook.io/whitepaper/" className='' target="_blank" rel="noreferrer">
              <i className="fa-regular fa-book-open-cover fs-20"></i>
            </a>
          </li>
          {/* <li>
            <div className="coin-menu">
              <img src="./img/icons/bnb_icon.png" width={25} alt=""></img>
              <div className="coin-detail">
                <span className='text-center'>BNB Price</span>
                <div className="single-line"></div>
                <div className='de-flex align-items-center'>
                  <img src="/img/icons/usdt.png" alt=""></img>
                  <span className="">${numberWithCommas(bnbPrice)}</span>
                </div>
              </div>
            </div>
          </li> */}
        </ul>
      </nav>
      <GlobalStyles />
      <PosedRouter>
        <ScrollTop path="/">
          <Dashboard path="/" >
            <Redirect to="/" />
          </Dashboard>
          <MintEarning path="/mint" />
          <Explore path="/explore" />
          <Admin path="/admin" />
          {/* <Lottery path="/lottery" /> */}
        </ScrollTop>
      </PosedRouter>
      <ScrollToTopBtn />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  )
};
export default App;