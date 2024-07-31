import { Observable } from 'rxjs';

export interface UploadPlanningEventImageService {
  uploadPlanningEventImage(
    data: uploadPlanningEventImageRequest,
  ): Observable<uploadPlanningEventImageResponse>;
}

export interface uploadPlanningEventImageRequest {
  id: string;
}

export interface uploadPlanningEventImageResponse {}
