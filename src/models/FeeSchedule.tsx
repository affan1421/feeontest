export interface FeeScheduleModel {
    scheduleName: string
    description: string
    day: any
    months: number[]
    id?: string | null,
    schoolId?: string,
    existMonths?: string[],
    categoryId?: string
}
