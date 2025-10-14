import { getAllSubscriptions, getMySubscriptions } from '@/services/subscription.service';
import { useQuery } from '@tanstack/react-query';

export const QueryKeys = {
    subscription: 'subscription',
    getAllSubscriptions: ['subscription', 'getAllSubscriptions'],
    getMySubscriptions: ['subscription', 'getMySubscriptions'],
};

export const useGetAllSubscriptions = () =>
    useQuery({
        queryKey: QueryKeys.getAllSubscriptions,
        // getAllSubscriptions returns the axios promise; the query will resolve with that value
        queryFn: getAllSubscriptions,
    });

export const useGetMySubscriptions = (page: number = 1, limit: number = 10) =>
    useQuery({
        queryKey: [...QueryKeys.getMySubscriptions, page, limit],
        queryFn: () => getMySubscriptions(page, limit),
    });

export default useGetAllSubscriptions;
