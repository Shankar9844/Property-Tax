import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-button-groups',
  templateUrl: './button-groups.component.html',
  styleUrls: ['./button-groups.component.scss']
})
export class ButtonGroupsComponent {
  formCheck1: UntypedFormGroup; // Declare it but do not initialize here
  formRadio1: UntypedFormGroup; 

  constructor(private formBuilder: UntypedFormBuilder) {
    // Now, initialize formCheck1 inside the constructor
    this.formCheck1 = this.formBuilder.group({
      checkbox1: false,
      checkbox2: false,
      checkbox3: false
    });

    this.formRadio1 = new UntypedFormGroup({
      radio1: new UntypedFormControl('Radio1')
    });
  }

  setCheckBoxValue(controlName: string) {
    const prevValue = this.formCheck1.get(controlName)?.value;
    const value = { ...this.formCheck1.value }; // Copy object to avoid mutation issues
    value[controlName] = !prevValue;
    this.formCheck1.setValue(value);
  }

  setRadioValue(value: string): void {
    this.formRadio1.setValue({ radio1: value });
  }
}
