import React, { useState } from "react";
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authTokenAxios } from '@/services/axios';
import { useGetAllSubscriptions } from '@/api/SubscriptionQueries';


const SubscriptionPlans: React.FC = () => {
    const { t } = useI18n();

    // fetch subscriptions from API
    const { data: subsResp, isLoading, isError } = useGetAllSubscriptions();

    // subsResp expected shape: { success, count, data: Subscription[] }
    const apiPlans = (subsResp && (subsResp as any).data) || [];

    // while loading, fall back to an empty array which will render skeletons or existing content
    const displayPlans: any[] = apiPlans.length ? apiPlans : [];

    // Default select the first plan
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const navigate = useNavigate();

    // No static map — use amount from API when available (amount is in rupees)

    // load Razorpay checkout script if not already loaded
    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Try to create an order on the backend (recommended). If backend endpoint isn't available,
    // fallback to a client-only checkout (requires VITE_RAZORPAY_KEY env variable).
    // Assumption: backend order creation endpoint is POST /payments/create-order and returns { id: string, amount: number }
    // If your backend uses a different route, update the path below.
    const createOrderOnServer = async (planId: string, amount: number) => {
        try {
            const resp = await authTokenAxios.post('/payments/create-order', { amount, planId });
            // the axios wrapper returns response.data by default in this project; adjust if different
            return (resp as any)?.order || resp;
        } catch (e) {
            // endpoint may not exist — caller should fallback
            console.warn('Server order creation failed, falling back to client-only checkout', e);
            return null;
        }
    };

    const openRazorpayCheckout = async (planId: string, amountRupees?: number) => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login', { state: { redirectTo: '/', planId } });
            return;
        }

        // determine amount in paise
        let amount = 100 * 100; // default ₹100
        if (typeof amountRupees === 'number') {
            amount = Math.round(amountRupees * 100);
        } else {
            // try to find in fetched plans
            const found = apiPlans.find((p: any) => p._id === planId || p.id === planId);
            if (found && typeof found.amount === 'number') amount = Math.round(found.amount * 100);
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
            toast.error('Unable to load payment gateway. Please try again later.');
            return;
        }

        // Try server order creation first
        const order = await createOrderOnServer(planId, amount);

        const key = (import.meta as any).env?.VITE_RAZORPAY_KEY;
        if (!key) {
            console.warn('VITE_RAZORPAY_KEY not set. Please add it to your .env when using client-only checkout.');
        }

        const options: any = {
            key: key || '', // if empty, Razorpay may still allow test mode depending on setup; prefer setting env var
            amount: amount, // in paise
            currency: 'INR',
            name: 'SM SHSEWA TRUST',
            description: `Membership - ${planId}`,
            // prefill from user profile if available
            prefill: {
                name: (localStorage.getItem('name') || '') as string,
                email: (localStorage.getItem('email') || '') as string,
                contact: (localStorage.getItem('phone') || '') as string,
            },
            theme: {
                color: '#8B0000',
            },
        };

        if (order && order.id) {
            options.order_id = order.id;
        }

        options.handler = function (response: any) {
            // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
            console.log('Razorpay success response', response);
            toast.success('Payment completed successfully');
            // TODO: verify payment on server if necessary and record subscription
        };

        options.modal = {
            ondismiss: function () {
                console.log('Checkout closed by user');
            },
        };

        try {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Razorpay open failed', err);
            toast.error('Failed to open payment window');
        }
    };
    // The billing toggle was removed in the new design; keep a simple flag if needed later
    // (currently not used) - removed setState to avoid unused variable lint warnings

    return (
        <section className="py-16 px-4 bg-[#F8F5F0] mt-10 lg:mt-16">
            <div className="max-w-7xl mx-auto">

                {/* Title */}
                <div className="text-center mb-8 font-secondaryFont">
                    <h1 className="font-primaryFont text-3xl text-secondaryColor mb-4">{t('MembershipPage.title')}</h1>

                    {/* Decorative line with dots and image */}
                    <div className="flex items-center justify-center py-2 w-full">
                        <div className="flex items-center w-full max-w-md">
                            {/* Left arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="w-2 h-2 transform rotate-45 bg-secondaryColor"></div>
                                <div className="flex-1 h-px bg-secondaryColor"></div>
                            </div>

                            {/* Center dots with continuous line: small-small-big-small-small */}
                            <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                                <div className="w-1.5 h-px bg-secondaryColor"></div>
                                <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                                <div className="w-1.5 h-px bg-secondaryColor"></div>
                                <div className="w-3 h-3 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                                <div className="w-1.5 h-px bg-secondaryColor"></div>
                                <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                                <div className="w-1.5 h-px bg-secondaryColor"></div>
                                <div className="w-1.5 h-1.5 rounded-full border-2 bg-secondaryColor border-secondaryColor"></div>
                            </div>

                            {/* Right arrow/diamond with connecting line */}
                            <div className="flex items-center flex-1">
                                <div className="flex-1 h-px bg-secondaryColor"></div>
                                <div className="w-2 h-2 transform rotate-45 bg-secondaryColor"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Toggle */}
                {/* <div className="flex justify-center mb-12">
                    <div className="inline-flex rounded-lg bg-white shadow-sm border border-gray-200" role="group" aria-label="Billing toggle">
                        <button
                            onClick={() => setBillingAnnual(false)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setBillingAnnual(false); }}
                            aria-pressed={!billingAnnual}
                            className={`px-6 py-2.5 font-SecondaryFont textDescription  rounded-md transition-colors ${!billingAnnual
                                ? 'bg-[#8B0000] text-[#FFFFFF]'
                                : 'bg-white text-[#000000]'
                                }`}
                        >
                            Billed Monthly
                        </button>
                        <button
                            onClick={() => setBillingAnnual(true)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setBillingAnnual(true); }}
                            aria-pressed={billingAnnual}
                            className={`px-6 py-2.5 font-SecondaryFont textDescription  rounded-md transition-colors ${billingAnnual
                                ? 'bg-[#8B0000] text-[#FFFFFF]'
                                : 'bg-white text-[#000000]'
                                }`}
                        >
                            Billed Annually
                        </button>
                    </div>
                </div> */}

                {/* Cards Grid */}
                {isLoading && <p className="text-center mb-4">Loading plans...</p>}
                {isError && <p className="text-center mb-4 text-red-600">Failed to load plans.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch bg-[#F8F5F0] rounded-md  ">
                    {displayPlans.map((plan: any, idx: number) => {
                        const selected = idx === selectedIndex;

                        return (
                            <div
                                key={plan._id || plan.id || idx}
                                onClick={() => setSelectedIndex(idx)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedIndex(idx); }}
                                className={`relative rounded-xl p-6 cursor-pointer transition-all duration-200 flex flex-col h-full ${selected
                                    ? 'bg-[#8B0000] text-white shadow-2xl transform -translate-y-2'
                                    : 'bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1'
                                    }`}
                            >
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`textHeadingLg font-semibold tracking-wider ${selected ? 'text-white' : 'text-gray-900'}`}>
                                                { plan.duration } Months
                                            </h3>
                                            {/* discount not used for these plans */}
                                        </div>

                                        {/* Title divider - a thin line under the title that changes color when selected */}
                                        <div className={`w-full h-[1px] my-3 bg-[#D05E2D]`}></div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-1">
                                        <div className="flex items-baseline">
                                            <span className={`textHeading font-bold ${selected ? 'text-white' : '#000000'}`}>
                                                { `₹${plan.amount}`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtitle */}
                                    <p className={`text-sm mb-6 ${selected ? 'text-white/90' : '#000000'}`}>
                                        {plan.duration < 12
                                            ? `Billed every ${plan.duration} month${plan.duration > 1 ? "s" : ""}`
                                            : `Billed every ${plan.duration / 12} year${plan.duration / 12 > 1 ? "s" : ""}`
                                        }
                                    </p>

                                    {/* Tagline */}
                                    <p className={`text-md font-medium mb-6 ${selected ? 'text-white' : '#000000'}`}>
                                        {plan.tagline || ''}
                                    </p>

                                    {/* Features */}
                                    <div className="mb-3">
                                        <h4 className={`text-md font-bold mb-2 ${selected ? 'text-white' : 'text-gray-800'}`}>
                                            {"What's Included"}
                                        </h4>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {(plan.planBenefits || plan.features || []).map((feature: any, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <svg
                                                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selected ? 'text-white' : 'text-gray-400'}`}
                                                    fill="none"
                                                    viewBox="0 0 16 16"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.5 4.5L6 12L2.5 8.5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span className={`text-sm ${selected ? 'text-white/90' : '#000000'}`}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Button */}
                                <button onClick={(e) => { e.stopPropagation(); openRazorpayCheckout(plan._id || plan.id, plan.amount); }} className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${selected
                                    ? 'bg-white text-red-800 hover:bg-gray-50'
                                    : plan.id === 'enterprise'
                                        ? 'bg-white border-2 border-red-700 text-red-700 hover:bg-red-50'
                                        : 'bg-white border-2 border-red-700 text-red-700 hover:bg-red-50'
                                    }`}>
                                    {plan.buttonText || 'Get Started'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SubscriptionPlans;