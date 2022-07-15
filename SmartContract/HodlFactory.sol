// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "./ERC1155Tradable.sol";
import "./IPancakeRouter02.sol";

contract HodlFactory is Ownable,ERC1155Receiver {
    using Counters for Counters.Counter;

    struct SaleInfo {
        uint256 tokenId;
        string tokenHash;
        uint256 createdTime;
        address creator;
        address currentOwner;
        uint256 salePrice;
    }

    struct RoyaltyInfo {                    
        uint256 totalPercent;
        uint256 rewardPercent;
        uint256 liquidityPercent;
        uint256 teamPercent;
        uint256 marketingPercent;
        uint256 tradingPercent;
    }

    struct RoyaltyAddressInfo {
        address payable marketingAddress;
        address payable teamAddress;
    }

    struct NFTCardInfo {
        string symbol;
        string imgUri;
        uint256 priceUSDT;
        uint256 nftROI;
        uint256 nftTOKEN;
        uint256 supply;
        uint256 soldCount;
        bool state;
    }

    struct NFTRewardCardInfo {
        uint256 createdTime;
        uint256 claimedTime;
    }

    struct NFTInfos {
        string[] symbols;
        uint256[] tokenIDs;
        uint256[] tokenPrices;
        string[] uris;
        uint256[] createdTime;
        bool[] canStable;
        uint256[] nftUSDT;
        uint256[] nftHODL;
    }
    
    bool _status;
    bool _pauseService;

    uint256 _maxTokenId;
    address mkNFTaddress;
    ERC1155Tradable mkNFT;
    
    RoyaltyInfo public royaltyInfo;
    RoyaltyAddressInfo public addressInfo;
    IPancakeRouter02 public _pancakeRouter;
    
    IERC20 private _usdtToken;
    IERC20 private _hodlToken;
    uint256 constant ONE_DAY_TIME                               = 86400;
    uint256 MINT_START_TIME                                     = ~uint256(0);
    
    NFTCardInfo[] _allCardInfos;
    SaleInfo[] _allSaleInfo;
    mapping(uint256 => uint256) public _allTokenIDToIndex;
    mapping(uint256 => NFTRewardCardInfo) public _NFTRewardCardInfos;
    mapping(address => uint256[]) public _nftIDsOfUser;

    mapping(uint256 => uint) public _getCIDFromID;
    mapping(uint256 => string) public _uriFromId;

    modifier onlyNFTSeller(uint256 _tokenID) {
        uint256 _tokenIndex = _allTokenIDToIndex[_tokenID];
        require(_allSaleInfo[_tokenIndex].currentOwner == msg.sender || owner() == msg.sender, "No NFT seller");
        _;
    }

    modifier onlyNFTOwner(uint256 _tokenID) {
        require(mkNFT.balanceOf(msg.sender, _tokenID) > 0, "No NFT owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != true, "ReentrancyGuard: reentrant call");
        _status = true;
        _;
        _status = false;
    }

    constructor(address _nftAddress, address _hodl) {
        mkNFTaddress = _nftAddress;
        mkNFT = ERC1155Tradable(_nftAddress);
        _usdtToken = IERC20(0x55d398326f99059fF775485246999027B3197955);
        _pancakeRouter = IPancakeRouter02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
        _hodlToken = IERC20(_hodl);

        _status = false;
        _pauseService = false;
        _maxTokenId = 0;

        royaltyInfo.totalPercent = 1000;
        royaltyInfo.rewardPercent = 600;
        royaltyInfo.liquidityPercent = 200;
        royaltyInfo.teamPercent = 100;
        addressInfo.teamAddress = payable(0x935C0b053a120Ed058004984c59705a3F2b3Fa0c);
        royaltyInfo.marketingPercent = 100;
        addressInfo.marketingAddress = payable(0x3E5B36d93e8b0CEAdF33BFD4394a0D7d5576811C);
        royaltyInfo.tradingPercent = 50;
    }

    function _createOrMint(
        address nftAddress,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes memory _data
    ) internal {
        ERC1155Tradable tradable = ERC1155Tradable(nftAddress);

        require(!tradable.exists(_id), "Already exist id");
        tradable.create(_to, _id, _amount, "", _data);

        uint256[] memory ids = new uint256[](1);
        ids[0] = _id;
        tradable.setCreator(_to, ids);
    }

    function setNFTCardInfo (uint _id, string memory _symbol, string memory _uri, uint256 _usdt, uint256 _roi, uint256 _token, uint256 _sup) external onlyOwner {
        require(_allCardInfos.length > _id, "Not Exsiting Info");
        _allCardInfos[_id].symbol = _symbol;
        _allCardInfos[_id].imgUri = _uri;
        _allCardInfos[_id].priceUSDT = _usdt;
        _allCardInfos[_id].nftROI = _roi;
        _allCardInfos[_id].nftTOKEN = _token;
        _allCardInfos[_id].supply = _sup;

        emit SetNFTCardInfo (msg.sender, _id, _uri, _usdt, _sup);
    }

    function addNFTCardInfo (string memory _symbol, string memory _uri, uint256 _usdt, uint256 _roi, uint256 _token, uint256 _sup) external onlyOwner {
        _allCardInfos.push (NFTCardInfo({symbol: _symbol, imgUri: _uri, priceUSDT: _usdt, nftROI: _roi, nftTOKEN: _token, supply: _sup, soldCount: 0, state: false}));

        emit AddNFTCardInfo (msg.sender, _symbol, _uri, _usdt, _roi, _sup);
    }

    function setCardState (uint _id, bool _state) external onlyOwner {
        require(_allCardInfos.length > _id, "Not Exsiting Info");
        _allCardInfos[_id].state = _state;

        emit SetCardState (_id, _state);
    }

    function getNFTCardInfos () external view returns (NFTCardInfo[] memory) {
        return _allCardInfos;
    }

    function mintSingleNFT (uint _cid) internal {
        _createOrMint(mkNFTaddress, msg.sender, _maxTokenId, 1, "");
        _getCIDFromID[_maxTokenId] = _cid;
        _setTokenUri(_maxTokenId, _allCardInfos[_cid].imgUri);
        _NFTRewardCardInfos[_maxTokenId] = NFTRewardCardInfo({ createdTime: block.timestamp, claimedTime: block.timestamp});
        _nftIDsOfUser[msg.sender].push(_maxTokenId);
        _maxTokenId++;
    }

    function mintNFTs (uint _id, uint256 _count) external {
        require(_pauseService == false, "Service is stopped.");
        require(_allCardInfos.length > _id, "No Exsiting Info");
        require(MINT_START_TIME < block.timestamp, "No Mint Time");
        require(_allCardInfos[_id].soldCount + _count < _allCardInfos[_id].supply, "No NFT for Mint");

        uint256 mintUSDT = _allCardInfos[_id].priceUSDT;
        if (MINT_START_TIME + 60 * 60 * 24 * 2 > block.timestamp) {
            mintUSDT = mintUSDT * 950 / 1000;           // 95%
        }
        else if (MINT_START_TIME + 60 * 60 * 24 * 4 > block.timestamp) {
            mintUSDT = mintUSDT * 975 / 1000;           // 97.5%
        }
        require(_usdtToken.balanceOf(msg.sender) >= mintUSDT, "No enough USDT amounts");
        _usdtToken.transferFrom (msg.sender, address(this), mintUSDT * royaltyInfo.rewardPercent / royaltyInfo.totalPercent);
        _usdtToken.transferFrom (msg.sender, addressInfo.teamAddress, mintUSDT * royaltyInfo.teamPercent / royaltyInfo.totalPercent);
        _usdtToken.transferFrom (msg.sender, addressInfo.marketingAddress, mintUSDT * royaltyInfo.marketingPercent / royaltyInfo.totalPercent);

        uint256 swapAmount = mintUSDT * royaltyInfo.liquidityPercent / royaltyInfo.totalPercent;
        _usdtToken.transferFrom (msg.sender, address(this), swapAmount);
        swapAndLiquidy(swapAmount);

        for (uint256 i = 0; i < _count; i ++) {
            mintSingleNFT(_id);
            emit MintSingleNFT (msg.sender, _id, _maxTokenId - 1);
        }

        _allCardInfos[_id].soldCount += _count;

        emit MintNFTs(msg.sender, _id, _count);
    }

    function swapUSDTtoHODL(uint256 _usdt) private {
        address[] memory path = new address[](2);
        path[0] = address(_usdtToken);
        path[1] = address(_hodlToken);

        _pancakeRouter.swapExactTokensForTokens(
            _usdt,
            0,
            path,
            address(this),
            block.timestamp
        );
    }
    
    function swapAndLiquidy(uint256 _usdt) private {
        uint256 half = _usdt / 2;
        uint256 otherHalf = _usdt - half;
        uint256 initialBalance = _hodlToken.balanceOf(address(this));

        swapUSDTtoHODL(half);

        uint256 newBalance = _hodlToken.balanceOf(address(this)) - initialBalance;

        addLiquidity(otherHalf, newBalance);

        emit SwapAndLiquidy(half, newBalance, otherHalf);
    }

    function addLiquidity(uint256 usdtAmount, uint256 tokenAmount) private {
        // approve token transfer to cover all possible scenarios
        _hodlToken.approve(address(_pancakeRouter), tokenAmount);

        // add the liquidity
        _pancakeRouter.addLiquidity(
            address(_usdtToken),
            address(_hodlToken),
            usdtAmount,
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            owner(),
            block.timestamp
        );
    }

    function canReceiveStable(uint256 _nftID) view private returns(bool) {
        uint256 nftCreatedTime = _NFTRewardCardInfos[_nftID].createdTime;
        uint256 nftROI = _allCardInfos[_getCIDFromID[_nftID]].nftROI;

        uint256 wholeReturnDays = 10000 / nftROI;
        if (block.timestamp - nftCreatedTime <= ONE_DAY_TIME * wholeReturnDays) {
            return true;
        }
        else {
            return false;
        }
    }

    function getRewardInfoByNFT(uint256 _nftID) view private returns(uint256, uint256){
        uint256 nftCreatedTime = _NFTRewardCardInfos[_nftID].createdTime;
        uint256 nftClaimedTime = _NFTRewardCardInfos[_nftID].claimedTime;
        uint256 nftPrice = _allCardInfos[_getCIDFromID[_nftID]].priceUSDT;
        uint256 nftROI = _allCardInfos[_getCIDFromID[_nftID]].nftROI;
        uint256 nftTOKEN = _allCardInfos[_getCIDFromID[_nftID]].nftROI;

        if (mkNFT.balanceOf(msg.sender, _nftID) <= 0) return (0, 0);

        uint256 rewardCoinAmount = 0;
        uint256 rewardTokenAmount = 0;
        uint256 wholeReturnDays = 10000 / nftROI;
        if (block.timestamp - nftCreatedTime <= ONE_DAY_TIME * wholeReturnDays) {
            rewardCoinAmount += (block.timestamp - nftClaimedTime) * nftPrice * nftROI / 10000 / ONE_DAY_TIME;
        }
        else if (block.timestamp - nftCreatedTime <= ONE_DAY_TIME * 365 * 2) {
            if (nftCreatedTime + ONE_DAY_TIME * wholeReturnDays >= nftClaimedTime) {
                rewardCoinAmount += (nftCreatedTime + ONE_DAY_TIME * wholeReturnDays - nftClaimedTime) * nftPrice * nftROI / 10000 / ONE_DAY_TIME;
            }

            rewardTokenAmount = (block.timestamp - nftCreatedTime - ONE_DAY_TIME * wholeReturnDays) * nftTOKEN / ONE_DAY_TIME;
        }

        return (rewardCoinAmount, rewardTokenAmount);
    }

    function claimByNFT(uint256 _tokenID) external onlyNFTOwner(_tokenID) {
        require(_pauseService == false, "Service is stopped.");
        require(_maxTokenId > _tokenID, "Not existing NFT token");

        // add rewards and initialize timestamp for all enabled nodes
        (uint256 nftCoinReward, uint256 nftTokenReward) = getRewardInfoByNFT(_tokenID);
        _NFTRewardCardInfos[_tokenID].claimedTime = block.timestamp;
        
        // send usdt rewards of nodeId to msg.sender
        require(nftCoinReward > 0 || nftTokenReward > 0, "There is no rewards.");
        require(_usdtToken.balanceOf(address(this)) > nftCoinReward, "no enough balance on usdt");
        require(_hodlToken.balanceOf(address(this)) > nftTokenReward, "no enough balance on hodl");

        if (nftCoinReward > 0) {
            _usdtToken.transfer(msg.sender, nftCoinReward * (royaltyInfo.totalPercent - royaltyInfo.tradingPercent) / royaltyInfo.totalPercent);
            _usdtToken.transfer(addressInfo.teamAddress, nftCoinReward * royaltyInfo.tradingPercent / royaltyInfo.totalPercent);
        }
        if (nftTokenReward > 0) {
            _hodlToken.transfer(msg.sender, nftTokenReward * (royaltyInfo.totalPercent - royaltyInfo.tradingPercent) / royaltyInfo.totalPercent);
            _hodlToken.transfer(addressInfo.teamAddress, nftTokenReward * royaltyInfo.tradingPercent / royaltyInfo.totalPercent);
        }
        
        emit ClaimByNFT(msg.sender, _tokenID, nftCoinReward * royaltyInfo.tradingPercent / royaltyInfo.totalPercent, nftTokenReward * royaltyInfo.tradingPercent / royaltyInfo.totalPercent);
    }

    function claimAll() external {
        require(_pauseService == false, "Service is stopped.");
        uint256 nftCount = _nftIDsOfUser[msg.sender].length;
                
        uint256 usdts = 0;
        uint256 hodls = 0;
        for(uint i=0; i<nftCount; i++) {
            (uint256 usdt, uint256 hodl) = getRewardInfoByNFT(_nftIDsOfUser[msg.sender][i]);
            usdts += usdt;
            hodls += hodl;
            
            _NFTRewardCardInfos[_nftIDsOfUser[msg.sender][i]].claimedTime = block.timestamp;
        }

        // send usdt rewards to msg.sender
        require(usdts > 0 || hodls > 0, "There is no rewards.");
        require(_usdtToken.balanceOf(address(this)) > usdts, "no enough usdt balance on reward pool");
        require(_hodlToken.balanceOf(address(this)) > hodls, "no enough hodl balance on reward pool");
        
        if (usdts > 0) {
            _usdtToken.transfer(msg.sender, usdts * (royaltyInfo.totalPercent - royaltyInfo.tradingPercent) / royaltyInfo.totalPercent);
            _usdtToken.transfer(addressInfo.teamAddress, usdts * royaltyInfo.tradingPercent / royaltyInfo.totalPercent);
        }
        if (hodls > 0) {
            _hodlToken.transfer(msg.sender, hodls * (royaltyInfo.totalPercent - royaltyInfo.tradingPercent) / royaltyInfo.totalPercent);
            _hodlToken.transfer(addressInfo.teamAddress, hodls * royaltyInfo.tradingPercent / royaltyInfo.totalPercent);
        }

        emit ClaimAllNFT(msg.sender, usdts * royaltyInfo.tradingPercent / royaltyInfo.totalPercent, hodls * royaltyInfo.tradingPercent / royaltyInfo.totalPercent);
    }

    function getAllNFTInfos () view external returns (NFTInfos memory){
        uint256[] memory nftIDs = _nftIDsOfUser[msg.sender];
        NFTInfos memory rwInfo;
        rwInfo.symbols = new string[](nftIDs.length);
        rwInfo.tokenIDs = new uint256[](nftIDs.length);
        rwInfo.tokenPrices = new uint256[](nftIDs.length);
        rwInfo.uris = new string[](nftIDs.length);
        rwInfo.createdTime = new uint256[](nftIDs.length);
        rwInfo.canStable = new bool[](nftIDs.length);
        rwInfo.nftUSDT = new uint256[](nftIDs.length);
        rwInfo.nftHODL = new uint256[](nftIDs.length);

        uint256 rwIndex = 0;
        for(uint i=0; i<nftIDs.length; i++) {
            uint256 nftID = _nftIDsOfUser[msg.sender][i];
            if (mkNFT.balanceOf(msg.sender, nftID) <= 0) continue;

            rwInfo.symbols[rwIndex] = _allCardInfos[_getCIDFromID[nftID]].symbol;
            rwInfo.tokenIDs[rwIndex] = nftID;
            rwInfo.tokenPrices[rwIndex] = _allCardInfos[_getCIDFromID[nftID]].priceUSDT;
            rwInfo.uris[rwIndex] = _uriFromId[nftID];
            rwInfo.createdTime[rwIndex] = _NFTRewardCardInfos[nftID].createdTime;
            (rwInfo.nftUSDT[rwIndex], rwInfo.nftHODL[rwIndex]) = getRewardInfoByNFT(nftID);
            rwInfo.canStable[rwIndex] = canReceiveStable(nftID);

            rwIndex ++;
        }

        return rwInfo;
    }

    function createSaleReal(uint256 _tokenID, uint _price) external onlyNFTOwner(_tokenID) {
        require(_pauseService == false, "Service is stopped.");
        require(_maxTokenId > _tokenID, "No Existing Item ID");
        require(_price > 0, "Price is zero");

        mkNFT.safeTransferFrom(msg.sender, address(this), _tokenID, 1, "");

        _allTokenIDToIndex[_tokenID] = _allSaleInfo.length;
        _allSaleInfo.push (SaleInfo(_tokenID, _uriFromId[_tokenID], _NFTRewardCardInfos[_tokenID].createdTime, mkNFT.creators(_tokenID), msg.sender, _price));

        emit CreateSaleReal(msg.sender, _tokenID, _price);
    }

    function closeSale(uint256 _tokenID) external onlyNFTSeller(_tokenID) nonReentrant {
        require(_pauseService == false, "Service is stopped.");
        require(_maxTokenId > _tokenID, "No Existing Item ID");

        uint256 _tokenIndex = _allTokenIDToIndex[_tokenID];
        mkNFT.safeTransferFrom(address(this), _allSaleInfo[_tokenIndex].currentOwner, _tokenID, 1, "");
        emit CloseSale(_allSaleInfo[_tokenIndex].currentOwner, _uriFromId[_tokenID], _tokenID);

        destroySale (_tokenID);
    }

    function destroySale(uint256 _tokenID) internal {
        uint256 _tokenIndex = _allTokenIDToIndex[_tokenID];
        uint256 _tokenLastIndex = _allSaleInfo.length - 1;
        uint256 _lastTokenID = _allSaleInfo[_tokenLastIndex].tokenId;

        _allTokenIDToIndex[_lastTokenID] = _tokenIndex;
        _allTokenIDToIndex[_tokenID] = 0;
        _allSaleInfo[_tokenIndex] = _allSaleInfo[_tokenLastIndex];
        _allSaleInfo.pop();
    }

    function buyNow(uint256 _tokenID) payable external nonReentrant{
        require(_pauseService == false, "Service is stopped.");
        RoyaltyInfo memory royaltys;

        uint256 _tokenIndex = _allTokenIDToIndex[_tokenID];
        customizedTransfer(payable(_allSaleInfo[_tokenIndex].currentOwner), _allSaleInfo[_tokenIndex].salePrice);
        mkNFT.safeTransferFrom(address(this), msg.sender, _tokenID, 1, "");

        emit BuyNow(msg.sender, _allSaleInfo[_tokenIndex].currentOwner, _allSaleInfo[_tokenIndex].salePrice, _allSaleInfo[_tokenIndex].tokenHash, _tokenID, royaltys);

        destroySale(_tokenID);
        bool isExist = false;
        for (uint256 i = 0; i < _nftIDsOfUser[msg.sender].length; i ++) {
            if (_nftIDsOfUser[msg.sender][i] == _tokenID) { isExist = true; break; }
        }
        if (!isExist) _nftIDsOfUser[msg.sender].push(_tokenID);
    }

    function getAllSaleInfos() public view returns (SaleInfo[] memory) {
        return _allSaleInfo;
    }

    function getSaleInfo(uint256 _tokenID) public view returns (SaleInfo memory) {
        require(_maxTokenId > _tokenID, "No Existing Item ID");

        uint256 _tokenIndex = _allTokenIDToIndex[_tokenID];
        return _allSaleInfo[_tokenIndex];
    }

    function setMintStartTime(uint256 _time) external {
        MINT_START_TIME = _time;

        emit SetMintStartTime (_time);
    }

    function customizedTransfer(address payable _to, uint256 _amount) internal {
        require(_to != address(0), "Invalid address...");
        if(_amount > 0) {
            _usdtToken.transferFrom(msg.sender, _to, _amount);
        }
    }

    function withdraw() external onlyOwner{
        uint256 balance = _usdtToken.balanceOf(address(this));
        if(balance > 0) {
            _usdtToken.transfer(msg.sender, balance);
        }

        emit Withdraw(msg.sender, balance);
    }

    function _setTokenUri(uint256 _tokenId, string memory _uri) internal {
        _uriFromId[_tokenId] = _uri;
        emit SetTokenUri(_tokenId, _uri);
    }

    function transferNFTOwner(address to) external onlyOwner {
        mkNFT.transferOwnership(to);
        emit TransferNFTOwner(msg.sender, to);
    }

    function transferNFT(address to, uint256 _tokenID) external onlyNFTOwner(_tokenID){
        mkNFT.safeTransferFrom(msg.sender, to, _tokenID, 1, "");
        emit TransferNFT(msg.sender, to, _uriFromId[_tokenID], _tokenID);
    }

    function transferNFTFrom(address from, address to, uint256 tokenId) external onlyOwner{
        mkNFT.safeTransferFrom(from, to, tokenId, 1, "");
    }

    function changePrice(uint256 _tokenID, uint256 newPrice) external onlyNFTSeller(_tokenID){
        uint256 _tokenIndex = _allTokenIDToIndex[_tokenID];
        uint256 oldPrice = _allSaleInfo[_tokenIndex].salePrice;
        _allSaleInfo[_tokenIndex].salePrice = newPrice;
        emit ChangePrice(msg.sender, _uriFromId[_tokenID], oldPrice, newPrice);
    }

    function burnNFT(uint256 _tokenID) external onlyNFTOwner(_tokenID){
        mkNFT.burnNFT(msg.sender, _tokenID, 1);
        emit BurnNFT(msg.sender, _uriFromId[_tokenID], _tokenID);
    }

    function getNFTAddress() external view returns(address nftAddress) {
        return mkNFTaddress;
    }

    function setNFTAddress(address nftAddress) external onlyOwner {
        mkNFTaddress = nftAddress;
        mkNFT = ERC1155Tradable(nftAddress);
        emit SetNFTAddress(msg.sender, nftAddress);
    }

    function getMaxTokenId() external view returns(uint256) {
        return _maxTokenId;
    }

    function setMaxTokenId(uint256 maxTokenId) external onlyOwner {
        _maxTokenId = maxTokenId;
        emit SetMaxTokenId(msg.sender, maxTokenId);
    }

    function setRoyalty(uint256 _ra, uint256 _ta, uint256 _tp, uint256 _tda) external onlyOwner {
        royaltyInfo.rewardPercent = _ra;
        royaltyInfo.liquidityPercent = _ta;
        royaltyInfo.teamPercent = _tp;
        royaltyInfo.tradingPercent = _tda;

        emit SetRoyalty (msg.sender, royaltyInfo);
    }

    function getBalanceOf(address user, uint256 _tokenID, address nftAddress) external view returns(uint256) {
        ERC1155Tradable nft;
        if(nftAddress == address(0)) {
            nft = ERC1155Tradable(mkNFTaddress);
        } else {
            nft = ERC1155Tradable(nftAddress);
        }
        return nft.balanceOf(user, _tokenID);
    }

    receive() payable external {}

    fallback() payable external {}
    
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public override pure virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public override virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    event CreateSaleReal(address seller, uint256 tokenID, uint price);
    event CloseSale(address seller, string tokenHash, uint256 tokenId);
    event BuyNow(address buyer, address seller, uint256 price, string tokenHash, uint256 tokenId, RoyaltyInfo royaltyInfo);
    event SetMintingFee(address sender, address creator, uint256 amount);
    event SetRoyalty(address sender, RoyaltyInfo info);
    event TransferNFTOwner(address sender, address to);
    event ChangePrice(address sender,string tokenHash, uint256 oldPrice, uint256 newPrice);
    event TransferNFT(address sender, address receiver, string tokenHash, uint256 tokenId);
    event BurnNFT(address sender, string tokenHash, uint256 tokenId);
    event SetNFTAddress(address sender, address nftAddress);
    event SetTokenUri(uint256 tokenId, string uri);
    event SetMaxTokenId(address sender, uint256 maxTokenId);
    event SetNFTCardInfo(address sender, uint infoID, string uri, uint256 usdt, uint256 sup);
    event SetCardState(uint infoID, bool state);
    event MintSingleNFT(address buyer, uint infoID, uint256 itemID);
    event MintNFTs(address buyer, uint infoID, uint256 count);
    event ClaimByNFT(address addr, uint256 nftId, uint256 usdt, uint256 hodl);
    event ClaimAllNFT(address addr, uint256 usdts, uint256 hodls);
    event AddNFTCardInfo (address addr, string symbol, string uri, uint256 usdt, uint256 roi, uint256 sup);
    event InsertWhitelist(address addr, uint256 newInsertedCount);
    event SetWhitelist(address addr, bool flag);
    event Withdraw(address owner, uint256 balance);
    event SwapAndLiquidy(uint256 half, uint256 hodl, uint256 otherhalf);
    event SetMintStartTime(uint256 time);
}