module.exports = (mongoose) => {
    const Bid = mongoose.model(
        "Bid",
        mongoose.Schema(
            {
                item_id: {
                   type: mongoose.Schema.Types.ObjectId,
                   ref: "Sales"
                },
                user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                price: Number, 
            },
            { timestamps: true }
        )
    );
    return Bid;
};
