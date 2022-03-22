import React from 'react';
import { Link } from '@reach/router';

const footer = () => (
    <footer className="footer-light">
        <div className="footer-container">
            <div className="container">
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-xs-1">
                        <div className="widget">
                            <h5>Marketplace</h5>
                            <ul>
                                <li><Link to="">All NFTs</Link></li>
                                <li><Link to="">Art</Link></li>
                                <li><Link to="">Music</Link></li>
                                <li><Link to="">Domain Names</Link></li>
                                <li><Link to="">Virtual World</Link></li>
                                <li><Link to="">Collectibles</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-1">
                        <div className="widget">
                            <h5>Resources</h5>
                            <ul>
                                <li><Link to="">Help Center</Link></li>
                                <li><Link to="">Partners</Link></li>
                                <li><Link to="">Suggestions</Link></li>
                                <li><Link to="">Discord</Link></li>
                                <li><Link to="">Docs</Link></li>
                                <li><Link to="">Newsletter</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-1">
                        <div className="widget">
                            <h5>Community</h5>
                            <ul>
                                <li><Link to="">Community</Link></li>
                                <li><Link to="">Documentation</Link></li>
                                <li><Link to="">Brand Assets</Link></li>
                                <li><Link to="">Blog</Link></li>
                                <li><Link to="">Forum</Link></li>
                                <li><Link to="">Mailing List</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-1">
                        <div className="widget">
                            <h5>Newsletter</h5>
                            <p>Signup for our newsletter to get the latest news in your inbox.</p>
                            <form action="#" className="row form-dark" id="form_subscribe" method="post" name="form_subscribe">
                                <div className="col text-center">
                                    <input className="form-control" id="txt_subscribe" name="txt_subscribe" placeholder="enter your email" type="text" autoComplete="off"/>
                                    <Link to="" id="btn-subscribe">
                                        <i className="arrow_right bg-color-secondary"></i>
                                    </Link>
                                    <div className="clearfix"></div>
                                </div>
                            </form>
                            <div className="spacer-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="subfooter">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="de-flex">
                            <div className="de-flex-col">
                                <span onClick={() => window.open("", "_self")}>
                                    <img alt="" className="f-logo d-1" src="./img/logo.png" />
                                    <img alt="" className="f-logo d-3" src="./img/logo-2-light.png" />
                                    <img alt="" className="f-logo d-4" src="./img/logo-3.png" />
                                    <span className="text-white copy">&copy; Copyright 2022</span>
                                </span>
                            </div>
                            <div className="de-flex-col">
                                <div className="social-icons">
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-facebook fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-twitter fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-linkedin fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-pinterest fa-lg"></i></span>
                                    <span onClick={() => window.open("", "_self")}><i className="fa fa-rss fa-lg"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);
export default footer;