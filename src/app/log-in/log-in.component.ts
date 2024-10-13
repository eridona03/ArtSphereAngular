import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  loginForm!: FormGroup;
  returnUrl: string = '/home';

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute
  ) { } // Inject the AuthService

  ngOnInit() {
    this.initiliazeformGroup();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  initiliazeformGroup() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, ]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [false]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login({ username, password }).subscribe(
        (response:any) => {
          console.log('Login successful', response);
          this.router.navigate(['/home']);
        },
        (error:any) => {
          console.error('Login failed', error);
          // Handle login error (show message to user)
        }
      );
    }
  }
}
