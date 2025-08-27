import React, {useState} from "react";
import DonationForm from "./DonationForm";
import GaudaanLayout from "./GaudaanLayout";

interface DaanContentProps {
  daanContent: any;
  handleSubmit: () => void;
}

const DaanContent: React.FC<DaanContentProps> = ({daanContent, handleSubmit}) => {
  const [totalAmount, setTotalAmount] = useState(0);

  const handleAmountChange = (amount: number) => {
    setTotalAmount(amount);
  };

  // Calculate CGST and SGST (9% each)
  const cgst = Math.round(totalAmount * 0.09);
  const sgst = Math.round(totalAmount * 0.09);

  return (
    <GaudaanLayout
      title={daanContent?.title ?? "Daan Title"}
      summary={{
        totalAmount,
        cgst,
        sgst,
        currency: "₹",
      }}
      data={daanContent}
      onContinue={handleSubmit}
      onBack={handleSubmit}>
      <DonationForm
        category={daanContent?.title ?? "Daan Title"}
        data={daanContent}
        onSubmit={handleSubmit}
        onAmountChange={handleAmountChange}
      />
    </GaudaanLayout>
  );
};

export default DaanContent;
