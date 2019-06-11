import {Observable} from 'rxjs/Observable';
import {SetupService} from '../../services/api-folder/setup-service';
import {AbstractControl} from '@angular/forms';
import * as UI from './ui';

declare const $: any;


export class MagicClasses {

  // constructor(public _setUp: SetupService) {
  // }
  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };


  public loaders = {
    processing: false
  };

  public messages = {
    create: 'Save',
    update: 'Update'
  };

  public resetLoaderAndMessage() {
    this.loaders.processing = !this.loaders.processing;
    this.messages.create = (this.loaders.processing) ? 'Saving...' : 'Save';
    this.messages.update = (this.loaders.processing) ? 'Updating' : 'Update';
  }

  public setClass(statusName) {
    if (statusName) {
      switch (statusName.toLowerCase()) {
        case 'pending':
          return 'badge-warning';
        case 'confirmed':
          return 'badge-info';
        case 'fulfilled':
          return 'badge-success';
        case 'partially fulfilled':
          return 'badge-purple';
      }
    }
  }

  public setClassByNumber(enabled) {
    return (enabled) ? 'badge badge-success' : 'badge badge-danger';

  }

  public triggerModal(action: string, modalId: string, modalIsStatic?: string) {
    if (modalIsStatic) {
      $(`#${modalId}`).modal({
        backdrop: 'static',
        keyboard: false
      });
    }
    (action === 'open') ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });
  }

  public selectWhereId(data: any[], key, id) {
    const dataItem: any[] = [];
    data.forEach(item => {
      const itemKey = parseInt(item[key], 10);
      const itemId = parseInt(id, 10);
      if (itemKey === itemId) {
        dataItem.push(item);
      }
    });
    return dataItem[0];
  }

  // public processEntity(entityObject, action, data?: any, entityId?): Observable<any> {
  //     return this._setUP.processEntity(entityObject, action, data || null, entityId || null);
  // }
  //
  public processErrors(error): string {
    let errorBody = '';
    const errors = error['error']['errors'];
    if (errors) {
      for (const key in errors) {
        errorBody += errors[key].toString() + '<br>';
      }
    } else if (error['error']['message']) {
      errorBody = error['error']['message'];
    } else if (error['message']) {
      errorBody = error['message'];
    }
    return errorBody;
  }

  public hasRequiredField(abstractControl: AbstractControl): boolean {
    if (abstractControl.validator) {
      const validator = abstractControl.validator({}as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    if (abstractControl['controls']) {
      for (const controlName in abstractControl['controls']) {
        if (abstractControl['controls'][controlName]) {
          if (this.hasRequiredField(abstractControl['controls'][controlName])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  public setValidationClass(formIsValid): string {
    return (formIsValid) ? 'btn btn-green' : 'btn btn-primary';
  }

  public setUserPermissions(userPermissions: any[], routeName: string): string[] {
    return userPermissions.filter((userPermission) => {
      return userPermission.route.endsWith(routeName);
    }).map(listPermissions => {
      return listPermissions.route.split('.').join('_');
    });
  }

  public renderTable(id = ''): void {
    UI.run(id);
  }

  public deepCopy(object){
    return JSON.parse(JSON.stringify(object));
  }


}
