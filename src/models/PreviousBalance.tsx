import { PaymentMethod } from "./ExpenseTransaction";

export interface ExistingStudent {
    studentId: string,
    schoolId: string,
    sectionId: string,
    academicYearId: string,
    pendingAmount: number | string,
}

export interface LeftStudent {
    dueDate: string,
    studentName: string,
    parentName: string,
    username: number | string,
    gender: string,
    schoolId: string,
    sectionId: string,
    academicYearId: string,
    pendingAmount: number | string,
}


export interface PBData {
    prevBalId: string,
    paidAmount: number | string,
    paymentMode: PaymentMethod,

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



