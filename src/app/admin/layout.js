"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token && !isLoginPage) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }

    // Requirement 3: Destroy session on window close
    const handleClose = () => {
      localStorage.removeItem("adminToken");
    };
    window.addEventListener("beforeunload", handleClose);
    return () => window.removeEventListener("beforeunload", handleClose);
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authorized) return null;

  return (
    <>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ padding: 20, flex: 1, marginTop: "60px", marginLeft: "180px" }}>
          {children}
        </main>
      </div>
    </>
  );
}
