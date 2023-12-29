export interface FeeType {
    feeType: string;
    _id: string;
}

export interface FeeDetail {
    feeTypeId: FeeType
    date: string
    // Amount to be paid
    totalAmount: number
    // Discounted Amount
    netAmount: number
    totalDiscountAmount?: number
    status: string
    receiptId: string;
    paidAmount: number | null
    needtoPay: number;
    alreadyPaidAmount?: number | null
    checked: boolean;
    concessionAmount?: number | undefined
}

export interface FeeCollection {
    studentName: string;
    studentId: string;
    class: string;
    parentName: string;
    feeDetails: FeeDetail[];
    transportFeedetials: any;

    // Local Variable for Local Calculation
    amountReceived: number,
    penalty: number,
    collectedFee: number,
    remainingAmount: number,
    totalFeeAmount: number,
    dueAmount: number,
}


export interface FeeCollectionAPI {
    feeDetails: FeeDetail[],
    studentId: string,
    schoolId: string,
    collectedFee: number,
    totalFeeAmount: number,
    dueAmount: number,
    paymentMethod: string,
    bankName?: string,
    chequeDate?: string,
    chequeNumber?: string,
    transactionDate?: string,
    transactionId?: string,
    upiId?: string,
    payerName?: string,
    ddNumber?: string,
    ddDate?: string,
    issueDate?: string
    status: String,
    feeCategoryName: string,
    feeCategoryId: string,
    receiptType: 'ACADEMIC',
    comment?: string,
    corReceiptId?: string,
    donorId?: string,
    createdBy: string
}