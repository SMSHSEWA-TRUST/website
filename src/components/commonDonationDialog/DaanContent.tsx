import React from "react";
import GaudaanLayout from "./GaudaanLayout";
interface DaanContentProps {
  daanContent: any;
  handleBack: () => void;
}

const DaanContent: React.FC<DaanContentProps> = ({daanContent, handleBack}) => {
  return (
    <GaudaanLayout
      title={daanContent?.title ?? "Daan Title"}
      data={daanContent}
      onBack={handleBack}
    />
  );
};

export default DaanContent;
