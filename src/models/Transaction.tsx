export interface Transaction {
    name: string,
    className: string,
    admission_no: string,
    amount: number,
    description: string,
    receiptId: string,
    issueDate: string,
    paymentMode: string,
    items?: string[],
    _id: string,
    id: string,
}


export interface FormValues {
    section: string,
    paymentMethod: string,
    searchTerm: string,
    startDate: string,
    endDate:string
}

export interface Class {
    sectionId: string;
    name: string;
}
