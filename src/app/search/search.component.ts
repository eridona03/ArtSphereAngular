import { Component, Input, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ArtworkListItemByUserDTO } from '../services/artwork.service';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    InputTextModule,
    OverlayPanelModule,
    CommonModule,
    SelectButtonModule,
    AvatarModule,
    ReactiveFormsModule,
    ImageModule,
    CardModule,
    ChipModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  formGroup!: FormGroup;
  @ViewChild('op') op!: OverlayPanel;
  users: User[] = [];
  artworks: any[] = [];
  searchValue: string = '';
  searchType: 'user' | 'artwork' = 'user';
  stateOptions: any[] = [
    { label: 'Users', value: 'user' },
    { label: 'Artworks', value: 'artwork' }
  ];

  constructor(
    private searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      value: new FormControl('user')
    });

    this.formGroup.get('value')?.valueChanges.subscribe(value => {
      this.searchType = value;
      this.onSearchInputChange();
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue = target.value;
    this.onSearchInputChange();
    this.op.show(event);
  }

  onSearchInputChange() {
    if (this.searchValue.trim()) {
      if (this.searchType === 'user') {
        this.searchUsers();
      } else {
        this.searchArtworks();
      }
    } else {
      this.users = [];
      this.artworks = [];
    }
  }

  searchUsers() {
    this.searchService.searchUsers(this.searchValue).subscribe(
      (users: User[]) => {
        this.users = users.map(user => ({
          ...user,
          profilePicture: user.profilePicture ? 'data:image/jpeg;base64,' + user.profilePicture : null
        }));
      },
      (error) => {
        console.error('Error searching users:', error);
      }
    );
  }

  navigateToUserProfile(username: string) {
    this.router.navigate(['/user-profile', username]);
  }

  searchArtworks() {
    this.searchService.searchArtworks(this.searchValue).subscribe(
      (artworks: ArtworkListItemByUserDTO[]) => {
        this.artworks = artworks;
      },
      (error) => {
        console.error('Error searching artworks:', error);
      }
    );
  }
}

export interface User {
  profilePicture: string | null;
  username: string;
}
