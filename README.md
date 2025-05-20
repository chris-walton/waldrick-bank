# Waldrick Bank

A simple banking application for tracking savings with daily interest
calculations.

## Features

- Track account balance
- Record deposits and withdrawals
- Calculate daily interest
- View transaction history

## Tech Stack

- Frontend: Angular 17
- Backend: Cloudflare Workers with Azure Cosmos DB
- Shared: TypeScript package for common types and utilities

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create an Azure Cosmos DB account and database:
   - Create a new Cosmos DB account in Azure Portal
   - Create a database named `waldrick_bank`
   - Create a container named `accounts` with partition key `/id`
   - Get the endpoint and key from the Azure Portal

3. Update the environment variables in `apps/backend/wrangler.toml`:
   ```toml
   [vars]
   COSMOS_ENDPOINT = "your-cosmos-endpoint"
   COSMOS_KEY = "your-cosmos-key"
   COSMOS_DATABASE = "waldrick_bank"
   COSMOS_CONTAINER = "accounts"
   ```

4. Create the initial account document:
   ```json
   {
       "id": "1",
       "balance": 0,
       "interestRate": 0.05,
       "lastInterestCalculation": null,
       "transactions": []
   }
   ```

5. Start the development servers:

   Backend:
   ```bash
   cd apps/backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd apps/frontend
   ng serve
   ```

## Development

- Frontend runs on `http://localhost:4200`
- Backend runs on `http://localhost:8787`

## Deployment

1. Deploy the backend:
   ```bash
   cd apps/backend
   npm run deploy
   ```

2. Build and deploy the frontend:
   ```bash
   cd apps/frontend
   ng build
   # Deploy the dist folder to your hosting provider
   ```
