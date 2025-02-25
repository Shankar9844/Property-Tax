import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  logform!: FormGroup;
  errorMessage: string = '';
  SMSSende: any;
  Version: any;
  TitleEnglish: any;
  version: any;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private router: Router,
    private sharedDataService:SharedService
  ) {}

  ngOnInit(): void {

    this.logform = this.fb.group({
      UserId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.SMSSende = localStorage.getItem('SMSSende');
    this.Version = localStorage.getItem('Version');
    this.TitleEnglish = localStorage.getItem('TitleEnglish');
    
    this.sharedDataService.currentVersion.subscribe((version) => {
      this.version = version; // Get the version
    });
  }

  onLogSubmit() {
    if (this.logform.valid) {
      const { UserId, password } = this.logform.value;
  
      this.authService.login(UserId, password).subscribe(
        (isAuthenticated) => {
          if (isAuthenticated) {
            console.log('Login successful');
            this.router.navigate(['/dashboard']);
  
          } else {
            this.errorMessage = 'Invalid UserId or password';
          }
        },
        (error) => {
          this.errorMessage = error;
        }
      );
    }
  }
  
}
