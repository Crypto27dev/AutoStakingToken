
module.exports = (mongoose) => {
  const User = mongoose.model(
    "User",
    mongoose.Schema(
      {
        address: String,
        username: String,
        avatar: String,
        banner: String,
        email: String,
        userBio: String,
        websiteURL: String,
        banner: String,
        verified: Boolean,
        customURL: String,
        twitter: String,
        socials: String,
        password: String,
        follows: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        ]
      },
      { timestamps: true }
    )
  );

  return User;
}
