import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ModalService } from './modal/modal.service';
import { LoginComponent } from './shell/login/login.component';
import { TokenInterceptor } from './tokenInterceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  implements CanActivate {
  token!: any;

  constructor(private router: Router,
              private tokenIn: TokenInterceptor) {
   
  }

  canActivate(): boolean {
    console.log('AuthGuard canActivate() method called');
    this.tokenIn.intercept
    

    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    
    if (this.token) {
      console.log('Authenticated');
      return true; 
    } else {
      console.log('Not authenticated');
      // this.openModal(LoginComponent)
      return false; 
    }
  }
}
