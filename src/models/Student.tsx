export interface Student {
    _id: string;
    name: string;
    isSelected?: boolean;
    wasAlreadySelected?: boolean;
    isRemoved?: boolean;
    section?: string;
    profile_image?: string
    isPaid: boolean
    isNew?: boolean
    gender?: string
}

export interface StudentModel {
    name: string
    class: string
    username: number
    profile_image: string
    parentName: string
    _id: string
}