'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  transactions: Transaction[];
  className?: string;
}

export function DashboardStats({ transactions, className }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentMonthTransactions = transactions
      .filter(t => t.date.startsWith(currentMonth));
    
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netWorth = totalIncome - totalExpenses;
    const monthlyNet = monthlyIncome - monthlyExpenses;
    
    return {
      totalIncome,
      totalExpenses,
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      icon: ArrowUpCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'All-time income',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      icon: ArrowDownCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'All-time expenses',
    },
    {
      title: 'Net Worth',
      value: formatCurrency(stats.netWorth),
      icon: DollarSign,
      color: stats.netWorth >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.netWorth >= 0 ? 'bg-green-50' : 'bg-red-50',
      description: 'Income - Expenses',
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.monthlyNet),
      icon: TrendingUp,
      color: stats.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.monthlyNet >= 0 ? 'bg-green-50' : 'bg-red-50',
      description: `${formatCurrency(stats.monthlyIncome)} - ${formatCurrency(stats.monthlyExpenses)}`,
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}