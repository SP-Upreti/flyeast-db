"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import LoadingScreen from "./dashboard/loading";
import Sidebar from "./dashboard/sidebar";
import Navbar from "./dashboard/navbar";

export default function Layout() {
  const location = useLocation();
  const pathname = location.pathname;
  const router = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLogingOut, setIsLogingOut] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [access, setAccess] = useState(false);

  const token = Cookies.get("accessToken");
  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLogingOut(true);
    localStorage.removeItem("accessToken");
    // Cookies.remove("accessToken");
    // Cookies.remove("refreshToken");
    toast.success("You have been signed out successfully.");
    setIsLogingOut(false);
    router("/");
  };

  useEffect(() => {
    const token =
      Cookies.get("accessToken") || localStorage.getItem("accessToken");
    if (token) {
      setAccess(true);
    } else {
      router("/");
    }
  }, [router]);

  useEffect(() => {
    console.log(sidebarCollapsed);
  }, [sidebarCollapsed])


  if (!access) {
    return <LoadingScreen />;
  }


  return (
    <div className="min-h-screen w-[100%] flex ">
      <Sidebar collapsed={sidebarCollapsed} pathname={pathname} />

      <div
        className={cn(
          "flex-1 w-fit  flex-col gap-0 transition-all duration-300  ease-in-out",
        )}
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "15rem",
        }}
      >
        <Navbar
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          unreadCount={unreadCount}
          isLogingOut={isLogingOut}
          handleLogout={handleLogout}
          pathname={pathname}
        />
        <main className={` p-6  overflow-auto  ${sidebarCollapsed ? "" : "max-w-7xl"}`}>
          <Outlet key={sidebarCollapsed ? 'collapsed' : 'expanded'} />
        </main>
      </div>
    </div>
  );
}
