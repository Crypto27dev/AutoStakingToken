import { getType } from 'typesafe-actions';
import * as actions from '../actions';

export const defaultState = {
  user: {},
  wallet: '',
  balance: 0,
  chainID: '',
  loading: false
};

const states = (state = defaultState, action) => {
  const payload = action.payload;
  switch (action.type) {
    case getType(actions.setAuthState) :
      return { ...state, user: payload};
    case getType(actions.setWalletAddr):
      return { ...state, wallet: payload};
    case getType(actions.setChainID):
      return { ...state, chainID: payload};
    case getType(actions.setBalance):
      return { ...state, balance: payload};
    case getType(actions.showLoader) :
      return { ...state, loading: true};
    case getType(actions.hideLoader) :
        return { ...state, loading: false};
      default:
      return state;
  }
};

export default states;
