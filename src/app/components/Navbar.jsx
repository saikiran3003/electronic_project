
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      setIsLoggedIn(!!token || !!userName);
    };

    checkLogin();
    const interval = setInterval(() => {
      checkLogin();
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        const parsed = JSON.parse(cartData);
        setCartCount(parsed.reduce((acc, item) => acc + item.quantity, 0));
      } else {
        setCartCount(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("selectedProduct");
    setIsLoggedIn(false);
    window.Swal.fire({
      title: "Logout Successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    router.push("/user/login");
  };

  return (
    <nav className="bg-red-500 border-b border-gray-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <Zap className="text-yellow-400 fill-yellow-400" size={28} />
          <span className="text-xl font-bold tracking-tight">Electronic Gadgets</span>
        </div>

        <div className="flex gap-10 text-sm tracking-widest uppercase">

          <button onClick={() => router.push("/home")}>Home</button>
          <button onClick={() => router.push("/about")}>About</button>
          <button onClick={() => router.push("/products")}>Products</button>
          <button onClick={() => router.push("/contact")}>Contact</button>

          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-1 text-yellow-400 font-bold"
          >
            <ShoppingCart size={18} />
            Cart {isLoggedIn ? `(${cartCount})` : ""}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:opacity-70"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/user/login")}
              className="hover:opacity-70"
            >
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}


