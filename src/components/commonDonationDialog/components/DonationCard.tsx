import clsx from "clsx";
import React from "react";

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
};

export const donationOptions = [
  {id: "1-day", label: "1 Day Bhojandaan", price: 20000},
  {id: "3-day", label: "3 Day Bhojandaan", price: 60000},
  {id: "1-week", label: "1 Week Bhojandaan", price: 140000},
  {id: "1-month", label: "1 Month Bhojandaan", price: 600000},
];

const DonationCard: React.FC<DonationCardProps> = ({data}) => {
  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 text-white max-w-md max-h-fit">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          {data?.daanTypes?.map((selectedOption: selectedOptionTypes) => (
            <div key={selectedOption._id} className="flex items-center space-x-2">
              <span className="text-white">✦</span>
              <span className="text-sm">{selectedOption.name}</span>
              <span className="ml-auto text-sm">{formatPrice(selectedOption.amount)}</span>
            </div>
          ))}
        </div>
      </div>
      <p
        className={clsx(
          "text-sm text-orange-100 opacity-90",
          (data?.daanTypes?.length ?? 0) > 0 && "mt-2"
        )}>
        {data?.description ?? "Description"}
      </p>
    </div>
  );
};

export default DonationCard;
