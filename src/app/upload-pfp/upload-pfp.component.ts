import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MyProfileService } from '../services/my-profile.service';

@Component({
    selector: 'app-upload-pfp',
    templateUrl: './upload-pfp.component.html',
    styleUrl: './upload-pfp.component.scss',
    standalone: true,
    providers: [MessageService],
    imports: [
        FileUploadModule,
        ButtonModule,
        BadgeModule,
        ProgressBarModule,
        ToastModule,
        HttpClientModule,
        CommonModule,
        AvatarModule
    ]
})
export class UploadPfpComponent {
    files: File[] = [];
    totalSize: number = 0;
    totalSizePercent: number = 0;
    @Input() profilePictureUrl: string | ArrayBuffer | null = null;
    showUploadSection = false;
    file: File | null = null;
    displayUrl: string | undefined = '';

    ngOnChanges(changes: SimpleChanges) {
        if (changes['profilePictureUrl']) {
          console.log('Profile picture URL received:', this.profilePictureUrl);
          console.log('Type of profilePictureUrl:', typeof this.profilePictureUrl);
          
          if (this.profilePictureUrl && typeof this.profilePictureUrl === 'string') {
            console.log('valid image URL');
            if (this.isValidImageUrl(this.profilePictureUrl)) {
              this.displayUrl = this.profilePictureUrl;
             // console.log('Display URL set to:', this.displayUrl);
            } else {
              this.displayUrl = undefined;
              console.log('Display URL set to undefined');
            }
          } else {
            this.displayUrl = undefined;
           // console.log('Display URL set to undefined (not a string or falsy)');
          }
        }
      }
      
      private isValidImageUrl(url: string): boolean {
        return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url) || url.startsWith('data:image/');
      }

    constructor(private myProfileService: MyProfileService, private config: PrimeNGConfig, private messageService: MessageService) { }

    choose(event: any, callback: () => void) {
        callback();
    }

    onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }

    onProfilePictureSelect(event: { files: File[] }) {
        const file = event.files[0];
        this.file = file;
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            this.profilePictureUrl = e.target?.result as string | ArrayBuffer | null;
        };
        reader.readAsDataURL(file);
    }

    onProfilePictureUpload() {
        this.messageService.add({ severity: 'info', summary: 'Profile Picture Uploaded', life: 3000 });
        this.showUploadSection = false;
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event: { currentFiles: File[] }) {
        this.files = event.currentFiles;
        this.totalSize = 0;
        this.files.forEach((file) => {
            const sizeString = this.formatSize(file.size);
            const sizeNumber = parseFloat(sizeString.split(' ')[0]);
            this.totalSize += sizeNumber;
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    uploadEvent() {
        if (!this.file) {
            this.messageService.add({ severity: 'error', summary: 'No file selected', life: 3000 });
            return;
        }

        this.myProfileService.uploadProfilePicture(this.file).subscribe({
            next: (event: HttpEvent<any>) => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    const percentDone = Math.round((event.loaded / event.total) * 100);
                    this.totalSizePercent = percentDone;
                } else if (event instanceof HttpResponse) {
                    this.messageService.add({ severity: 'success', summary: 'Profile Picture Uploaded', life: 3000 });
                    this.showUploadSection = false; // Hide the upload section after success
                }
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Upload failed', detail: err.message, life: 3000 });
            }
        });
    }


    formatSize(bytes: number): string {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes?.[0] || 'Bytes'}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes?.[i] || 'Bytes'}`;
    }
}

