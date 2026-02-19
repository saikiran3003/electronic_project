import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    userEmail: String,
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
        },
    ],
    totalAmount: Number,
    razorpay_payment_id: String,
    razorpay_order_id: String,
    razorpay_signature: String,
    status: { type: String, default: "Success" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
