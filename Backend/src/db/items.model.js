module.exports = (mongoose) => {
  const Item = mongoose.model(
    "Item",
    mongoose.Schema(
      {
        name: String,
        logoURL: String,
        description: String,
        collection_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Collection"
        },
        size: Number,
        creator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        chain: { type: Number, default: 0 }, // 0: AVAX, 1: MATIC, 2: BNB
        property: String,
        royalty: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        auctionPrice: { type: Number, default: 0 },
        auctionPeriod: { type: Number, default: 0 },
        auctionStarted: { type: Number, default: 0 },
        isSale: { type: Number, default: 0 },     //0: not, 1: Buy now, 2: On Auction 
        metaData: String,

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
