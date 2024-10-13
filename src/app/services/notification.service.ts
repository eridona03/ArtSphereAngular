import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, Message, Stomp } from '@stomp/stompjs';
import { BehaviorSubject, from, map, Observable, Subject, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { get } from 'node:http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private authService: AuthService, private http: HttpClient) {
    this.connect();
  }

  private stompClient: any;
  private readonly apiUrl = environment.apiUrl;
  private notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]); // Unified to one BehaviorSubject
  private unreadCountSubject = new BehaviorSubject<number>(0);


  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  connect(): void {
    const socketFactory = () => new SockJS(environment.wsUrl);

    this.stompClient = Stomp.over(socketFactory);

    const token = this.authService.getToken();

    this.stompClient.configure({
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: (frame: any) => {
        console.log('Connected: ' + frame);
        this.stompClient.subscribe('/queue/notifications', (message: Message) => {
          const notification = JSON.parse(message.body);
          this.addNotification(notification); // Add new notifications
        });
      },
      onStompError: (frame: any) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      reconnectDelay: 5000,  // Reconnect after 5 seconds
    });

    this.stompClient.activate();
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  public getNotificationStream(): Observable<NotificationDTO[]> {
    return this.notificationsSubject.asObservable();
  }

  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/notifications/read`, notificationId, {
      headers: this.getHeaders(),
    }).pipe(
      map(() => {
        const updatedNotifications = this.notificationsSubject.getValue().map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        );
        this.notificationsSubject.next(updatedNotifications); // Corrected to use the right subject
      })
    );
  }


  loadNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.apiUrl}/notification-list`, { headers: this.getHeaders() }).pipe(
      tap(notifications => {
        // Calculate the unread count
        const unreadCount = notifications.filter(notification => !notification.read).length;
        this.notificationsSubject.next(notifications);
        this.unreadCountSubject.next(unreadCount); // Update unread count
      })
    );
  }

  private addNotification(notification: NotificationDTO): void {
    const currentNotifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next([notification, ...currentNotifications]); 
  }

}


export interface NotificationDTO {
  profilePhotoUrl?: string | undefined;
  id: number;
  read: boolean;
  username: string;
  action: string;
  postPreviewPhoto: string;
  timeAgo: string;
  content?: string;
}
