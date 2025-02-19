import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss']
})
export class AccordionsComponent implements OnInit {

  pidForm!: FormGroup;
  propertyForm!: FormGroup;
  isPidSubmitted: boolean = false;
  Pidshows: boolean = true;
  isMobileEditable: boolean = false;
  isAadharEditable: boolean = false;
  displayheadcard:boolean=false;
  totalAmount: number = 0;
  taxRecords: any = [];
  ownerForm!: FormGroup;
  draftviewdetails: boolean = false;
  ownername: any;
  ownerNamedisplay: any;
  displaypid: any;
 

  constructor(private fb: FormBuilder, 
    private toastr: ToastrService,
     private router: Router, 
     private apiservice: ApiService,
     private location:Location
    ) { }

   

  ngOnInit(): void {
    this.initPidForm();
    this.updateTotalAmount();
  }

  initPidForm() {
    this.pidForm = this.fb.group({
      pid: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  backtopid() {
    this.displayheadcard=false;
    this.isPidSubmitted=false;
    this.Pidshows=true;
    this.draftviewdetails=false;
  }

  onPidSubmit() {
    if (this.pidForm.valid) {
      this.apiservice.GetPersonalDetail(this.pidForm.value).subscribe(res => {
        console.log(res);
        this.fetchPropertyData(res);
        this.displayheadcard=true;
        if (res) {
          localStorage.setItem('ownerName', res.OwnerFirstNameEng || '');
          localStorage.setItem('propertyNo', res.PropertyType.PropTypeName || '');
        }

        this.ownerNamedisplay = res.OwnerFirstNameEng;  
        this.displaypid = res.PID;  
        this.taxRecords = res.TaxStatusDetailsList || [];
        this.updateTotalAmount();
      });
     

      this.Pidshows = false;
      this.isPidSubmitted = true;

      this.initPropertyForm();
      this.pidForm.controls['pid'].disable();
      this.toastr.success('PID Submitted Successfully!', 'Success');
    } else {
      this.toastr.error('Invalid PID! Please enter a valid number.', 'Error');
    }
  }

  onCancel() {
    this.pidForm.reset();
    this.pidForm.controls['pid'].enable();
    this.isPidSubmitted = false;
    this.Pidshows = true;

    this.toastr.info('PID Submission Cancelled.', 'Info');
  }

  initPropertyForm() {
    this.propertyForm = this.fb.group({
      ownerNameEng: ['', Validators.required],
      ownerNameKannada: ['', Validators.required],
      pid: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      wardNo: ['', Validators.required],
      propertyNo: ['', Validators.required],
      occupierName: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      propertyType: ['', Validators.required],
      physicalProperty: ['', Validators.required],
      propertyUsage: ['', Validators.required],
      totalSiteArea: ['', [Validators.required, Validators.pattern('^[0-9.]*$')]],
      totalBuiltUp: ['', [Validators.required, Validators.pattern('^[0-9.]*$')]],
      rrNo: ['', Validators.required],
      pageNo: ['', Validators.required],

      updateMobileNo: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      updateAadharNo: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{12}$')]]
    });
  }

  fetchPropertyData(res: any): void {


    this.propertyForm.patchValue({
      ownerNameEng: res.OwnerFirstNameEng,
      ownerNameKannada: res.OwnerFName,
      pid: res.PID,
      wardNo: res.WardNo,
      propertyNo: res.PropertyNo,
      occupierName: res.OccupierFirstName,
      mobileNo: res.MobileNo,
      address: res.Address,
      propertyType: res.PropertyType.PropTypeName,
      physicalProperty: res.PhysicalProperty.PhysicalPropName,
      propertyUsage: res.PropertyUsage.PropUsageName,
      totalSiteArea: res.TotalArea,
      totalBuiltUp: res.TotalAreaBuilt,
      rrNo: res.RRNo,
      pageNo: res.PageNo,
      updateMobileNo: res.MobileNo,
      updateAadharNo: res.AadharNo
    });

  }

  onSubmit() {
    console.log('Submit button clicked');

    if (!this.propertyForm) {
      console.log('Property Form is not initialized');
      this.toastr.error('Error: Property Form is not initialized!', 'Error');
      return;
    }

    if (this.propertyForm.valid) {
      console.log('Form Submitted Successfully:', this.propertyForm.value);
      this.propertyForm.reset();
      this.toastr.success('Property Form Submitted Successfully!', 'Success');
    } else {
      console.log('Property Form is invalid', this.propertyForm.errors);
      this.toastr.error('Please fill out all required fields correctly!', 'Error');

      Object.keys(this.propertyForm.controls).forEach(key => {
        const control = this.propertyForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid`);
        }
      });
    }
  }

  toggleEdit(field: string) {
    if (field === 'mobile') {
      this.isMobileEditable = !this.isMobileEditable;
      if (this.isMobileEditable) {
        this.propertyForm.controls['updateMobileNo'].enable();
      } else {
        this.propertyForm.controls['updateMobileNo'].disable();
      }
    } else if (field === 'aadhar') {
      this.isAadharEditable = !this.isAadharEditable;
      if (this.isAadharEditable) {
        this.propertyForm.controls['updateAadharNo'].enable();
      } else {
        this.propertyForm.controls['updateAadharNo'].disable();
      }
    }
  }

  fetchAllfetchTaxRecords() {
    this.apiservice.GetPersonalDetail(this.pidForm.value).subscribe(res => {

      this.taxRecords = res.TaxStatusDetailsList
      this.updateTotalAmount();
    })
  }



  SendOwnerviewdetails(record: any) {
    this.initdrafttaxviewdetails(record);  // Initialize the ownerForm with data if needed
    this.draftviewdetails = true;
    this.isPidSubmitted = false;

  }

  backtostep() {
    this.draftviewdetails = false;
    this.isPidSubmitted = true;
  }


  updateTotalAmount() {

    this.totalAmount = this.taxRecords
      .filter((record: { isSelected: boolean, Status: string }) => record.isSelected && record.Status !== 'Paid')
      .reduce((sum: number, record: { AmountPaid: number }) => sum + record.AmountPaid, 0);
  }

  initdrafttaxviewdetails(record: any = null) {

    const ownerName = localStorage.getItem('ownerName');
    const propertyNo = localStorage.getItem('propertyNo');

    this.ownerForm = this.fb.group({
      Ownername: [ownerName, Validators.required],
      PropTypeName:[propertyNo,Validators.required],
      assessmentYear: [record ? record.AssessmentYear : '', Validators.required],
      tax: [record ? record.TotalTax : '', [Validators.required, Validators.min(0)]],
      cess: [record ? record.TotalCess : '', [Validators.required, Validators.min(0)]],
      penalty: [record ? record.Penalty : '', [Validators.required, Validators.min(0)]],
      swmCess: [record ? record.SWMCess : '', [Validators.required, Validators.min(0)]],
      vehicleCess: [record ? record.TotalVehicleCess : '', [Validators.required, Validators.min(0)]],
      ugdCharges: [record ? record.UGDCess : '', [Validators.required, Validators.min(0)]],
      swmCharges: [record && record.swmCharges !== undefined ? record.swmCharges : 0, [Validators.required, Validators.min(0)]],

      totalamount: [record ? record.AmountPaid : '', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  GeneratePdf() {
    const ownerFormValues = this.ownerForm.value;
    let printContent = `
      <h2>Owner Form Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Field</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Owner Name</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.Ownername}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Property Type</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.PropTypeName}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Assessment Year</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.assessmentYear}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Tax</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.tax}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Cess</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.cess}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Penalty</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.penalty}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">SWM Cess</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.swmCess}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Vehicle Cess</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.vehicleCess}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">UGD Charges</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.ugdCharges}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">SWM Charges</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.swmCharges}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Total Amount</td><td style="border: 1px solid #ddd; padding: 8px;">${ownerFormValues.totalamount}</td></tr>
        </tbody>
      </table>
    `;
  
    const popupWindow = window.open('', '_blank', 'width=800,height=600');
    if (popupWindow) {
      popupWindow.document.open();
      popupWindow.document.write(`
        <html>
        <head>
          <title>Print Owner Form</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
        </html>
      `);
      popupWindow.document.close();
    } else {
      console.error('Failed to open print window');
    }
  }
  


  DraftTaxviewDetails(): void {
    if (this.ownerForm.valid) {
      console.log(this.ownerForm.value);
    } else {
      console.log('Form is invalid');
    }
  }


}




