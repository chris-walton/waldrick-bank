-- Create accounts table
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  interestRate DECIMAL(5,4) NOT NULL DEFAULT 0.05,
  lastInterestCalculation TEXT
);

-- Create transactions table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL
);

-- Insert initial account
INSERT INTO accounts (id, balance, interestRate, lastInterestCalculation)
VALUES ('1', 0, 0.05, datetime('now')); 