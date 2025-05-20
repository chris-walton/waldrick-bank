import { Injectable } from '@angular/core';
import type { Account, Transaction } from '@waldrick-bank/shared';

@Injectable({ providedIn: 'root' })
export class BankingDataService {
    private apiUrl = 'http://localhost:88/api';

    async getAccounts(): Promise<Account[]> {
        const response = await fetch(`${this.apiUrl}/accounts`);
        return response.json();
    }

    async getAccount(accountId: string): Promise<Account> {
        const response = await fetch(`${this.apiUrl}/accounts/${accountId}`);
        return response.json();
    }

    async getTransactions(accountId: string): Promise<Transaction[]> {
        const response = await fetch(`${this.apiUrl}/accounts/${accountId}/transactions`);
        const data = await response.json() as Transaction[];
        return data.map(item => {
            if (typeof item.date === 'string') {
                item.date = new Date(item.date);
            }
            return item;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async addTransaction(accountId: string, transaction: Transaction): Promise<void> {
        await fetch(`${this.apiUrl}/accounts/${accountId}/transactions/${transaction.id}`, {
            method: 'PUT',
            body: JSON.stringify(transaction)
        });
    }
} 