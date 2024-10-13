import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ArtworkComponent } from '../artwork/artwork.component';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { CircleService } from '../services/circle.service';

@Component({
  selector: 'app-my-friendlist',
  standalone: true,
  imports: [
    MenuComponent,
    ArtworkComponent,
    DataViewModule,
    CommonModule, 
    ButtonModule,
    TagModule, 
    AvatarModule,
    DividerModule],
  templateUrl: './my-friendlist.component.html',
  styleUrl: './my-friendlist.component.scss'
})
export class MyFriendlistComponent {
  userId!: number;
  friends: MyCircleDTO[] = [];

  constructor(private circleService: CircleService) {}

  onUserIdFetched(userId: number) {
    this.userId = userId;
    this.loadFriends();
  }

  loadFriends() {
    this.circleService.getMyFriendlist(this.userId).subscribe({
      next: (friends: MyCircleDTO[]) => {
        this.friends = friends;
        console.log('Friends list fetched:', friends); // Log the response here
      },
      error: (err) => {
        console.error('Error fetching friends:', err);
      }
    });
  }


  removeFriend(friendId: number) {
    this.circleService.removeFriend(friendId).subscribe({
      next: () => {
        this.friends = this.friends.filter(friend => friend.friendId !== friendId);
        console.log('Friend removed:', friendId);
      },
      error: (err) => {
        console.error('Error removing friend:', err);
      }
    });
  }
}

export interface MyCircleDTO {
  profilePicture: string | null;
  username: string;
  noOfCircleFriends: number | null;
  friendId: number;
}

