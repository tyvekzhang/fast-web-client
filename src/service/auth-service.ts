import httpClient from '@/lib/http';
import { LoginRequest, Token } from '@/types/auth';

export function login(loginRequest: LoginRequest) {
  return httpClient.post<Token>('/user/login', loginRequest, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
