import * as yup from "yup";

export const FeeTypeSchema = yup.object().shape({
  feeType: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  accountType: yup
    .string()
    .required("Account Type is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
});

export const FeeScheduleSchema = yup.object().shape({
  scheduleName: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  day: yup
    .number()
    .required("Day is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  months: yup.array().min(1).required("Month is required"),
});

export const FeeStructureSchema = yup.object().shape({
  feeStructureName: yup.string().required("Name is required"),
  // academicYear: yup.string().required('Academic year  is required'),
  classes: yup.array().min(1).required("Class is required"),
  description: yup.string().required("Description is required"),
  feeDetails: yup.array().min(1).required("Fee Details is required"),
});

export const FeeCategorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string(),
});

export const DiscountSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  totalBudget: yup
    .string()
    .required("Budget is required")
    .transform((value, originalValue) => (originalValue === 0 ? null : value)),
});

export const DiscountAllocationSchema = yup.object().shape({
  sectionId: yup
    .string()
    .required("Class is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  categoryId: yup
    .string()
    .required("Category is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  rows: yup.array().min(1, "Atleast One Discount must be Entered").required("Atleast One Fee Type is required"),
  studentList: yup.array().min(1, "Atleast One Student is required").required("Atleast One Student is required"),
});

export const ApplicationFormSchema = yup.object().shape({
  studentName: yup.string().required("Student name is required"),
  gender: yup
    .string()
    .required("Gender is Required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  parentType: yup
    .string()
    .required("Parent Type is Required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  classId: yup
    .string()
    .required("Class is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  parentName: yup.string().required("Parent name is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  amount: yup
    .number()
    .required("Amount is required")
    .transform((value, originalValue) => (originalValue === 0 ? null : value)),
});

export const MiscellaneousCollectionSchema = yup.object().shape({
  feeTypeId: yup
    .string()
    .required("FeeType is Required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  classId: yup
    .string()
    .required("Class is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  studentId: yup
    .string()
    .required("Atleast One Student is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  totalFeeAmount: yup
    .number()
    .required("Amount is required")
    .transform((value, originalValue) => (originalValue === 0 ? null : value)),
});

export const CreateExpenseSchema = yup.object().shape({
  reason: yup.string().required("Reason is required"),
  expenseType: yup
    .string()
    .required("Expense type is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  paymentMethod: yup
    .string()
    .required("Payment method is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  amount: yup
    .number()
    .required("Amount is required")
    .transform((value, originalValue) => (originalValue === 0 ? null : value)),
  approvedBy: yup.string().required("Approved by is required"),
  validateExpenseDate: yup.date().max(new Date(), "Date cannot be in future").required("Date is required"),
});

export const createExpenseTypeSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  budget: yup
    .number()
    .required("Budget is required")
    .transform((value, originalValue) => (originalValue === 0 ? null : value)),
});

export const createReasonTypeSchema = yup.object().shape({
  reason: yup.string().required("Reason is required"),
});

export const CreateDonorSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email"),
  address: yup.string(),
  contactNumber: yup.string(),
  bank: yup.string().required("Bank is required"),
  IFSC: yup.string().required("IFSC is required").min(8, "Invalid IFSC Code"),
  accountNumber: yup
    .string()
    .required("Account number is required")
    .matches(/^[0-9]{6,18}$/, "Account number must be between 6 and 18 digits"),
  accountType: yup
    .string()
    .required("Account type is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
  donorType: yup
    .string()
    .required("Donor type is required")
    .transform((value, originalValue) => (originalValue === "default" ? null : value)),
});

export const closeCollectionSchema = yup.object().shape({
  schoolId: yup.string().required("school id is required"),
  name: yup.string().required("Name is required"),
  date: yup.string().required("Date is required"),
  cashAmount: yup
    .number()
    .required("Amount is required")
    .transform((value, originalValue) => (originalValue === 0 ? 0 : value))
    .test("not-negative", "Cash amount must be a non-negative number", (value) => value >= 0),
  expenseAmount: yup
    .number()
    .required("ExpenseAmount is required")
    .transform((value, originalValue) => (originalValue === 0 ? 0 : value))
    .test("not-negative", "Expense amount must be a non-negative number", (value) => value >= 0),
  bankName: yup.string().required("Bank name is required"),
});
