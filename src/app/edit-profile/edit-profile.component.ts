import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { UploadPfpComponent } from '../upload-pfp/upload-pfp.component';
import { MyProfileService } from '../services/my-profile.service';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ChipModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    DividerModule,
    CommonModule,
    InputTextareaModule,
    ChipsModule,
    UploadPfpComponent,
    AvatarModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  username: string = '';
  email: string = '';
  bio: string = '';
  isEditingUsername: boolean = false;
  isEditingEmail: boolean = false;
  isEditingBio: boolean = false;
  isEditingLabels: boolean = false;
  visible: boolean = false;
  value = '';
  userId: number | null = null;
  profilePictureUrl: string | ArrayBuffer | null = null;

  staticLabels: string[] = [];
  editableLabels: string[] = []; 
  labels: string[] = []; 
  max: number = 10;
  profileForm!: FormGroup;

  constructor(private myProfileService: MyProfileService, private fb: FormBuilder) {
    this.resetEditableLabels();
    this.initializeFormGroup()
  }

  ngOnInit() {
    this.fetchCurrentUserId();
    this.loadProfileInformation();
  }

  initializeFormGroup() {
    this.profileForm = this.fb.group({
      currentPassword:['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.profileForm.value;
      this.myProfileService.updatePassword(currentPassword, newPassword, confirmPassword)
        .subscribe(
          response => {
            console.log('Password changed successfully');
            this.visible = false;
          },
          error => {
            console.error('Error changing password', error);
          }
        );
    }
  }

  loadProfileInformation(): void {
    this.myProfileService.getProfileInformation().subscribe(
      (data: EditProfileDTO) => {
        this.username = data.username;
        this.email = data.email;
        this.bio = data.bio;
        this.staticLabels = data.labels || [];
        this.resetEditableLabels();
      },
      (error) => {
        console.error('Error fetching profile information', error);
      }
    );
  }

  toggleEditUsername() {
    if (this.isEditingUsername) {
      this.saveUsername();
    }
    this.isEditingUsername = !this.isEditingUsername;
  }


  saveUsername() {
    this.myProfileService.updateUsername(this.username).subscribe({
      next: (response) => {
        console.log('Username updated successfully', response);
        this.isEditingUsername = false;
      },
      error: (error) => {
        console.error('Error updating username', error);
      }
    });
  }


  toggleEditEmail() {
    if (this.isEditingEmail) {
      this.saveEmail();
    }
    this.isEditingEmail = !this.isEditingEmail;
  }

  saveEmail() {
    this.myProfileService.updateEmail(this.email).subscribe({
      next: (response) => {
        console.log('Email updated successfully', response);
        this.isEditingEmail = false; // Close the edit email section
      },
      error: (error) => {
        console.error('Error updating email', error);
      }
    });
  }

  toggleEditBio() {
    if (this.isEditingBio) {
      this.saveBio();
    }
    this.isEditingBio = !this.isEditingBio;
  }

  saveBio() {
    this.myProfileService.updateBio(this.bio).subscribe({
      next: (response) => {
        console.log('Bio updated successfully', response);
        this.isEditingBio = false; // Close the edit bio section
      },
      error: (error) => {
        console.error('Error updating bio', error);
      }
    });
  }

  toggleEditLabels() {
    if (this.isEditingLabels) {

      this.updateLabels();
    } else {
      this.resetEditableLabels();
    }
    this.isEditingLabels = !this.isEditingLabels;

  }

  updateLabels() {

    this.myProfileService.updateLabels(this.editableLabels).subscribe({
      next: (response) => {
        this.staticLabels = [...this.editableLabels];
        this.isEditingLabels = false;
      },
      error: (error) => {
        console.error('Error updating labels', error);
        this.resetEditableLabels();
      }
    });
  }


  resetEditableLabels() {
    this.editableLabels = [...this.staticLabels];
  }

  updateStaticLabels() {
    this.staticLabels = [...this.editableLabels];
  }

  addLabel(event: any) {
    console.log('Adding label:', event.value);
    if (event.value && !this.editableLabels.includes(event.value)) {
      this.editableLabels.push(event.value);
    }
    console.log('Current labels:', this.editableLabels);
  }

  removeLabel(event: any) {
    console.log('Removing label:', event.value);
    const index = this.editableLabels.indexOf(event.value);
    if (index !== -1) {
      this.editableLabels.splice(index, 1);
    }
    console.log('Current labels:', this.editableLabels);
  }

  showDialog() {
    this.visible = true;
  }


  fetchCurrentUserId() {
    this.myProfileService.getCurrentUserId().subscribe({
      next: (id) => {
        this.userId = id;
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
          const reader = new FileReader();
          reader.onloadend = () => {
            this.profilePictureUrl = reader.result as string;
            //console.log('Profile Picture URL:', this.profilePictureUrl);
          };
          reader.readAsDataURL(blob);
        },
        error: (err) => {
          console.error('Error fetching profile picture:', err);
        }
      });
    }
  }
}

interface EditProfileDTO {
  username: string;
  email: string;
  bio: string;
  labels: string[];
}