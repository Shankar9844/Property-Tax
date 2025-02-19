import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { ApiService } from './api.service';
import { LoaderService } from './loader.service';


@Component({
  selector: 'app-root',
  template: `
    <div class="overlay" *ngIf="isLoading"></div>
    <mat-progress-bar *ngIf="isLoading" mode="indeterminate" color="success"></mat-progress-bar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  
  title = 'Property Tax';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private apiService: ApiService,
    private loaderService: LoaderService // Inject LoaderService
  ) {
    this.titleService.setTitle(this.title);
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.loaderService.isLoading.subscribe((loading) => {
      this.isLoading = loading;
      if (loading) {
        document.body.classList.add('loading');
      } else {
        document.body.classList.remove('loading');
      }
    });
    
  
    this.apiService.GetCityTitle().subscribe(
      (res) => {
        if (res) {
          localStorage.setItem('SMSSende', res.SMSSender || '');
          localStorage.setItem('Version', res.Version || '');
          localStorage.setItem('TitleEnglish', res.TitleEnglish || '');
        }
      },
      (error) => {
        console.error('Error fetching city details:', error);
      }
    );
  }
  
}
