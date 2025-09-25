import React, { useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import lineImage from '@/assets/images/line.png';
import { useI18n } from '@/lib/i18n';
import DonationCard from "./components/DonationCard";
import { Input } from "../ui/input";
import DonationForm from "./DonationForm";
import Card from "./components/Card";
import BackIcon from "./components/BackIcon";
import { formatMoney, SectionTitle, getDaanImages, getDaanImage, getDaanImageAlt } from "./components/Utils";
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
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? (JSON.parse(storedUser) as userProps) : null;
  const { t } = useI18n();

  const DefaultValues = {
    donationDocId: data?.daanTypes?.[0]?._id ?? "",
    name: user?.name ?? "",
    fatherName: "",
    motherName: "",
    phoneNumber: user?.phone ?? "",
    email: user?.email ?? "",
    address: "",
    amount: data?.daanTypes?.[0]?.amount ?? 0,
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
  const [userPickedAmount, setUserPickedAmount] = useState<any>();
  const [selectedDaanTypeId, setSelectedDaanTypeId] = useState<string | null>(DefaultValues.donationDocId || null);
  const { mutate, isPending } = usePurchaseReqestSubmission();
  // New flow states: form -> selectPayment -> paymentDetails
  const [flowStep, setFlowStep] = useState<'form' | 'selectPayment' | 'paymentDetails'>('form');
  const [submittedForm, setSubmittedForm] = useState<any | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState<boolean>(true);
  const grandTotal = watch("amount");
  const finalPayingAmount = Number(grandTotal) + (Number(userPickedAmount) || 0);
  const bhumiAmount = data?.daanTypes?.[0]?.amount ?? 125000;
  const bhumiLabel = data?.plotSizeLabel ?? "1 Sq. Ft Land";
  const bhumiDescription = data?.shortDescription ?? "सने भूमि दान दी, उसने आने वाली पीढ़ियों को संजीवनी दी";

  const handleAmountChange = (amount: number) => {
    setValue("amount", amount);
  };

  // Helper flags for which UI to show
  const isBhumi = title === "Bhumi Daan" || data?.title === "Bhumi Daan";
  const isBhojan = title === "Bhojan Daan" || data?.title === "Bhojan Daan";
  const isAnnadan = title === "Annadan" || title === "Anndaan" || data?.title === "Annadan" || data?.title === "Anndaan";
  const isRashiDaan = (title || data?.title || '').toLowerCase().includes('rashi');

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
                    setValue('amount', it.amount ?? 0);
                    setUserPickedAmount(null);
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
      paymentMethod: selectedPaymentMethod || undefined,
      ...(formdata.plotIds?.length > 0 && {
        // Send as an array (not a JSON string) so backend receives proper ObjectId array
        plotIds: formdata.plotIds,
      }),
    };
    mutate(payload, {
      onSuccess: () => {
        reset(DefaultValues);
        setUserPickedAmount(null);
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
    } else {
      onBack?.();
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto relative">



        <button
          onClick={() => onBack?.()}
          aria-label="Close"
          className="absolute right-0 top-[-15px] z-50 inline-flex items-center justify-center w-9 h-9 rounded-md bg-white shadow hover:bg-gray-100 text-gray-700 transition">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Centered Site Title (same as top header) - show inside dialog */}
        <div className="flex flex-col items-center flex-1 mb-4">
          <h1 className="font-primaryFont text-center mb-2 text-[34px] font-normal text-[#4c291e] [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#8b0000] leading-tight">
            {t('header.title')}
          </h1>

          {/* Decorative Line */}
          <div className="relative mb-2 mt-2 w-full">
            <div className="relative w-full max-w-4xl h-3 mx-auto">
              <LazyLoadImage
                className="w-full h-3 object-cover"
                alt="Decorative Line"
                src={lineImage}
                loading="lazy"
              />
              <div className="absolute w-3 h-3 top-0 left-1/2 transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-2 h-2 top-0.5 left-[calc(50%+12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-2 h-2 top-0.5 left-[calc(50%-12px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%+24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-1.5 h-1.5 top-1 left-[calc(50%-24px)] transform -translate-x-1/2 bg-secondaryColor rounded-full" />
              <div className="absolute w-3 h-3 top-0 left-0 bg-secondaryColor rounded-full" />
              <div className="absolute w-3 h-3 top-0 right-0 bg-secondaryColor rounded-full" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <button
              onClick={handleBackClick}
              aria-label="Back"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 transition">
              <BackIcon />
            </button>
          )}
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
                      {data?.organization || "Shri Mahakaleshwar Salasar Hanuman Seva Mandir"}
                    </h2>
                    <p className="text-[#1E1E1E80] textDescription flex items-center gap-1">
                      <span>📍</span>
                      {data?.location || "Surat, Gujarat"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-[#AD2F16] textHeading   mb-2">
                      About {title}
                    </h3>
                    <p className="text-[#1E1E1E80] textDescription leading-relaxed">
                      {data?.aboutDescription || data?.description ||
                        `${title} is a sacred form of donation that helps support the temple's mission and serves the community. Your contribution will make a meaningful difference in maintaining and expanding our spiritual services.`}
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
                    <h4 className="text-[#AD2F16] textHeading  mb-2">How it will help?</h4>
                    <p className="text-[#1E1E1E80] textDescription leading-relaxed">
                      {data?.helpDescription ||
                        `Your ${title} contribution will directly support temple maintenance, community services, and spiritual programs that benefit thousands of devotees.`}
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
                    {data?.organization || "Shri Mahakaleshwar Salasar Hanuman Seva Mandir"}
                  </h2>
                  <p className="text-[#1E1E1E80] textDescription">📍 {data?.location || "Surat, Gujarat"}</p>
                </div>
                <div>
                  <h3 className="text-[#AD2F16] textHeading font-semibold mb-1">About {title}</h3>
                  <p className="text-[#1E1E1E80] textDescription  leading-relaxed line-clamp-3">
                    {data?.aboutDescription || data?.description ||
                      `${title} is a sacred form of donation that helps support the temple's mission and serves the community.`}
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
                    <SectionTitle>Select the type of दान you want to donate to</SectionTitle>
                  </div>
                )}
                {!shouldShowUserPaying.includes(title) && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donation Amount
                    </label>
                    <Input
                      value={userPickedAmount}
                      onChange={amount => {
                        setUserPickedAmount(amount?.target?.value);
                      }}
                      type="number"
                      placeholder="Enter Donation Amount e.g 10000"
                      className="my-2"
                    />
                  </>
                )}
                <DonationForm
                  category={data?.title ?? "Daan Title"}
                  data={data}
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
                />
              </Card>
            )}

            {flowStep === 'selectPayment' && (
              <Card className="p-6">
                <p className="textHeading text-[#000000] font-secondaryFont">Payment Mode</p>
                <p className=" description text-[#1E1E1E80] mb-4 font-secondaryFont">Enter Name on whose behalf you want to donate and their Details</p>

                <p className="textHeading font-secondaryFont mb-2 mt-2 text-[#1E1E1E80]">Select Payment Method</p>
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
                                  Cash: CashImage,
                                  Cheque: ChequeImage,
                                  'Direct Bank Transfer': Bank_transferImage,
                                  'Credit/Debit Card': CardImage,
                                  UPI: UpiImage,
                                  'EMI (Easy Monthly Installments)': EmiImage,
                                } as Record<string, any>
                              )[selectedPaymentMethod]}
                              alt={selectedPaymentMethod}
                              className="w-6 h-6 object-contain"
                            />

                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-secondaryFont textDescription  text-[#1E1E1E80]">{selectedPaymentMethod ?? 'Select Payment Method'}</div>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-500 transform ${paymentDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 114.293 8.293l5-5A1 1 0 0110 3z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {paymentDropdownOpen && (
                      <div className="mt-2 bg-white border rounded-lg shadow-sm overflow-hidden">
                        {[
                          { label: 'Cash', img: CashImage, subtitle: 'Visit Our Temple office to submit the cash' },
                          { label: 'Cheque', img: ChequeImage, subtitle: 'Write a cheque in favour of our trust' },
                          { label: 'Direct Bank Transfer', img: Bank_transferImage, subtitle: 'Directly transfer the amount to our trust\'s bank' },
                          { label: 'Credit/Debit Card', img: CardImage, subtitle: 'Directly transfer the amount to our trust\'s bank' },
                          { label: 'UPI', img: UpiImage, subtitle: 'Pay via Google Pay, Phonepe, Paytm, Bhim' },
                          { label: 'EMI (Easy Monthly Installments)', img: EmiImage, subtitle: 'Pay Small amounts in monthly instalments' },
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
                              onChange={() => { setSelectedPaymentMethod(opt.label); setPaymentDropdownOpen(false); }}
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
                  {selectedPaymentMethod === 'Cash' && (
                    <div className="space-y-4">
                      <div className="textDescription text-[#1E1E1E80] font-secondaryFont mt-2">Kindly Visit our office and submit it </div>

                      {/* Organization red card */}
                      <div className="rounded-xl p-6 bg-[#AD2F16]  shadow-md">
                        <h4 className="font-semibold textHeading font-secondaryFont text-[#FFFFFF] text-center">{data?.organization ?? 'Shri Mahakaleshwar Salasar Hanuman Seva Trust, Surat, Gujarat'}</h4>

                        {/* decorative gold divider */}
                        <div className="mt-4 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                          <div>
                            <div className="text-[#FFFFFF] textDescription font-secondaryFont font-medium">Email ID</div>
                            <div className="text-[#FFFFFF80] textDescription font-secondaryFont font-semibold">smshstrust@gmail.com</div>
                          </div>
                          <div>
                            <div className="text-[#FFFFFF] textDescription font-secondaryFont font-medium">Contact No.</div>
                            <div className="text-[#FFFFFF80] textDescription font-secondaryFont font-semibold">+91 9352815982</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-medium">Address</div>

                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont font-semibold">203, Metro Tower, Ring Road
                            Surat, Gujarat 395002</div>

                        </div>
                      </div>


                      {/* Note to Devotees card */}
                      <div className="rounded-xl p-5 bg-white border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="text-center textHeading font-secondaryFont text-[#AD2F16] font-semibold">Note to Devotees</h5>
                          </div>

                        </div>

                        <div className="mt-2 flex items-center justify-center mb-2">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>
                        <div className="mt-2">
                          <div className="font-semibold textDescription font-secondaryFont text-[#000000]">Disclaimer:</div>
                          <p className="textDescription font-secondaryFont text-[#1E1E1E80]">{data?.cashDisclaimer ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}</p>
                        </div>
                      </div>

                      {/* Submit button */}
                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? 'Processing...' : 'Submit Request'}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'Cheque' && (
                    <div className="space-y-4">
                      <div className="textDescription text-[#1E1E1E80] font-secondaryFont mt-2">Fill the cheque and kindly reach our office for further process</div>
                      <div className="w-full overflow-hidden rounded-md bg-[#FCFCFC] p-3">
                        {/* cheque image or placeholder */}
                        <div className=" w-full bg-white rounded-md overflow-hidden flex items-center justify-center">
                          <img src={ChequeExample} alt="cheque" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="rounded-lg p-4 bg-white border">
                        <h5 className=" textHeading font-primaryFont text-center text-[#AD2F16] font-semibold">Our Bank Details</h5>
                        {/* decorative gold divider */}
                        <div className="mt-2 mb-2 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">Bank Name</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.name ?? 'HDFC Bank'}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">Account Number</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.accountNumber ?? '0123456789'}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">Account Name</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.accountName ?? 'SMSH SEWA TRUST'}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont ">IFSC Code</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.ifsc ?? '0123456789'}</div>
                          <div className="text-[#1E1E1E80] textDescription font-secondaryFont">Branch</div>
                          <div className="text-[#AD2F16] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.branch ?? 'Surat Main road'}</div>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? 'Processing...' : 'Submit Request'}
                        </button>
                      </div>
                    </div>
                  )}

                  {(selectedPaymentMethod === 'Direct Bank Transfer' || selectedPaymentMethod === 'Credit/Debit Card') && (
                    <div className="space-y-4">
                      <div className="textDescription text-[#1E1E1E80] font-secondaryFont mt-2">Kindly transfer the amount to our Bank account</div>

                      <div className="rounded-lg p-4 bg-red-700 text-white">
                        <h4 className="text-[#FFFFFF] textHeading font-secondaryFont text-center">{data?.organization ?? 'Shri Mahakaleshwar Salasar Hanuman Seva Trust, Surat, Gujarat'}</h4>
                        <div className="mt-2 mb-2 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">Bank Name</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.name ?? 'HDFC Bank'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">Account Number</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.accountNumber ?? '0123456789'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">Account Name</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.accountName ?? 'SMSH SEWA TRUST'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">IFSC Code</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.ifsc ?? '0123456789'}</div>
                          <div className="text-[#FFFFFF80] textDescription font-secondaryFont">Branch</div>
                          <div className="text-[#FFFFFF] textDescription font-secondaryFont font-semibold text-right">{data?.bank?.branch ?? 'Surat Main road'}</div>
                        </div>
                      </div>

                      <div className="rounded-xl p-6 bg-[#FFFFF] text-white shadow-md">
                        <h4 className="font-semibold textHeading font-secondaryFont text-[#AD2F16] text-center">{data?.organization ?? 'Shri Mahakaleshwar Salasar Hanuman Seva Trust, Surat, Gujarat'}</h4>

                        {/* decorative gold divider */}
                        <div className="mt-4 flex items-center justify-center ">
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                          <div className="h-px bg-[#DAA520] w-full" />
                          <span className="w-2 h-2 bg-[#DAA520] rounded-full" />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-[#00000040] textDescription font-secondaryFont font-medium">Email ID</div>
                            <div className="text-[#333333] textDescription font-secondaryFont font-semibold">smshstrust@gmail.com</div>
                          </div>
                          <div>
                            <div className="text-[#00000040] textDescription font-secondaryFont font-medium">Contact No.</div>
                            <div className="text-[#333333] textDescription font-secondaryFont font-semibold">+91 9352815982</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-[#00000040] textDescription font-secondaryFont font-medium">Address</div>

                          <div className="text-[#333333] textDescription font-secondaryFont font-semibold">203, Metro Tower, Ring Road
                            Surat, Gujarat 395002</div>

                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? 'Processing...' : 'Submit Request'}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'UPI' && (
                    <div className="space-y-4  border rounded-md overflow-hidden justify-center items-center ">
                      <div className="text-center textHeading text-[#8B0000] mt-4">Scan to Pay</div>
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
                          {isPending ? 'Processing...' : 'Submit Request'}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'EMI (Easy Monthly Installments)' && (
                    <div className="space-y-4 text-center">
                      <div className="py-6">
                        <img src={EmiRequestIMage} alt="EMI" className="mx-auto w-48 h-48 object-contain" />
                      </div>
                      <h4 className="textHeading text-[#8B0000] font-secondaryFont">Thank you for your Interest</h4>
                      <p className="textDescription text-[#1E1E1E80] font-secondaryFont">Please sit tight, our team will contact you shortly to help you further</p>
                      <div>
                        <button className="mt-3 inline-flex items-center gap-3 px-5 py-3 rounded-lg border-[2px] border-[#AD2F16] text-[#AD2F16] shadow-sm bg-white">
                          <img src={WhatsAppIcon} alt="WhatsApp" className="w-5 h-5 object-contain" />
                          <span className="font-secondaryFont font-semibold">Send 'Hi' to our Whatsapp</span>
                        </button>
                      </div>

                      <div>
                        <button
                          onClick={() => submittedForm && handleMutate(submittedForm)}
                          disabled={!selectedPaymentMethod || isPending}
                          className={`w-full mt-2 rounded-xl py-3 text-base font-semibold text-white ${(!selectedPaymentMethod || isPending) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#AD2F16] hover:bg-[#AD2F16]/80'}`}>
                          {isPending ? 'Processing...' : 'Submit Request'}
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
                      ? "Processing..."
                      : `Chose Payment Method: ${finalPayingAmount !== 0 ? formatMoney(finalPayingAmount) : ""}`}
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
