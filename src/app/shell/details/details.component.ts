import { Component, Inject, OnInit, PLATFORM_ID, ViewContainerRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpComponent } from '../../http.app';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/modal/modal.service';
import { LoginComponent } from '../login/login.component';
import { ShellService } from '../shell.service';

@Component({
  selector: 'app-ditails',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [CurrencyPipe]
})
export class DetailsComponent extends ModalService  implements OnInit {
[x: string]: any;
  // API: string = 'http://192.168.20.106:8000/'
  
  API!:string;
  currentItem: any = {};
  storageOptions: any;
  id: number = 0;
  title: string = "";
  imageArray!: any[];
  authToken!: any;
  cartArray: any = []

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpComponent,
    private shellService: ShellService,
    private router: Router,
    containerRef: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    super(containerRef);
    this.containerRef = containerRef;
  }

  ngOnInit(): void {
    this.getCurentItem();
  }

  getCurentItem(){
    this.route.queryParams.subscribe((e: any) => {
      this.id = e.id,
      this.title = e.appName
    })
    this.httpService.getAPIProducts()
    .subscribe((product: any) => {
      product.forEach((obj: any) => {
        if(obj.id == this.id) {
          this.currentItem = obj;
          if(this.currentItem.images) {
              this.imageArray = this.currentItem.images;
          }
        }
      });
    });
  }

 


  nextImageMetode(elem: any, event: Event) {
    event.stopPropagation();
    const imageArrayLength = elem.images.length;
    setTimeout(() => {
      elem.imageIndex++;
      if (elem.imageIndex >= imageArrayLength) {
        elem.imageIndex = 0;
      }
    }, 803)

    const nextImageUrl = elem.images[elem.imageIndex];
    const imageElement = (event.target as HTMLElement).closest('.image-container')?.querySelector('.card-img-top') as HTMLImageElement | null;
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
    }, 803)

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

  checkAutorithation(elem: any){
    this.authToken = localStorage.getItem('token')
    console.log(this.authToken);
    
    if(this.authToken !== null) {
      this.updateCart(elem)
       
    }else {
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
