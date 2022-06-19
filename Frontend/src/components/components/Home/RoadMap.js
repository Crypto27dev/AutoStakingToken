import React from "react";
import { createGlobalStyle } from 'styled-components';
import Reveal from 'react-awesome-reveal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fadeInUp } from '../../../utils';

const GlobalStyles = createGlobalStyle`
  .timeline {
		width: 100%;
		height: 2px;
		transform: translateY(44px);
		background: radial-gradient(104.03% 166409988.5% at 100% 100%, rgba(207, 253, 51, 0) 0%, #CFFD33 52.68%, rgba(207, 253, 51, 0) 100%);
    @media only screen and (max-width: 768px) {
			display: none;
		}
	}
	.roadmap-time {
		position: relative;
		font-family: 'Space Grotesk';
		font-size: 20px;;
		margin-left: -10px;
    @media only screen and (max-width: 768px) {
			padding-left: 30px;
			&::before {
				content: '';
				background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L18.6603 5V15L10 20L1.33975 15V5L10 0Z' fill='white'/%3E%3Cpath d='M10 5L14.3301 7.5V12.5L10 15L5.66987 12.5V7.5L10 5Z' fill='%23101012'/%3E%3C/svg%3E");
				background-position: center;
				background-repeat: no-repeat;
				position: absolute;
				width: 30px;
				height: 100%;
				color: white;
				bottom: 0px;
				left: -3px;
			}
		}
    @media only screen and (min-width: 769px) {
			&::after {
				content: '';
				background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L18.6603 5V15L10 20L1.33975 15V5L10 0Z' fill='white'/%3E%3Cpath d='M10 5L14.3301 7.5V12.5L10 15L5.66987 12.5V7.5L10 5Z' fill='%23101012'/%3E%3C/svg%3E");
				background-position: center;
				background-repeat: no-repeat;
				position: absolute;
				width: 30px;
				height: 30px;
				color: white;
				bottom: -30px;
				left: 0;
			}
		}
	}
  .roadmap-item {
		color: white;
    &:hover {
      color: #cffd33;
      font-weight: 700;
    }
  }
	.roadmap-data {
		margin-left: 0;
		margin-top: 40px;
		font-family: 'Inter';
    font-size: 18px;
    line-height: 28px;
    cursor: pointer;
    @media only screen and (max-width: 768px) {
			margin-top: 10px;
		}
	}
	.roadmap-timeline {
		position: relative;
		padding-left: 40px;
		@media only screen and (max-width: 768px) {
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 40px;
				height: 100%;
				width: 4px;
				background: linear-gradient(rgba(207,253,51,0) 0%,#CFFD33 20%,#CFFD33 80%,rgba(207,253,51,0) 100%);
			}
		}
	}
  .btn-roadmap {
    color: white;
    background: rgba(207, 253, 51, 0.1);
    border: 1px solid #6D6E70;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
    transition: .5s;
    &:hover {
      background: #CFFD33;
      color: black;
    }
  }
`;

const RoadMap = () => {
  return (
    <div className="container">
      <GlobalStyles />
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex flex-row justify-content-between">
            <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
              <h1 className="fw-700">THE <span className='color'>ROAD MAP</span></h1>
            </Reveal>
            <div className="d-flex flex-row align-items-center">
              <span className="btn-roadmap"><ArrowBackIcon /></span>
              <span className="btn-roadmap"><ArrowForwardIcon /></span>
            </div>
          </div>
        </div>
        <div className="col-md-12 mt-5">
          <div className="roadmap-timeline">
            <div className="timeline"></div>
            <div className="row">
              <div className="col-md-3 roadmap-item">
                <span className="roadmap-time">Q2 2022</span>
                <Reveal className='onStep' keyframes={fadeInUp} delay={800} duration={600} triggerOnce>
                  <div>
                    <ul className="roadmap-data">
                      <li>Ideology Development of Concept</li>
                      <li>Preparing Complete Structure</li>
                      <li>Developing DEFI</li>
                      <li>Developing Website</li>
                      <li>Preparing NFTs</li>
                      <li>Audit Smart Contract</li>
                      <li>Promotion</li>
                    </ul>
                  </div>
                </Reveal>
              </div>
              <div className="col-md-3 roadmap-item">
                <span className="roadmap-time">Q3 2022</span>
                <Reveal className='onStep' keyframes={fadeInUp} delay={1000} duration={600} triggerOnce>
                  <div>
                    <ul className="roadmap-data">
                      <li>NFTs Launchpad</li>
                      <li>Launch DEFI</li>
                      <li>Building Casino games concept</li>
                      <li>Earn Crypto Casinos</li>
                      <li>Audit Smart Contract</li>
                      <li>Official launch of Crypto Casino</li>
                    </ul>
                  </div>
                </Reveal>
              </div>
              <div className="col-md-3 roadmap-item">
                <span className="roadmap-time">Q4 2022</span>
                <Reveal className='onStep' keyframes={fadeInUp} delay={1200} duration={600} triggerOnce>
                  <div>
                    <ul className="roadmap-data">
                      <li>Ideology Metaverse Gaming</li>
                      <li>Creating Metaverse 2nd phase of NFTs</li>
                      <li>Building Game of Metaverse</li>
                      <li>Official Launch</li>
                    </ul>
                  </div>
                </Reveal>
              </div>
              <div className="col-md-3 roadmap-item">
                <span className="roadmap-time">Q1 2023</span>
                <Reveal className='onStep' keyframes={fadeInUp} delay={1400} duration={600} triggerOnce>
                  <div>
                    <ul className="roadmap-data">
                      <li>Centralized Exchange</li>
                      <li>Trading Competition</li>
                      <li>Airdrop Competition</li>
                      <li>Burning Tokens</li>
                      <li>Organizing An event</li>
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoadMap;