'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, X } from 'lucide-react';
import { TransactionFormData, Transaction } from '@/types/transaction';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel?: () => void;
  initialData?: Transaction;
  className?: string;
}

export function TransactionForm({ onSubmit, onCancel, initialData, className }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: initialData?.amount.toString() || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    type: initialData?.type || 'expense',
  });

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!initialData) {
        // Reset form only for new transactions
        setFormData({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          type: 'expense',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isEditing = !!initialData;

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit3 className="h-5 w-5 text-blue-600" />
              Edit Transaction
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5 text-green-600" />
              Add Transaction
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isEditing ? 'Update your transaction details' : 'Record a new financial transaction'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="₹0.00"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={cn(
                "transition-colors",
                errors.amount && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={cn(
                "transition-colors",
                errors.date && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Grocery shopping, Salary, Rent, etc."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={cn(
                "transition-colors",
                errors.description && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => handleChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Add Transaction')}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}