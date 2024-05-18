import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, debounceTime, fromEvent, pipe } from 'rxjs';
import { HttpComponent } from 'src/app/http.app';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-new-product.component.html',
  styleUrl: './upload-new-product.component.scss'
})
export class UploadNewProductComponent implements AfterViewInit, OnInit {


  API: string = 'http://localhost:8000/'
  // API: string = "http://188.121.214.12:8000"
  productForm!: FormGroup;
  changrProductForm!: FormGroup;
  productSearchForm!: FormGroup;
  uniqueCategories!: string;
  categoryArray: any[] = [];
  categoryBool: boolean = true;
  productArray: any[] = [];
  imagesArray: any[] = [];
  files!: FileList;
  productId!: number;
  changeObj!: FormData;
  imageArray!: any;
  authToken!: any;
  csrfToken!: any;
  filteredProducts!: any[];
  produstTableArray!: any[];


  imageIndices: number[] = Array(this.productArray.length).fill(0);


  nextButton$: Observable<any> = fromEvent(document, "click");
  


  constructor(private httpServise: HttpComponent,
    private cookieService: CookieService) { }


  ngOnInit(): void {
    this.initForm();
    this.getSelectedData()
    this.getProductMetode();
    this.getProductTable();
  }

  ngAfterViewInit() {

  }


 
  nextImageMetode(elem: any) {
    const imageArrayLength = elem.images.length;
    console.log(imageArrayLength);
    
    elem.imageIndex++;
    if (imageArrayLength <= elem.imageIndex) {
      elem.imageIndex = 0;
    }
}




  initForm() {
    this.productSearchForm = new FormGroup({
      searchProduct: new FormControl('')
    });

    this.productForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      productStyle: new FormControl(''),
      barcode: new FormControl(''),
      sizes: new FormControl('', Validators.required),
      color: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      child_category: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required)
    });


    

    this.changrProductForm = new FormGroup({
      id: new FormControl(''),
      newtitle: new FormControl(''),
      newdescription: new FormControl(''),
      newprice: new FormControl(''),
      newstock: new FormControl(''),
      newproductStyle: new FormControl(''),
      newbarcode: new FormControl(''),
      newsize: new FormControl(''),
      newcolor: new FormControl(''),
      newcategory: new FormControl(''),
      newchild_category: new FormControl('', Validators.required),
      newimage: new FormControl('')
    })
  }

  findProduct() {
    this.productId = this.changrProductForm.get("id")?.value;
    const foundProduct = this.productArray.find((obj: any) => obj.id == this.productId);
    if (foundProduct) {
        this.changeObj = foundProduct;
        console.log(this.changeObj);
        this.imageArray = foundProduct.images
        this.changrProductForm.patchValue({
            newtitle: foundProduct.title,
            newdescription: foundProduct.description,
            newprice: foundProduct.price,
            newstock: foundProduct.stock,
            newproductStyle: foundProduct.productStyle,
            newbarcode: foundProduct.barcode,
            newsizes: foundProduct.sizes,
            newcolor: foundProduct.color,
            newcategory: foundProduct.category,
            newchild_category: foundProduct.newchild_category,
        });
    } else {
        console.error("ID not found");
    }
}

searchProduct() {
  this.productSearchForm.get('searchProduct')?.valueChanges
    .pipe(
      debounceTime(1500)
    )
    .subscribe((value: any) => {
      console.log(value);
      
      if (value.trim().length > 0) {
        this.produstTableArray = this.productArray.filter((product: any) =>
          Object.values(product).some(prop => {
            if (typeof prop === 'string') {
              return prop.toLowerCase().includes(value.toLowerCase());
            } else if (typeof prop === 'number') {
              return prop.toString().includes(value.toLowerCase());
            }
            return false;
          })
          
          
        );
        console.log( this.produstTableArray);
      } else {
        this.produstTableArray = [...this.productArray];
      }
    });
    
}

