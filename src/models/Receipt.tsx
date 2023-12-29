import { FeeDetail } from "./FeeCollection";

export interface ReceiptModel {
    issueDate: any;
    size?: 'A4' | 'A5'
    student: {
        admission_no?: number;
        name: string;
        studentId: string;
        class: {
            name: string;
            classId: string;
        };
        section: {
            name: string;
            sectionId: string;
        },
    };
    parent: {
        name: string;
        mobile: number;
        parentId: string;
    };
    academicYear: {
        name: string;
        academicYearId: string;
    };
    school: {
        name: string;
        address: string;
        schoolId: string;
    };
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    payment: {
        method: string;
        bankName?: string;
        chequeNumber?: string;
        transactionId?: string;
        upiId?: string;
        ddNumber?: string;
        chequeDate?: string;
        ddDate?: string;
        transactionDate?: string;
    };
    _id: string;
    items: FeeDetail[];
    createdAt: string;
    receiptId: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
}
