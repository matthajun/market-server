import { Observable } from 'rxjs';

export interface NormalAdminTokenVerifyService {
  verifyNormalAdminToken(
    data: getTokenVerifyRequest,
  ): Observable<getTokenVerifyResponse>;
}

export interface getTokenVerifyRequest {
  token: string;
}

export interface getTokenVerifyResponse {
  user_id: string;
}
