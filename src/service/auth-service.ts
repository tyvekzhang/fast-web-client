import { LoginRequest, Token } from "@/types/auth";
import httpClient from "@/lib/http";

export function login(loginRequest: LoginRequest) {
  return httpClient.post<Token>('/v1/user/login', loginRequest, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}