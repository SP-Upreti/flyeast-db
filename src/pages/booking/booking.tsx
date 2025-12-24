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

      {/* <pre>{JSON.stringify(bookingData, null, 2)}</pre> */}



      {(
        <div className="container mx-auto py-2 mt-4">


          <Suspense fallback={<TableShimmer />}>
            <BookingItemTable
              pkgs={(bookingData?.data as any) || []}
              isLoading={bookingLoading}
            />
          </Suspense>
        </div>
      )}

    </main>
  );
}
