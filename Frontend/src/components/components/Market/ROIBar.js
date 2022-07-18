import React, { useMemo, memo } from "react";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  .progress-content {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    padding: 10px;
    position: relative;
    filter: drop-shadow(0px 0px 4px #FF5F2B);
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .roi-content {
    text-align: center;
    .roi-title {
      font-size: 16px;
      @media only screen and (max-width: 1500px) and (min-width: 1200px) {
        font-size: 12px;
      }
    }
    .roi-time {
      color: white;
      font-size: 20px;
      margin: 0;
    }
  }
`;

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black
  },
}));

function CapGradientSVG() {
  const gradientTransform = `rotate(90)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"roiCap"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="#FF4336" />
          <stop offset="100%" stopColor="#FEC601" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const ROIBar = ({ date, rate, roi, token }) => {
  const days_1 = useMemo(() => {
    return Math.floor(100 / roi);
  }, [roi]);

  const days_2 = useMemo(() => {
    return 365 * 2 - days_1;
  }, [days_1])

  return (
    <>
      <GlobalStyles />
      <div className='d-flex flex-column h-100 justify-content-between align-items-center'>
        <div className='progress-content'>
          <CapGradientSVG />
          <CircularProgressbarWithChildren value={rate}
            strokeWidth="5"
            counterClockwise={false}
            styles={buildStyles({
              pathColor: `url(#roiCap)`,
              trailColor: 'rgb(255,255,255,0.05)',
              strokeLinecap: "butt"
            })}>
            <div className="flex flex-col roi-content">
              <p className="text-center fw-bold roi-time">
                {date}
              </p>
              <span className="roi-title text-center">DAYS</span>
            </div>
          </CircularProgressbarWithChildren>
        </div>
        <BootstrapTooltip title={
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between gap-3">
              <span>ROI: {roi}%</span>
              <span>{days_1} Days</span>
            </div>
            <div className="d-flex justify-content-between gap-3">
              <span>HODL: {token}</span>
              <span>{days_2} Days</span>
            </div>
          </div>
        }>
          <span className='text-white'>ROI: {roi}%</span>
        </BootstrapTooltip>
      </div>
    </>
  );
}
export default memo(ROIBar);
