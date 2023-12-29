export interface DiscountApproval {
    name: string,
    description: string,
    budgetSpent: number,
    totalBudget: number,
    allotted: number,
    remaining: number,
    studentsCount: number,
    classesCount: number,
    students: Student[],
    id: string
    totalPending: number,
    totalApproved: number,
}

export interface Student {
    studentName: string,
    class: string
    totalFees: number
    discountAmount: number,
    previousDiscounts: []
    status: 'Approved' | 'Pending'
}

export interface DiscountStudentAPI {
    studentId: string,
    status: 'Approved' | 'Rejected',
    approvalAmount: number,
    sectionId: string,
    discountId:string,
}