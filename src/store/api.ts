import { create } from "zustand";
import axios from "axios";
import { FeeScheduleModel } from "../models/FeeSchedule";
import { FeeTypeModel } from "../models/FeeType";
import { ApiState } from "../models/ApiState";
import { FeeDetails, FeeStructureModel } from "../models/FeeStructure";
import { AcademicYear } from "../models/AcademicYear";
import { APIData, Discount, Student } from "@/models/Discount";
import { DiscountStudentAPI } from "@/models/DiscountApproval";
import { FeeCategory } from "@/models/FeeCategory";
import { FeeCollectionAPI } from "@/models/FeeCollection";
import { ApplicationForm, EnrollStudent } from "@/models/ApplicationForm";
import { MiscellaneousFeeType } from "@/models/MiscellaneousFee";
import { Expense, ExpenseTypeModel } from "@/models/ExpenseCreation";
import { SortValue, PaymentMethod } from "@/models/ExpenseTransaction";
import { Donor } from "@/models/Donor";
import { PBData } from "@/models/PreviousBalance";
import { transPortBalanceData } from "@/models/TransactionList";
import { TransactionAPIData } from "@/models/TransactionList";
import { CardsData } from "@/models/Dashboard";
import {
  ClassListAPI,
  ClassListExcel,
  DueAPIData,
  DueBySection,
  DueListData,
  StudentListExcel,
} from "@/models/DueList";
import { ApprovalAPIData, PaymentConfirmation } from "@/models/PaymentConfirmation";
import { ReasonTypeModel } from "@/models/ReasonType";
import { DriverInfo, RouteDetail, StudentInfo, VehicleInfo } from "@/models/Transportation";

const baseUrlGrowon = `${import.meta.env.VITE_API_URL_GROWON}`;
const baseUrlFeeOn = `${import.meta.env.VITE_API_URL_FEEON}`;

