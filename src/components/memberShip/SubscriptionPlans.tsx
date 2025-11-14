import React, { useState, useEffect } from "react";
import { useI18n } from '@/lib/i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { buyNow, verifyPayment } from '@/services/subscription.service';
import { useGetAllSubscriptions } from '@/api/SubscriptionQueries';
import { useGetUserProfile } from '@/api/ProfileQueries';


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

    // Fetch user profile to determine currently active subscription (if any)
    const { data: profileData } = useGetUserProfile();
    const activeSubscriptionId = profileData?.data?.recentSubscription?.subscription?._id || profileData?.data?.recentSubscription?.subscription?.id || null;

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

    // Refactored Razorpay checkout flow: small helpers and clearer names
    const openRazorpayCheckout = async (planId: string, amountRupees?: number) => {
        // Helper: ensure user is authenticated or redirect to login while preserving intent
        const ensureAuthenticated = () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                localStorage.setItem('auth_redirect_destination', JSON.stringify({ path: '/membership', state: { planId } }));
                navigate('/login');
                return false;
            }
            return true;
        };

        // Helper: compute amount in paise (Razorpay expects paise)
        const computeAmountPaise = (maybeAmountRupees?: number) => {
            if (typeof maybeAmountRupees === 'number') return Math.round(maybeAmountRupees * 100);
            const found = apiPlans.find((p: any) => p._id === planId || p.id === planId);
            if (found && typeof found.amount === 'number') return Math.round(found.amount * 100);
            return 100 * 100; // default ₹100
        };

        // Helper: load Razorpay script once
        const loadRazorpayScript = () => new Promise<boolean>((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const existing = document.querySelector('script[data-razorpay]');
            if (existing) {
                setTimeout(() => resolve(!!(window as any).Razorpay), 500);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.setAttribute('data-razorpay', 'true');
            script.onload = () => resolve(!!(window as any).Razorpay);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });

        // Helper: build the base options object for Razorpay
        const buildRazorpayOptions = (paiseAmount: number, planIdStr: string) => {
            const key = (import.meta as any).env?.VITE_RAZORPAY_KEY || '';
            return {
                key,
                amount: paiseAmount,
                currency: 'INR',
                name: 'SM SHSEWA TRUST',
                description: `Membership - ${planIdStr}`,
                image: '/src/assets/images/SMSHFavicon.png', // SHMS icon
                prefill: {
                    name: (localStorage.getItem('name') || '') as string,
                    email: (localStorage.getItem('email') || '') as string,
                    contact: (localStorage.getItem('phone') || '') as string,
                },
                theme: { color: '#8B0000' },
            } as any;
        };

        // Helper: extract a minimal server order object
        const buildServerOrder = (respAny: any) => {
            const srv = respAny && (respAny.order || respAny.data || respAny);
            if (!srv) return null;
            return {
                id: srv.id || srv.order_id || null,
                amount: typeof srv.amount === 'number' ? srv.amount : (srv.amount_paid || null),
                currency: srv.currency || null,
                receipt: srv.receipt || null,
                status: srv.status || null,
            };
        };

        // Helper: verify payment with backend
        const handleVerification = async (razorResp: any, serverOrderObj: any, subscriptionId: string) => {
            const payload = {
                razorpay_payment_id: razorResp.razorpay_payment_id || razorResp.payment_id || razorResp.razorpay_paymentid,
                razorpay_order_id: razorResp.razorpay_order_id || razorResp.order_id || razorResp.razorpay_orderid,
                razorpay_signature: razorResp.razorpay_signature || razorResp.signature,
                order: serverOrderObj,
                subscriptionId,
            };

            try {
                const verifyResp: any = await verifyPayment(payload);
                if (verifyResp && verifyResp.success) {
                    toast.success('Payment verified and recorded');
                } else {
                    console.warn('Payment verification response', verifyResp);
                    toast.error('Payment completed but verification failed. Please contact support');
                }
            } catch (err) {
                console.error('Payment verification call failed', err);
                toast.error('Payment completed but verification failed. Please contact support');
            }
        };

        // ----- Main flow -----
        if (!ensureAuthenticated()) return;

        const amountPaise = computeAmountPaise(amountRupees);

        const planIdx = apiPlans.findIndex((p: any) => p._id === planId || p.id === planId);
        setProcessingIndex(planIdx >= 0 ? planIdx : null);

        // create server order (backend expects rupees)
        const serverOrderResp = await createOrderOnServer(planId, amountPaise);

        const options: any = buildRazorpayOptions(amountPaise, planId);

        const serverAny: any = serverOrderResp as any;
        const nested = serverAny && (serverAny.order || serverAny.data || serverAny.orderDetails || null);


        if (nested && (nested.id || nested.order_id)) {
            options.order_id = nested.id || nested.order_id;
            if (typeof nested.amount === 'number') options.amount = nested.amount;
            if (nested.currency) options.currency = nested.currency;
        } else {
            const returnedOrderId = serverAny && (serverAny.id || serverAny.order_id);
            if (returnedOrderId) options.order_id = returnedOrderId;
            if (serverAny && typeof serverAny.amount === 'number') options.amount = serverAny.amount;
            if (serverAny && serverAny.currency) options.currency = serverAny.currency;
        }


        if (serverAny && (serverAny.redirectUrl || serverAny.checkoutUrl)) {
            window.open(serverAny.redirectUrl || serverAny.checkoutUrl, '_blank');
            setProcessingIndex(null);
            return;
        }

        // Helpers: lock and restore page scroll while modal is open
        const lockBodyScroll = () => {
            try {
                const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
                // Save scroll position on body dataset so we can restore later
                (document.body as any).dataset.razorpayScrollY = String(scrollY);

                // Fix body to prevent background scroll
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.left = '0';
                document.body.style.right = '0';
                document.body.style.width = '100%';

                // Also hide overflow on root element
                document.documentElement.style.overflow = 'hidden';
            } catch (e) {
                // noop
            }
        };

        const unlockBodyScroll = () => {
            try {
                const scrollY = Number((document.body as any).dataset.razorpayScrollY || '0');

                // Remove styles applied by lock
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';

                document.documentElement.style.overflow = '';

                // Restore scroll position
                if (!Number.isNaN(scrollY)) {
                    window.scrollTo(0, scrollY);
                }

                delete (document.body as any).dataset.razorpayScrollY;
            } catch (e) {
                // noop
            } finally {
                setProcessingIndex(null);
            }
        };

        // success handler
        options.handler = async (razorResp: any) => {
            console.log('Razorpay success response', razorResp);
            const serverOrderObj = buildServerOrder(serverAny);
            await handleVerification(razorResp, serverOrderObj, planId);
            unlockBodyScroll();
        };

        // Enhanced modal dismissal handler
        options.modal = {
            ondismiss: () => {
                console.log('Checkout closed by user');
                unlockBodyScroll();
            },
            // Prevent escape key issues
            escape: true,
            // Handle backdrop clicks
            backdropclose: true
        };

        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error('Razorpay script failed to load');
            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', (response: any) => {
                console.error('Payment failed', response);
                toast.error('Payment failed. Please try again.');
                unlockBodyScroll();
            });

            // Lock background scroll before opening modal so page doesn't jump
            lockBodyScroll();

            rzp.open();

            // Backup: ensure scroll is restored after a short delay if modal is closed unexpectedly
            const backupTimer = setTimeout(() => {
                const isLocked = !!(document.body as any).dataset.razorpayScrollY || document.body.style.position === 'fixed' || document.documentElement.style.overflow === 'hidden';
                if (isLocked) {
                    unlockBodyScroll();
                }
            }, 300);

            // Clear backup timer when payment completes or modal closes properly
            rzp.on('payment.success', () => clearTimeout(backupTimer));

        } catch (err) {
            console.error('Razorpay open failed', err);
            toast.error('Oops! Something went wrong. Error in opening checkout', { position: 'top-center' });
            unlockBodyScroll();
        }
    };


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
                        const isActive = !!activeSubscriptionId && (String(plan._id) === String(activeSubscriptionId) || String(plan.id) === String(activeSubscriptionId));

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
                                {isActive && (
                                    <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-semibold shadow-md ${selected ? 'bg-white text-red-800' : ''}`} style={{ background: selected ? undefined : 'linear-gradient(90.44deg, #8B0000 0.41%, #AD2F16 99.66%)', color: selected ? '#8B0000' : '#ffffff' }}>
                                        Active
                                    </div>
                                )}

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