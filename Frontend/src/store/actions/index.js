import { 
    createAction as action, 
    createAsyncAction as asyncAction 
} from 'typesafe-actions';

export const getNftBreakdown = asyncAction(
    'nft/GET_NFT_BREAKDOWN',
    'nft/GET_NFT_BREAKDOWN_SUCCESS',
    'nft/GET_NFT_BREAKDOWN_FAIL'
)();

export const getNftShowcase = asyncAction(
    'nft/GET_NFT_SHOWCASE',
    'nft/GET_NFT_SHOWCASE_SUCCESS',
    'nft/GET_NFT_SHOWCASE_FAIL'
)();

export const getNftDetail = asyncAction(
    'nft/GET_NFT_DETAIL',
    'nft/GET_NFT_DETAIL_SUCCESS',
    'nft/GET_NFT_DETAIL_FAIL'
)();

export const getNewNftList = asyncAction(
    'nft/GET_NEW_NFT_LIST',
    'nft/GET_NEW_NFT_LIST_SUCCESS',
    'nft/GET_NEW_NFT_LIST_FAIL'
)();

export const getNftList = asyncAction(
    'nft/GET_NFT_LIST',
    'nft/GET_NFT_LIST_SUCCESS',
    'nft/GET_NFT_LIST_FAIL'
)();

export const setWeb3 = action('auth/SET_WEB3')();
export const setAuthState = action('auth/SET_AUTH_STATE')();
export const setWalletAddr = action('auth/SET_WALLET_ADDR')();
export const setChainID = action('auth/SET_CHAIN_ID')();
export const setBalance = action('auth/SET_BALANCE')();

export const showLoader = action('auth/SHOW_LOADER')();
export const hideLoader = action('auth/HIDE_LOADER')();