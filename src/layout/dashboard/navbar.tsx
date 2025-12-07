"use client";
import { Bell, Menu, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import UserMenu from "./use-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginNotification from "@/components/dashboard/LoginNotification";

interface NavbarProps {
  pathname: string;
  unreadCount: number;
  isLogingOut: boolean;
  handleLogout: () => Promise<void>;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function Navbar({
  unreadCount,
  isLogingOut,
  handleLogout,
  onToggleSidebar,
}: NavbarProps) {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router(
        `/dashboard/package-search?query=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
    }
  };

  return (
    <header className="h-16 my-auto border-b z-[50] bg-white flex items-center px-6 sticky top-0 ">
      <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between relative">
        {/* Sidebar toggle (left) */}
        <div className="flex items-center z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>{" "}
          {/* Search bar (centered absolutely) */}
          <form
            onSubmit={handleSearch}
            className="absolute -mt-2 left-12 w-full max-w-sm"
          >
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-4 py-2 bg-white border border-gray-200 rounded-sm focus-visible:ring focus-visible:ring-red-400 focus-visible:border-transparent transition-all placeholder:text-gray-400"
              />
              <Button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium bg-transparent  focus:outline-none  h-fit w-fit py-3.5  px-4 rounded-r-sm flex flex-row justify-center items-cente gap-1"
                disabled={!searchQuery.trim()}
              >
                <Search className=" size-6 text-zinc-400 pointer-events-none" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-6 z-10">
          {/* Login Activity Notification */}
          <LoginNotification />

          {/* General Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full bg-zinc-50 hover:bg-zinc-50 cursor-pointer border hover:border-red-500"
              >
                <Bell className="h-5 w-5 text-zinc-400" />

                {
                  <Badge className="absolute animate-pulse text-white -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                    1
                  </Badge>
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-90" align="end">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex gap-4 items-center py-">
                  <img src="/logo/webx.png" alt="WebX Nepal" className="h-16" />
                  <div className="flex flex-col">
                    <h3 className="text-red-500 text-lg font-medium">
                      Message From Team WebX
                    </h3>
                    <div className="text-gray-500 text-sm mt-2">
                      Thank you from the bottom of our hearts your support
                      means the world to us and helps us grow together!
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserMenu isLogingOut={isLogingOut} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
