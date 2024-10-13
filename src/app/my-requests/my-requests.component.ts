import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { CircleService } from '../services/circle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    MenuComponent,
    ButtonModule, 
    AvatarModule,
    DividerModule,
    CommonModule
  ],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent {

  requests: any [] = [];

  constructor(private circleService: CircleService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.circleService.getMyRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
      },
      error: (err) => {
        console.error('Error fetching requests:', err);
      }
    });
  }


  acceptRequest(requestId: number): void {
    this.circleService.acceptRequest(requestId).subscribe(
      () => {
        console.log('Request accepted');
        this.loadRequests(); // Reload requests after accepting
      },
      error => console.error('Error accepting request:', error)
    );
  }

  declineRequest(requestId: number): void {
    this.circleService.declineRequest(requestId).subscribe(
      () => {
        console.log('Request declined');
        this.loadRequests(); // Reload requests after declining
      },
      error => console.error('Error declining request:', error)
    );
  }
}
