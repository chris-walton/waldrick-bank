import { Component, linkedSignal, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { createId, type Transaction } from '@waldrick-bank/shared';

@Component({
  standalone: true,
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  imports: [
    ButtonModule,
    DatePickerModule,
    DropDownListModule,
    FormsModule,
    NumericTextBoxModule,
    TextBoxModule,
  ],
})
export class TransactionFormComponent {
  readonly date = signal<Date>(new Date());
  readonly description = signal<string>('');
  readonly amount = signal<number>(0);
  readonly type = signal<'deposit' | 'withdrawal'>('deposit');

  readonly submitted = output<Omit<Transaction, 'id' | 'accountId'>>();
  readonly cancelled = output<void>();

  transactionTypes = [
    { text: 'Deposit', value: 'deposit' },
    { text: 'Withdraw', value: 'withdrawal' }
  ];

  reset() {
    console.log('reset');
    this.date.set(new Date());
    this.description.set('');
    this.amount.set(0);
    this.type.set('deposit');
  }

  async createTransaction() {
    const date = this.date();
    const description = this.description();
    const amount = this.amount();
    const type = this.type();

    if (!date || !description || !amount || !type) {
      return;
    }

    this.submitted.emit({ date, description, amount, type });
  }
} 