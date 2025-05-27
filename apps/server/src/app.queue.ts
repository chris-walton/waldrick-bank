import { CalculatorService, DataService } from "./services";

declare type MessageType = {
    accountId: string;
}

const queue = async (batch: MessageBatch<MessageType>, env: Env) => {
    const data = new DataService(env);
    const calculator = new CalculatorService(data);

    for (const message of batch.messages) {
        try {
            await calculator.updateBalanceAsync(message.body.accountId);
            await calculator.addHistoricRecordAsync();
            await message.ack();
        } catch (error) {
            console.error(`Failed to process message for account ${message.body.accountId}:`, error);
            await message.retry();
        }
    }
};

export const APP_QUEUE = queue; 