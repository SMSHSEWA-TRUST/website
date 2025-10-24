import React, { Suspense } from "react";
import { SectionLoader } from "@/components/ui/LoadingComponents";
import prashadWebp from "@/assets/images/Prashad’s.webp";
import PrashadSection from "@/components/prashad/PrashadSection";

const HeroSection = React.lazy(() => import("@/components/common/HeroSection"));

// Prashad data
const mahakaleshwarPlans = [
    {
        id: 1,
        name: "Prasad Plan 1",
        price: 400,
        description: "Experience the divine blessings of Shri Mahakaleshwar with this specially curated prasad. Prepared with pure ingredients and blessed in the sacred temple premises, this prasad carries the positive energy and grace of Lord Mahakal.",
        whatsInBox: "Sacred prasad blessed by Shri Mahakaleshwar temple priests, traditional sweets, sacred ash (vibhuti), a small idol/photo of Lord Mahakaleshwar, and detailed puja instructions for home worship."
    },
    {
        id: 2,
        name: "Prasad Plan 2",
        price: 999,
        description: "Our premium prasad offering includes an extensive collection of sacred items blessed at Shri Mahakaleshwar temple. This complete package is ideal for special occasions and family celebrations.",
        whatsInBox: "Premium prasad assortment, dry fruits, traditional sweets, sacred ash (vibhuti), rudraksha mala, framed photo of Lord Mahakaleshwar, divine blessings certificate, and comprehensive puja guide."
    },
    {
        id: 3,
        name: "Prasad Plan 1",
        price: 400,
        description: "Experience the divine blessings of Shri Mahakaleshwar with this specially curated prasad. Prepared with pure ingredients and blessed in the sacred temple premises, this prasad carries the positive energy and grace of Lord Mahakal.",
        whatsInBox: "Sacred prasad blessed by Shri Mahakaleshwar temple priests, traditional sweets, sacred ash (vibhuti), a small idol/photo of Lord Mahakaleshwar, and detailed puja instructions for home worship."
    },
    {
        id: 4,
        name: "Prasad Plan 2",
        price: 999,
        description: "Our premium prasad offering includes an extensive collection of sacred items blessed at Shri Mahakaleshwar temple. This complete package is ideal for special occasions and family celebrations.",
        whatsInBox: "Premium prasad assortment, dry fruits, traditional sweets, sacred ash (vibhuti), rudraksha mala, framed photo of Lord Mahakaleshwar, divine blessings certificate, and comprehensive puja guide."
    }
];

const salasarBalajiPlans = [
    {
        id: 5,
        name: "Prasad Plan 1",
        price: 400,
        description: "Receive the divine grace of Shri Salasar Balaji with this blessed prasad. Known for granting wishes and protecting devotees, Salasar Balaji's prasad brings strength, courage, and prosperity to your home.",
        whatsInBox: "Blessed prasad from Salasar Balaji temple, traditional besan ladoo, sacred vermillion (sindoor), miniature Hanuman idol, and special prayer mantras for Hanuman worship."
    },
    {
        id: 6,
        name: "Prasad Plan 2",
        price: 999,
        description: "This premium offering from Salasar Balaji temple includes a comprehensive set of sacred items to bring Hanuman Ji's blessings into your home. Perfect for devotees seeking divine protection and strength.",
        whatsInBox: "Complete prasad collection, dry fruits and sweets, sacred sindoor, Hanuman Chalisa booklet, energized Hanuman yantra, decorative photo frame of Salasar Balaji, and personalized blessing certificate."
    },
    {
        id: 7,
        name: "Prasad Plan 1",
        price: 400,
        description: "Receive the divine grace of Shri Salasar Balaji with this blessed prasad. Known for granting wishes and protecting devotees, Salasar Balaji's prasad brings strength, courage, and prosperity to your home.",
        whatsInBox: "Blessed prasad from Salasar Balaji temple, traditional besan ladoo, sacred vermillion (sindoor), miniature Hanuman idol, and special prayer mantras for Hanuman worship."
    },
    {
        id: 8,
        name: "Prasad Plan 2",
        price: 999,
        description: "This premium offering from Salasar Balaji temple includes a comprehensive set of sacred items to bring Hanuman Ji's blessings into your home. Perfect for devotees seeking divine protection and strength.",
        whatsInBox: "Complete prasad collection, dry fruits and sweets, sacred sindoor, Hanuman Chalisa booklet, energized Hanuman yantra, decorative photo frame of Salasar Balaji, and personalized blessing certificate."
    }
];

const photoFramesPlans = [
    {
        id: 9,
        name: "Photo Frame 1",
        price: 400,
        description: "Beautiful photo frame featuring divine imagery of Lord Mahakaleshwar and Salasar Balaji. Perfect for your home temple or office space, these frames bring positive energy and divine blessings to any environment.",
        whatsInBox: "Premium quality photo frame with divine imagery, protective glass covering, wall mounting accessories, and authenticity certificate. Frame dimensions: 8x10 inches with elegant finishing."
    },
    {
        id: 10,
        name: "Photo Frame 2",
        price: 999,
        description: "Exquisite photo frame set with premium finishing and divine artwork. This deluxe collection includes multiple frames to create a complete prayer corner in your home, radiating positive vibrations throughout your space.",
        whatsInBox: "Set of 3 premium photo frames (varying sizes), high-quality divine prints, anti-glare glass, decorative stand and wall mounting options, LED lighting option, and detailed placement guide for maximum spiritual benefit."
    },
    {
        id: 11,
        name: "Idol Set 1",
        price: 400,
        description: "Sacred idols of Lord Mahakaleshwar and Salasar Balaji, crafted with devotion and blessed by temple priests. These beautiful idols are perfect for daily worship and bring the divine presence into your home.",
        whatsInBox: "Brass/metal idol (6 inches height), decorative base, sacred cloth covering, small worship accessories set, and instructions for proper installation and daily worship rituals."
    },
    {
        id: 12,
        name: "Idol Set 2",
        price: 999,
        description: "Premium idol collection featuring exquisite craftsmanship and intricate detailing. This deluxe set includes everything needed to establish a complete temple corner in your home with authentic spiritual elements.",
        whatsInBox: "Large brass idol (12 inches), ornate decorative throne, complete puja accessories (bell, diya, incense holder), sacred threads and flowers, energized by temple priests, detailed worship manual, and special carrying case."
    }
];

export const PrashadPage = (): JSX.Element => {
    return (
        <>
            {/* Hero Section */}
            <Suspense fallback={<SectionLoader />}>
                <HeroSection
                    pageKey="prashad"
                    backgroundImage={prashadWebp}
                />
            </Suspense>

            {/* Main Content with Background */}
            <div className="w-full  py-8 md:py-12">
                {/* Shri Mahakaleshwar Prasad Section */}
                <PrashadSection
                    title="Shri Mahakaleshwar Prasad"
                    plans={mahakaleshwarPlans}
                />

                {/* Shri Salasar Balaji Prasad Section */}
                <PrashadSection
                    title="Shri Salasar Balaji Prasad"
                    plans={salasarBalajiPlans}
                    className="pt-4"
                />

                {/* Idols & Photo Frames Section */}
                <PrashadSection
                    title="Idols & Photo Frames"
                    plans={photoFramesPlans}
                    className="pt-4"
                />
            </div>
        </>
    );
};

export default PrashadPage;
