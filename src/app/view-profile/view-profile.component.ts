import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { DeleteProfileComponent } from '../delete-profile/delete-profile.component';
import { ProfileComponent } from '../profile/profile.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule} from '@angular/material/sidenav';
import { NotificationComponent } from "../notification/notification.component";
import { NotificationDTO, NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';
import { Badge, BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    ProfileComponent,
    EditProfileComponent,
    DeleteProfileComponent,
    AnalyticsComponent,
    RouterModule,
    CommonModule,
    MatSidenavModule,
    NotificationComponent,
    BadgeModule
],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  sidebarVisible: boolean = true;
  showFiller = false;

  selectedOption: string = 'profile';
  notifications: NotificationDTO[] = [];
  unreadCount: number = 0;
  
   
  private unreadCountSubscription: Subscription = new Subscription();
  
  constructor(private notificationService: NotificationService) {}

  showProfile() {
    this.selectedOption = 'profile';
    console.log('showProfile');
  }

  showAnalytics() {
    this.selectedOption = 'analytics';
    console.log('showAnalytics');
  }
  

  showEditProfile() {
    this.selectedOption = 'editProfile';
    console.log('EditProfile');
  }
  

  showDeleteProfile() {
    this.selectedOption = 'deleteProfile';
    console.log('deleteProfile');
  }

  showNotifications() {
    this.selectedOption = 'notifications';
    console.log('notifications');
  }
  
  
    ngOnInit(): void {
      // Subscribe to the unread count to keep it updated
      this.unreadCountSubscription = this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count; // Update unread count
        console.log('Unread count:', this.unreadCount);
      });
  
      // Load notifications on init to ensure unread count is calculated
      this.notificationService.loadNotifications().subscribe();
    }
  
    ngOnDestroy() {
      this.notificationService.disconnect();
      this.unreadCountSubscription.unsubscribe();
    }
  }
  


