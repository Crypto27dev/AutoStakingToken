module.exports = (mongoose) => {
  const Item = mongoose.model(
    "Item",
    mongoose.Schema(
      {
        symbol: String,
        imgUri: String,
        priceUSDC: Number, // old Price
        priceAVAX: Number,
        creator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        chain: { type: Number, default: 0 }, // 0: AVAX, 1: MATIC, 2: BNB
        price: { type: Number, default: 0 },
        coin_type: { type: Number, default: 0}, // 0: AVAX, 1: USDC
        auctionPrice: { type: Number, default: 0 },
        auctionPeriod: { type: Number, default: 0 },
        auctionStarted: { type: Number, default: 0 },
        isSale: { type: Number, default: 0 },     //0: not, 1: Buy now, 2: On Auction 
        
        bids: [
          {
            user_id:
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
            price: Number,
            Time: String
          }
        ],

        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        ]
      },
      { timestamps: true }
    )
  );

  return Item;
};
