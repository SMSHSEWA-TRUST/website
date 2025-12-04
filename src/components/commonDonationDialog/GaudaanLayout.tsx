import React, { useState, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DonationCard from "./components/DonationCard";
import { Input } from "../ui/input";
import DonationForm from "./DonationForm";
import Card from "./components/Card";
import { formatMoney, SectionTitle, getDaanImages, getDaanImage, getDaanImageAlt } from "./components/Utils";
import { usePlotsData } from '@/api/DaanQueries';
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { usePurchaseReqestSubmission } from "@/api/DaanQueries";
import { PurchaseRequestPayloadTypes } from "@/services/types";
import CashImage from '@/assets/images/cash.png';
import UpiImage from '@/assets/images/upi.png';
import EmiImage from '@/assets/images/emi.png';
import ChequeImage from '@/assets/images/cheque.png';
import CardImage from '@/assets/images/card.png';
import Bank_transferImage from '@/assets/images/bank_transfer.png';
import ChequeExample from '@/assets/images/chequeExample.png';
import PaymentQrImage from '@/assets/images/paymentQr.png';
import EmiRequestIMage from '@/assets/images/EmiReuest.png';
import WhatsAppIcon from '@/assets/images/whatsappIcon.png';
import { useI18n } from "@/lib/i18n";
import { saveDonationFormState, getDonationFormState, clearDonationFormState } from "@/lib/donationFormStorage";

type userProps = {
  name: string;
  phone: string;
  email: string;
};

interface GaudaanLayoutProps {
  title?: string;
  onBack?: () => void;
  data: any;
}
const shouldShowUserPaying = ["Bhumi Daan", "Bhojan Daan"];

const GaudaanLayout: React.FC<GaudaanLayoutProps> = ({ title = "Bhojan daan", onBack, data }) => {
  const { t } = useI18n();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? (JSON.parse(storedUser) as userProps) : null;

  // Try to restore saved form state from sessionStorage
  const savedState = data?._id ? getDonationFormState(data._id) : null;

  const DefaultValues = {
    donationDocId: savedState?.donationDocId ?? data?.daanTypes?.[0]?._id ?? "",
    daanType: savedState?.daanType ?? data?.daanTypes?.[0]?._id ?? "", // Selected donation type ID
    name: savedState?.name ?? user?.name ?? "",
    fatherName: savedState?.fatherName ?? "",
    motherName: savedState?.motherName ?? "",
    phoneNumber: savedState?.phoneNumber ?? user?.phone ?? "",
    email: savedState?.email ?? user?.email ?? "",
    address: savedState?.address ?? "",
    amount: savedState?.amount ?? data?.daanTypes?.[0]?.amount ?? 0,
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: DefaultValues,
  });
  // Keep userPickedAmount as a string while typing for stable controlled input behavior
  const [userPickedAmount, setUserPickedAmount] = useState<string>(savedState?.userPickedAmount !== undefined && savedState?.userPickedAmount !== null ? String(savedState.userPickedAmount) : "");
  const [selectedDaanTypeId, setSelectedDaanTypeId] = useState<string | null>(savedState?.selectedDaanTypeId ?? savedState?.donationDocId ?? (DefaultValues.donationDocId || null));
  const { mutate, isPending } = usePurchaseReqestSubmission();
  // New flow states: form -> selectPayment -> paymentDetails
  const [flowStep, setFlowStep] = useState<'form' | 'selectPayment' | 'paymentDetails'>(savedState?.flowStep ?? 'form');
  const [submittedForm, setSubmittedForm] = useState<any | null>(savedState ? {
    ...savedState,
    selectedPlots: savedState.selectedPlots ?? [],
    plotContacts: savedState.plotContacts ?? {},
    sameDetailsForAll: savedState.sameDetailsForAll ?? false,
    expandedPlots: savedState.expandedPlots ?? {},
  } : null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(savedState?.selectedPaymentMethod ?? null);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState<boolean>(true);
  const grandTotal = watch("amount");
  const finalPayingAmount = Number(grandTotal) + (Number(userPickedAmount) || 0);
  const bhumiAmount = data?.daanTypes?.[0]?.amount ?? 125000;
  const bhumiLabel = data?.plotSizeLabel ?? "1 Sq. Ft Land";
  const bhumiDescription = data?.shortDescription ?? t("donationPage.bhumiDaan.defaultDescription");

  const handleAmountChange = (amount: number) => {
    setValue("amount", amount);
  };

  // Helper flags for which UI to show
  const isBhumi = title === "Bhumi Daan" || data?.title === "Bhumi Daan";
  const isBhojan = title === "Bhojan Daan" || data?.title === "Bhojan Daan";
  const isAnnadan = title === "Anna Daan" || title === "Anna Daan" || data?.title === "Anna Daan" || data?.title === "Annadaan";
  const isRashiDaan = (title || data?.title || '').toLowerCase().includes('rashi');

  // When showing Bhumi Daan we fetch the plots from the server (API: /plots)
  // and inject them into the `data` passed down to the DonationForm so the
  // LandDonationSelector receives the latest API data.
  const { data: plotsResp } = usePlotsData(isBhumi);
  const apiPlots: any[] = plotsResp?.data?.data ?? [];
  const dataWithPlots = isBhumi ? { ...(data ?? {}), plots: data?.plots?.length ? data.plots : apiPlots } : data;

  // Default fallback lists
  const defaultBhojanList: Array<{ _id: string; title: string; amount: number }> = [
    { _id: 'd1', title: '1 Time Bhojandaan', amount: 10000 },
    { _id: 'd2', title: '1 Day Full Bhojandaan', amount: 20000 },
    { _id: 'd3', title: '3 Day Bhojandaan', amount: 60000 },
    { _id: 'd4', title: '1 Week Bhojandaan', amount: 140000 },
    { _id: 'd5', title: '1 Month Bhojandaan', amount: 600000 },
  ];

  const defaultAnnadanList: Array<{ id: string; title: string; qty: string }> = [
    { id: 'i1', title: 'Rice', qty: '100 Kgs' },
    { id: 'i2', title: 'Daal', qty: '50 Kgs' },
    { id: 'i3', title: 'Vegetables', qty: '150 Kgs' },
    { id: 'i4', title: 'Milk', qty: '50 Ltr' },
    { id: 'i5', title: 'Curd', qty: '75 Kgs' },
  ];

  // Helper to safely read a display title from item objects that may use
  // different property names across data shapes (title, name, displayName, label)
  const getItemTitle = (it: any) => (it?.title ?? it?.name ?? it?.displayName ?? it?.label ?? 'Untitled');

  // Local small components to keep JSX tidy
  const BhumiPreview: React.FC = () => (
    <div className="flex justify-end">
      <div className="w-full rounded-xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(180deg,#b83b2a,#8b1f12)' }}>
        <div className="p-3 text-center text-white">
          <div className="text-sm opacity-90">{bhumiLabel}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{formatMoney(bhumiAmount)}</div>
          <div className="mt-3 bg-white/10 rounded-md px-3 py-2 text-xs text-white/90 leading-snug">{bhumiDescription}</div>
        </div>
      </div>
    </div>
  );

  const BhojanList: React.FC = () => {
    const items: any[] = data?.daanTypes?.length ? data.daanTypes : defaultBhojanList;
    return (
      <div className="w-full">
        <div className="w-full rounded-xl overflow-hidden shadow-lg bg-[#b83b2a] text-white">
          <div className="p-4">
            <ul className="space-y-3">
              {items.map((it: any) => (
                <li
                  key={it._id}
                  onClick={() => {
                    setSelectedDaanTypeId(it._id);
                    setValue('donationDocId', it._id);
                    setValue('daanType', it._id); // Set daanType when Bhojan Daan item is selected
                    setValue('amount', it.amount ?? 0);
                    setUserPickedAmount('');
                    // Save state immediately when selection changes
                    if (data?._id) {
                      saveDonationFormState(data._id, {
                        donationDocId: it._id,
                        daanType: it._id,
                        amount: it.amount ?? 0,
                        selectedDaanTypeId: it._id,
                        userPickedAmount: null,
                        flowStep: 'form',
                      });
                    }
                  }}
                  className={`flex items-center justify-between gap-3 cursor-pointer rounded-md px-3 py-2 transition ${selectedDaanTypeId === it._id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full" />
                    <span className="text-sm text-white">{getItemTitle(it)}</span>
                  </div>
                  <div className="text-sm font-semibold">{formatMoney(it.amount ?? 0)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-white/10 rounded-md px-3 py-2 text-xs text-white/90">{data?.shortDescription ?? 'भोजन दान जीवन का सबसे पवित्र कर्म है'}</div>
          </div>
        </div>
      </div>
    );
  };

  const AnnadanList: React.FC = () => {
    const items: any[] = data?.items?.length ? data.items : defaultAnnadanList;
    return (
      <div className="w-full">
        <div className="w-full rounded-xl overflow-hidden shadow-lg bg-[#b23a2a] text-white">
          <div className="p-4">
            <ul className="space-y-3">
              {items.map((it: any) => (
                <li key={it.id} className="flex items-center justify-between gap-3 px-3 py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full" />
                    <span className="text-sm">{getItemTitle(it)}</span>
                  </div>
                  <div className="text-sm font-medium">{it.qty}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-white/10 rounded-md px-3 py-2 text-xs text-white/90">{data?.shortDescription ?? 'अन्नदान से बढ़कर कोई दान नहीं, यह भूख मिटाकर जीवन में मुस्कान लाता है'}</div>
          </div>
        </div>
      </div>
    );
  };
  const handleMutate = (formdata: any) => {
    const payload: PurchaseRequestPayloadTypes = {
      addressDetails: formdata.address,
      daanId: data?._id,
      email: formdata.email,
      fatherName: formdata.fatherName,
      motherName: formdata.motherName,
      name: formdata.name,
      phoneNumber: formdata.phoneNumber,
      totalAmount: finalPayingAmount,
      paymentMode: selectedPaymentMethod || undefined,
      ...(formdata.daanType && {
        daanType: formdata.daanType, // Include the selected donation type ID
      }),
      ...(formdata.plotIds?.length > 0 && {
        // Send as an array (not a JSON string) so backend receives proper ObjectId array
        plotIds: formdata.plotIds,
      }),
      ...(formdata.plotsDetails?.length > 0 && {
        // Include compact plot details (only plotId, plotNumber and contact) so
        // backend gets the necessary information without extra fields from the
        // full selectedPlots objects.
        plotsDetails: formdata.plotsDetails,
      }),
    };
    mutate(payload, {
      onSuccess: () => {
        // Clear saved form state on successful submission
        if (data?._id) {
          clearDonationFormState(data._id);
        }
        reset(DefaultValues);
        setUserPickedAmount('');
        setSubmittedForm(null);
        setSelectedPaymentMethod(null);
        setFlowStep('form');
        onBack?.();
      },
    });
  };

  // New: on form submit, store form and advance to payment selection step
  const onSubmit = (form: any) => {
    if (finalPayingAmount === 0 && !shouldShowUserPaying.includes(form?.title))
      return toast.error("Amount (Daan) should not be 0");
    setSubmittedForm(form);
    setFlowStep('selectPayment');

    // Scroll to top instantly
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      // Push history state so back button works
      window.history.pushState({ flowStep: 'selectPayment' }, '');
    }

    // Save form state to sessionStorage for persistence including all plot data
    if (data?._id) {
      saveDonationFormState(data._id, {
        ...form,
        userPickedAmount,
        selectedDaanTypeId,
        flowStep: 'selectPayment',
        selectedPaymentMethod: null,
        // Ensure plot-related data is saved
        selectedPlots: form.selectedPlots ?? [],
        plotContacts: form.plotContacts ?? {},
        sameDetailsForAll: form.sameDetailsForAll ?? false,
        expandedPlots: form.expandedPlots ?? {},
      });
    }
  };


  // `onBack` prop to actually close the dialog.
  const handleBackClick = () => {
    if (flowStep !== 'form') {
      // return to the form view instead of closing the dialog
      setFlowStep('form');
      setSelectedPaymentMethod(null);
      // keep submittedForm so form values (including plotContacts) persist
      // keep payment dropdown state default
      setPaymentDropdownOpen(true);

      // Update saved state when going back to form, preserving all data
      if (data?._id && submittedForm) {
        saveDonationFormState(data._id, {
          ...submittedForm,
          userPickedAmount,
          selectedDaanTypeId,
          flowStep: 'form',
          selectedPaymentMethod: null,
          // Ensure all plot-related data is preserved
          selectedPlots: submittedForm.selectedPlots ?? [],
          plotContacts: submittedForm.plotContacts ?? {},
          sameDetailsForAll: submittedForm.sameDetailsForAll ?? false,
          expandedPlots: submittedForm.expandedPlots ?? {},
        });
      }
    } else {
      // Clear saved state when fully exiting
      if (data?._id) {
        clearDonationFormState(data._id);
      }
      onBack?.();
    }
  };
  // Listen for browser back (popstate) and trigger the same back handler
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state?.flowStep === 'selectPayment') {
        setFlowStep('selectPayment');
      } else {
        // If we are in payment and go back, switch to form
        if (flowStep === 'selectPayment') {
          setFlowStep('form');
          setSelectedPaymentMethod(null);
          setPaymentDropdownOpen(true);

          // Update saved state when going back to form
          if (data?._id && submittedForm) {
            saveDonationFormState(data._id, {
              ...submittedForm,
              userPickedAmount,
              selectedDaanTypeId,
              flowStep: 'form',
              selectedPaymentMethod: null,
              selectedPlots: submittedForm.selectedPlots ?? [],
              plotContacts: submittedForm.plotContacts ?? {},
              sameDetailsForAll: submittedForm.sameDetailsForAll ?? false,
              expandedPlots: submittedForm.expandedPlots ?? {},
            });
          }
        } else {
          // If we are in form and go back, the browser handles the navigation (e.g. to previous page)
          // We don't need to call onBack() here as it might trigger a double navigation
        }
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [flowStep, submittedForm, userPickedAmount, selectedDaanTypeId, data?._id]);

  // Fix history stack when restoring 'selectPayment' step (e.g. after login)
  useEffect(() => {
    if (flowStep === 'selectPayment') {
      // Check if current history state matches our flow step
      const currentState = window.history.state;
      if (currentState?.flowStep !== 'selectPayment') {
        // We likely just loaded this page with restored state.
        // Inject the 'form' step into history so 'Back' works correctly.

        // 1. Replace current entry with 'form' step
        window.history.replaceState({ flowStep: 'form' }, '');

        // 2. Push new entry for 'selectPayment' step
        window.history.pushState({ flowStep: 'selectPayment' }, '');
      }
    }
  }, []); // Run once on mount
  return (
    <div className="min-h-screen bg-[#FDFBFC] px-4 md:px-16 py-24  md:py-16 lg:py-10">
      <div className=" mx-auto relative">

        {/* Close button removed - using back button instead */}
        {/* Centered Site Title - removed since it's now in the main layout */}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{title}</h1>
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 ${isRashiDaan ? '' : 'lg:grid-cols-2'} gap-6 items-start`}>
          {/* Left: Image and Content Section - Hidden on mobile, visible on desktop. Hidden entirely for RashiDaan */}
          {!isRashiDaan && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="p-0 overflow-hidden">
                {/* First Image */}
                <div className="aspect-[4/2] w-full overflow-hidden">
                  <LazyLoadImage
                    className="w-full h-full object-cover"
                    alt={`${getDaanImageAlt(title)} 1`}
                    src={getDaanImages(title)[0]}
                    loading="lazy"
                  />
                </div>

                {/* Organization Info & About Section */}
                <div className="p-4">
                  <div className="mb-3">
                    <h2 className="text-[#AD2F16] textHeading  mb-1">
                      {data?.organization || t("donationPage.layout.organization")}
                    </h2>
                    <p className="text-[#1E1E1E80] textDescription flex items-center gap-1">
                      <span>📍</span>
                      {data?.location || t("donationPage.layout.location")}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-[#AD2F16] textHeading   mb-2">
                      {t("donationPage.layout.aboutTitle").replace("{{title}}", title)}
                    </h3>
                    <p className="text-[#1E1E1E80] textDescription leading-relaxed">
                      {data?.aboutDescription || data?.description ||
                        t("donationPage.layout.aboutDescription").replace("{{title}}", title)}
                    </p>
                  </div>
                </div>

                {/* Second Image */}
                <div className="aspect-[4/2] w-full overflow-hidden">
                  <LazyLoadImage
                    className="w-full h-full object-cover"
                    alt={`${getDaanImageAlt(title)} 2`}
                    src={getDaanImages(title)[1]}
                    loading="lazy"
                  />
                </div>

                {/* How it will help Section */}
                <div className="p-4">
                  <div>
                    <h4 className="text-[#AD2F16] textHeading  mb-2">{t("donationPage.layout.howItHelps")}</h4>
                    <p className="text-[#1E1E1E80] textDescription leading-relaxed">
                      {data?.helpDescription ||
                        t("donationPage.layout.helpDescription").replace("{{title}}", title)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Mobile: Image Section - Visible on mobile only */}
          <div className="block lg:hidden col-span-1">
            <Card className="p-0 overflow-hidden">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <LazyLoadImage
                  className="w-full h-full object-cover"
                  alt={getDaanImageAlt(title)}
                  src={getDaanImage(title)}
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <div className="mb-2">
                  <h2 className="text-[#AD2F16] textHeading font-semibold mb-1">
                    {data?.organization || t("donationPage.layout.organization")}
                  </h2>
                  <p className="text-[#1E1E1E80] textDescription">📍 {data?.location || t("donationPage.layout.location")}</p>
                </div>
                <div>
                  <h3 className="text-[#AD2F16] textHeading font-semibold mb-1">{t("donationPage.layout.aboutTitle").replace("{{title}}", title)}</h3>
                  <p className="text-[#1E1E1E80] textDescription  leading-relaxed line-clamp-3">
                    {data?.aboutDescription || data?.description ||
                      t("donationPage.layout.aboutDescription").replace("{{title}}", title)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Form and Summary Section */}
          <div className="col-span-1 lg:col-span-1 space-y-6">
            {/* Bhumi / Bhojan / Annadan concise render */}
            {flowStep === 'form' && (
              <>
                {isBhumi && <BhumiPreview />}
                {isBhojan && <BhojanList />}
                {isAnnadan && <AnnadanList />}
                {/* Form / Payment Selection / Payment Details Section */}

              </>
            )}

            {flowStep === 'form' && (
              <Card className="p-6">
                {data?.daanTypes?.length > 0 && (
                  <div className="space-y-1 mb-6">
                    <SectionTitle>{t("donationPage.form.selectDonationType")}</SectionTitle>
                  </div>
                )}
                {!shouldShowUserPaying.includes(title) && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("donationPage.form.donationAmount")}
                    </label>
                    <Input
                      // Use text + inputMode to avoid browser number-input quirks while still showing numeric keyboard
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={userPickedAmount}
                      onChange={ev => {
                        const raw = ev?.target?.value ?? "";
                        // Allow only digits while typing (you can expand to allow decimals if needed)
                        const sanitized = raw.replace(/[^0-9]/g, "");
                        setUserPickedAmount(sanitized);

                        // Save numeric value to session storage (as number) to keep rest of code working
                        if (data?._id) {
                          const currentState = getDonationFormState(data._id) || {};
                          saveDonationFormState(data._id, {
                            ...currentState,
                            userPickedAmount: sanitized ? Number(sanitized) : null,
                          });
                        }
                      }}
                      placeholder={t("donationPage.form.amountPlaceholder")}
                      className="my-2"
                    />
                  </>
                )}
                <DonationForm
                  category={dataWithPlots?.title ?? data?.title ?? "Daan Title"}
                  data={dataWithPlots}
                  handleSubmit={handleSubmit}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  onSubmit={onSubmit}
                  onAmountChange={handleAmountChange}
                  initialPlotContacts={submittedForm?.plotContacts ?? null}
                  initialSelectedPlots={submittedForm?.selectedPlots ?? []}
                  initialSameDetailsForAll={submittedForm?.sameDetailsForAll ?? false}
                  initialExpandedPlots={submittedForm?.expandedPlots ?? {}}
                  initialFormData={submittedForm}
                />
              </Card>
            )}

            {flowStep === 'selectPayment' && (
              <Card className="p-6">
                <p className="textHeading text-[#000000] font-secondaryFont">{t("donationPage.payment.paymentMode")}</p>
                <p className=" description text-[#1E1E1E80] mb-4 font-secondaryFont">{t("donationPage.payment.paymentModeDescription")}</p>

                <p className="textHeading font-secondaryFont mb-2 mt-2 text-[#1E1E1E80]">{t("donationPage.payment.selectPaymentMethod")}</p>
                {/* Dropdown-like selector that opens a list with left icons and right radios */}
                <div className="mt-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border bg-white">
                      <div className="flex items-center gap-3">
                        {selectedPaymentMethod && (
                          <div className="w-12 h-12 rounded-lg bg-[#AD2F16] flex items-center justify-center">

                            <img
                              src={(
                                {
                                  [t("donationPage.payment.cash")]: CashImage,
                                  [t("donationPage.payment.cheque")]: ChequeImage,
                                  [t("donationPage.payment.bankTransfer")]: Bank_transferImage,
                                  [t("donationPage.payment.card")]: CardImage,
                                  [t("donationPage.payment.upi")]: UpiImage,
                                  [t("donationPage.payment.emi")]: EmiImage,
                                } as Record<string, any>
                              )[selectedPaymentMethod]}
                              alt={selectedPaymentMethod}
                              className="w-6 h-6 object-contain"
                            />

                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-secondaryFont textDescription  text-[#1E1E1E80]">{selectedPaymentMethod ?? t("donationPage.payment.selectPaymentMethod")}</div>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-500 transform ${paymentDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 114.293 8.293l5-5A1 1 0 0110 3z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {paymentDropdownOpen && (
                      <div className="mt-2 bg-white border rounded-lg shadow-sm overflow-hidden">
                        {[
                          { label: t("donationPage.payment.cash"), img: CashImage, subtitle: t("donationPage.payment.cashSubtitle") },
                          { label: t("donationPage.payment.cheque"), img: ChequeImage, subtitle: t("donationPage.payment.chequeSubtitle") },
                          { label: t("donationPage.payment.bankTransfer"), img: Bank_transferImage, subtitle: t("donationPage.payment.bankTransferSubtitle") },
                          { label: t("donationPage.payment.card"), img: CardImage, subtitle: t("donationPage.payment.cardSubtitle") },
                          { label: t("donationPage.payment.upi"), img: UpiImage, subtitle: t("donationPage.payment.upiSubtitle") },
                          { label: t("donationPage.payment.emi"), img: EmiImage, subtitle: t("donationPage.payment.emiSubtitle") },
                        ].map((opt) => (
                          <label key={opt.label} className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 bg-[#AD2F16] rounded-lg flex items-center justify-center">
                                <img src={opt.img} alt={opt.label} className="w-6 h-6 object-contain" />
                              </div>
                              <div className="text-left">
                                <div className="font-secondaryFont textHeading text-[#000000]">{opt.label}</div>
                                <div className="font-secondaryFont textDescription text-[#1E1E1E80]">{opt.subtitle}</div>
                              </div>
                            </div>

                            <input
                              type="radio"
                              name="paymentMethod"
                              value={opt.label}
                              checked={selectedPaymentMethod === opt.label}
                              onChange={() => {
                                setSelectedPaymentMethod(opt.label);
                                setPaymentDropdownOpen(false);
                                // Save payment method selection
                                if (data?._id && submittedForm) {
                                  saveDonationFormState(data._id, {
                                    ...submittedForm,
                                    userPickedAmount,
                                    flowStep: 'selectPayment',
                                    selectedPaymentMethod: opt.label,
                                  });
                                }
                              }}
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Method-specific UI shown below the radio list */}
                <div className="mt-4">
                  {selectedPaymentMethod === t("donationPage.payment.cash") && (
                    <div className="space-y-4">
                      <div className="textDescription text-[#1E1E1E80] font-secondaryFont mt-2">{t("donationPage.paymentDetails.cashInstructions")}</div>

                      {/* Organization red card */}
                      <div className="rounded-xl p-6 bg-[#AD2F16]  shadow-md">
                        <h4 className="font-semibold textHeading font-secondaryFont text-[#FFFFFF] text-center">{data?.organization ?? t("donationPage.paymentDetails.organizationDetails")}</h4>

                        {/* decorative gold divider */}
                        <div className="mt-4 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                          <div>
                            <div className="text-[#FFFFFF] textDescription font-secondaryFont font-medium">{t("donationPage.paymentDetails.emailId")}</div>
                            <div className="text-[#FFFFFF80] textDescription font-secondaryFont font-semibold">smshstrust@gmail.com</div>
                          </div>
                          <div>
                            <div className="text-[#FFFFFF] textDescription font-secondaryFont font-medium">{t("donationPage.paymentDetails.contactNo")}</div>
                            <div className="text-[#FFFFFF80] textDescription font-secondaryFont font-semibold">+91 9352815982</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-medium">{t("donationPage.paymentDetails.addressLabel")}</div>

                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont font-semibold">203, Metro Tower, Ring Road
                            Surat, Gujarat 395002</div>

                        </div>
                      </div>


                      {/* Note to Devotees card */}
                      <div className="rounded-xl p-5 bg-white border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="text-center textHeading font-secondaryFont text-[#AD2F16] font-semibold">{t("donationPage.paymentDetails.noteToDevotees")}</h5>
                          </div>

                        </div>

                        <div className="mt-2 flex items-center justify-center mb-2">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>

                        <div className="mt-2">
                          <div className="font-semibold textDescription font-secondaryFont text-[#000000]">{t("donationPage.paymentDetails.disclaimer")}</div>

                          <p className="textDescription font-secondaryFont text-[#1E1E1E80] mt-2">{t("donationPage.paymentDetails.disclaimerText")}</p>

                          <p className="textDescription font-secondaryFont text-[#1E1E1E80] mt-2">{t("donationPage.paymentDetails.pleaseNote")}</p>

                          <ul className="list-disc list-inside textDescription font-secondaryFont text-[#1E1E1E80] mt-1 space-y-1">
                            <li>{t("donationPage.paymentDetails.disclaimerPoint1")}</li>
                            <li>{t("donationPage.paymentDetails.disclaimerPoint2")}</li>
                            <li>{t("donationPage.paymentDetails.disclaimerPoint3")}</li>
                            <li>{t("donationPage.paymentDetails.disclaimerPoint4")}</li>
                          </ul>

                          <p className="textDescription font-secondaryFont text-[#1E1E1E80] mt-3">{t("donationPage.paymentDetails.disclaimerClosing")}</p>
                        </div>
                      </div>

                      {/* Submit button */}
                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? t("donationPage.payment.processing") : t("donationPage.payment.submitRequest")}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === t("donationPage.payment.cheque") && (
                    <div className="space-y-4">
                      <div className="textDescription text-[#1E1E1E80] font-secondaryFont mt-2">{t("donationPage.paymentDetails.chequeInstructions")}</div>
                      <div className="w-full overflow-hidden rounded-md bg-[#FCFCFC] p-3">
                        {/* cheque image or placeholder */}
                        <div className=" w-full bg-white rounded-md overflow-hidden flex items-center justify-center">
                          <img src={ChequeExample} alt="cheque" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="rounded-lg p-4 bg-white border">
                        <h5 className=" textHeading font-primaryFont text-center text-[#AD2F16] font-semibold">{t("donationPage.paymentDetails.bankDetails")}</h5>
                        {/* decorative gold divider */}
                        <div className="mt-2 mb-2 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.bankName")}</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{'CANARA BANK'}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.accountNumber")}</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{'120034699934'}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.accountName")}</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{'SHREE MAHAKALESHWAR SALASAR HANUMAN SEV'}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont ">{t("donationPage.paymentDetails.ifscCode")}</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{"CNRB0001751"}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.branch")}</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{"SURAT RING ROAD SURAT, GUJARAT-395003"}</div>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? t("donationPage.payment.processing") : t("donationPage.payment.submitRequest")}
                        </button>
                      </div>
                    </div>
                  )}

                  {(selectedPaymentMethod === t("donationPage.payment.bankTransfer") || selectedPaymentMethod === t("donationPage.payment.card")) && (
                    <div className="space-y-4">
                      <div className="textDescription text-[#1E1E1E80] font-secondaryFont mt-2">{t("donationPage.paymentDetails.bankTransferInstructions")}</div>

                      <div className="rounded-lg p-4 bg-red-700 text-white">
                        <h4 className="text-[#FFFFFF] textHeading font-secondaryFont text-center">{data?.organization ?? t("donationPage.paymentDetails.organizationDetails")}</h4>
                        <div className="mt-2 mb-2 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.bankName")}</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{'CANARA BANK'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.accountNumber")}</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{'120034699934'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.accountName")}</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{'SHREE MAHAKALESHWAR SALASAR HANUMAN SEV'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.ifscCode")}</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{'CNRB0001751'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">{t("donationPage.paymentDetails.branch")}</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{'SURAT RING ROAD SURAT, GUJARAT-395003'}</div>
                        </div>
                      </div>

                      <div className="rounded-xl p-6 bg-[#FFFFF] text-white shadow-md">
                        <h4 className="font-semibold textHeading font-secondaryFont text-[#AD2F16] text-center">{data?.organization ?? t("donationPage.paymentDetails.organizationDetails")}</h4>

                        {/* decorative gold divider */}
                        <div className="mt-4 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-[#00000040] textDescription font-secondaryFont font-medium">{t("donationPage.paymentDetails.emailId")}</div>
                            <div className="text-[#333333] textDescription font-secondaryFont font-semibold">smshstrust@gmail.com</div>
                          </div>
                          <div>
                            <div className="text-[#00000040] textDescription font-secondaryFont font-medium">{t("donationPage.paymentDetails.contactNo")}</div>
                            <div className="text-[#333333] textDescription font-secondaryFont font-semibold">+91 9352815982</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-[#00000040] textDescription font-secondaryFont font-medium">{t("donationPage.paymentDetails.addressLabel")}</div>

                          <div className="text-[#333333] textDescription font-secondaryFont font-semibold">203, Metro Tower, Ring Road
                            Surat, Gujarat 395002</div>

                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? t("donationPage.payment.processing") : t("donationPage.payment.submitRequest")}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === t("donationPage.payment.upi") && (
                    <div className="space-y-4  border rounded-md overflow-hidden justify-center items-center ">
                      <div className="text-center textHeading text-[#8B0000] mt-4">{t("donationPage.paymentDetails.upiTitle")}</div>
                      <div className="mt-2 flex items-center justify-center mb-2 w-[80%] mx-auto">
                        <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        <div className="h-px bg-[#DAA520] w-full" />
                        <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                      </div>
                      <div className=" bg-white flex items-center justify-center ">
                        <img src={PaymentQrImage} alt="UPI QR" className="max-w-full max-h-full object-contain center" />

                      </div>

                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? t("donationPage.payment.processing") : t("donationPage.payment.submitRequest")}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === t("donationPage.payment.emi") && (
                    <div className="space-y-4 text-center">
                      <div className="py-6">
                        <img src={EmiRequestIMage} alt="EMI" className="mx-auto w-48 h-48 object-contain" />
                      </div>
                      <h4 className="textHeading text-[#8B0000] font-secondaryFont">{t("donationPage.paymentDetails.emiTitle")}</h4>
                      <p className="textDescription text-[#1E1E1E80] font-secondaryFont">{t("donationPage.paymentDetails.emiDescription")}</p>
                      <div>
                        <button className="mt-3 inline-flex items-center gap-3 px-5 py-3 rounded-lg border-[2px] border-[#AD2F16] text-[#AD2F16] shadow-sm bg-white">
                          <img src={WhatsAppIcon} alt="WhatsApp" className="w-5 h-5 object-contain" />
                          <span className="font-secondaryFont font-semibold">{t("donationPage.paymentDetails.whatsappButton")}</span>
                        </button>
                      </div>

                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full mt-2 rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? t("donationPage.payment.processing") : t("donationPage.payment.submitRequest")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </Card>
            )}

            {/* paymentDetails step removed - selection now submits directly from selectPayment */}

            {/* Summary Section */}

            <div className="space-y-2 lg:sticky lg:top-4">

              {flowStep === 'form' && (
                <>
                  <DonationCard
                    type={title}
                    data={data}
                    displayTotal={(data?.daanTypes ?? []).reduce((s: number, it: any) => s + (it?.amount ?? 0), 0)}
                    displayGrandTotal={Number(grandTotal) + (Number(userPickedAmount) || 0)}
                  />

                  <button
                    form="donationForm"
                    type="submit"
                    className={`mt-6 w-full rounded-xl py-4 text-base font-semibold text-white transition-colors 
                  ${isPending ? "bg-orange-500 cursor-not-allowed" : "bg-orange-700 hover:bg-orange-800"}`}>
                    {isPending
                      ? t("donationPage.payment.processing")
                      : t("donationPage.payment.choosePaymentMethod").replace("{{amount}}", finalPayingAmount !== 0 ? formatMoney(finalPayingAmount) : "")}
                  </button>
                </>
              )}




            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaudaanLayout;
