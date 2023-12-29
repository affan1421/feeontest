import { useEffect, useState } from "react";
import styles from "./PreviousBalance.module.css";
import Input from "@/Elements/Input/Input";
import { CloseRounded } from "@mui/icons-material";
import { Select, IconButton, MenuItem, Dialog } from "@mui/material";
import { Class } from "@/models/Class";
import api from "@/store/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PreviousBalanceStudent from "../PreviousBalanceStudent/PreviousBalanceStudent";
import ImportExcel from "../ImportExcel/ImportExcel";
import TransactionListStudent from "../TransactionListStudent/TransactionListStudent";
import Payment from "../Payment/Payment";
import { PBData } from "@/models/PreviousBalance";

type PaymentMethod = "default" | "CASH" | "CHEQUE" | "ONLINE_TRANSFER" | "UPI" | "DD" | "DEBIT_CARD" | "CREDIT_CARD";

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

interface SchoolDetails {
  permissions: {
    ackReceipt: String;
    prevDateReceipt: Boolean;
    prevDateVoucher: Boolean;
  };
}

const PreviousBalance = () => {
  const schoolId = localStorage.getItem("school_id") as string;
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [classes, setClasses] = useState<Class[]>([]);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [transactionDialog, setTransactionDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [username, setUsername] = useState("");
  const [prevBalanceId, setPrevBalanceId] = useState("");
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails>({
    permissions: {
      prevDateReceipt: false,
      prevDateVoucher: false,
      ackReceipt: "DEFAULT",
    },
  });

  const getClassesAPI = api((state) => state.getClasses);
  const getPreviousBalanceAPI = api((state) => state.getPreviousBalance);
  const previousBalanceMakePaymentAPI = api((state) => state.previousBalanceMakePayment);
  const getSchoolDetailAPI = api((state) => state.getSchoolDetailsById);

  const columns: GridColDef[] = [
    {
      field: "studentName",
      headerName: "Student Info",
      width: 150,
      filterable: false,
      sortable: false,
    },
    {
      field: "className",
      headerName: "Class Name",
      width: 150,
      filterable: false,
      sortable: false,
    },
    {
      field: "dueAmount",
      headerName: "Pending Amount",
      width: 150,
      filterable: false,
      sortable: false,
    },
    {
      field: "studentType",
      headerName: "Student Type",
      width: 150,
      filterable: false,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <>
          <div className={`${styles.status} ${styles[params.row.status]}`}>{params.row.status}</div>
        </>
      ),
    },
    {
      field: "makeTransaction",
      headerName: "",
      width: 180,
      renderCell: (params: any) => (
        <button
          className={styles.transaction}
          onClick={() => {
            setStudentId(params.row.studentId);
            setUsername(params.row.username);
            setSectionId(params.row.sectionId._id);
            setTransactionDialog(true);
          }}
        >
          See Transaction
        </button>
      ),
    },
    {
      field: "makePayment",
      headerName: "",
      width: 180,
      renderCell: (params: any) => (
        <button
          onClick={() => {
            setStudentId(params.row.studentId);
            setAmount(params.row.dueAmount);
            setEditableAmount(params.row.dueAmount);
            setPaymentDialog(true);
            setPrevBalanceId(params.row._id);
          }}
          className={`${styles.payment} ${!params.row.dueAmount && styles.disabled}`}
          disabled={params.row.dueAmount === 0}
        >
          Make Payment
        </button>
      ),
    },
  ];
  const filterValuesDefault = {
    searchTerm: "",
    class: "default",
    studentType: "default",
  };
  const paginationModelDefault = {
    page: 0,
    pageSize: 5,
  };
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const [filterValues, setFilterValues] = useState(filterValuesDefault);
  const [paginationModel, setPaginationModel] = useState(paginationModelDefault);

  const debouncedHandleSearch = (searchTerm: string) => {
    clearTimeout(debounceTimer!); // Clear previous debounce timer
    const timer = setTimeout(() => {
      handleFilter(filterValues.studentType, filterValues.class, searchTerm);
    }, 300); // Set debounce delay (e.g., 300ms)
    setDebounceTimer(timer); // Store new debounce timer
  };
  const [editableAmount, setEditableAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [payment, setPayment] = useState<PaymentData>();

  const handleFilter = (isEnrolled: string, sectionId: string, searchTerm?: string) => {
    getPreviousBalance(
      schoolId,
      paginationModel.page,
      paginationModel.pageSize,
      sectionId !== "default" ? sectionId : undefined,
      isEnrolled !== "default" ? isEnrolled : undefined,
      searchTerm ? searchTerm : undefined
    );
  };

  const getClasses = () => {
    getClassesAPI(schoolId).then((response: any) => {
      setClasses(response.data.data);
    });
  };

  const handlePageChange = (data: any) => {
    setPaginationModel({
      ...paginationModel,
      page: data.page,
      pageSize: data.pageSize,
    });
    getPreviousBalance(
      schoolId,
      data.page,
      data.pageSize,
      filterValues.class !== "default" ? filterValues.class : undefined,
      filterValues.studentType !== "default" ? filterValues.studentType : undefined
    );
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setFilterValues({ ...filterValues, searchTerm: searchValue });
    debouncedHandleSearch(searchValue);
  };

  const getPreviousBalance = async (
    schoolId: string,
    page: number,
    limit: number,
    sectionId?: string,
    isEnrolled?: string,
    searchTerm?: string
  ) => {
    getPreviousBalanceAPI(
      schoolId,
      page,
      limit,
      sectionId ? sectionId : "",
      isEnrolled ? isEnrolled : undefined,
      searchTerm ? searchTerm : undefined
    ).then((response: any) => {
      if (response && response.status === 200) {
        let data = response.data.data;
        data = data.map((item: any) => {
          return {
            ...item,
            id: item._id,
            studentType: item.isEnrolled ? "Existing" : "Left",
            dueDate: "-",
            className: item.sectionId.className,
          };
        });
        setRows(data);
        setTotalCount(response.data.resultCount);
      } else {
        setRows([]);
        setTotalCount(0);
      }
    });
  };

  const handlePay = (paymentData: PaymentData, status: string) => {
    setPayment({ ...paymentData, createdBy: localStorage.getItem("user_id") as string });
    let data: PBData = {
      paidAmount: editableAmount,
      paymentMode: paymentData.paymentMethod as PaymentMethod,
      prevBalId: prevBalanceId,
      status: status,
      ...paymentData,
    };

    previousBalanceMakePaymentAPI(data).then((response: any) => {
      if (response && response.status === 200) {
        setPaymentDialog(false);
        getPreviousBalance(schoolId, paginationModel.page, paginationModel.pageSize);
      }
    });
  };

  const getSchoolDetails = () => {
    getSchoolDetailAPI(schoolId).then((response) => {
      let permissions = response.data.data[0].permissions;
      setSchoolDetails({
        ...schoolDetails,
        permissions: permissions,
      });
      console.log(permissions);
    });
  };

  useEffect(() => {
    getClasses();
    getPreviousBalance(schoolId, paginationModel.page, paginationModel.pageSize);
    getSchoolDetails();
  }, []);

  useEffect(() => {
    if (!dialogEnabled) {
      getPreviousBalance(schoolId, paginationModel.page, paginationModel.pageSize);
    }
  }, [dialogEnabled]);
  useEffect(() => {
    if (!dialogEnabled) {
      getPreviousBalance(schoolId, paginationModel.page, paginationModel.pageSize);
    }
  }, [importDialog]);

  return (
    <>
      <div className={styles.main}>
        <h1>Previous Balance</h1>
        <br />
        <div className={styles.row}>
          <div className={styles.search}>
            <Input
              value={filterValues.searchTerm}
              placeholder={"Search by Student name"}
              onChange={handleSearchChange}
              type="text"
            />
          </div>
          <Select
            className={styles.selector}
            value={filterValues.class}
            onChange={(e) => {
              const classValue = e.target.value as string;
              setFilterValues({
                ...filterValues,
                class: classValue,
              });
              handleFilter(filterValues.studentType, classValue);
            }}
            endAdornment={
              filterValues.class !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setFilterValues({ ...filterValues, class: "default" });
                    handleFilter(filterValues.studentType, "");
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={filterValues.class == "default" ? undefined : () => null}
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
          <Select
            className={styles.selector}
            value={filterValues.studentType}
            onChange={(e) => {
              const studentType = e.target.value as string;
              setFilterValues({
                ...filterValues,
                studentType: studentType,
              });
              handleFilter(studentType, filterValues.class);
            }}
            endAdornment={
              filterValues.studentType !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setFilterValues({ ...filterValues, studentType: "default" });
                    handleFilter("", filterValues.class);
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={filterValues.studentType == "default" ? undefined : () => null}
          >
            <MenuItem value="default" disabled>
              Student Type
            </MenuItem>
            <MenuItem value="true">Existing Student</MenuItem>
            <MenuItem value="false">Left Student</MenuItem>
          </Select>
          <div className={styles.button}>
            <button
              className={styles.tablebtn}
              onClick={() => {
                setDialogEnabled(true);
              }}
            >
              Add Individual
            </button>
            <button
              onClick={() => {
                setImportDialog(true);
              }}
              className={styles.tablebtn}
            >
              Import Sheet
            </button>
          </div>
        </div>
        <div className={styles.table}>
          <DataGrid
            sx={{ border: "0px" }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => {
              return a - b;
            })}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={handlePageChange}
            rowCount={totalCount}
          />
        </div>
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <PreviousBalanceStudent setDialogEnabled={setDialogEnabled} dialogEnabled={dialogEnabled} />
      </Dialog>
      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="xl">
        <ImportExcel setImportDialog={setImportDialog} />
      </Dialog>
      <Dialog open={transactionDialog} onClose={() => setTransactionDialog(false)} maxWidth="xl">
        <TransactionListStudent
          onClose={setTransactionDialog}
          studentId={studentId as string}
          sectionId={sectionId as string}
          username={username as string}
        />
      </Dialog>
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="xl">
        <Payment
          schoolDetails={schoolDetails}
          amount={amount}
          editableAmount={editableAmount}
          setEditableAmount={setEditableAmount}
          setDialogEnabled={setPaymentDialog}
          setPayment={setPayment}
          handlePay={handlePay}
        />
      </Dialog>
    </>
  );
};

export default PreviousBalance;
