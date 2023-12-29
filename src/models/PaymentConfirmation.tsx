export interface PaymentConfirmation {
    date?: string,
    studentId?: string,
    sectionId?: string,
    searchTerm?: string,
    paymentMethod?: string,
    status?: string,
    page: number,
    limit: number
}

export interface ApprovalAPIData {
    status: 'PENDING' | 'RESEND' | 'DECLINED' | 'APPROVED',
    comment?: string,
    attachments?: string[]
}