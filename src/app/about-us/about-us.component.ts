import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [ButtonModule, MenuComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}
