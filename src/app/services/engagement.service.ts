import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';
import { ProfileHeaderDTO } from './my-profile.service';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {

  private baseUrl = `${environment.apiUrl}/api/engage`; ; 

  constructor(private http: HttpClient, private authService: AuthService) { }


  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  likePost(artworkId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/like`, artworkId, {headers: this.getHeaders()});
  }
  
  checkIfUserLiked(artworkId: number): Observable<boolean> {
    return this.http.get<{ hasLiked: boolean }>(`${this.baseUrl}/like-status/${artworkId}`, { headers: this.getHeaders() })
      .pipe(map(response => response.hasLiked));
  }

  commentOnPost(comment: Comment): Observable<any> {
    return this.http.post(`${this.baseUrl}/comment`, comment, {headers: this.getHeaders()});
  }

  getLikes(artworkId: number): Observable<LikeDTO[]> {
    return this.http.get<LikeDTO[]>(`${this.baseUrl}/likes/${artworkId}`, { headers: this.getHeaders() });
  }

  getComments(artworkId: number): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.baseUrl}/comments/${artworkId}`, { headers: this.getHeaders() });
  }

  getUsersHeader(username: string): Observable<ProfileHeaderDTO> {
    return this.http.get<ProfileHeaderDTO>(`${this.baseUrl}/header/${username}`, { headers: this.getHeaders() });
  }
  
}

export interface Comment {
  content: string; 
  artworkId: number; 
}

export interface LikeDTO {
  profilePhotoUrl: string | undefined;
  userId: number;
  username: string;
}

export interface CommentDTO {
  profilePhotoUrl: string| undefined;
  userId: number;
  username: string;
  content: string;
  timeAgo: string;
}
