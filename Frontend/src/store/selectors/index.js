// auth
export const userState = (state) => state.auth.user;
export const web3State = (state) => state.auth.web3;
export const userBalance = (state) => state.auth.balance;
export const userWallet = (state) => state.auth.wallet;
export const authChainID = (state) => state.auth.chainID;
export const loadingState = (state) => state.auth.loading;

export const nftBreakdownState = (state) => state.NFT.nftBreakdown;
export const nftNewListState = (state) => state.NFT.nftNewList;
export const nftShowcaseState = (state) => state.NFT.nftShowcase;
export const nftDetailState = (state) => state.NFT.nftDetail;
export const nftListState = (state) => state.NFT.nftList;