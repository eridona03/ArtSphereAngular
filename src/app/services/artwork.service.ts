import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  private apiUrl = `${environment.apiUrl}/artworks`; ; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createArtwork(description: string, labels: string[], files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('labels', JSON.stringify(labels));

    files.forEach((file) => {
      formData.append('photos', file, file.name);
    });

    return this.http.post(`${this.apiUrl}/post`, formData, { headers: this.getHeaders() });
  }

  getCircleArtworks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/circle-artworks`, { headers: this.getHeaders() });
  }

  getFeed(): Observable<ArtworkListItemByUserDTO[]> {
    return this.http.get<ArtworkListItemByUserDTO[]>(`${this.apiUrl}/feed`, { headers: this.getHeaders()});
  }

  getUserArtworks(userId: number): Observable<ArtworkListItemByUserDTO[]> {
    return this.http.get<ArtworkListItemByUserDTO[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  deleteArtwork(artworkId: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${artworkId}`;
    return this.http.delete<any>(url, { headers: this.getHeaders() });
  }

}

export interface ArtworkListItemByUserDTO {
  id: number;
  username: string;
  postedDate: string;
  labels: string[];
  description: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  isOwner: boolean;
}
