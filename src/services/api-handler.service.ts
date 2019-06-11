import {Injectable} from '@angular/core';
// import {Headers, Http, RequestOptions, Response, ResponseContentType} from '@angular/http';
import {Headers, Http, RequestOptions, Response, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {UserService} from './user.service';
import {LogoutTypes} from '../shared/enum/logout.type';
import {ApiConfig} from '../utils/config';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Cache} from '../utils/cache';
import {HttpClient} from '@angular/common/http';

declare const $: any;

@Injectable()
export class ApiHandlerService extends ApiConfig {


  constructor(private http: HttpClient,
              private userService: UserService) {
    super(userService);

  }

  /**
   * This is used catch error
   * @param err
   * @returns {any}
   */
  private errorHandler(err: Response) {
    let friendlyLogoutMessage = '';
    let bodyError = err['message'];
    if (err.status === 401) {
      $('.moda1').modal('hide');
      $('.modal-backdrop').remove();
      if (err['_body'] && err['_body'].constructor === String) {
        // console.log('errBody=', data['_body'], 'type=', data['_body'].constructor);
        bodyError = (err['_body'].indexOf('{') > -1) ? JSON.parse(err['_body'])['errors'] : JSON.parse(err['_body'])['message'];
      }

      friendlyLogoutMessage = 'You have been logged out because your session timed out. You may log in again. <br>' + bodyError;
      this.userService.logout(LogoutTypes.UNAUTHORIZED, bodyError);
      throw (friendlyLogoutMessage || 'Server error');
    }
    return Observable.throw(err || 'Server error');
  }


