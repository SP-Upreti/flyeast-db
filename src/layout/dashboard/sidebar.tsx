import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUnseenCount } from "@/hooks/useUnseenCount";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

interface SidebarProps {
  pathname: string;
  collapsed: boolean;
}

export default function Sidebar({ pathname, collapsed }: SidebarProps) {
  const { data: unseenCounts, isLoading } = useUnseenCount();
  const role = localStorage.getItem("role") || "admin"; // Default to admin if role is not set
  const menus = [
    {
      href: "/dashboard",
      icon: "streamline-plump:graph-bar-increase",
      label: "Dashboard",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      href: "/dashboard/category",
      icon: "circum:grid-4-1",
      label: "Packages",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      href: "/dashboard/team-members",
      icon: "mage:users",
      label: "Our Team",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      href: "/dashboard/certificate",
      icon: "qlementine-icons:award-16",
      label: "Certificate",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      href: "/dashboard/bookings",
      icon: "guidance:calendar",
      label: `Bookings`,

      extraClasses: "text-muted-foreground hover:text-foreground",
      stats: unseenCounts?.bookingCount || 0
    },
    {
      href: "/dashboard/blogs",
      icon: "mage:edit-pen",
      label: "Blogs",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    {
      href: "/dashboard/useful-info",
      icon: "formkit:info",
      label: "Useful Info",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    // {
    //   href: "/dashboard/blog-gallery",
    //   icon: "/icons/sidebar/gallery.png",
    //   label: "Blog Gallery",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    {
      href: "/dashboard/page-content",
      icon: "uit:rocket",
      label: "SEO",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    // {
    //   href: "/dashboard/homefaq",
    //   icon: "/icons/sidebar/homefaq.png",
    //   label: "Homefaq",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    // {
    //   href: "/dashboard/home-gallery",
    //   icon: "/icons/sidebar/gallery.png",
    //   label: "Home Gallery",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    // {
    //   href: "/dashboard/home-testimonial",
    //   icon: "/icons/sidebar/hometestimonials.png",
    //   label: "Home Testimonials",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    {
      href: "/dashboard/user-management",
      icon: "solar:user-plus-linear",
      label: "User Management",
      extraClasses: "text-muted-foreground hover:text-foreground",
    },
    // {
    //   href: "/dashboard/reviews",
    //   icon: "material-symbols-light:map-pin-review-outline",
    //   label: "Reviews",
    //   extraClasses: "text-muted-foreground hover:text-foreground",
    // },
    {
      href: "/dashboard/inbox",
      icon: "fluent:mail-32-regular",
      label: `Inbox`,
      extraClasses: "text-muted-foreground hover:text-foreground",
      stats: unseenCounts?.inboxCount || 0
    },
  ].filter((menu) => {
    if (role === "admin") return true;
    if (role === "editor") {
      return ![
        "/dashboard/inbox",
        "/dashboard/bookings",
        "/dashboard/user-management",
      ].includes(menu.href);
    }
    if (role === "user") {
      return ![
        "/dashboard/inbox",
        "/dashboard/bookings",
        "/dashboard/user-management",
      ].includes(menu.href);
    }
    return false;
  });

  return (
    <div
      className={cn(
        "fixed h-screen bg-white border-r  border-gray-200  transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b px-4 transition-all duration-300",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src={
                collapsed
                  ? "/logo/favicon.ico"
                  : "/logo/logo2.png"
              }
              alt="Real Himalaya logo"
              className={cn(
                " ",
                collapsed ? "w-10 h-auto" : "w-32 h-auto"
              )}
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2 h-screen flex flex-col justify-between">
          <nav className="space-y-1">
            {menus.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between  gap-3 rounded-[2px]  px-3 py-2 text-sm transition-colors duration-200 group sidebar-font",
                    isActive
                      ? "bg-[#E83759]/15 text-[#E83759] "
                      : "text-zinc-900 hover:bg-[#E83759]/15 hover:text-[#E83759]",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <div className="flex gap-1 items-center ">
                    <Icon icon={item?.icon} className="size-6 text-[#E83759]" />

                    {!collapsed && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </div>

                  {item.stats >= 0 ? (
                    <span className={`size-5  text-[10px] flex justify-center items-center border rounded-full shrink-0 ${item.stats > 0 ? "bg-red-500 text-white" : "bg-zinc-300 text-white"}`}>{item.stats}</span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="text-xs flex items-center justify-center gap-2 border-t pt-2">
            {!collapsed ? (
              <span className="text-zinc-500">Design & Developed by</span>
            ) : null}
            <a href="https://webxnep.com/" target="_blank">
              <img src="/logo/webx-logo.jpg" alt="WebX Logo" className="h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
