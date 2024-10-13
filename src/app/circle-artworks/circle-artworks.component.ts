import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ArtworkComponent } from '../artwork/artwork.component';
import { ArtworkListItemByUserDTO, ArtworkService } from '../services/artwork.service';
import { FeedComponent } from '../feed/feed.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circle-artworks',
  standalone: true,
  imports: [
    MenuComponent,
    ArtworkComponent,
    FeedComponent,
    CommonModule
  ],
  templateUrl: './circle-artworks.component.html',
  styleUrl: './circle-artworks.component.scss'
})
export class CircleArtworksComponent {
  circleArtworks: ArtworkListItemByUserDTO[] = [];
  
  constructor(private artworkService: ArtworkService) {}

  ngOnInit() {
    this.loadCircleArtworks();
  }

  loadCircleArtworks(): void {
    this.artworkService.getCircleArtworks().subscribe(
      (response) => {
        this.circleArtworks = response;
      },
      (error) => {
        console.error('Error fetching circle artworks', error);
      }
    );
  }
}
