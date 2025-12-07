import { CardFooter } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import { MapPin, TimerIcon, Shield, User, Calendar, Clock } from "lucide-react";
import moment from "moment";
import UpdateProfileCredentialSheet from "./(components)/UpdateProfileCredentialSheet";

export default function ProfileStatsCard() {
  const { user } = useUserStore.getState().getInfo();

  if (!user) return null;

  // Do not include `/public` in path; public assets are served from root
  const image = "/avatar/avatar2.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="relative bg-white/80 backdrop-blur-sm  shadow-2xl w-full max-w-lg   border border-white/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-purple-500/5 to-red-500/5" />

        {/* Header Section */}
        <div className="relative pt-20 pb-8 px-6 bg-gradient-to-br from-red-600 to-red-400 text-white rounded-t-2xl">
          {/* Avatar */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <img
                src={image}
                alt="User Avatar"
                className="size-32 rounded-full  shadow-xl object-cover ring-4 ring-red-100"
              />
              {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full  flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div> */}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-white capitalize drop-shadow-sm">
              {user.email?.split("@")[0] || "Anonymous User"}
            </h2>
            <p className="text-red-100 text-sm mt-1 break-words">
              {user.email || "No email provided"}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-6  space-y-6">
          {/* Last Updated Info */}
          <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 rounded-sm p-3">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Last updated</span>
            <time className="text-sm text-gray-500" dateTime={user.updatedAt}>
              {moment(user.updatedAt).fromNow()}
            </time>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Verification Status */}
            <div
              className={`
              flex items-center justify-between p-4 rounded-sm  transition-all duration-300 hover:shadow-md
              ${user.isVerified
                  ? "bg-gray-200 border-gray-200 hover:bg-gray-100"
                  : "bg-amber-50 border-amber-200 hover:bg-amber-100"
                }
            `}
            >
              <div className="flex text-black items-center gap-3">
                <div
                  className={`
                  p-2 rounded-full
                  ${user.isVerified ? "bg-gray-300" : "bg-gray-100"}
                `}
                >
                  <Shield
                    className={`w-4 h-4 ${user.isVerified ? "text-gray-800" : "text-gray-800"
                      }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Account Status
                  </p>
                  <p
                    className={`text-xs ${user.isVerified ? "text-gray-900" : "text-gray-800"
                      }`}
                  >
                    {user.isVerified
                      ? "Verified Account"
                      : "Pending Verification"}
                  </p>
                </div>
              </div>
              <div
                className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${user.isVerified
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-100 text-amber-700"
                  }
              `}
              >
                {user.isVerified ? "✓ Verified" : "⏳ Pending"}
              </div>
            </div>

            {/* Role Status */}
            <div className="flex items-center justify-between p-4 rounded-sm  bg-gray-200 border-red-200 hover:bg-red-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-300">
                  <User className="w-4 h-4 " />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    User Role
                  </p>
                  <p className="text-xs ">Access Level</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white capitalize">
                {user.role || "Standard User"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between items-center  gap-3">
          <div className="flex items-center gap-2  text-gray-500">
            <Calendar className="w-3 h-3" />
            <p className="text-xs">
              Joined {moment(user.updatedAt).format("MMM YYYY")}
            </p>
          </div>
          <UpdateProfileCredentialSheet />
        </CardFooter>
      </div>
    </div>
  );
}
