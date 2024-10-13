import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private baseUrl = `${environment.apiUrl}/api/analytics`; 

  constructor(private http: HttpClient, private authService: AuthService) { }
  
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getGeneralStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/general-stats`, { headers: this.getHeaders() });
  }

  getCountryAudience(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/country-audience`, { headers: this.getHeaders() });
  }

  getAgeAudience(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/age-audience`, { headers: this.getHeaders() });
  }

  getGenderAudience(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/gender-audience`, { headers: this.getHeaders() }) ;
  }
  
}
