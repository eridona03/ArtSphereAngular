import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ArtworkComponent } from '../artwork/artwork.component';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MyProfileService } from '../services/my-profile.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    ArtworkComponent,
    MenuModule,
    SearchComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  items: MenuItem[] | undefined;
  items2: MenuItem[] | undefined;
  userId!: number;
  profilePictureUrl!: string|null;
  @Output() userIdFetched = new EventEmitter<number>();

constructor(public router: Router, private authService: AuthService, private myProfileService: MyProfileService) {}

  ngOnInit() {

      this.fetchCurrentUserId();
      
      this.items = [
          {
              label: 'Home',
              icon: 'pi pi-home',
              command: () => this.viewHomePage()
          },
          {
              label: 'My Circle',
              icon: 'pi pi-bullseye',
              items: [
                {
                    label: 'My Friendlist',
                    icon: 'pi pi-users',
                    command: () => this.showMyFriendlist()
                },
                {
                    label: 'Artworks',
                    icon: 'pi pi-palette',
                    command: () => this.showCircleArtworks()
                },
                {
                    label: 'My Requests',
                    icon: 'pi pi-user-plus',
                    command: () => this.showMyRequests()
                },

              ]
          },
          // {
          //     label: 'Purchase',
          //     icon: 'pi pi-shopping-bag',
          //     items: [
          //         {
          //             label: 'Core',
          //             icon: 'pi pi-bolt',
          //             shortcut: '⌘+S'
          //         },
                 
          //         {
          //             separator: true
          //         },
          //         {
          //             label: 'Templates',
          //             icon: 'pi pi-palette',
          //             items: [
          //                 {
          //                     label: 'Apollo',
          //                     icon: 'pi pi-palette',
          //                     badge: '2'
          //                 },
                          
          //             ]
          //         }
          //     ]
          // },
          {
              label: 'About',
              icon: 'pi pi-sparkles',
            //   badge: '3'
            command: () => this.showAboutUs()
          }
        
      ];

      this.items2 = [
        {
            label: 'Options',
            items: [
                {
                    label: 'View Your Profile',
                    icon: 'pi pi-eye',
                    command: () => this.viewProfile() 
                },
                {
                    label: 'Log Out',
                    icon: 'pi pi-sign-out',
                    command: () => this.logOut()
                }
            ]
        }
    ];
  }

    viewHomePage() {
        console.log('View Home Page');
        this.router.navigate(['/home']);
    }

    viewProfile() {
        console.log('View Profile');
        this.router.navigate(['/view-profile']);
    }

    logOut() {
        console.log('Log Out');
        this.authService.logout();
        this.router.navigate(['/']);
    }

    showAboutUs() {
        console.log('About Us');
        this.router.navigate(['/about-us']);
    }

    showMyFriendlist() {
        console.log('My Friendlist');
        this.router.navigate(['/my-circle/my-friendlist']);
    }

    showCircleArtworks() {
        console.log('Circle Artworks');
        this.router.navigate(['/my-circle/artworks']);
    }

    showMyRequests() {
        console.log('My Requests');
        this.router.navigate(['/my-circle/requests']);
    }

    fetchCurrentUserId() {
        this.myProfileService.getCurrentUserId().subscribe({
          next: (id) => {
            this.userId = id;
            this.fetchProfilePicture();
            this.userIdFetched.emit(this.userId);
          },
          error: (err) => {
            console.error('Error fetching user ID:', err);
          }
        });
      }

      fetchProfilePicture() {
        if (this.userId !== null) {
          this.myProfileService.getProfilePicture(this.userId, 'png').subscribe({
            next: (blob) => {
              if (blob && blob.size > 0) {  // Check if blob is not empty
                const reader = new FileReader();
                reader.onloadend = () => {
                  this.profilePictureUrl = reader.result as string;
                };
                reader.readAsDataURL(blob);
              } else {
                this.profilePictureUrl = null;  // Set to null if blob is empty
              }
            },
            error: (err) => {
              console.error('Error fetching profile picture:', err);
              this.profilePictureUrl = null;  // Set to null on error
            }
          });
        }
      }
}
