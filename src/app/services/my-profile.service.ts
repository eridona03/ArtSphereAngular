import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProfileInformation(): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/profile/profileinfo`, { headers });
  }

  getProfilePicture2(username: string, imageFormat: string): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/api/profile/photo/get`, {
      headers: headers,
      params: {
        username: username,
        imageFormat: imageFormat
      },
      responseType: 'blob'
    });
  }

  getProfileHeader(): Observable<ProfileHeaderDTO> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ProfileHeaderDTO>(`${this.apiUrl}/profile/header`, { headers });
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('FormData keys and values:');
    formData.forEach((value, key) => {
      if (key === 'file' && value instanceof File) {
        console.log(`Key: ${key}, File Name: ${value.name}, File Size: ${value.size} bytes, File Type: ${value.type}`);
      } else {
        console.log(`Key: ${key}, Value: ${value}`);
      }
    });

    return this.http.post(`${this.apiUrl}/api/profile/profile-photo/upload`, formData, { headers });
  }

  getProfilePicture(userId: number, imageFormat: string): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/api/profile/profile-photo/get`, {
      headers: headers,
      params: {
        userId: userId.toString(),
        imageFormat: imageFormat
      },
      responseType: 'blob' 
    });
  }


  checkPasswords(currentPassword: string, newPassword: string, confirmPassword: string): boolean {
    if (currentPassword === newPassword) {
      console.log("New password must be different from the current password.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      console.log("New password and confirm password do not match.");
      return false;
    }

    return true;
  }

  updatePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    if (!this.checkPasswords(currentPassword, newPassword, confirmPassword)) {
      throw new Error('Password validation failed');
    }
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      currentPassword,
      newPassword
    };
    return this.http.post(`${this.apiUrl}/profile/change-password`, body, { headers });
  }

  updateUsername(newUsername: string): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Request Headers:', headers); 
    return this.http.put(`${this.apiUrl}/profile/username`, { username: newUsername }, { headers });
  }

  updateBio(newBio: string): Observable<any> {

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/profile/bio`, { bio: newBio }, { headers });
  }

  updateEmail(newEmail: string): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/profile/email`, { email: newEmail }, { headers });
  }

  updateLabels(labels: string[]): Observable<any> {
    const token = this.authService.getToken();
    console.log('Labels to send:', labels);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/profile/labels`, labels, { headers });
  }


  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`);
  }

  getCurrentUserId(): Observable<number> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<number>(`${this.apiUrl}/profile/current-id`, { headers });
  }

} 


export interface ProfileHeaderDTO {
  username: string;
  bio: string;
  numberOfCircleFriends: number;
}


