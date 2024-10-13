import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommentDTO, LikeDTO } from '../services/engagement.service';

@Component({
  selector: 'app-likes-comments-overlay',
  standalone: true,
  imports: [
    AvatarModule,
    CommonModule
  ],
  templateUrl: './likes-comments-overlay.component.html',
  styleUrl: './likes-comments-overlay.component.scss'
})
export class LikesCommentsOverlayComponent {
  @Input() likes: LikeDTO[] = [];
  @Input() comments: CommentDTO[] = [];
  @Input() isLikes: boolean = true;
}
