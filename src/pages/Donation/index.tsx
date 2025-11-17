import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDaanDetailsByDocId, useGetAllDaan } from "@/api/DaanQueries";
import GaudaanLayout from "@/components/commonDonationDialog/GaudaanLayout";
import { useI18n } from "@/lib/i18n";
import { createDonationSlug } from "@/lib/donationUtils";

type LocationState = {
    selectedCategory?: {
        _id: string;
        title: string;
        description: string;
        [key: string]: any;
    };
    focus?: string;
    returnTo?: string;
};

export const DonationPage: React.FC = () => {
    const { t } = useI18n();
    const location = useLocation();
    const navigate = useNavigate();
    const { title: urlTitle } = useParams<{ title?: string }>();
    const state = location.state as LocationState;
    const selectedCategoryFromState = state?.selectedCategory;
    const focus = state?.focus;
    const returnTo = state?.returnTo;

    const { data: allDaanData, isFetching: isFetchingAll } = useGetAllDaan();

    const [selectedCategory, setSelectedCategory] = useState<any | null>(selectedCategoryFromState ?? null);

    // Helper function to find category by URL slug
    const findCategoryBySlug = (slug: string, categories: any[]) => {
        return categories.find((category: any) => {
            const categorySlug = createDonationSlug(category.title || '');
            return categorySlug === slug;
        });
    };

    // Handle URL-based navigation and category selection
    useEffect(() => {
        if (selectedCategoryFromState) {
            // If we have category from state but no URL title, update URL
            if (!urlTitle) {
                const slug = createDonationSlug(selectedCategoryFromState.title || '');
                navigate(`/donation/${slug}`, { replace: true, state });
            }
            return;
        }

        if (!isFetchingAll && allDaanData?.data) {
            const items = allDaanData.data ?? [];

            if (urlTitle) {
                // Try to find category by URL slug
                const match = findCategoryBySlug(urlTitle, items);
                if (match) {
                    setSelectedCategory(match);
                    return;
                }
                // If no match found for the URL title, redirect to home
                navigate('/', { replace: true });
                return;
            }

            if (focus && String(focus).toLowerCase() === 'bhumi') {
                // Wait until daan list is loaded and then pick the Bhumi category
                const match = items.find((c: any) => {
                    const t = String(c?.title || '').toLowerCase();
                    return t.includes('bhumi') || t.includes('bhud') || t.includes('bhum');
                });

                if (match) {
                    setSelectedCategory(match);
                    // Update URL with the category title
                    const slug = createDonationSlug(match.title || '');
                    navigate(`/donation/${slug}`, { replace: true, state });
                    return;
                }
            }

            // Only redirect if we have no state and no URL params
            if (!selectedCategoryFromState && !focus && !urlTitle) {
                navigate('/', { replace: true });
            }
        }
    }, [selectedCategoryFromState, focus, urlTitle, allDaanData, isFetchingAll, navigate, state]);

    const { data, isFetching } = useDaanDetailsByDocId(selectedCategory?._id || '');

    const handleBack = () => {
        // Navigate back to the section user came from
        const focusSection = returnTo || 'donations';
        navigate('/', { state: { focus: focusSection } });
    };

    if (!selectedCategory || isFetching || isFetchingAll) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD2F16] mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t("donationPage.loading")}</p>
                </div>
            </div>
        );
    }

    return (
        <GaudaanLayout
            title={data?.data?.title ?? selectedCategory.title}
            data={data?.data}
            onBack={handleBack}
        />
    );
};

export default DonationPage;
