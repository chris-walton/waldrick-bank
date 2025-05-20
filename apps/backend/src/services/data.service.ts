import { type Container, CosmosClient } from "@azure/cosmos";
import type { Account, Transaction } from "@waldrick-bank/shared";

export class DataService {
    private readonly accountContainer: Container;
    private readonly transactionContainer: Container;

    constructor(env: Env) {
        const client = new CosmosClient({
            endpoint: env.COSMOS_ENDPOINT,
            key: env.COSMOS_KEY
        });
        const database = client.database(env.COSMOS_DATABASE);
        this.accountContainer = database.container("accounts");
        this.transactionContainer = database.container("transactions");
    }

    async getAccounts(): Promise<Account[]> {
        const { resources } = await this.accountContainer.items.readAll<Account>().fetchAll();
        return resources;
    }

    async getAccount(accountId: string): Promise<Account> {
        const { resource } = await this.accountContainer.item(accountId, accountId).read();

        return resource;
    }

    async getTransactions(accountId: string): Promise<Transaction[]> {
        const { resources } = await this.transactionContainer.items.readAll<Transaction>({
            partitionKey: accountId
        }).fetchAll();

        return resources;
    }

    async upsertAccount(account: Account): Promise<void> {
        await this.accountContainer.items.upsert(account);
    }

    async upsertTransaction(transaction: Transaction): Promise<void> {
        await this.transactionContainer.items.upsert(transaction);
    }
}