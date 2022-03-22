module.exports = (mongoose) => {
    const Notify = mongoose.model(
      "Notify",
      mongoose.Schema(
        {
          imgUrl: String,
          subTitle: String,
          description: String,
          date: Date,
          url: String,
          readers: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            }
          ],     //readers list
          target_ids: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            }
          ], //if [] broadcast
          Type: { type: Number, default: 0 },  //1: sales, 2: listings, 3: bids, 4: burns, 5: followings, 6:likes, 7: purchase, 8: transfer
        },
        { timestamps: true }
      )
    );
  
    return Notify;
  };
  