import {getAllDaan, getDaanDetailsById} from "@/services/daan.service";
import {useQuery} from "@tanstack/react-query";

export const QueryKeys = {
  daan: "daan",
  getAllDaan: ["daan", "getAllDaan"],
  getDaanDetails: ["daan", "getDaanDetails"],
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
