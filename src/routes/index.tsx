import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from '../components/ui/LoadingComponents';

// Lazy load all page components
const HomePage = lazy(() => import('../pages/Home').then(module => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('../pages/About').then(module => ({ default: module.AboutPage })));
const MemberShipPage = lazy(() => import('../pages/MemberShip/inedx').then(module => ({ default: module.MemberShipPage })));
const ContactPage = lazy(() => import('../pages/Contact').then(module => ({ default: module.ContactPage })));
const BlogPage = lazy(() => import('../pages/Blog').then(module => ({ default: module.BlogPage })));
const BlogDetailsPage = lazy(() => import('../pages/BlogDetails').then(module => ({ default: module.BlogDetailsPage })));
const PujaPage = lazy(() => import('../pages/Puja').then(module => ({ default: module.PujaPage })));

export const AppRoutes = (): JSX.Element => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/membership" element={<MemberShipPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blog-details" element={<BlogDetailsPage />} />
                <Route path="/puja" element={<PujaPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
