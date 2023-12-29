import styles from "./ExpenseTransaction.module.css";
import api from "@/store/api";
import { useEffect, useState } from "react";
import { Dialog, IconButton, InputBase, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { ExpenseTransactionModel } from "@/models/ExpenseTransaction";
import SearchIcon from "@mui/icons-material/Search";
import { Close, CloseRounded, Download, Print } from "@mui/icons-material";
import { writeFile, read } from "xlsx";
import { PaymentMethod, SortType, SortValue } from "@/models/ExpenseTransaction";
import { Range } from "react-date-range";
import CustomDateRangePicker from "@/Elements/CustomDateRangePicker/CustomDateRangePicker";
import { parseDate } from "@internationalized/date";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import Voucher, { VoucherModel } from "../Voucher/Voucher";

interface FormValues {
  search: string;
  paymentMethod: PaymentMethod;
  sortValue: SortValue;
  sortType: SortType;
  searchTerm: string;
  startDate: string;
  endDate: string;
  expenseTypeId: string;
}

interface Props {
  refreshData: boolean;
}

interface ExpenseType {
  name: string;
  _id: string;
  remainingBudget?: number;
}

const ExpenseTransaction = (props: Props) => {
  const schoolId = localStorage.getItem("school_id") as string;

  const getExpenseTransactionsAPI = api((state) => state.getExpenseTransactions);
  const getExpenseExcelAPI = api((state) => state.getExpenseExcel);
  const getExpenseTypeNamesAPI = api((state) => state.getExpenseTypeNames);

  const columns = [
    { id: "expenseType", label: "Expense Type" },
    { id: "amount", label: "Amount" },
    { id: "reason", label: "Reason" },
    { id: "voucherNumber", label: "Voucher Number" },
    { id: "expenseDate", label: "Expense Date" },
    { id: "paymentMethod", label: "Payment Method" },
    { id: "print", label: "Print" },
  ];

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPageOptions = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [range, setRange] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const sortOptions = [
    { value: "highest", label: "Highest Expense" },
    { value: "lowest", label: "Lowest Expense" },
  ];

  const [formValues, setFormValues] = useState<FormValues>({
    search: "",
    paymentMethod: "default",
    sortValue: undefined,
    expenseTypeId: "default",
    sortType: "default",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  const paymentMethods = [
    { value: "CASH", label: "Cash" },
    { value: "CHEQUE", label: "Cheque" },
    { value: "ONLINE_TRANSFER", label: "Online Transfer" },
    { value: "UPI", label: "UPI" },
    { value: "DD", label: "DD" },
    { value: "DEBIT_CARD", label: "Debit Card" },
    { value: "CREDIT_CARD", label: "Credit Card" },
  ];

  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);

  const [dialogEnabled, setDialogEnabled] = useState(false);

  const [voucher, setVoucher] = useState({} as VoucherModel);

  const handleFilter = (
    search: string,
    sortValue: SortValue,
    expenseTypeId: string | undefined,
    paymentMethod: PaymentMethod | undefined,
    startDate: string,
    endDate: string
  ) => {
    getExpenseTransactions(
      schoolId,
      page,
      rowsPerPage,
      paymentMethod !== "default" ? paymentMethod : undefined,
      sortValue,
      expenseTypeId !== "default" ? expenseTypeId : undefined,
      search !== "" ? search : undefined,
      startDate !== "" ? startDate : undefined,
      endDate !== "" ? endDate : undefined
    );
  };

  const clearDateRange = () => {
    setRange(null);
    setFormValues({
      ...formValues,
      startDate: "",
      endDate: "",
    });
    getExpenseTransactions(
      schoolId,
      page,
      rowsPerPage,
      formValues.paymentMethod !== "default" ? formValues.paymentMethod : undefined,
      formValues.sortValue !== undefined ? formValues.sortValue : undefined,
      formValues.expenseTypeId !== "default" ? formValues.expenseTypeId : undefined,
      formValues.searchTerm !== "" ? formValues.searchTerm : undefined,
      undefined,
      undefined
    );
  };

  const handleCustomDateRangePicker = (value: any) => {
    setRange(value);
    let startDate = `${value.start.day.toString().padStart(2, "0")}/${value.start.month.toString().padStart(2, "0")}/${
      value.start.year
    }`;
    let endDate = `${value.end.day.toString().padStart(2, "0")}/${value.end.month.toString().padStart(2, "0")}/${
      value.end.year
    }`;

    setFormValues({
      ...formValues,
      startDate: startDate,
      endDate: endDate,
    });
    getExpenseTransactions(
      schoolId,
      page,
      rowsPerPage,
      formValues.paymentMethod !== "default" ? formValues.paymentMethod : undefined,
      formValues.sortValue !== undefined ? formValues.sortValue : undefined,
      formValues.expenseTypeId !== "default" ? formValues.expenseTypeId : undefined,
      formValues.searchTerm !== "" ? formValues.searchTerm : undefined,
      startDate !== "" ? startDate : undefined,
      endDate !== "" ? endDate : undefined
    );
  };

  const dateFormatter = (date: string) => {
    return new Date(date).getDate() + "/" + (new Date(date).getMonth() + 1) + "/" + new Date(date).getFullYear();
  };

  const getAllExpenseType = () => {
    getExpenseTypeNamesAPI(schoolId).then(async (response: any) => {
      console.log(response);
      if (response.status === 200) {
        let ExpenseTypes: ExpenseType[] = await response.data.data;
        ExpenseTypes.unshift({ name: "Select Expense Type", _id: "default" });
        setExpenseTypes(ExpenseTypes);
      }
    });
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const selectedSort = event.target.value as SortType;
    let sortValue: SortValue;

    switch (selectedSort) {
      case "highest":
        sortValue = -1;
        break;
      case "lowest":
        sortValue = 1;
        break;
      default:
        sortValue = undefined;
        break;
    }
    console.log(sortValue, selectedSort);
    handleFilter(
      formValues.searchTerm,
      sortValue,
      formValues.expenseTypeId,
      formValues.paymentMethod,
      formValues.startDate,
      formValues.endDate
    );
    setFormValues({ ...formValues, sortValue: sortValue, sortType: selectedSort });
  };

  const handleExpenseChange = (event: SelectChangeEvent) => {
    handleFilter(
      formValues.searchTerm,
      formValues.sortValue,
      event.target.value as string,
      formValues.paymentMethod,
      formValues.startDate,
      formValues.endDate
    );
    setFormValues({ ...formValues, expenseTypeId: event.target.value });
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    getExpenseTransactions(
      schoolId,
      newPage,
      rowsPerPage,
      formValues.paymentMethod,
      formValues.sortValue,
      formValues.expenseTypeId,
      formValues.searchTerm,
      formValues.startDate !== "" ? formValues.startDate : undefined,
      formValues.endDate !== "" ? formValues.endDate : undefined
    );
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
    getExpenseTransactions(
      schoolId,
      0,
      newRowsPerPage,
      formValues.paymentMethod,
      formValues.sortValue,
      formValues.expenseTypeId,
      formValues.searchTerm,
      formValues.startDate !== "" ? formValues.startDate : undefined,
      formValues.endDate !== "" ? formValues.endDate : undefined
    );
  };

  const getExpenseTransactions = async (
    school_id: string,
    page: number,
    limit: number,
    paymentMethod?: PaymentMethod,
    sortValue?: SortValue,
    expenseTypeId?: string,
    searchTerm?: string,
    startDate?: string | undefined,
    endDate?: string | undefined
  ) => {
    try {
      const response = await getExpenseTransactionsAPI(
        school_id,
        page,
        limit,
        sortValue !== undefined ? sortValue : undefined,
        expenseTypeId !== "default" ? expenseTypeId : undefined,
        paymentMethod !== "default" ? paymentMethod : undefined,
        searchTerm !== "" ? searchTerm : undefined,
        startDate !== "" ? startDate : undefined,
        endDate !== "" ? endDate : undefined
      );
      let data = response.data.data;
      data = data.map((item: ExpenseTransactionModel) => ({
        id: item._id,
        expenseType: item.expenseType?.name,
        amount: item.amount,
        reason: item.reason,
        voucherNumber: item.voucherNumber,
        expenseDate: new Date(item.expenseDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        paymentMethod: item.paymentMethod,
      }));
      setRows(data);
      setTotalCount(response.data.resultCount);
    } catch (error) {
      setRows([]);
      setTotalCount(0);
    }
  };

  const debouncedHandleSearch = (searchValue: string) => {
    clearTimeout(debounceTimer!);
    const timer = setTimeout(() => {
      handleFilter(
        searchValue,
        formValues.sortValue,
        formValues.expenseTypeId,
        formValues.paymentMethod,
        formValues.startDate,
        formValues.endDate
      );
    }, 500);
    setDebounceTimer(timer);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setFormValues({ ...formValues, searchTerm: searchValue });
    debouncedHandleSearch(searchValue);
  };

  useEffect(() => {
    getExpenseTransactions(schoolId, page, rowsPerPage, formValues.paymentMethod);
  }, []);

  const handlePaymentMethodChange = (e: SelectChangeEvent) => {
    const selectedPaymentMethod = e.target.value as PaymentMethod;
    handleFilter(
      formValues.searchTerm,
      formValues.sortValue,
      formValues.expenseTypeId,
      selectedPaymentMethod,
      formValues.startDate,
      formValues.endDate
    );
    setFormValues({ ...formValues, paymentMethod: selectedPaymentMethod });
  };

  const exportData = () => {
    getExpenseExcelAPI(
      schoolId,
      formValues.paymentMethod !== "default" ? formValues.paymentMethod : undefined,
      formValues.sortValue !== undefined ? formValues.sortValue : undefined,
      formValues.startDate !== "" ? formValues.startDate : undefined,
      formValues.endDate !== "" ? formValues.endDate : undefined
    ).then((response: any) => {
      if (response && response.status === 200) {
        let data = response.data.data;
        const workbook = arrayBufferToWorkbook(data);
        let name = `ExpenseTransactions-${new Date().toLocaleDateString()}.xlsx`;
        writeFile(workbook, name);
      }
    });
  };

  function arrayBufferToWorkbook(arrayBuffer: ArrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    const workbook = read(data, { type: "array" });
    return workbook;
  }

  const handleClose = () => {
    setDialogEnabled(false);
  };

  useEffect(() => {
    if (props.refreshData) {
      getExpenseTransactions(
        schoolId,
        page,
        rowsPerPage,
        formValues.paymentMethod,
        formValues.sortValue,
        formValues.expenseTypeId,
        formValues.searchTerm
      );
    }
  }, [props.refreshData]);

  useEffect(() => {
    getAllExpenseType();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h1>Transactions</h1>
        <div className={styles.row}>
          <Paper className={styles.search}>
            <IconButton aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Amount, Voucher, Approved by"
              id="filled-hidden-label-small"
              size="small"
              className={styles.search_input}
              value={formValues.searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>
          <Select
            className={styles.selector}
            onChange={handlePaymentMethodChange}
            value={formValues.paymentMethod}
            endAdornment={
              formValues.paymentMethod !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleFilter(
                      formValues.search,
                      formValues.sortValue,
                      formValues.expenseTypeId,
                      undefined,
                      formValues.startDate,
                      formValues.endDate
                    );
                    setFormValues({ ...formValues, paymentMethod: "default" });
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={formValues.paymentMethod === "default" ? undefined : () => null}
          >
            <MenuItem value="default" disabled>
              Select Payment Method
            </MenuItem>
            {paymentMethods.map((item: any) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            className={styles.selector}
            onChange={handleSortChange}
            value={formValues.sortType as string}
            endAdornment={
              formValues.sortType !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleFilter(
                      formValues.search,
                      undefined,
                      formValues.expenseTypeId,
                      formValues.paymentMethod,
                      formValues.startDate,
                      formValues.endDate
                    );
                    setFormValues({ ...formValues, sortType: "default" });
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={formValues.sortType === "default" ? undefined : () => null}
          >
            <MenuItem value="default" disabled>
              Sort by
            </MenuItem>
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            className={styles.selector}
            onChange={handleExpenseChange}
            value={formValues.expenseTypeId as string}
            endAdornment={
              formValues.expenseTypeId !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleFilter(
                      formValues.search,
                      formValues.sortValue,
                      undefined,
                      formValues.paymentMethod,
                      formValues.startDate,
                      formValues.endDate
                    );
                    setFormValues({ ...formValues, expenseTypeId: "default" });
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={formValues.expenseTypeId === "default" ? undefined : () => null}
          >
            <MenuItem value="default" disabled>
              Expense Type
            </MenuItem>
            {expenseTypes.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
          <div className={`${styles.selector} ${styles.datepicker}`}>
            <CustomDateRangePicker setRange={handleCustomDateRangePicker} range={range} />
          </div>
          {range !== null && (
            <div className={styles.active} onClick={clearDateRange}>
              <Close />
            </div>
          )}
          <div className={styles.download}>
            <button onClick={exportData}>
              <Download className={styles.download_icon} />
              &nbsp;
            </button>
          </div>
        </div>
      </div>
      {totalCount ? (
        <div className={styles.table}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <span className={styles.heading}>{column.label}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {columns.map((column) => {
                      if (column.id == "_id") {
                        return (
                          <>
                            <TableCell key={column.id}></TableCell>
                          </>
                        );
                      } else if (column.id == "print") {
                        return (
                          <>
                            <TableCell key={column.id}>
                              <IconButton
                                sx={{
                                  border: "1.5px solid #DBDBDB",
                                  borderRadius: "04px",
                                }}
                                onClick={() => {
                                  setVoucher(row);
                                  setDialogEnabled(true);
                                }}
                              >
                                <Print />
                              </IconButton>
                            </TableCell>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <TableCell key={column.id}>
                              <span className={styles.body}>{row[column.id]}</span>
                            </TableCell>
                          </>
                        );
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : (
        <div className={styles.nodata}>No Data</div>
      )}
      <Dialog open={dialogEnabled} maxWidth="xl" onClose={handleClose}>
        <Voucher handleClose={handleClose} voucher={voucher} />
      </Dialog>
    </div>
  );
};

export default ExpenseTransaction;
