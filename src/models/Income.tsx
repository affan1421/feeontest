export interface IncomeData {
    miscellaneous: {
        totalAmount: number,
        miscList: Misc[]
    };
    totalIncome: {
        amount: number;
        percentage: number;
        incomeList: incomeListItem[]
    };
    totalCollected: {
        totalAmount: number,
        feeList: []
    },
}

export interface IncomeDataCard {
    totalReceivable: {
        totalAmount: number;
        maxClass: {
            amount: number;
            sectionId: {
                _id: string;
                sectionName: string;
                className: string;
            };
        };
        minClass: {
            amount: number;
            sectionId: {
                _id: string;
                sectionName: string;
                className: string;
            };
        };
    };
    totalCollectedData: {
        totalAmount: number;
        maxClass: {
            amount: number;
            sectionId: any;
        };
        minClass: {
            amount: number;
            sectionId: any;
        };
    };
    totalPending: {
        totalAmount: number;
        maxClass: {
            amount: number;
            sectionId: any;
        };
        minClass: {
            amount: number;
            sectionId: any;
        };
    };
}

interface incomeListItem {
    issueDate: string,
    paidAmount: number
}

interface Misc {
    amount: number,
    feeTypeId: {
        _id: string,
        feeType: string
    }
}