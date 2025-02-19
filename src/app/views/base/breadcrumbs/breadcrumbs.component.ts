import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initProfileForm();

    const FullName = localStorage.getItem('FullName') || '';
    const ContactMobile = localStorage.getItem('ContactMobile') || '';
    const UserId = localStorage.getItem('UserId') || '';
    const Password = localStorage.getItem('Password') || '';

    this.profileForm.patchValue({
      firstName: FullName,
      phone: ContactMobile,
      UserId:UserId,
      password: Password
    });
  }

  initProfileForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      phone: ['', Validators.required],
      UserId: ['', Validators.required],
      password:['',Validators.required]
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
    }
  }
}
