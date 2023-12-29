export interface FeeTypeModel {
    feeType: string
    description: string
    accountType: 'default' | 'Accounts Receivable' | 'Fees Ledger'
    schoolId: string | null
    id?: string | null,
    _id?: string | null,
    categoryId?: string,
    amount?: number,
    isMisc?:boolean,
}



