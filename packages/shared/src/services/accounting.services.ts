import type { Account, HistoricRecord, Transaction } from "../models";

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

    buildHistoricRecords(accounts: Account[]): HistoricRecord[] {
        const records: HistoricRecord[] = [];
        const fullDate = new Date();
        const year = fullDate.getFullYear();
        const month = (fullDate.getMonth() + 1).toString().padStart(2, '0');
        const day = fullDate.getDate().toString().padStart(2, '0');
        const date = `${year}-${month}-${day}`;
        let total = 0;

        for (const account of accounts) {
            total += account.balance;

            records.push({
                id: date,
                accountId: account.id,
                amount: account.balance
            });
        }

        records.push({
            id: date,
            accountId: 'all',
            amount: total
        });

        return records;
    }
}