import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-delete-profile',
  standalone: true,
  imports: [ConfirmDialogModule, ButtonModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './delete-profile.component.html',
  styleUrl: './delete-profile.component.scss'
})
export class DeleteProfileComponent {

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}
  
  confirm() {
    this.confirmationService.confirm({
      header: 'Confirmation Required',
      message: 'Please confirm one last time in order to proceed.',
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      },
      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      
  });
  }
}
