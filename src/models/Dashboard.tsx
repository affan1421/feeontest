export interface Dashboard {
    totalStudents: {
        boysCount: number
        girlsCount: number
    },
    incomeData: {
        totalIncome: number
        percentage: number
    },
    expenseData: {
        totalExpense: number
        percentage: number
    }
    totalDiscounts: {
        totalDiscount: number
        maxClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
        minClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
    }
    totalReceivable: {
        totalReceivable: number
        maxClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
        minClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
    }
    feeCollection: {
        totalFeeCollection: number
        maxClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
        minClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
    }
    totalPending: {
        totalPending: number
        maxClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
        minClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
    }
    paymentMethods: {
        typeName: string
        items: item[]
    },
    studentPerformance: {
        percentage: number
        onTime: number
        late: number
        outstanding: number
        notPaid: number
    },
    classFeePerformance: {
        percentage: number
        bestClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        },
        leastClass?: {
            amount: number;
            sectionId?: {
                className: string
                sectionName: string
                _id: string
            }
        }
    },
    financialFlows: {
        income: item[],
        expense: item[]
    }
}

export interface TotalStudentsModel {
    totalCount: number;
    boysCount: number
    girlsCount: number
}

export interface IncomeData {
    amount: number
    incomeList: IncomeDataItem[]
}

export interface ExpenseData {
    totalExpenseCurrent: {
        totalExpAmount: number
        expenseList: ExpenseDataItem[]
    }
}

export interface TotalDiscounts {
    totalApprovedAmount: number
    maxClass: {
        amount: number
        sectionId: {
            _id: string
            sectionName: string
            className: string
        }
    }
    minClass: {
        amount: number
        sectionId: {
            _id: string
            sectionName: string
            className: string
        }
    }
}

export interface TotalPending {
    totalAmount: number
    maxClass: {
        amount: number
        sectionId: {
            className: string;
            sectionName: string;
            _id: string;
        }
    }
    minClass: {
        amount: number
        sectionId: {
            className: string;
            sectionName: string;
            _id: string;
        }
    }
}

export interface FeeCollection {
    totalAmount: number,
    maxClass: {
        amount: number
        sectionId: {
            className: string;
            sectionName: string;
            _id: string;
        }
    },
    minClass: {
        amount: number
        sectionId: {
            className: string;
            sectionName: string;
            _id: string;
        }
    }
}

export interface TotalReceivable {
    totalAmount: number
    maxClass: {
        amount: number
        sectionId: {
            className: string;
            sectionName: string;
            _id: string;
        }
    }
    minClass: {
        amount: number
        sectionId: {
            className: string;
            sectionName: string;
            _id: string;
        }
    }
}

export interface IncomeDataItem {
    issueDate: string,
    paidAmount: number
}

export interface ExpenseDataItem {
    expenseDate: string,
    amount: number
}

export interface StudentPerformance {
    paidCount: number
    lateCount: number
    dueCount: number
    upcomingCount: number
}

export interface PaymentMethod {
    _id: string
    totalAmount: number
}

export interface ExpenseItem {
    expenseTypeName: string
    totalExpAmount: number
}

export interface IncomeItem {
    _id: string,
    totalAmount: number
}

export interface FinancialFlows {
    expense: ExpenseItem[],
    income: IncomeItem[]
}

export interface DashboardStats {
    totalStudents: TotalStudentsModel,
    incomeData: IncomeData,
    expenseData: ExpenseData,
    totalDiscounts: TotalDiscounts,
    studentPerformance: StudentPerformance
    paymentMethods: PaymentMethod[]
    financialFlows: FinancialFlows
}

export interface DashboardCardStats {
    totalPending: TotalPending,
    feeCollection: FeeCollection,
    totalReceivable: TotalReceivable
}

export interface item {
    amount: number,
    feeTypeId: {
        feeType: string
    },
}

export interface CardsData {
    scheduleId?: string;
    scheduleDates?: string[];
    withDisc?: boolean;
}