import httpClient from '@/lib/http';

export const probeService = () => {
  return httpClient.get('/probe/liveness');
};
