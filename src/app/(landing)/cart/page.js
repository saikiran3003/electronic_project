"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            const parsed = JSON.parse(storedCart);
            setCart(parsed);
            calculateTotal(parsed);
        }
    }, []);

    useEffect(() => {
        const trigger = localStorage.getItem("triggerCartPayment");
        const token = localStorage.getItem("token");
        if (trigger === "true" && token && cart.length > 0 && total > 0) {
            localStorage.removeItem("triggerCartPayment");
            handleProceedToPay();
        }
    }, [cart, total]);

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(sum);
    };

    const updateQuantity = (id, delta) => {
        const updated = cart.map((item) => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        calculateTotal(updated);
    };

    const removeItem = (id) => {
        const updated = cart.filter((item) => item._id !== id);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        calculateTotal(updated);
    };

    const handleProceedToPay = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            localStorage.setItem("triggerCartPayment", "true");
            router.push("/user/login");
            return;
        }

        setLoading(true);

        try {
            const userEmail = localStorage.getItem("userEmail");
            const userName = localStorage.getItem("userName");

            // 1. Create multi-item order on server
            const orderRes = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: total,
                    currency: "INR",
                }),
            });

            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error(orderData.error || "Order failed");

            // 2. Open Razorpay
            const options = {
                key: "rzp_test_kY71FTFw40NENF",
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Electronic Gadgets",
                description: "Cart Payment",
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        // Save order to DB
                        const saveRes = await fetch("/api/order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userName,
                                userEmail,
                                items: cart.map(item => ({
                                    productId: item._id,
                                    name: item.name,
                                    price: item.price,
                                    quantity: item.quantity
                                })),
                                totalAmount: total,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const saveData = await saveRes.json();
                        if (saveData.success) {
                            window.Swal.fire({
                                title: "Order Placed!",
                                text: "Your order has been successfully placed.",
                                icon: "success",
                            });
                            localStorage.removeItem("cart");
                            router.push("/products");
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                prefill: { name: userName, email: userEmail },
                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                window.Swal.fire({
                    title: "Payment Failed",
                    text: response.error.description,
                    icon: "error",
                });
                router.push("/products");
            });
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Payment Error ❌");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ padding: "100px 20px", textAlign: "center", background: "#f8fafc", minHeight: "100vh" }}>
                <ShoppingBag size={80} style={{ margin: "0 auto 20px", color: "#cbd5e1" }} />
                <h2 style={{ fontSize: "24px", color: "#1e293b", marginBottom: "10px" }}>Your Cart is Empty</h2>
                <p style={{ color: "#64748b", marginBottom: "30px" }}>Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => router.push("/products")}
                    style={{ backgroundColor: "#ef4444", color: "white", padding: "12px 24px", borderRadius: "8px", fontWeight: "600", border: "none", cursor: "pointer" }}
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px", cursor: "pointer" }} onClick={() => router.push("/products")}>
                    <ArrowLeft size={20} color="#64748b" />
                    <span style={{ color: "#64748b", fontWeight: "500" }}>Back to Shopping</span>
                </div>

                <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "40px" }}>Shopping Cart</h1>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "30px", alignItems: "start" }}>

                    {/* ITEMS LIST */}
                    <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                        {cart.map((item) => (
                            <div key={item._id} style={{ display: "flex", gap: "20px", borderBottom: "1px solid #f1f5f9", padding: "20px 0", lastChild: { borderBottom: "none" } }}>
                                <img
                                    src={item.image || "/assets/images/tvimage.jpg"}
                                    alt={item.name}
                                    style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "12px", background: "#f8fafc" }}
                                />

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>{item.name}</h3>
                                        <Trash2 size={18} color="#ef4444" style={{ cursor: "pointer" }} onClick={() => removeItem(item._id)} />
                                    </div>
                                    <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "15px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {item.description}
                                    </p>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px" }}>
                                            <Minus size={16} style={{ cursor: "pointer" }} onClick={() => updateQuantity(item._id, -1)} />
                                            <span style={{ fontWeight: "700", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                                            <Plus size={16} style={{ cursor: "pointer" }} onClick={() => updateQuantity(item._id, 1)} />
                                        </div>
                                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SUMMARY */}
                    <div style={{ background: "white", borderRadius: "16px", padding: "30px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", position: "sticky", top: "120px" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "25px" }}>Order Summary</h2>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#64748b" }}>
                            <span>Subtotal</span>
                            <span style={{ fontWeight: "600", color: "#334155" }}>₹{total}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", borderTop: "2px solid #f1f5f9", paddingTop: "20px" }}>
                            <span style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Total</span>
                            <span style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>₹{total}</span>
                        </div>

                        <button
                            onClick={handleProceedToPay}
                            disabled={loading}
                            style={{
                                width: "100%",
                                backgroundColor: "#4447efff",
                                color: "white",
                                padding: "16px",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "700",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "0.2s",
                                boxShadow: "0 10px 15px -3px rgba(186, 148, 148, 0.4)"
                            }}
                            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#4447efff")}
                            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#4447efff")}
                        >
                            {loading ? "Processing..." : "Proceed to Pay"}
                        </button>

                        <p style={{ textAlign: "center", fontSize: "12px", color: "#010101ff", marginTop: "20px" }}>
                            Secure payment handled via Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
