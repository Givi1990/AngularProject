import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { log } from 'util';

@Injectable({
  providedIn: "root"
})
export class ShellService {
  [x: string]: any;
  cartArray: any[] = []
 
  private searchValueSubject = new BehaviorSubject<string>('');
  private selectedCategoriesSubject = new BehaviorSubject<string[]>([]); 
  private selectedBrandsSubject = new BehaviorSubject<string[]>([]);
  private selectedProductSubject = new BehaviorSubject<string[]>([]);
  onCartUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor() {}

  

  setValue(value: string) {
    this.searchValueSubject.next(value);
  }

  getValue(): Observable<string> {
    return this.searchValueSubject.asObservable();
  }

  addSelectedCategory(category: string): void {
    const updatedCategories = [...this.selectedCategoriesSubject.value, category];
    this.selectedCategoriesSubject.next(updatedCategories);
    
  }

  removeSelectedCategory(category: string): void {
    const updatedCategories = this.selectedCategoriesSubject.value.filter((c) => c !== category);
    this.selectedCategoriesSubject.next(updatedCategories);
  }

  isSelectedCategory(category: string): boolean {
    return this.selectedCategoriesSubject.value.includes(category);
  }

  getSelectedCategories(): Observable<string[]> {
    return this.selectedCategoriesSubject.asObservable();
  }

  addSelectedBrand(brand: string): void {
    const currentBrands = this.selectedBrandsSubject.value;
    this.selectedBrandsSubject.next([...currentBrands, brand]);
  }

  removeSelectedBrand(brand: string): void {
    const currentBrands = this.selectedBrandsSubject.value;
    const updatedBrands = currentBrands.filter((b) => b !== brand);
    this.selectedBrandsSubject.next(updatedBrands);
  }

  isSelectedBrand(brand: string): boolean {
    return this.selectedBrandsSubject.value.includes(brand);
  }

  getSelectedBrands(): Observable<string[]> {
    return this.selectedBrandsSubject.asObservable();
  }

  addToCart(obj: string[]): void {
    console.log('add', obj);
    this.selectedProductSubject.next([]);
    localStorage.setItem("cartArray", '')
    const currentCart = this.selectedProductSubject.value; 
    const updatedCart = currentCart.concat(obj); 
    localStorage.setItem("cartArray", JSON.stringify(updatedCart))
    this.selectedProductSubject.next(updatedCart); 
    this.onCartUpdate.next(true);
}

removeFromCart(obj: string[]): void {
  console.log('rem',obj);
  const currentCart = this.selectedProductSubject.value;
  const updatedCart = currentCart.filter(item => !obj.includes(item)); 
  this.selectedProductSubject.next(updatedCart); 
  this.onCartUpdate.next(true);
}

getCart(): Observable<any[]> {
    return this.selectedProductSubject.asObservable(); 
}




}


