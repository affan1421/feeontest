import React, { useEffect, useState } from "react";
import styles from "./Vehicles.module.css";
import {
  IconButton,
  InputBase,
  Paper,
  Select,
  MenuItem,
  Dialog,
  Menu,
  DialogContent,
  Button,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import personAdd from "@/assests/person_add.svg";
import AddVehicles from "./AddVehicles/AddVehicles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "@/store/api";
import { VehicleInfo } from "@/models/Transportation";
import dayjs from "dayjs";
import { Add, Close } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Vehicles = () => {
  // data
  const schoolId = localStorage.getItem("school_id") as string;
  const currentDate = dayjs().format("DD/MM/YYYY");

  // API
  const getVehicleListAPI = api((state) => state.getVehicleList);
  const deteleVehicleAPI = api((state) => state.deleteVehicle);
  const getVehicleByIdAPI = api((state) => state.getVehicleById);

  // Table column
  const columns: GridColDef[] = [
    { field: "registrationNumber", headerName: "Register Number", width: 200 },
    { field: "vehicleMode", headerName: "Vehicle Type", width: 200 },
    { field: "seatingCapacity", headerName: "No of Seats", width: 200 },
    { field: "assignedVehicleNumber", headerName: "Vehicle No", width: 150 },
    {
      field: "vehicleInfo",
      headerName: "Route",
      width: 320,
      renderCell: (params: any) => (
        <div className={styles.routes}>
          {params.row.vehicleInfo.map((item: any, index: number) => (
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

  // state variables
  const [rows, setRows] = useState([]);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [vehicleAttachments, setVehicleAttachments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [vehicleCreation, setVehicleCreation] = useState<VehicleInfo>({
    registrationNumber: "",
    assignedVehicleNumber: null,
    seatingCapacity: null,
    taxValid: currentDate,
    fcValid: currentDate,
    vehicleMode: "default",
    schoolId: schoolId,
    attachments: [],
  });

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize });
    getVehicleDetails(searchTerm, data.page, data.pageSize);
  };

  const debouncedHandleSearch = (searchQuery: string) => {
    clearTimeout(debounceTimer!); // Clear previous debounce timer
    const timer = setTimeout(() => {
      getVehicleDetails(searchQuery, paginationModel.page, paginationModel.pageSize);
    }, 500); // Set debounce delay (e.g., 300ms)
    setDebounceTimer(timer); // Store new debounce timer
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setSearchTerm(searchValue);
    debouncedHandleSearch(searchValue); // Call the debounced search handler
  };

  const handleClick = (event: any, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedDriverId(id); // You might need to manage the selected driver ID state
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditMenuItemClick = (id: string) => {
    handleEditVehicle(id);
    handleClose();
  };

  const handleDeleteMenuItemClick = (data: any) => {
    setDeleteConfirmationOpen(true);
    setSelectedDriverId(data.id);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmationOpen(false);
    await handleDeleteVehicle(selectedDriverId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const getVehicleDetails = async (searchQuery?: string, page?: number, limit?: number) => {
    try {
      await getVehicleListAPI(schoolId, searchQuery, page, limit).then((response) => {
        let data = response.data.data;
        data.map((item: any) => {
          item.id = item._id;
        });
        console.log(data);
        setRows(data);
        setTotalCount(response.data.resultCount);
      });
    } catch (error) {
      setRows([]);
      setTotalCount(0);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    await deteleVehicleAPI(id).then((response) => {
      console.log(response);
      getVehicleDetails();
    });
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialogOpen(false);
  };

  const handleDownloadImage = () => {
    const attachmentUrl = vehicleAttachments[selectedAttachmentIndex];
    const link = document.createElement("a");
    link.href = attachmentUrl;
    link.download = `attachment_${selectedAttachmentIndex}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = (index: number) => {
    setSelectedAttachmentIndex(index);
    setSelectedImage(index);
  };

  const handleEditVehicle = async (data: any) => {
    setDialogEnabled(true);
    setIsEdit(true);
    await getVehicleByIdAPI(data._id).then((response) => {
      if (response.status === 200) {
        let data = response.data.data;
        setVehicleCreation(data);
      }
      console.log(data);
    });
  };

  useEffect(() => {
    getVehicleDetails(searchTerm, paginationModel.page, paginationModel.pageSize);
  }, []);

  useEffect(() => {
    getVehicleDetails(searchTerm, paginationModel.page, paginationModel.pageSize);
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
              placeholder="Search Vehicles by Register Number"
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
              Add Vehicle
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
            // getRowHeight={() => 'auto'}
          />
        </div>
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <AddVehicles
          setDialogEnabled={setDialogEnabled}
          getVehicleDetails={getVehicleDetails}
          isEdit={isEdit}
          vehicleCreation={vehicleCreation}
        />
      </Dialog>
      <Dialog open={previewDialogOpen} onClose={handleClosePreviewDialog} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Vehicle Proof</h1>
            <IconButton sx={{ p: "10px" }} onClick={handleClosePreviewDialog}>
              <Close />
            </IconButton>
          </div>
          <div className={styles.imagePreview}>
            {vehicleAttachments.map((attachment: string, index: number) => (
              <div key={index} className={styles.displayImage}>
                <img
                  src={attachment}
                  alt={`Attachment ${index}`}
                  onClick={() => handleImageClick(index)}
                  className={selectedImage === index ? styles.selectedImage : ""}
                />
              </div>
            ))}
          </div>
          <div className={styles.downloadButtonContainer}>
            <button className={styles.downloadButton} onClick={handleDownloadImage}>
              Download
            </button>
          </div>
        </div>
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
          <span className={styles.title}>Are you sure you want to delete this Vehicle?</span>
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

export default Vehicles;
