import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from '../components/ui/LoadingComponents';
import OtpVerification from '@/pages/OtpVerification';

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

export const AppRoutes = (): JSX.Element => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/membership" element={<MemberShipPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        {/* Accept an id param so we can render specific blog entries (e.g. /blog-details/1) */}
        <Route path="/blog-details/:id" element={<BlogDetailsPage />} />
        <Route path="/gallery" element={<PujaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
