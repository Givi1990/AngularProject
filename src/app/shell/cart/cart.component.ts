import { Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { ShellService } from '../shell.service';
import { HttpComponent } from 'src/app/http.app';
import { FormControl, FormGroup } from '@angular/forms';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  user: number;
  products: Product[];
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnChanges {



  cartArray!: any;
  totalPrice: any = 0;
  totalProductPrice: number = 0;
  curentProductQwt: number = 1;
  cartBool: boolean = false;
  API!: string;
  userId!: object;
  productId!: number;
  quantity!: number;
  quantityForm!: FormGroup;
  cartQtyObj!: any;
  orderArray: any = [];
  productsArray!: any;
  userName!: any;
  date!: any;

  @ViewChild('content', { static: false }) content!: ElementRef;

  // @Output() totalPriceChange: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('dataToExport', { static: false })
  public invoice!: ElementRef;

  constructor(private shellServise: ShellService,
    private http: HttpComponent) { }

  ngOnInit(): void {
    this.getApi();
    this.getCartArray();
    this.initForm();
    this.updateCartQtyObj();
    this.getUsername();
    this.getDate();
    this.updateTotalPrice();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  getApi() {
    this.API = this.http.getAPI()
  }


  getUsername() {
    const userStr = localStorage.getItem('user');
    if (userStr !== null) {
        const userObj = JSON.parse(userStr);
        this.userName = userObj.username
    } 
}


getDate() {
  const currentDate = new Date();
  this.date = currentDate.toLocaleDateString();
}

initForm(): void {
  this.getCartArray();

  this.quantityForm = new FormGroup({});
    if(this.cartArray) {
      this.cartArray.forEach((item: any) => {
        item.quantity = item.quantity || 1; 
        item.curentTotalPrice = item.quantity * item.price; 
  
        const control = new FormControl(item.quantity);
  
        control.valueChanges.subscribe((value: any) => {
            item.quantity = value;
            item.curentTotalPrice = value * item.price;
            localStorage.setItem('cartArray', JSON.stringify(this.cartArray)); 
            this.totalPrice = this.cartArray.reduce((total: any, item: any) => total + item.curentTotalPrice, 0).toFixed(2);
            localStorage.setItem('totalPrice', this.totalPrice);
        });
        this.totalPrice += item.curentTotalPrice;
        localStorage.setItem('totalPrice', this.totalPrice);
        this.quantityForm.addControl(item.title, control);
    });
    }
  
}




// addNewItem(value: number) {
//   console.log('cart', value);
//   this.totalPriceChange.emit(value);
// }


updateTotalPrice(){
  const storedTotalPrice = localStorage.getItem('totalPrice');
  if (storedTotalPrice) {
      this.totalPrice = parseFloat(storedTotalPrice).toFixed(2);
  } else {
      this.totalPrice = '0.00';
  }
}

getCartArray() {
    const storedCart = localStorage.getItem('cartArray');
    if (storedCart) {
        this.cartArray = JSON.parse(storedCart);
    }
}




  updateCartQtyObj() {
    this.cartQtyObj = this.quantityForm.value;
    
}

  removeFromCart(obj: any) {
    const storedCart = localStorage.getItem('cartArray');
    if (storedCart) {
      const storedCartP = JSON.parse(storedCart);
      const indexToRemove = storedCartP.findIndex((elem: any) => elem.id === obj.id);
      this.shellServise.removeFromCart(obj)
      if (indexToRemove !== -1) {
        storedCartP.splice(indexToRemove, 1);
        this.cartArray = storedCartP;
        localStorage.setItem("cartArray", JSON.stringify(this.cartArray));
        this.totalPrice = this.cartArray.reduce((total: any, item: any) => total + item.curentTotalPrice, 0).toFixed(2);
        localStorage.setItem('totalPrice', this.totalPrice);
        this.shellServise.removeFromCart(obj)
        
        
      }
    }
  }

  

  postOrder() {
    this.initForm();
    // this.getCartArray();

    const userNameObj = localStorage.getItem('user');
    if (userNameObj) {
      const userObject = JSON.parse(userNameObj);
      this.userId = userObject.id;
    }

    const cartArrayString = localStorage.getItem('cartArray');
if (cartArrayString) {
  const cartArray = JSON.parse(cartArrayString);
  this.productsArray = cartArray.map((product: any) => {
    return {
      product: product.id,
      quantity: product.quantity 
    };
  });
}
    

    this.orderArray = {user: this.userId, products: this.productsArray}

    console.log('orderArray:', this.orderArray);

    this.http.setAPIOrder(this.orderArray);
  }

  getOrders() {
    this.http.getAPTOrder().subscribe((orders: any) => {
      this.orderArray = orders; 
  
      this.cartArray = [];
      this.totalPrice = 0;
  
      orders.forEach((order: any) => {
        this.cartArray.push({
            id: order.product.id,
            title: order.product.title,
            price: order.product.price,
            quantity: order.product.quantity 
        });
        this.totalPrice += order.product.price * order.product.quantity ;
      });
    });
  }





}

