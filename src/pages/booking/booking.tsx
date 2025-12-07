import { ItemTable as BookingItemTable } from "@/components/booking/Item-Table";
import { TableShimmer } from "@/components/table-shimmer";
import { useGetBookings } from "@/hooks/useBooking";
import { Suspense } from "react";
import PrivateTripPage from "../private-trip/private-trip";
import useBookingViewStore from "@/store/bookingViewStore";

export default function BookingPage() {
  const { data: bookingData, isLoading: bookingLoading } = useGetBookings();

  const { showBooking, setShowBooking } = useBookingViewStore();

  return (
    <main className="">


      <div className="flex divide-x border w-fit rounded-[2px] overflow-hidden">
        <button className={`px-4 py-2 w-[180px] font-semibold cursor-pointer ${showBooking ? "bg-[#E83759] text-white" : "bg-white text-black"}`} onClick={() => setShowBooking(true)}>Group Departure</button>
        <button className={`px-4 py-2 w-[180px] font-semibold cursor-pointer ${!showBooking ? "bg-[#E83759] text-white" : "bg-white text-black"}`} onClick={() => setShowBooking(false)}>Private Trips</button>
      </div>

      {showBooking ? (
        <div className="container mx-auto py-2 mt-4">


          <Suspense fallback={<TableShimmer />}>
            <BookingItemTable
              pkgs={(bookingData?.data?.bookings as any) || []}
              isLoading={bookingLoading}
            />
          </Suspense>
        </div>
      ) : <PrivateTripPage />}

    </main>
  );
}
