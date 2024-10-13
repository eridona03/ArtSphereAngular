import { Component, EventEmitter, Output } from '@angular/core';
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
import { MyProfileService, ProfileHeaderDTO } from '../services/my-profile.service';
import { UploadArtworkPicturesComponent } from '../upload-artwork-pictures/upload-artwork-pictures.component';
import { ArtworkService } from '../services/artwork.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
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
    UploadArtworkPicturesComponent
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  visible: boolean = false;
  userId!: number;
  profilePictureUrl!: string | null;
  formGroup!: FormGroup;
  profileHeader: ProfileHeaderDTO | undefined;

  uploadedFiles: File[] = [];

  @Output() filesChange = new EventEmitter<File[]>();
  @Output() artworkPosted = new EventEmitter<void>();
  artworkUserId!: number;
  isOwnProfile: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private myProfileService: MyProfileService,
    private artworkService: ArtworkService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      labels: [[]],
      description: ['']
    });

    this.fetchCurrentUserId();
    this.getProfileHeader();
  }

  onFilesChange(files: File[]) {
    // Ensure that files is a true change
    if (files.length !== this.uploadedFiles.length || !files.every((file, index) => this.uploadedFiles[index] === file)) {
      this.uploadedFiles = files;
      console.log('Files received in ProfileComponent:', files);
    }
  }
  
  
  onCancel() {
    this.visible = false;
    this.formGroup.reset();
    this.uploadedFiles = []; 
  }

  onPostArtwork() {
    const description = this.formGroup.get('description')?.value;
    const labels = this.formGroup.get('labels')?.value;

    this.artworkService.createArtwork(description, labels, this.uploadedFiles).subscribe(
      response => {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Artwork created successfully!' });
        console.log('Artwork created:', response);
        this.visible = false;
        this.formGroup.reset();
        this.uploadedFiles = [];
        this.artworkPosted.emit();
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create artwork.' });
        console.error('Error creating artwork:', error);
      }
    );
  }
  
  showDialog() {
    this.visible = true;
  }
 
  getProfileHeader() {
    this.myProfileService.getProfileHeader().subscribe({
      next: (profileHeader) => {
        this.profileHeader = profileHeader;
        console.log('Profile Header:', profileHeader);
      },
      error: (err) => {
        console.error('Error fetching profile header:', err);
      }
    });
  }

  fetchCurrentUserId() {
    this.myProfileService.getCurrentUserId().subscribe({
      next: (id) => {
        this.userId = id;
        this.artworkUserId = id;
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
