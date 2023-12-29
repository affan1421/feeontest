import style from "./StudentsTcList.module.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, Button, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "@/store/api";

/**
 * @interface StudentTcListType
 * @property {Object[]} content - An array of content items.
 * @property {string} content[].title - string
 * @property {Object[]} content[].items - An array of items within a content item.
 * @property {string} content[].items[].minWidth - string
 * @property {React.ReactNode} content[].items[].compo - React.ReactNode
 * @property {string=} search - string (optional)
 * @property {string=} class - string (optional)
 * @property {string=} status - string (optional)
 */
interface StudentTcListType {
  content: {
    title: string;
    items: {
      minWidth: string;
      compo: React.ReactNode;
    }[];
  }[];
  search?: string;
  class?: string;
  status?: string;
  refetch: number;
  setRefetch: any;
  setShowModal: any;
  handleModalOpen: any;
}

/**
 * {
 *
 * id: number;
 *
 * _id?: number;
 *
 * tcType?: string;
 *
 * reason?: string;
 *
 * studentslist: string;
 *
 * class: string;
 *
 * totalAmount: number;
 *
 * paidAmount: number;
 *
 * pendingAmount: number;
 *
 * status: string;
 *
 * search?: string;
 *
 * totalDocs: number;
 *
 * }
 */

interface StudentDataType {
  id: number;
  _id?: number;
  tcType?: string;
  reason?: string;
  studentslist: string;
  class: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: string;
  search?: string;
  totalDocs: number;
}

/**
 * {
 *
 * label : string ,
 *
 * value : string
 *
 * }
 */
interface TabValues {
  label: string;
  value: string;
}

