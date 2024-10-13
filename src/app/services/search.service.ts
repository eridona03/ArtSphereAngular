import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../search/search.component';
import { ArtworkListItemByUserDTO } from './artwork.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = `${environment.apiUrl}/api/search`; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }
  

  searchUsers(username: string): Observable<User[]> {
  
    const params = new HttpParams().set('username', username);
    
    return this.http.get<User[]>(`${this.apiUrl}/user`, { 
      params, 
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('Response:', response)), 
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  searchArtworks(searchTerm: string): Observable<ArtworkListItemByUserDTO[]> {
   
    const params = new HttpParams().set('searchTerm', searchTerm);

    return this.http.get<ArtworkListItemByUserDTO[]>(`${this.apiUrl}/artwork`, { params, headers: this.getHeaders() });
  }

  getUserIdByUsername(username: string): Observable<{ userId: number }> {
  return this.http.get<{ userId: number }>(`${this.apiUrl}/id-by-username/${username}`, {headers: this.getHeaders()});
  }

}
