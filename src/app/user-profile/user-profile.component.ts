import { Component, Input } from '@angular/core';
import { MyProfileService, ProfileHeaderDTO } from '../services/my-profile.service';
import { ActivatedRoute } from '@angular/router';
import { CircleService } from '../services/circle.service';
import { EngagementService } from '../services/engagement.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ArtworkComponent } from '../artwork/artwork.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UploadArtworkPicturesComponent } from '../upload-artwork-pictures/upload-artwork-pictures.component';
import { ArtworkService } from '../services/artwork.service';
import { SearchService } from '../services/search.service';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ButtonModule,
    AvatarModule,
    ArtworkComponent,
    DialogModule,
    ChipsModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    FloatLabelModule,
    FormsModule,
    UploadArtworkPicturesComponent,
    MenuComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  username!: string;
  userId!: number;
  profileHeader: ProfileHeaderDTO | undefined;
  isFriend: boolean = false;
  isRequestSent: boolean = false;
  isRequestPending: boolean = false;
  profilePictureUrl!: string | null;

  constructor(
    private myProfileService: MyProfileService,
    private circleFriendService: CircleService,
    private route: ActivatedRoute,
    private engagementService: EngagementService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.getProfileHeader();
      this.checkFriendOrRequestStatus();
      this.fetchUserId();
    });

  }


  getProfileHeader() {
    this.engagementService.getUsersHeader(this.username).subscribe({
      next: (header) => {
        this.profileHeader = header;
      },
      error: (err) => {
        console.error('Error fetching profile header:', err);
      }
    });
  }

  checkFriendOrRequestStatus() {
    this.circleFriendService.checkFriendOrRequestStatus(this.username).subscribe({
      next: (response) => {
        this.isFriend = response.isFriend;
        this.isRequestPending = response.isRequestPending;
      },
      error: (err) => {
        console.error('Error checking status:', err);
      }
    });
  }

  sendRequest() {
    this.circleFriendService.sendRequest(this.userId).subscribe({
      next: () => {
        this.isRequestSent = true;
        this.isRequestPending = true;
      },
      error: (err) => {
        console.error('Error sending request:', err);
      }
    });
  }

  removeFriend() {
    this.circleFriendService.removeFriend(this.userId).subscribe({
      next: () => {
        this.isFriend = false;
      },
      error: (err) => {
        console.error('Error removing friend:', err);
      }
    });
  }

  fetchUserId() {
    this.searchService.getUserIdByUsername(this.username).subscribe({
      next: (response) => {
        this.userId = response.userId;
        this.fetchProfilePicture();
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
          if (blob && blob.size > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
              this.profilePictureUrl = reader.result as string;
            };
            reader.readAsDataURL(blob);
          } else {
            this.profilePictureUrl = null;
          }
        },
        error: (err) => {
          console.error('Error fetching profile picture:', err);
          this.profilePictureUrl = null;
        }
      });
    }
  }

}
