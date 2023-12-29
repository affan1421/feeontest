import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dialog, IconButton, MenuItem, Paper, Select, TextareaAutosize, Tooltip } from "@mui/material";
import Input from "@/Elements/Input/Input";
import api from "@/store/api";
import { Transaction } from "@/models/Transaction";
import { Class } from "@/models/Class";
import { Check, CloseRounded, Visibility } from "@mui/icons-material";
import DatePicker from "@/Elements/DatePicker/DatePicker";
import styles from "./ReceiptsManagement.module.css";
import dayjs from "dayjs";
import { Close } from '@mui/icons-material'
import Receipt from "../Receipt/Receipt";
import { ReceiptModel } from "@/models/Receipt";


const ReceiptsManagement = () => {
  const schoolId = localStorage.getItem("school_id") as string;
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [classes, setClasses] = useState<Class[]>([]);

  const getTransactionsAPI = api((state) => state.getTransactions);
  const getClassesAPI = api((state) => state.getClasses);
  const cancelReceiptAPI = api((state) => state.cancelReceipt)
  const getReceiptbyIdAPI = api(state => state.getReceiptbyId)

  const paginationModelDefault = {
    page: 0,
    pageSize: 5,
  };

  const filterValuesDefault = {
    search: "",
    class: "default",
    status: "default",
    date: "",
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Student name",
      width: 200,
      filterable: false,
      sortable: false,
    },
    {
      field: "className",
      headerName: "Class",
      width: 150,
      filterable: false,
      sortable: false,
    },
    {
      field: "receiptId",
      headerName: "Receipt Number",
      width: 180,
      filterable: false,
      sortable: false,
    },
    {
      field: "issueDate",
      headerName: "Date",
      width: 150,
      filterable: false,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title={params.row.reason && <span className={styles.tooltip}>{params.row.reason}</span>}>
            <div className={`${styles.status} ${styles[params.row.status]}`}>
              {params.row.status ? params.row.status : 'PAID'}
            </div>
          </Tooltip>
        </>
      )
    },
    {
      field: "view",
      headerName: "",
      sortable: false,
      width: 150,
      filterable: false,
      align: "right",

      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              getReceiptbyIdView(params.row.id)
            }}
            sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px", marginRight: '10px' }}
          >
            <Visibility />
          </IconButton>
          {
            params.row.status === 'REQUESTED' &&
            <>
              <IconButton
                onClick={() => {
                  cancelReceipt(params.row.id, 'CANCELLED')
                }}
                sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px", marginRight: '10px' }}
              >
                <Check />
              </IconButton>
              <IconButton
                onClick={() => {
                  getReceiptbyId(params.row.id)
                }}
                sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px" }}
              >
                <Close />
              </IconButton>
            </>
          }

        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState(
    paginationModelDefault
  );
  const [filterValues, setFilterValues] = useState(filterValuesDefault);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [cancelDialogEnabled, setCancelDialogEnabled] = useState(false);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel)
  const [comment, setComment] = useState('')


  const debouncedHandleSearch = (searchValue: string) => {
    clearTimeout(debounceTimer!); // Clear previous debounce timer
    const timer = setTimeout(() => {
      handleFilter(filterValues.class, filterValues.status, searchValue, filterValues.date);
    }, 400); // Set debounce delay (e.g., 300ms)
    setDebounceTimer(timer); // Store new debounce timer
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  }

  const getReceiptbyId = (receiptId: string) => {
    getReceiptbyIdAPI(receiptId).then((response) => {
      if (response && response.status === 200) {
        setReceipt(response.data.data)
        setCancelDialogEnabled(true)
      }
    })

  }

  const getReceiptbyIdView = (receiptId: string) => {
    getReceiptbyIdAPI(receiptId).then((response) => {
      if (response && response.status === 200) {
        setReceipt(response.data.data)
        setDialogEnabled(true)
      }
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setFilterValues({
      ...filterValues,
      search: searchValue,
    });
    debouncedHandleSearch(searchValue);
  };

  const handleDateChange = (dateString: string) => {
    setFilterValues({
      ...filterValues,
      date: dateString ? dateString : "",
    });
    handleFilter(
      filterValues.class,
      filterValues.status,
      filterValues.search,
      dateString
    )
  };

  const handlePageChange = (data: any) => {
    setPaginationModel({
      ...paginationModel,
      page: data.page,
      pageSize: data.pageSize,
    });
    getTransactions(
      schoolId,
      data.page,
      data.pageSize,
      filterValues.class !== "default" ? filterValues.class : undefined,
      filterValues.status !== "default" ? filterValues.status : undefined,
      filterValues.search !== "default" ? filterValues.search : undefined,
      filterValues.date
      //   ? dayjs(filterValues.date).format("DD/MM/YYYY")
      //   : undefined
    );
  };

  const getClasses = () => {
    getClassesAPI(schoolId).then((response: any) => {
      setClasses(response.data.data);
    });
  };

  const getTransactions = async (
    schoolId: string,
    page: number,
    limit: number,
    classValue?: string,
    statusValue?: string,
    search?: string,
    date?: string
  ) => {
    getTransactionsAPI(
      schoolId,
      page,
      limit,
      classValue ? classValue : undefined,
      undefined,
      search,
      date ? dayjs(date).format("DD/MM/YYYY") : undefined,
      undefined,
      undefined,
      statusValue
    ).then((response) => {
      if (response && response.status === 200) {
        let data = response.data.data;
        data = data.data.map((item: Transaction) => {
          return {
            ...item,
            issueDate: dayjs(item.issueDate).format("DD/MM/YYYY"),
            id: item._id,
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

  const handleFilter = (
    classValue: string,
    statusValue: string,
    searchValue: string,
    dateValue: string
  ) => {
    getTransactions(
      schoolId,
      paginationModel.page,
      paginationModel.pageSize,
      classValue !== "default" ? classValue : undefined,
      statusValue !== "default" ? statusValue : undefined,
      searchValue,
      dateValue
    );
  };

  const cancelReceipt = (receiptId: string, status: 'CANCELLED' | 'REJECTED') => {
    cancelReceiptAPI(receiptId, { status, reason: comment }).then((response) => {
      if (response.status == 200) {
        setCancelDialogEnabled(false)
        getTransactions(
          schoolId,
          paginationModel.page,
          paginationModel.pageSize,
          filterValues.class !== "default" ? filterValues.class : undefined,
          filterValues.status !== "default" ? filterValues.status : undefined,
          filterValues.search !== "default" ? filterValues.search : undefined,
          filterValues.date ? filterValues.date : undefined
        )
      }
    })
  }

  useEffect(() => {
    getClasses();
    getTransactions(
      schoolId,
      paginationModel.page,
      paginationModel.pageSize,
      filterValues.class !== "default" ? filterValues.class : undefined,
      filterValues.status !== "default" ? filterValues.status : undefined,
      filterValues.search,
      filterValues.date ? filterValues.date : undefined
    );
  }, []);

  return (
    <>
      <div className={styles.main}>
        <h1>Receipts</h1>
        <br />
        <div className={styles.row}>
          <div className={styles.search}>
            <Input
              value={filterValues.search}
              placeholder={"Search student, Receipt no"}
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
              handleFilter(
                classValue,
                filterValues.status,
                filterValues.search,
                filterValues.date
              );
            }}
            endAdornment={
              filterValues.class !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleFilter(
                      "",
                      filterValues.status,
                      filterValues.search,
                      filterValues.date
                    );
                    setFilterValues({ ...filterValues, class: "default" });
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={
              filterValues.class == "default" ? undefined : () => null
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
          <Select
            onChange={(e) => {
              const statusValue = e.target.value as string;
              setFilterValues({
                ...filterValues,
                status: statusValue,
              });
              handleFilter(
                filterValues.class,
                statusValue,
                filterValues.search,
                filterValues.date
              );
            }}
            className={styles.selector}
            value={filterValues.status}
            endAdornment={
              filterValues.status !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleFilter(
                      filterValues.class,
                      "",
                      filterValues.search,
                      filterValues.date
                    );
                    setFilterValues({ ...filterValues, status: "default" });
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={
              filterValues.status == "default" ? undefined : () => null
            }
          >
            <MenuItem value="default" disabled>
              Select Status
            </MenuItem>
            <MenuItem value="REQUESTED">Cancel Requests</MenuItem>
            <MenuItem value="CANCELLED">Cancelled Receipts</MenuItem>
            <MenuItem value="REJECTED">Rejected Requests</MenuItem>
          </Select>
          <DatePicker
            label=""
            value={filterValues.date ? dayjs(filterValues.date) : null}
            onChange={handleDateChange}
          />
        </div>
        <div className={styles.grid}>
          <DataGrid
            sx={{ border: "0px" }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[
              5,
              10,
              25,
              totalCount < 100 ? totalCount : 100,
            ].sort((a, b) => {
              return a - b;
            })}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={handlePageChange}
            rowCount={totalCount}
          />
        </div>
        <Dialog open={dialogEnabled} maxWidth='xl'>
          <Receipt
            receipt={receipt}
            setDialogEnabled={setDialogEnabled}
          />
        </Dialog>
        <Dialog open={cancelDialogEnabled} maxWidth='xl'>
          <Receipt
            receipt={receipt}
            setDialogEnabled={setCancelDialogEnabled}
          />
          <div style={{ margin: '20px 20px' }}>
            <Paper
              className={styles.input_desc} >
              <TextareaAutosize
                placeholder='Reason for Cancellation'
                className={styles.input_input_desc}
                value={comment}
                onChange={handleCommentChange}
              />
            </Paper>
          </div>
          <div className={styles.reason_footer}>
            <button disabled={comment == ''}
              className={
                `${!comment && styles.disabled}`
              }
              onClick={() => {
                cancelReceipt(receipt._id, 'REJECTED')
              }}
            >Proceed to Cancellation</button>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ReceiptsManagement;
