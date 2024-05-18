import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { log } from 'console';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class ModalService {

  constructor(public containerRef: ViewContainerRef) { }
  static modalContainer: ComponentRef<any>;

  public openModal(component: any) {
    ModalService.modalContainer = this.containerRef.createComponent(component);
}

  public closeModal () {
      ModalService.modalContainer.destroy();
  }

}
