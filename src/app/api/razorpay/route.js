import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { amount, currency } = await req.json();

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: currency || "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await instance.orders.create(options);

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
