import React, {useState} from "react";
import DonationCard from "./components/DonationCard";
import {Input} from "../ui/input";

type Summary = {
  totalAmount: number;
  cgst: number;
  sgst: number;
  currency?: string;
};

interface GaudaanLayoutProps {
  title?: string;
  onBack?: () => void;
  summary: Summary;
  onContinue: () => void;
  children?: React.ReactNode;
  data: any;
}

const formatMoney = (n: number | string, currency = "₹") =>
  `${currency} ${n.toLocaleString("en-IN")}`;

const BackIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const Card: React.FC<{className?: string; children: React.ReactNode}> = ({
  className = "",
  children,
}) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
);

const shouldShowUserPaying = ["Bhoomi Daan", "Bhojan Daan"];

const GaudaanLayout: React.FC<GaudaanLayoutProps> = ({
  title = "Bhojan daan",
  onBack,
  summary,
  onContinue,
  children,
  data,
}) => {
  const [userPickedAmount, setUserPickedAmount] = useState<string | undefined>();
  const currency = summary.currency ?? "₹";
  const grandTotal =
    summary.totalAmount === 0 ? data?.daanTypes?.[0]?.amount : summary?.totalAmount;
  const finalPayingAmount = Number(grandTotal) + (Number(userPickedAmount) || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              {children}
            </Card>
          </div>

          {/* Right: Summary Section */}
          <div className="lg:col-span-1 space-y-2">
            <DonationCard type={title} data={data} />
            <button
              onClick={onContinue}
              className="mt-6 w-full rounded-xl bg-orange-700 hover:bg-orange-800 py-4 text-white text-base font-semibold transition-colors">
              Continue {formatMoney(finalPayingAmount, currency)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaudaanLayout;
