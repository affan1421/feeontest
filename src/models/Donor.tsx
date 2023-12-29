export interface Donor {
    name: string,
    donorType: 'default'|'INDIVIDUAL'| 'TRUST'| 'COMPANY'
    contactNumber: number,
    email: string,
    address: string,
    accountNumber: number,
    accountType: 'default'|'Savings'|'Current',
    IFSC: string,
    bank: string,
    schoolId: string,
    totalAmount?: number,
    profileImage?: string,
}
