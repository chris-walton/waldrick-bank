import type { Transaction } from "@waldrick-bank/shared";
import { AccountingService, createId } from "@waldrick-bank/shared";
import type { DataService } from "./data.service";

export class CalculatorService {
    private accounting = new AccountingService();

    constructor(private readonly dataService: DataService) { }

    async addInterestPaymentAsync(accountId: string): Promise<void> {
        const account = await this.dataService.getAccount(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        const interestPayment = this.accounting.calculateInterest(account.balance, account.interestRate);
        const transaction: Transaction = {
            id: createId(),
            accountId,
            amount: interestPayment,
            type: 'interest',
            date: new Date(),
            description: 'Interest'
        };
        account.balance += interestPayment;

        await Promise.all([
            this.dataService.upsertAccount(account),
            this.dataService.upsertTransaction(transaction)
        ]);
    }

    async updateBalanceAsync(accountId: string): Promise<number> {
        const [account, transactions] = await Promise.all([
            this.dataService.getAccount(accountId),
            this.dataService.getTransactions(accountId)
        ]);

        if (!account || !transactions) {
            throw new Error('Account or transactions not found');
        }

        const balance = this.accounting.calculateBalance(transactions);
        account.balance = balance;

        await this.dataService.upsertAccount(account);

        return balance;
    }
}