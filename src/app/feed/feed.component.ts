import { Component, Input, ViewChild } from '@angular/core';
import { ArtworkListItemByUserDTO, ArtworkService } from '../services/artwork.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { CommentDTO, EngagementService, LikeDTO } from '../services/engagement.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyProfileService } from '../services/my-profile.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LikesCommentsOverlayComponent } from '../likes-comments-overlay/likes-comments-overlay.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    CommonModule,
    ChipModule,
    InputTextModule,
    ImageModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayPanelModule,
    LikesCommentsOverlayComponent
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  @Input() artworks: ArtworkListItemByUserDTO[] = [];

  @ViewChild('opLikes') opLikes: any;
  @ViewChild('opComments') opComments: any;
 
  likes: LikeDTO[] = [];
  comments: CommentDTO[] = [];
  commentForms: { [artworkId: number]: FormGroup } = {};
  isLiked: { [artworkId: number]: boolean } = {};

  constructor(
    private engagementService: EngagementService,
    private profileService: MyProfileService
  ) {}

  ngOnInit() {
    this.artworks.forEach(artwork => {
      this.initializeCommentForm(artwork.id);
      this.fetchUserLikeStatus(artwork.id);
      this.fetchLikes(artwork.id);
      this.fetchComments(artwork.id);
    });
  }

  initializeCommentForm(artworkId: number) {
    this.commentForms[artworkId] = new FormGroup({
      comment: new FormControl('', Validators.required)
    });
  }

  fetchUserLikeStatus(artworkId: number) {
    this.engagementService.checkIfUserLiked(artworkId).subscribe({
      next: isLiked => {
        this.isLiked[artworkId] = isLiked;
      },
      error: err => {
        console.error(`Error fetching like status for artwork ${artworkId}:`, err);
      }
    });
  }

  fetchLikes(artworkId: number) {
    this.engagementService.getLikes(artworkId).subscribe({
      next: likes => {
        this.likes = likes;
        this.likes.forEach(like => this.loadProfilePicture(like.userId));
      },
      error: err => {
        console.error(`Error fetching likes for artwork ${artworkId}:`, err);
      }
    });
  }

  fetchComments(artworkId: number) {
    this.engagementService.getComments(artworkId).subscribe({
      next: comments => {
        this.comments = comments;
        this.comments.forEach(comment => this.loadProfilePicture(comment.userId));
      },
      error: err => {
        console.error(`Error fetching comments for artwork ${artworkId}:`, err);
      }
    });
  }

  toggleLike(artworkId: number) {
    this.engagementService.likePost(artworkId).subscribe({
      next: () => {
        this.isLiked[artworkId] = !this.isLiked[artworkId];
        const artwork = this.artworks.find(a => a.id === artworkId);
        if (artwork) {
          artwork.likeCount += this.isLiked[artworkId] ? 1 : -1;
        }
      },
      error: err => {
        console.error(`Error toggling like for artwork ${artworkId}:`, err);
      }
    });
  }

  submitComment(artworkId: number) {
    const commentForm = this.commentForms[artworkId];
    const content = commentForm.get('comment')?.value;

    if (content && content.trim()) {
      this.engagementService.commentOnPost({ content, artworkId }).subscribe({
        next: () => {
          const artwork = this.artworks.find(a => a.id === artworkId);
          if (artwork) {
            artwork.commentCount += 1;
            commentForm.reset();
          }
        },
        error: err => {
          console.error(`Error submitting comment for artwork ${artworkId}:`, err);
        }
      });
    }
  }

  loadProfilePicture(userId: number) {
    this.profileService.getProfilePicture(userId, 'png').subscribe({
      next: blob => {
        if (blob && blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const like = this.likes.find(l => l.userId === userId);
          if (like) like.profilePhotoUrl = url;
          const comment = this.comments.find(c => c.userId === userId);
          if (comment) comment.profilePhotoUrl = url;
        }
      },
      error: err => {
        console.error(`Error fetching profile picture for user ${userId}:`, err);
      }
    });
  }

  displayLikes(event: any, artworkId: number) {
    this.engagementService.getLikes(artworkId).subscribe(likes => {
      this.likes = likes;
      this.opLikes.show(event);
    });
  }

  displayComments(event: any, artworkId: number) {
    this.engagementService.getComments(artworkId).subscribe(comments => {
      this.comments = comments;
      this.opComments.show(event);
    });
  }

  showOverlays(artworkId: number, event: MouseEvent): void {
    // Assuming each artwork ID is unique and you have likes/comments for each artwork
    this.fetchLikes(artworkId);
    this.fetchComments(artworkId);

    const target = event.target as HTMLElement;
    const isLikeElement = target.classList.contains('pi-heart');
    const isCommentElement = target.classList.contains('pi-comments');

    if (isLikeElement) {
      this.opLikes.show(event);
    }

    if (isCommentElement) {
      this.opComments.show(event);
    }
  }

  hideOverlays(): void {
    this.opLikes.hide();
    this.opComments.hide();
  }
}
