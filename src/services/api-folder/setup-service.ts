import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
// import {ResolveApiUrls} from '../../shared/magic-methods/resolveApiUrls';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SetupService {

  constructor(private apiService: ApiHandlerService) {

  }


  /**
   * This method retrieves all Materials
   * and returns an observable stream
   */

  public getAllMedicalRecords(): Observable<any> {
    return this.apiService.get('medical_records');
  }


  public createMedicalRecord(data, isFile = false): Observable<any> {
    if (isFile) {
      return this.apiService.postBulkFile(data, 'medical_record');
    }
    return this.apiService.post('materials', data);

  }
}


