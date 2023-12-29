import styles from "./GiveDiscount.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FeeStructure from "../Fee Structure/FeeStructure";
import api from "@/store/api";
import { useState, useEffect, useCallback } from "react";
import { FormValues } from "@/models/Discount";
import { ArrowDownward, CloseRounded, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import StudentSelector, { Student } from "./StudentSelector/StudentSelector";
import debounce from "lodash.debounce";
import Alert_Message from "@/ErrorHandling/Alert_Message";

export interface Class {
  sectionId: string;
  name: string;
}

interface DiscountCategory {
  name: string;
  _id: string;
}

interface FeeCategory {
  _id: string;
  categoryName: string;
}

interface FeeStructure {
  _id: string;
  feeStructureName: string;
}

export interface FeeBreakdown {
  date: string;
  amount: number;
  _id: string;
  discountValue?: number;
  isUpdated?: boolean;
  installmentId: string;
}

interface FeeType {
  id: string;
  name: string;
}

export interface FeeData {
  _id: string;
  sl: number;
  feeType: FeeType;
  amountType: string;
  breakdown: FeeBreakdown[];
  feeSchedule: string;
  amount: number;
  discount: number;
  discountValue: number;
  dropdown: boolean;
}

interface Props {
  classId?: string;
  discountId?: string;
}

const GiveDiscount = (props: Props) => {
  const schoolId = localStorage.getItem("school_id") as string;

  // API's
  const getClassesAPI = api((state) => state.getClasses);
  const getDiscountCategoryAPI = api((state) => state.getDiscountCategory);
  const fetchFeeCategoriesbySectionAPI = api((state) => state.fetchFeeCategoriesbySection);
  const fetchFeeStructuresbySectionandCategoryAPI = api((state) => state.fetchFeeStructuresbySectionandCategory);
  const getFeeDetailsAPI = api((state) => state.getFeeDetails);
  const getStudentsGiveDiscountAPI = api((state) => state.getStudentsGiveDiscount);
  const updateStudentsinAssignDiscountAPI = api((state) => state.updateStudentsinAssignDiscount);
  const setDiscountTemplateAPI = api((state) => state.setDiscountTemplate);

  // Data
  const [classes, setClasses] = useState<Class[]>([]);
  const [discountCategories, setDiscountCategories] = useState<DiscountCategory[]>([]);
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [previousSubAmount, setPreviousSubAmount] = useState(0);
  const [currState, setCurrState] = useState(false);
  const [error, setError] = useState({
    message: "",
    snack_state: false,
  });

  const [isMapped, setIsMapped] = useState(false);

  // Table
  const [rows, setRows] = useState<FeeData[]>([]);

  const [formValues, setFormValues] = useState<FormValues>({
    selectedClass: props.classId ? props.classId : "default",
    categoryId: "default",
    discountCategoryId: "default",
    feeStructureId: "default",
  });

  const getClasses = () => {
    getClassesAPI(schoolId).then((response: any) => {
      setClasses(response.data.data);
    });
  };

  const getFeeDetails = (feeStructureId: string, discountId: string) => {
    getFeeDetailsAPI(feeStructureId, discountId).then((response: any) => {
      let data = response.data.data;
      if (!data.isMapped) {
        setIsMapped(false);
        data = data.feeDetails.map((item: FeeData) => {
          return {
            ...item,
            dropdown: false,
            amountType: "Amount",
            breakdown: item.breakdown.map((e) => {
              return { ...e, isUpdated: false };
            }),
          };
        });
        setRows(data);
      } else {
        setIsMapped(true);
        data = data.feeDetails.map((item: any) => {
          return {
            ...item,
            discountValue: item.isPercentage ? (item.value * item.amount) / 100 : item.value,
            dropdown: false,
            // amountType: item.isPercentage ? 'Percentage' : 'Amount',
            amountType: "Amount",
            breakdown: item.breakdown.map((e: any) => {
              return {
                ...e,
                discountValue: item.isPercentage ? (item.value * e.amount) / 100 : e.value,
                isUpdated: false,
              };
            }),
          };
        });
        console.log("rows", rows);
        setRows(data);
      }
    });
  };

  const getDiscountCategory = () => {
    getDiscountCategoryAPI(schoolId).then((response) => {
      if (response.status == 200) {
        setDiscountCategories(response.data.data);
      }
    });
  };

  const fetchFeeCategoriesbySection = (section_id: string) => {
    fetchFeeCategoriesbySectionAPI(section_id).then(async (response: any) => {
      if (response && response?.status == 200) {
        setFeeCategories(response.data.data);
      } else {
        setFeeCategories([]);
      }
    });
  };

  const fetchFeeStructuresbySectionandCategory = (section_id: string, category_id: string, discountId: string) => {
    fetchFeeStructuresbySectionandCategoryAPI(section_id, category_id, discountId).then((response: any) => {
      if (response.status == 200) {
        setFeeStructures(response.data.data);
      } else {
        setFeeStructures([]);
      }
    });
  };

  const getStudentsGiveDiscount = (discountId: string, feeStructureId: string, sectionId: string) => {
    setStudents([]);
    getStudentsGiveDiscountAPI(discountId, feeStructureId, sectionId).then((response: any) => {
      if (response.status == 200) {
        let data = response.data.data;
        data = data.map((student: Student) => {
          return {
            ...student,
            sectionName: classes.filter((item: Class) => {
              console.log(props.classId);
              if (props.classId) {
                return item.sectionId == props.classId;
              } else {
                return item.sectionId == formValues.selectedClass;
              }

              // return item.sectionId == props.classId ? props.classId : formValues.selectedClass
            })[0].name,
          };
        });
        setStudents(data);
      } else {
      }
    });
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    setFormValues({
      ...formValues,
      feeStructureId: "default",
      categoryId: "default",
      selectedClass: event.target.value as string,
    });
    fetchFeeCategoriesbySection(event.target.value as string);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFormValues({
      ...formValues,
      categoryId: event.target.value as string,
    });
    fetchFeeStructuresbySectionandCategory(
      props.classId ? props.classId : formValues.selectedClass,
      event.target.value as string,
      formValues.discountCategoryId
    );
  };

  const handleFeeStructureChange = (event: SelectChangeEvent) => {
    setFormValues({
      ...formValues,
      feeStructureId: event.target.value as string,
    });
    getFeeDetails(event.target.value as string, formValues.discountCategoryId);
    getStudentsGiveDiscount(
      formValues.discountCategoryId,
      event.target.value as string,
      props.classId ? props.classId : formValues.selectedClass
    );
  };

  const handleAmountTypeChange = (event: React.ChangeEvent<{ value: unknown }>, rowIndex: number) => {
    const { value } = event.target;
    const updatedRows = [...rows];
    updatedRows[rowIndex].amountType = value as string;
    updatedRows[rowIndex].discountValue = 0;
    updatedRows[rowIndex].breakdown.forEach((breakdown) => {
      breakdown.discountValue = 0;
    });
    setRows(updatedRows);
  };

  function extractMonthShortNames(data: FeeBreakdown[]) {
    const shortMonthNames = [];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (const entry of data) {
      const date = new Date(entry.date);
      const monthIndex = date.getMonth();
      const shortMonthName = months[monthIndex];
      shortMonthNames.push(shortMonthName);
    }

    const concatenatedString = shortMonthNames.join(", ");
    return concatenatedString.length > 20 ? concatenatedString.slice(0, 20) + "..." : concatenatedString;
  }

  function getMonthNameFromDate(date: Date): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = date.getMonth();
    return months[monthIndex];
  }

  const handleDropDownChange = (index: number) => {
    let updatedRows = [...rows];
    updatedRows[index].dropdown = !updatedRows[index].dropdown;
    setRows(updatedRows);
  };

  const handleParentAmountChange = (index: number, value: number) => {
    let updatedrows: any = [...rows];
    setPreviousSubAmount(0);
    if (updatedrows[index].amountType == "Percentage") {
      if (value >= 0 && value <= 100) {
        updatedrows[index].discountValue = value;
        updatedrows[index].value = value;
        updatedrows[index].discountAmount = (updatedrows[index].discountValue * updatedrows[index].amount) / 100;
        updatedrows[index].isPercentage = true;
        updatedrows[index].breakdown.forEach((breakdown: any) => {
          breakdown.discountValue = breakdown.amount;
          breakdown.value = value;
          breakdown.isUpdated = false;
        });
      } else {
        // updatedrows[index].discountValue = 100
        // updatedrows[index].breakdown.forEach((breakdown) => {
        //   breakdown.discountValue = 25
        //   breakdown.isUpdated = false
        // })
      }
    } else {
      if (value <= updatedrows[index].amount) {
        updatedrows[index].discountValue = value;
        updatedrows[index].discountAmount = value;
        updatedrows[index].value = value;
        updatedrows[index].isPercentage = false;
        updatedrows[index].breakdown.forEach((breakdown: any) => {
          breakdown.discountValue = value / updatedrows[index].breakdown.length;
          breakdown.value = value / updatedrows[index].breakdown.length;
          breakdown.isUpdated = false;
        });
      }
    }
    setRows(updatedrows);
  };

  const handleSubRowChange = (
    row: FeeData,
    index: number,
    totalAmount: number,
    newSubAmount: number,
    monthName: string
  ) => {
    let divideCount = 0;
    let updatedTotalAmount = 0;

    if (newSubAmount <= totalAmount && newSubAmount >= 0) {
      let updatedMonths = row.breakdown.map((breakdown: FeeBreakdown) => {
        if (monthName === getMonthNameFromDate(new Date(breakdown.date))) {
          updatedTotalAmount += Number(newSubAmount);
          return {
            ...breakdown,
            discountValue: Number(newSubAmount),
            isUpdated: true,
          };
        } else if (breakdown.isUpdated) {
          updatedTotalAmount += Number(breakdown.discountValue);
        } else {
          divideCount++;
        }
        return breakdown;
      });
      let newNonUpdatedAmount = (Number(totalAmount) - Number(updatedTotalAmount)) / divideCount;
      setPreviousSubAmount(newSubAmount);
      let newMonthsData = updatedMonths.map((month: any) => {
        if (!month.isUpdated && newNonUpdatedAmount >= 0) {
          month.discountValue = newNonUpdatedAmount;
        }
        return month;
      });

      let newrows = [...rows];
      newrows[index].breakdown = newMonthsData;
      setRows(newrows);

      debouncedChangeHandler(newMonthsData, totalAmount);
    }
  };

  const checkTotalIfItsCorrect = (breakdowns: FeeBreakdown[], totalAmount: number) => {
    let currentTotal = 0;
    breakdowns.forEach((breakdown: FeeBreakdown) => {
      currentTotal += Number(breakdown.discountValue);
    });
    if (Number(currentTotal - totalAmount).toFixed(2) !== "0.00") {
      if (Number(currentTotal.toFixed(2)) + 0.01 > Number(totalAmount.toFixed(2))) {
        setError({
          snack_state: true,
          message: `Please Enter Correct Value -
                Newly Added value Exceeds Total Value By
                ${Number(currentTotal - totalAmount).toFixed(2)}`,
        });
        setCurrState(true);
      } else if (Number(currentTotal.toFixed(2)) + 0.01 < Number(totalAmount.toFixed(2))) {
        setError({
          snack_state: true,
          message: `Current Total is Less than Total Value
                ${Number(totalAmount - currentTotal).toFixed(2)}`,
        });
        setCurrState(true);
      } else {
        setError({
          snack_state: false,
          message: "",
        });
        setCurrState(false);
      }
    } else {
      setError({
        snack_state: false,
        message: "",
      });
      setCurrState(false);
    }
  };

  const debouncedChangeHandler = useCallback(debounce(checkTotalIfItsCorrect, 1000), []);

  const submit = () => {
    setLoading(true);
    let newstudents = [...students];
    let filteredStuds = newstudents.filter((student) => student.isSelected && !student.discountStatus);
    let installments: any = [];
    filteredStuds.forEach((item: any) => {
      if (!item.feeDetails) {
        item.feeStructure.forEach((feeItem: any) => {
          feeItem.breakdown.forEach((breakdown: any) => {
            installments.push({
              installmentId: breakdown._id,
              value: breakdown.discountValue,
              isPercentage: feeItem.amountType == "Amount" ? false : true,
              discountAmount:
                feeItem.amountType == "Amount"
                  ? breakdown.discountValue
                  : (breakdown.totalAmount * breakdown.discountValue) / 100,
              studentId: item._id,
            });
          });
        });
      } else {
        item.feeDetails.forEach((feeItem: any) => {
          feeItem.breakdown.forEach((breakdown: any) => {
            installments.push({
              installmentId: breakdown._id,
              value: breakdown.discountValue,
              isPercentage: feeItem.amountType == "Amount" ? false : true,
              discountAmount:
                feeItem.amountType == "Amount"
                  ? breakdown.discountValue
                  : (breakdown.totalAmount * breakdown.discountValue) / 100,
              studentId: item._id,
            });
          });
        });
      }
    });

    let refundList: any = [];

    filteredStuds.forEach((item: any) => {
      if (!item.feeDetails) {
        item.feeStrcuture.forEach((fee: any) => {
          if (fee.refund > 0) {
            refundList.push({
              studentId: item._id,
              amount: fee.refund,
            });
          }
        });
      } else {
        item.feeDetails.forEach((fee: any) => {
          if (fee.refund > 0) {
            refundList.push({
              studentId: item._id,
              amount: fee.refund,
            });
          }
        });
      }
    });

    let requestPayload = {
      sectionId: props.classId ? props.classId : formValues.selectedClass,
      sectionName: classes.filter((item: Class) => {
        if (props.classId) {
          return item.sectionId == props.classId;
        } else {
          return item.sectionId == formValues.selectedClass;
        }
      })[0].name,
      categoryId: formValues.categoryId,
      feeStructureId: formValues.feeStructureId,
      totalDiscountAmount: getTotalDiscountAmount(),
      discountName: discountCategories.find((e) => e._id == formValues.discountCategoryId)?.name,
      installmentList: installments,
      refundList: refundList,
    };

    let templatePayload = {
      schoolId: schoolId,
      categoryId: formValues.categoryId,
      feeStructureId: formValues.feeStructureId,
      discountId: formValues.discountCategoryId,
      totalFeesAmount: getTotalDiscountAmount(),
      feeDetails: rows,
    };

    if (isMapped) {
      if (installments.length > 0) {
        updateStudentsinAssignDiscountAPI(formValues.discountCategoryId, requestPayload).then((response) => {
          if (response.status == 200) {
            getStudentsGiveDiscount(
              formValues.discountCategoryId,
              formValues.feeStructureId,
              props.classId ? props.classId : formValues.selectedClass
            );
          }
        });
      }
    } else {
      setDiscountTemplateAPI(templatePayload).then((response) => {
        if (response.status == 200) {
          if (installments.length > 0) {
            updateStudentsinAssignDiscountAPI(formValues.discountCategoryId, requestPayload).then((response) => {
              if (response.status == 200) {
                getStudentsGiveDiscount(
                  formValues.discountCategoryId,
                  formValues.feeStructureId,
                  props.classId ? props.classId : formValues.selectedClass
                );
              }
            });
          }
        }
      });
    }
    setLoading(false);
  };

  const getTotalDiscountAmount = () => {
    let amount = rows.reduce((acc: number, item: any) => {
      if (item.amountType == "Amount") {
        console.log("item", item);
        if (item.discountValue) {
          acc = acc + item.discountValue;
        }
        return acc;
      } else {
        acc = acc + (item.discountValue * item.amount) / 100;
        return acc;
      }
    }, 0);
    return amount;
  };

  useEffect(() => {
    getClasses();
    getDiscountCategory();
    if (props.discountId) {
      setFormValues({
        ...formValues,
        discountCategoryId: props.discountId,
      });
      fetchFeeCategoriesbySection(props.classId as string);
    }
  }, []);

  const navigate = useNavigate();
  return (
    <div className={styles.main}>
      {!props.classId && (
        <div className={styles.navigation}>
          <IconButton
            onClick={() => {
              navigate("/discount");
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          &nbsp;&nbsp; Back
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Give Discount</span>
          <div className={styles.action}>
            <button
              onClick={() => {
                navigate("/discount");
              }}
            >
              Cancel
            </button>
            <button
              className={`${
                students.filter((student) => !student.discountStatus && student.isSelected).length == 0 &&
                `${styles.disabled}`
              }`}
              disabled={
                loading || students.filter((student) => !student.discountStatus && student.isSelected).length == 0
              }
              onClick={() => {
                submit();
              }}
            >
              Give Discount
            </button>
          </div>
        </div>
        <div className={styles.selectors}>
          <div style={{ flexBasis: "20%", marginRight: "0px", marginBottom: "10px" }}>
            <Select
              className={styles.selector}
              value={formValues.discountCategoryId}
              onChange={(e) => {
                const category = e.target.value as string;
                setFormValues({
                  ...formValues,
                  discountCategoryId: category,
                });
                if (props.classId) {
                  fetchFeeCategoriesbySection(props.classId);
                }
              }}
              endAdornment={
                formValues.discountCategoryId !== "default" && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFormValues({
                        ...formValues,
                        discountCategoryId: "default",
                        categoryId: "default",
                        feeStructureId: "default",
                        selectedClass: props.classId ? props.classId : "default",
                      });
                      setFeeCategories([]);
                      setRows([]);
                      setStudents([]);
                    }}
                  >
                    <CloseRounded />
                  </IconButton>
                )
              }
              IconComponent={formValues.discountCategoryId == "default" ? undefined : () => null}
            >
              <MenuItem value="default" disabled>
                Discount Category
              </MenuItem>
              {discountCategories.map((item: DiscountCategory) => {
                return (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          {!props.classId && (
            <div style={{ flexBasis: "20%", marginRight: "0px", marginBottom: "10px" }}>
              <Select
                disabled={formValues.discountCategoryId == "default"}
                value={formValues.selectedClass}
                onChange={handleClassChange}
                className={styles.selector}
                endAdornment={
                  formValues.selectedClass !== "default" && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFormValues({
                          ...formValues,
                          selectedClass: "default",
                          categoryId: "default",
                          feeStructureId: "default",
                        });
                        setRows([]);
                        setFeeCategories([]);
                        setStudents([]);
                      }}
                    >
                      <CloseRounded />
                    </IconButton>
                  )
                }
                IconComponent={formValues.selectedClass == "default" ? undefined : () => null}
              >
                <MenuItem value="default">Select Class</MenuItem>
                {classes.map((item: Class) => {
                  return (
                    <MenuItem value={item.sectionId} key={item.sectionId}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          )}
          <div style={{ flexBasis: "20%", marginRight: "0px", marginBottom: "10px" }}>
            <Select
              disabled={feeCategories.length == 0}
              value={formValues.categoryId}
              onChange={handleCategoryChange}
              className={styles.selector}
              endAdornment={
                formValues.categoryId !== "default" && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFormValues({
                        ...formValues,
                        categoryId: "default",
                        feeStructureId: "default",
                      });
                      setFeeStructures([]);
                      setRows([]);
                      setStudents([]);
                    }}
                  >
                    <CloseRounded />
                  </IconButton>
                )
              }
              IconComponent={formValues.categoryId == "default" ? undefined : () => null}
            >
              <MenuItem value="default">Select Fee Category</MenuItem>
              {feeCategories.map((feeCategory: FeeCategory) => {
                return (
                  <MenuItem value={feeCategory._id} key={feeCategory._id}>
                    {feeCategory.categoryName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div style={{ flexBasis: "20%", marginRight: "0px", marginBottom: "10px" }}>
            <Select
              disabled={feeCategories.length == 0}
              value={formValues.feeStructureId}
              onChange={handleFeeStructureChange}
              className={styles.selector}
              endAdornment={
                formValues.feeStructureId !== "default" && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFormValues({ ...formValues, feeStructureId: "default" });
                      setRows([]);
                      setStudents([]);
                    }}
                  >
                    <CloseRounded />
                  </IconButton>
                )
              }
              IconComponent={formValues.feeStructureId == "default" ? undefined : () => null}
            >
              <MenuItem value="default">Select Fee Structure</MenuItem>
              {feeStructures.map((feeStructure: FeeStructure) => {
                return (
                  <MenuItem value={feeStructure._id} key={feeStructure._id}>
                    {feeStructure.feeStructureName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </div>
        <div className={styles.feeDetails}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>SL</b>
                  </TableCell>
                  <TableCell>
                    <b>Fee type</b>
                  </TableCell>
                  {/* <TableCell><b>Amount Type</b></TableCell> */}
                  <TableCell>
                    <b>Fee Schedule</b>
                  </TableCell>
                  <TableCell>
                    <b>Amount</b>
                  </TableCell>
                  <TableCell>
                    <b>Enter Discount</b>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => {
                  return (
                    <>
                      <TableRow key={row._id}>
                        <TableCell>{rowIndex + 1}</TableCell>
                        <TableCell>{row.feeType.name}</TableCell>
                        {/* <TableCell sx={{ width: '150px' }}>
                        <Select
                          onChange={(e: any) => handleAmountTypeChange(e, rowIndex)}
                          defaultValue={row.amountType}
                          sx={{ width: '150px', height: '46px' }}
                          disabled={isMapped}
                        >
                          <MenuItem value="default" disabled>Select Amount Type</MenuItem>
                          <MenuItem value="Percentage">Percentage</MenuItem>
                          <MenuItem value="Amount">Amount</MenuItem>
                        </Select>
                      </TableCell> */}
                        <TableCell>{extractMonthShortNames(row.breakdown)}</TableCell>
                        <TableCell>₹{row.amount}</TableCell>
                        <TableCell sx={{ width: "150px" }}>
                          <TextField
                            disabled={isMapped || row.amountType == "default"}
                            placeholder={`Enter ${row.amountType == "Percentage" ? "Value" : "Amount"}`}
                            type="text"
                            sx={{ height: "46px" }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleParentAmountChange(rowIndex, Number(event.target.value));
                            }}
                            value={row.discountValue}
                          />
                        </TableCell>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            {row.breakdown.length > 1 && (
                              <IconButton
                                onClick={() => {
                                  handleDropDownChange(rowIndex);
                                }}
                                sx={{
                                  marginTop: "05px",
                                  borderRadius: "4px",
                                }}
                              >
                                {row.dropdown ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                              </IconButton>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {row.breakdown.length > 1 &&
                        row.dropdown &&
                        row.breakdown.map((breakdown, breakdownIndex) => {
                          return (
                            <TableRow>
                              {/* <TableCell></TableCell> */}
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell>{getMonthNameFromDate(new Date(breakdown.date))}</TableCell>
                              <TableCell>₹{breakdown.amount}</TableCell>
                              <TableCell>
                                <TextField
                                  disabled={true}
                                  placeholder={`Enter ${row.amountType == "Percentage" ? "Value" : "Amount"}`}
                                  type="text"
                                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    handleSubRowChange(
                                      row,
                                      rowIndex,
                                      row.discountValue,
                                      Number(event.target.value),
                                      getMonthNameFromDate(new Date(breakdown.date))
                                    );
                                  }}
                                  value={breakdown.discountValue}
                                />
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          );
                        })}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={styles.feeDetails}>
          <StudentSelector
            formValues={{
              className: classes.find((e) => {
                if (props.classId) {
                  return e.sectionId == props.classId;
                } else {
                  return e.sectionId == formValues.selectedClass;
                }
              })?.name,
              discountCategory: discountCategories.find((e) => e._id == formValues.discountCategoryId)?.name,
              feeCategory: feeCategories.find((e) => e._id == formValues.categoryId)?.categoryName,
              feeStructure: feeStructures.find((e) => e._id == formValues.feeStructureId)?.feeStructureName,
            }}
            students={students}
            setStudents={setStudents}
            feeStructure={rows}
          />
        </div>
      </div>
      {error.snack_state && (
        <Alert_Message
          isSnackbar={true}
          AlertProperties={{
            severity: "error",
            message: `${error.message}`,
            width: "100%",
          }}
          SnackbarProperties={{
            noHide: true,
          }}
        />
      )}
    </div>
  );
};

export default GiveDiscount;
