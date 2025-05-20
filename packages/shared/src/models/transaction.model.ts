export interface Transaction {
    id: string;
    accountId: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'interest';
    description: string;
    date: string | Date;
}