getProductTable() {
   
}

changeProductMetode() {
  const formDataChange = new FormData();
  
  formDataChange.append('category', this.changrProductForm.get('newcategory')?.value);
  formDataChange.append('newchild_category', this.changrProductForm.get('newchild_category')?.value);
  formDataChange.append('title', this.changrProductForm.get('newtitle')?.value);
  formDataChange.append('description', this.changrProductForm.get('newdescription')?.value);
  formDataChange.append('product_style', this.changrProductForm.get('product_style')?.value);
  formDataChange.append('barcode', this.changrProductForm.get('newbarcode')?.value);
  formDataChange.append('price', this.changrProductForm.get('newprice')?.value);
  formDataChange.append('stock', this.changrProductForm.get('newstock')?.value);
  formDataChange.append('size', this.changrProductForm.get('newsize')?.value);
  formDataChange.append('color', this.changrProductForm.get('newcolor')?.value);
  formDataChange.append('newimages', this.imageArray);

 
  formDataChange.forEach((value, key) => {
    // console.log(`${key}: ${value}`);
  });

  if (localStorage.getItem('token')) {
    this.authToken = localStorage.getItem('token') || '';
    this.csrfToken = this.cookieService.get('csrftoken') || '';
  }
  console.log(this.productId);
  
  this.httpServise.changeProduct(this.productId, formDataChange , this.authToken, this.csrfToken)
  .subscribe(
    (item) => {
      console.log('Secces:', item);
    },
    (error) => {
      console.error('Error:', error);
    }
  );
     
}

  deleteProductMetode(productId: number){
    if (localStorage.getItem('token')) {
      this.authToken = localStorage.getItem('token') || '';
      this.csrfToken = this.cookieService.get('csrftoken') || '';
    }
    this.httpServise.deleteProduct(productId ,this.authToken, this.csrfToken)
    .subscribe(
      
      
      (item) => {
        console.log(productId ,this.authToken, this.csrfToken)
        console.log('Secces:', item);
      },
      (error) => {
        console.log(productId ,this.authToken, this.csrfToken)
        console.error('Error:', error);
      }
    );
  }

  onFileSelected(event: any) {
    if (event.target && event.target.files) {
      this.files = event.target.files;
      // const files = Array.from(this.files).map(file => file.name);
    }
  }




  // onFileSelected(event: any) {
  //   if (event && event.target) {
  //     const file: File = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = (event: ProgressEvent<FileReader>) => {
  //       const base64String = event.target?.result;
  //       if (base64String) {
  //         this.productForm.patchValue({
  //           image: base64String
  //         });
  //         console.log(base64String);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }


  uploadProduct() {
    const formData = new FormData();
    formData.append('id', '');
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('title', this.productForm.get('title')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('product_style', this.productForm.get('productStyle')?.value);
    formData.append('barcode', this.productForm.get('barcode')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('size', this.productForm.get('sizes')?.value);
    formData.append('color', this.productForm.get('color')?.value);
    for (let i = 0; i < this.files.length; i++) {
      formData.append('images', this.files[i]);
    }

   

    this.httpServise.setUpload(formData)
    .subscribe(
      (item) => {
        console.log('Secces:', item);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
       
  }



  getProductMetode() {
    
    this.httpServise.getAPIProducts()
   .subscribe((products: any) => {
      this.produstTableArray = products
      this.productArray = products.map((product: any) => ({
        ...product,
        imageIndex: 0 
        
      }));
    })
    
    
  }

  


  getSelectedData(): void {
    this.httpServise.getAPIProducts().subscribe(
      (response: any[]) => { 
        const array = response;
        const uniqueCategories = new Set();
        array.forEach((product: any) => {
          const category = product.category;
          if (category) {
            uniqueCategories.add(category);
          }
        });
        this.categoryArray = Array.from(uniqueCategories);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  
  

  inputNewCategory() {
    this.categoryBool = !this.categoryBool;
  }

  

}
