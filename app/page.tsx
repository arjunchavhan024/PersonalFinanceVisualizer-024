'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { useTransactions } from '@/hooks/use-transactions';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { MonthlyExpensesChart } from '@/components/monthly-expenses-chart';
import { DashboardStats } from '@/components/dashboard-stats';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, PiggyBank, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Home() {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = async (formData: any) => {
    try {
      await addTransaction(formData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (formData: any) => {
    if (!editingTransaction) return;
    
    try {
      await updateTransaction(editingTransaction.id, {
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
        type: formData.type,
      });
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading your financial data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-lg">
                <PiggyBank className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Personal Finance</h1>
                <p className="text-gray-600">Track your income and expenses</p>
              </div>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard Stats */}
        <DashboardStats transactions={transactions} className="mb-8" />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <MonthlyExpensesChart transactions={transactions} />
          </div>

          {/* Add Transaction Form */}
          <div className="flex justify-center">
            <TransactionForm
              onSubmit={handleAddTransaction}
              className="w-full max-w-md"
            />
          </div>

          {/* Transaction List */}
          <div>
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>

        {/* Add Transaction Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleAddTransaction}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Modal */}
        <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            {editingTransaction && (
              <TransactionForm
                initialData={editingTransaction}
                onSubmit={handleUpdateTransaction}
                onCancel={() => setEditingTransaction(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}