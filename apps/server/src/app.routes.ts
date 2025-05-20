import { Hono } from 'hono';
import type { Variables } from './config';
import { CalculatorService, DataService } from './services';
import { cors } from './middle';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", cors);
app.use('*', async (ctx, next) => {
    const data = new DataService(ctx.env);
    const calculator = new CalculatorService(data);

    ctx.set('data', data);
    ctx.set('calculator', calculator);
    await next();
});

app.get('/api/accounts', async (ctx) => {
    const data = ctx.var.data;
    const accounts = await data.getAccounts();
    return ctx.json(accounts);
});

app.get('/api/accounts/:id', async (ctx) => {
    const data = ctx.var.data;
    const account = await data.getAccount(ctx.req.param('id'));
    return ctx.json(account);
});

app.get('/api/accounts/:id/transactions', async (ctx) => {
    const data = ctx.var.data;
    const transactions = await data.getTransactions(ctx.req.param('id'));
    return ctx.json(transactions);
});

app.get('/api/history/:accountId', async (ctx) => {
    const { accountId } = ctx.req.param();
    const records = await ctx.var.data.getHistoricRecords(accountId);

    return ctx.json(records);
});

app.put('/api/accounts/:accountId', async (ctx) => {
    const { accountId } = ctx.req.param();
    const account = await ctx.req.json();

    if (accountId !== account.id) {
        return ctx.json({ error: 'Account ID does not match' }, 400);
    }

    await ctx.var.data.upsertAccount(account);

});

app.put('/api/accounts/:accountId/transactions/:transactionId', async (ctx) => {
    const { accountId, transactionId } = ctx.req.param();
    const transaction = await ctx.req.json();

    if (accountId !== transaction.accountId) {
        return ctx.json({ error: 'Account ID does not match' }, 400);
    }

    if (transactionId !== transaction.id) {
        return ctx.json({ error: 'Transaction ID does not match' }, 400);
    }

    await ctx.var.data.upsertTransaction(transaction);
    await ctx.var.calculator.updateBalanceAsync(accountId);
    return ctx.newResponse(null, 204);
});

export const APP_ROUTES = app;