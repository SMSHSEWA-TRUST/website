import { getTeam } from "@/services/team.service";
import { useQuery } from "@tanstack/react-query";

export const QueryKeys = {
    team: "team",
    getTeam: ["team", "getTeam"],
};

export const useGetTeam = () =>
    useQuery({
        queryKey: QueryKeys.getTeam,
        queryFn: getTeam,
    });