import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SetupService} from '../services/api-folder/setup-service';
import {MagicClasses} from '../shared/magic-methods/classes';
import {NotificationService} from '../services/notification.service';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent extends MagicClasses implements OnInit {

  public allMedicalRecords: any[] = [];
  public medicalrecordToEdit: any;
  public editedIndex: number;
  public createMedicalRecordForm: FormGroup;
  public updateMedicalRecordForm: FormGroup;

  constructor(
    private setupService: SetupService,
    private notification: NotificationService,
    private fb: FormBuilder) {
    super();
    this.createMedicalRecordForm = this.fb.group(AppComponent.createMedicalRecordForm());
    // this.updateMedicalRecordForm = this.fb.group(AppComponent.updateMedicalRecordForm());
  }

  static createMedicalRecordForm = () => {
    return {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      livingWithDiabetes: ['', Validators.required],
    };
  };

  // static updateMedicalRecordForm = () => {
  //   return {
  //     firstName: ['', Validators.required],
  //     lastName: ['', Validators.required],
  //     gender: ['', Validators.required],
  //     age: ['', Validators.required],
  //     city: ['', Validators.required],
  //     country: ['', Validators.required],
  //     livingWithDiabetes: ['', Validators.required],
  //   };
  // };

  ngOnInit() {
    this.getAllMedicalRecords();
  }

  private async getAllMedicalRecords() {
    // this.resetLoaderAndMessage();
    await this.setupService.getAllMedicalRecords().subscribe(
      (categoriesResponse) => {
        // this.resetLoaderAndMessage();
        this.allMedicalRecords = categoriesResponse['data'];
        this.triggerTable();
      },
      (error) => {
        // this.resetLoaderAndMessage();
        // this.notification.error(this.processErrors(error));
      });
  }

  public async createMedicalRecord() {

    this.allMedicalRecords.push(this.createMedicalRecordForm.value);

    this.resetLoaderAndMessage();
    await this.setupService.createMedicalRecord(this.createMedicalRecordForm.value).subscribe(
      (newMedicalRecordResponse) => {
        this.resetLoaderAndMessage();
        this.createMedicalRecordForm.reset();
        this.allMedicalRecords.unshift(newMedicalRecordResponse['data']);
        this.notification.success('MedicalRecord Successfully Created!');
        this.triggerModal('close', 'create_medicalrecord');
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error(this.processErrors(error));
      });
  }


  public viewMedicalRecord(ind) {
    this.editedIndex = ind;
    this.medicalrecordToEdit = this.allMedicalRecords[ind];
    this.updateMedicalRecordForm.patchValue(this.medicalrecordToEdit);
    this.triggerModal('open', 'view_medicalrecord');
  }

  private triggerTable() {
    if (this.allMedicalRecords.length > 0) {
      this.renderTable();
    }
  }


  private async readJsonData(file, callback, writeData) {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    await rawFile.open('GET', file, true);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
        const responseData = JSON.parse(rawFile.response);
        if (writeData) {
          responseData['data'].push(writeData);
          rawFile.open('POST', file, true);
          rawFile.send(writeData);
        }
        callback(responseData);
      }
    };
    rawFile.send(null);
  }


}
