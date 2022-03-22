module.exports = (mongoose) => {
    const Sales = mongoose.model(
        "Sales",
        mongoose.Schema(
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Item"
                },
                owner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }, 
                buyer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                price: Number,
            },
            { timestamps: true }
        )
    );
    return Sales;
};
