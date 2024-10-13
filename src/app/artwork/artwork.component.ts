import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { ArtworkListItemByUserDTO, ArtworkService } from '../services/artwork.service';
import { ImageModule } from 'primeng/image';
import { CommentDTO, EngagementService, LikeDTO } from '../services/engagement.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { LikesCommentsOverlayComponent } from '../likes-comments-overlay/likes-comments-overlay.component';
import { MyProfileService } from '../services/my-profile.service';


@Component({
  selector: 'app-artwork',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    CommonModule,
    ChipModule,
    InputTextModule,
    ImageModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    LikesCommentsOverlayComponent
  ],
  templateUrl: './artwork.component.html',
  styleUrl: './artwork.component.scss'
})
export class ArtworkComponent {

  artworks: ArtworkListItemByUserDTO[] = [];
  @Input() userId!: number;
  @ViewChild('opLikes') opLikes!: OverlayPanel;
  @ViewChild('opComments') opComments!: OverlayPanel ;

  likes: LikeDTO[] = [];
  comments: CommentDTO[] = [];

  commentForms: { [artworkId: number]: FormGroup } = {};
  isLiked: { [artworkId: number]: boolean } = {};

  constructor(
    private artworkService: ArtworkService, 
    private engagementService: EngagementService,
    private profileService: MyProfileService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && changes['userId'].currentValue) {
      this.fetchUserArtworks();
    }
  }

  initializeCommentForm(artworkId: number) {
    this.commentForms[artworkId] = new FormGroup({
      comment: new FormControl('', Validators.required) 
    });
  }

  fetchUserArtworks(): void {
    console.log('Fetching artworks for userId:', this.userId);

    this.artworkService.getUserArtworks(this.userId).subscribe({
      next: (artworks) => {
        console.log('Artworks fetched:', artworks);

        if (Array.isArray(artworks)) {

          this.artworks = artworks;
          this.fetchUserLikeStatuses();

          this.artworks.forEach(artwork => {
            this.initializeCommentForm(artwork.id);
            this.fetchLikesPerArtwork(artwork.id);
            this.fetchCommentsPerArtwork(artwork.id);
          });

          
         

        } else {
          console.error('Expected an array of artworks but received:', artworks);
        }
      },
      error: (err) => {
        console.error('Error fetching artworks:', err);
      }
    });
  }

  fetchUserLikeStatuses(): void {
    this.artworks.forEach(artwork => {
      this.engagementService.checkIfUserLiked(artwork.id).subscribe({
        next: (isLiked) => {
          this.isLiked[artwork.id] = isLiked;
        },
        error: (err) => {
          console.error(`Error fetching like status for artwork ${artwork.id}:`, err);
        }
      });
    });
  }


  deleteArtwork(artworkId: number) {
    if (confirm('Are you sure you want to delete this artwork?')) {
      this.artworkService.deleteArtwork(artworkId).subscribe(
        response => {
          console.log('Delete response:', response);
          this.artworks = this.artworks.filter(artwork => artwork.id !== artworkId);
        },
        error => {
          console.error('Delete error:', error);
        }
      );
    }
  }


  toggleLike(artworkId: number) {
    this.engagementService.likePost(artworkId).subscribe(response => {
      this.isLiked[artworkId] = !this.isLiked[artworkId];
      const artwork = this.artworks.find(a => a.id === artworkId);
      if (artwork) {
        artwork.likeCount += this.isLiked[artworkId] ? 1 : -1;
      }
    });
  }

  submitComment(artworkId: number) {
    const commentForm = this.commentForms[artworkId];
    const content = commentForm.get('comment')?.value;

    if (content && content.trim()) {
      this.engagementService.commentOnPost({ content, artworkId }).subscribe(response => {
        const artwork = this.artworks.find(a => a.id === artworkId);
        if (artwork) {
          artwork.commentCount += 1;
          commentForm.reset();
        }
      });
    }
  }

  fetchLikesPerArtwork(artworkId: number): void {
    this.engagementService.getLikes(artworkId).subscribe(likes => {
      this.likes = likes;
      this.likes.forEach(like => {
        this.loadProfilePicture(like.userId); 
      });
    });
  }

  fetchCommentsPerArtwork(artworkId: number): void {
    this.engagementService.getComments(artworkId).subscribe(comments => {
      this.comments = comments;
      this.comments.forEach(comment => {
        this.loadProfilePicture(comment.userId); 
      });
    });
  }

  loadProfilePicture(userId: number): void {
    this.profileService.getProfilePicture(userId, 'png').subscribe(blob => {
      if (blob && blob.size > 0) {
        // Create URL only if blob has content
        const url = URL.createObjectURL(blob);
        // Update profile photo URL for likes and comments
        const like = this.likes.find(l => l.userId === userId);
        if (like) {
          like.profilePhotoUrl = url;
        }
        const comment = this.comments.find(c => c.userId === userId);
        if (comment) {
          comment.profilePhotoUrl = url;
        }
      } else {
        // Handle case where blob is empty or null
        const like = this.likes.find(l => l.userId === userId);
        if (like) {
          like.profilePhotoUrl = undefined;
        }
        const comment = this.comments.find(c => c.userId === userId);
        if (comment) {
          comment.profilePhotoUrl = undefined;
        }
      }
    }, error => {
      console.error(`Error fetching profile picture for userId ${userId}`, error);
      // Handle error case
      const like = this.likes.find(l => l.userId === userId);
      if (like) {
        like.profilePhotoUrl = undefined;
      }
      const comment = this.comments.find(c => c.userId === userId);
      if (comment) {
        comment.profilePhotoUrl = undefined;
      }
    });
  }

  displayLikes(event: Event): void {
    this.opLikes?.show(event); // Show the overlay panel at the position of the event
  }

  displayComments(event: Event): void {
    this.opComments?.show(event); // Show the overlay panel at the position of the event
  }
  
  showOverlays(artworkId: number, event: MouseEvent): void {
    // Assuming each artwork ID is unique and you have likes/comments for each artwork
    this.fetchLikesPerArtwork(artworkId);
    this.fetchCommentsPerArtwork(artworkId);

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
