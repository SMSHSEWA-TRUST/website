import React, { Suspense, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { scrollToId } from '@/lib/scrollUtils';
import {
  SectionLoader,
  ComponentLoader,
  LiveDarshanLoader,
  ServicesLoader,
} from "@/components/ui/LoadingComponents";

const Hero = React.lazy(() => import("@/components/home/Hero"));
const About = React.lazy(() => import("@/components/home/About"));
const Services = React.lazy(() => import("@/components/home/Services"));
const LiveDarshan = React.lazy(() => import("@/components/home/LiveDarshan"));
const DivinePower = React.lazy(() => import("@/components/home/DivinePower"));
const DonationSection = React.lazy(() => import("@/components/home/DonationSection"));
const DaanSection = React.lazy(() => import("@/components/home/DaanSection"));
const GridLayout = React.lazy(() => import("@/components/home/GridLayout"));
const OmNamehShivaya = React.lazy(() => import("@/components/home/OmNamehShivaya"));
const ScrollingBanner = React.lazy(() => import("@/components/home/ScrollingBanner"));
const ContactSection = React.lazy(() =>
  import("@/components/home/ContactSection").then(module => ({
    default: module.ContactSection,
  }))
);
const BlogSection = React.lazy(() =>
  import("@/components/home/BlogSection").then(module => ({
    default: module.BlogSection,
  }))
);
const BhudaanSection = React.lazy(() => import("@/components/home/BhudaanSection"));

export const HomePage = (): JSX.Element => {
  const location = useLocation();


  useEffect(() => {
    try {
      const focus = (location.state as any)?.focus;
      const hash = location.hash || '';
      // support multiple targets: donations -> #donations, mission -> #mission
      const targets: string[] = [];
      if (String(focus || '').toLowerCase() === 'donations') targets.push('donations');
      if (String(focus || '').toLowerCase() === 'mission') targets.push('mission');
      if (hash === '#donations') targets.push('donations');
      if (hash === '#mission') targets.push('mission');

      if (targets.length) {
        const targetId = targets[0];
        let attempts = 0;
        const maxAttempts = 40; // allow a bit more time for lazy components
        const interval = setInterval(() => {
          attempts += 1;
          const el = document.getElementById(targetId);
          if (el) {
            // use helper which accounts for fixed header height
            scrollToId(targetId);
            clearInterval(interval);
            try {
              // clear any navigation state/hash so this doesn't re-trigger
              window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
            } catch (e) {
              // ignore
            }
            return;
          }
          if (attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    } catch (e) {
    }
  }, [location]);

  return (
    <>
      {/* Hero Section */}
      <Suspense fallback={<ComponentLoader height="h-screen" />}>
        <Hero />
      </Suspense>

      {/* Bhudaan Section */}
      <Suspense fallback={<SectionLoader />}>
        <BhudaanSection />
      </Suspense>

      {/* About Section */}
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>

      {/* Live Darshan Section */}
      <Suspense fallback={<LiveDarshanLoader />}>
        <LiveDarshan />
      </Suspense>

      {/* Services Section */}
      <Suspense fallback={<ServicesLoader />}>
        <Services />
      </Suspense>

      {/* Divine Power Section */}
      <Suspense fallback={<SectionLoader />}>
        <DivinePower />
      </Suspense>

      {/* Contact Cards Section */}
      {/* <Suspense fallback={<SectionLoader />}>
        <ContactCards />
      </Suspense> */}
      <Suspense fallback={<SectionLoader />}>
        <DonationSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <DaanSection />
      </Suspense>

      {/* Grid Layout Section */}
      <Suspense fallback={<SectionLoader />}>
        <GridLayout />
      </Suspense>

      {/* Om Namah Shivaya Section */}
      <Suspense fallback={<SectionLoader />}>
        <OmNamehShivaya />
      </Suspense>

      {/* Scrolling Banner */}
      <Suspense fallback={<ComponentLoader height="h-16" />}>
        <ScrollingBanner />
      </Suspense>

      {/* Contact Section */}
      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>

      {/* Blog Articles Section */}
      <Suspense fallback={<SectionLoader />}>
        <BlogSection />
      </Suspense>
    </>
  );
};
