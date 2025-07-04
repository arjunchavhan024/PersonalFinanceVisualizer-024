'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { TransactionStorage } from '@/lib/transaction-storage';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedTransactions = TransactionStorage.getTransactions();
      setTransactions(savedTransactions);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = (formData: TransactionFormData) => {
    try {
      const newTransaction = TransactionStorage.addTransaction({
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
        type: formData.type,
      });
      setTransactions(prev => [...prev, newTransaction]);
      setError(null);
      return newTransaction;
    } catch (err) {
      setError('Failed to add transaction');
      throw err;
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    try {
      const updated = TransactionStorage.updateTransaction(id, updates);
      if (updated) {
        setTransactions(prev => prev.map(t => t.id === id ? updated : t));
        setError(null);
        return updated;
      }
      throw new Error('Transaction not found');
    } catch (err) {
      setError('Failed to update transaction');
      throw err;
    }
  };

  const deleteTransaction = (id: string) => {
    try {
      const success = TransactionStorage.deleteTransaction(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setError(null);
      } else {
        throw new Error('Transaction not found');
      }
    } catch (err) {
      setError('Failed to delete transaction');
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}