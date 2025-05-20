import { Component, inject, input, resource, viewChild } from '@angular/core';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule, type DialogComponent } from '@syncfusion/ej2-angular-popups';
import type { Account, Transaction } from '@waldrick-bank/shared';
import { AccountingService, createId } from '@waldrick-bank/shared';
import { BankingDataService } from '../../services';
import { TransactionFormComponent, TransactionGridComponent } from './components';

@Component({
  standalone: true,
  templateUrl: './account.component.html',
  imports: [
    ButtonModule,
    DialogModule,
    TransactionFormComponent,
    TransactionGridComponent,
  ],
  providers: [AccountingService],
})
export class AccountComponent {
  readonly dialog = viewChild<DialogComponent>('transactionDialog');
  readonly form = viewChild<TransactionFormComponent>('transactionForm');

  private readonly accounting = inject(AccountingService);
  private readonly dataService = inject(BankingDataService);

  readonly formatCurrency = this.accounting.formatCurrency;
  readonly accountId = input<string>();
  readonly account = resource({
    request: () => [this.accountId()],
    loader: async ({ request }) => this.getAccountAsync(request[0]),
  });
  readonly transactions = resource({
    request: () => [this.accountId()],
    loader: async ({ request }) => this.getTransactionsAsync(request[0]),
  });

  showTransactionModal() {
    console.log(this.form());
    this.form()?.reset();
    this.dialog()?.show();
  }

  closeTransactionModal() {
    this.dialog()?.hide();
  }

  async createTransaction(data: Omit<Transaction, 'id' | 'accountId'>) {
    if (!this.accountId()) return;

    const transaction = { ...data, id: createId(), accountId: this.accountId() ?? '' };

    await this.dataService.addTransaction(this.accountId() ?? '', transaction);

    this.transactions.update(list => [transaction, ...(list ?? [])]);
    this.account.update(account => {
      if (!account) return account;

      return { ...account, balance: account.balance + transaction.amount };
    });
    this.closeTransactionModal();
  }

  private async getAccountAsync(accountId: string | undefined): Promise<Account | undefined | null> {
    if (!accountId) return undefined;
    return await this.dataService.getAccount(accountId);
  }

  private async getTransactionsAsync(accountId: string | undefined): Promise<Transaction[] | undefined | null> {
    if (!accountId) return undefined;
    return await this.dataService.getTransactions(accountId);
  }
} 