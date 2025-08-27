import React from "react";
import DialogRootContainer from "./components/DialogRootContainer";
import {useDaanDetailsByDocId} from "@/api/DaanQueries";
import DaanContent from "./DaanContent";

type Props = {
  selectedCategory: {
    _id: string;
    title: string;
    description: string;
    [key: string]: any;
  };
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DialogTypesForDonation = {
  BHUDAAN: "Bhumi Daan",
  GAUDAAN: "Gaudaan",
  BHOJANDAAN: "Bhojandaan",
  ANNDAAN: "Anndaan",
  RAASHIDAAN: "Raashidaan",
};
type DonationKey = keyof typeof DialogTypesForDonation;

const CommonDonationDialog: React.FC<Props> = ({selectedCategory, setOpenDialog}) => {
  const {data, isFetching} = useDaanDetailsByDocId(selectedCategory._id);
  const key = selectedCategory?.title?.toUpperCase() as DonationKey;
  const DialogType = DialogTypesForDonation[key];

  const renderComponent = () => {
    switch (DialogType) {
      default:
        return (
          <DaanContent
            daanContent={data?.data}
            handleBack={() => {
              setOpenDialog(false);
            }}
          />
        );
    }
  };
  if (isFetching) return null;
  return (
    <DialogRootContainer
      onClose={() => {
        setOpenDialog(false);
      }}>
      {renderComponent()}
    </DialogRootContainer>
  );
};

export default CommonDonationDialog;
