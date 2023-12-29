export interface ExpenseTransactionModel {
  _id: string,
  reason: string,
  voucherNumber: string,
  amount: number,
  expenseDate: string,
  paymentMethod: string,
  schoolId: string,
  expenseType?: {
    _id: string,
    name: string,
    description: string
  },
}

export type PaymentMethod = 'default' | 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD'
export type SortType = 'default' | 'highest' | 'lowest';
export type SortValue = 1 | -1 | undefined;


export interface ExpenseTransactionData {
  percentage: number,
  totalExpense: {
    maxExpType: {
      expenseType: {
        name: string
      }
      totalExpAmount: number,
    },
    minExpType: {
      expenseType: {
        name: string
      }
      totalExpAmount: number,
    }
    totalAmount: number,
  },
  totalExpenseCurrent: {
    expenseList: ExpenseListItem[]
    totalExpAmount: number,
  }
}

export interface ExpenseListItem {
  expenseDate: string,
  amount: number
}