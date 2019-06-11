import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiHandlerService} from './api-handler.service';
import {UserService} from './user.service';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class AuthenticationService {

  public authenticationUrls = {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout'
  };

  constructor(private http: HttpClient,
              private apiHandler: ApiHandlerService,
              private userService: UserService) {
  }


  public login(data) {
    const path = this.authenticationUrls.login;
    return this.apiHandler.post(path, data);
  }

  public getUserProfile(is_mentor) {
    const path = (is_mentor) ? 'mentors' : 'mentees';
    return this.apiHandler.get(`${path}/my-profile`);

  }

  public registerUser(data) {
    const path = this.authenticationUrls.register;
    return this.apiHandler.post(path, data);
  }

  public logout(action?: string) {
    const path = this.authenticationUrls.logout;
    if (action) {
      this.userService.logout(action);
      return this.apiHandler.post(path);
    }
    this.userService.logout();
    return this.apiHandler.post(path);
  }
}
