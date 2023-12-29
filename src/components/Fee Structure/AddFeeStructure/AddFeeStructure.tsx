import {
  Paper,
  InputBase,
  Select,
  MenuItem,
  TextareaAutosize,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Dialog,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Input,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./AddFeeStructure.module.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { FeeStructureModel } from "../../../models/FeeStructure";
import api from "../../../store/api";
import debounce from "lodash.debounce";
import Alert_Message from "../../../ErrorHandling/Alert_Message";
import { FeeStructureSchema } from "../../../FormSchema/FormValidation";
import { Log } from "nawaz-bettr-logger";
import SelectStudentsByClass from "./SelectStudentsByClass/SelectStudentsByClass";

const AddFeeStructure = (props: any) => {
  // API's
  // const getClassesAPI = api(state => state.getClassesbyCategory)
  const getFeeTypesAPI = api((state) => state.getFeeType);
  const getFeeSchedulesAPI = api((state) => state.getFeeSchedules);
  const createFeeStructureAPI = api((state) => state.createFeeStructure);
  const updateFeeStructureAPI = api((state) => state.updateFeeStructure);
  const setErrorAPI = api((state) => state.setError);
  const getYearAcademicInfoAPI = api((state) => state.getYearAcademicInfo);

  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [editdialog, setEditdialog] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(0);
  const [feeStructure, setfeeStructure] = useState<FeeStructureModel>({
    feeStructureName: "",
    academicYear: "default",
    academicYearId: props.isEdit
      ? props?.feeStructure?.academicYearId?._id
      : null,
    schoolId: null,
    classes: props?.feeStructure?.classes ? props?.feeStructure?.classes : [],
    description: "",
    feeDetails: [],
    totalAmount: 0,
    categoryId: props.categoryId,
    studentList: props?.feeStructure?.studentList
      ? props?.feeStructure?.studentList
      : [],
  });

  const [classes, setClasses]: any = useState([]);
  const [selectedclasses, setSelectedclasses]: any = useState<string[]>([]);

  const [row, setRow]: any = useState(null);
  const [rows, setRows]: any = useState([]);

  const [isRowAdded, setIsRowAdded] = useState(false);

  const [feeTypes, setFeeTypes]: any = useState([
    {
      _id: "default",
      feeType: "Fee Type",
    },
  ]);
  const [feeSchedules, setFeeSchedules] = useState([
    {
      _id: "default",
      fee: "Fee Schedule",
    },
  ]);

  const [error, setError] = useState({
    message: "",
    snack_state: false,
  });

  const [currState, setCurrState] = useState(false);

  const [activeAcademicYear, setActiveAcademicYear]: any = useState({
    _id: "default",
    name: "Academic Year",
  });

  useEffect(() => {
    // getClasses()
    getFeeTypes();
    getFeeSchedules();

    // Edit or Duplicate Module
    if (props.isEdit || props.isDuplicate) {
      let editFeeStructure = props.feeStructure;
      console.log(editFeeStructure);

      getYearAcademicInfoAPI(
        localStorage.getItem("school_id") as string,
        0,
        1000,
        true
      ).then((response: any) => {
        const [{ name, _id }] = response.data.data;
        editFeeStructure.academicYear = name;
        setActiveAcademicYear({
          _id,
          name,
        });
      });
      setTimeout(async () => {
        setfeeStructure({ ...editFeeStructure });
        if (!props.isDuplicate) {
          let newClasses = editFeeStructure.classes.map((e: any) => e.name);
          await setSelectedclasses(newClasses);
        }
      }, 100);
    } else {
      getActiveAcademicYear();
    }
  }, []);

  useEffect(() => {
    if (props.isEdit || props.isDuplicate) {
      let editFeeStructure = props.feeStructure;
      let rows = editFeeStructure.feeDetails;
      rows.forEach((row: any) => {
        feeTypes.forEach((item: any) => {
          if (item._id === row.feeTypeId) {
            row.feeTypeName = item.feeType;
          }
        });
      });
      setRows(rows);
    }
  }, [feeTypes]);

  useEffect(() => {
    if (props.isEdit || props.isDuplicate) {
      let editFeeStructure = props.feeStructure;
      let rows = editFeeStructure.feeDetails;
      rows.forEach((row: any) => {
        feeSchedules.forEach((item: any) => {
          if (item._id === row.scheduleTypeId) {
            row.scheduleTypeName = item.scheduleName;
          }
        });
        row.scheduledDates = row.scheduledDates.map((date: any) => {
          if (date.date) {
            return {
              date: date.date,
              month: new Date(date.date).toLocaleString("default", {
                month: "long",
              }),
              amount: Number(date.amount),
            };
          } else {
            return {
              date: date,
              month: new Date(date).toLocaleString("default", {
                month: "long",
              }),
              amount: Number(date.amount).toFixed(2),
            };
          }
        });
        row.dropdown = row.scheduledDates.length > 1 ? false : null;
      });
      setRows(rows);
    }
  }, [feeSchedules]);

  useEffect(() => {
    let totalAmount = 0;
    // Add all Amounts
    rows.forEach((item: any) => {
      totalAmount += item.totalAmount;
    });
    setfeeStructure({
      ...feeStructure,
      academicYear: activeAcademicYear.name,
      academicYearId: activeAcademicYear._id,
      feeDetails: rows,
      totalAmount: totalAmount,
      schoolId: localStorage.getItem("school_id"),
    });
  }, [rows]);

  const getActiveAcademicYear = () => {
    getYearAcademicInfoAPI(
      localStorage.getItem("school_id") as string,
      0,
      1000,
      true
    ).then((response: any) => {
      const [{ _id, name }] = response.data.data;
      setActiveAcademicYear({
        _id,
        name,
      });
      setfeeStructure({
        ...feeStructure,
        academicYear: name,
        academicYearId: _id,
        schoolId: localStorage.getItem("school_id"),
      });
    });
  };

  const handleAddRow = () => {
    setEditdialog(false);
    if (props.isEdit) {
      setRow({
        feeTypeId: "default",
        scheduleTypeId: "default",
        scheduledDates: [],
        totalAmount: null,
        breakdown: 0,
        isNewFieldinEdit: true,
      });
    } else {
      setRow({
        feeTypeId: "default",
        scheduleTypeId: "default",
        scheduledDates: [],
        totalAmount: null,
        breakdown: 0,
      });
    }
    setDialogEnabled(true);
  };

  const addNewRow = async () => {
    setIsRowAdded(true);
    const feeType: any = await feeTypes.filter(
      (item: any) => item._id === row.feeTypeId
    );
    const feeSchedule: any = await feeSchedules.filter(
      (item: any) => item._id === row.scheduleTypeId
    );
    feeSchedule[0].scheduledDates = feeSchedule[0].scheduledDates.map(
      (date: any) => {
        if (date.date) {
          return {
            date: date.date,
            month: new Date(date.date).toLocaleString("default", {
              month: "long",
            }),
            amount: Number(
              Number(row.totalAmount) /
                Number(feeSchedule[0].scheduledDates.length)
            ).toFixed(2),
            isUpdated: false,
          };
        } else {
          return {
            date: date,
            month: new Date(date).toLocaleString("default", { month: "long" }),
            amount: Number(
              Number(row.totalAmount) /
                Number(feeSchedule[0].scheduledDates.length)
            ).toFixed(2),
            isUpdated: false,
          };
        }
      }
    );
    await setRow({
      ...row,
      feeTypeName: feeType[0].feeType,
      scheduleTypeName: feeSchedule[0].scheduleName,
    });

    setRows([
      ...rows,
      {
        ...row,
        feeTypeName: feeType[0].feeType,
        scheduleTypeName: feeSchedule[0].scheduleName,
        scheduledDates: feeSchedule[0].scheduledDates,
        dropdown: feeSchedule[0].scheduledDates.length > 1 ? false : null,
      },
    ]);
    setDialogEnabled(false);
  };

  // Handle Changes

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setfeeStructure({
      ...feeStructure,
      feeStructureName: event.target.value,
    });
  };

  const handleAcademicChange = (event: SelectChangeEvent) => {
    setfeeStructure({
      ...feeStructure,
      academicYear: event.target.value,
    });
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedclasses(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setfeeStructure({
      ...feeStructure,
      description: event.target.value,
    });
  };

  const handleRowFeeTypeChange = (event: SelectChangeEvent) => {
    setRow({
      ...row,
      feeTypeId: event.target.value,
    });
  };

  const handleRowFeeScheduleChange = (event: SelectChangeEvent) => {
    setRow({
      ...row,
      scheduleTypeId: event.target.value,
    });
  };

  const handleRowAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRow({
      ...row,
      totalAmount: event.target.value ? Number(event.target.value) : null,
    });
  };

  // Sub Row Edit
  const handleSubRowChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    totalAmount: number,
    monthName: string
  ) => {
    let newSubAmount: number = Number(event.target.value);
    let row: any = rows[index];
    let divideCount = 0;
    let updatedTotalAmount = 0;

    let updatedMonths = row.scheduledDates.map((month: any) => {
      if (monthName === month.month) {
        updatedTotalAmount += Number(newSubAmount);
        return {
          ...month,
          amount: Number(newSubAmount),
          isUpdated: true,
        };
      } else if (month.isUpdated) {
        updatedTotalAmount += Number(month.amount);
      } else {
        divideCount++;
      }
      return month;
    });

    let newNonUpdatedAmount =
      (Number(totalAmount) - Number(updatedTotalAmount)) / divideCount;
    let newMonthsData = updatedMonths.map((month: any) => {
      if (!month.isUpdated && newNonUpdatedAmount >= 0) {
        month.amount = Number(newNonUpdatedAmount).toFixed(2);
      }
      return month;
    });
    row.scheduledDates = newMonthsData;
    let newRows = [...rows];
    newRows[index] = row;
    setRows(newRows);
    debouncedChangeHandler(newMonthsData, totalAmount);
  };

  const checkTotalIfItsCorrect = (months: [], totalAmount: number) => {
    let currentTotal = 0;
    months.forEach((month: any) => {
      currentTotal += Number(month?.amount);
    });
    console.log(Number(currentTotal.toFixed(2)));
    if (Number(currentTotal - totalAmount).toFixed(2) !== "0.00") {
      if (
        Number(currentTotal.toFixed(2)) + 0.01 >
        Number(totalAmount.toFixed(2))
      ) {
        setError({
          snack_state: true,
          message: `Please Enter Correct Amount -
                    Newly Added Amount Exceeds Total Amount By
                    ${Number(currentTotal - totalAmount).toFixed(2)}`,
        });
        setCurrState(true);
      } else if (
        Number(currentTotal.toFixed(2)) + 0.01 <
        Number(totalAmount.toFixed(2))
      ) {
        setError({
          snack_state: true,
          message: `Current Total is Less than Total Amount
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

  const debouncedChangeHandler = useCallback(
    debounce(checkTotalIfItsCorrect, 1000),
    []
  );

  useEffect(() => {
    if (!props.isEdit) {
      setfeeStructure({
        ...feeStructure,
        classes: classes.filter((item: any) =>
          selectedclasses.includes(item.name)
        ),
      });
    }
  }, [selectedclasses]);

  // Get Fee Types
  const getFeeTypes = () => {
    let categoryId = props.categoryId;
    getFeeTypesAPI(
      localStorage.getItem("school_id") as string,
      0,
      9999,
      categoryId
    ).then((response: any) => {
      setFeeTypes(response.data.data);
    });
  };

  // Get Fee Schedules
  const getFeeSchedules = () => {
    let categoryId = props.categoryId;
    getFeeSchedulesAPI(
      0,
      9999,
      localStorage.getItem("school_id") as string,
      categoryId
    ).then((response: any) => {
      setFeeSchedules(response.data.data);
    });
  };

  const createFeeStructure = async () => {
    console.log(JSON.stringify(feeStructure));
    try {
      await FeeStructureSchema.validate(
        {
          ...feeStructure,
          categoryId: props.categoryId,
        },
        { abortEarly: false }
      );
      {
        createFeeStructureAPI(feeStructure).then((response: any) => {
          if (response.status == 201) {
            props.closeAdd(false);
          }
        });
      }
    } catch (error: any) {
      const errorMessage = error.errors.join("\n");
      setErrorAPI(true, errorMessage);
      setTimeout(() => {
        setErrorAPI(false, "");
      }, 2000);
    }
  };

  const handleEditRow = (item: any, index: number) => {
    setEditRowIndex(index);
    setEditdialog(true);
    setDialogEnabled(true);
    setRow({
      feeTypeId: item.feeTypeId,
      feeTypeName: item.feeTypeName,
      scheduleTypeId: item.scheduleTypeId,
      scheduledDates: item.scheduledDates,
      breakdown: item.breakdown,
      dropdown: item.dropdown,
      scheduleTypeName: item.scheduleTypeName,
      totalAmount: item.totalAmount,
    });
  };

  const updateRow = async () => {
    const feeType: any = await feeTypes.filter(
      (item: any) => item._id === row.feeTypeId
    );
    const feeSchedule: any = await feeSchedules.filter(
      (item: any) => item._id === row.scheduleTypeId
    );
    feeSchedule[0].scheduledDates = feeSchedule[0].scheduledDates.map(
      (date: any) => {
        if (date.date) {
          return {
            date: date.date,
            month: new Date(date.date).toLocaleString("default", {
              month: "long",
            }),
            amount: Number(
              Number(row.totalAmount) /
                Number(feeSchedule[0].scheduledDates.length)
            ).toFixed(2),
          };
        } else {
          return {
            date: date,
            month: new Date(date).toLocaleString("default", { month: "long" }),
            amount: Number(
              Number(row.totalAmount) /
                Number(feeSchedule[0].scheduledDates.length)
            ).toFixed(2),
          };
        }
      }
    );

    await setRow({
      ...row,
      feeTypeName: feeType[0].feeType,
      scheduleTypeName: feeSchedule[0].scheduleName,
    });
    let tempRows = rows;
    tempRows.splice(editRowIndex, 1);

    if (props.isEdit) {
      tempRows.splice(editRowIndex, 0, {
        ...row,
        isNewFieldinEdit: true,
        feeTypeName: feeType[0].feeType,
        scheduleTypeName: feeSchedule[0].scheduleName,
        scheduledDates: feeSchedule[0].scheduledDates,
      });
    } else {
      tempRows.splice(editRowIndex, 0, {
        ...row,
        feeTypeName: feeType[0].feeType,
        scheduleTypeName: feeSchedule[0].scheduleName,
        scheduledDates: feeSchedule[0].scheduledDates,
      });
    }

    let totalAmount = 0;
    // Add all Amounts
    tempRows.forEach((item: any) => {
      totalAmount += item.totalAmount;
    });
    setfeeStructure({
      ...feeStructure,
      totalAmount: totalAmount,
    });

    setRows(tempRows);
    setDialogEnabled(false);
  };

  const updateFeeStructure = async () => {
    let data: FeeStructureModel = {
      ...feeStructure,
      categoryId: props.categoryId,
      isRowAdded: isRowAdded,
    };
    data.studentList =
      data.studentList &&
      data.studentList.filter((student) => {
        if (student.isRemoved) {
          return student;
        }
        if (student.isNew) {
          return student;
        }
      });
    try {
      await FeeStructureSchema.validate(data, { abortEarly: false });
      {
        updateFeeStructureAPI(data, feeStructure.id as string).then(
          (response: any) => {
            if (response.status == 200) {
              props.closeAdd(false);
            }
          }
        );
      }
    } catch (error: any) {
      const errorMessage = error.errors.join("\n");
      setErrorAPI(true, errorMessage);
      setTimeout(() => {
        setErrorAPI(false, "");
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Fee Structure</h1>
        <div className={styles.action}>
          <button
            className={styles.cancel}
            onClick={() => {
              props.closeAdd(false);
            }}
          >
            Cancel
          </button>
          {props.isEdit ? (
            <button onClick={updateFeeStructure}>Update</button>
          ) : (
            <button
              disabled={currState}
              className={styles.save}
              onClick={createFeeStructure}
            >
              Save
            </button>
          )}
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.row}>
          <Paper className={styles.input}>
            <InputBase
              placeholder="Name"
              id="filled-hidden-label-small"
              size="small"
              className={styles.input_input}
              value={feeStructure.feeStructureName}
              onChange={handleNameChange}
              data-testid="add-name"
            />
          </Paper>
          <Select
            disabled
            value={activeAcademicYear.name}
            className={styles.selector}
          >
            <MenuItem value={activeAcademicYear.name} disabled selected>
              {activeAcademicYear.name}
            </MenuItem>
          </Select>
        </div>
        <div className={styles.row}>
          <SelectStudentsByClass
            categoryId={props.categoryId}
            feeStructure={feeStructure}
            setfeeStructure={setfeeStructure}
            isEdit={props.isEdit}
          />
        </div>
        <div className={styles.row}>
          <Paper className={styles.input_desc}>
            <TextareaAutosize
              data-testid="add-description"
              placeholder="Description"
              id="filled-hidden-label-small"
              className={styles.input_input_desc}
              value={feeStructure.description}
              onChange={handleDescriptionChange}
            />
          </Paper>
        </div>
        <div className={styles.row}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>SL</b>
                  </TableCell>
                  <TableCell>
                    <b>Fee Type</b>
                  </TableCell>
                  <TableCell>
                    <b>Fee Schedule</b>
                  </TableCell>
                  <TableCell>
                    <b>Amount</b>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 &&
                  rows.map((item: any, index: number) => {
                    return (
                      <>
                        <TableRow key={item?.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item?.feeTypeName}</TableCell>
                          <TableCell>{item?.scheduleTypeName}</TableCell>
                          <TableCell>{item.totalAmount}</TableCell>
                          <TableCell>
                            {(props.isEdit ? item.isNewFieldinEdit : true) && (
                              <IconButton
                                sx={{
                                  border: "1.5px solid #DBDBDB",
                                  borderRadius: "04px",
                                }}
                                onClick={() => {
                                  handleEditRow(item, index);
                                }}
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                            )}
                            &nbsp;&nbsp;
                            {item.scheduledDates.length > 1 &&
                              !item.dropdown && (
                                <IconButton
                                  sx={{
                                    border: "1.5px solid #DBDBDB",
                                    borderRadius: "04px",
                                  }}
                                  onClick={() => {
                                    const updatedRows = [...rows];
                                    const index = updatedRows.indexOf(item);
                                    updatedRows[index] = {
                                      ...item,
                                      dropdown: !item.dropdown,
                                    };
                                    setRows(updatedRows);
                                  }}
                                >
                                  <KeyboardArrowDownOutlinedIcon />
                                </IconButton>
                              )}
                            {item.scheduledDates.length > 1 &&
                              item.dropdown && (
                                <IconButton
                                  sx={{
                                    border: "1.5px solid #DBDBDB",
                                    borderRadius: "04px",
                                  }}
                                  onClick={() => {
                                    const updatedRows = [...rows];
                                    const index = updatedRows.indexOf(item);
                                    updatedRows[index] = {
                                      ...item,
                                      dropdown: !item.dropdown,
                                    };
                                    setRows(updatedRows);
                                  }}
                                >
                                  <KeyboardArrowUpOutlinedIcon />
                                </IconButton>
                              )}
                          </TableCell>
                        </TableRow>
                        {item.scheduledDates.length > 1 && item.dropdown
                          ? item.scheduledDates.map((date: any) => (
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell> </TableCell>
                                <TableCell>{date.month}</TableCell>
                                <TableCell>
                                  <>
                                    <Input
                                      disabled={
                                        props.isEdit
                                          ? !item.isNewFieldinEdit
                                            ? true
                                            : false
                                          : false
                                      }
                                      type="number"
                                      disableUnderline
                                      style={{
                                        fontSize: "12px",
                                        borderBottom: "none",
                                      }}
                                      onChange={(e: any) => {
                                        handleSubRowChange(
                                          e,
                                          index,
                                          item.totalAmount,
                                          date.month
                                        );
                                      }}
                                      value={date.amount}
                                    />
                                  </>
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            ))
                          : null}
                      </>
                    );
                  })}
                {
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>

                    <TableCell>
                      <button
                        onClick={handleAddRow}
                        className={styles.faded_btn}
                      >
                        Add Row
                      </button>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={styles.row}>
          <Paper className={styles.input}>
            <InputBase
              placeholder="Total Amount"
              id="filled-hidden-label-small"
              size="small"
              className={styles.input_input}
              value={feeStructure.totalAmount}
              onChange={handleNameChange}
              data-testid="add-name"
              disabled
            />
          </Paper>
        </div>
        <Dialog open={dialogEnabled} maxWidth="xl">
          <div className={styles.dialog_container}>
            <h1>New Row</h1>
            <div className={styles.row}>
              <Select
                value={row?.feeTypeId}
                className={styles.dialog_selector}
                onChange={handleRowFeeTypeChange}
              >
                <MenuItem value="default" disabled>
                  Fee Type
                </MenuItem>
                {feeTypes.length > 0 &&
                  feeTypes.map((feeType: any) => {
                    return (
                      <MenuItem value={feeType._id} key={feeType._id}>
                        {feeType.feeType}
                      </MenuItem>
                    );
                  })}
              </Select>
              <Select
                value={row?.scheduleTypeId}
                className={styles.dialog_selector}
                onChange={handleRowFeeScheduleChange}
                data-testid="add-selectaccount"
              >
                <MenuItem value="default" disabled>
                  Fee Schedule
                </MenuItem>
                {feeSchedules.map((feeSchedule: any) => {
                  return (
                    <MenuItem value={feeSchedule._id} key={feeSchedule._id}>
                      {feeSchedule.scheduleName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div className={styles.row}>
              <Paper className={styles.dialog_input}>
                <InputBase
                  type="number"
                  placeholder="Total Amount"
                  id="filled-hidden-label-small"
                  size="small"
                  className={styles.input_input}
                  value={row?.totalAmount}
                  onChange={handleRowAmountChange}
                  data-testid="add-name"
                />
              </Paper>
            </div>
            <div className={styles.row}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  className={styles.cancel}
                  onClick={() => {
                    setDialogEnabled(false);
                  }}
                >
                  Cancel
                </button>
                {editdialog ? (
                  <button className={styles.faded_btn} onClick={updateRow}>
                    Update
                  </button>
                ) : (
                  <button className={styles.faded_btn} onClick={addNewRow}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog>
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

export default AddFeeStructure;
