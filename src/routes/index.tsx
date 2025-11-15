import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from '../components/ui/LoadingComponents';
import OtpVerification from '@/pages/OtpVerification';
import FamilyDetailsGuard from '../components/common/FamilyDetailsGuard';

// Lazy load all page components (named exports)
const HomePage = lazy(() => import('../pages/Home').then(module => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('../pages/About').then(module => ({ default: module.AboutPage })));
const MemberShipPage = lazy(() => import('../pages/MemberShip/inedx').then(module => ({ default: module.MemberShipPage })));
const ContactPage = lazy(() => import('../pages/Contact').then(module => ({ default: module.ContactPage })));
const BlogPage = lazy(() => import('../pages/Blog').then(module => ({ default: module.BlogPage })));
const BlogDetailsPage = lazy(() => import('../pages/BlogDetails').then(module => ({ default: module.BlogDetailsPage })));
const GalleryPage = lazy(() => import('../pages/Gallery').then(module => ({ default: module.GalleryPage })));
const PujaPage = lazy(() => import('../pages/Puja').then(module => ({ default: module.PujaPage })));
const PujaBookingPage = lazy(() => import('../pages/PujaBooking').then(module => ({ default: module.default })));
const PujaBookingReviewPage = lazy(() => import('../pages/PujaBookingReview').then(module => ({ default: module.default })));
const PujaBookingConfirmationPage = lazy(() => import('../pages/PujaBookingConfirmation').then(module => ({ default: module.default })));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const FamilyDetailsPage = lazy(() => import('../pages/FamilyDetailsPage'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const MembershipHistory = lazy(() => import('../pages/MembershipHistory'));
const DonationHistory = lazy(() => import('../pages/DonationHistory'));
const PrashadOrderHistory = lazy(() => import('../pages/PrashadOrderHistory'));
const TermsPage = lazy(() => import('../pages/TermsAndConditions').then(module => ({ default: module.TermsPage })));
const PrivacyPage = lazy(() => import('../pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPage })));
const PrashadPage = lazy(() => import('../pages/Prashad').then(module => ({ default: module.PrashadPage })));
// Detail page for a specific prashad (dynamic id param)
const PrashadDetailPage = lazy(() => import('../pages/Prashad/Parshad[id]').then(module => ({ default: module.default })));
const PujaBookingsPage = lazy(() => import('../pages/PujaBookingsHistory').then(module => ({ default: module.default })));
const CheckoutPage = lazy(() => import('../pages/Checkout').then(module => ({ default: module.CheckoutPage })));
const DonationPage = lazy(() => import('../pages/Donation').then(module => ({ default: module.DonationPage })));

export const AppRoutes = (): JSX.Element => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={
          <FamilyDetailsGuard>
            <HomePage />
          </FamilyDetailsGuard>
        } />
        <Route path="/about" element={
          <FamilyDetailsGuard>
            <AboutPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/membership" element={
          <FamilyDetailsGuard>
            <MemberShipPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/contact" element={
          <FamilyDetailsGuard>
            <ContactPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/blogs" element={
          <FamilyDetailsGuard>
            <BlogPage />
          </FamilyDetailsGuard>
        } />
        {/* Accept an id param so we can render specific blog entries (e.g. /blog-details/1) */}
        <Route path="/blog-details/:id" element={
          <FamilyDetailsGuard>
            <BlogDetailsPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/gallery" element={
          <FamilyDetailsGuard>
            <GalleryPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/puja" element={
          <FamilyDetailsGuard>
            <PujaPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/puja-booking" element={
          <FamilyDetailsGuard>
            <PujaBookingPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/puja-booking-review" element={
          <FamilyDetailsGuard>
            <PujaBookingReviewPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/puja-booking-confirmation" element={
          <FamilyDetailsGuard>
            <PujaBookingConfirmationPage />
          </FamilyDetailsGuard>
        } />
        {/* Authentication routes - skip family check */}
        <Route path="/login" element={
          <FamilyDetailsGuard skipFamilyCheck={true}>
            <LoginPage />
          </FamilyDetailsGuard>
        } />

        <Route path="/otp" element={
          <FamilyDetailsGuard skipFamilyCheck={true}>
            <OtpVerification />
          </FamilyDetailsGuard>
        } />
        <Route path="/signup" element={
          <FamilyDetailsGuard skipFamilyCheck={true}>
            <SignupPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/terms" element={
          <FamilyDetailsGuard>
            <TermsPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/privacy" element={
          <FamilyDetailsGuard>
            <PrivacyPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/family-details" element={
          <FamilyDetailsGuard skipFamilyCheck={true}>
            <FamilyDetailsPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/profile" element={
          <FamilyDetailsGuard>
            <ProfilePage />
          </FamilyDetailsGuard>
        } />
        <Route path="/membership-history" element={
          <FamilyDetailsGuard>
            <MembershipHistory />
          </FamilyDetailsGuard>
        } />
        <Route path="/puja-bookings" element={
          <FamilyDetailsGuard>
            <PujaBookingsPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/donations-history" element={
          <FamilyDetailsGuard>
            <DonationHistory />
          </FamilyDetailsGuard>
        } />
        <Route path="/prashad-order-history" element={
          <FamilyDetailsGuard>
            <PrashadOrderHistory />
          </FamilyDetailsGuard>
        } />
        <Route path="/prashad" element={
          <FamilyDetailsGuard>
            <PrashadPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/prashad/:id" element={
          <FamilyDetailsGuard>
            <PrashadDetailPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/checkout" element={
          <FamilyDetailsGuard>
            <CheckoutPage />
          </FamilyDetailsGuard>
        } />
        <Route path="/donation/:title?" element={
          <FamilyDetailsGuard>
            <DonationPage />
          </FamilyDetailsGuard>
        } />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
