import { Component, computed, inject, resource, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountingService } from '@waldrick-bank/shared';
import { LineChartComponent } from '../../components/line-chart';
import { BankingDataService } from '../../services';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [RouterModule, LineChartComponent],
  providers: [AccountingService]
})
export class DashboardComponent implements OnInit {
  private readonly dataService = inject(BankingDataService);
  private readonly accountingService = inject(AccountingService);

  readonly formatCurrency = this.accountingService.formatCurrency;

  readonly accounts = resource({
    loader: () => this.dataService.getAccounts(),
  });
  readonly totalAmount = computed(() => this.accounts.value()?.reduce((acc, account) => acc + account.balance, 0) ?? 0);

  ngOnInit() {
  }

} 