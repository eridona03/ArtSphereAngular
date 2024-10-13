import { Component, EventEmitter, Output, Input, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FileUpload, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

import { ProgressBarModule } from 'primeng/progressbar';
import { ArtworkService } from '../services/artwork.service';


@Component({
  selector: 'app-upload-artwork-pictures',
  standalone: true,
  imports: [FileUploadModule, ToastModule, FileUploadModule,
    ButtonModule,
    BadgeModule,
    ProgressBarModule,
    ToastModule,
    HttpClientModule,
    CommonModule,],
  templateUrl: './upload-artwork-pictures.component.html',
  styleUrl: './upload-artwork-pictures.component.scss',
  providers: [MessageService]
})
export class UploadArtworkPicturesComponent {
  files: File[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  showUploadSection = true;
  uploadedFiles: File[] = [];

  @Output() filesChange = new EventEmitter<File[]>();
  @ViewChild(FileUpload) fileUploadComponent!: FileUpload;
  

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  onArtworkPictureSelect(event: { files: File[] | FileList }) {
    const selectedFiles = Array.from(event.files);
  
    // Avoid duplicates and update the uploaded files
    const newFiles = selectedFiles.filter(file => !this.uploadedFiles.some(uploadedFile => uploadedFile.name === file.name && uploadedFile.size === file.size));
  
    if (newFiles.length > 0) {
      this.uploadedFiles.push(...newFiles);
      this.files = [...this.uploadedFiles]; // Ensure files reflect uploaded files
  
      console.log('Files selected:', this.uploadedFiles);
      this.filesChange.emit(this.uploadedFiles);
    }
  }
  

  choose(event: any, callback: () => void) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: File, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;

    
    const fileIndex = this.uploadedFiles.indexOf(file);
    if (fileIndex > -1) {
      this.uploadedFiles.splice(fileIndex, 1);
    }

    const selectedFileIndex = this.files.indexOf(file);
    if (selectedFileIndex > -1) {
      this.files.splice(selectedFileIndex, 1);
    }
    
    this.filesChange.emit(this.uploadedFiles);
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', life: 3000 });
    this.uploadedFiles = [];
    this.files = [];
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

  formatSize(bytes: number): string {
    const k = 1024;
    const dm = 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return `0 ${sizes[0]}`;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  removeUploadedFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.filesChange.emit(this.uploadedFiles);
  }

  
}
  
  