export default function StudentsTcList(props: StudentTcListType) {
  const [tabValue, setTabValue] = useState<TabValues>({
    label: "ALUMINI-TC",
    value: "ALUMINI-TC",
  }); // Initial tab values

  const [rows, setRows] = useState<StudentDataType[]>([]);

  const [columns, setColumns] = useState<GridColDef[]>([]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  }); // Initial page setting

  const role = localStorage.getItem("role_name");

  /**
   * Function for retrieves data of students who are req/approved/rejected for TC from a backend API.
   * @param tcType string
   * @param search string (optional)
   * @param classId string (optional)
   * @param status string (optional)
   * @param page number (optional)
   * @param limit number (optional)
   */
  const getTcStudentsListApi = api((state) => state.getTcStudentsList);

  /**
   * Function for approve/reject TC request from managment/admin.
   * @param id string
   * @param status string
   */
  const changeTcStatusApi = api((state) => state.changeTcStatus);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue({ label: newValue, value: newValue });
  };

  /**
   * This function retrieves data of students who are req/approved for TC from a backend API.
   *
   * It is a standard function for performing the following functionality
   * * fetching all the TC (students) data.
   * * search
   * * filter by class & status
   * * pagination
   */
  const getRowDataFromBackend = async () => {
    const { data } = await getTcStudentsListApi(
      tabValue.value,
      props?.search,
      props?.class == "default" ? "" : props?.class,
      props?.status == "default" ? "" : props?.status,
      paginationModel.page + 1,
      paginationModel.pageSize
    );
    const result = data?.data?.map((students: any) => {
      return { ...students, id: students._id };
    });
    setRows(result);
  };

  /**
   * This function handles changing the student's tc approval status to approved or rejected which updates that in DB as well.
   * **/
  async function handleManageTc(id: string, accept: boolean) {
    try {
      if (accept) {
        const {
          data: { success },
        } = await changeTcStatusApi(id, "APPROVED");
        if (success) {
          getRowDataFromBackend();
          props.setRefetch((pre: number) => pre + 2);
        } else {
          alert("Error on server");
        }
      } else {
        const {
          data: { success },
        } = await changeTcStatusApi(id, "REJECTED");
        if (success) {
          getRowDataFromBackend();
          props.setRefetch((pre: number) => pre + 2);
        } else {
          alert("Error on server");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * This function will handle the columns while switching the tabs.
   * @param tab string
   * @returns
   */
  function setTableColumns(tab: string) {
    const defaultAmount = 0;
    const Columns: GridColDef[] = [
      {
        field: "studentslist",
        headerName: "Student name",
        width: 270,
        sortable: false,
        renderCell: (params: any) => (
          <>
            <Avatar sx={{ width: "24px", height: "24px" }} />
            &nbsp; &nbsp;
            {params.row.studentslist}
          </>
        ),
      },
      {
        field: "classes",
        headerName: "Class",
        width: 100,
        filterable: false,
        sortable: false,
      },
      {
        field: "totalAmount",
        headerName: "Total fees",
        width: 100,
        filterable: false,
        sortable: false,
        valueGetter: (params: any) => params.row.totalAmount || defaultAmount,
      },
      {
        field: "paidAmount",
        headerName: "Paid Fees",
        width: 100,
        filterable: false,
        sortable: false,
        valueGetter: (params: any) => params.row.paidAmount || defaultAmount,
      },
      {
        field: "pendingAmount",
        headerName: "Pending Fees",
        width: 150,
        filterable: false,
        sortable: false,
        valueGetter: (params: any) => params.row.pendingAmount || defaultAmount,
      },
      {
        field: "status",
        headerName: "TC Status",
        width: 180,
        sortable: false,
        renderCell: (params: any) => (
          <button
            style={{
              backgroundColor:
                params.row.status === "APPROVED"
                  ? "#E8F7ED"
                  : params.row.status === "REJECTED"
                  ? "#FFAFAF"
                  : "",
            }}
            className={style.status}
          >
            {params.row.status}
          </button>
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 240,
        sortable: false,
        renderCell: (params: any) => (
          <div className={style.actions}>
            {role === "management" && params.row.status === "PENDING" && (
              <>
                <Button
                  onClick={() => handleManageTc(params.row.id, false)}
                  variant="outlined"
                  style={{ color: "#555555", borderColor: "#DBDBDB" }}
                  size="small"
                >
                  <CloseIcon />
                </Button>
                <Button
                  onClick={() => handleManageTc(params.row.id, true)}
                  variant="outlined"
                  style={{ color: "#555555", borderColor: "#DBDBDB" }}
                  size="small"
                >
                  <DoneIcon />
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              style={{ color: "#555555", borderColor: "#DBDBDB" }}
              size="small"
            >
              <VisibilityIcon
                onClick={() => {
                  props.handleModalOpen(params.row.id);
                }}
              />
            </Button>
          </div>
        ),
      },
    ];

    if (tab === "AVAIL-TC") {
      const add = {
        field: "reason",
        headerName: "Reason Type",
        width: 200,
        filterable: false,
        sortable: false,
      };
      const updatedColumns = [...Columns.slice(0, 4), add, ...Columns.slice(4)];
      setColumns(updatedColumns);
      return;
    }
    setColumns(Columns);
  }

  // Setting table columns while switching tabs & fetching appropriate data for the current tab
  useEffect(() => {
    setTableColumns(tabValue.value);
    getRowDataFromBackend();
  }, [tabValue]);

  /* 
  For fetching data while : 
    o searching 
    o filtering by class & status
    o page change  
  */
  useEffect(() => {
    getRowDataFromBackend();
  }, [props.class, props.status, paginationModel, props?.search]);

  // setting pagination while filtering
  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: 5 });
  }, [props.class, props.status]);

  useEffect(() => {
    if (props.refetch != 2) setPaginationModel({ page: 0, pageSize: 5 });
  }, [props.refetch]);

  return (
    <>
      <div className={style.main}>
        <div className={style.headers}></div>

        <TabContext value={tabValue.value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {props.content.length > 0 &&
                props.content.map((x, i) => {
                  return (
                    <Tab
                      key={i}
                      sx={{ textTransform: "none" }}
                      label={x.title}
                      value={x.title}
                    />
                  );
                })}
            </TabList>
          </Box>

          {props.content.length > 0 &&
            props.content.map((x, i) => {
              return (
                <TabPanel className={style.tabPanel} value={x.title}>
                  <div className={style.itemsWrapper}>
                    {x.items.length > 0 &&
                      x.items.map((y, i) => {
                        return (
                          <div style={{ minWidth: y.minWidth }}>{y.compo}</div>
                        );
                      })}
                  </div>
                  <Box className={style.table} sx={{ height: 400 }}>
                    <DataGrid
                      disableColumnMenu
                      sx={{ border: "none", mt: 2 }}
                      rows={rows}
                      columns={columns}
                      pageSizeOptions={[5]}
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      rowCount={rows?.[0]?.totalDocs || 0}
                      paginationMode="server"
                      sortingMode="server"
                    />
                  </Box>
                </TabPanel>
              );
            })}
        </TabContext>
      </div>
    </>
  );
}
