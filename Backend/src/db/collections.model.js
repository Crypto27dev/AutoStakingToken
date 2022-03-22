module.exports = (mongoose) => {
    const Collection = mongoose.model(
      "Collection",
      mongoose.Schema(
        {
          name: String,
          logoURL: String,
          featuredURL: String,
          bannerURL: String,
          description: String,
          category: Number,
          price: Number,
          metaData: [],
          owner: 
          {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
          },
          items: [{              
              type: mongoose.Schema.Types.ObjectId,
              ref: "Item"                          
            }
          ]
        },
        { timestamps: true }
      )
    );
  
    return Collection;
  };
  