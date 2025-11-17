import {
  getAllDaan,
  getDaanDetailsById,
  getPlots,
  PurchaseDaanRequest,
  getMyDonations,
} from "@/services/daan.service";
import { PurchaseRequestPayloadTypes, DonationApiResponse } from "@/services/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const QueryKeys = {
  daan: "daan",
  getAllDaan: ["daan", "getAllDaan"],
  getDaanDetails: ["daan", "getDaanDetails"],
  getPlots: ["daan", "getPlots"],
  purchaseDaanRequest: ["daan", "purchaseDaanRequest"],
  getMyDonations: ["daan", "getMyDonations"],
};

export const useGetAllDaan = () =>
  useQuery({
    queryKey: QueryKeys.getAllDaan,
    queryFn: getAllDaan,
  });

export const useDaanDetailsByDocId = (daanDocId: string) =>
  useQuery({
    queryKey: [...QueryKeys.getDaanDetails, daanDocId],
    queryFn: () => getDaanDetailsById(daanDocId),
    enabled: !!daanDocId,
  });

export const usePlotsData = (enabled: boolean) =>
  useQuery({
    queryKey: QueryKeys.getPlots,
    queryFn: getPlots,
    enabled,
  });

export const usePurchaseReqestSubmission = () =>
  useMutation({
    mutationKey: QueryKeys.purchaseDaanRequest,
    mutationFn: (payload: PurchaseRequestPayloadTypes) => PurchaseDaanRequest(payload),
  });

export const useGetMyDonations = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: [...QueryKeys.getMyDonations, page, limit],
    queryFn: () => getMyDonations(page, limit),
  });

