export interface Props {
    setGiveConcessionModal: (value: boolean) => void
}

export interface studentType {
    id: string,
    studentName: string,
    className: string,
    status:string,
    fees: number,
    paidAmount: number,
    discountAmount: number,
    concessionAmount: number,
    reason:string,
}
export interface classType {
    id: string,
    className: string,
    totalStudents: number,
    concessionStudents: number,
    concessionAmount: number,
}
export interface classModalType {
    className:string,
    students:number,
    concStudents:number,
    receivableAmount:number,
    discount:number,
    paid:number,
    concAmount:number,
    dueAmount:number,
}
export interface classModalTableType  {
    id: string,
    className: string,
    feeType: string,
    feeSchedule: string,
    amount: number,
    discountAmount: number,
    total: number,
    paid: number,
    status: string,
    concAmount: number,
  }