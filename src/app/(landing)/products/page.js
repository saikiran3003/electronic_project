// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";

// export default function ProductsPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [status, setStatus] = useState("loading");
//   const [userName, setUserName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOrder, setSortOrder] = useState("");

//   const fallbackImage = "/assets/images/tvimage.jpg";

//   useEffect(() => {
//     const storedName = localStorage.getItem("userName");

//     if (storedName) {
//       setUserName(storedName);
//       setTimeout(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       }, 400);
//     }

//     let isMounted = true;

//     const loadProducts = async () => {
//       try {
//         const res = await fetch("/api/products");
//         const data = await res.json();
//         if (!res.ok) throw new Error("Failed");

//         if (isMounted) {
//           setProducts(data.products || data);
//           setStatus("ready");
//         }
//       } catch {
//         if (isMounted) setStatus("error");
//       }
//     };

//     loadProducts();
//     return () => (isMounted = false);
//   }, []);

//   const handleBuyNow = (product) => {
//     localStorage.setItem("selectedProduct", JSON.stringify(product));
//     const token = localStorage.getItem("token");

//     if (token) router.push("/checkout");
//     else router.push("/user/login");
//   };

//   const filteredProducts = useMemo(() => {
//     let filtered = products.filter((product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (sortOrder === "lowToHigh") {
//       filtered = [...filtered].sort((a, b) => a.price - b.price);
//     } else if (sortOrder === "highToLow") {
//       filtered = [...filtered].sort((a, b) => b.price - a.price);
//     }

//     return filtered;
//   }, [products, searchTerm, sortOrder]);

//   return (
//     <div
//       style={{
//         padding: "60px 30px",
//         background: "#f5f7fa",
//         minHeight: "100vh",
//       }}
//     >
//       <div
//         style={{
//           marginBottom: "40px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: "15px",
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: "28px", fontWeight: "700" }}>
//             Our Products
//           </h1>
//           {userName && (
//             <p style={{ color: "#007bff" }}>
//               Welcome, {userName}
//             </p>
//           )}
//         </div>

//         <div style={{ display: "flex", gap: "15px" }}>
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               width: "250px",
//               padding: "10px 14px",
//               borderRadius: "12px",
//               border: "2px solid #111",
//               outline: "none",
//             }}
//           />

//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             style={{
//               padding: "10px 14px",
//               borderRadius: "12px",
//               border: "2px solid #111",
//               cursor: "pointer",
//               background: "#fff",
//             }}
//           >
//             <option value="">Filters</option>
//             <option value="lowToHigh">Price: Low to High</option>
//             <option value="highToLow">Price: High to Low</option>
//           </select>
//         </div>
//       </div>

//       {status === "loading" && <p>Loading products...</p>}
//       {status === "error" && <p style={{ color: "red" }}>Error loading</p>}

//       {status === "ready" && (
//         <>
//           {filteredProducts.length === 0 ? (
//             <p style={{ color: "gray" }}>No products found</p>
//           ) : (
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, 300px)",
//                 gap: "30px",
//                 justifyContent: "center",
//               }}
//             >
//               {filteredProducts.map((product) => {
//                 const imageSrc =
//                   product.image &&
//                   (product.image.startsWith("http") ||
//                     product.image.startsWith("/"))
//                     ? product.image
//                     : fallbackImage;

//                 return (
//                   <div
//                     key={product._id}
//                     style={{
//                       width: "300px",
//                       background: "#fff",
//                       padding: "20px",
//                       borderRadius: "14px",
//                       boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
//                       transition: "0.3s",
//                     }}
//                   >
//                     {/* IMAGE CONTAINER */}
//                     <div
//                       style={{
//                         overflow: "hidden",
//                         borderRadius: "12px",
//                       }}
//                     >
//                       <img
//                         src={imageSrc}
//                         alt={product.name}
//                         style={{
//                           width: "100%",
//                           height: "190px",
//                           objectFit: "contain",
//                           transition: "transform 0.4s ease",
//                           cursor: "pointer",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.transform =
//                             "scale(1.1) translateY(-5px)")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.transform = "scale(1)")
//                         }
//                       />
//                     </div>

//                     <h2 style={{ marginTop: "16px" }}>
//                       {product.name}
//                     </h2>

//                     <p style={{ fontSize: "14px", color: "#555" }}>
//                       {product.description}
//                     </p>

//                     <div
//                       style={{
//                         marginTop: "18px",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <span style={{ fontWeight: "700" }}>
//                         ₹{product.price}
//                       </span>

