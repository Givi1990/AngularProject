// http.component.ts
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, catchError, map, of,tap} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class HttpComponent  {
    constructor(public HttpServise: HttpClient,
        private cookieService: CookieService,
        @Inject(PLATFORM_ID) private platformId: any){}

    // API: string = 'http://188.121.214.12:8000/'
    // API: string = 'http://localhost:8000/'
    API: string ='http://46.49.78.136:8000/'

    getAPI() {
        return this.API;
    }

    setAPIUsers(params: FormData) {
        return this.HttpServise.post<FormData>(this.API + 'api/login/', params);        
    }

    setAPINewUser(params: FormData) {
        return this.HttpServise.post<FormData>(this.API + 'api/register/', params);          
    }

    getAPTUser(authToken: string, csrfToken: string) {
        const headers = new HttpHeaders({
          'Authorization': `Token ${authToken}`,
          'X-CSRFTOKEN': csrfToken
        });
        return this.HttpServise.get('api/user/me', { headers: headers });
      }
    

    setAPIUserLogout(authToken: string, csrfToken: string): Observable<Object> {
        const headers = new HttpHeaders({
            'Authorization': `Token ${authToken}`,
            'X-CSRFTOKEN': csrfToken
        });
        
        return this.HttpServise.post(this.API + 'api/logout/', {}, { headers })
            .pipe(
                tap(() => {
                    console.log('Request successful');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user')
                }),
                catchError(error => {
                    console.error('Error during logout request:', error);
                    return of(false); 
                })
            );
    }

    setUpload(params: FormData) {
        return this.HttpServise.post<FormData>(this.API + 'api/product/', params);          
    }

    changeProduct(id: number, form: FormData, authToken: string, csrfToken: string) {
        const headers = new HttpHeaders({
            'Authorization': `Token ${authToken}`,
            'X-CSRFTOKEN': csrfToken
        });
    
        return this.HttpServise.put<FormData>(this.API + 'api/product/' + id + "/", form, { headers });
    }

    deleteProduct(id: number, authToken: string, csrfToken: string) {
        const headers = new HttpHeaders({
            'Authorization': `Token ${authToken}`,
            'X-CSRFTOKEN': csrfToken
        });
    
        return this.HttpServise.delete<FormData>(this.API + 'api/product/' + id + "/", { headers });
    }
    

    getAPIProducts() {
            return this.HttpServise.get(this.API + 'api/product/')
                .pipe(
                    map((res: any) => res.results)
                );
        }

    setAPIOrder(params: FormData) {
            return this.HttpServise.post<FormData>(this.API + 'api/order/', params);        
        } 
        
    getAPTOrder() {
        return this.HttpServise.get(this.API + '/api/order')
    }    
       
}
