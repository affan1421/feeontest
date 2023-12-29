import { Dayjs } from "dayjs";

export interface Expense {
  reason: string;
  schoolId: string;
  expenseType: string;
  paymentMethod: string;
  transactionDetails?: {
    transactionId?: string;
    screenShot?: string;
  };
  expenseTypeName: string;
  amount: number;
  createdBy: string;
  expenseDate: Dayjs | null;
  approvedBy: string;
}

export interface ExpenseTypeModel {
  id?: string | null;
  _id?: string | null;
  name: string;
  schoolId?: string;
  userId?: string;
  description: string;
  budget: number;
  remainingBudget: number;
}
