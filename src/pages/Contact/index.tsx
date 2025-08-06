
import React, { Suspense } from "react";
import { SectionLoader, ComponentLoader } from "../../components/ui/LoadingComponents";
import membershipPng from '@/assets/images/membership.png';

// Lazy load components
const HeroSection = React.lazy(() => import("../../components/common/HeroSection"));
const ContactCards = React.lazy(() => import("../../components/home/ContactCards"));
const OmNamehShivaya = React.lazy(() => import("../../components/home/OmNamehShivaya"));
const ScrollingBanner = React.lazy(() => import("../../components/home/ScrollingBanner"));
const ContactSection = React.lazy(() => import("../../components/home/ContactSection").then(module => ({ default: module.ContactSection })));
export const ContactPage = (): JSX.Element => {
  return (
    <>
      {/* Hero Section */}
      <Suspense fallback={<ComponentLoader height="h-96" />}>
        <HeroSection
          title="Contact Us"
          backgroundImage={membershipPng}
        />
      </Suspense>

      {/* Contact Cards Section */}
      <Suspense fallback={<SectionLoader />}>
        <div className="mb-8">
          <ContactCards />
        </div>
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
    </>
  );
};