//                       <button
//                         onClick={() => handleBuyNow(product)}
//                         style={{
//                           backgroundColor: "#007bff",
//                           color: "#fff",
//                           border: "none",
//                           padding: "8px 16px",
//                           borderRadius: "8px",
//                           cursor: "pointer",
//                           transition: "0.3s",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.backgroundColor = "#0056b3")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.backgroundColor = "#007bff")
//                         }
//                       >
//                         Buy Now
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const fallbackImage = "/assets/images/tvimage.jpg";

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    let isMounted = true;
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!res.ok) throw new Error("Failed");
        if (isMounted) setProducts(data.products || data);
        setStatus("ready");
      } catch {
        if (isMounted) setStatus("error");
      }
    };
    loadProducts();
    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    const trigger = localStorage.getItem("triggerPayment");
    if (trigger === "true" && status === "ready") {
      const storedProduct = localStorage.getItem("selectedProduct");
      const token = localStorage.getItem("token");
      if (storedProduct && token) {
        localStorage.removeItem("triggerPayment");
        handleRazorpay(JSON.parse(storedProduct));
      }
    }
  }, [status]);

  const handleRazorpay = async (prod) => {
    try {
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");

      // 1. Create order on server
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: prod.price,
          currency: "INR",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || "Order creation failed");

      // 2. Open Razorpay Modal
      const options = {
        key: "rzp_test_kY71FTFw40NENF",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Electronics Store",
        description: prod.name,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const token = localStorage.getItem("token");

            // Save all details to DB
            const saveResponse = await fetch("/api/payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productName: prod.name,
                productId: prod._id,
                price: prod.price,
                amount: prod.price,
                paymentMethod: "Razorpay Checkout",
                userToken: token,
                email: userEmail,
                fullName: userName,
                status: "Success",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const saveData = await saveResponse.json();
            if (saveData.success) {
              window.Swal.fire({
                title: "Payment Successful",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
              localStorage.removeItem("selectedProduct");
            } else {
              alert("Error saving record: " + saveData.error);
            }
          } catch (err) {
            console.error("Save Error:", err);
          }
        },
        prefill: { name: userName, email: userEmail },
        theme: { color: "#2563eb" },
      };

      if (!window.Razorpay) {
        alert("Razorpay is still loading. Please try again in a moment.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (res) {
        window.Swal.fire({
          title: "Payment Failed",
          text: res.error.description,
          icon: "error",
        });
      });
      rzp.open();

    } catch (error) {
      console.error("Payment Init Error:", error);
      alert("Payment Initialization Failed ❌");
    }
  };

  const handleBuyNow = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    const token = localStorage.getItem("token");
    if (token) {
      handleRazorpay(product);
    } else {
      localStorage.setItem("triggerPayment", "true");
      router.push("/user/login");
    }
  };

  // ✅ Image click: redirect to details page
  const goToProductDetails = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    router.push("/product-details");
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "lowToHigh") filtered = filtered.sort((a, b) => a.price - b.price);
    else if (sortOrder === "highToLow") filtered = filtered.sort((a, b) => b.price - a.price);

    return filtered;
  }, [products, searchTerm, sortOrder]);

  return (
    <div style={{ padding: "60px 30px", background: "#f5f7fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#070606ff" }}>Our Products</h1>
          {userName && <p style={{ color: "#007bff" }}>Welcome, {userName}</p>}
        </div>

        {/* SEARCH + FILTER */}
        <div style={{ display: "flex", gap: "15px", color: "#000000ff" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "250px", padding: "10px 14px", borderRadius: "12px", border: "2px solid #111", outline: "none", }}
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "12px", border: "2px solid #111", cursor: "pointer", background: "#fff" }}
          >
            <option value="">Filters</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS */}
      {status === "loading" && <p>Loading products...</p>}
      {status === "error" && <p style={{ color: "red" }}>Error loading</p>}

      {status === "ready" && (
        <>
          {filteredProducts.length === 0 ? (
            <p style={{ color: "black" }}>No products found</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 300px)", gap: "30px", justifyContent: "center" }}>
              {filteredProducts.map((product) => {
                const imageSrc =
                  product.image && (product.image.startsWith("http") || product.image.startsWith("/"))
                    ? product.image
                    : fallbackImage;

                return (
                  <div key={product._id} style={{ width: "300px", color: "#070606ff", background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 6px 16px rgba(0,0,0,0.08)", transition: "0.3s" }}>
                    {/* IMAGE */}
                    <div style={{ overflow: "hidden", borderRadius: "12px" }}>
                      <img
                        src={imageSrc}
                        alt={product.name}
                        onClick={() => goToProductDetails(product)} // ✅ CLICK HANDLER
                        style={{ width: "100%", height: "190px", objectFit: "contain", transition: "transform 0.4s ease", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1) translateY(-5px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>

                    <h2 style={{ marginTop: "16px", color: "#070606ff" }}>{product.name}</h2>
                    <p style={{ fontSize: "14px", color: "#070606ff" }}>{product.description}</p>

                    <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", color: "#070606ff" }}>₹{product.price}</span>

                      <button
                        onClick={() => handleBuyNow(product)}
                        style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", transition: "0.3s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