  /**
   * This is used to make request to fro the apis.
   * @param method
   * @param path
   * @param data
   * @returns {Uint16Array|Uint32Array|[any,any,any]|Float64Array|[any,any,any,any]|any[]|*}
   */
  public callService(method: string = 'POST', path: string = '', data?: string | Object): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    method = method.toUpperCase();
    let url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;
    if (data === undefined || data === null) {
      data = ' ';
    }
    switch (method) {
      case 'POST':
        // return this.http.post(url, (data || {}), this.headers)
        return this.http.post(url, (data || {}), this.headers)
          .catch(this.errorHandler)
          .retryWhen((errors) => {
            return errors
              .mergeMap((error) => this.errorHandler(error))
              .delay(1000)
              .take(2);
          })
          .map((res: Response) => this.dateFormatterInResponse(res));
      case 'PUT':
        return this.http.put(url, (data || {}) || {}, this.headers)
          .retryWhen((errors) => {
            return errors
              .mergeMap((error) => this.errorHandler(error))
              .delay(1000)
              .take(2);
          })
          .catch(this.errorHandler)
          .map((res: Response) => this.dateFormatterInResponse(res));
      case 'GET':
        url = this.checkGetMark(url);
        return this.http.get(`${url}`, this.headers)
          .catch(this.errorHandler)
          .retryWhen((errors) => {
            return errors
              .mergeMap((error) => this.errorHandler(error))
              .delay(1000)
              .take(2);
          })
          .map((res: Response) => this.dateFormatterInResponse(res));
      case 'DELETE':
        url = this.checkGetMark(url);
        return this.http.delete(`${url}`, this.headers)
          .retryWhen((errors) => {
            return errors
              .mergeMap((error) => this.errorHandler(error))
              .delay(1000)
              .take(2);
          })
          .catch(this.errorHandler)
          .map((res: Response) => this.dateFormatterInResponse(res));
      default:
        throw new Error('Request Method does not exist');
    }

  }

  /**
   * This is used to pass post request
   * @param path
   * @param data
   * @returns {Observable<R>}
   */
  public post(path: string, data?: any): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    console.log('HEADERS HEADERS ', this.headers);

    const url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;

    return this.http.post(url, (data || {}), this.headers)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2);
      })
      .catch(this.errorHandler)
      .map((res: Response) => this.dateFormatterInResponse(res));
  }


  /**
   *
   * This is used to pass post request directly to the specified url
   * @param path
   * @param data
   * @param action
   * @returns {Observable<R>}
   *
   */
  public postDirect(path: string, data?: any, action?: string): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    const url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;
    return this.http.post(url, data || {}, this.headers)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2);
      })
      .catch(this.errorHandler)
      .map((res: Response) => this.dateFormatterInResponse(res));
  }

  /**
   *
   * This is used to pass put request
   * @param path
   * @param data
   * @returns {Observable<R>}
   *
   */
  public put(path: string, data?: Object): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    this.authToken = this.userService.getAuthUser();
    const url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;
    return this.http.put(url, (data || {}) || {}, this.headers)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2);
      })
      .catch(this.errorHandler)
      .map((res: Response) => this.dateFormatterInResponse(res));
  }


  /**
   *
   * This is used to pass get request
   * @param path
   * @param data
   * @returns {Observable<R>}
   *
   */
  public get(path: string, paginator?): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    const url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;
    return this.http.get(`${url}`, this.headers)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2);
      })
      .catch(this.errorHandler)
      .map((res: Response) => this.dateFormatterInResponse(res));
  }

  public get_x(path: string, paginator?): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    const url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;
    return this.http.get(`${url}`, this.headers);
  }


  /**
   * This is used to pass delete request
   * @param path
   * @returns {Observable<R>}
   */
  public delete(path: string): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    let url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;
    url = this.checkGetMark(url);
    return this.http.delete(`${url}`, this.headers)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2);
      })
      .catch(this.errorHandler)
      .map((res: Response) => this.dateFormatterInResponse(res));
  }

  /**
   * This is used to check for existence of quotation before injecting login id
   * @param url
   * @returns {string}
   */
  private checkGetMark(url) {
    if (url.indexOf('?') > -1) {
      return `${url}`; // &login_id=${this.authToken['id']}
    } else {
      return `${url}`; // ?login_id=${this.authToken['id']}
    }
  }

  /**
   *
   * @param {Object} data
   * @param formFile
   * @param {string} urlLink
   * @returns {Observable<any>}
   */
  public postFile(data: Object, formFile, urlLink: string, method?): Observable<any> {
    const header = this.setHeaders();
    header.delete('Content-Type');
    this.headers = {headers: header};
    const path = $.param(data);
    const urlPath = (Object.keys(data).length > 0) ? `${urlLink}?${path}` : urlLink;
    const formData = new FormData();
    let file = null;
    if (formFile && formFile.files[0]) {
      file = formFile.files[0];
      console.log('Here is the form file ::', file);
      formData.append('file', file, file.name);
    }
    /*  for (const key in data) {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }*/
    const url = `${ApiHandlerService.API_DEFAULT_URL}${urlPath}`;
    if (method && method == 'PUT') {
      return this.http.put(url, (formData || {}), this.headers)
        .retryWhen((errors) => {
          return errors
            .mergeMap((error) => this.errorHandler(error))
            .delay(1000)
            .take(2);
        })
        .catch(this.errorHandler)
        .map((res: Response) => this.dateFormatterInResponse(res));
    }
    return this.http.post(url, (formData || {}), this.headers)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2);
      })
      .catch(this.errorHandler)
      .map((res: Response) => this.dateFormatterInResponse(res));
  }

  /**
   *
   * @param {Object} data
   * @param formFile without header
   * @param {string} urlLink
   * @returns {Observable<any>}
   */
  public postBulkFile(formFile, urlLink: string): Observable<any> {
    const urlPath = urlLink;
    const formData = new FormData();
    const file = formFile.files[0];
    formData.append('file', file, file.name);
    const url = `${ApiHandlerService.API_DEFAULT_URL}${urlPath}`;
    return this.http.post(url, (formData || {}))
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2)
          .map((map) => console.log('error encountered'));
      })
      .catch(this.errorHandler);
    //.map((res: Response) => this.dateFormatterInResponse(res));
  }


  public putFile(data: Object, formFile, urlLink: string): Observable<any> {
    const header = this.setHeaders();
    header.delete('Content-Type');
    this.headers = {headers: header};
    const path = $.param(data);
    const urlPath = (Object.keys(data).length > 0) ? `${urlLink}?${path}` : urlLink;

    const formData = new FormData();
    const file = formFile.files[0];
    formData.append('file', file, file.name);
    const url = `${ApiHandlerService.API_DEFAULT_URL}${urlPath}`;
    return this.http.put(url, (formData || {}), this.headers)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => this.errorHandler(error))
          .delay(1000)
          .take(2);
      })
      .catch(this.errorHandler)
      .map((res: Response) => this.dateFormatterInResponse(res));
  }


  /**
   *
   * @param path
   * @returns {Observable<string>}
   */
  public getFile(path): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    const url = `${ApiHandlerService.API_DEFAULT_URL}${path}`;
    const returnUrl = new ReplaySubject();
    returnUrl.next(url);
    return Observable.from(returnUrl);
    /*    return this.http.get(`${url}`, this.headers)
          .retryWhen((errors) => {
            return errors
              .mergeMap((error) => this.errorHandler(error))
              .delay(1000)
              .take(2);
          })
          .catch(this.errorHandler)
          .map((res: Response) => {
            // return new Blob([<any>res.arrayBuffer()], { type: 'application/pdf' });
            return url;
          });*/

  }

  public getImage(imageUrl: string): Observable<Blob> {
    this.headers = {headers: this.setHeaders()};
    const options = {headers: this.setHeaders(), responseType: ResponseContentType.Blob};
    // { responseType: ResponseContentType.Blob }
    return this.http.get(imageUrl).map((res: Response) => {
      return new Blob([<any>res.blob()]);
    });
  }

  public getBulkTemplate(templateUrl: string): Observable<Blob> {
    this.headers = {headers: this.setHeaders()};
    const options = {headers: this.setHeaders(), responseType: ResponseContentType.Blob};
    // { responseType: ResponseContentType.Blob }
    return this.http.get(templateUrl).map((res: Response) => {
      return new Blob([<any>res.blob()]);
    });
  }

}
