import { useEffect, useState } from "react";
import styles from "./MakePayment.module.css";
import {
  IconButton,
  Select,
  Checkbox,
  MenuItem,
  InputBase,
  Paper,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "@/Elements/DatePicker/DatePicker";
import { Dialog } from "@mui/material";
import Input from "@/Elements/Input/Input";
import dayjs from "dayjs";
import { FeeCollectionAPI, FeeDetail } from "@/models/FeeCollection";
import api from "@/store/api";
import Receipt from "../Receipt/Receipt";
import { ReceiptModel } from "@/models/Receipt";
import AddDonor from "../AddDonor/AddDonor";
import { Transaction } from "@/models/Transaction";
import { TransactionAPIData } from "@/models/TransactionList";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { dateFormatter } from "@/helpers/dateFormatter";
import { localStorageAvailable } from "@mui/x-data-grid/utils/utils";
// import { DatePicker as DatePicker1 } from "@mui/x-date-pickers/DatePicker";
import { Close } from "@mui/icons-material";
import { c } from "msw/lib/glossary-de6278a9";
import ConfirmPayment from "../ConfirmPayment/ConfirmPayment";

interface DetailProps {
  mode: string;
  setInputValues: React.Dispatch<
    React.SetStateAction<{
      idField: string;
      bankNameField: string;
      dateField: any;
    }>
  >;
}

interface ReceiptItem {
  receiptId: string;
  _id: string;
}
const Details = (props: DetailProps) => {
  let modeDetail = {
    idField: "",
    bankNameField: "",
    dateField: "",
  };
  const [inputValues, setInputValues] = useState({
    idField: "",
    bankNameField: "",
    dateField: new Date(),
  });

  switch (props.mode) {
    case "Cheque":
      modeDetail.idField = "Cheque Number";
      modeDetail.bankNameField = "Bank Name";
      modeDetail.dateField = "Cheque Date";
      break;
    case "Online Transfer":
      modeDetail.idField = "Transaction ID";
      modeDetail.bankNameField = "Bank Name";
      modeDetail.dateField = "Transaction Date";
      break;
    case "UPI":
      modeDetail.idField = "UPI ID";
      modeDetail.bankNameField = "Bank Name";
      modeDetail.dateField = "Transaction Date";
      break;
    case "DD":
      modeDetail.idField = "DD Number";
      modeDetail.bankNameField = "Bank Name";
      modeDetail.dateField = "DD Date";
      break;
    case "Debit Card":
      modeDetail.idField = "Transaction Id";
      break;
    case "Credit Card":
      modeDetail.idField = "Transaction Id";
      break;
    default:
      break;
  }

  useEffect(() => {
    props.setInputValues(inputValues);
  }, [inputValues]);

  return (
    <div className={styles.detail_card}>
      <span>Details</span>
      <br />
      <Input
        placeholder={modeDetail.idField}
        value={inputValues.idField}
        onChange={(event) => setInputValues({ ...inputValues, idField: event.target.value })}
      />
      {props.mode !== "Debit Card" && props.mode !== "Credit Card" ? (
        <>
          <Input
            placeholder={modeDetail.bankNameField}
            value={inputValues.bankNameField}
            onChange={(event) =>
              setInputValues({
                ...inputValues,
                bankNameField: event.target.value,
              })
            }
          />
          <div>
            <DatePicker
              label={modeDetail.dateField}
              value={dayjs(inputValues.dateField)}
              onChange={(date) => setInputValues({ ...inputValues, dateField: date })}
            />
            {/* <DatePicker label={modeDetail.dateField} value={inputValues.dateField} onChange={(date) => setInputValues({ ...inputValues, dateField: date })} /> */}
          </div>
        </>
      ) : null}
    </div>
  );
};

export interface ModeDetail {
  idField: string;
  bankNameField: string;
  dateField: string;
}

interface MakePaymentProps {
  setIsMakePayment: React.Dispatch<React.SetStateAction<boolean>>;
  schoolId: string;
  feeDetails: FeeDetail[];
  studentId: string;
  collectedFee: number;
  totalFeeAmount: number;
  dueAmount: number;
  feeCategory: {
    feeCategoryName: string;
    feeCategoryId: string;
  };
  issueDate?: any;
}

interface Donor {
  name: string;
  _id: string;
}

const MakePayment = (props: MakePaymentProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const schoolId = localStorage.getItem("school_id");

  // API's
  const makePaymentAPI = api((state) => state.makePayment);
  const getTransactionsbyStudentAPI = api((state) => state.getTransactionsbyStudent);
  const getDonorsbySchoolAPI = api((state) => state.getDonorsbySchool);
  const getSchoolDetailAPI = api((state) => state.getSchoolDetailsById);
  const setError = api((state) => state.setError);

  const modes = ["Cash", "Cheque", "Online Transfer", "UPI", "DD", "Debit Card", "Credit Card"];
  const [data, setData] = useState<any>({});
  const [paymentMode, setPaymentMode] = useState<string>("Cash");
  const [comment, setComment] = useState("");

  const [inputValues, setInputValues] = useState<ModeDetail>({
    idField: "",
    bankNameField: "",
    dateField: "",
  });
  const [modeDetail, setModeDetail] = useState<ModeDetail>({} as ModeDetail);

  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [dialogDonorEnabled, setDialogDonorEnabled] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel);
  const [isCorrespondenceReceipt, setIsCorrespondenceReceipt] = useState(false);
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [corresspondenceReceipt, setCorresspondenceReceipt] = useState("default");
  const [dialogPaymentEnabled, setDialogPaymentEnabled] = useState(false);

  const [donors, setDonors] = useState<Donor[]>([]);
  const [isDonor, setIsDonor] = useState(false);
  const [donor, setDonor] = useState("default");
  const [date, setDate] = useState(dayjs(new Date()));
  const [schoolDetails, setSchoolDetails] = useState({
    permissions: {
      prevDateReceipt: false,
      prevDateVoucher: false,
      ackReceipt: "DEFAULT",
    },
  });
  // const [date, setDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMode((event.target as HTMLInputElement).value);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const getTransactionsbyStudent = () => {
    let data: TransactionAPIData = {
      studentId: id as string,
      status: "CANCELLED",
    };
    getTransactionsbyStudentAPI(data).then((response) => {
      setReceipts(response.data.data);
    });
  };

  const getDonorsbySchool = () => {
    getDonorsbySchoolAPI(props.schoolId).then((response) => {
      setDonors(response.data.data);
    });
  };

  const getSchoolDetails = () => {
    getSchoolDetailAPI(schoolId).then((response) => {
      let permissions = response.data.data[0].permissions;
      setSchoolDetails({
        ...schoolDetails,
        permissions: permissions,
      });
    });
  };

  const handlePay = async () => {
    let modeDetail: ModeDetail = {
      idField: "",
      bankNameField: "",
      dateField: "",
    };
    switch (paymentMode) {
      case "Cheque":
        modeDetail.idField = "Cheque Number";
        modeDetail.bankNameField = "Bank Name";
        modeDetail.dateField = "Cheque Date";
        break;
      case "Online Transfer":
        modeDetail.idField = "Transaction ID";
        modeDetail.bankNameField = "Bank Name";
        modeDetail.dateField = "Transaction Date";
        break;
      case "UPI":
        modeDetail.idField = "UPI ID";
        modeDetail.bankNameField = "Bank Name";
        modeDetail.dateField = "Transaction Date";
        break;
      case "DD":
        modeDetail.idField = "DD Number";
        modeDetail.bankNameField = "Bank Name";
        modeDetail.dateField = "DD Date";
        break;
      case "Debit Card":
        modeDetail.idField = "Transaction Id";
        break;
      case "Credit Card":
        modeDetail.idField = "Transaction Id";
        break;

      default:
        break;
    }

    const paymentDetails: Record<string, string> = {};
    paymentDetails[modeDetail.idField] = inputValues.idField;
    paymentDetails[modeDetail.bankNameField] = inputValues.bankNameField;
    paymentDetails[modeDetail.dateField] = inputValues.dateField;

    let data: FeeCollectionAPI = {
      schoolId: props.schoolId,
      studentId: props.studentId,
      feeDetails: props.feeDetails,
      collectedFee: props.collectedFee,
      totalFeeAmount: props.totalFeeAmount,
      dueAmount: props.dueAmount,
      paymentMethod: paymentMode.toUpperCase().split(" ").join("_"),
      feeCategoryName: props.feeCategory.feeCategoryName,
      feeCategoryId: props.feeCategory.feeCategoryId,
      receiptType: "ACADEMIC",
      comment: comment,
      issueDate: date.toString(),
      status: paymentMode !== "Cash" && schoolDetails.permissions.ackReceipt === "MANAGEMENT" ? "PENDING" : "APPROVED",
      createdBy: localStorage.getItem("user_id") as string,
    };

    if (paymentDetails[modeDetail.bankNameField]) {
      if (
        !(
          (paymentMode === "Cash")
          // || paymentMode === 'Debit Card'
          // || paymentMode === 'Credit Card'
        )
      ) {
        data.bankName = paymentDetails[modeDetail.bankNameField];
        data.payerName = paymentDetails[modeDetail.bankNameField];
      }
    }
    if (paymentDetails["Cheque Date"]) {
      data.chequeDate = paymentDetails["Cheque Date"];
    }
    if (paymentDetails["Cheque Number"]) {
      data.chequeNumber = paymentDetails["Cheque Number"];
    }
    if (paymentDetails["Transaction Date"]) {
      data.transactionDate = paymentDetails["Transaction Date"];
      data.issueDate = paymentDetails[modeDetail.dateField];
    }
    if (paymentDetails["Transaction ID"]) {
      data.transactionId = paymentDetails["Transaction ID"];
    }
    if (paymentDetails["UPI ID"]) {
      data.upiId = paymentDetails["UPI ID"];
    }
    if (paymentDetails["DD Number"]) {
      data.ddNumber = paymentDetails["DD Number"];
    }
    if (paymentDetails["DD Date"]) {
      data.ddDate = paymentDetails["DD Date"];
      data.issueDate = paymentDetails[modeDetail.dateField];
    }
    if (paymentDetails["Transaction Id"]) {
      data.transactionId = paymentDetails["Transaction Id"];
    }
    if (isCorrespondenceReceipt) {
      data.corReceiptId = corresspondenceReceipt;
    }
    if (isDonor) {
      data.donorId = donor;
    }
    data.issueDate = dateFormatter(date.toString());
    data.createdBy = localStorage.getItem("user_id") as string;

    try {
      let errorMessage = "";

      if (paymentMode !== "Cash") {
        if (!paymentDetails[modeDetail.idField]) {
          errorMessage += "ID is required.\n";
        }

        if (
          !paymentDetails[modeDetail.bankNameField] &&
          paymentMode !== "Debit Card" &&
          paymentMode !== "Credit Card"
        ) {
          errorMessage += "Bank Name is required.\n";
        }

        if (!paymentDetails[modeDetail.dateField]) {
          errorMessage += "Date is required.\n";
        }
      }

      if (errorMessage) {
        setError(true, errorMessage.trim());
        setTimeout(() => {
          setError(false, "");
        }, 2000);
      } else if (paymentMode !== "Cash" && schoolDetails.permissions.ackReceipt === "BOTH") {
        setDialogPaymentEnabled(true);
        setModeDetail(modeDetail);
        setData(data);
        return;
      } else {
        const response = await makePaymentAPI(data);
        if (response.status === 201) {
          setDialogEnabled(true);
          setReceipt(response.data.data);
        }
      }
    } catch (error: any) {
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  const handleAddDonor = () => {
    setDialogDonorEnabled(false);
    getDonorsbySchool();
  };

  // const handleDateChange = (event : any) => {
  //     const currentDate = new Date(`${event.$M + 1}/${event.$D}/${event.$y}`);
  //     const formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  //     console.log(formattedDate);
  //     setDate(formattedDate) // You can use formattedDate as needed
  // };

  useEffect(() => {
    getDonorsbySchool();
    getTransactionsbyStudent();
    getSchoolDetails();
  }, []);

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.main_header}>
          <div>
            <IconButton
              onClick={() => {
                props.setIsMakePayment(false);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            &nbsp;&nbsp; Back
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <h1>Make Payment</h1>
        <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <div style={{ width: "100%" }}>
            <div className={styles.row}>
              <Paper className={styles.input}>
                <InputBase
                  placeholder="Enter Amount"
                  size="small"
                  className={styles.input_input}
                  value={props.collectedFee}
                  disabled
                />
              </Paper>
              {schoolDetails?.permissions?.prevDateReceipt && (
                <div>
                  <DatePicker label={"Issue Date"} value={dayjs(date)} onChange={(date) => setDate(date)} />
                </div>
              )}
              {/* <div className={styles.input_date}>
                                <LocalizationProvider
                                    className={styles.input_date}
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker1
                                        label="Select Date"
                                        className={styles.datepicker}
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                InputProps: {
                                                    sx: {
                                                        height: '48px',
                                                    },
                                                },
                                            }
                                        }}
                                        onChange={handleDateChange}
                                        format="DD/MM/YYYY"
                                        value={date}
                                    />
                                </LocalizationProvider>
                            </div> */}
            </div>
            <div className={styles.row}>
              <div>
                <Checkbox
                  onChange={(event) => {
                    if (event.target.checked) {
                      setIsDonor(true);
                    } else {
                      setIsDonor(false);
                    }
                  }}
                />
              </div>
              <div style={{ minWidth: "70%" }}>
                <Select
                  value={donor}
                  onChange={(event) => {
                    setDonor(event.target.value as string);
                  }}
                  disabled={!isDonor}
                  className={styles.selector}
                  style={{ minWidth: "100%" }}
                >
                  <MenuItem value="default" disabled>
                    Select Donor
                  </MenuItem>
                  {donors.map((donor) => {
                    return <MenuItem value={donor._id}>{donor.name}</MenuItem>;
                  })}
                </Select>
              </div>
              <button
                style={{
                  minWidth: "16%",
                }}
                onClick={() => {
                  setDialogDonorEnabled(true);
                }}
              >
                Add Donor
              </button>
            </div>
            <div className={styles.row}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  onChange={(event) => {
                    if (event.target.checked) {
                      setIsCorrespondenceReceipt(true);
                    } else {
                      setIsCorrespondenceReceipt(false);
                    }
                  }}
                />
                <span>Corresponding Receipt</span>
              </div>
              <div style={{ minWidth: "65%" }}>
                <Select
                  value={corresspondenceReceipt}
                  className={styles.selector}
                  style={{ minWidth: "100%" }}
                  disabled={!isCorrespondenceReceipt}
                  onChange={(event) => {
                    setCorresspondenceReceipt(event.target.value as string);
                  }}
                >
                  <MenuItem value="default" disabled>
                    Select Receipt
                  </MenuItem>
                  {receipts.map((receipt: ReceiptItem) => {
                    return (
                      <MenuItem key={receipt._id} value={receipt._id}>
                        {receipt.receiptId}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={styles.row}>
              <span>Payment Mode</span>
            </div>
            <div className={styles.payment_row}>
              <div className={styles.paymentselector}>
                <FormControl>
                  <RadioGroup value={paymentMode} onChange={handleChange}>
                    {modes.map((mode) => {
                      return <FormControlLabel key={mode} value={mode} control={<Radio />} label={mode} />;
                    })}
                  </RadioGroup>
                </FormControl>
              </div>
              {paymentMode !== "Cash" && (
                // paymentMode !== 'Debit Card' &&
                // paymentMode !== 'Credit Card' &&
                <div className={styles.details}>
                  <Details mode={paymentMode} setInputValues={setInputValues} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ margin: "20px 0px" }}>
          <span className={styles.label}>Comment</span>
          <br />
          <Paper className={styles.input_desc}>
            <TextareaAutosize
              data-testid="add-description"
              placeholder="Comment"
              id="filled-hidden-label-small"
              className={styles.input_input_desc}
              value={comment}
              onChange={handleCommentChange}
            />
          </Paper>
        </div>
        <div className={styles.footer}>
          <button className={styles.faded_button} onClick={handlePay}>
            Pay
          </button>
        </div>
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <Receipt receipt={receipt} setDialogEnabled={setDialogEnabled} setIsMakePayment={props.setIsMakePayment} />
      </Dialog>
      <Dialog open={dialogDonorEnabled} maxWidth="xl">
        <AddDonor onFormSubmit={handleAddDonor} setDialogEnabled={setDialogDonorEnabled} />
      </Dialog>
      <Dialog open={dialogPaymentEnabled} maxWidth="xl">
        <ConfirmPayment
          mode={paymentMode}
          modeDetail={modeDetail}
          data={data}
          inputValues={inputValues}
          setDialogPaymentEnabled={setDialogPaymentEnabled}
          setDialogEnabled={setDialogEnabled}
          setReceipt={setReceipt}
        />
      </Dialog>
    </div>
  );
};

export default MakePayment;
