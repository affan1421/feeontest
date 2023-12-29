export interface Discount extends DiscountEdit {
    name: string
    description: string
    totalBudget: number | null
    budgetRemaining?: number
    budgetAlloted?: number
    createdBy?: string
    schoolId?: string
    id?: string
}

export interface discountFeeStructure {
    feeTypes: discountFeeType[]
    _id: string
}

export interface discountFeeType {
    feeTypeId: string
    isPercentage: boolean
    discount_amount: number
}


export interface ClassRow {
    sectionName: string
    sectionId: string
    feeStructureId?: string
    categoryId: string
    totalAmount: number
    totalFees: number
    totalApproved: number
    totalPending: number
    totalRejected: number
    totalStudents: number
}

export interface Student {
    name: string
    class: string
    totalFees: number
    discountAmount: number
    previosDiscounts: []
    status: string
}

export interface FormValues {
    selectedClass: string
    categoryId: string
    feeStructureId: string
    discountCategoryId: string

}

export interface FeeDetail {
    SL?: number
    feeTypeName: string
    feeTypeId?: string
    breakDown?: number
    amountString?: string
    amount: number
    amountType: string
    discountAmount: number
    enteredAmount: number | null

    // For Edit
    feeType: string,
    _id: string
    totalAmount: number
}

export interface APIData {
    sectionId: string
    sectionName: string
    categoryId: string
    rows: RowData[]
    studentList: SelectedStudent[]
    feeStructureId: string
}

export interface SelectedStudent {
    studentId: string,
    attachment: string[]
}

export interface RowData extends RowDataEdit {
    rowId: string
    breakdown: string
    isPercentage: boolean
    value: number
    feeTypeId: string
}

export interface DiscountEdit {
    selectedClass?: string,
    categoryId?: string,
    budgetAllocated?: number,
    budgetRemaining?: number,
    rows?: RowData[],
    feeStructureId?: string,
    totalAmount?: number
}

export interface RowDataEdit {
    feeType?: FeeDetail
    totalAmount?: number,
    isPercentage?: boolean,
    value?: number
}