const api = create<ApiState>((set) => {
  const growOn = axios.create({
    baseURL: baseUrlGrowon,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const feeOn = axios.create({
    baseURL: baseUrlFeeOn,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  growOn.interceptors.response.use(
    (response: any) => {
      set({
        alertMessage: {
          isEnabled: true,
          message: response?.data?.message,
          type: "success",
        },
      });
      setTimeout(() => {
        set({
          alertMessage: {
            isEnabled: false,
            message: "",
            type: "success",
          },
        });
      }, 3000);
      return response;
    },
    (err: any) => {
      set({
        alertMessage: {
          isEnabled: true,
          message: err?.response?.data?.message,
          type: "error",
        },
      });

      setTimeout(() => {
        set({
          alertMessage: {
            isEnabled: false,
            message: "",
            type: "error",
          },
        });
      }, 3000);
    }
  );

  feeOn.interceptors.response.use(
    (response: any) => {
      set({
        alertMessage: {
          isEnabled: true,
          message: response?.data?.message,
          type: "success",
        },
      });
      setTimeout(() => {
        set({
          alertMessage: {
            isEnabled: false,
            message: "",
            type: "success",
          },
        });
      }, 3000);
      return response;
    },
    (err: any) => {
      set({
        alertMessage: {
          isEnabled: true,
          message: err?.response?.data?.message,
          type: "error",
        },
      });

      setTimeout(() => {
        set({
          alertMessage: {
            isEnabled: false,
            message: "",
            type: "error",
          },
        });
      }, 3000);
    }
  );

  return {
    alertMessage: {
      isEnabled: false,
      message: "",
    },

    setError: async (enabled: boolean, message: string) => {
      set({
        alertMessage: {
          isEnabled: enabled,
          message: message,
          type: "error",
        },
      });
    },

    login: async (data: any) => {
      return growOn.post(`${baseUrlGrowon}/SignUp/login`, data);
    },

    // # Fee Type #

    createFeeType: async (data: FeeTypeModel) => {
      return feeOn.post(`${baseUrlFeeOn}/feetype`, data);
    },
    getFeeType: async (school_id: string, page: number, limit: number, categoryId: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feetype?page=${page}&limit=${limit}&schoolId=${school_id}&categoryId=${categoryId}`
      );
    },
    updateFeeType: async (data: FeeTypeModel) => {
      return feeOn.put(`${baseUrlFeeOn}/feetype/${data.id}`, data);
    },

    // # Fee Schedule #

    createFeeSchedule: async (data: FeeScheduleModel) => {
      return feeOn.post(`${baseUrlFeeOn}/feeschedule`, data);
    },
    getFeeSchedules: async (
      page: number,
      limit: number,
      schoolId: string,
      categoryId: string,
      scheduleType?: string
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feeschedule?page=${page}&limit=${limit}${
          scheduleType ? `&scheduleType=${scheduleType}` : ""
        }&schoolId=${schoolId}&categoryId=${categoryId}`
      );
    },
    updateFeeSchedule: async (data: FeeScheduleModel) => {
      return feeOn.put(`${baseUrlFeeOn}/feeschedule/${data.id}`, data);
    },

    // # Fee Structure #

    createFeeStructure: async (data: FeeStructureModel) => {
      return feeOn.post(`${baseUrlFeeOn}/feestructure`, data);
    },

    getFeeStructureById: async (id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feestructure/${id}`);
    },

    updateFeeStructure: async (data: FeeStructureModel, id: string) => {
      return feeOn.put(`${baseUrlFeeOn}/feestructure/${id}`, data);
    },

    getFeeStructures: async (school_id: string, page: number, limit: number, categoryId: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feestructure?schoolId=${school_id}&page=${page}&limit=${limit}&categoryId=${categoryId}`
      );
    },

    // # Get Classes #
    getClassesbyCategory: async (school_id: string, category_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feestructure/unmapped?schoolId=${school_id}&categoryId=${category_id}`);
    },

    getClassesbyDiscount: async (school_id: string, discount_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feestructure/unmapped?schoolId=${school_id}&discountId=${discount_id}`);
    },

    getClasses: async (school_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feestructure/unmapped?schoolId=${school_id}`);
    },

    // # Get Students by Class
    getStudentsbySection: async (sectionId: string) => {
      return growOn.get(`${baseUrlFeeOn}/student/${sectionId}/section`);
    },

    // # Get Academic Year Info #
    getYearAcademicInfo: async (school_id: string, page?: number, limit?: number, isActive?: boolean) => {
      if (!isActive) {
        return feeOn.get(
          `${baseUrlFeeOn}/config?schoolId=${school_id}${page ? `&page=${page}` : ""}${limit ? `&limit=${limit}` : ""}`
        );
      } else {
        return feeOn.get(`${baseUrlFeeOn}/config?schoolId=${school_id}&isActive=true`);
      }
    },

    // Update Status
    updateAcademicInfo: async (id: string, data: any) => {
      return feeOn.put(`${baseUrlFeeOn}/config/${id}`, data);
    },

    // Toggle status
    toggleAcademicInfo: async (id: string, status: boolean) => {
      let data = {
        id: id,
        isActive: status,
      };
      return feeOn.post(`${baseUrlFeeOn}/config/activate`, data);
    },

    createAcademicInfo: async (data: AcademicYear) => {
      return feeOn.post(`${baseUrlFeeOn}/config`, data);
    },

    // Update the permissions.ackReceipt
    updateAckReceipt: async (id: string, ackReceipt: string) => {
      return growOn.get(`${baseUrlGrowon}/school/${id}/updateLead?ackReceipt=${ackReceipt}`);
    },

    // # Fee Category

    createFeeCategory: async (data: FeeCategory) => {
      return feeOn.post(`${baseUrlFeeOn}/feecategory`, data);
    },

    editFeeCategory: async (data: FeeCategory, id: string) => {
      return feeOn.post(`${baseUrlFeeOn}/feecategory/${id}`, data);
    },

    getFeeCategories: async (school_id: string, page?: number, limit?: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feecategory?schoolId=${school_id}${page !== undefined ? `&page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }`
      );
    },

    // # Discount Module

    createDiscount: async (discount: Discount) => {
      return feeOn.post(`${baseUrlFeeOn}/discount`, discount);
    },

    fetchFeeCategoriesbySection: async (section_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feecategory/section/${section_id}`);
    },

    fetchFeeStructurebySectionandFeeCategory: async (section_id: string, category_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feestructure/category/${category_id}/section/${section_id}`);
    },

    fetchFeeStructuresbySectionandCategory: async (sectionId: string, categoryId: string, discountId: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feestructure/section/${sectionId}/category/${categoryId}?discountId=${discountId}`
      );
    },

    // # Fetching StudentList and FeeDetails in ADD DISCOUNT ALLOCATION SCREEN
    getStudentsandFeeDetails: async (feeStructureId: string, sectionId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feestructure/${feeStructureId}/feedetails/${sectionId}`);
    },

    getDiscountTypes: async (school_id: string, page: number, limit: number) => {
      return feeOn.get(`${baseUrlFeeOn}/discount?schoolId=${school_id}&page=${page}&limit=${limit}`);
    },

    getDiscountClassRow: async (discount_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/${discount_id}/class`);
    },

    assignDiscount: async (discount_id: string, discount: APIData) => {
      return feeOn.post(`${baseUrlFeeOn}/discount/${discount_id}/map`, discount);
    },

    updateStudentsinAssignDiscount: async (discount_id: string, data: any) => {
      return feeOn.post(`${baseUrlFeeOn}/discount/${discount_id}/addStudent`, data);
    },

    fetchStudentsbyDiscountandStructure: async (discount_id: string, feestructure_id: string, sectionId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/${discount_id}/structure/${feestructure_id}?sectionId=${sectionId}`);
    },

    fetchStudentsforDiscountApproval: async (discount_id: string, sectionId?: string, status?: string) => {
      let url = `${baseUrlFeeOn}/discount/${discount_id}/approval`;

      if (sectionId && sectionId !== "default") {
        url += `?sectionId=${sectionId}`;
      }

      if (status && status !== "default") {
        url += `${sectionId ? "&" : "?"}status=${status}`;
      }

      return feeOn.get(url);
    },

    updateStudentStatusinDiscountAPI: async (discount_id: string, student: DiscountStudentAPI) => {
      return feeOn.post(`${baseUrlFeeOn}/discount/${discount_id}/approval`, student);
    },

    getDiscountCategoryData: async (discount_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/${discount_id}`);
    },

    updateDiscountCategory: async (discount_id: string, discount: Discount) => {
      return feeOn.put(`${baseUrlFeeOn}/discount/${discount_id}`, discount);
    },

    getFeeDetailsbyClassRow: async (discount_id: string, section_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/${discount_id}/section/${section_id}`);
    },

    getFeeDetailsbyClassRowDiscountandStructure: async (
      discountId: string,
      feestructureId: string,
      sectionId: string
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/discount/${discountId}/mappedStructure/${feestructureId}?sectionId=${sectionId}`
      );
    },

    // # Fee Collection
    getStudentsinFeeCollection: async (
      page: number,
      limit: number,
      schoolId: string,
      search: string,
      sectionId: string
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feeinstallment/studentsList?&schoolId=${schoolId}&page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }${sectionId !== "default" ? `&sectionId=${sectionId}` : ""}`
      );
    },

    getFeeCategoriesbyStudent: async (student_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feecategory/student/${student_id}`);
    },

    getFeeCollectionDetails: async (student_id: string, category_id: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feeinstallment/studentstructure?studentId=${student_id}&categoryId=${category_id}`
      );
    },

    makePayment: async (data: FeeCollectionAPI) => {
      return feeOn.post(`${baseUrlFeeOn}/feeinstallment/makePayment`, data);
    },

    getStudentsbySectionandCategory: async (sectionId: string, categoryId: string) => {
      return growOn.get(`${baseUrlGrowon}/student/section/${sectionId}/category/${categoryId}`);
    },

    createApplicationFee: async (data: ApplicationForm) => {
      return feeOn.post(`${baseUrlFeeOn}/applicationfee`, data);
    },

    getAllApplicationForms: async (schoolId: string, page: number, limit: number, searchTerm?: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/applicationfee?schoolId=${schoolId}&page=${page}&limit=${limit}${
          searchTerm ? `&searchTerm=${searchTerm}` : ""
        }`
      );
    },

    getRecentTransaction: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feeinstallment/allTransactions?schoolId=${schoolId}&page=0&limit=50`);
    },

    getReceiptbyId: async (receiptId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feereceipt/${receiptId}`);
    },

    getMiscellaneousFeeTypes: async (schoolId: string, page?: number, limit?: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feetype?schoolId=${schoolId}&isMisc=true${page !== undefined ? `&page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }`
      );
    },

    createMiscellaneousFee: async (data: FeeTypeModel) => {
      return feeOn.post(`${baseUrlFeeOn}/feetype`, data);
    },

    getBySectionId: async (section: string) => {
      return feeOn.post(`${baseUrlGrowon}/student/getBySectionId`, { section });
    },

    miscCollection: async (data: MiscellaneousFeeType) => {
      return feeOn.post(`${baseUrlFeeOn}/feereceipt`, data);
    },

    getMiscCollections: async (schoolId: string, page: number, limit: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feereceipt?schoolId=${schoolId}&receiptType=MISCELLANEOUS&page=${page}&limit=${limit}`
      );
    },

    getIncomeDashboardData: async (schoolId: string, startDate?: string, endDate?: string, date?: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feeinstallment/incomeDashboard?schoolId=${schoolId}${date ? `&dateRange=${date}` : ""}${
          startDate ? `&startDate=${startDate}` : ""
        }${endDate ? `&endDate=${endDate}` : ""}`
      );
    },

    getAllExpenseType: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/expenseType?schoolId=${schoolId}`);
    },

    createExpense: async (data: Expense) => {
      return feeOn.post(`${baseUrlFeeOn}/expense`, data);
    },

    createExpenseType: async (data: ExpenseTypeModel) => {
      return feeOn.post(`${baseUrlFeeOn}/expenseType`, data);
    },

    updateExpenseType: async (data: ExpenseTypeModel) => {
      return feeOn.put(`${baseUrlFeeOn}/expenseType/${data.id}`, data);
    },

    getExpenseTransactions: async (
      schoolId: string,
      page: number,
      limit: number,
      sort?: SortValue,
      expenseTypeId?: string,
      paymentMethod?: PaymentMethod | undefined,
      searchTerm?: string | undefined,
      startDate?: string | undefined,
      endDate?: string | undefined
    ) => {
      let data: any = {
        schoolId,
        page,
        limit,
      };
      data = paymentMethod ? { ...data, paymentMethod } : data;
      data = searchTerm ? { ...data, searchTerm } : data;
      data = sort ? { ...data, sort } : data;
      data = expenseTypeId ? { ...data, expenseTypeId } : data;
      data = startDate ? { ...data, startDate } : data;
      data = endDate ? { ...data, endDate } : data;
      return feeOn.post(`${baseUrlFeeOn}/expense/expenseList`, data);
    },

    // # Expense
    getExpenseTypes: async (school_id: string, page: number, limit: number) => {
      return feeOn.get(`${baseUrlFeeOn}/expenseType?schoolId=${school_id}&page=${page}&limit=${limit}`);
    },

    getExpenseTypeNames: async (school_id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/expenseType/byschool?schoolId=${school_id}`);
    },

    // # Transaction #
    getTransactions: async (
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
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feereceipt/summary?schoolId=${schoolId}&page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }${paymentMethod ? `&paymentMode=${paymentMethod}` : ""}${sectionId ? `&sectionId=${sectionId}` : ""}${
          startDate ? `&startDate=${startDate}` : ""
        }${endDate ? `&endDate=${endDate}` : ""}${date ? `&date=${date}` : ""}${status ? `&status=${status}` : ""}`
      );
    },

    getExpenseDashboardData(schoolId: string, startDate?: string, endDate?: string, dateRange?: string) {
      return feeOn.get(
        `${baseUrlFeeOn}/expense/dashboard?schoolId=${schoolId}${dateRange ? `&dateRange=${dateRange}` : ""}${
          startDate ? `&startDate=${startDate}` : ""
        }${endDate ? `&endDate=${endDate}` : ""}`
      );
    },

    getIncomeExcel(schoolId: string, paymentMode?: string, sectionId?: string, startDate?: string, endDate?: string) {
      return feeOn.get(
        `${baseUrlFeeOn}/feereceipt/excel?schoolId=${schoolId}${paymentMode ? `&paymentMode=${paymentMode}` : ""}${
          sectionId ? `&sectionId=${sectionId}` : ""
        }${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`
      );
    },

    getExpenseExcel(schoolId: string, paymentMode?: string, sort?: SortValue, startDate?: string, endDate?: string) {
      return feeOn.get(
        `${baseUrlFeeOn}/expense/excel?schoolId=${schoolId}${paymentMode ? `&paymentMethod=${paymentMode}` : ""}${
          sort ? `&sort=${sort}` : ""
        }${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`
      );
    },

    getDonorList(schoolId: string, page: number, limit: number) {
      return feeOn.get(`${baseUrlFeeOn}/donor?schoolId=${schoolId}&page=${page}&limit=${limit}`);
    },

    createDonor(data: Donor) {
      return feeOn.post(`${baseUrlFeeOn}/donor`, data);
    },

    updateDonor(data: Donor, id: string) {
      return feeOn.put(`${baseUrlFeeOn}/donor/${id}`, data);
    },

    getDonorDetail(id: string) {
      return feeOn.get(`${baseUrlFeeOn}/donor/${id}`);
    },

    deleteDonor(id: string) {
      return feeOn.delete(`${baseUrlFeeOn}/donor/${id}`);
    },

    getStudentsListDonor(donorId: string, page: number, limit: number) {
      return feeOn.get(`${baseUrlFeeOn}/donor/${donorId}/donations?page=${page}&limit=${limit}`);
    },

    getDonorStats(schoolId: string) {
      return feeOn.get(`${baseUrlFeeOn}/donor/school/${schoolId}`);
    },

    enrollStudent(data: EnrollStudent) {
      return feeOn.post(`${baseUrlGrowon}/student/enroll`, data);
    },

    getTransactionsbyStudent(data: TransactionAPIData) {
      return feeOn.post(`${baseUrlFeeOn}/feereceipt/student`, data);
    },

    cancelReceipt(
      id: string,
      data: {
        status: "REQUESTED" | "CANCELLED" | "REJECTED";
        reason?: string;
      }
    ) {
      return feeOn.post(`${baseUrlFeeOn}/feereceipt/${id}/cancellation`, data);
    },

    getDonorsbySchool(schoolId: string) {
      return feeOn.get(`${baseUrlFeeOn}/donor?schoolId=${schoolId}`);
    },

    revokeDiscount(discountId: string, studentId: string) {
      return feeOn.post(`${baseUrlFeeOn}/discount/${discountId}/revoke`, {
        studentId,
      });
    },

    uploadFile: async (data: FormData) => {
      return growOn.post(`${baseUrlGrowon}/file/upload`, data);
    },

    dashboardStats: async (
      schoolId: string,
      dateRange: "daily" | "weekly" | "monthly" | "custom" | null,
      startDate: string,
      endDate: string
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feereceipt/dashboard?schoolId=${schoolId}${dateRange ? `&dateRange=${dateRange}` : ""}${
          startDate ? `&startDate=${startDate}` : ""
        }${endDate ? `&endDate=${endDate}` : ""}`
      );
    },

    createPreviousBalance: async (data: any) => {
      return feeOn.post(`${baseUrlFeeOn}/previousfees`, data);
    },

    getPreviousBalance: async (
      schoolId: string,
      page: number,
      limit: number,
      sectionId?: string,
      isEnrolled?: string,
      searchTerm?: string
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/previousFees?schoolId=${schoolId}&page=${page}&limit=${limit}${
          sectionId ? `&sectionId=${sectionId}` : ""
        }${isEnrolled ? `&isEnrolled=${isEnrolled}` : ""}${searchTerm ? `&searchTerm=${searchTerm}` : ""}`
      );
    },
    getAcademicYear: async () => {
      return feeOn.get(`${baseUrlFeeOn}/config/previous`);
    },

    getStudentsBySectionandAcademicYear: async (sectionId: string, academicYearId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/previousfees/students?sectionId=${sectionId}&academicYearId=${academicYearId}`);
    },

    downloadExcelExistingStudents: async (schoolId: string, studentList: string[], academicYearName: string) => {
      return feeOn.post(`${baseUrlFeeOn}/previousfees/existingStudentExcel`, {
        schoolId,
        studentList,
        academicYearName,
      });
    },

    importExcel: (schoolId: string, data: FormData, isExisting: boolean) => {
      return feeOn.post(`${baseUrlFeeOn}/previousfees/bulkCreate?schoolId=${schoolId}&isExisting=${isExisting}`, data);
    },

    previousBalanceMakePayment: (data: PBData) => {
      return feeOn.post(`${baseUrlFeeOn}/previousfees/makePayment`, data);
    },

    transportMakePayment: (data: transPortBalanceData) => {
      return feeOn.post(`${baseUrlFeeOn}/transportation/payment`, data);
    },

    getFeeSchedule: (schoolId: string, categoryId?: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feeschedule?schoolId=${schoolId}${categoryId ? `&categoryId=${categoryId}` : ""}`
      );
    },

    getCardsData: (scheduleId?: string, scheduleDates?: string[], withDisc?: boolean) => {
      const data: CardsData = {
        withDisc,
      };
      if (scheduleId && scheduleId !== "default") {
        data.scheduleId = scheduleId;
      }
      if (scheduleDates?.length) {
        data.scheduleDates = scheduleDates;
      }
      return feeOn.post(`${baseUrlFeeOn}/feeinstallment/reportBySchedules`, data);
    },

    getDueSummary: (categoryId?: string, scheduleId?: string[], scheduleDates?: string[]) => {
      const data: DueListData = {};
      if (scheduleId) {
        data.scheduleId = scheduleId;
      }
      if (categoryId) {
        data.categoryId = categoryId;
      }
      if (scheduleDates?.length) {
        data.scheduleDates = scheduleDates;
      }
      return feeOn.post(`${baseUrlFeeOn}/duelist/summary`, data);
    },

    getStudentReport: (studentId: string, categoryId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/feeinstallment/studentReport?studentId=${studentId}&categoryId=${categoryId}`);
    },

    getStudentDueList(data: DueAPIData) {
      return feeOn.post(`${baseUrlFeeOn}/duelist/studentList`, data);
    },

    getClassesDueList(data: ClassListAPI) {
      return feeOn.post(`${baseUrlFeeOn}/duelist/classList`, data);
    },

    downloadClassListExcel(data: ClassListExcel) {
      return feeOn.post(`${baseUrlFeeOn}/duelist/classListExcel`, data);
    },

    downloadStudentListExcel(data: StudentListExcel) {
      return feeOn.post(`${baseUrlFeeOn}/duelist/studentListExcel`, data);
    },

    searchStudent: (search: string, page: number, limit: number, schoolId: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/feeinstallment/student?search=${search}&schoolId=${schoolId}&page=${page}&limit=${limit}`
      );
    },

    studentDueListbySection: (data: DueBySection) => {
      return feeOn.post(`${baseUrlFeeOn}/duelist/studentListByClass`, data);
    },

    getDiscountCategory: (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/school/${schoolId}`);
    },

    // Discount Summary
    getDiscountSummary: () => {
      return feeOn.get(`${baseUrlFeeOn}/discount/summary`);
    },

    getDiscountCategoryGraph: () => {
      return feeOn.get(`${baseUrlFeeOn}/discount/graph`);
    },

    getClassGraph: () => {
      return feeOn.get(`${baseUrlFeeOn}/discount/graphBySection`);
    },

    getClassesByDiscountId: (discountId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/${discountId}/class`);
    },

    getSectionWiseData: (page: number, limit: number) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/sections?page=${page}&limit=${limit}`);
    },

    getFeeDetails(feeStructureId: string, discountId: string) {
      return feeOn.get(`${baseUrlFeeOn}/feestructure/${feeStructureId}/discount/${discountId}`);
    },

    getDiscountById: (categoryId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/${categoryId}`);
    },

    getClassSummaryById: (sectionId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/summary?sectionId=${sectionId}`);
    },

    getStudentsGiveDiscount: (discountId: string, feeStructureId: string, sectionId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/discount/${discountId}/structure/${feeStructureId}?sectionId=${sectionId}`);
    },

    getDiscountApproval: (
      page?: number,
      limit?: number,
      sectionId?: string,
      discountId?: String,
      searchTerm?: String,
      status?: String
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/discount/approval?page=${page}&limit=${limit}${sectionId ? `&sectionId=${sectionId}` : ""}${
          discountId ? `&discountId=${discountId}` : ""
        }${searchTerm ? `&searchTerm=${searchTerm}` : ""}${status ? `&status=${status}` : ""}`
      );
    },

    getStudentList: (page?: number, limit?: number, sectionId?: string, searchTerm?: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/discount/studentList?page=${page}&limit=${limit}${sectionId ? `&sectionId=${sectionId}` : ""}${
          searchTerm ? `&searchTerm=${searchTerm}` : ""
        }`
      );
    },

    setDiscountTemplate: (data: any) => {
      return feeOn.post(`${baseUrlFeeOn}/discount/createTemplate`, data);
    },

    getSchoolDetailsById: (schoolId: any) => {
      return growOn.get(`${baseUrlGrowon}/school/${schoolId}`);
    },

    getPaymentConfirmationList: (data: PaymentConfirmation) => {
      return feeOn.post(`${baseUrlFeeOn}/feereceipt/confirmations`, data);
    },

    approvalPaymentConfirmation: (data: ApprovalAPIData, receiptId: string) => {
      return feeOn.post(`${baseUrlFeeOn}/feereceipt/${receiptId}/confirmations`, data);
    },

    searchStudentsList: (
      school_id: string,
      searchQuery: string,
      page?: number,
      limit?: number,
      classId_sessonId?: string
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/transfercertificate/students?searchQuery=${searchQuery}&limit=${limit}&page=${page}&classId=${classId_sessonId}&school=${school_id}`
      );
    },

    getTcDetails: (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transfercertificate/details/${schoolId}`);
    },

    generateTc: (data: any) => {
      return feeOn.post(`${baseUrlFeeOn}/transfercertificate/`, data);
    },

    getTcStudentsList: (
      tcType: string,
      search?: string,
      classId?: string,
      status?: string,
      page?: number,
      limit?: number
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/transfercertificate/tcStudentsDetails?tcType=${tcType}&page=${page}&searchQuery=${search}&classId=${classId}&status=${status}&limit=${limit}`
      );
    },
    changeTcStatus: (id: string, status: string) => {
      return feeOn.put(`${baseUrlFeeOn}/transfercertificate/changeStatus/${id}?status=${status}`);
    },
    viewTcDetails: (id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transfercertificate/tcStudentsDetails?studentTcId=${id}`);
    },
    addClosingCollection: (data: any) => {
      return feeOn.post(`${baseUrlFeeOn}/dailyclosecollection/create`, data);
    },
    todaysTotalFees: (schoolId: string, date: any) => {
      return feeOn.get(`${baseUrlFeeOn}/dailyclosecollection/todaystotalfees?schoolId=${schoolId}&date=${date}`);
    },
    getDailyCloseCollection: (schoolId: string, searchQuery: string, date: string, page: number, limit: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/dailyclosecollection/collectionDetails?schoolId=${schoolId}&searchQuery=${searchQuery}&date=${date}&page=${page}&limit=${limit}`
      );
    },
    setDailyCloseCollectionStatus: (
      closeCollecionId: string,
      status: string,
      reason: string,
      attachments: string[]
    ) => {
      return feeOn.post(`${baseUrlFeeOn}/dailyclosecollection/updateStatus`, {
        closeCollecionId,
        reason,
        attachments,
        status,
      });
    },
    updateEditStatus: (schoolId: string, status: boolean) => {
      return feeOn.put(`${baseUrlFeeOn}/dailyclosecollection/allowEdit?schoolId=${schoolId}&status=${status}`);
    },
    getEditStatus: (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/dailyclosecollection/allowEdit?schoolId=${schoolId}`);
    },
    getTcReasonsForGenerateTc: (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transfercertificate/reasons?schoolId=${schoolId}`);
    },

    getReasonTypes: async (schoolId: string, page: number, limit: number) => {
      return feeOn.get(`${baseUrlFeeOn}/transfercertificate/reasons?schoolId=${schoolId}&page=${page}&limit=${limit}`);
    },

    createReasonType: async (data: ReasonTypeModel) => {
      return feeOn.post(`${baseUrlFeeOn}/transfercertificate/reasons`, data);
    },

    updateReasonType: async (data: ReasonTypeModel) => {
      return feeOn.put(`${baseUrlFeeOn}/transfercertificate/reasons`, data);
    },

    deleteTcReasonType: async (reasonId: any) => {
      return feeOn.delete(`${baseUrlFeeOn}/transfercertificate/deleteReasons?id=${reasonId}`);
    },

    //concsession API
    getStudentsForConcession: async (schoolId: string, classId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/classWiseStudentsData?schoolId=${schoolId}&classId=${classId}`);
    },

    getConcessionCardData: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/concessionCardData?schoolId=${schoolId}`);
    },

    getConcessionData: async (schoolId: string, status: string, search: string, page: number, limit: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/concession/studentsconcession?schoolId=${schoolId}&status=${status}&searchQuery=${search}&page=${page}&limit=${limit}`
      );
    },
    changeConcStatus: async (status: string, concId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/changeStatus/${concId}?status=${status}`);
    },

    getConcReason: async (schoolId: string, page: number, limit: number) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/reasons?schoolId=${schoolId}&page=${page}&limit=${limit}`);
    },

    createConcReason: async (data: ReasonTypeModel) => {
      return feeOn.post(`${baseUrlFeeOn}/concession/reasons`, data);
    },

    updateConcReason: async (data: ReasonTypeModel) => {
      return feeOn.put(`${baseUrlFeeOn}/concession/reasons`, data);
    },

    deleteConcReasonType: async (reasonId: string) => {
      return feeOn.delete(`${baseUrlFeeOn}/concession/deleteReasons?id=${reasonId}`);
    },

    getClassConc: async (schoolId: string, search: string, page: number, limit: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/concession/concessionClassList?schoolId=${schoolId}&searchQuery=${search}&page=${page}&limit=${limit}`
      );
    },
    getAllReasons: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/getAllReasonTypes?schoolId=${schoolId}`);
    },
    getStdConcDetials: async (schoolId: string, concId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/studentwithconcession?schoolId=${schoolId}&studentId=${concId}`);
    },
    getClassConcDetials: async (schoolId: string, sectionId: string, searchQuery: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/concession/concessionclasses?schoolId=${schoolId}&sectionId=${sectionId}&searchQuery=${searchQuery}`
      );
    },
    concsessionGetFeeDetails: async (schoolId: string, studentId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/feedetails?schoolId=${schoolId}&studentId=${studentId}`);
    },
    createConsesson: async (data: any) => {
      return feeOn.post(`${baseUrlFeeOn}/concession/create`, data);
    },
    revokeConsesson: async (concId: any) => {
      return feeOn.get(`${baseUrlFeeOn}/concession/revoke?concessionId=${concId}`);
    },
    createRoute: async (data: RouteDetail) => {
      return feeOn.post(`${baseUrlFeeOn}/transportation/createRoute`, data);
    },

    updateRoute: async (routeId: string, data: RouteDetail) => {
      return feeOn.put(`${baseUrlFeeOn}/transportation/editRoutes?routeId=${routeId}`, data);
    },
    getRouteDetails: async (schoolId: string, searchQuery?: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/transportation/searchRoute?schoolId=${schoolId}${
          searchQuery ? `&searchQuery=${searchQuery}` : ""
        }`
      );
    },
    createDriver: async (data: DriverInfo) => {
      return feeOn.post(`${baseUrlFeeOn}/transportation/add-driver`, data);
    },
    updateDriver: async (id: string, data: DriverInfo) => {
      return feeOn.put(`${baseUrlFeeOn}/transportation/edit-driver?id=${id}`, data);
    },
    deleteDriver: async (id: string) => {
      return feeOn.delete(`${baseUrlFeeOn}/transportation/delete-driver?id=${id}`);
    },
    getDriverList: async (schoolId: string, searchQuery?: string, page?: number, limit?: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/transportation/list-drivers?schoolId=${schoolId}${
          searchQuery ? `&searchQuery=${searchQuery}` : ""
        }&page=${page}&limit=${limit}`
      );
    },
    getDriverDetail: async (id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/view-driver?id=${id}`);
    },
    createVehicle: async (data: VehicleInfo) => {
      return feeOn.post(`${baseUrlFeeOn}/transportation/add-vehicle`, data);
    },

    updateVehicle: async (id: string, data: VehicleInfo) => {
      return feeOn.put(`${baseUrlFeeOn}/transportation/edit-vehicle?id=${id}`, data);
    },

    deleteVehicle: async (id: string) => {
      return feeOn.delete(`${baseUrlFeeOn}/transportation/delete-vehicle?id=${id}`);
    },

    getVehicleList: async (schoolId: string, searchQuery?: string, page?: number, limit?: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/transportation/list-vehicles?schoolId=${schoolId}${
          searchQuery ? `&searchQuery=${searchQuery}` : ""
        }&page=${page}&limit=${limit}`
      );
    },

    getVehicleById: async (id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/edit-vehicle?id=${id}`);
    },

    viewVehicleAttachment: async (id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/view-vehicle?id=${id}`);
    },

    getRouteListById: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/routelist?schoolId=${schoolId}`);
    },

    getDriverListbyId: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/driverlist?schoolId=${schoolId}`);
    },

    createStudent: async (data: StudentInfo) => {
      return feeOn.post(`${baseUrlFeeOn}/transportation/add-student-transport`, data);
    },

    getStudentsList: async (
      schoolId: string,
      classId?: string,
      searchQuery?: string,
      page?: number,
      limit?: number
    ) => {
      return feeOn.get(
        `${baseUrlFeeOn}/transportation/student-transport-list?schoolId=${schoolId}${
          classId ? `&classId=${classId}` : ""
        }${searchQuery ? `&searchQuery=${searchQuery}` : ""}&page=${page}&limit=${limit}`
      );
    },

    deleteStudent: async (id: string) => {
      return feeOn.delete(`${baseUrlFeeOn}/transportation/delete-student-transport?id=${id}`);
    },

    updateStudent: async (id: string, data: StudentInfo) => {
      return feeOn.put(`${baseUrlFeeOn}/transportation/edit-student-transport?id=${id}`, data);
    },

    getStudentById: async (id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/edit-student-transport?id=${id}`);
    },

    getVehicleNumbers: async (schoolId: string, search: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/vehicle-numbers?schoolId=${schoolId}&searchQuery=${search}`);
    },

    getAllDriverList: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/driverlist?schoolId=${schoolId}`);
    },

    getMonthList: async (schoolId: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/monthlist?schoolId=${schoolId}`);
    },

    getStopNameById: async (id: string) => {
      return feeOn.get(`${baseUrlFeeOn}/transportation/stoplist?routeId=${id}`);
    },
    getTransportData: async (schoolId: string, month?: string) => {
      return feeOn.get(
        `${baseUrlFeeOn}/transportation/dashboard-data?schoolId=${schoolId}${month ? `&month=${month}` : ""}`
      );
    },
    getClassData: async () => {
      return feeOn.get(`${baseUrlFeeOn}/admission/classlist`);
    },
    createSeats: async (classInfo: any) => {
      return feeOn.post(`${baseUrlFeeOn}/admission/create-seats`, { classInfo });
    },
    getGraphData: async () => {
      return feeOn.get(`${baseUrlFeeOn}/admission/totalseats`);
    },
    AddLead: async (data: any) => {
      return feeOn.post(`${baseUrlFeeOn}/admission/lead`, data);
    },
    getAdmissionClass: async () => {
      return feeOn.get(`${baseUrlFeeOn}/admission/class`);
    },
    getAdmissionSections: async (classId: any) => {
      return feeOn.get(`${baseUrlFeeOn}/admission/sections?classId=${classId}`);
    },
    getAdmissionStudents: async (status: string, search: string, page: number, limit: number) => {
      return feeOn.get(
        `${baseUrlFeeOn}/admission/newstudents?page=${page}&limit=${limit}&searchQuery=${search}&date=&status=${status}`
      );
    },
    getCardData: async () => {
      return feeOn.get(`${baseUrlFeeOn}/admission/dashboard`);
    },
    updateStatus: async (status: string, applicationNo: number) => {
      return feeOn.put(`${baseUrlFeeOn}/admission/update?applicationNo=${applicationNo}&status=${status}`);
    },

    admissionBasicLeadInfo: async (applicationId: string) => {
      return feeOn.get(`/admission/leadinfo?applicationNo=${applicationId}`);
    },

    admissionUpdateBasicLeadsInfo: async (data: any) => {
      return feeOn.put(`/admission/leadinfo/basic`, data);
    },
    admissionUpdateTestInfo: async (data: any) => {
      return feeOn.put(`/admission/leadinfo/test`, data);
    },
    admissionUpdatePreviousEducation: async (data: any) => {
      return feeOn.put(`/admission/leadinfo/prevschool`, data);
    },
    admissionUpdateDocumentUpload: async (data: any) => {
      return feeOn.put(`/admission/leadinfo/documents`, data);
    },
    admissionAddStudentFinalSubmit: async (applicationNo: any) => {
      return feeOn.post(`/admission/add-to-students?applicationNo=${applicationNo}`);
    },
  };
});

export default api;
