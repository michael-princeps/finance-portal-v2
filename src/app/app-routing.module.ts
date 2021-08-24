import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './home-layout/home-layout.component';


const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'ippis',
        children: [
          {
            path: '',
            redirectTo: 'payment-received',
            pathMatch: 'full'
          },
          {
            path: 'payment-received',
            loadChildren: () => import('./ippis/ippis-received/ippis-received.module').then(m => m.IppisReceivedModule)
          },
          {
            path: 'expected-payment',
            loadChildren: () => import('./ippis/ippis-expected/ippis-expected.module').then(m => m.IppisExpectedModule)
          },
          {
            path: 'reconciliation-results',
            loadChildren: () => import('./ippis/ippis-reconcilation-results/ippis-reconcilation-results.module').then(m => m.IppisReconcilationResultsModule)
          }
        ]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      // liquidation
      {
        path: 'liquidation/create',
        loadChildren: () => import('./liquidation/create-liquidation/create-liquidation.module').then(m => m.CreateLiquidationModule)
      },
      {
        path: 'liquidations',
        children: [
          {
            path: '',
            redirectTo: '0',
            pathMatch: 'full'
          },
          {
            path: 'report',
            loadChildren: () => import('./liquidation/liquidation-report/liquidation-report.module').then(m => m.LiquidationReportModule)
          },
          {
            path: ':id',
            loadChildren: () => import('./liquidation/list-liquidation/list-liquidation.module').then(m =>m.ListLiquidationModule)
          },
          {
            path: 'view/:id',
            loadChildren: () => import('./liquidation/single-liquidation/single-liquidation.module').then(m => m.SingleLiquidationModule)
          }
        ]
      },

      // refunds
      {
        path: 'refund/create',
        loadChildren: () => import('./refund/create-refund/create-refund.module').then(m => m.CreateRefundModule)
      },
      {
        path: 'refunds',
        children: [
          {
            path: '',
            redirectTo: '0',
            pathMatch: 'full'
          },
          {
            path: 'report',
            loadChildren: () => import('./refund/refund-report/refund-report.module').then(m => m.RefundReportModule)
          },
          {
            path: ':id',
            loadChildren: () => import('./refund/list-refunds/list-refunds.module').then(m => m.ListRefundsModule)
          },
          {
            path: 'view/:id',
            loadChildren: () => import('./refund/single-refund/single-refund.module').then(m => m.SingleRefundModule)
          },
        ]
      },

      // investements
      {
        path: 'investments',
        children: [
          {
            path: 'maturity/upload',
            loadChildren: () => import('./investments/upload-maturity-data/upload-maturity-data.module').then(m => m.UploadMaturityDataModule)
          },
          {
            path: 'maturity/email',
            loadChildren: () => import('./investments/send-maturity-email/send-maturity-email.module').then(m => m.SendMaturityEmailModule)
          },
          {
            path: 'rollover',
            loadChildren: () => import('./investments/rollover-investment/rollover-investment.module').then(m => m.RolloverInvestmentModule)
          },
          {
            path: 'view/:id',
            loadChildren: () => import('./investments/single-investment/single-investment.module').then(m => m.SingleInvestmentModule)
          },
          {
            path: ':id',
            loadChildren: () => import('./investments/list-investments/list-investments.module').then(m => m.ListInvestmentsModule)
          }
        ]
      },

      // penalty
      {
        path: 'penalty',
        children: [
          {
            path: 'upload',
            loadChildren: () => import('./penalty/initiate-penalty/initiate-penalty.module').then(m => m.InitiatePenaltyModule)
          },
          {
            path: ':id',
            loadChildren: () => import('./penalty/all-penalty/all-penalty.module').then(m => m.AllPenaltyModule)
          }
        ]
      },

      // repayments
      {
        path: 'repayments',
        children: [
          {
            path: 'upload',
            loadChildren: () => import('./repayments/upload-repayments/upload-repayments.module').then(m => m.UploadRepaymentsModule)
          },
          {
            path: 'uploads',
            loadChildren: () => import('./repayments/list-repayment-uploads/list-repayment-uploads.module').then(m => m.ListRepaymentUploadsModule)
          },
          {
            path: 'queue',
            // tslint:disable-next-line: max-line-length
            loadChildren: () => import('./repayments/list-repayments-queue/list-repayments-queue.module').then(m => m.ListRepaymentsQueueModule)
          },
          {
            path: 'processed',
            // tslint:disable-next-line: max-line-length
            loadChildren: () => import('./repayments/list-processed-repayments/list-processed-repayments.module').then(m => m.ListProcessedRepaymentsModule)
          },
          {
            path: 'uploads',
            loadChildren: () => import('./repayments/upload-repayments/upload-repayments.module').then(m => m.UploadRepaymentsModule)
          },
          {
            path: 'report',
            loadChildren: () => import('./repayments/repayments-report/repayments-report.module').then(m => m.RepaymentsReportModule)
          },
          {
            path: 'view/:id',
            loadChildren: () => import('./repayments/single-repayment/single-repayment.module').then(m => m.SingleRepaymentModule)
          }
        ]
      }
    ]
  },
  {
    path: 'token',
    loadChildren: () => import('./core/receive-token/receive-token.module').then(m => m.ReceiveTokenModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
