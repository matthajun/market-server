import { Observable } from 'rxjs';

export interface GetMediaDetailService {
  getMediaDetail(
    data: getMediaDetailRequest,
  ): Observable<getMediaDetailResponse>;
}

export interface getMediaDetailRequest {
  media_id: string;
}

export interface getMediaDetailResponse {
  media_id: string;
  uploader_id: string;
}
