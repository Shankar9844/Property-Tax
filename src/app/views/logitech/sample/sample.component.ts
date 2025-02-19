import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent {

  userForm: FormGroup;

  constructor() {
    // Initialize FormGroup
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  // Submit function
  onSubmit() {
    if (this.userForm.valid) {
      console.log("Form Submitted", this.userForm.value);
    } else {
      console.log("Form Invalid");
    }
  }
}
