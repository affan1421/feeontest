import { PaymentMethod } from "./ExpenseTransaction";

export interface TransactionAPIData {
    date?: string;
    paymentMethod?: string;
    categoryId?: string;
    status?: string;
    studentId?: string;
    username?: string;
    sectionId?: string;
} 


export interface transPortBalanceData {
    transportId: string,
    paidAmount: number | string,
    paymentMode: PaymentMethod,

    studentId?: string,
    bankName?: string,
    chequeDate?: string,
    chequeNumber?: string,
    transactionDate?: string,
    transactionId?: string,
    upiId?: string,
    payerName?: string,
    ddNumber?: string,
    ddDate?: string,
    issueDate?: string,
    status: string,
}