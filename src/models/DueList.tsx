export interface DueListData {
    scheduleId?: string[];
    scheduleDates?: string[];
    categoryId?: string;

}

export interface DueAPIData {
    scheduleId: string[];
    scheduleDates: string[];
    page: number,
    limit: number,
    searchTerm?: string,
    paymentStatus?: string[]
}

export interface ClassListAPI {
    scheduleId: string[];
    scheduleDates: string[];
    page: number,
    limit: number,
    searchTerm: string
}

export interface ClassListExcel {
    scheduleId: string[];
    scheduleDates: string[];
}

export interface StudentListExcel {
    scheduleId: string[];
    scheduleDates: string[];
    paymentStatus: string[] | undefined;
    sectionId?: string;
}

export interface DueBySection {
    scheduleId: string[];
    scheduleDates: string[];
    searchTerm?: string,
    sectionId: string
}