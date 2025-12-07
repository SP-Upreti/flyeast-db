import { Toaster } from "sonner";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ActivityBookingsPage from "./components/activity-bookings/page";
import DashboardPage from "./components/DashboardPage";
import ProfilePage from "./components/profile/page";
import CategoryPage from "./components/categories/categoryPage";
import SubCategoryPage from "./components/subCategory/subCategoryPage";
import Layout from "./layout/dashboard-layout";
import BlogPage from "./pages/blog/blog";
import MembersPage from "./pages/team-member/member";
import PageContentPage from "./pages/seoContent/page";
import DateAndPricingListPage from "./components/dateandpricing/DateAndPricingListPage";
import PaxListPage from "./components/pax/PaxListPage";
import ItineraryListPage from "./components/itinerary/ItineraryListPage";
import InclusionListPage from "./components/inclusion/InclusionListPage";
import GearListPage from "./components/gear/GearListPage";
import ExclusionListPage from "./components/exclusion/ExclusionListPage";
import AttractionListPage from "./components/attraction/AttractionListPage";
import RequirementListPage from "./components/requirements/RequirementListPage";
import CertificatePage from "./pages/certificate/certificate";
import InfoPage from "./pages/usefulInfo/info";
import BookingPage from "./pages/booking/booking";
import ReviewPage from "./pages/review/review";
import InboxListPage from "./components/inbox/InboxListPage";
import FaqListPage from "./components/faq/FaqListPage";
import PageContentViewPage from "./components/pageContent/view-page";
import PackageListPage from "./components/packages/PackageListPages";
import BookingReply from "./components/booking/Booking-Reply";
import UserManagementPage from "./pages/user-management/user-management";
import ImageGallery from "./components/bloggallery/ImageGallery";
import Gallery from "./components/gallery.tsx/Gallery";
import PackageInfoListPage from "./components/essential-info/PackageInfoListPage";
import CustomBookingReply from "./components/custom-booking/Custom-Booking-Reply";
import PackageSearchPage from "./components/package-search/package-search";
import HomeGallery from "./components/home-gallery/HomeGallery";
import Homefaq from "./pages/homefaq/homefaq";
import HomeTestimonialPage from "./pages/home-testimonial/home-testimonial";
import VideoReviewPage from "./pages/view-review/videoReview";
import SeasonListPage from "./components/seasoninfo/SeasonInfoListPage";
import WhyLoveListPage from "./components/why-love/WhyLoveListPage";
import ImportantNoticeListPage from "./components/important-notice/ImportantListPage";
import InsuranceListPage from "./components/insurance/InsuranceListPage";
import AddonsPage from "./components/addons/AddonsPage";
import PrivateTripPage from "./pages/private-trip/private-trip";
/**
 * The main application component, which contains all the routes and layout
 * components for the application.
 *
 * @returns The JSX element for the application.
 */
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Dashboard routes wrapped with Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="category/:id" element={<SubCategoryPage />} />
            <Route
              path="category/:cid/subcategory/:id"
              element={<PackageListPage />}
            />
            <Route
              path="activity-bookings"
              element={<ActivityBookingsPage />}
            />
            <Route
              path="dateandpricing/:id"
              element={<DateAndPricingListPage />}
            />
            <Route path="reviews" element={<ReviewPage />} />
            <Route path="pax/:id" element={<PaxListPage />} />
            <Route path="Itinerary/:id" element={<ItineraryListPage />} />
            <Route path="inclusion/:id" element={<InclusionListPage />} />
            <Route path="exclusion/:id" element={<ExclusionListPage />} />
            <Route path="attraction/:id" element={<AttractionListPage />} />
            <Route path="gear/:id" element={<GearListPage />} />
            <Route path="addons/:id" element={<AddonsPage />} />
            <Route path="gallery/:id" element={<Gallery />} />
            <Route path="package-info/:id" element={<PackageInfoListPage />} />
            <Route path="package-search" element={<PackageSearchPage />} />
            <Route path="video-review/:id" element={<VideoReviewPage />} />
            <Route path="insurance/:id" element={<InsuranceListPage />} />

            {/* <Route path="highlights/:id" element={<TripHighlightListPage />} /> */}
            <Route path="faq/:id" element={<FaqListPage />} />
            <Route path="home-gallery" element={<HomeGallery />} />
            <Route path="home-testimonial" element={<HomeTestimonialPage />} />
            <Route path="homefaq" element={<Homefaq />} />
            <Route
              path="important-notice/:id"
              element={<ImportantNoticeListPage />}
            />

            <Route path="private-trips" element={<PrivateTripPage />} />

            <Route path="season-info/:id" element={<SeasonListPage />} />
            <Route path="blogs" element={<BlogPage />} />
            <Route path="bookings" element={<BookingPage />} />
            <Route path="bookings/reply/:id" element={<BookingReply />} />
            <Route
              path="custom-bookings/reply/:id"
              element={<CustomBookingReply />}
            />
            <Route path="why-love/:id" element={<WhyLoveListPage />} />

            <Route path="blog-gallery" element={<ImageGallery />} />

            <Route path="blogs" element={<BlogPage />} />
            <Route path="certificate" element={<CertificatePage />} />
            <Route path="useful-info" element={<InfoPage />} />

            <Route path="team-members" element={<MembersPage />} />
            <Route path="page-content" element={<PageContentPage />} />
            <Route
              path="activity-bookings"
              element={<ActivityBookingsPage />}
            />
            <Route path="requirements/:id" element={<RequirementListPage />} />
            <Route path="inbox" element={<InboxListPage />} />
            <Route path="pages/:id" element={<PageContentViewPage />} />
            <Route path="user-management" element={<UserManagementPage />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
