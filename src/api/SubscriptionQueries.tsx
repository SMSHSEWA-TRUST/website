import { getAllSubscriptions } from '@/services/subscription.service';
import { useQuery } from '@tanstack/react-query';

export const QueryKeys = {
    subscription: 'subscription',
    getAllSubscriptions: ['subscription', 'getAllSubscriptions'],
};

export const useGetAllSubscriptions = () =>
    useQuery({
        queryKey: QueryKeys.getAllSubscriptions,
        // getAllSubscriptions returns the axios promise; the query will resolve with that value
        queryFn: getAllSubscriptions,
    });

export default useGetAllSubscriptions;
