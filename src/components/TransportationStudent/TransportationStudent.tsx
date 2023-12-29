import React, { useEffect, useState } from "react";
import styles from "./TransportationStudent.module.css";
import {
  IconButton,
  InputBase,
  Paper,
  Select,
  MenuItem,
  Dialog,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { CloseRounded, DeleteOutlineOutlined } from "@mui/icons-material";
import AddStudents from "./AddStudents/AddStudents";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import api from "@/store/api";
import { Class } from "@/models/Class";
import Selector from "@/Elements/Selector/Selector";
import user from "@/assests/user.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { StudentInfo } from "@/models/Transportation";

interface FormValues {
  searchTerm: string;
  class: string;
}

const TransportationStudent = () => {
  //data
  const schoolId = localStorage.getItem("school_id") as string;

  //API
  const getClassesAPI = api((state) => state.getClasses);
  const getStudentsListAPI = api((state) => state.getStudentsList);
  const deleteStudentAPI = api((state) => state.deleteStudent);
  const getStudentByIdAPI = api((state) => state.getStudentById);

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      sortable: false,
      width: 5,
      headerClassName: "checklist",
      cellClassName: "rowColor",
      // renderCell: (params: any) => (
      //     <Checkbox
      //         checked={selectedStudents.includes(params.id as string)}
      //         onChange={() => handleCheckboxChange(params.id as string)}
      //     />
      // ),
    },
    {
      field: "studentName",
      headerName: "Student Name",
      width: 250,
      headerClassName: "student",
      renderCell: (params) => (
        <>
          <div className={styles.data}>
            <img className={styles.userImg} src={user} />
            <div className={styles.tablerow}>
              <span>{params.row.studentName}</span>
              <span>{params.row.sectionInfo[0].className}</span>
            </div>
          </div>
        </>
      ),
      cellClassName: "rowColor",
    },
    { field: "stopName", headerName: "Stop Name", width: 200 },
    { field: "assignedVehicleNumber", headerName: "Vehicle No", width: 130 },
    { field: "dueAmount", headerName: "Due Amount", width: 130 },
    { field: "paidAmount", headerName: "Paid Amount", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <>
          <div className={`${styles.status} ${styles[params.row.feeDetails[0].status]}`}>
            {params.row.feeDetails[0]?.status}
          </div>
        </>
      ),
    },
    { field: "tripNumber", headerName: "Trip No", width: 130 },
    { field: "registrationNumber", headerName: "Registration No", width: 130 },
    { field: "routeName", headerName: "Route Name", width: 130 },
    { field: "driverName", headerName: "Driver", width: 130 },
    {
      field: "edit",
      headerName: "",
      width: 80,
      renderCell: (params: any) => (
        <IconButton onClick={(event) => handleClick(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const [classes, setClasses] = useState<Class[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedStudentId, setSelectedSelectedId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [createStudent, setCreateStudents] = useState<StudentInfo>({
    _id: "",
    schoolId: schoolId,
    sectionId: "default",
    studentId: "default",
    transportSchedule: "both",
    selectedRouteId: "default",
    stopId: "default",
    feeMonths: [],
    status: "pending",
    monthlyFees: null,
  });

  const handleCheckboxChange = (selectedStudentId: string) => {
    if (selectedStudents.includes(selectedStudentId)) {
      setSelectedStudents((prevSelected) => prevSelected.filter((id) => id !== selectedStudentId));
    } else {
      setSelectedStudents((prevSelected) => [...prevSelected, selectedStudentId]);
    }
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [formValues, setFormValues] = useState<FormValues>({
    searchTerm: "",
    class: "default",
  });

  const [refetch, setRefetch] = useState(false);

  const handleClick = (event: any, id: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedSelectedId(id._id);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMenuItemClick = (data: any) => {
    setDeleteConfirmationOpen(true);
    setSelectedStudents(data.id);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmationOpen(false);
    await handleDeleteStudent(selectedStudentId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteStudentAPI(id).then((response) => {
      setRefetch((prev: boolean) => !prev);
    });
  };

  const handleEditMenuItemClick = (id: string) => {
    EditDriver(id);
    handleClose();
  };

  const EditDriver = async (data: any) => {
    setIsEdit(true);
    setDialogEnabled(true);
    await getStudentByIdAPI(data).then((response) => {
      if (response.status === 200) {
        const responseData = response.data.data[0];
        // const updatedMonthlyFees = responseData?.feeDetails[0]?.totalAmount; // Assuming totalAmount is present inside the feeDetails object

        // // Update totalAmount in all feeDetails objects
        // const updatedFeeDetails = responseData?.feeDetails.map((feeDetail: any) => ({
        //   ...feeDetail,
        //   totalAmount: updatedMonthlyFees,
        // }));

        setCreateStudents({
          ...createStudent,
          _id: responseData?._id,
          sectionId: responseData?.sectionInfo[0]?._id,
          studentId: responseData?.studentInfo[0]?._id,
          transportSchedule: responseData?.transportSchedule,
          selectedRouteId: responseData?.routeInfo[0]?._id,
          stopId: responseData?.routeInfo[0]?.stopId,
          feeMonths: responseData?.feeMonth,
          status: responseData?.status,
          monthlyFees: responseData?.feeDetails[0]?.totalAmount,
        });
      }
    });
  };

  useEffect(() => {
    console.log(createStudent);
  }, [createStudent]);

  const handleDeleteButtonClick = () => {
    console.log("Deleting students with IDs:", selectedStudents);
  };

  const getClasses = () => {
    getClassesAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let classes: Class[] = await response.data.data;
        classes.unshift({ name: "All Class", sectionId: "default" });
        setClasses(classes);
      }
    });
  };

  const handleClassChange = (event: string) => {
    setFormValues({ ...formValues, class: event });
    // getTransportationStudents();
  };

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize });
    // getTransportationStudents();
  };

  const debouncedHandleSearch = (searchQuery: string) => {
    clearTimeout(debounceTimer!); // Clear previous debounce timer
    const timer = setTimeout(() => {
      getTransportationStudents();
    }, 500); // Set debounce delay (e.g., 300ms)
    setDebounceTimer(timer); // Store new debounce timer
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, searchTerm: e.target.value as string });
    // debouncedHandleSearch(searchValue); // Call the debounced search handler
  };
  const getTransportationStudents = async () => {
    try {
      await getStudentsListAPI(
        schoolId,
        formValues.class === "default" ? "" : formValues.class,
        formValues.searchTerm,
        paginationModel.page,
        paginationModel.pageSize
      ).then((response) => {
        if (response.status === 200) {
          console.log(response);
          let data = response.data.data;
          data.map((item: any) => {
            item.id = item._id;
            item.routeName = item?.routeInfo[0]?.routeName;
            item.studentName = item?.studentInfo[0]?.name;
            item.stopName = item?.routeInfo[0]?.stop;
            item.assignedVehicleNumber = item?.vehicleInfo[0]?.assignedVehicleNumber;
            item.registrationNumber = item?.vehicleInfo[0]?.registrationNumber;
            item.driverName = item?.driverInfo[0]?.name;
            item.paidAmount = item?.feeDetails[0]?.paidAmount;
            item.dueAmount = item?.feeDetails[0]?.dueAmount;
            return item;
          });
          console.log(data, "data", response);
          setRows(data);
          setTotalCount(response.data.resultCount);
        }
      });
    } catch (error: any) {
      console.log("Error", error.message);
      setRows([]);
      setTotalCount(0);
    }
  };

  useEffect(() => {
    getClasses();
    getTransportationStudents();
  }, [formValues, paginationModel, refetch]);

  useEffect(() => {
    getTransportationStudents();
  }, [dialogEnabled]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.row}>
          <Paper className={styles.search}>
            <IconButton aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search Students"
              id="filled-hidden-label-small"
              size="small"
              className={styles.search_input}
              value={formValues.searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>

          <div style={{ width: "10%", marginLeft: "10px" }}>
            <Selector
              value={formValues.class}
              items={classes.map((e) => {
                return {
                  name: e.name,
                  value: e.sectionId,
                };
              })}
              onChange={handleClassChange}
            ></Selector>
          </div>
          <div className={styles.btn}>
            {/* <button
                            className={styles.delete}
                            disabled={deleteButtonDisabled}
                            onClick={handleDeleteButtonClick}
                        >
                            <DeleteOutlineOutlined />
                            Delete Student
                        </button> */}
            <button
              className={styles.add}
              onClick={() => {
                setDialogEnabled(true);
                setIsEdit(false);
              }}
            >
              <Add />
              Add Student
            </button>
          </div>
        </div>
        <div style={{ height: "480px", margin: "20px 0px" }}>
          <DataGrid
            sx={{
              border: "2px solid var(--grey-5-d-9-d-9-d-9, #D9D9D9);",
              borderRadius: "20px",
              overflowY: "hidden",
              "& .student": {
                backgroundColor: "#FAFAFA",
              },
              "& .rowColor": {
                backgroundColor: "#FAFAFA",
              },
              "& .checklist": {
                backgroundColor: "#FAFAFA",
                borderRadius: "20px",
              },
            }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => {
              return a - b;
            })}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={handlePageChange}
            rowCount={totalCount}
            getRowHeight={() => "auto"}
          />
        </div>
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <AddStudents
          setDialogEnabled={setDialogEnabled}
          isEdit={isEdit}
          createStudent={createStudent}
        />
      </Dialog>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          sx={{ color: "#2760EA" }}
          onClick={() => handleEditMenuItemClick(selectedStudentId)}
        >
          Edit
        </MenuItem>
        <MenuItem
          sx={{ color: "#2760EA" }}
          onClick={() => handleDeleteMenuItemClick(selectedStudentId)}
        >
          Delete
        </MenuItem>
      </Menu>
      <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogContent>
          <span className={styles.title}>Are you sure you want to delete this Student?</span>
        </DialogContent>
        <DialogActions>
          <button onClick={handleCancelDelete} className={styles.cancel}>
            Cancel
          </button>
          <button onClick={handleConfirmDelete} className={styles.delete}>
            Confirm Delete
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransportationStudent;
