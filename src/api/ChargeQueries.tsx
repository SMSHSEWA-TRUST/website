import { useQuery } from '@tanstack/react-query';
import { getPrasadCharge } from '@/services/charge.service';

export const ChargeQueryKeys = {
  prasadCharge: (prasadId: string | undefined) => ['charge', prasadId],
};

export const useGetPrasadCharge = (prasadId?: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ChargeQueryKeys.prasadCharge(prasadId),
    queryFn: () => getPrasadCharge(prasadId!),
    enabled: enabled && !!prasadId,
  });
};

export default {
  useGetPrasadCharge,
};