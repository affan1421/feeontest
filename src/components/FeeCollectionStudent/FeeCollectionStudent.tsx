import React, { useEffect, useState } from "react";
import { FeeCollection, FeeDetail, FeeType } from "@/models/FeeCollection";
import styles from "./FeeCollectionStudent.module.css";
import {
  Checkbox,
  Dialog,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "@/store/api";
import { useNavigate, useParams } from "react-router-dom";
import { FeeCategory } from "@/models/FeeCategory";
import MakePayment from "../MakePayment/MakePayment";
import TransactionListStudent from "../TransactionListStudent/TransactionListStudent";
import Payment from "../Payment/Payment";
import { Close } from "@mui/icons-material";
import { formatter } from "@/helpers/formatter";
import Lottie from "lottie-react";
import nodata from "../../assests/nodata.json";
import PaymentConfirmationManagement from "../PaymentConfirmationManagement/PaymentConfirmationManagement";

type PaymentMethod =
  | "default"
  | "CASH"
  | "CHEQUE"
  | "ONLINE_TRANSFER"
  | "UPI"
  | "DD"
  | "DEBIT_CARD"
  | "CREDIT_CARD";

interface FormValues {
  feeCategory: string;
  sibling: string;
  amountReceived: number;
}

export interface PreviousBalance {
  _id: string;
  isEnrolled: boolean;
  studentId: string;
  status: string;
  sectionId: string;
  academicYearId: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
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
}

const FeeCollectionStudent = () => {
  const { id, hasfeeStructure } = useParams();
  const schoolId = localStorage.getItem("school_id");
  const navigate = useNavigate();
  // API's
  const getFeeCategoriesbyStudentAPI = api((state) => state.getFeeCategoriesbyStudent);
  const getFeeCollectionDetailsAPI = api((state) => state.getFeeCollectionDetails);
  const previousBalanceMakePaymentAPI = api((state) => state.previousBalanceMakePayment);
  const transportMakePaymentApi = api((state) => state.transportMakePayment);

  //transportMakePayment

  const [feeCollection, setFeeCollection] = useState<FeeCollection>({
    studentName: "",
    studentId: id as string,
    class: "",
    parentName: "",
    feeDetails: [],
    transportFeedetials: [],
    // Local
    amountReceived: 0,
    penalty: 0,
    collectedFee: 0,
    dueAmount: 0,
    remainingAmount: 0,
    totalFeeAmount: 0,
  });

  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);

  const [formValue, setFormValues] = useState<FormValues>({
    feeCategory: "default",
    sibling: "default",
    amountReceived: 0,
  });
  const [isMakePayment, setIsMakePayment] = useState(false);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [payDialogEnabled, setPayDialogEnabled] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [previousBalance, setPreviousBalance] = useState<PreviousBalance>({} as PreviousBalance);
  const [editableAmount, setEditableAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [payment, setPayment] = useState<PaymentData>();
  const [prevBalanceId, setPrevBalanceId] = useState("");
  const [transportId, setTransportId] = useState("");
  const [noData, setNoData] = useState<boolean>(false);
  const [feeType, setFeeType] = useState("");

  useEffect(() => {
    setFeeCollection((prevFeeCollection) => ({
      ...prevFeeCollection,
      collectedFee: formValue.amountReceived + feeCollection.penalty,
    }));
  }, [formValue.amountReceived]);

  // const handlepaidAmountChange = (value: string, index: number) => {
  //   const newFeeDetails = [...feeCollection.feeDetails];
  //   if (newFeeDetails[index].needtoPay > 0 && Number(value) < newFeeDetails[index].needtoPay) {
  //     newFeeDetails[index].paidAmount = value ? Number(value) : null;
  //   } else {
  //     newFeeDetails[index].paidAmount = newFeeDetails[index].needtoPay;
  //   }
  //   if (feeCollection.amountReceived > 0) {
  //     let allPaidAmounts = 0;
  //     newFeeDetails.forEach((feeDetail) => {
  //       if (feeDetail.checked) {
  //         if (!(feeDetail.status == "Paid" || feeDetail.status == "Late")) {
  //           return (allPaidAmounts += feeDetail.paidAmount ? feeDetail.paidAmount : 0);
  //         }
  //       }
  //     });
  //     let remainingAmount = feeCollection.amountReceived - allPaidAmounts;
  //     let collectedFee = feeCollection.amountReceived - remainingAmount;
  //     setFeeCollection((prevFeeCollection) => ({
  //       ...prevFeeCollection,
  //       feeDetails: newFeeDetails,
  //       remainingAmount: remainingAmount - feeCollection.penalty,
  //       collectedFee: collectedFee + feeCollection.penalty,
  //     }));
  //   } else {
  //     let allPaidAmounts = 0;
  //     newFeeDetails.forEach((feeDetail) => {
  //       if (feeDetail.checked) {
  //         if (!(feeDetail.status == "Paid" || feeDetail.status == "Late")) {
  //           return (allPaidAmounts += feeDetail.paidAmount ? feeDetail.paidAmount : 0);
  //         }
  //       }
  //     });
  //     setFormValues({
  //       ...formValue,
  //       amountReceived: allPaidAmounts,
  //     });
  //   }
  // };

  //-------------second try
  // const handlepaidAmountChange = (value: string, index: number) => {
  //   const newFeeDetails = [...feeCollection.feeDetails];

  //   // Update the paidAmount directly with the entered value
  //   newFeeDetails[index].paidAmount = value ? Number(value) : null;

  //   // Update the feeCollection based on the new paidAmount
  //   updateFeeCollection(newFeeDetails);
  // };

  // const updateFeeCollection = (newFeeDetails: any) => {
  //   let allPaidAmounts = 0;

  //   newFeeDetails.forEach((feeDetail: any) => {
  //     if (feeDetail.checked && !(feeDetail.status === "Paid" || feeDetail.status === "Late")) {
  //       allPaidAmounts += feeDetail.paidAmount ? feeDetail.paidAmount : 0;
  //     }
  //   });

  //   if (feeCollection.amountReceived > 0) {
  //     let remainingAmount = feeCollection.amountReceived - allPaidAmounts;
  //     let collectedFee = feeCollection.amountReceived - remainingAmount;

  //     setFeeCollection((prevFeeCollection) => ({
  //       ...prevFeeCollection,
  //       feeDetails: newFeeDetails,
  //       remainingAmount: remainingAmount - feeCollection.penalty,
  //       collectedFee: collectedFee + feeCollection.penalty,
  //     }));
  //   } else {
  //     setFormValues({
  //       ...formValue,
  //       amountReceived: allPaidAmounts,
  //     });
  //   }
  // };

  //---third
  const handlepaidAmountChange = (value: string, index: number) => {
    const newFeeDetails = [...feeCollection.feeDetails];

    // Update the paidAmount directly with the entered value
    newFeeDetails[index].paidAmount = value ? Number(value) : null;

    // Update the feeCollection based on the new paidAmount
    updateFeeCollection(newFeeDetails);
  };

  const updateFeeCollection = (newFeeDetails: any) => {
    let allPaidAmounts = 0;

    newFeeDetails.forEach((feeDetail: any) => {
      if (feeDetail.checked && !(feeDetail.status === "Paid" || feeDetail.status === "Late")) {
        allPaidAmounts += feeDetail.paidAmount ? feeDetail.paidAmount : 0;
      }
    });

    if (feeCollection.amountReceived > 0) {
      let remainingAmount = feeCollection.amountReceived - allPaidAmounts;
      let collectedFee = feeCollection.amountReceived - remainingAmount;

      setFeeCollection((prevFeeCollection) => ({
        ...prevFeeCollection,
        feeDetails: newFeeDetails,
        remainingAmount: remainingAmount - feeCollection.penalty,
        collectedFee: collectedFee + feeCollection.penalty,
      }));
    } else {
      setFormValues({
        ...formValue,
        amountReceived: allPaidAmounts,
      });
    }
  };

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newFeeDetails = [...feeCollection.feeDetails];
    newFeeDetails[index].checked = event.target.checked;
    let remainingAmount = 0;
    if (event.target.checked) {
      remainingAmount =
        Number(feeCollection.amountReceived) > 0
          ? Number(feeCollection.amountReceived) - Number(newFeeDetails[index].paidAmount)
          : 0;
    } else {
      remainingAmount = 0;
    }

    let allPaidAmounts = 0;
    newFeeDetails.forEach((feeDetail) => {
      if (feeDetail.checked) {
        if (!(feeDetail.status == "Paid" || feeDetail.status == "Late")) {
          return (allPaidAmounts += feeDetail.paidAmount ? feeDetail.paidAmount : 0);
        }
      }
    });

    setFormValues({
      ...formValue,
      amountReceived: allPaidAmounts,
    });

    setFeeCollection((prevFeeCollection) => ({
      ...prevFeeCollection,
      feeDetails: newFeeDetails,
      remainingAmount: remainingAmount - feeCollection.penalty,
    }));
  };

  const handlePenaltyChange = (amount: number) => {
    let allPaidAmounts = 0;
    feeCollection.feeDetails.forEach((feeDetail) => {
      if (feeDetail.checked) {
        if (!(feeDetail.status == "Paid" || feeDetail.status == "Late")) {
          return (allPaidAmounts += feeDetail.paidAmount ? feeDetail.paidAmount : 0);
        }
      }
    });
    let collectedFee = Number(allPaidAmounts) + Number(amount);
    if (feeCollection.amountReceived > 0) {
      let remainingAmount = Number(feeCollection.amountReceived) - Number(collectedFee);
      setFeeCollection((prevFeeCollection) => ({
        ...prevFeeCollection,
        collectedFee: collectedFee,
        remainingAmount: remainingAmount,
        penalty: amount,
      }));
    } else {
      setFeeCollection((prevFeeCollection) => ({
        ...prevFeeCollection,
        collectedFee: collectedFee,
        penalty: amount,
      }));
    }
  };

  const getFeeCollectionDetails = (categoryId?: string) => {
    if (formValue.feeCategory !== "default") {
      getFeeCollectionDetailsAPI(
        id as string,
        categoryId ? categoryId : formValue.feeCategory
      ).then(async (response) => {
        if (response.status === 200) {
          let data = await response.data.data;
          const { dueAmount, totalFeeAmount } = DueandTotalAmount(data.feeDetails);
          let feedetails = [...data.feeDetails];
          const transportFeedetials = data?.studentTransport?.feeDetails;
          feedetails = await data.feeDetails.map((feeDetail: FeeDetail) => {
            return {
              ...feeDetail,
              needtoPay: Number(feeDetail.netAmount) - Number(feeDetail.paidAmount),
              paidAmount: Number(feeDetail.netAmount) - Number(feeDetail.paidAmount),
              alreadyPaidAmount: feeDetail.paidAmount,
            };
          });
          setFeeCollection({
            ...feeCollection,
            studentName: data.studentName,
            parentName: data.parentName,
            class: data.class,
            feeDetails: feedetails,
            transportFeedetials,
            amountReceived: 0,
            penalty: 0,
            collectedFee: 0,
            remainingAmount: 0,
            dueAmount: dueAmount,
            totalFeeAmount: totalFeeAmount,
          });
          if (data.previousBalance) {
            setPreviousBalance(data.previousBalance);
          }
        }
      });
    }
  };

  const getFeeCategoriesbyStudent = async () => {
    getFeeCategoriesbyStudentAPI(id as string).then((response: any) => {
      if (response.status === 200) {
        let data = response.data.data;
        setFormValues({
          ...formValue,
          feeCategory: data[0]._id,
        });
        getFeeCollectionDetails(data[0]._id as string);
        setFeeCategories(data);
      }
    });
  };

  // Calculate Due fee amount and Total Fee Amount
  const DueandTotalAmount = (feeDetails: FeeDetail[]) => {
    let dueAmount = 0;
    let totalFeeAmount = 0;
    let allPaidAmounts = 0;
    feeDetails.forEach((feeDetail: FeeDetail) => {
      allPaidAmounts += feeDetail.paidAmount ? feeDetail.paidAmount : 0;
      totalFeeAmount += feeDetail.netAmount ? feeDetail.netAmount : 0;
      dueAmount = totalFeeAmount - allPaidAmounts;
    });
    return { dueAmount, totalFeeAmount };
  };

  const handleMakePayment = (isVisible: boolean) => {
    setIsMakePayment(isVisible);
  };

  const handlePay = (paymentData: PaymentData, status: string) => {
    setPayment(paymentData);

    if (feeType == "transport") {
      let data = {
        studentId: feeCollection.studentId,
        paidAmount: editableAmount,
        paymentMode: paymentData.paymentMethod as PaymentMethod,
        transportId: transportId,
        status: status,
        ...paymentData,
      };

      console.log(transportMakePaymentApi);
      transportMakePaymentApi(data as any).then((response: any) => {
        if (response && response.status === 200) {
          setPaymentDialog(false);
          getFeeCollectionDetails();
        }
      });
    } else {
      let data = {
        paidAmount: editableAmount,
        paymentMode: paymentData.paymentMethod as PaymentMethod,
        prevBalId: prevBalanceId,
        status: status,
        ...paymentData,
      };

      previousBalanceMakePaymentAPI(data as any).then((response: any) => {
        if (response && response.status === 200) {
          setPaymentDialog(false);
          getFeeCollectionDetails();
        }
      });
    }
  };

  useEffect(() => {
    if (formValue.feeCategory !== "default") {
      getFeeCollectionDetails();
    }
  }, [formValue.feeCategory]);

  useEffect(() => {
    getFeeCategoriesbyStudent();
  }, []);

  useEffect(() => {
    if (!isMakePayment) {
      if (formValue.feeCategory !== "default") {
        getFeeCollectionDetails();
      }
    }
  }, [isMakePayment]);

  useEffect(() => {
    const isNoData =
      feeCollection.studentName === "" &&
      feeCollection.studentId === id &&
      feeCollection.class === "" &&
      feeCollection.parentName === "" &&
      feeCollection.amountReceived === 0 &&
      feeCollection.penalty === 0 &&
      feeCollection.collectedFee === 0 &&
      feeCollection.dueAmount === 0 &&
      feeCollection.remainingAmount === 0 &&
      feeCollection.totalFeeAmount === 0;

    setNoData(isNoData);
  }, [feeCollection, id, hasfeeStructure]);

  return (
    <>
      {!isMakePayment ? (
        <div>
          <div>
            <div className={styles.main_header}>
              <div>
                <IconButton
                  onClick={() => {
                    navigate("/collection");
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                &nbsp;&nbsp; Back
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.left}>
                <h1>Fee Structure</h1>
              </div>
              <div className={styles.right}>
                <button
                  onClick={() => {
                    setPayDialogEnabled(true);
                  }}
                  style={{
                    marginRight: "15px",
                  }}
                  className={styles.outlined_button}
                >
                  Payment Confirmation
                </button>
                <button
                  className={styles.outlined_button}
                  onClick={() => {
                    setDialogEnabled(true);
                  }}
                >
                  All Transactions
                </button>
                <Select
                  className={styles.selector}
                  value={formValue.feeCategory}
                  onChange={(event) => {
                    setFormValues({
                      ...formValue,
                      feeCategory: event.target.value,
                    });
                  }}
                >
                  <MenuItem value="default" disabled>
                    Fee Category
                  </MenuItem>
                  {feeCategories.map((feeCategory) => {
                    return (
                      <MenuItem value={feeCategory._id} key={feeCategory._id}>
                        {feeCategory.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                {/* <Select className={styles.selector} value={formValue.sibling} disabled>
                                        <MenuItem value='default' di    sabled>Siblings (Coming Soon)</MenuItem>
                                    </Select> */}
                <button
                  className={styles.outlined_button}
                  onClick={() => {
                    navigate("/collection");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
            {hasfeeStructure == "true" ? (
              <div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <span>Name</span>
                    <div className={styles.field_value}>{feeCollection.studentName}</div>
                  </div>
                  <div className={styles.field}>
                    <span>Class</span>
                    <div className={styles.field_value}>{feeCollection.class}</div>
                  </div>
                  <div className={styles.field}>
                    <span>Parent Name</span>
                    <div className={styles.field_value}>{feeCollection.parentName}</div>
                  </div>
                </div>
                {previousBalance && previousBalance._id && (
                  <div className={styles.previous_balance}>
                    <div className={styles.table}>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={styles.t_head} style={{ width: "12%" }}>
                                Fee Type
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "12%" }}>
                                Total Amount
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "12%" }}>
                                Due Amount
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "12%" }}>
                                Paid Amount
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "12%" }}>
                                Status
                              </TableCell>
                              <TableCell
                                className={styles.t_head}
                                style={{ width: "12%" }}
                              ></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell className={styles.t_body}>Previous Balance</TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(previousBalance.totalAmount)}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(previousBalance.dueAmount)}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(previousBalance.paidAmount)}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                <span
                                  className={`${styles.status} ${
                                    previousBalance.status == "Due"
                                      ? `${styles.due}`
                                      : `${styles.paid}`
                                  }`}
                                >
                                  {previousBalance.status}
                                </span>
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                <button
                                  disabled={previousBalance.dueAmount == 0}
                                  className={`${previousBalance.dueAmount == 0 && styles.disabled}`}
                                  onClick={() => {
                                    setPaymentDialog(true);
                                    setEditableAmount(previousBalance.dueAmount);
                                    setAmount(previousBalance.dueAmount);
                                    setPrevBalanceId(previousBalance._id);
                                  }}
                                >
                                  Pay
                                </button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                )}
                <br />
                <div>
                  <TableContainer className={styles.table}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" style={{ width: "3%" }}>
                            {/* <Checkbox /> */}
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "12%" }}>
                            Fee Type
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "12%" }}>
                            Fee Schedule
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "10%" }}>
                            Amount
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "10%" }}>
                            Disc
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "10%" }}>
                            Concession
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "10%" }}>
                            Total
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "10%" }}>
                            Paid
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "10%" }}>
                            Status
                          </TableCell>
                          <TableCell className={styles.t_head} style={{ width: "15%" }}>
                            Amount
                          </TableCell>
                          <TableCell style={{ width: "3%" }} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {feeCollection?.feeDetails?.map((row, index) => {
                          return (
                            <TableRow key={index} hover role="checkbox">
                              <TableCell padding="checkbox">
                                {row.status !== "Paid" && row.status !== "Late" && (
                                  <Checkbox
                                    onChange={(e) => {
                                      handleChecked(e, index);
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {row.feeTypeId.feeType}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                Due on {new Date(row.date).getDate()}-
                                {new Date(row.date).getMonth() + 1}-
                                {new Date(row.date).getFullYear()}{" "}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(row.totalAmount)}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(row.totalDiscountAmount ? row.totalDiscountAmount : 0)}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(row.concessionAmount ? row.concessionAmount : 0)}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(row.netAmount - Number(row.concessionAmount || 0))}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                {formatter(row.alreadyPaidAmount ? row.alreadyPaidAmount : 0)}
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                <span
                                  className={`${styles.status} ${
                                    row.status == "Paid"
                                      ? `${styles.paid}`
                                      : row.status == "Due"
                                      ? `${styles.due}`
                                      : row.alreadyPaidAmount == 0
                                      ? `${styles.upcoming}`
                                      : `${styles.partial}`
                                  }`}
                                >
                                  {row.status.toUpperCase()}
                                </span>
                              </TableCell>
                              <TableCell className={styles.t_body}>
                                <Paper className={styles.input}>
                                  <InputBase
                                    type="number"
                                    fullWidth
                                    disabled={!row.checked}
                                    placeholder="Amount"
                                    id="filled-hidden-label-small"
                                    size="small"
                                    className={styles.input_input}
                                    value={
                                      Number(
                                        (row.totalAmount ?? 0) - (row.alreadyPaidAmount ?? 0)
                                      ) -
                                      Number(
                                        (row.totalDiscountAmount ?? 0) + (row.concessionAmount ?? 0)
                                      )
                                    }
                                    onChange={(e) => handlepaidAmountChange(e.target.value, index)}
                                  />
                                </Paper>
                              </TableCell>
                              <TableCell>
                                {/* {(row.status == "Paid" || row.status == "Late") && (
                                  <IconButton aria-label="print">
                                    <Print />
                                  </IconButton>
                                )} */}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div className={styles.bottom}>
                    <div className={styles.bottom_left}>
                      <div className={styles.bottom_row}>
                        <div className={styles.input_fields}>
                          <span>Amount Received</span>
                          <Paper className={styles.input}>
                            <InputBase
                              type="number"
                              placeholder="Amount Received"
                              size="small"
                              value={feeCollection.amountReceived}
                              onChange={(e) => {
                                setFeeCollection({
                                  ...feeCollection,
                                  amountReceived: Number(e.target.value),
                                  remainingAmount:
                                    Number(e.target.value) - Number(feeCollection.collectedFee),
                                });
                              }}
                              className={styles.input_input}
                            />
                          </Paper>
                        </div>
                        <div className={styles.input_fields}>
                          <span>Penalty (Optional)</span>
                          <Paper className={styles.input}>
                            <InputBase
                              type="number"
                              placeholder="Penalty (Optional)"
                              id="filled-hidden-label-small"
                              size="small"
                              className={styles.input_input}
                              onChange={(e) => {
                                handlePenaltyChange(Number(e.target.value));
                              }}
                            />
                          </Paper>
                        </div>
                        <div className={styles.field}>
                          <span>Collected Fee</span>
                          <div className={styles.field_value}>{feeCollection.collectedFee}</div>
                        </div>
                        <div className={styles.field}>
                          <span>Remaining Amount</span>
                          <div className={styles.field_value}>{feeCollection.remainingAmount}</div>
                        </div>
                      </div>
                      <div className={styles.bottom_row}>
                        <div className={styles.field}>
                          <span>Total Fee Amount</span>
                          <div className={styles.field_value}>{feeCollection.totalFeeAmount}</div>
                        </div>
                        <div className={styles.field}>
                          <span>Due Amount</span>
                          <div className={styles.field_value}>{feeCollection.dueAmount}</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.bottom_right}>
                      <button
                        disabled={
                          feeCollection.feeDetails.filter((row) => row.checked == true).length == 0
                        }
                        style={{
                          backgroundColor:
                            feeCollection.feeDetails.filter((row) => row.checked == true).length ==
                            0
                              ? "#bbb"
                              : "#3400e9",
                        }}
                        onClick={() => {
                          handleMakePayment(true);
                        }}
                      >
                        Make Payment
                      </button>
                    </div>
                  </div>

                  {/* Transport Fees Table */}
                  {feeCollection?.transportFeedetials?.length > 0 && (
                    <div>
                      <Typography my={6} fontSize={18} fontWeight={500}>
                        Transport Fees
                      </Typography>

                      <TableContainer className={styles.table}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={styles.t_head} style={{ width: "12%" }}>
                                Fee Schedule
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "10%" }}>
                                Amount
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "10%" }}>
                                Disc
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "10%" }}>
                                Concession
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "10%" }}>
                                Total
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "10%" }}>
                                Paid
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "10%" }}>
                                Due
                              </TableCell>
                              <TableCell className={styles.t_head} style={{ width: "10%" }}>
                                Status
                              </TableCell>
                              <TableCell
                                className={styles.t_head}
                                style={{ width: "12%" }}
                              ></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {feeCollection?.transportFeedetials?.length > 0 &&
                              feeCollection.transportFeedetials.map((row: any, index: number) => {
                                return (
                                  <TableRow key={index} hover role="checkbox">
                                    <TableCell className={styles.t_body}>
                                      {row?.monthName}
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      {formatter(row?.totalAmount)}
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      {formatter(row?.DiscAmount || 0)}
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      {formatter(row?.concAmount || 0)}
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      {formatter(
                                        row?.totalAmount -
                                          (Number(row?.concAmount || 0) +
                                            Number(row?.DiscAmount || 0))
                                      )}
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      {formatter(row?.paidAmount || 0)}
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      {formatter(row?.dueAmount || 0)}
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      <span
                                        className={`${styles.status} ${
                                          row.status == "Paid"
                                            ? `${styles.paid}`
                                            : row.status == "Due"
                                            ? `${styles.due}`
                                            : row.status == "Upcoming"
                                            ? `${styles.upcoming}`
                                            : `${styles.partial}`
                                        }`}
                                      >
                                        {row.status.toUpperCase()}
                                      </span>
                                    </TableCell>
                                    <TableCell className={styles.t_body}>
                                      <button
                                        disabled={row.dueAmount == 0}
                                        className={`${row.dueAmount == 0 && styles.disabled}`}
                                        onClick={() => {
                                          setPaymentDialog(true);
                                          setEditableAmount(row.dueAmount);
                                          setAmount(row.dueAmount);
                                          setTransportId(row._id);
                                          setFeeType("transport");
                                        }}
                                      >
                                        Pay
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ width: "35%", marginLeft: "auto", marginRight: "auto" }}>
                  <Lottie animationData={nodata}></Lottie>
                </div>
                <span style={{ fontSize: "20px", marginLeft: "40%" }}>No Fee Structure found.</span>
              </div>
            )}
          </div>
          <Dialog open={dialogEnabled} maxWidth="xl">
            <TransactionListStudent onClose={setDialogEnabled} studentId={id as string} />
          </Dialog>
          <Dialog open={payDialogEnabled} maxWidth="lg">
            <div>
              <div className={styles.dialog_header}>
                <h1>Payment Confirmation</h1>
                <IconButton
                  onClick={() => {
                    setPayDialogEnabled(false);
                  }}
                >
                  <Close />
                </IconButton>
              </div>
              <PaymentConfirmationManagement studentId={id} />
            </div>
          </Dialog>

          <Dialog open={paymentDialog} maxWidth="xl">
            <Payment
              setDialogEnabled={setPaymentDialog}
              amount={amount}
              handlePay={handlePay}
              editableAmount={editableAmount}
              setEditableAmount={setEditableAmount}
              setPayment={setPayment}
            />
          </Dialog>
        </div>
      ) : (
        <div>
          <MakePayment
            feeCategory={{
              feeCategoryName: feeCategories.filter((e) => e._id === formValue.feeCategory)[0]
                .name as string,
              feeCategoryId: formValue.feeCategory,
            }}
            setIsMakePayment={setIsMakePayment}
            collectedFee={feeCollection.collectedFee}
            studentId={feeCollection.studentId}
            feeDetails={feeCollection.feeDetails.filter((row) => row.checked == true)}
            dueAmount={feeCollection.dueAmount}
            totalFeeAmount={feeCollection.totalFeeAmount}
            schoolId={schoolId as string}
          />
        </div>
      )}
    </>
  );
};

export default FeeCollectionStudent;
