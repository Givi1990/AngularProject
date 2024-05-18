import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const isProtectedEndpoint = request.url.includes('/api');
      
      if (isProtectedEndpoint) { 
        request = request.clone({
          setHeaders: {
            Authorization: `Token ${token}`
          }
        });
      }
    }

    return next.handle(request);
  }
}
