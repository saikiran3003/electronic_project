import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const order = await Order.create({
            userId: body.userId,
            userName: body.userName,
            userEmail: body.userEmail,
            items: body.items,
            totalAmount: body.totalAmount,
            razorpay_payment_id: body.razorpay_payment_id,
            razorpay_order_id: body.razorpay_order_id,
            razorpay_signature: body.razorpay_signature,
            status: body.status || "Success",
        });

        return Response.json({ success: true, order });
    } catch (error) {
        console.error("Order API Error:", error);
        return Response.json({ success: false, error: error.message });
    }
}
