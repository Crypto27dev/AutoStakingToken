import React from 'react';
import { Link } from '@reach/router';

const catgor= () => (
  <div className='row'>
    <div className="col-md-4 col-sm-6 mb-3">
        <Link className="icon-box" to="/collection/art">
            <img className="categor-icon" src="img/icons/categor_1.png" alt=""></img>
            <span>Art</span>
        </Link>
    </div>
    <div className="col-md-4 col-sm-6 mb-3">
        <Link className="icon-box" to="/collection/game">
            <img className="categor-icon" src="img/icons/categor_2.png" alt=""></img>
            <span>Game</span>
        </Link>
    </div>
    <div className="col-md-4 col-sm-6 mb-3">
        <Link className="icon-box" to="/collection/photo">
            <img className="categor-icon" src="img/icons/categor_3.png" alt=""></img>
            <span>Photo</span>
        </Link>
    </div>
    <div className="col-md-4 col-sm-6 mb-3">
        <Link className="icon-box" to="/collection/music">
            <img className="categor-icon" src="img/icons/categor_4.png" alt=""></img>
            <span>Music</span>
        </Link>
    </div>
    <div className="col-md-4 col-sm-6 mb-3">
        <Link className="icon-box" to="/collection/video">
            <img className="categor-icon" src="img/icons/categor_5.png" alt=""></img>
            <span>Video</span>
        </Link>
    </div>
    <div className="col-md-4 col-sm-6 mb-3">
        <Link className="icon-box" to="/collection/utility">
            <img className="categor-icon" src="img/icons/categor_6.png" alt=""></img>
            <span>Utility</span>
        </Link>
    </div>
  </div>
);
export default catgor;