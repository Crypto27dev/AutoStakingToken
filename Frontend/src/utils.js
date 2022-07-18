import moment from "moment";
import web3 from 'web3';
import Swal from 'sweetalert2';
import styled from "styled-components";
import ReactLoading from "react-loading";
import Backdrop from '@mui/material/Backdrop';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import api from "./core/api";
import { keyframes } from "@emotion/react";

export const fadeInUp = keyframes`
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

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const fadeInLeft = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateX(50px);
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
`;
export const fadeInRight = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateX(-50px);
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
`;

export const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

const Prop = styled('h3')`f5 f4-ns mb0 white`;

export const BackLoading = ({ loading, title = 'Pending...' }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loading}
  >
    <Loading>
      <ReactLoading type={'spinningBubbles'} color="#fff" />
      {title && (
        <Prop>{title}</Prop>
      )}
    </Loading>
  </Backdrop>
)

export const SingleLoading = () => (
  <Loading>
    <ReactLoading type={'spinningBubbles'} color="#fff" />
  </Loading>
)

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export const LoadingSkeleton = ({ width = 100 }) => {
  return (
    <Skeleton baseColor="#31331f" highlightColor="#474a31" width={width + '%'} />
  );
}

export function isMobile() {
  if (window) {
    return window.matchMedia(`(max-width: 767px)`).matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia(`(max-width: 1199px)`).matches;
  }
  return false;
}

function currentYPosition() {
  if (!window) {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  var elm = document.getElementById(elmID);
  if (!elmID || !elm) {
    return;
  }
  var startY = currentYPosition();
  var stopY = elmYPosition(elm);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  let difference =
    moment(new Date(), "DD/MM/YYYY HH:mm:ss").diff(
      moment(date, "DD/MM/YYYY HH:mm:ss")
    ) / 1000;

  if (difference < 60) return `${Math.floor(difference)} seconds`;
  else if (difference < 3600) return `${Math.floor(difference / 60)} minutes`;
  else if (difference < 86400) return `${Math.floor(difference / 3660)} hours`;
  else if (difference < 86400 * 30)
    return `${Math.floor(difference / 86400)} days`;
  else if (difference < 86400 * 30 * 12)
    return `${Math.floor(difference / 86400 / 30)} months`;
  else return `${(difference / 86400 / 30 / 12).toFixed(1)} years`;
}

export function getUTCNow() {
  return Date.now();
}

export function getUTCTimestamp(_date) {
  var date = new Date(_date);
  var date_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
  return date_utc.getTime();
}

export function getUTCDate(timestamp) {
  const num_time = parseInt(timestamp) * 1000;
  const date = new Date(num_time);
  return moment.utc(date);
}

export function getDeadlineTimestamp(start_time, duration) {
  const utc_date = new Date(parseInt(start_time));
  const start_utc = Date.UTC(utc_date.getUTCFullYear(), utc_date.getUTCMonth(), utc_date.getUTCDate(), utc_date.getUTCHours(), utc_date.getUTCMinutes(), utc_date.getUTCSeconds());
  if (duration > 3650)
    duration = 3650;
  return start_utc + duration * 24 * 3600 * 1000;
}

export function getTime(date) {
  return (date * 24 * 3600 * 1000).toString();
}

export function validationStartTime(start_time) {
  const start_date = new Date(parseInt(start_time));
  const now_date = new Date();
  let difference =
    moment(start_date, "DD/MM/YYYY HH:mm:ss").diff(
      moment(now_date, "DD/MM/YYYY HH:mm:ss")
    ) / 1000;

  if (difference > -86400)
    return true;
  else
    return false;
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  var params = {};
  var search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf("?") + 1)
  );
  var definitions = search.split("&");
  definitions.forEach(function (val, key) {
    var parts = val.split("=", 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(" ");
}

export function fromWei(value) {
  const data = web3.utils.fromWei(value.toString());
  return Number(data);
}

export function toWei(value) {
  const data = web3.utils.toWei(value);
  return data;
}

export const numberWithCommas = (x, digits = 3) => {
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast'
  },
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
})

export const getCoinName = (chainId) => {
  if (chainId === 0 || chainId === 97) // BSC testnet
    return 'AVAX';
  else if (chainId === 1)
    return 'MATIC';
  else
    return 'BNB';
}

export const getAvatar = (author) => {
  return !isEmpty(author.avatar) ? (api.imgUrl + author.avatar) : api.rootUrl + "/img/icons/avatar.png";
}