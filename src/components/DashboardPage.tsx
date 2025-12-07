import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { api } from "@/services/api";
import WorldMap from "./WorldMap";
import { Component } from "@/components/ui/particles";
import { useSocket } from "@/hooks/useSocket";


export default function DashboardPage() {
  const { statistics, activeUsers } = useSocket();
  const [startDate, setStartDate] = React.useState<any>(null);
  const [endDate, setEndDate] = React.useState<any>(null);
  const [date, setDate] = useState<any>({
    startDate: "",
    endDate: "",
  });

  const [data, setData] = useState<any>({
    bookings: 0,
    packages: 0,
    customizedBookings: 0,
    team: 0,
    inbox: 0,
    overview: {
      totalBookings: 0,
      totalPackages: 0,
      totalCategories: 0,
      totalSubCategories: 0,
      totalUsers: 0,
      totalRevenue: 0,
    },
    loginStats: {
      total: 0,
      success: 0,
      failed: 0,
      last30Days: [],
      recent: [],
    },
    recentBookings: [],
    popularPackages: [],
    bookingsByDay: [],
  });

  const [selected, setSelected] = useState<string>("this-year");

  // Fetch data on component mount
  useEffect(() => {
    const getData = async () => {
      try {
        date;
        const response = await api.get("/all-stats");
        setData(response?.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [date]);

  const cards = [
    {
      title: "Bookings",
      icon: "/icons/bookings.webp",
      percentage: "11.01%",
      isPositive: true,
      className:
        "bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500",
      description:
        data?.bookings || data?.overview?.totalBookings || "No data available",
    },
    {
      title: "Packages",
      icon: "/icons/activities.png",
      percentage: "11.01%",
      isPositive: true,
      className:
        "bg-gradient-to-r from-red-300 via-red-400 to-red-500",
      description:
        data?.packages || data?.overview?.totalPackages || "No data available",
    },
    {
      title: "Customized Bookings",
      icon: "/icons/custom-trip.png",
      percentage: "11.01%",
      isPositive: true,
      className:
        "bg-gradient-to-r from-red-300 via-red-400 to-red-500",
      description: data?.customizedBookings || "No data available",
    },
    {
      title: "Our Team",
      icon: "/icons/teams.png",
      percentage: "11.01%",
      isPositive: true,
      className: "bg-gradient-to-r from-red-300 via-red-400 to-red-500",
      description: data?.overview?.totalTeam || "No data available",
    },
    {
      title: "Inbox",
      icon: "/icons/inquiries.png",
      percentage: "11.01%",
      isPositive: true,
      className: "bg-gradient-to-r from-pink-300 via-pink-400 to-red-500",
      description: data?.overview?.totalContact || "No data available",
    },
    {
      title: "Total Users",
      icon: "/icons/inquiries.png",
      percentage: "11.01%",
      isPositive: true,
      className: "bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500",
      description: data?.overview?.totalUsers || "No data available",
    },
  ];

  return (
    <div className="   space-y-4 ">
      <h2 className="flex gap-4 items-center  text-2xl font-semibold">
        <span className="font-bold pr-6 relative uppercase w-fit bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
          Active Users
          <span className="absolute top-0 -translate-y-1 right-0 z-10 size-6  bg-green-500 animate-pulse text-white rounded-full flex justify-center items-center text-xs">{statistics.totalUsers}</span>
        </span>{" "}
      </h2>
      <div className="bg-black overflow-hidden   border-green-500 border-3 relative h-96 rounded-sm">
        <div className="absolute inset-0 h-full w-full z-5 bg-[linear-gradient(to_right,#0c270c_1px,transparent_1px),linear-gradient(to_bottom,#0c270c_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <Component
          particleColors={["#7CFC00", "#7CFC00"]}
          particleCount={statistics.totalUsers || 0}
          particleSpread={8}
          speed={2}
          particleBaseSize={200}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={true}
        />
      </div>
      <div className="flex flex-row justify-between text-2xl font-bold items-center">
        <h2 className="font-bold uppercase w-fit bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
          Overview
        </h2>
        {selected == "custom" && (
          <div className="flex flex-row gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            -
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

      </div>
      <div className=" grid gap-4 md:grid-cols-2 xl:grid-cols-3 ">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`h-fit p-3 rounded-sm ${card.className}`}
          >
            <CardHeader className="gap-4 p-0">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm">
                  <img
                    src={card.icon}
                    width={40}
                    height={40}
                    alt={card.title.toLowerCase()}
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-white">
                    {card.title}
                  </CardTitle>

                  <CardDescription className="text-md text-gray-100">
                    {card.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* <LiveCount /> */}
      {/* <WorldMap /> */}

      {/* <BookingDash /> */}
    </div>
  );
}
