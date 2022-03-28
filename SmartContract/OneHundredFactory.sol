// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./ERC1155Tradable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "./IUniswapV2Router02.sol";

contract OnehundredFactory is Ownable,ERC1155Receiver {
    using Counters for Counters.Counter;

    struct SaleInfo {
        uint256 tokenId;
        string tokenHash;
        address creator;
        address currentOwner;
        uint256 startPrice;
        address maxBidder;
        uint256 maxBid;
        uint256 startTime;
        uint256 interval;
        uint8 kindOfCoin;
        bool _isOnSale;
    }

    struct RoyaltyInfo {
        uint256 totalAmount;
        uint256 rewardAmount;
        uint256 treasuryAmount;
        uint256 marketingAmount;
        uint256 developAmount;
        uint256 founderAmount;
        uint256 tradingAmount;
        uint256 tradingRoyaltyAmount;
        uint256 OneHundredROI;
        uint256 OneYearROI;
        uint256 TwoYearROI;
    }

    struct RoyaltyAddressInfo {
        address payable treasuryAddress;
        address payable marketingAddress;
        address payable developAddress;
        address payable founderAddress;
    }

    struct BidInfo{
        address sender;
        address seller;
        address maxBidder;
        uint256 maxBidPrice;
        string tokenHash;
        uint256 tokenId;
    }

    struct NFTCardInfo {
        string symbol;
        string imgUri;
        uint256 priceUSDC;
        uint256 priceAVAX;
        uint256 supply;
        uint256 soldCount;
        bool state;
    }

    struct NFTRewardCardInfo {
        uint256 createdTime;
        uint256 claimedTime;
    }

    struct NFTInfos {
        uint256[] tokenIDs;
        string[] uris;
        uint256[] createdTime;
        uint256[] currentROI;
        uint256[] nftRevenue;
    }
    
    enum AuctionState { 
        OPEN,
        CANCELLED,
        ENDED,
        DIRECT_BUY
    }
    
    bool _status;

    // Minting Logic
    bool _isMinting;
    NFTCardInfo[] _allURIInfos;
    address mkNFTaddress;
    ERC1155Tradable mkNFT;

    // Royalty Logic
    uint256 _royaltyIdCounter;
    address _withdrawToken;

    
    RoyaltyInfo public royaltyInfo;
    RoyaltyAddressInfo public addressInfo;
    
    IERC20 private _usdcToken;
    IUniswapV2Router02 public _joe02Router;

    uint256 pauseClaim;
    uint256 _maxTokenId;
    uint256 constant ONE_DAY_TIME                               = 86400;
    uint256 public ONE_USDC_AVAX                                = 116278 * 10 ** 11;
    
    mapping(uint256 => SaleInfo) public _allSaleInfo;
    mapping(uint256 => NFTRewardCardInfo) public _NFTRewardCardInfos;
    mapping(address => uint256[]) public _nftIDsOfUser;

    mapping(uint256 => uint) public _getCardIDFromID;
    mapping(uint256 => string) public _uriFromId;

    modifier noOnlyNFTSeller(uint256 _tokenID) {
        require(_allSaleInfo[_tokenID].currentOwner != msg.sender, "just NFT seller");
        _;
    }

    modifier onlyNFTSeller(uint256 _tokenID) {
        require(_allSaleInfo[_tokenID].currentOwner == msg.sender || owner() == msg.sender, "not NFT owner");
        _;
    }

    modifier onlyNFTOwner(uint256 _tokenID) {        
        require(mkNFT.balanceOf(msg.sender, _tokenID) > 0, "no NFT owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != true, "ReentrancyGuard: reentrant call");
        _status = true;
        _;
        _status = false;
    }

    constructor(address _nftAddress) {
        mkNFTaddress = _nftAddress;
        mkNFT = ERC1155Tradable(_nftAddress);
        _joe02Router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
        _usdcToken = IERC20(0x5d3A64599ba4306Ed3419A820E159f1Ecc11EC66);

        _status = false;
        _isMinting = false;
        _maxTokenId = 0;

        royaltyInfo.totalAmount = 1000;
        royaltyInfo.rewardAmount = 600;
        royaltyInfo.treasuryAmount = 300;
        addressInfo.treasuryAddress = payable(0xbAB8E9cA493E21d5A3f3e84877Ba514c405be0e1);
        royaltyInfo.marketingAmount = 50;
        addressInfo.marketingAddress = payable(0xbAB8E9cA493E21d5A3f3e84877Ba514c405be0e1);
        royaltyInfo.developAmount = 50;
        addressInfo.developAddress = payable(0xbAB8E9cA493E21d5A3f3e84877Ba514c405be0e1);
        royaltyInfo.founderAmount = 100;
        addressInfo.founderAddress = payable(0xbAB8E9cA493E21d5A3f3e84877Ba514c405be0e1);
        royaltyInfo.tradingAmount = 25;
        royaltyInfo.tradingRoyaltyAmount = 50;
        royaltyInfo.OneHundredROI = 100;
        royaltyInfo.OneYearROI = 69;
        royaltyInfo.TwoYearROI = 17;
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

    function setNFTCardInfo (uint _id, string memory _symbol, string memory _uri, uint256 _usdc, uint256 _avax, uint256 _sup) external onlyOwner {
        require (_allURIInfos.length > _id, "Not Exsiting Info");
        _allURIInfos[_id].symbol = _symbol;
        _allURIInfos[_id].imgUri = _uri;
        _allURIInfos[_id].priceUSDC = _usdc;
        _allURIInfos[_id].priceAVAX = _avax;
        _allURIInfos[_id].supply = _sup;

        emit SetNFTCardInfo (_id, _uri, _usdc, _avax, _sup);
    }

    function addNFTCardInfo (string memory _symbol, string memory _uri, uint256 _usdc, uint256 _avax, uint256 _sup) external onlyOwner {
        _allURIInfos.push (NFTCardInfo({symbol: _symbol, imgUri: _uri, priceUSDC: _usdc, priceAVAX: _avax, supply: _sup, soldCount: 0, state: false}));

        emit AddNFTCardInfo (msg.sender, _symbol, _uri, _usdc, _avax, _sup);
    }

    function setTokenState (uint _id, bool _state) external onlyOwner {
        require (_allURIInfos.length > _id, "Not Exsiting Info");
        _allURIInfos[_id].state = _state;

        emit SetTokenState (_id, _state);
    }

    function getNFTCardInfos () external view returns (NFTCardInfo[] memory) {
        return _allURIInfos;
    }

    function mintSingleNFT (uint _id) internal {
        _createOrMint(mkNFTaddress, msg.sender, _maxTokenId, 1, "");
        _getCardIDFromID[_maxTokenId] = _id;
        _setTokenUri(_maxTokenId, _allURIInfos[_id].imgUri);
        _NFTRewardCardInfos[_maxTokenId] = NFTRewardCardInfo({ createdTime: block.timestamp, claimedTime: block.timestamp});
        _nftIDsOfUser[msg.sender].push(_maxTokenId);
        _maxTokenId++;
        _isMinting = true;
    }

    function mintNFTs (uint _id, uint256 _count) external payable {
        require (_allURIInfos.length > _id, "Not Exsiting Info");
        require (msg.value == _allURIInfos[_id].priceUSDC * ONE_USDC_AVAX * _count, "No need AVAX");
        for (uint256 i = 0; i < _count; i ++) {
            mintSingleNFT(_id);
            emit MintSingleNFT (msg.sender, _id, _maxTokenId - 1);
        }

        addressInfo.developAddress.transfer(msg.value * royaltyInfo.developAmount / royaltyInfo.totalAmount);
        addressInfo.marketingAddress.transfer(msg.value * royaltyInfo.marketingAmount / royaltyInfo.totalAmount);
        addressInfo.treasuryAddress.transfer(msg.value * royaltyInfo.treasuryAmount / royaltyInfo.totalAmount);
        
        swapToAVAXForUSDC (msg.value * royaltyInfo.rewardAmount / royaltyInfo.totalAmount);

        emit MintNFTs(msg.sender, _id, _count);
        _isMinting = false;
    }

    function swapToAVAXForUSDC(uint256 _avax) private {
        address[] memory path = new address[](2);
        path[0] = _joe02Router.WETH();
        path[1] = address(_usdcToken);
                    
        _joe02Router.swapExactETHForTokens{value: _avax}(
            0,
            path,
            address(this),
            block.timestamp
        );
    }

    function getRewardAmountByNFT(uint256 _nftID) view private returns(uint256){
        uint256 nftCreatedTime = _NFTRewardCardInfos[_nftID].createdTime;
        uint256 nftClaimedTime = _NFTRewardCardInfos[_nftID].claimedTime;
        uint256 nftPrice = _allURIInfos[_getCardIDFromID[_nftID]].priceUSDC * 10 ** 18;

        uint256 rewardAmount = 0;
        if (block.timestamp - nftCreatedTime <= ONE_DAY_TIME * 100) {
            rewardAmount += (block.timestamp - nftClaimedTime) * nftPrice * royaltyInfo.OneHundredROI / 10000 / 86400;
        }
        else if (block.timestamp - nftCreatedTime <= ONE_DAY_TIME * 365) {
            if (nftCreatedTime + ONE_DAY_TIME * 100 >= nftClaimedTime) {
                rewardAmount += (nftCreatedTime + ONE_DAY_TIME * 100 - nftClaimedTime) * nftPrice * royaltyInfo.OneHundredROI / 10000 / 86400;
            }
            rewardAmount += (block.timestamp - (nftCreatedTime + ONE_DAY_TIME * 100)) * nftPrice * royaltyInfo.OneYearROI / 10000 / 86400;
        }
        else if (block.timestamp - nftCreatedTime <= ONE_DAY_TIME * 365 * 2) {
            if (nftCreatedTime + ONE_DAY_TIME * 100 >= nftClaimedTime) {
                rewardAmount += (nftCreatedTime + ONE_DAY_TIME * 100 - nftClaimedTime) * nftPrice * royaltyInfo.OneHundredROI / 10000 / 86400;
                rewardAmount += (ONE_DAY_TIME * 265) * nftPrice * royaltyInfo.OneYearROI / 10000 / 86400;
            }
            else if (nftCreatedTime + ONE_DAY_TIME * 365 >= nftClaimedTime) {
                rewardAmount += (nftCreatedTime + ONE_DAY_TIME * 365 - nftClaimedTime) * nftPrice * royaltyInfo.OneYearROI / 10000 / 86400;
            }
            rewardAmount += (block.timestamp - (nftCreatedTime + ONE_DAY_TIME * 365)) * nftPrice * royaltyInfo.TwoYearROI / 10000 / 86400;
        }

        return rewardAmount;
    }

    function claimByNFT(uint256 _tokenID) external onlyNFTOwner(_tokenID) {
        require(pauseClaim == 0, "Claim Paused");
        require(_maxTokenId > _tokenID, "Not existing NFT token");

        // add rewards and initialize timestamp for all enabled nodes     
        uint256 nftReward = getRewardAmountByNFT(_tokenID);
        _NFTRewardCardInfos[_tokenID].claimedTime = block.timestamp;
        
        // send PeaceToken rewards of nodeId to msg.sender
        require(nftReward > 0, "There is no rewards.");
        require(address(this).balance > nftReward, "no enough balance on peace");

        _usdcToken.transfer(msg.sender, nftReward * (royaltyInfo.totalAmount - royaltyInfo.founderAmount) / royaltyInfo.totalAmount);
        _usdcToken.transfer(addressInfo.founderAddress, nftReward * royaltyInfo.founderAmount / royaltyInfo.totalAmount);
        
        emit ClaimByNFT(msg.sender, _tokenID, nftReward * 9 / 10);
    }

    function claimAll() external {
        require(pauseClaim == 0, "Claim Paused");

        uint256 nftCount = _nftIDsOfUser[msg.sender].length;
                
        uint256 rewards = 0;
        for(uint i=0; i<nftCount; i++) {
            rewards += getRewardAmountByNFT(_nftIDsOfUser[msg.sender][i]);
            
            _NFTRewardCardInfos[_nftIDsOfUser[msg.sender][i]].claimedTime = block.timestamp;
        }

        // send PeaceToken rewards to msg.sender
        require(rewards > 0, "There is no rewards.");
        require(_usdcToken.balanceOf(address(this)) > rewards, "no enough balance on peace");
        
        _usdcToken.transfer(msg.sender, rewards * (royaltyInfo.totalAmount - royaltyInfo.founderAmount) / royaltyInfo.totalAmount);
        _usdcToken.transfer(addressInfo.founderAddress, rewards * royaltyInfo.founderAmount / royaltyInfo.totalAmount);

        emit ClaimAllNFT(msg.sender, rewards);
    }

    function getAllNFTInfos () view external returns (NFTInfos memory){
        uint256[] memory nftIDs = _nftIDsOfUser[msg.sender];
        NFTInfos memory rwInfo;
        rwInfo.tokenIDs = new uint256[](nftIDs.length);
        rwInfo.uris = new string[](nftIDs.length);
        rwInfo.createdTime = new uint256[](nftIDs.length);
        rwInfo.currentROI = new uint256[](nftIDs.length);
        rwInfo.nftRevenue = new uint256[](nftIDs.length);
                
        for(uint i=0; i<nftIDs.length; i++) {
            uint256 nftID = _nftIDsOfUser[msg.sender][i];
            rwInfo.tokenIDs[i] = nftID;
            rwInfo.uris[i] = _uriFromId[nftID];
            rwInfo.createdTime[i] = _NFTRewardCardInfos[nftID].createdTime;
            rwInfo.nftRevenue[i] = getRewardAmountByNFT(nftID);
        }

        return rwInfo;
    }

    function createSaleReal(uint256 _tokenID, uint _interval, uint _price, uint8 _kind) external onlyNFTOwner(_tokenID) returns (bool) {
        require(_interval >= 0, "Invalid auction interval.");
        require(_maxTokenId > _tokenID, "Not Existing Item ID");
        require(_price > 0, "Price is zero");
        SaleInfo memory saleInfo;
        if (!_isMinting) {
            mkNFT.safeTransferFrom(msg.sender, address(this), _tokenID, 1, "");
        }
        saleInfo = SaleInfo(_tokenID, _uriFromId[_tokenID], mkNFT.creators(_tokenID), msg.sender, _price, address(0), 0, block.timestamp, _interval, _kind, true);

        _allSaleInfo[_tokenID] = saleInfo;
        return true;
    }

    function destroySale(uint256 _tokenID) external onlyNFTSeller(_tokenID) nonReentrant returns (bool) {
        require(_maxTokenId > _tokenID, "Not Existing Item ID");
        require(getAuctionState(_tokenID) != AuctionState.CANCELLED, "Auction state is already cancelled...");

        if (_allSaleInfo[_tokenID].maxBid != 0) {
            customizedTransfer(payable(_allSaleInfo[_tokenID].maxBidder), _allSaleInfo[_tokenID].maxBid, _allSaleInfo[_tokenID].kindOfCoin);
        }

        mkNFT.safeTransferFrom(address(this), _allSaleInfo[_tokenID].currentOwner, _tokenID, 1, "");
        _allSaleInfo[_tokenID]._isOnSale = false;
        emit DestroySale(_allSaleInfo[_tokenID].currentOwner, _uriFromId[_tokenID], _tokenID);
    
        return true;
    }

    function placeBidReal(uint256 _tokenID) internal noOnlyNFTSeller(_tokenID) returns(address bidder, uint256 price, string memory tokenHash, uint256 tokenId){
        require(_maxTokenId > _tokenID, "Not Existing Item ID");

        address lastHightestBidder = _allSaleInfo[_tokenID].maxBidder;
        uint256 lastHighestBid = _allSaleInfo[_tokenID].maxBid;
        _allSaleInfo[_tokenID].maxBid = msg.value;
        _allSaleInfo[_tokenID].maxBidder = msg.sender;

        if (lastHighestBid != 0) {
            customizedTransfer(payable(lastHightestBidder), lastHighestBid, _allSaleInfo[_tokenID].kindOfCoin);
        }
        return (msg.sender, msg.value, _uriFromId[_tokenID], _tokenID);
    }

    function placeBid(uint256 _tokenID) payable external nonReentrant noOnlyNFTSeller(_tokenID) returns (bool) {
        address bidder;
        uint256 price;
        require(getAuctionState(_tokenID) == AuctionState.OPEN, "Auction state is not open.");
        require(msg.value > _allSaleInfo[_tokenID].startPrice, "less than start price");
        require(msg.value > _allSaleInfo[_tokenID].maxBid, "less than max bid price");
        
        (bidder, price, _uriFromId[_tokenID], _tokenID) = placeBidReal(_tokenID);
        emit PlaceBid(bidder, price, _uriFromId[_tokenID], _tokenID);
        return true;
    }

    function endBidReal(uint256 _tokenID) internal returns(BidInfo memory bidInfos, RoyaltyInfo memory royaltyInfos){
        require(_maxTokenId > _tokenID, "Not Existing Item ID");
        SaleInfo memory saleInfo = _allSaleInfo[_tokenID];
        uint256 rewardTrade = saleInfo.maxBid * royaltyInfo.tradingAmount * 2 / royaltyInfo.totalAmount;
        royaltyInfo.rewardAmount = saleInfo.maxBid * royaltyInfo.tradingRoyaltyAmount / royaltyInfo.totalAmount + rewardTrade * 90 / 100;
        royaltyInfo.marketingAmount = rewardTrade * 5 / 100;
        royaltyInfo.developAmount = rewardTrade * 5 / 100;
        uint256 sellerAmount = saleInfo.maxBid - royaltyInfo.rewardAmount - royaltyInfo.marketingAmount - royaltyInfo.developAmount;

        if(saleInfo.maxBidder != address(0)) {
            mkNFT.safeTransferFrom(address(this), saleInfo.maxBidder, _tokenID, 1, "");
        } else {
            mkNFT.safeTransferFrom(address(this), saleInfo.currentOwner, _tokenID, 1, "");        
        }

        if(royaltyInfo.rewardAmount > 0) {
            customizedTransfer(payable(address(this)), royaltyInfo.rewardAmount, saleInfo.kindOfCoin);
        }
        if(royaltyInfo.marketingAmount > 0) {
            customizedTransfer(payable(addressInfo.marketingAddress), royaltyInfo.marketingAmount, saleInfo.kindOfCoin);
        }
        if(royaltyInfo.developAmount > 0) {
            customizedTransfer(payable(addressInfo.developAddress), royaltyInfo.developAmount, saleInfo.kindOfCoin);
        }
        if(sellerAmount > 0) {
            customizedTransfer(payable(saleInfo.currentOwner), sellerAmount, saleInfo.kindOfCoin);
        }

        BidInfo memory bidInfo;
        bidInfo = BidInfo(msg.sender, saleInfo.currentOwner, saleInfo.maxBidder, saleInfo.maxBid, _uriFromId[_tokenID], _tokenID);

        saleInfo.currentOwner = saleInfo.maxBidder;
        saleInfo.startPrice = saleInfo.maxBid;
        saleInfo._isOnSale = false;

        _allSaleInfo[_tokenID] = saleInfo;
        return (bidInfo, royaltyInfo);
    }

    function buyNow(uint256 _tokenID) payable external nonReentrant{
        RoyaltyInfo memory royaltys;
        require(getAuctionState(_tokenID) == AuctionState.DIRECT_BUY, "Auction state is not buy now");
        require(msg.value == _allSaleInfo[_tokenID].startPrice, "not equal price");
        placeBidReal(_tokenID);
        BidInfo memory bidInfo;
        (bidInfo, royaltys) = endBidReal(_tokenID);
        emit BuyNow(bidInfo.sender, bidInfo.seller, bidInfo.maxBidder, bidInfo.maxBidPrice, bidInfo.tokenHash, bidInfo.tokenId, royaltys);
    }

    function acceptOrEndBid(uint256 _tokenID) external nonReentrant returns (bool) {
        RoyaltyInfo memory royaltys;
        BidInfo memory bidInfo;
        bool isAccept = msg.sender == _allSaleInfo[_tokenID].currentOwner;
        if(isAccept) {
            require(getAuctionState(_tokenID) == AuctionState.OPEN || getAuctionState(_tokenID) == AuctionState.ENDED, "Auction state is not open or end.");
        } else {
            require(getAuctionState(_tokenID) == AuctionState.ENDED, "Auction state is not ended.");
        }
        (bidInfo, royaltys) = endBidReal(_tokenID);
        if(isAccept) {
            emit AcceptBid(msg.sender, bidInfo, royaltys);
        } else {
            emit EndBid(msg.sender, bidInfo, royaltys);
        }
        return true;
    }

    function batchEndAuction(uint256[] memory _tokenIDs) external nonReentrant returns (bool) {
        RoyaltyInfo[] memory royaltyInfos = new RoyaltyInfo[](_tokenIDs.length);
        BidInfo[] memory bidInfos = new BidInfo[](_tokenIDs.length);
        for(uint256 i=0; i<_tokenIDs.length; i++) {
            if(getAuctionState(_tokenIDs[i]) != AuctionState.ENDED) continue;
            RoyaltyInfo memory royaltys;
            BidInfo memory bidInfo;
            (bidInfo, royaltys) = endBidReal(_tokenIDs[i]);
            royaltyInfos[i] = royaltys;
            bidInfos[i] = bidInfo;
        }
        emit BatchEndAuction(msg.sender, bidInfos, royaltyInfos);
        return true;
    }

    function getAuctionState(uint256 _tokenID) public view returns (AuctionState) {
        if (!_allSaleInfo[_tokenID]._isOnSale) return AuctionState.CANCELLED;
        if (_allSaleInfo[_tokenID].interval == 0) return AuctionState.DIRECT_BUY;
        if (block.timestamp >= _allSaleInfo[_tokenID].startTime + _allSaleInfo[_tokenID].interval) return AuctionState.ENDED;
        return AuctionState.OPEN;
    } 

    function getSaleInfo(uint256 _tokenID) public view returns (SaleInfo memory) {
        require(_maxTokenId > _tokenID, "Not Existing Item ID");

        return _allSaleInfo[_tokenID];
    }

    function getWithdrawBalance(uint8 _kind) public view returns (uint256) {
        if(_kind == 0) {
            return address(this).balance;
        }
        if(_withdrawToken == address(0)) return 0;
        IERC20 token = IERC20(_withdrawToken);
        return token.balanceOf(address(this));
    }

    function customizedTransfer(address payable _to, uint256 _amount, uint8 _kind) internal {
        require(_to != address(0), "Invalid address...");
        if(_amount > 0) {
            if (_kind == 0) {
                _to.transfer(_amount);
            } else {
                if(_withdrawToken == address(0)) return;
                IERC20 token = IERC20(_withdrawToken);
                token.transfer(_to, _amount);
            }
        }
    }

    function withDraw(uint256 _amount, uint8 _kind) external onlyOwner {
        require(_amount > 0, "Invalid withdraw amount...");
        require(_kind >= 0, "Invalid cryptocurrency...");
        require(getWithdrawBalance(_kind) > _amount, "None left to withdraw...");

        customizedTransfer(payable(msg.sender), _amount, _kind);
    }

    function withDrawAll(uint8 _kind) external onlyOwner {
        require(_kind >= 0, "Invalid cryptocurrency...");
        uint256 remaining = getWithdrawBalance(_kind);
        require(remaining > 0, "None left to withdraw...");

        customizedTransfer(payable(msg.sender), remaining, _kind);
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
        require(getAuctionState(_tokenID) == AuctionState.DIRECT_BUY || (getAuctionState(_tokenID) == AuctionState.OPEN && _allSaleInfo[_tokenID].maxBidder == address(0)), "can't change price");
        uint256 oldPrice = _allSaleInfo[_tokenID].startPrice;
        _allSaleInfo[_tokenID].startPrice = newPrice;
        emit ChangePrice(msg.sender, _uriFromId[_tokenID], oldPrice, newPrice, _allSaleInfo[_tokenID].interval);
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

    function setRoyalty(uint256 _ra, uint256 _ta, uint256 _ma, uint256 _da, uint256 _fa, uint256 _tda, uint256 _tra, uint256 _ohr, uint256 _oyr, uint256 _tyr) external onlyOwner {
        royaltyInfo.rewardAmount = _ra;
        royaltyInfo.treasuryAmount = _ta;
        royaltyInfo.marketingAmount = _ma;
        royaltyInfo.developAmount = _da;
        royaltyInfo.founderAmount = _fa;
        royaltyInfo.tradingAmount = _tda;
        royaltyInfo.tradingRoyaltyAmount = _tra;
        royaltyInfo.OneHundredROI = _ohr;
        royaltyInfo.OneYearROI = _oyr;
        royaltyInfo.TwoYearROI = _tyr;
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

    function getWithdrawToken() external view returns(address) {
        return _withdrawToken;
    }

    function setWithdrawToken(address token) external onlyOwner {
        _withdrawToken = token;
        emit SetWithdrawToken(msg.sender, token);
    }

    receive() payable external {

    }

    fallback() payable external {

    }
    
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public pure virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    event MintSingleNFT(string tokenHash, uint256 tokenId);
    event SingleMintOnSale(address seller, string tokenHash, uint256 tokenId, uint256 interval, uint256 price, uint8 kind);
    event BatchMintOnSale(address seller, string[] tokenHashs, uint256[] tokenIds, uint256 interval, uint256 price, uint8 kind);
    event DestroySale(address seller, string tokenHash, uint256 tokenId);
    event PlaceBid(address bidder, uint256 price, string tokenHash, uint256 tokenId);
    event AcceptBid(address caller, BidInfo bidInfo, RoyaltyInfo royaltyInfo);
    event EndBid(address caller, BidInfo bidInfo, RoyaltyInfo royaltyInfo);
    event BatchEndAuction(address caller, BidInfo[] bidInfos, RoyaltyInfo[] royaltyInfos);
    event BuyNow(address caller, address seller, address buyer, uint256 price, string tokenHash, uint256 tokenId, RoyaltyInfo royaltyInfo);
    event SetMintingFee(address sender, address creator, uint256 amount);
    event SetRoyalty(address sender, RoyaltyInfo info);
    event TransferNFTOwner(address sender, address to);
    event ChangePrice(address sender,string tokenHash, uint256 oldPrice, uint256 newPrice, uint256 interval);
    event TransferNFT(address sender, address receiver, string tokenHash, uint256 tokenId);
    event BurnNFT(address sender, string tokenHash, uint256 tokenId);
    event SetNFTAddress(address sender, address nftAddress);
    event SetTokenUri(uint256 tokenId, string uri);
    event SetMaxTokenId(address sender, uint256 maxTokenId);
    event SetWithdrawToken(address sender, address token);
    event SetNFTCardInfo(uint infoID, string uri, uint256 usdc, uint256 avax, uint256 sup);
    event SetTokenState(uint infoID, bool state);
    event MintSingleNFT(address buyer, uint infoID, uint256 itemID);
    event MintNFTs(address buyer, uint infoID, uint256 count);
    event ClaimByNFT(address addr, uint256 nftId, uint256 reward);
    event ClaimAllNFT(address addr, uint256 reward);
    event AddNFTCardInfo (address addr, string symbol, string uri, uint256 usdc, uint256 avax, uint256 sup);
}