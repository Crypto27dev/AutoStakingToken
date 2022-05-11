import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { Link } from '@reach/router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { connectWallet, disconnect } from "../../web3/web3";
import * as selectors from '../../store/selectors';
import config from '../../config';
import { isMobile } from "../../utils";

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
  const userWalletState = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  const pending = useSelector(selectors.loadingState);
  const chainId = useSelector(selectors.authChainID);

  const onConnect = async () => {
    await connectWallet();
  }

  const onDisconnect = async () => {
    await disconnect();
  }

  useEffect(() => {
    if (web3 !== null && chainId !== '' && web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId)) {
      toast.error('Please change the network to Avalanche.');
    }
  }, [web3, chainId]);

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
                width="60"
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
                      Home
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
                    Home
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
            {web3 !== null && chainId !== '' && web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId) ? (
              <div className='connect-wal'>
                <button className="btn-main text-error" onClick={onConnect}>Switch Network</button>
              </div>
            ) : (chainId === '' || userWalletState === '' || userWalletState === 0 ? (
              <div className='connect-wal'>
                <button className='btn-main' onClick={onConnect}>Connect</button>
              </div>
            ) : (
              <>
                {
                  pending ? (
                    <div className='connect-wal'>
                      <div className="flex gap-1 align-items-center" >
                        <ReactLoading type={'spin'} width="25px" height="25px" color="#fff" />
                        <span className="text-gray">Pending...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex flex-column">
                        <div className="connect-wal flex-column">
                          <div className="flex">
                            <span className="text-white">{userWalletState && (userWalletState.slice(0, 4) + "..." + userWalletState.slice(38))}</span>
                          </div>
                          <button className="btn-disconnect fs-12" onClick={onDisconnect}>Disconnect</button>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            ))}
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