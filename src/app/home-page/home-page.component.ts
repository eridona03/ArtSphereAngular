import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { FeedComponent } from '../feed/feed.component';
import { ArtworkListItemByUserDTO, ArtworkService } from '../services/artwork.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MenuComponent,
    FeedComponent,
    CommonModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  feedArtworks: ArtworkListItemByUserDTO[] = [];

  constructor(private artworkService: ArtworkService) {}
  
  ngOnInit() {
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.artworkService.getFeed().subscribe(
      (response) => {
        this.feedArtworks = response;
      },
      (error) => {
        console.error('Error fetching circle artworks', error);
      }
    );
  }

}
