import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'personal-finance-transactions';

export class TransactionStorage {
  static getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  static saveTransactions(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  static addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  static updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveTransactions(transactions);
    return transactions[index];
  }

  static deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    
    if (filteredTransactions.length === transactions.length) return false;
    
    this.saveTransactions(filteredTransactions);
    return true;
  }
}