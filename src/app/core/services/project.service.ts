import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
// import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  oldpath = 'https://system.creditwallet.ng/public/';
  constructor(private http: HttpClient) { }
  // pagination

  fetchMoreRecords(url, data) {
    return this.http.post(url, data);
  }

  // dashboard
  fetchDashboard(details) {
    return this.http.post(`${environment.api}finance/dashboard`, details);
  }

  // excel
  // public exportAsExcelFile(json: any[], excelFileName: string): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  //   const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, excelFileName);
  // }
  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  // }

  // liquidation
  createLiquidationRequest(details) {
    return this.http.post(`${environment.api}liquidation/initiate/new`, details);
  }

  listLiquidations(details) {
    return this.http.post(`${environment.api}liquidation/list`, details);
  }

  viewSingleLiquidation(id) {
    return this.http.post(`${environment.api}liquidation/one`, { id });
  }

  fetchLiquidationReports(data) {
    return this.http.post(`${environment.api}liquidation/report`, data);
  }

  liquidateManually(data) {
    return this.http.post(`${environment.api}liquidation/liquidate/manual`, data);
  }

  updateLiquidationStatus(data) {
    return this.http.post(`${environment.api}liquidation/set/option`, data);
  }

  // refunds
  fetchRefundDetails(data) {
    return this.http.post(`${environment.api}refund/fetch`, data);
  }

  initiateRefundDetails(data) {
    return this.http.post(`${environment.api}refund/initiate`, data);
  }

  listRefunds(details) {
    return this.http.post(`${environment.api}refund/list`, details);
  }

  viewSingleRefund(id) {
    return this.http.post(`${environment.api}refund/one`, { id });
  }

  rejectRefund(details) {
    return this.http.post(`${environment.api}refund/reject`, details);
  }

  cancelRefund(details) {
    return this.http.post(`${environment.api}refund/cancel`, details);
  }

  approveRefund(details, url) {
    return this.http.post(`${environment.api}refund/approval/${url}`, details);
  }

  fetchRefundReports(data) {
    return this.http.post(`${environment.api}refund/report`, data);
  }

  // investment
  uploadMaturityData(data) {
    return this.http.post(`${environment.api}maturity/upload`, data);
  }

  // uploadBulkMaturity(data) {
  //   return this.http.post(`${environment.api}maturity/upload`, data);
  // }

  sendMaturityEmail(data) {
    return this.http.post(`${environment.api}maturity/sendmail`, data);
  }

  // penalty
  uploadSinglePenalty(data) {
    return this.http.post(`${environment.api}recovery/penal/initiate`, data);
  }

  uploadBulkPenalty(data) {
    return this.http.post(`${environment.api}recovery/penal/initiate/bulk`, data);
  }

  performPenaltyBulkAction(loanIds, url) {
    return this.http.post(`${environment.api}recovery/penal/${url}`, loanIds);
  }

  listPenalty(data) {
    return this.http.post(`${environment.api}recovery/penal/list`, data);
  }

  // repayments;
  uploadRSPRepayment(data) {
    return this.http.post(`${environment.api}repayment/rsp/document/upload`, data);
  }

  uploadIPPISRepayment(data) {
    return this.http.post(`${environment.api}repayment/ippis/upload`, data);
  }

  listRepayments(data) {
    return this.http.post(`${environment.api}repayment/queue`, data);
  }

  listProcessedRepayments(data) {
    return this.http.post(`${environment.api}repayment/processed/list`, data);
  }

  listRepaymentsReport(data) {
    return this.http.post(`${environment.api}repayment/report`, data);
  }

  listUploadedRepayments(data) {
    return this.http.post(`${environment.api}repayment/document/list`, data);
  }

  viewBatchRecords(data) {
    return this.http.post(`${environment.api}repayment/document/view`, data);
  }
}
