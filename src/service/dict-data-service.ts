import httpClient from '@/lib/http';

export function fetchAllDictData() {
  return httpClient.get<Record<number, any>>('/dict-data/all');
}
