import { authTokenAxios } from './axios';

export const buyNow = async (payload: { prasadId: string | number; amount: number }) => {
  return authTokenAxios.post('/my-cart/buy-now', payload);
};
