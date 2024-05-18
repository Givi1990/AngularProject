import { Component, EventEmitter, Output, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpComponent } from 'src/app/http.app';
import { ModalService } from 'src/app/modal/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends ModalService {
  registrationForm!: FormGroup;
  loginForm!: FormGroup;
  gotoRegGoToLog: boolean = true;
  users!: any[];
  userInfo!: any;
  

  @Output() userName = new EventEmitter<FormData>();


  constructor(
    private router: Router,
    private http: HttpComponent,
    containerRef: ViewContainerRef,
    private cookieService: CookieService
  ) {
    super(containerRef);
    this.containerRef = containerRef;
  }

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.registrationForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      city: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl('')
    })
    this.loginForm = new FormGroup({
      usernameLog: new FormControl('', [Validators.required]),
      passwordLog: new FormControl('', [Validators.required])
    })
  }

  registration() {
    const formData = new FormData();
    formData.append('id', '');
    formData.append('username', this.registrationForm.get('username')?.value);
    formData.append('email', this.registrationForm.get('email')?.value);
    formData.append('password', this.registrationForm.get('password')?.value);
    formData.append('city', this.registrationForm.get('city')?.value);
    formData.append('address', this.registrationForm.get('address')?.value);
    formData.append('phone', this.registrationForm.get('phone')?.value);


    console.log("regist", formData);

    this.http.setAPINewUser(formData)
      .subscribe(
        (response: any) => {

          if (response) {
            localStorage.setItem("token", response.token)
            console.log(response.token);

            localStorage.setItem("user", JSON.stringify(response.user));

            this.userInfo = response.user
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }


        },
        error => console.error('Error:', error)
      );
    setTimeout(() => {
      this.router.navigate(['..shell/catalogue']);
      this.closeModal();
      this.relodadWindow();
    }, 2000)

  }

  login() {
    const loginPost = new FormData();
    loginPost.append('username', this.loginForm.get('usernameLog')?.value);
    loginPost.append('password', this.loginForm.get('passwordLog')?.value);

    this.http.setAPIUsers(loginPost)
      .subscribe(
        (response: any) => {

          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user));
          setTimeout(() => {
            this.closeModal();
            this.relodadWindow();
          }, 1000)
          
        },
        error => console.error('Error:', error)
      );
  }

  relodadWindow() {
      window.location.reload();
  }



  goToRegistr() {
    if (typeof window !== "undefined") {
      this.gotoRegGoToLog = !this.gotoRegGoToLog
    }
  }


  // firstLetterUpperCase(): ValidatorFn {
  //     return (control: AbstractControl): { [key: string]: any } | null => {
  //       const value: string = control.value;
  //       if (value && value.length > 0) {
  //         const firstLetter = value.charAt(0);
  //         if (firstLetter !== firstLetter.toUpperCase()) {
  //           return { firstLetterUpperCase: true };
  //         }
  //       }
  //       return null;
  //     };
  //   }  

  // calculateAge(birthday: any): any {
  //   const birthDate: Date = new Date(birthday);
  //   const currentDate: Date = new Date();
  //   const diffMs: number = currentDate.getTime() - birthDate.getTime();
  //   const msInYear: number = 1000 * 60 * 60 * 24 * 365.25;
  //   const age: number = Math.floor(diffMs / msInYear);
  //       return age;
  //   }


  closeLoginModal() {
    this.closeModal();
  }

}
