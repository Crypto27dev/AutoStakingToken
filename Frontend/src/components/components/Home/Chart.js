import React from 'react';
import Reveal from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import { fadeInUp } from '../../../utils';
import config from '../../../config';

const GlobalStyles = createGlobalStyle`
  .chart_frame {
    width: 60%;
    height: 400px;
    @media only screen and (max-width: 991px) { 
      width: 100%;
    }
  }
`;
const ChartURL =
  `https://teams.bogged.finance/embeds/chart?address=${config.HODLAddress}&chain=bsc&charttype=line&theme=bg:23251AFF|bg2:CFFD3320|primary:CFFD33FF|secondary:1BC870FF|text:F3F6FBFF|text2:000000FF|candlesUp:1BC870FF|candlesDown:ff4976ff|chartLine:feb74cFF&defaultinterval=15m&showchartbutton=true`;

const Chart = () => (
  <>
    <GlobalStyles />
    <div className="container text-center">
      <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={300} triggerOnce>
        <iframe
          title="Chart"
          src={ChartURL}
          frameBorder="0"
          className="chart_frame"
        ></iframe>
      </Reveal>
    </div>
  </>
);
export default Chart;