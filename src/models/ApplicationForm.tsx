import { ReceiptModel } from './Receipt'

export interface ApplicationForm {
    studentName: string;
    classId: string;
    sectionId: string;
    className: string;
    parentName: string;
    gender: string;
    parentType:'default'|'FATHER'| 'MOTHER'| 'GUARDIAN'| 'OTHER',
    phoneNumber: number;
    course: string;
    amount: number;
    schoolId: string;
    paymentMode: "CASH",
    id?: string,
    _id?: string,
    receipt?: ReceiptModel,
    createdBy:string,
}

export interface EnrollStudent {
    school_id: string,
    p_username: number,
    guardian: number,
    p_name: string,
    name: string,
    gender: string,
    class: string,
    section: string,
    m_contact_number?: number,
    f_contact_number?: number,
    guardian_contact?: number,
    applicationId:string,
}
