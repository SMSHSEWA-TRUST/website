import {
  getAllDaan,
  getDaanDetailsById,
  getPlots,
  PurchaseDaanRequest,
} from "@/services/daan.service";
import {PurchaseRequestPayloadTypes} from "@/services/types";
import {useMutation, useQuery} from "@tanstack/react-query";

export const QueryKeys = {
  daan: "daan",
  getAllDaan: ["daan", "getAllDaan"],
  getDaanDetails: ["daan", "getDaanDetails"],
  getPlots: ["daan", "getPlots"],
  purchaseDaanRequest: ["daan", "purchaseDaanRequest"],
};

export const useGetAllDaan = () =>
  useQuery({
    queryKey: QueryKeys.getAllDaan,
    queryFn: getAllDaan,
  });

export const useDaanDetailsByDocId = (daanDocId: string) =>
  useQuery({
    queryKey: QueryKeys.getDaanDetails,
    queryFn: () => getDaanDetailsById(daanDocId),
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
