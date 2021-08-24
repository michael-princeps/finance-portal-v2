import { Pipe, PipeTransform } from '@angular/core';
import { banks } from 'src/app/banks';

@Pipe({
  name: 'bankName'
})
export class BankNamePipe implements PipeTransform {

  transform(value: unknown): string {
    if (value) {
      const foundbank = banks.find(bank => bank.bankcode === value);
      if (foundbank) {
        return foundbank.name;
      } else {
        return 'N/A';
      }
    } else {
      return 'N/A';
    }
  }

}
