import { AfterViewInit, Component,  HostListener, Inject, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewContainerRef } from '@angular/core';
import { HttpComponent } from '../http.app';
import { ShellService } from './shell.service';
import { LoginComponent } from './login/login.component';
import { ModalService } from '../modal/modal.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from '../guard.service';
import { Router } from '@angular/router';
import { DOCUMENT, PlatformLocation, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  

})
export class ShellComponent extends ModalService implements OnInit, OnChanges {
  inputValue = '';
  drop: boolean = false;
  category!: string;
  brand!: string;
  categoryArray!: any[];
  brandArray!: any[];
  productsArray!: any[];
  originalProductArray!: any[];
  searchingValue!: string;
  iconBool: boolean = false;
  userBool: boolean = false;
  uploadBoll: boolean = false;
  authToken!: any;
  csrfToken!: any;
  cartBool: boolean = false;
  cartArray: any[] = [];
  API!: string;
  totalPrice$!: Observable<number>;
  totalPrice!: any;
  // screenWidth: number = window.innerWidth;
  navbool: boolean = false;
  userNameBoll: boolean = true;
  userNameValue: any;
  lang: string = 'geo'

  constructor(
    private http: HttpComponent,
    public service: ShellService,
    private authservice: AuthGuard,
    containerRef: ViewContainerRef,
    private routes: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private dom: Document,
    private platformLocation: PlatformLocation,
    private cookieService: CookieService

  ) {
    super(containerRef);
    this.containerRef = containerRef;
    this.service.onCartUpdate.subscribe(() => {
      this.getCartArray();
    });
    

    
  }

  // @Input() nameOFUser!: string;
  // @ViewChild(LoginComponent) loginComponent!: LoginComponent;


  ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId) && typeof window !== "undefined") {
    //   this.screenWidth = window.innerWidth;
    //   this.iconBool = this.screenWidth < 992; 
    //   window.addEventListener('resize', this.screenWidthMetode.bind(this));
    // }
    this.getCategoriesMetode();
    this.uploadGuard();
    this.getCartArray();
    this.getApi();
    this.getChildCategoriesMetode();
    this.getUsername();
    this.cartTotalPrice()
    
   
  }




  ngOnChanges(changes: SimpleChanges): void {
    this.getUsername();
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.screenWidthMetode();
  //   }
  // }

  // screenWidthMetode() {
  //   if(typeof window !== "undefined") {
  //     this.screenWidth = window.innerWidth;
  //   }
  //   this.iconBool = this.screenWidth < 992;
    
  // }

  

  getApi() {
    this.API = this.http.getAPI()
  }

 

  getUsername() {
    const userNameObj = localStorage.getItem('user')
    if (userNameObj) {
      const userObject = JSON.parse(userNameObj);
      this.userNameValue = userObject.username
      if (this.userNameValue) {
        this.userNameBoll = false;
      } else {
        this.userNameBoll = true;
      }
    }
  }

  uploadGuard() {
    const userStr = localStorage.getItem("user");
    if (userStr !== null) {
      const user = JSON.parse(userStr);
      this.uploadBoll = user.admin;
    }
  }

  dropdownMenu() {
    this.drop = !this.drop
  }

  getCategoriesMetode() {
    this.http.getAPIProducts()
      .subscribe((products: any[]) => {
        const productCategories = products.map(product => product.category);
        this.categoryArray = Array.from(new Set(productCategories.map(category => category)));
      });
  }

  getChildCategoriesMetode() {
    this.http.getAPIProducts()
      .subscribe((products: any[]) => {
        const productCategories = products.map(product => product.child_category);
        this.brandArray = Array.from(new Set(productCategories))
      });
  }

  updateValue(): void {
    this.service.setValue(this.inputValue);
    console.log(this.inputValue);
    
  }

  updateCheckBoxCategory(category: string): void {
    if (this.service.isSelectedCategory(category)) {
      this.service.removeSelectedCategory(category);
    } else {
      this.service.addSelectedCategory(category);
    }
  }

  updateCheckBoxBrand(brand: string): void {
    if (this.service.isSelectedBrand(brand)) {
      this.service.removeSelectedBrand(brand);
    } else {
      this.service.addSelectedBrand(brand);
    }
  }





  openComponent() {
    this.openModal(LoginComponent);
    this.userBool = false;
  }

  openUser() {
    this.userBool = !this.userBool;
  }


 

  logout() {
    if (localStorage.getItem('token')) {
      this.authToken = localStorage.getItem('token') || '';
      this.csrfToken = this.cookieService.get('csrftoken') || '';
    }


    this.http.setAPIUserLogout(this.authToken, this.csrfToken).subscribe(result => {
      if (result) {
        console.log('secsess');
        if (isPlatformBrowser(this.platformId) && typeof window !== "undefined") {
          window.location.reload();
        }
      } else {
        console.log('error');
      }
    });

  }

  // handleTotalPriceChange(event: any): void {
  //   this.totalPrice = event;
  //   console.log('this.totalPrice',this.totalPrice);
  //   console.log('totalPrice',event);
  // }

  cartDropdown(event: any) {
    this.cartBool = !this.cartBool
  }

  checkCart() {
    if (localStorage.getItem('token')){
    this.routes.navigate(["./shell/cart"]);
  }else {
    this.openModal(LoginComponent)
  }
    this.cartBool = false;
  }

  getCartArray() {
    const storedCart = localStorage.getItem('cartArray');
    if (storedCart) {
      this.service.getCart()
      this.cartArray = JSON.parse(storedCart);
  
      this.totalPrice = this.cartArray.reduce((total: number, obj: any) => total + obj.price, 0).toFixed(2);
      
        const totP = localStorage.getItem('totalPrice')
        if(totP == '0') {
          localStorage.setItem('totalPrice', this.totalPrice.toString());
        }

     
      this.cartTotalPrice()
    }
  }

  cartTotalPrice(){
    let somePrice = localStorage.getItem("totalPrice")
    if(somePrice){
      this.totalPrice = JSON.parse(somePrice)
    }
  }


  toggleLanguage(): void {
    this.lang = (this.lang === 'geo') ? 'eng' : 'geo'; 
  }

}
