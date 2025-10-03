import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { attachment } from '../model/attachment.model';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  postAttachment(attachmentDetails: attachment) {
    return this.httpClient.post<number>(
      this.baseUrl + 'Lampirans/PostLampiran',
      attachmentDetails  // biar object terus, HttpClient akan serialize
    );
  }

  postFile(attId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.httpClient.post(
      this.baseUrl + 'Lampirans/UploadFile/' + attId,
      formData
    );
  }

}
