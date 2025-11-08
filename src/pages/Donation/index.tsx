import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDaanDetailsByDocId, useGetAllDaan } from "@/api/DaanQueries";
import GaudaanLayout from "@/components/commonDonationDialog/GaudaanLayout";

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
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;
    const selectedCategoryFromState = state?.selectedCategory;
    const focus = state?.focus;
    const returnTo = state?.returnTo;

    const { data: allDaanData, isFetching: isFetchingAll } = useGetAllDaan();

    const [selectedCategory, setSelectedCategory] = useState<any | null>(selectedCategoryFromState ?? null);

    // If navigation requested a focus (e.g., 'bhumi'), resolve it to a category
    useEffect(() => {
        if (selectedCategoryFromState) return; // already have category

        if (focus && String(focus).toLowerCase() === 'bhumi') {
            // Wait until daan list is loaded and then pick the Bhumi category
            if (!isFetchingAll) {
                const items = allDaanData?.data ?? [];
                const match = items.find((c: any) => {
                    const t = String(c?.title || '').toLowerCase();
                    return t.includes('bhumi') || t.includes('bhud') || t.includes('bhum');
                });

                if (match) {
                    setSelectedCategory(match);
                } else {
                    // If we can't find the category, navigate home (graceful fallback)
                    navigate('/', { replace: true });
                }
            }
        } else if (!selectedCategoryFromState && !focus) {
            // No category and no focus -> go back
            navigate('/', { replace: true });
        }
    }, [selectedCategoryFromState, focus, allDaanData, isFetchingAll, navigate]);

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
                    <p className="mt-4 text-gray-600">Loading...</p>
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
