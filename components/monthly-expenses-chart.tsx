'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, MonthlyExpense } from '@/types/transaction';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
  className?: string;
}

export function MonthlyExpensesChart({ transactions, className }: MonthlyExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, MonthlyExpense>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          month: monthLabel,
          expenses: 0,
          income: 0,
          net: 0,
        });
      }

      const monthData = monthMap.get(monthKey)!;
      if (transaction.type === 'expense') {
        monthData.expenses += transaction.amount;
      } else {
        monthData.income += transaction.amount;
      }
      monthData.net = monthData.income - monthData.expenses;
    });

    return Array.from(monthMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Show last 6 months
  }, [transactions]);

  const totalExpenses = monthlyData.reduce((sum, data) => sum + data.expenses, 0);
  const totalIncome = monthlyData.reduce((sum, data) => sum + data.income, 0);
  const netAmount = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-green-600">
              Income: {formatCurrency(payload[0]?.payload?.income || 0)}
            </p>
            <p className="text-red-600">
              Expenses: {formatCurrency(payload[0]?.value || 0)}
            </p>
            <p className="text-gray-600 border-t pt-1">
              Net: {formatCurrency(payload[0]?.payload?.net || 0)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No data to display</p>
              <p className="text-sm">Add transactions to see your monthly expenses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Expenses
        </CardTitle>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Total Expenses: {formatCurrency(totalExpenses)}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Total Income: {formatCurrency(totalIncome)}</span>
          </div>
          <div className={`flex items-center gap-1 ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netAmount >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>Net: {formatCurrency(netAmount)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `₹${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}