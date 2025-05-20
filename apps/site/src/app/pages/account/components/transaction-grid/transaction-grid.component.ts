import { Component, input } from '@angular/core';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import type { Transaction } from '@waldrick-bank/shared';

@Component({
  standalone: true,
  selector: 'app-transaction-grid',
  templateUrl: './transaction-grid.component.html',
  imports: [GridModule],
})
export class TransactionGridComponent {
  readonly transactions = input.required<Transaction[] | undefined | null>();
} 