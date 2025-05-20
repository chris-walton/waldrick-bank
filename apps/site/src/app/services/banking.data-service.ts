import { Injectable } from '@angular/core';
import type { Account, HistoricRecord, Transaction } from '@waldrick-bank/shared';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class BankingDataService {
    private apiUrl = environment.apiUrl;

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

    async getHistoricRecords(accountId: string): Promise<HistoricRecord[]> {
        const response = await fetch(`${this.apiUrl}/history/${accountId}`);
        return response.json();
    }

    async addTransaction(accountId: string, transaction: Transaction): Promise<void> {
        await fetch(`${this.apiUrl}/accounts/${accountId}/transactions/${transaction.id}`, {
            method: 'PUT',
            body: JSON.stringify(transaction)
        });
    }
} 