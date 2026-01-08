import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelPrasadById, getPrasad, getPrasadById, PrasadResponse, SinglePrasadResponse } from "@/services/prasad.service";
import { getPrasadByTag } from "@/services/prasad.service";


export const QueryKeys = {
    prasad: "prasad",
    getPrasad: ["prasad", "getPrasad"],
    getPrasadById: (id: string) => ["prasad", "getPrasadById", id],
    getPrasadByTag: (tag: string) => ["prasad", "getPrasadByTag", tag],
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

export const useGetPrasadByTag = (tag: string, enabled: boolean = true) =>
    useQuery<PrasadResponse>({
        queryKey: QueryKeys.getPrasadByTag(tag),
        queryFn: () => getPrasadByTag(tag),
        enabled: enabled && !!tag,
    });

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["prasad", "cancel"],
        mutationFn: (payload: any) => cancelPrasadById(payload._id),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["prasadOrderHistory"] });
        }
    });
}