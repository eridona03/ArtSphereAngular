import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { CountryService } from '../services/country.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    CalendarModule,
    ReactiveFormsModule,
    DividerModule,
    FormsModule,
    PasswordModule,
    RadioButtonModule,
    CommonModule,
    AutoCompleteModule
  ],
  providers: [CountryService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  formGroup!: FormGroup;
  countries: any[] | undefined;
  passwordsMatch: boolean = true;

  selectedCountry: any;

  filteredCountries!: any[];

  
  constructor(private http: HttpClient, private router: Router, private countryService: CountryService, private authService: AuthService) {}

  categories: any[] = [
    { name: 'Female', key: 'F' },
    { name: 'Male', key: 'M' },
  ];

  ngOnInit() {
   this.initiliazeformGroup();
   this.getCountries();
  }
 
  initiliazeformGroup() {
    this.formGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required),
      birthdate: new FormControl<Date | null>(null),
      gender: new FormControl(null),
      country: new FormControl(null)
    });
  }

  getCountries(){
    this.countryService.getCountries().then((countries:any) => {
      this.countries = countries;
  });
  }


  filterCountry(event: AutoCompleteCompleteEvent) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.countries as any[]).length; i++) {
          let country = (this.countries as any[])[i];
          if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }

      this.filteredCountries = filtered;
  }

  checkPasswords() {
    const password = this.formGroup.get('password')?.value;
    const confirmPassword = this.formGroup.get('confirmpassword')?.value;
    this.passwordsMatch = password === confirmPassword;
  }

  onSubmit() {
    this.checkPasswords();

    if (this.formGroup.valid && this.passwordsMatch) {
      const { confirmPassword, ...formData } = this.formGroup.value;
      
      formData.gender = formData.gender && formData.gender.name ? formData.gender.name : formData.gender;
      formData.country = formData.country && formData.country.name ? formData.country.name : formData.country;

      this.authService.signup(formData).subscribe(
        (response) => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error registering user', error);

        }
      );
    }
  }

}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
