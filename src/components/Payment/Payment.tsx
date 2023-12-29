import React, { useEffect, useState } from "react";
import styles from "./Payment.module.css";
import DatePicker from "@/Elements/DatePicker/DatePicker";
import { FormControl, RadioGroup, FormControlLabel, Radio, IconButton, InputBase, Paper, Dialog } from "@mui/material";
import dayjs from "dayjs";
import Input from "@/Elements/Input/Input";
import { Close } from "@mui/icons-material";
import { formatter } from "@/helpers/formatter";
import PaymentApprovalModal from "../PaymentApprovalModal/PaymentApprovalModal";

interface SchoolDetails {
  permissions: {
    ackReceipt: String;
    prevDateReceipt: Boolean;
    prevDateVoucher: Boolean;
  };
}

interface Props {
  schoolDetails?: SchoolDetails;
  setDialogEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setPayment: React.Dispatch<React.SetStateAction<any>>;
  handlePay: (paymentData: PaymentData, status: string) => void;
  amount: number;
  setEditableAmount?: React.Dispatch<React.SetStateAction<number>>;
  editableAmount?: number;
}

interface DetailProps {
  mode: string;
  setInputValues: React.Dispatch<React.SetStateAction<{ idField: string; bankNameField: string; dateField: any }>>;
  setModeDetail: React.Dispatch<React.SetStateAction<{ idField: string; bankNameField: string; dateField: any }>>;
  paymentMode: string;
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
    dateField: dayjs(new Date()),
  });

  useEffect(() => {
    setInputValues({
      idField: "",
      bankNameField: "",
      dateField: dayjs(new Date()),
    });
  }, [props.paymentMode]);

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
    props.setModeDetail(modeDetail);
  }, [modeDetail]);

  // useEffect(() => {
  //   props.setInputValues({
  //     idField: "",
  //     bankNameField: "",
  //     dateField: dayjs(new Date()),
  //   });
  // }, [props.mode]);

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
        onChange={(event) =>
          setInputValues({
            ...inputValues,
            idField: event.target.value,
          })
        }
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
              onChange={(date) =>
                setInputValues({
                  ...inputValues,
                  dateField: date.format("YYYY-MM-DD"),
                })
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

interface ModeDetail {
  idField: string;
  bankNameField: string;
  dateField: string;
}

interface PaymentData {
  paymentMethod: string;
  bankName?: string;
  chequeDate?: string;
  chequeNumber?: string;
  transactionDate?: string;
  transactionId?: string;
  upiId?: string;
  payerName?: string;
  ddNumber?: string;
  ddDate?: string;
  issueDate?: string;
  createdBy: string;
}

const Payment = (props: Props) => {
  const [inputValues, setInputValues] = useState<ModeDetail>({
    idField: "",
    bankNameField: "",
    dateField: "",
  });
  const [paymentMode, setPaymentMode] = useState<string>("Online Transfer");
  const [paymentApprovalModal, setPaymentApproval] = useState<boolean>(false);
  const modes = ["Cash", "Cheque", "Online Transfer", "UPI", "DD", "Debit Card", "Credit Card"];

  const [modeDetail, setModeDetail] = useState({
    idField: "",
    bankNameField: "",
    dateField: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMode((event.target as HTMLInputElement).value);
  };

  const handleDialogOpen = () => {
    
    if (paymentMode !== "Cash") {
      if (!inputValues?.dateField) {
        return;
      }
      if (!inputValues?.idField) {
        return;
      }
      if (paymentMode !== "Debit Card" && paymentMode !== "Credit Card") {
        if (!inputValues?.bankNameField) {
          return;
        }
      }
    }

    setLoading(true);


    if (paymentMode !== "Cash" && props.schoolDetails?.permissions?.ackReceipt === "BOTH") {
      setPaymentApproval(true);
    } else if (paymentMode === "Cash" || props.schoolDetails?.permissions?.ackReceipt === "NONE") {
      handlePayment("APPROVED");
    } else if (paymentMode !== "Cash" && props.schoolDetails?.permissions?.ackReceipt === "MANAGEMENT") {
      handlePayment("PENDING");
    } else {
      handlePayment("APPROVED");
    }
    setTimeout(()=>{
      setLoading(false);
    },3000)
  };

  const handlePayment = (status: string) => {
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

    let data: PaymentData = {
      paymentMethod: paymentMode.toUpperCase().split(" ").join("_"),
      createdBy: localStorage.getItem("user_id") as string,
    };

    if (paymentDetails[modeDetail.bankNameField]) {
      if (!(paymentMode === "Cash")) {
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
    if (paymentDetails["Debit Card"]) {
      data.transactionId = paymentDetails["Debit Card"];
    }
    if (paymentDetails["Credit Card"]) {
      data.transactionId = paymentDetails["Credit Card"];
    }
    props.setPayment(data);
    props.handlePay(data, status);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Payment of {formatter(props.amount)}</h1>
        <IconButton
          onClick={() => {
            props.setDialogEnabled(false);
          }}
        >
          <Close />
        </IconButton>
      </div>
      {props.setEditableAmount && (
        <div>
          <Paper className={styles.input}>
            <InputBase
              placeholder="Enter Amount"
              size="small"
              className={styles.input_input}
              value={props.editableAmount}
              onChange={(event) => {
                let editableamount = event.target.value;
                if (Number(editableamount) <= props.amount) {
                  props.setEditableAmount && props.setEditableAmount(Number(editableamount));
                } else {
                  props.setEditableAmount && props.setEditableAmount(Number(props.amount));
                }
              }}
            />
          </Paper>
        </div>
      )}
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
          <div className={styles.details}>
            <Details
              paymentMode={paymentMode}
              setModeDetail={setModeDetail}
              mode={paymentMode}
              setInputValues={setInputValues}
            />
          </div>
        )}
      </div>
      <button disabled={loading} onClick={handleDialogOpen}>
        Pay
      </button>
      <Dialog open={paymentApprovalModal} onClose={() => setPaymentApproval(false)}>
        <PaymentApprovalModal
          handlePayment={handlePayment}
          data={{ ...inputValues, paymentMode }}
          modeDetail={modeDetail}
          setPaymentApproval={setPaymentApproval}
        />
      </Dialog>
    </div>
  );
};

export default Payment;
