"use client";

import { Link } from "react-router-dom";
import { Loader, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";

interface UserMenuProps {
  isLogingOut: boolean;
  handleLogout: () => Promise<void>;
}
export default function UserMenu({ isLogingOut, handleLogout }: UserMenuProps) {
  const { logout: clearData } = useUserStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full cursor-pointer border border-transparent hover:border-red-500"
        >
          <img
            src="/avatar/admin2.png"
            alt="user"
            className="h-full w-full rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link to="/dashboard/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-white focus:text-white bg-red-500 focus:bg-red-600 cursor-pointer"
          disabled={isLogingOut}
          onClick={() => {
            clearData();
            handleLogout();
          }}
        >
          {isLogingOut && <Loader size={14} className="mr-2 animate-spin" />}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
