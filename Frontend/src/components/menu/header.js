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
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const currentUser = useSelector(selectors.userState);
  const userBalance = useSelector(selectors.userBalance);
  const chainID = useSelector(selectors.authChainID);

  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
  };
  const closeMenu1 = () => {
    setOpenMenu1(false);
  };
  const closeMenu2 = () => {
    setOpenMenu2(false);
  };

  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });
  const ref2 = useOnclickOutside(() => {
    closeMenu2();
  });

  const onClickSignIn = async () => {
    try {
      let connection = await connectWallet();
      if (connection.success === true) {
        let signedString = "";
        signedString = await signString(connection.address);
        if (signedString !== "") {
          const params = {};
          params.address = connection.address;
          params.password = signedString;
          const result = await setLogin(params);
          if (result.success) {
            dispatch(setAuthState(result.data._doc));
            navigate('/');
          } else {
            Toast.fire({
              icon: 'error',
              title: result.error
            })
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onClickSignUp = async () => {
    let connection = await connectWallet();
    if (connection.success === true) {
      dispatch(setWalletAddr(connection.address));
      navigate('/register');
    }
  }

  const [showmenu, btn_icon] = useState(false);
  const [showpop, btn_icon_pop] = useState(false);
  const closePop = () => {
    btn_icon_pop(false);
  };
  const refpop = useOnclickOutside(() => {
    closePop();
  });

  const handleSignOut = () => {
    dispatch(setAuthState({}));
    localStorage.removeItem("jwtToken");
    navigate('/');
  }

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
          closeMenu1();
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

        {/* <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            className="search"
          >
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" style={{ color: "grey" }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search items, collections, and accounts"
              inputProps={{ 'aria-label': 'Search items, collections, and accounts' }}
            />
          </Paper> */}
        <div className="d-flex">
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
                      Explore
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
                    Explore
                    <span className='lines'></span>
                  </NavLink>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className='mainside'>
            {currentUser && currentUser._id === undefined && (
              <div className="log-in">
                <button className="btn-main" onClick={() => onClickSignIn()}>Sign In</button>
                <button className="btn-main" onClick={() => onClickSignUp()}>Sign Up</button>
              </div>
            )}
            {currentUser && currentUser._id !== undefined && (
              <div className="logged-in">
                <div id="de-click-menu-profile" className="de-menu-profile" onClick={() => btn_icon_pop(!showpop)} ref={refpop}>
                  <img src={getAvatar(currentUser)} alt="" />
                  {showpop &&
                    <div className="popshow">
                      <div className="d-name">
                        <h4>{(currentUser && currentUser.username) && currentUser.username}</h4>
                      </div>
                      <div className="d-balance">
                        <h4>Balance</h4>
                        {userBalance} {getCoinName(chainID)}
                      </div>
                      <div className="d-wallet">
                        <h4>My Wallet</h4>
                        <span id="wallet" className="d-wallet-address">{(currentUser && currentUser.address) && currentUser.address}</span>
                        <button id="btn_copy" title="Copy Text">Copy</button>
                      </div>
                      <div className="d-line"></div>
                      <ul className="de-submenu-profile">
                        <li onClick={() => navigate('/profile')}>
                          <span>
                            <i className="fa fa-user"></i> My profile
                          </span>
                        </li>
                        <li onClick={() => navigate('/edit_profile')}>
                          <span>
                            <i className="fa fa-pencil"></i> Edit profile
                          </span>
                        </li>
                        <li onClick={handleSignOut}>
                          <span>
                            <i className="fa fa-sign-out"></i> Sign out
                          </span>
                        </li>
                      </ul>
                    </div>
                  }
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