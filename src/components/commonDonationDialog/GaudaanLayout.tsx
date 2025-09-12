import React, { useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import lineImage from '@/assets/images/line.png';
import { useI18n } from '@/lib/i18n';
import DonationCard from "./components/DonationCard";
import { Input } from "../ui/input";
import DonationForm from "./DonationForm";
import Card from "./components/Card";
import BackIcon from "./components/BackIcon";
import { formatMoney, SectionTitle } from "./components/Utils";
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
  const { mutate, isPending } = usePurchaseReqestSubmission();
  const grandTotal = watch("amount");
  const finalPayingAmount = Number(grandTotal) + (Number(userPickedAmount) || 0);

  const handleAmountChange = (amount: number) => {
    setValue("amount", amount);
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
        plotIds: JSON.stringify(formdata.plotIds),
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
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Form Section */}
          <div className="lg:col-span-2">
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
          </div>

          {/* Right: Summary Section */}
          <div className="lg:col-span-1 space-y-2 sticky top-4">
            <DonationCard type={title} data={data} />
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
  );
};

export default GaudaanLayout;
