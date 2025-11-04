import { getFeature } from "@/services/feature.service";
import { useQuery } from "@tanstack/react-query";

export const QueryKeys = {
    feature: "feature",
    getFeature: ["feature", "getFeature"],
};

export const useGetFeature = () =>
    useQuery({
        queryKey: QueryKeys.getFeature,
        queryFn: getFeature,
    });