import React from 'react';
import { Col, Container, Row } from "react-bootstrap";
import meIcon1 from "../../assets/images/me-icon-1.svg";
import meIcon2 from "../../assets/images/me-icon-2.svg";
import meIcon3 from "../../assets/images/me-icon-3.svg";

const EarningInfo = () => (
  <div className='myearnings'>
    <div className="me_top_block w-100">
      <Container fluid>
        <Row>
          <Col lg={6} xl={4}>
            <div className="d-flex align-items-center p-4 me_block mb-3 block_1">
              <div className="icon_block flex-shrink-0 d-flex align-items-center justify-content-center">
                <img className="" src={meIcon1} alt="img" />
              </div>
              <div className="w-100 ms-3">
                <div className="d-flex w-100 justify-content-between">
                  <small className="me_block_text mb-1">Total Earning in 100 Days</small>
                </div>
                <h6 className="mb-0 me_block_value">$21,511</h6>
              </div>
            </div>
          </Col>
          <Col lg={6} xl={4}>
            <div className="d-flex align-items-center p-4 me_block mb-3 block_2">
              <div className="icon_block flex-shrink-0 d-flex align-items-center justify-content-center">
                <img className="" src={meIcon2} alt="img" />
              </div>
              <div className="w-100 ms-3">
                <div className="d-flex w-100 justify-content-between">
                  <small className="me_block_text mb-1">Total NFT’s</small>
                </div>
                <h6 className="mb-0 me_block_value">511</h6>
              </div>
            </div>
          </Col>
          <Col lg={6} xl={4}>
            <div className="d-flex align-items-center p-4 me_block mb-3 block_3">
              <div className="icon_block flex-shrink-0 d-flex align-items-center justify-content-center">
                <img className="" src={meIcon3} alt="img" />
              </div>
              <div className="w-100 ms-3">
                <div className="d-flex w-100 justify-content-between">
                  <small className="me_block_text mb-1">Daily Earning</small>
                </div>
                <h6 className="mb-0 me_block_value">$1231</h6>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  </div>
);
export default EarningInfo;