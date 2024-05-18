import { Component, Inject, OnInit, PLATFORM_ID, ViewContainerRef } from '@angular/core';
import { HttpComponent } from '../../http.app';
import { ShellService } from '../shell.service';
import { Observable, combineLatest, forkJoin, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router'; import { LoginComponent } from '../login/login.component';
import { ModalService } from 'src/app/modal/modal.service';
import { log } from 'console';
;

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent extends ModalService implements OnInit {

  productsArray: any[] = [];
  searchingValue: string = '';
  originalProductsArray: any[] = [];
  categories$!: Observable<string[]>;
  brands$!: Observable<string[]>;
  filteredProducts: any[] = [];
  authToken!: any;
  override containerRef: ViewContainerRef;
  cartArray: any[] = [];
  API!: string;

  imageIndices: number[] = Array(this.productsArray.length).fill(0);
  totalPages!: number;
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPagesArray!: number[];


  // nextButton$: Observable<any> = fromEvent(document, "click");


  constructor(private http: HttpComponent,
    private shellService: ShellService,
    private router: Router,
    containerRef: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    super(containerRef);
    this.containerRef = containerRef;
  }

  ngOnInit(): void {
    this.getProductsMethod();
    this.getSearchingValue();
    this.getCategory();
    this.getBrand();
    this.selectFilterMetod();
    this.getApi();
    this.updateFilterOnDeselect();
  }

  getApi() {
    this.API = this.http.getAPI()
  }


  getProductsMethod() {
    this.http.getAPIProducts()
      .pipe(
        map((response: any) => response)
      )
      .subscribe((data: any) => {
        this.originalProductsArray = data.map((product: any) => ({
          ...product,
          imageIndex: 0
        }));
        this.productsArray = [...this.originalProductsArray];
        this.totalPages = Math.ceil(this.productsArray.length / this.itemsPerPage);
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, index) => index + 1);
      });
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.productsArray.length - 1);
  }

  get currentPageProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage - 1, this.productsArray.length - 1);
    return this.productsArray.slice(startIndex, endIndex + 1);
  }






  getSearchingValue() {
    this.shellService.getValue().subscribe((val: string) => {
      this.searchingValue = val;
      this.filterProducts();
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.productsArray.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  filterProducts() {
    if (this.searchingValue.trim().length > 0) {
      this.productsArray = this.originalProductsArray.filter(product =>
        Object.values(product).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(this.searchingValue.toLowerCase());
          }
          return false;
        })
      );
    } else {
      this.productsArray = [...this.originalProductsArray];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  getCategory() {
    this.categories$ = this.shellService.getSelectedCategories();
    this.categories$.subscribe((categories: string[]) => {
    });
  }

  getBrand() {
    this.brands$ = this.shellService.getSelectedBrands();
    this.brands$.subscribe((brand: string[]) => {
    });
  }

  updateFilterOnDeselect() {
    this.shellService.getSelectedCategories().subscribe(categories => {
      this.selectFilterMetod();
    });
    this.shellService.getSelectedBrands().subscribe(brands => {
      this.selectFilterMetod();
    });
  }

  selectFilterMetod() {
    combineLatest([
      this.shellService.getSelectedCategories(),
      this.shellService.getSelectedBrands()
    ]).pipe(
      switchMap(([categories, brands]) => {
        if (categories.length === 0 && brands.length === 0) {
          return of(this.originalProductsArray);
        } else {
          const filteredProducts = this.productsArray.filter(product =>
            (categories.length === 0 || categories.includes(product.category)) &&
            (brands.length === 0 || brands.some(brand => product.child_category.includes(brand)))
          );
          return of(filteredProducts);
        }
      })
    ).subscribe(filteredProducts => {
      this.productsArray = filteredProducts;
      this.currentPage = 1;
      this.updatePagination();
    });
  }


  nextImageMetode(elem: any, event: Event) {
    event.stopPropagation();
    const nextImageUrl = elem.images[elem.imageIndex];
    const imageElement = (event.target as HTMLElement).closest('.image-container')?.querySelector('.card-img-top') as HTMLImageElement | null;
    const imageArrayLength = elem.images.length;
    setTimeout(() => {
      elem.imageIndex++;
      if (elem.imageIndex >= imageArrayLength) {
        elem.imageIndex = 0;
      }
    }, 801)


    if (imageElement) {
      imageElement.classList.add('move-left');
      setTimeout(() => {
        imageElement.classList.remove('move-left');
        imageElement.src = this.API + nextImageUrl;
      }, 800);
    }
  }

  prevImageMetode(elem: any, event: Event) {
    event.stopPropagation();
    const imageArrayLength1 = elem.images.length;
    setTimeout(() => {
      elem.imageIndex--;
      if (elem.imageIndex < 0) {
        elem.imageIndex = imageArrayLength1 - 1;
      }
    }, 801)

    const nextImageUrl = elem.images[elem.imageIndex];
    const imageElement = (event.target as HTMLElement).closest('.image-container')?.querySelector('.card-img-top') as HTMLImageElement | null;
    if (imageElement) {
      imageElement.classList.add('move-right');
      setTimeout(() => {
        imageElement.src = this.API + nextImageUrl;
        imageElement.classList.remove('move-right');
      }, 800);
    }
  }

  navigateToDetails(elem: any) {
    this.router.navigate(['./shell/details'],
      {
        queryParams:
        {
          id: elem.id,
          title: elem.title,
        }
      });
  }

  checkAutorithation(elem: any) {
    this.authToken = localStorage.getItem('token')
    console.log(this.authToken);

    if (this.authToken !== null) {
      this.updateCart(elem);

    } else {
      this.openModal(LoginComponent)
    }
  }



  updateCart(elem: any) {
    const array = localStorage.getItem("cartArray");
    if (array) {
      this.cartArray = JSON.parse(array);
      this.cartArray.push(elem);
      this.shellService.addToCart(this.cartArray);
      localStorage.setItem("cartArray", JSON.stringify(this.cartArray));
    } else {
      this.cartArray.push(elem);
      localStorage.setItem("cartArray", JSON.stringify(this.cartArray));
      this.shellService.addToCart(this.cartArray);
    }
  }




}


