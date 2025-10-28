import { useMutation } from '@tanstack/react-query';
import { buyNow } from '@/services/buy-now.service';

export const useBuyNow = () => {
    return useMutation({
        mutationFn: buyNow,
    });
};
