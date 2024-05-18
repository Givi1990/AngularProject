import { Pipe, PipeTransform } from '@angular/core';
import {dictinary} from './dictinary'


@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
 

    transform(value: string, ...args: string[]): any {
        const translation: any = dictinary.find(item => value  == item.key);
          return translation[args[0]]; 
      }
}
