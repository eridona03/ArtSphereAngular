import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { NotificationDTO, NotificationService } from '../services/notification.service';
import { MyProfileService } from '../services/my-profile.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    AvatarModule,
    DividerModule,
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  notifications: NotificationDTO[] = [];
  unreadCount: number = 0;

  constructor(
    private notificationService: NotificationService, 
    private profileService: MyProfileService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.notificationService.loadNotifications().subscribe((notifications: NotificationDTO[]) => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
      // Load profile pictures for each notification
      notifications.forEach(notification => {
        this.loadProfilePicture(notification.username, notification.id);
      });
    });
  }

  loadProfilePicture(username: string, notificationId: number): void {
    this.profileService.getProfilePicture2(username, 'png').subscribe(blob => {
      if (blob && blob.size > 0) {
        // Create URL only if blob has content
        const url = URL.createObjectURL(blob);
        // Find the notification by ID and update its profile photo URL
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.profilePhotoUrl = url;
        }
      } else {
       
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.profilePhotoUrl = undefined; 
        
        }
      }
    }, error => {
     
      console.error(`Error fetching profile picture for ${username}`, error);
    
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.profilePhotoUrl = undefined; 
      }
    });
  }
  

  handleNotificationClick(notificationId: number): void {
    this.notificationService.markNotificationAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      this.unreadCount = this.notifications.filter(n => !n.read).length;
    });
  }
}
