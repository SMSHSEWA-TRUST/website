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
const PujaPage = lazy(() => import('../pages/Puja').then(module => ({ default: module.PujaPage })));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const FamilyDetailsPage = lazy(() => import('../pages/FamilyDetailsPage'));

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
            <PujaPage />
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
        <Route path="/family-details" element={
          <FamilyDetailsGuard skipFamilyCheck={true}>
            <FamilyDetailsPage />
          </FamilyDetailsGuard>
        } />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
