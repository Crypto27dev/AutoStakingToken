import { combineReducers } from 'redux';
import authReducer from './auth';
import nftReducer from './nfts';

export const rootReducer = combineReducers({
  auth: authReducer,
  NFT: nftReducer,
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;