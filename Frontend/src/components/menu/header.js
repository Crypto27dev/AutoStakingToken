import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { navigate } from '@reach/router';
import { Link } from '@reach/router';
import useOnclickOutside from "react-cool-onclickoutside";
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { connectWallet, signString } from "../../web3/web3";
import { setLogin } from "../../store/actions/thunks/auth";
import * as selectors from '../../store/selectors';
import { setAuthState, setWalletAddr } from "../../store/actions";
import { isMobile, Toast, getAvatar, getCoinName } from "../../utils";

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active',
      };
    }}
  />
);

const Header = function () {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectors.userWallet);
  const userBalance = useSelector(selectors.userBalance);
  const chainID = useSelector(selectors.authChainID);

  const onConnect = async () => {
    let connection = await connectWallet();
    if (connection.success === true) {
      dispatch(setWalletAddr(connection.address));
    }
  }

  const [showmenu, btn_icon] = useState(false);

  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (!isMobile()) {
        if (window.pageYOffset > sticky) {
          header.classList.add("sticky");
          totop.classList.add("show");

        } else {
          header.classList.remove("sticky");
          totop.classList.remove("show");
        } if (window.pageYOffset > sticky) {
        }
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);
  return (
    <header id="myHeader" className='navbar white'>
      <div className='container'>
        <div className='logo px-0'>
          <div className='navbar-title navbar-item'>
            <NavLink to="/">
              <img
                src="/img/logo.png"
                className="img-fluid d-block"
                alt="#"
              />
              <img
                src="/img/logo-2.png"
                className="img-fluid d-3"
                alt="#"
              />
              <img
                src="/img/logo-3.png"
                className="img-fluid d-4"
                alt="#"
              />
              <img
                src="/img/logo-light.png"
                className="img-fluid d-none"
                alt="#"
              />
            </NavLink>
          </div>
        </div>

        <div className="d-flex gap-3">
          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu &&
                <div className='menu'>
                  <div className='navbar-item'>
                    <NavLink to="/dashboard" onClick={() => btn_icon(!showmenu)}>
                      Dashboard
                    </NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to="/mint" onClick={() => btn_icon(!showmenu)}>
                      Mint & Earning
                    </NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to="/explore" onClick={() => btn_icon(!showmenu)}>
                      Open Market
                    </NavLink>
                  </div>
                </div>
              }
            </Breakpoint>

            <Breakpoint xl>
              <div className='menu'>
                <div className='navbar-item'>
                  <NavLink to="/dashboard">
                    Dashboard
                    <span className='lines'></span>
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/mint">
                    Mint & Earning
                    <span className='lines'></span>
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/explore">
                    Open Market
                    <span className='lines'></span>
                  </NavLink>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className='mainside d-flex align-items-center'>
            {!currentUser && (
              <div className="log-in">
                <button className="btn-main" onClick={() => onConnect()}>Connect Wallet</button>
              </div>
            )}
            {currentUser && (
              <div className="logged-in">
                <div className="d-name">
                  {currentUser && (
                    <div className="text-white">{currentUser && (currentUser.slice(0, 6) + "..." + currentUser.slice(currentUser.length - 4, currentUser.length))}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>

      </div>
    </header>
  );
}
export default Header;