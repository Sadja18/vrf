import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {  IonicModule, ModalController } from '@ionic/angular';

import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar,IonSelect,IonSelectOption  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-field-modal',
  templateUrl: './edit-field-modal.component.html',
  styleUrls: ['./edit-field-modal.component.scss'],
  imports: [
    IonicModule, CommonModule, FormsModule, ReactiveFormsModule
      // IonHeader, CommonModule, 
      // IonContent, IonTitle, 
      // IonToolbar, IonButton, 
      // IonButtons, IonItem, 
      // IonAvatar, IonLabel,
      // IonSelect,
      // ReactiveFormsModule,
      // FormsModule,
      // CommonModule, IonicModule
    ]
})
export class EditFieldModalComponent  implements OnInit {
  @Input() fieldName: string = ''; // Display name of the field being edited
  @Input() existingValue: any; // Current value of the field
  @Input() fieldType: string = 'text'; // Input type: text, radio, select, etc.
  @Input() options: { value: string, label: string }[] = []; // Options for dropdowns or radios
  form: FormGroup; // Form for the modal

  constructor(private formBuilder: FormBuilder, private modalController: ModalController) {
    this.form = this.formBuilder.group({
      value: ['', Validators.required] // Generic control to bind the input
    });
  }


  

  ngOnInit() {
    // Initialize the form with the existing value
    this.form.controls['value'].setValue(this.existingValue);

    // Add validators dynamically based on the field type
    if (this.fieldType === 'text') {
      this.form.controls['value'].setValidators([Validators.required, Validators.maxLength(200)]);
    } else if (this.fieldType === 'number') {
      this.form.controls['value'].setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
    } else if (this.fieldType === 'datetime') {
      this.form.controls['value'].setValidators([Validators.required]);
    }
  }

  dismissModal() {
    this.modalController.dismiss(); // Close the modal without saving
  }

  saveChanges() {
    if (this.form.valid) {
      this.modalController.dismiss(this.form.value.value); // Pass back the updated value
    }
  }

}
