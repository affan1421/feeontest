import {
  ArrowDropDown,
  ArrowDropUp,
  Attachment,
  Cancel,
  Check,
  Close,
  CloseRounded,
  Print,
  Send,
  Visibility,
} from "@mui/icons-material";
import {
  Select,
  IconButton,
  SelectChangeEvent,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  TablePagination,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import styles from "./PaymentConfirmationManagement.module.css";
import { useEffect, useState } from "react";
import { Class } from "@/models/Class";
import api from "@/store/api";
import DatePicker from "@/Elements/DatePicker/DatePicker";
import Input from "@/Elements/Input/Input";
import {
  ApprovalAPIData,
  PaymentConfirmation,
} from "@/models/PaymentConfirmation";
import RejectDialog from "./RejectDialog/RejectDialog";
import PaymentDetails from "./PaymentDetails/PaymentDetails";
import ResendPaymentConfirmation from "../ResendPaymentConfirmation/ResendPaymentConfirmation";
import { ReceiptModel } from "@/models/Receipt";
import Receipt from "../Receipt/Receipt";
import { Transaction } from "@/models/Transaction";

interface Payment {
  method: string;
  date: string;
  bank_name?: string;
  transactionId?: string;
}

interface Student {
  _id: string;
  studentName: string;
  className: string;
  description: string;
  payment: Payment;
  paidAmount: number;
  status: string;
  dropdown: boolean;
  items: Item[];
  receiptId: string;
  comment: string;
  paymentComments: paymentComment[];
}

type StringFunction = (param: string) => void;

type ReactComponent = React.ComponentType<any>;

interface paymentComment {
  comment: string;
  date: string;
  status: "DECLINED" | "PENDING" | "RESEND";
  attachments: [];
}

interface FeeType {
  _id: string;
  feeType: string;
}

interface Item {
  feeTypeId: FeeType;
  installmentId: string;
  netAmount: number;
  paidAmount: number;
}

interface ModeDetail {
  idField: string;
  bankNameField: string;
  dateField: string;
}

interface ResendDetail {
  comment: string;
  attachments: string[];
}

interface Props {
  studentId?: string;
}

const PaymentConfirmationManagement = (props: Props) => {
  // API's
  const getPaymentConfirmationListAPI = api(
    (state) => state.getPaymentConfirmationList
  );

  const [students, setStudents] = useState<Student[]>([]);

  const paymentMethods = [
    { value: "CHEQUE", label: "Cheque" },
    { value: "ONLINE_TRANSFER", label: "Online Transfer" },
    { value: "UPI", label: "UPI" },
    { value: "DD", label: "DD" },
    { value: "DEBIT_CARD", label: "Debit Card" },
    { value: "CREDIT_CARD", label: "Credit Card" },
  ];

  const status = [
    { label: "Requested Again", value: "RESEND" },
    { label: "Pending", value: "PENDING" },
    { label: "Rejected", value: "DECLINED" },
    { label: "Approved", value: "APPROVED" },
  ];

  // School ID
  const schoolId = localStorage.getItem("school_id") as string;
  const isManagement =
    localStorage.getItem("role_name")?.toString() == "management"
      ? true
      : false;

  // API's
  const getClassesAPI = api((state) => state.getClasses);
  const approvalPaymentConfirmationAPI = api(
    (state) => state.approvalPaymentConfirmation
  );
  const getReceiptbyIdAPI = api((state) => state.getReceiptbyId);
  const getSchoolDetailAPI = api((state) => state.getSchoolDetailsById);

  const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel);
  const [classes, setClasses] = useState<Class[]>([]);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const [schoolDetails, setSchoolDetails] = useState({
    permissions: {
      ackReceipt: "DEFAULT",
    },
  });
  const [formValues, setFormValues] = useState({
    paymentMethod: "default",
    status: "default",
    date: "",
    search: "",
    section: "default",
  });
  const [rejectDialog, setRejectDialog] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [paymentDetailsDialog, setPaymentDetailsDialog] = useState(false);
  const [resendDetails, setResendDetails] = useState<ResendDetail>(
    {} as ResendDetail
  );
  const [resendDialog, setResendDialog] = useState(false);
  const [resendView, setResendView] = useState(false);
  const [paymentData, setPaymentData] = useState<any>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    getPaymentConfirmationList(
      newPage,
      pageSize,
      formValues.section,
      formValues.date,
      formValues.paymentMethod,
      formValues.search,
      formValues.status
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPage(0);
    setPageSize(newRowsPerPage);
    getPaymentConfirmationList(
      0,
      newRowsPerPage,
      formValues.section,
      formValues.date,
      formValues.paymentMethod,
      formValues.search,
      formValues.status
    );
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setFormValues({ ...formValues, paymentMethod: event.target.value });
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      formValues.date,
      event.target.value,
      formValues.search,
      formValues.status
    );
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setFormValues({ ...formValues, status: event.target.value });
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      formValues.date,
      formValues.paymentMethod,
      formValues.search,
      event.target.value
    );
  };

  const handleClearPaymentMethod = () => {
    setFormValues({ ...formValues, paymentMethod: "default" });
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      formValues.date,
      undefined,
      formValues.search,
      formValues.status
    );
  };

  const handleClearStatus = () => {
    setFormValues({ ...formValues, status: "default" });
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      formValues.date,
      formValues.paymentMethod,
      formValues.search,
      undefined
    );
  };

  const handleDateChange = (dateString: string) => {
    setFormValues({
      ...formValues,
      date: dateString ? dateString : "",
    });
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      dateString,
      formValues.paymentMethod,
      formValues.search,
      formValues.status
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setFormValues({ ...formValues, search: searchValue });
    debouncedHandleSearch(searchValue);
  };

  const debouncedHandleSearch = (searchValue: string) => {
    clearTimeout(debounceTimer!);
    const timer = setTimeout(() => {
      getPaymentConfirmationList(
        page,
        pageSize,
        formValues.section,
        formValues.date,
        formValues.paymentMethod,
        searchValue,
        formValues.status
      );
    }, 500);
    setDebounceTimer(timer);
  };

  const toggleReceiptDropdown = (studentId: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === studentId
          ? { ...student, dropdown: !student.dropdown }
          : student
      )
    );
  };

  // Get Classes
  const getClasses = () => {
    getClassesAPI(schoolId).then((response: any) => {
      setClasses(response.data.data);
    });
  };

  // Payment Confirmation List
  const getPaymentConfirmationList = (
    pageIndex: number,
    limit: number,
    section: string | undefined,
    date: string | undefined,
    paymentMethod: string | undefined,
    searchTerm: string | undefined,
    status: string | undefined
  ) => {
    let data: PaymentConfirmation = {
      page: pageIndex,
      limit: limit,
    };

    if (date) {
      data.date = new Date(date).toLocaleDateString("en-GB");
    }

    if (paymentMethod && paymentMethod !== "default") {
      data.paymentMethod = paymentMethod;
    }

    if (searchTerm && searchTerm !== "default") {
      data.searchTerm = searchTerm;
    }

    if (section && section !== "default") {
      data.sectionId = section;
    }

    if (status && status !== "default") {
      data.status = status;
    }

    if (props.studentId) {
      data.studentId = props.studentId;
    }

    getPaymentConfirmationListAPI(data).then((response) => {
      if (response && response.status === 200) {
        const students = response.data.data.map((student: Student) => {
          const payment = student.paymentComments
            ? student.paymentComments
                .filter((e) => e.status === student.status)
                .slice(-1)[0]
            : null;
    
          return {
            ...student,
            description: student.items
              .map((item) => item.feeTypeId.feeType)
              .join(", "),
            comment: payment && payment.comment ? payment.comment : "",
          };
        });
    
        setTotalCount(response.data.resultCount);
        setStudents(students);
      } else {
        setTotalCount(0);
        setStudents([]);
      }
    }).catch((error) => {
      console.error("Error fetching payment confirmation list:", error);
    });
    
  };

  const buttonProps = {
    sx: {
      borderRadius: "4px",
      border: "1px solid #d0d0d0",
      marginRight: "10px",
    },
  };

  const renderButton = (onClick: any, icon: any) => (
    <IconButton {...buttonProps} onClick={onClick}>
      {icon}
    </IconButton>
  );

  const approvalPaymentConfirmation = (receiptId: string) => {
    let data: ApprovalAPIData = {
      status: "APPROVED",
    };
    approvalPaymentConfirmationAPI(data, receiptId).then((response) => {
      if (response.status == 200) {
        getPaymentConfirmationList(
          page,
          pageSize,
          formValues.section,
          formValues.date,
          formValues.paymentMethod,
          formValues.search,
          formValues.status
        );
      }
    });
  };

  const handleClose = () => {
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      formValues.date,
      formValues.paymentMethod,
      formValues.search,
      formValues.status
    );
    setRejectDialog(false);
  };

  const handlePaymentClose = () => {
    setPaymentDetailsDialog(false);
  };

  const handleResendDialog = () => {
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      formValues.date,
      formValues.paymentMethod,
      formValues.search,
      formValues.status
    );
    setResendDialog(false);
    setResendView(false);
  };

  const updatePaymentDetails = (payment: Payment) => {
    setPaymentData(payment);
  };

  const updateResendDialog = (
    paymentComments: ApprovalAPIData[],
    status: string
  ) => {
    const length = paymentComments.filter((e) => e.status == status).length;
    const data: any = paymentComments.filter((e) => e.status == status)[
      length - 1
    ];
    setResendDetails(data);
  };

  const getReceiptbyId = (receiptId: string) => {
    getReceiptbyIdAPI(receiptId).then((response: any) => {
      if (response && response.status === 200) {
        setReceipt(response.data.data);
        setDialogEnabled(true);
      }
    });
  };

  const getSchoolDetails = (schoolId: string) => {
    getSchoolDetailAPI(schoolId).then((response: any) => {
      if (response && response.status === 200) {
        setSchoolDetails(response.data.data[0]);
      }
    });
  };

  useEffect(() => {
    getPaymentConfirmationList(
      page,
      pageSize,
      formValues.section,
      formValues.date,
      formValues.paymentMethod,
      formValues.search,
      formValues.status
    );
    getClasses();
    getSchoolDetails(schoolId);
  }, []);

  return (
    <div className={styles.main}>
      {!props.studentId && <h1>Payment Confirmation</h1>}
      <div
        className={styles.container}
        style={
          !props.studentId
            ? {
                padding: "20px 10px",
              }
            : {}
        }
      >
        <div className={styles.filters}>
          {!props.studentId && (
            <>
              <div className={styles.search}>
                <Input
                  value={formValues.search}
                  placeholder={"Student Name, Receipt Number"}
                  onChange={handleSearchChange}
                  type="text"
                />
              </div>
              <Select
                className={styles.selector}
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    section: e.target.value as string,
                  });
                  getPaymentConfirmationList(
                    page,
                    pageSize,
                    e.target.value,
                    formValues.date,
                    formValues.paymentMethod,
                    formValues.search,
                    formValues.status
                  );
                }}
                value={formValues.section}
                endAdornment={
                  formValues.section !== "default" && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        getPaymentConfirmationList(
                          page,
                          pageSize,
                          undefined,
                          formValues.date,
                          formValues.paymentMethod,
                          formValues.search,
                          formValues.status
                        );
                        setFormValues({ ...formValues, section: "default" });
                      }}
                    >
                      <CloseRounded />
                    </IconButton>
                  )
                }
                IconComponent={
                  formValues.section == "default" ? undefined : () => null
                }
              >
                <MenuItem value="default" disabled>
                  Select Class
                </MenuItem>
                {classes.map((item: Class) => {
                  return (
                    <MenuItem key={item.sectionId} value={item.sectionId}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </>
          )}
          <Select
            className={styles.selector}
            onChange={handlePaymentMethodChange}
            value={formValues.paymentMethod}
            endAdornment={
              formValues.paymentMethod !== "default" && (
                <IconButton size="small" onClick={handleClearPaymentMethod}>
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={
              formValues.paymentMethod == "default" ? undefined : () => null
            }
          >
            <MenuItem value="default" disabled>
              Payment Method
            </MenuItem>
            {paymentMethods.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            className={styles.selector}
            onChange={handleStatusChange}
            value={formValues.status}
            endAdornment={
              formValues.status !== "default" && (
                <IconButton size="small" onClick={handleClearStatus}>
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={
              formValues.status === "default" ? undefined : () => null
            }
          >
            <MenuItem value="default" disabled>
              Receipt Status
            </MenuItem>
            {status.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <DatePicker
            label=""
            value={formValues.date ? dayjs(formValues.date) : null}
            onChange={handleDateChange}
          />
        </div>
        <div className={styles.table}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Paid Amount</TableCell>
                  <TableCell>Payment Mode</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <>
                    <TableRow key={student._id}>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.description}</TableCell>
                      <TableCell>₹{student.paidAmount}</TableCell>
                      <TableCell>{student.payment.method}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            student.comment && (
                              <span className={styles.tooltip}>
                                {student.comment}
                              </span>
                            )
                          }
                        >
                          <div
                            className={`${styles.status} ${
                              styles[student.status.toLowerCase()]
                            }`}
                          >
                            {student.status}
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          sx={{
                            borderRadius: "4px",
                            border: "1px solid #d0d0d0",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            if (student.status == "RESEND") {
                              setReceiptId(student._id);
                              setResendView(true);
                              updateResendDialog(
                                student.paymentComments,
                                student.status
                              );
                              setResendDialog(true);
                              updatePaymentDetails(student.payment);
                            } else {
                              updatePaymentDetails(student.payment);
                              setPaymentDetailsDialog(true);
                            }
                          }}
                        >
                          <Visibility />
                        </IconButton>

                        {student.status === "APPROVED" &&
                          renderButton(
                            () => getReceiptbyId(student._id),
                            <Print />
                          )}

                        {(student.status === "PENDING" ||
                          student.status === "RESEND") &&
                          !(
                            (schoolDetails.permissions.ackReceipt ===
                              "MANAGEMENT" ||
                              schoolDetails.permissions.ackReceipt === "NONE" ||
                              !schoolDetails.permissions.ackReceipt) &&
                            !isManagement
                          ) && (
                            <>
                              {renderButton(
                                () => approvalPaymentConfirmation(student._id),
                                <Check />
                              )}
                              {renderButton(() => {
                                setReceiptId(student._id);
                                setRejectDialog(true);
                              }, <Close />)}
                            </>
                          )}

                        {student.status === "DECLINED" &&
                          !isManagement &&
                          renderButton(() => {
                            setReceiptId(student._id);
                            setResendView(false);
                            setResendDialog(true);
                          }, <Send />)}

                        {!student.status && (
                          <div style={{ minHeight: "40px" }}></div>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.dropdown ? (
                          <IconButton
                            onClick={() => toggleReceiptDropdown(student._id)}
                          >
                            <ArrowDropUp />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => toggleReceiptDropdown(student._id)}
                          >
                            <ArrowDropDown />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                    {student.items.length > 0 &&
                      student.dropdown &&
                      student.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>{item.feeTypeId.feeType}</TableCell>
                          <TableCell>₹{item.paidAmount}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <Dialog maxWidth="xl" open={rejectDialog} onClose={handleClose}>
        <RejectDialog handleClose={handleClose} receiptId={receiptId} />
      </Dialog>
      <Dialog
        maxWidth="xl"
        open={paymentDetailsDialog}
        onClose={handlePaymentClose}
      >
        <PaymentDetails
          handleClose={handlePaymentClose}
          paymentData={paymentData}
        />
      </Dialog>
      <Dialog maxWidth="xl" open={resendDialog} onClose={handleResendDialog}>
        <ResendPaymentConfirmation
          handleClose={handleResendDialog}
          receiptId={receiptId}
          resendView={resendView}
          resendDetails={resendDetails}
          paymentData={paymentData}
          status={""}
        />
      </Dialog>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <Receipt receipt={receipt} setDialogEnabled={setDialogEnabled} />
      </Dialog>
    </div>
  );
};

export default PaymentConfirmationManagement;
