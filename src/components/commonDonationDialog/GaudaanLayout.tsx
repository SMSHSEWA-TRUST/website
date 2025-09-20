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

type userProps = {
  name: string;
  phone: string;
  email: string;
};

interface GaudaanLayoutProps {
  title?: string;
  onBack: () => void;
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
  const grandTotal = watch("amount");
  const finalPayingAmount = Number(grandTotal) + (Number(userPickedAmount) || 0);
  const bhumiAmount = data?.daanTypes?.[0]?.amount ?? 125000;
  const bhumiLabel = data?.plotSizeLabel ?? "1 Sq. Ft Land";
  const bhumiDescription = data?.shortDescription ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt";

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
            <div className="mt-4 bg-white/10 rounded-md px-3 py-2 text-xs text-white/90">{data?.shortDescription ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'}</div>
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
            <div className="mt-4 bg-white/10 rounded-md px-3 py-2 text-xs text-white/90">{data?.shortDescription ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'}</div>
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
      ...(formdata.plotIds?.length > 0 && {
        // Send as an array (not a JSON string) so backend receives proper ObjectId array
        plotIds: formdata.plotIds,
      }),
    };
    mutate(payload, {
      onSuccess: () => {
        reset(DefaultValues);
        setUserPickedAmount(null);
        onBack();
      },
    });
  };
  const onSubmit = (data: any) => {
    if (finalPayingAmount === 0 && !shouldShowUserPaying.includes(data?.title))
      return toast.error("Amount (Daan) should not be 0");
    handleMutate(data);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto relative">



        <button
          onClick={onBack}
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
              onClick={onBack}
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
            {isBhumi && <BhumiPreview />}
            {isBhojan && <BhojanList />}
            {isAnnadan && <AnnadanList />}
            {/* Form Section */}
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
              />
            </Card>

            {/* Summary Section */}
            <div className="space-y-2 lg:sticky lg:top-4">
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
                  : `Continue ${finalPayingAmount !== 0 ? formatMoney(finalPayingAmount) : ""}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaudaanLayout;
