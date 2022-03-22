import React from 'react';
import ReactDOM from 'react-dom';
import jwt_decode from "jwt-decode";
import "./assets/animated.css";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/elegant-icons/style.css';
import '../node_modules/et-line/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './assets/style.scss';
import './assets/style_grey.scss';
import './assets/custom.scss';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { loadWeb3, connectWallet, getValidWallet, updateBalanceOfAccount } from "./web3/web3";

//redux store
import { Provider } from 'react-redux'
import store from './store';
import { setAuthState, setWalletAddr } from './store/actions';

loadWeb3();

const checkValidLogin = async () => {
	try {
		let connection = await connectWallet();
		if (connection.success) {
			await updateBalanceOfAccount();
			store.dispatch(setWalletAddr(connection.address));
		}
		if (localStorage.jwtToken !== undefined &&
			localStorage.jwtToken !== "" &&
			localStorage.jwtToken !== null) {
			const decoded = jwt_decode(localStorage.jwtToken);
			const currTime = Date.now() / 1000;
			let connection = await getValidWallet();
			if (connection.success) {
				if (decoded.app < currTime) {
					store.dispatch(setAuthState({}));
					localStorage.removeItem("jwtToken");
					alert("Session timeouted. Plese sign in again.")
				}
				else {
					store.dispatch(setAuthState(decoded._doc));
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}

checkValidLogin();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();