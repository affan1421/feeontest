import React, { useEffect, useState } from "react";
import styles from "./Drivers.module.css";
import {
  IconButton,
  InputBase,
  Paper,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import personAdd from "@/assests/person_add.svg";
import AddDriver from "./AddDriver/AddDriver";
import DriversDetails from "./DriversDetails/DriversDetails";
import api from "@/store/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DriverInfo } from "@/models/Transportation";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Add } from "@mui/icons-material";

interface DriverDetails {
  name: string;
  salary: number;
  contactNumber: number;
  drivingLicense: number;
  emergencyNumber: number;
  assignedVehicle: number;
  assignedTrips: number;
  aadharNumber: number;
  selectedRoute: string;
  bloodGroup: string;
  address: string;
}

const Drivers = () => {
  // data
  const schoolId = localStorage.getItem("school_id") as string;

  // APIS
  const getDriverListAPI = api((state) => state.getDriverList);
  const deteleDriverAPI = api((state) => state.deleteDriver);
  const getDriverDetailAPI = api((state) => state.getDriverDetail);

  const columns: GridColDef[] = [
    { field: "name", headerName: " Driver Name", width: 200 },
    { field: "contactNumber", headerName: "Phone Number", width: 250 },
    { field: "emergencyNumber", headerName: "Emergency Number", width: 250 },
    {
      field: "route",
      headerName: "Route",
      width: 600,
      renderCell: (params: any) => (
        <div className={styles.routes}>
          {params.row.routesInfo.map((item: any, index: number) => (
            <div key={index} className={styles.routeItem}>
              {index > 0 && "| "}
              {item}
            </div>
          ))}
        </div>
      ),
    },
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

  const [rows, setRows] = useState([]);
  const [drivers, setDrivers] = useState<DriverDetails>();
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [driverDialog, setDriverDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [createDriver, setCreateDriver] = useState<DriverInfo>({
    name: "",
    drivingLicense: "",
    contactNumber: null,
    emergencyNumber: null,
    bloodGroup: "",
    aadharNumber: null,
    schoolId: schoolId,
    address: "",
    attachments: [],
  });

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize });
    getDriverData(searchTerm, data.page, data.pageSize);
  };

  const handleClick = (event: any, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedDriverId(id); // You might need to manage the selected driver ID state
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMenuItemClick = (data: any) => {
    setDeleteConfirmationOpen(true);
    setSelectedDriverId(data.id);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmationOpen(false);
    await handleDeleteDriver(selectedDriverId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const debouncedHandleSearch = (searchQuery: string) => {
    clearTimeout(debounceTimer!); // Clear previous debounce timer
    const timer = setTimeout(() => {
      getDriverData(searchQuery, paginationModel.page, paginationModel.pageSize);
    }, 500); // Set debounce delay (e.g., 300ms)
    setDebounceTimer(timer); // Store new debounce timer
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setSearchTerm(searchValue);
    debouncedHandleSearch(searchValue); // Call the debounced search handler
  };

  const getDriverData = async (searchQuery?: string, page?: number, limit?: number) => {
    try {
      await getDriverListAPI(schoolId, searchQuery, page, limit).then((response) => {
        if (response.status === 200) {
          let data = response.data.data;
          data.map((item: any) => {
            item.id = item._id;
          });
          setRows(data);
          setTotalCount(response.data.resultCount);
        }
      });
    } catch (error) {
      setRows([]);
      setTotalCount(0);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    await deteleDriverAPI(id).then((response) => {
      console.log(response);
      getDriverData();
    });
  };

  const handleEditMenuItemClick = (id: string) => {
    EditDriver(id);
    handleClose();
  };

  useEffect(() => {
    getDriverData(searchTerm, paginationModel.page, paginationModel.pageSize);
  }, []);

  // useEffect(() => {
  //     getDriverData(searchTerm, paginationModel.page, paginationModel.pageSize)
  // }, [dialogEnabled])

  const EditDriver = (data: any) => {
    console.log(data);
    setIsEdit(true);
    setCreateDriver({
      _id: data._id,
      name: data.name,
      drivingLicense: data.drivingLicense,
      contactNumber: data.contactNumber,
      emergencyNumber: data.emergencyNumber,
      bloodGroup: data.bloodGroup,
      aadharNumber: data.aadharNumber,
      schoolId: schoolId,
      address: data.address,
      attachments: data.attachments,
    });
    setDialogEnabled(true);
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.row}>
          <Paper className={styles.search}>
            <IconButton aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search Drivers"
              id="filled-hidden-label-small"
              size="small"
              className={styles.search_input}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>
          <div className={styles.btn}>
            <button
              onClick={() => {
                setDialogEnabled(true);
                setIsEdit(false);
              }}
            >
              <Add />
              Add Driver
            </button>
          </div>
        </div>
        <div style={{ height: "450px", margin: "20px 0px" }}>
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
        <AddDriver
          setDialogEnabled={setDialogEnabled}
          isEdit={isEdit}
          createDriver={createDriver}
          getDriverData={getDriverData}
        />
      </Dialog>
      <Dialog open={driverDialog} maxWidth="xl">
        <DriversDetails setDriverDialog={setDriverDialog} drivers={drivers} />
      </Dialog>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          sx={{ color: "#2760EA" }}
          onClick={() => handleEditMenuItemClick(selectedDriverId)}
        >
          Edit
        </MenuItem>
        <MenuItem
          sx={{ color: "#2760EA" }}
          onClick={() => handleDeleteMenuItemClick(selectedDriverId)}
        >
          Delete
        </MenuItem>
      </Menu>
      <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogContent>
          <span className={styles.title}>Are you sure you want to delete this Driver?</span>
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

export default Drivers;
