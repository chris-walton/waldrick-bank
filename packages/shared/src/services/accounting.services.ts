import type { Transaction } from "../models";

export class AccountingService {
    calculateInterest(balance: number, interestRate: number): number {
        return (balance * interestRate) / 365;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    calculateBalance(transactions: Transaction[]): number {
        return transactions.reduce((acc, transaction) => {
            return acc + transaction.amount;
        }, 0);
    }
}