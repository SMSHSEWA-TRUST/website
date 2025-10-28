import { useQuery } from "@tanstack/react-query";
import { getPrasad, getPrasadById, PrasadResponse, SinglePrasadResponse } from "@/services/prasad.service";

export const QueryKeys = {
    prasad: "prasad",
    getPrasad: ["prasad", "getPrasad"],
    getPrasadById: (id: string) => ["prasad", "getPrasadById", id],
};

export const useGetPrasad = () =>
    useQuery<PrasadResponse>({
        queryKey: QueryKeys.getPrasad,
        queryFn: () => getPrasad(),
    });

export const useGetPrasadById = (prasadId: string, enabled: boolean = true) =>
    useQuery<SinglePrasadResponse>({
        queryKey: QueryKeys.getPrasadById(prasadId),
        queryFn: () => getPrasadById(prasadId),
        enabled: enabled && !!prasadId, // Only fetch when enabled and prasadId exists
    });
