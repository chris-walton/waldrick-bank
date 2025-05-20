import { CalculatorService, DataService } from "./services";

const scheduled = async (controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
    console.log("cron processed");
    const data = new DataService(env);
    const calculator = new CalculatorService(data);
    const accounts = await data.getAccounts();

    for (const account of accounts) {
        await calculator.addInterestPaymentAsync(account.id);
    }

    await calculator.addHistoricRecordAsync();
};

export const APP_SCHEDULED = scheduled;