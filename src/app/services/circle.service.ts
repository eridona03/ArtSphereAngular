import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { MyCircleDTO } from '../my-friendlist/my-friendlist.component';

@Injectable({
  providedIn: 'root'
})
export class CircleService {

 private apiUrl = `${environment.apiUrl}/api/circle`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getMyFriendlist(userId: number): Observable<MyCircleDTO[]> {
    return this.http.get<MyCircleDTO[]>(`${this.apiUrl}/friends/${userId}`, { headers: this.getHeaders() });
  }

  getMyRequests(): Observable<MyCircleDTO[]> {
    return this.http.get<MyCircleDTO[]>(`${this.apiUrl}/requests`, { headers: this.getHeaders() });
  }

  sendRequest(recipientId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`,  recipientId , { headers: this.getHeaders() });
  }

  acceptRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/accept`, null, {
      params: { requestId: requestId.toString() },
      headers: this.getHeaders()
    });
  }
  
  declineRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/decline`, null, {
      params: { requestId: requestId.toString() },
      headers: this.getHeaders()
    });
  }

  removeFriend(friendId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${friendId}`, { 
      headers: this.getHeaders() 
    });
  }

  checkFriendOrRequestStatus(username: string): Observable<{ isFriend: boolean, isRequestPending: boolean }> {
    return this.http.get<{ isFriend: boolean, isRequestPending: boolean }>(`${this.apiUrl}/is-friend-or-request/${username}`,
    { headers: this.getHeaders() } 
    );
  }
  
}
