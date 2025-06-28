import httpClient from '@/lib/http';

export function fetchAllDictData() {
  return httpClient.get<Record<number, any>>('/v1/dict-data/all');
}
