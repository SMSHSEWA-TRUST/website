import { useQuery } from "@tanstack/react-query";
import { getPooja, getPoojaById, PoojaResponse, SinglePoojaResponse } from "@/services/pooja.service";

export const QueryKeys = {
    pooja: "pooja",
    getPooja: ["pooja", "getPooja"],
    getPoojaById: (id: string) => ["pooja", "getPoojaById", id],
};

export const useGetPooja = () =>
    useQuery<PoojaResponse>({
        queryKey: QueryKeys.getPooja,
        queryFn: () => getPooja(),
    });

export const useGetPoojaById = (poojaId: string, enabled: boolean = true) =>
    useQuery<SinglePoojaResponse>({
        queryKey: QueryKeys.getPoojaById(poojaId),
        queryFn: () => getPoojaById(poojaId),
        enabled: enabled && !!poojaId, // Only fetch when enabled and poojaId exists
    });
