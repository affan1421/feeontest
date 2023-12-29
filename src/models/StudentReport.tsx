export interface FeeInstallment {
    _id: string;
    id: string;
    date: string;
    totalAmount: number;
    totalDiscountAmount: number;
    paidAmount: number;
    netAmount: number;
    status: string;
    name: string;
}

interface PreviousBalance {
    _id: string;
    total: number;
    paid: number;
    due: number;
}

interface StudentDetails {
    _id: string;
    username: string;
    studentName: string;
    parentName: string;
    class: string;
    profile_image: string
}

export interface Report {
    stats: {
        total: number;
        paid: number;
        pending: number;
    };
    discounts: any[];
    feeInstallments: FeeInstallment[];
    miscFees: any[];
    previousBalance: PreviousBalance[];
    studentDetails: StudentDetails;
}  