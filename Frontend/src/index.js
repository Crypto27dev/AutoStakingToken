import React from 'react';
import ReactDOM from 'react-dom';
import { convertAniBinaryToCSS } from "ani-cursor";
import cursor from '../src/assets/cursor.ani';
import "./assets/animated.css";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/et-line/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './assets/style.scss';
import './assets/custom.scss';
// import './assets/home.scss';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { loadWeb3 } from "./web3/web3";

//redux store
import { Provider } from 'react-redux'
import store from './store';

async function applyCursor(selector, aniUrl) {
	const response = await fetch(aniUrl);
	const data = new Uint8Array(await response.arrayBuffer());

	const style = document.createElement("style");
	style.innerText = convertAniBinaryToCSS(selector, data);
	document.head.appendChild(style);
}

applyCursor(
	"#root",
	window.location.origin + cursor
);

loadWeb3();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();