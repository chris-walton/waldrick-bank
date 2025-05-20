import { Component, inject, input, resource, ViewChild } from '@angular/core';
import type { Account, Transaction } from '@waldrick-bank/shared';
import { AccountingService, createId } from '@waldrick-bank/shared';
import { BankingDataService } from '../../services';
import { FilterService, GridModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule } from '@angular/forms';

interface NewTransaction {
  date: Date;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

@Component({
  standalone: true,
  templateUrl: './account.component.html',
  imports: [
    ButtonModule,
    GridModule,
    DialogModule,
    DatePickerModule,
    NumericTextBoxModule,
    TextBoxModule,
    DropDownListModule,
    FormsModule
  ] as const,
  providers: [AccountingService, PageService,
    SortService,
    FilterService,
    GroupService],
  styles: [`
    .text-success { color: #198754; }
    .text-danger { color: #dc3545; }
  `]
})
export class AccountComponent {
  @ViewChild('transactionDialog') transactionDialog!: DialogComponent;

  private readonly accounting = inject(AccountingService);
  private readonly dataService = inject(BankingDataService);

  readonly formatCurrency = this.accounting.formatCurrency;
  readonly accountId = input.required<string>();
  readonly account = resource({
    request: () => [this.accountId()],
    loader: async ({ request }) => this.getAccountAsync(request[0]),
  });
  readonly transactions = resource({
    request: () => [this.accountId()],
    loader: async ({ request }) => this.getTransactionsAsync(request[0]),
  });

  newTransaction: NewTransaction = this.createNewTransaction();

  transactionTypes = [
    { text: 'Deposit', value: 'deposit' },
    { text: 'Withdraw', value: 'withdrawal' }
  ];

  typeFields = { text: 'text', value: 'value' };

  showTransactionModal() {
    this.newTransaction = this.createNewTransaction();
    this.transactionDialog.show();
  }

  closeTransactionModal() {
    this.transactionDialog.hide();
    this.resetTransactionForm();
  }

  async createTransaction() {
    if (!this.accountId()) return;

    const transaction: Transaction = {
      id: createId(),
      accountId: this.accountId(),
      date: this.newTransaction.date.toISOString(),
      description: this.newTransaction.description,
      amount: this.newTransaction.type === 'withdrawal'
        ? -this.newTransaction.amount
        : this.newTransaction.amount,
      type: this.newTransaction.type
    };

    await this.dataService.addTransaction(this.accountId(), transaction);

    this.transactions.update(list => [transaction, ...(list ?? [])]);
    this.account.update(account => {
      if (!account) return account;

      return { ...account, balance: account.balance + transaction.amount };
    });
    this.closeTransactionModal();
  }

  private resetTransactionForm() {
    this.newTransaction = {
      date: new Date(),
      description: '',
      amount: 0,
      type: 'deposit'
    };
  }

  private async getAccountAsync(accountId: string | undefined): Promise<Account | undefined | null> {
    if (!accountId) return undefined;
    return await this.dataService.getAccount(accountId);
  }

  private async getTransactionsAsync(accountId: string | undefined): Promise<Transaction[] | undefined | null> {
    if (!accountId) return undefined;
    return await this.dataService.getTransactions(accountId);
  }

  private createNewTransaction(): NewTransaction {
    return {
      date: new Date(),
      description: '',
      amount: 0,
      type: 'deposit'
    };
  }
} 