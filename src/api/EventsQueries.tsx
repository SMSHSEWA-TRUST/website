import { useQuery } from "@tanstack/react-query";
import { getEvents, getLiveEvents, getPujaEvents } from "@/services/events.service";

export const QueryKeys = {
    events: "events",
    getEvents: ["events", "getEvents"],
};

export const useGetEvents = (templeType?: string, todayDate?: string | Date, includeDate: boolean = true) =>
    useQuery({
        queryKey: [...QueryKeys.getEvents, templeType, todayDate, includeDate],
        queryFn: () => getEvents(templeType, todayDate, includeDate),
    });

// Hook for live section events - only schedulePlace parameter
export const useGetLiveEvents = (templeType?: string) =>
    useQuery({
        queryKey: [...QueryKeys.getEvents, "live", templeType],
        queryFn: () => getLiveEvents(templeType),
    });

// Hook for puja booking events - includes todayDate parameter
export const useGetPujaEvents = (selectedDate?: string | Date, templeType?: string) =>
    useQuery({
        queryKey: [...QueryKeys.getEvents, "puja", templeType, selectedDate],
        queryFn: () => getPujaEvents(selectedDate, templeType),
    });
