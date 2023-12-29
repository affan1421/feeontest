import { Student } from "./Student";

export interface FeeDetails {
    feeTypeId: string;
    scheduleTypeId: string;
    scheduledDates: {
        date: Date;
        amount: number;
    }[];
    totalAmount: number;
    breakdown: number;
    isNewFieldinEdit?: boolean
}

export interface FeeStructureModel {
    id?: string,
    feeStructureName: string;
    academicYear?: string;
    academicYearId?: any;
    schoolId: string | null;
    classes: {
        name: string;
        sectionId: string;
    }[];
    classesString?: string[],
    description?: string;
    feeDetails: FeeDetails[];
    totalAmount: number;
    categoryId?: string;
    studentList?: Student[]
    isRowAdded?: boolean
}
