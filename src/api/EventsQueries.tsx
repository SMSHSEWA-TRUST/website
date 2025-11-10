import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/services/events.service";

export const QueryKeys = {
    events: "events",
    getEvents: ["events", "getEvents"],
};

export const useGetEvents = (templeType?: string, todayDate?: string) =>
    useQuery({
        queryKey: [...QueryKeys.getEvents, templeType, todayDate],
        queryFn: () => getEvents(templeType),
    });
