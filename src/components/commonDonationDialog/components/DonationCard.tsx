import React from "react";
import { useI18n } from "@/lib/i18n";

type selectedOptionTypes = {
  _id: string;
  name: string;
  amount: number;
};

type DataType = {
  daanTypes?: selectedOptionTypes[];
  [key: string]: any;
};

type DonationCardProps = {
  selectedOption?: selectedOptionTypes;
  type: string;
  data: DataType;
  // optional overrides so parent can pass live totals (from form watch or user input)
  displayTotal?: number;
  displayGrandTotal?: number;
};

export const donationOptions = [
  { id: "1-day", label: "1 Day Bhojandaan", price: 20000 },
  { id: "3-day", label: "3 Day Bhojandaan", price: 60000 },
  { id: "1-week", label: "1 Week Bhojandaan", price: 140000 },
  { id: "1-month", label: "1 Month Bhojandaan", price: 600000 },
];

const DonationCard: React.FC<DonationCardProps> = ({ data, displayTotal, displayGrandTotal }) => {
  const { t } = useI18n();
  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

  const computedTotal = (data?.daanTypes ?? []).reduce((sum, item) => sum + (item?.amount ?? 0), 0);


  // data may already contain grandTotal or additionalFee; prefer parent override `displayGrandTotal` for live updates
  const grandTotal = typeof displayGrandTotal === "number"
    ? displayGrandTotal
    : (data?.grandTotal ?? computedTotal + (data?.additionalFee ?? 0));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm max-h-fit">
      <h3 className="text-[#AD2F16] text-lg font-medium mb-3">{t("donationPage.summary.totalAmountToBePaid")}</h3>

      <div className=" rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>{t("donationPage.summary.totalAmount")}</span>
          <span className="font-medium text-gray-800">{formatPrice(grandTotal)}</span>
        </div>

        <div className="h-0.5 bg-yellow-300 my-2 rounded" />

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-[#000000] font-bold">{t("donationPage.summary.grandTotal")}</span>
          <span className="text-[#000000] font-bold text-lg">{formatPrice(grandTotal)}</span>
        </div>
      </div>


    </div>
  );
};

export default DonationCard;
