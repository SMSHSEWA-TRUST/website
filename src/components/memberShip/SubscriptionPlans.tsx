import React, { useState, useEffect } from "react";
import { useI18n } from '@/lib/i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { buyNow } from '@/services/subscription.service';
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
    const location = useLocation();

    // Auto-select plan if redirected here after login with a specific planId
    useEffect(() => {
        const planId = (location.state as any)?.planId;
        if (planId && displayPlans.length > 0) {
            const planIndex = displayPlans.findIndex((plan: any) => plan.id === planId || plan._id === planId);
            if (planIndex !== -1) {
                setSelectedIndex(planIndex);

                // Scroll to the selected plan after a short delay
                setTimeout(() => {
                    const planElement = document.getElementById(`plan-${planId}`);
                    if (planElement) {
                        planElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }, 300); // Delay to ensure the component is rendered and plan is selected
            }
            // Clear the navigation state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [displayPlans, location.state, location.pathname, navigate]);

    // No static map — use amount from API when available (amount is in rupees)


    // Try to create a purchase/cart entry on the backend (recommended).
    // This project uses an axios wrapper which returns response.data already, so the value returned here
    // will typically be the backend payload. The backend endpoint used by the curl example is
    // POST /api/my-cart/buy-now with body { subscriptionId, amount } where amount is in rupees.
    const createOrderOnServer = async (planId: string, amountPaise: number) => {
        try {
            // Convert paise -> rupees for the backend (example curl sends amount: 299)
            const amountRupees = Math.round(amountPaise / 100);
            const resp = await buyNow(planId, amountRupees);
            return resp || null;
        } catch (e) {
            const status = (e as any)?.response?.status;
            if (status === 401) {
                // Save the intended subscription purchase
                localStorage.setItem('auth_redirect_destination', JSON.stringify({
                    path: '/membership',
                    state: { planId: planId }
                }));
                navigate('/login');
                return null;
            }
            console.warn('Server buy-now failed, falling back to client-only checkout', e);
            return null;
        }
    };

    const [processingIndex, setProcessingIndex] = useState<number | null>(null);

    const openRazorpayCheckout = async (planId: string, amountRupees?: number) => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            // Save the intended subscription purchase
            localStorage.setItem('auth_redirect_destination', JSON.stringify({
                path: '/membership',
                state: { planId: planId }
            }));
            navigate('/login');
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

        // mark processing (disable button)
        const planIdx = apiPlans.findIndex((p: any) => p._id === planId || p.id === planId);
        setProcessingIndex(planIdx >= 0 ? planIdx : null);


        // Try server buy-now first (backend expects rupees)
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

        // backend may return different shapes; try common fields
        // Cast to any to safely inspect possible shapes returned by different backends
        const orderAny: any = order as any;
        const returnedOrderId = orderAny && (orderAny.id || orderAny.order_id || orderAny.orderId || orderAny.razorpay_order_id);
        if (returnedOrderId) {
            options.order_id = returnedOrderId;
        }

        // Some backends may return a redirect URL for hosted payment flow
        if (orderAny && (orderAny.redirectUrl || orderAny.checkoutUrl)) {
            // open hosted url in new tab instead of Razorpay inline
            window.open(orderAny.redirectUrl || orderAny.checkoutUrl, '_blank');
            setProcessingIndex(null);
            return;
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
        } finally {
            setProcessingIndex(null);
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
                                id={`plan-${plan._id || plan.id || idx}`}
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
                                                {plan.title}
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
                                                {`₹${plan.amount}`}
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
                                <button
                                    onClick={(e) => { e.stopPropagation(); openRazorpayCheckout(plan._id || plan.id, plan.amount); }}
                                    disabled={processingIndex === idx}
                                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${selected
                                        ? 'bg-white text-red-800 hover:bg-gray-50'
                                        : plan.id === 'enterprise'
                                            ? 'bg-white border-2 border-red-700 text-red-700 hover:bg-red-50'
                                            : 'bg-white border-2 border-red-700 text-red-700 hover:bg-red-50'
                                        } ${processingIndex === idx ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {processingIndex === idx ? (plan.processingText || 'Processing...') : (plan.buttonText || 'Get Started')}
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