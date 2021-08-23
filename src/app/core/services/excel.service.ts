import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }
  async generateExcel(header: any, excelData: any, name: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(name);
    worksheet.columns = header;
    excelData.forEach((d: Object) => {
      worksheet.addRow(d);
    }
    );
    worksheet.getRow(1).font = { bold: true };
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${name}.xlsx`);
    });
  }

  async generateMultipleExcel(headers: any[], excelData: any[], name: any[], fileName: any) {
    const workbook = new Workbook();
    let worksheet;
    name.forEach((title, index) => {
      worksheet = workbook.addWorksheet(title);
      worksheet.state = 'visible';
      worksheet.columns = headers[index];
      excelData[index].forEach((item: any) => {
        // console.log(item.verify_status);
        const { verify_status } = item;
        if (verify_status === '1') {
          item.verify_status = 'Successful';
        } else if (verify_status === '2') {
          item.verify_status = 'Failed';
        } else {
          item.verify_status = 'Unknown';
        }
        worksheet.addRow(item);
      }
      );
      worksheet.getRow(1).font = { bold: true };
      worksheet.addRow([]);
    });
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${fileName}.xlsx`);
    });
  }
}
