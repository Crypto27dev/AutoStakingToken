import React from 'react';
import { Col, Container, Row } from "react-bootstrap";
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import meIcon1 from "../../assets/images/me-icon-1.svg";
import meIcon2 from "../../assets/images/me-icon-2.svg";
import meIcon3 from "../../assets/images/me-icon-3.svg";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const EarningInfo = () => (
  <div className='myearnings'>
    <div className="me_top_block w-100">
      <div className="container">
        <div className="d-flex justify-content-center">
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
            <div className="d-flex align-items-center p-4 me_block mb-3 block_2">
              <div className="w-100 ms-3">
                <h3 className="item_no">511</h3>
                <div className="d-flex justify-content-center">
                  <div className="item_title">Total NFTs</div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
            <div className="d-flex align-items-center p-4 me_block mb-3 block_1">
              <div className="w-100 ms-3">
                <h3 className="item_no">$21,511</h3>
                <div className="d-flex justify-content-center">
                  <div className="item_title">Total Earning in 80 Days</div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
            <div className="d-flex align-items-center p-4 me_block mb-3 block_3">
              <div className="w-100 ms-3">
                <h3 className="item_no">$1231</h3>
                <div className="d-flex justify-content-center">
                  <div className="item_title">Daily Earning</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </div>
);
export default EarningInfo;