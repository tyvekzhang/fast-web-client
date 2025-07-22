import httpClient from '@/lib/http';
import { OAuth2PasswordRequestForm, UserCredential } from '@/types/auth';

export function signInWithEmailAndPassword(req: OAuth2PasswordRequestForm) {
  return httpClient.post<UserCredential>(
    '/auth:signInWithEmailAndPassword',
    req,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}
