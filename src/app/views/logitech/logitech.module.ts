import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SampleComponent } from './sample/sample.component';
import { SimpleComponent } from './simple/simple.component';
import { LogitechRoutingModule } from './logitech-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [SampleComponent,SimpleComponent],
  imports: [
    CommonModule,
    LogitechRoutingModule,
    ReactiveFormsModule

  ]
})
export class LogitechModule {
}
