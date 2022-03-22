
module.exports = (mongoose) => {
  const Follow = mongoose.model(
    "Follow",
    mongoose.Schema(
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        //follow user id
        target_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
      },
      { timestamps: true }
    )
  );

  return Follow;
}
