import { FeeScheduleModel } from "./FeeSchedule";
import { FeeDetails, FeeStructureModel } from "./FeeStructure";
import { FeeTypeModel } from "./FeeType";
import { AcademicYear } from "./AcademicYear";
import { Discount, APIData } from "./Discount";
import { DiscountStudentAPI } from "./DiscountApproval";
import { FeeCategory } from "./FeeCategory";
import { FeeCollectionAPI } from "./FeeCollection";
import { ApplicationForm, EnrollStudent } from "./ApplicationForm";
import { MiscellaneousFeeType } from "./MiscellaneousFee";
import { Expense, ExpenseTypeModel } from "./ExpenseCreation";
import { ReasonTypeModel } from "./ReasonType";
import { SortValue, PaymentMethod } from "./ExpenseTransaction";
import { Donor } from "./Donor";
import { PBData } from "./PreviousBalance";
import { TransactionAPIData } from "./TransactionList";
import { ClassListAPI, ClassListExcel, DueAPIData, DueBySection, StudentListExcel } from "./DueList";
import { ApprovalAPIData, PaymentConfirmation } from "./PaymentConfirmation";
import { DriverInfo, RouteDetail, StudentInfo, VehicleInfo } from "./Transportation";

export interface ApiState {
  [x: string]: any;
  alertMessage?: {
    isEnabled: boolean;
    message: string;
    type?: "error" | "info" | "success" | "warning";
  };
  login: (data: any) => Promise<any>;
  createFeeType: (data: FeeTypeModel) => Promise<any>;
  getFeeType: (school_id: string, page: number, limit: number, categoryId: string) => Promise<any>;
  updateFeeType: (data: FeeTypeModel) => Promise<any>;
  createFeeSchedule: (data: FeeScheduleModel) => Promise<any>;
  getFeeSchedules: (
    page: number,
    limit: number,
    schoolId: string,
    categoryId: string,
    scheduleType?: string
  ) => Promise<any>;
  updateFeeSchedule: (data: FeeScheduleModel) => Promise<any>;
  createFeeStructure: (data: FeeStructureModel) => Promise<any>;
  updateFeeStructure: (data: FeeStructureModel, id: string) => Promise<any>;
  getFeeStructureById: (id: string) => Promise<any>;
  getFeeStructures: (
    school_id: string,
    page: number,
    limit: number,
    categoryId: string
  ) => Promise<any>;
  getClassesbyCategory: (school_id: string, category_id: string) => Promise<any>;
  getClassesbyDiscount: (school_id: string, discount_id: string) => Promise<any>;
  getClasses: (school_id: string) => Promise<any>;
  getYearAcademicInfo: (
    school_id: string,
    page?: number,
    limit?: number,
    isActive?: boolean
  ) => Promise<any>;
  updateAcademicInfo: (id: string, data: any) => Promise<any>;
  toggleAcademicInfo: (id: string, data: any) => Promise<any>;
  createAcademicInfo: (data: AcademicYear) => Promise<any>;
  setError: (enabled: boolean, message: string) => Promise<any>;
  createFeeCategory: (data: FeeCategory) => Promise<any>;
  editFeeCategory: (data: FeeCategory, id: string) => Promise<any>;
  getFeeCategories: (school_id: string, page?: number, limit?: number) => Promise<any>;
  getStudentsbySection: (sectionId: string) => Promise<any>;
  createDiscount: (discount: Discount) => Promise<any>;
  fetchFeeCategoriesbySection: (section_id: string) => Promise<any>;
  fetchFeeStructurebySectionandFeeCategory: (
    section_id: string,
    category_id: string
  ) => Promise<any>;
  getDiscountTypes: (school_id: string, page: number, limit: number) => Promise<any>;
  assignDiscount: (discount_id: string, discount: APIData) => Promise<any>;
  getDiscountClassRow: (discount_id: string) => Promise<any>;
  fetchStudentsbyDiscountandStructure: (
    discount_id: string,
    feestructure_id: string,
    sectionId: string
  ) => Promise<any>;
  fetchStudentsforDiscountApproval: (
    discount_id: string,
    sectionId?: string,
    status?: string
  ) => Promise<any>;
  updateStudentStatusinDiscountAPI: (
    discount_id: string,
    student: DiscountStudentAPI
  ) => Promise<any>;
  updateStudentsinAssignDiscount: (discount_id: string, data: any) => Promise<any>;
  getDiscountCategoryData: (discount_id: string) => Promise<any>;
  updateDiscountCategory: (discount_id: string, discount: Discount) => Promise<any>;
  getFeeDetailsbyClassRow: (discount_id: string, section_id: string) => Promise<any>;
  getStudentsinFeeCollection: (
    page: number,
    limit: number,
    schoolId: string,
    search: string,
    sectionId: string
  ) => Promise<any>;
  getFeeCategoriesbyStudent: (student_id: string) => Promise<any>;
  getFeeCollectionDetails: (student_id: string, category_id: string) => Promise<any>;
  makePayment: (data: FeeCollectionAPI) => Promise<any>;
  getStudentsbySectionandCategory: (sectionId: string, categoryId: string) => Promise<any>;
  fetchFeeStructuresbySectionandCategory: (
    sectionId: string,
    categoryId: string,
    discountId: string
  ) => Promise<any>;
  getStudentsandFeeDetails: (feeStructureId: string, sectionId: string) => Promise<any>;
  getFeeDetailsbyClassRowDiscountandStructure: (
    discountId: string,
    feestructureId: string,
    sectionId: string
  ) => Promise<any>;
  createApplicationFee: (data: ApplicationForm) => Promise<any>;
  getAllApplicationForms: (
    schoolId: string,
    page: number,
    limit: number,
    searchTerm?: string
  ) => Promise<any>;
  getRecentTransaction: (schoolId: string) => Promise<any>;
  getReceiptbyId: (receiptId: string) => Promise<any>;
  createMiscellaneousFee: (data: FeeTypeModel) => Promise<any>;
  getMiscellaneousFeeTypes: (schoolId: string, page?: number, limit?: number) => Promise<any>;
  getBySectionId: (sectionId: string) => Promise<any>;
  miscCollection: (data: MiscellaneousFeeType) => Promise<any>;
  getMiscCollections: (schoolId: string, page: number, limit: number) => Promise<any>;
  getIncomeDashboardData: (
    schoolId: string,
    startDate?: string,
    endDate?: string,
    date?: string
  ) => Promise<any>;
  getAllExpenseType: (schoolId: string) => Promise<any>;
  getExpenseTypeNames: (schoolId: string) => Promise<any>;
  createExpense: (data: Expense) => Promise<any>;
  createExpenseType: (data: ExpenseTypeModel) => Promise<any>;
  updateExpenseType: (data: ExpenseTypeModel) => Promise<any>;
  // createReasonType: (data: ReasonTypeModel) => Promise<any>;
  // updateReasonType: (data: ReasonTypeModel) => Promise<any>;
  getExpenseTypes: (schoolId: string, page: number, limit: number) => Promise<any>;
  getExpenseTransactions: (
    schoolId: string,
    page: number,
    limit: number,
    sort?: SortValue,
    expenseTypeId?: string,
    paymentMethod?: PaymentMethod | undefined,
    searchTerm?: string | undefined,
    startDate?: string | undefined,
    endDate?: string | undefined
  ) => Promise<any>;
  getTransactions: (
    schoolId: string,
    page: number,
    limit: number,
    sectionId?: string,
    paymentMethod?: PaymentMethod,
    search?: string | undefined,
    date?: string,
    startDate?: string,
    endDate?: string,
    status?: string
  ) => Promise<any>;
  getExpenseDashboardData: (
    schoolId: string,
    startDate?: string,
    endDate?: string,
    dateRange?: string
  ) => Promise<any>;
  getIncomeExcel: (
    schoolId: string,
    paymentMode?: string,
    sectionId?: string,
    startDate?: string,
    endDate?: string
  ) => Promise<any>;
  getExpenseExcel: (
    schoolId: string,
    paymentMethod?: string,
    sort?: SortValue,
    startDate?: string,
    endDate?: string
  ) => Promise<any>;
  getDonorList: (schoolId: string, page: number, limit: number) => Promise<any>;
  createDonor: (data: Donor) => Promise<any>;
  updateDonor: (data: Donor, id: string) => Promise<any>;
  getDonorDetail: (id: string) => Promise<any>;
  deleteDonor: (id: string) => Promise<any>;
  getStudentsListDonor: (donorId: string, page: number, limit: number) => Promise<any>;
  getDonorStats: (schoolId: string) => Promise<any>;
  enrollStudent: (data: EnrollStudent) => Promise<any>;
  getTransactionsbyStudent: (data: TransactionAPIData) => Promise<any>;
  cancelReceipt: (
    id: string,
    data: {
      status: "REQUESTED" | "CANCELLED" | "REJECTED";
      reason?: string;
    }
  ) => Promise<any>;
  getDonorsbySchool: (schoolId: string) => Promise<any>;
  revokeDiscount(discountId: string, studentId: string): Promise<any>;
  uploadFile: (data: FormData) => Promise<any>;
  dashboardStats: (
    schoolId: string,
    dateRange: "daily" | "weekly" | "monthly" | "custom" | null,
    startDate: string,
    endDate: string
  ) => Promise<any>;
  createPreviousBalance: (data: any) => Promise<any>;
  getPreviousBalance: (
    schoolId: string,
    page: number,
    limit: number,
    sectionId?: string,
    isEnrolled?: string,
    searchTerm?: string
  ) => Promise<any>;
  getAcademicYear: () => Promise<any>;
  getStudentsBySectionandAcademicYear: (sectionId: string, academicYearId: string) => Promise<any>;
  downloadExcelExistingStudents: (
    schoolId: string,
    studentList: string[],
    academicYearName: string
  ) => Promise<any>;
  importExcel: (schoolId: string, data: FormData, isExisting: boolean) => Promise<any>;
  getFeeSchedule: (schoolId: string, categoryId?: string) => Promise<any>;
  previousBalanceMakePayment: (data: PBData) => Promise<any>
  getCardsData: (scheduleId?: string, scheduleDates?: string[], withDisc?: boolean) => Promise<any>
  getDueSummary: (categoryId?:string,scheduleId?: string[], scheduleDates?: string[]) => Promise<any>
  getStudentReport: (studentId: string, categoryId: string) => Promise<any>
  getStudentDueList: (data: DueAPIData) => Promise<any>
  getClassesDueList: (data: ClassListAPI) => Promise<any>
  downloadClassListExcel: (data: ClassListExcel) => Promise<any>
  downloadStudentListExcel: (data: StudentListExcel) => Promise<any>
  searchStudent: (search: string, page: number, limit: number, schoolId: string) => Promise<any>
  studentDueListbySection: (data: DueBySection) => Promise<any>
  getDiscountCategory: (schoolId: string) => Promise<any>
  getDiscountSummary: () => Promise<any>
  getDiscountCategoryGraph: () => Promise<any>
  getClassGraph: () => Promise<any>
  getClassesByDiscountId: (discountId: string) => Promise<any>
  getSectionWiseData: (page: number, limit: number) => Promise<any>
  getFeeDetails: (feeStructureId: string, discountId: string) => Promise<any>
  getDiscountById: (categoryId: string) => Promise<any>
  getClassSummaryById: (sectionId: string) => Promise<any>
  getStudentsGiveDiscount: (discountId: string, feeStructureId: string, sectionId: string) => Promise<any>
  getDiscountApproval: (page?: number, limit?: number, sectionId?: string, discountId?: String, searchTerm?: String, status?: String) => Promise<any>
  getStudentList: (page?: number, limit?: number, sectionId?: string, searchTerm?: string) => Promise<any>
  setDiscountTemplate: (data: any) => Promise<any>
  getSchoolDetailsById: (schoolId: any) => Promise<any>
  getPaymentConfirmationList: (data: PaymentConfirmation) => Promise<any>
  approvalPaymentConfirmation: (data: ApprovalAPIData, receiptId: string) => Promise<any>
  updateAckReceipt: (schoolId: string, value: string) => Promise<any>
  createRoute: (data: RouteDetail) => Promise<any>
  updateRoute: (routeId: string, data: RouteDetail) => Promise<any>
  getRouteDetails: (schoolId: string, searchQuery?: string) => Promise<any>
  createDriver: (data: DriverInfo) => Promise<any>
  updateDriver: (id: string, data: DriverInfo) => Promise<any>
  deleteDriver: (id: string) => Promise<any>
  getDriverList: (schoolId: string, searchQuery?: string, page?: number, limit?: number) => Promise<any>
  getDriverDetail: (id: string) => Promise<any>
  createVehicle: (data: VehicleInfo) => Promise<any>
  updateVehicle: (id: string, data: VehicleInfo) => Promise<any>
  deleteVehicle: (id: string) => Promise<any>
  getVehicleById: (id: string) => Promise<any>
  getVehicleList: (schoolId: string, searchQuery?: string, page?: number, limit?: number) => Promise<any>
  getRouteListById: (schoolId: string) => Promise<any>
  getDriverListbyId: (schoolId: string) => Promise<any>
  createStudent: (data: StudentInfo) => Promise<any>
  getStudentsList: (schoolId: string,classId?:string,searchQuery?: string, page?: number, limit?: number) => Promise<any>
  deleteStudent:(id: string) => Promise<any>
  updateStudent: (id: string, data: StudentInfo) => Promise<any>
  getStudentById: (id: string) => Promise<any>
  getMonthList: (schoolId: string) => Promise<any>
  getStopNameById: (schoolId: string) => Promise<any>
  getTransportData: (schoolId: string, month?: string) => Promise<any>
  
}
