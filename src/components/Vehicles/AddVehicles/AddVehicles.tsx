import React, { useEffect, useRef, useState } from "react";
import styles from "./AddVehicles.module.css";
import { Box, Dialog, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { AttachFile, Close, CloseRounded, CloudDownload } from "@mui/icons-material";
import api from "@/store/api";
import { VehicleInfo } from "@/models/Transportation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Input from "@/Elements/Input/Input";
import vector from "@/assests/directions_bus (1).svg";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileDownloadIcon from "@/assests/download.svg";
import CloseIcon from "@mui/icons-material/Close";

interface Attachments {
  name: string;
  url: string;
}

const AddVehicles = (props: any) => {
  // data varaible
  let schoolId = localStorage.getItem("school_id") as string;
  const currentDate = dayjs().format("DD/MM/YYYY");

  //APIS

  const createVehicleAPI = api((state) => state.createVehicle);
  const uploadAttachmentApi = api((state) => state.uploadFile);
  const updateVehicleAPI = api((state) => state.updateVehicle);

  // state variable
  const [attachments, setAttachments] = useState<Attachments[]>([]);
  const [viewAttachment, setViewAttachments] = useState<Attachments[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadingFileStatus, setUploadFileStatus] = useState("Add attachment");
  const fileInput = useRef<HTMLInputElement>(null);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleCreation({
      ...vehicleCreation,
      registrationNumber: e.target.value,
    });
  };

  const handleAssignedVehicleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleCreation({
      ...vehicleCreation,
      assignedVehicleNumber: Number(e.target.value),
    });
  };

  const handleSeatingCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleCreation({
      ...vehicleCreation,
      seatingCapacity: Number(e.target.value),
    });
  };

  const handleTaxValidChange = (date: any) => {
    setVehicleCreation({
      ...vehicleCreation,
      taxValid: dayjs(date).format("DD/MM/YYYY"),
    });
  };

  const handleFCValidChange = (date: any) => {
    setVehicleCreation({
      ...vehicleCreation,
      fcValid: dayjs(date).format("DD/MM/YYYY"),
    });
  };

  const handleVehicleModeChange = (event: SelectChangeEvent<string>) => {
    setVehicleCreation({
      ...vehicleCreation,
      vehicleMode: event.target.value,
    });
  };

  const handleAddFile = async () => {
    fileInput.current?.click();
  };

  const uploadAttachment = async (): Promise<string> => {
    setUploadFileStatus("Uploading Attachment...");
    try {
      if (file == null) throw "Attachment file is required";
      const formData = new FormData();
      formData.append("file", file);
      const {
        data: { message },
      } = await uploadAttachmentApi(formData);

      setVehicleCreation({
        ...vehicleCreation,
        attachments: [message],
      });
      setAttachments((pre) => [...pre, { name: file.name, url: message }]); // Only store the URL
      setUploadFileStatus("Add another attachment");
      return message;
    } catch (error) {
      setUploadFileStatus("Failed to upload, please retry");
      throw "Error while uploading file";
    }
  };

  const handleRemoveAttachment = (attachmentIndex: number) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(attachmentIndex, 1);
    setAttachments(updatedAttachments);

    const updatedViewAttachments = [...viewAttachment];
    updatedViewAttachments.splice(attachmentIndex, 1);
    setViewAttachments(updatedViewAttachments);

    const updatedVehicleAttachments = [...vehicleCreation.attachments];
    updatedVehicleAttachments.splice(attachmentIndex, 1);
    setVehicleCreation((prev) => ({
      ...prev,
      attachments: updatedVehicleAttachments,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createVehicleAPI(vehicleCreation).then((response) => {
        if (response.status === 200) {
          setVehicleCreation({
            ...vehicleCreation,
            registrationNumber: "",
            assignedVehicleNumber: null,
            seatingCapacity: null,
            taxValid: currentDate,
            fcValid: currentDate,
            vehicleMode: "default",
            schoolId: schoolId,
          });
          handleClose();
          props.getVehicleDetails();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    await updateVehicleAPI(props.vehicleCreation?._id, {
      ...vehicleCreation,
      taxValid: new Date(vehicleCreation?.taxValid?.split("/")?.reverse()?.join("/")).toISOString(),
      fcValid: new Date(vehicleCreation?.fcValid?.split("/")?.reverse()?.join("/")).toISOString(),
    }).then((response) => {
      if (response?.status === 200) {
        setVehicleCreation({
          ...vehicleCreation,
          registrationNumber: "",
          assignedVehicleNumber: null,
          seatingCapacity: null,
          taxValid: currentDate,
          fcValid: currentDate,
          vehicleMode: "default",
          schoolId: schoolId,
          attachments: [],
        });
        handleClose();
        // props.getVehicleDetails()
      }
    });
  };

  const handleClose = () => {
    props.setDialogEnabled(false);
  };

  useEffect(() => {
    if (props.isEdit) {
      console.log(props.vehicleCreation, "ad");
      setVehicleCreation(props.vehicleCreation);
      props.vehicleCreation.attachments.map((x: any) => {
        setViewAttachments((prev: any) => [...prev, { name: x, url: x }]);
      });
      setVehicleCreation((prevState) => ({
        ...prevState,
        taxValid: dayjs(props.vehicleCreation.taxValid).format("DD/MM/YYYY"),
        fcValid: dayjs(props.vehicleCreation.fcValid).format("DD/MM/YYYY"),
      }));
    }
  }, [props.isEdit, props.vehicleCreation]);

  useEffect(() => {
    if (file) uploadAttachment();
  }, [file]);

  return (
    <>
      <Dialog open={true} onClose={handleClose} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>
              <img src={vector} />
              {props.isEdit ? "Edit Vehicle" : "Create Vehicle"}
            </h1>
            <IconButton sx={{ p: "10px" }} onClick={() => props.setDialogEnabled(false)}>
              <Close />
            </IconButton>
          </div>
          <div className={styles.row}>
            <div className={styles.input}>
              <Input
                width="90%"
                placeholder="Register Number"
                value={vehicleCreation.registrationNumber}
                onChange={handleNameChange}
              />
            </div>
            <div className={styles.input}>
              <Input
                width="90%"
                type="number"
                placeholder="School Vehicle No."
                value={vehicleCreation.assignedVehicleNumber}
                onChange={handleAssignedVehicleNumberChange}
              />
            </div>
            <div className={styles.input}>
              <Input
                width="90%"
                placeholder="Seats"
                value={vehicleCreation.seatingCapacity}
                onChange={handleSeatingCapacityChange}
              />
            </div>
          </div>
          <div className={styles.row}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tax Valid"
                minDate={dayjs()}
                value={dayjs(vehicleCreation.taxValid, "DD/MM/YYYY")}
                format="DD/MM/YYYY"
                slotProps={{ textField: { variant: "outlined" } }}
                onChange={handleTaxValidChange}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="FC Valid"
                minDate={dayjs()}
                value={dayjs(vehicleCreation.fcValid, "DD/MM/YYYY")}
                format="DD/MM/YYYY"
                slotProps={{ textField: { variant: "outlined" } }}
                onChange={handleFCValidChange}
              />
            </LocalizationProvider>
            <Select
              style={{ width: "35%", height: "50px" }}
              onChange={handleVehicleModeChange}
              value={vehicleCreation.vehicleMode}
            >
              <MenuItem value="default" disabled>
                Vehicle Mode
              </MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Bus">Bus</MenuItem>
              <MenuItem value="Auto">Auto</MenuItem>
            </Select>
          </div>
          {props.isEdit && (
            <Box
              sx={{ display: "flex", gap: "10px", alignContent: "center", flexDirection: "row" }}
              className={styles.links}
            >
              {vehicleCreation?.attachments &&
                vehicleCreation?.attachments?.map((attachment: any, index: number) => (
                  <div className={styles.url} key={index}>
                    {attachment && attachment?.split?.("/")?.pop()?.length > 10
                      ? attachment?.split?.("/")?.pop()?.substring(0, 10) + "..."
                      : attachment?.split?.("/")?.pop()}
                    <a href={attachment} download>
                      <img src={FileDownloadIcon} />
                    </a>
                  </div>
                ))}
            </Box>
          )}
          <div className={styles.attachment}>
            <div>
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "blue",
                  gap: "5px",
                }}
                onChange={(e: any) => setFile(e.target.files?.[0] || null)}
                onClick={handleAddFile}
              >
                <input ref={fileInput} type="file" hidden />
                <AttachFileIcon /> {uploadingFileStatus}
              </button>
              <Box
                sx={{ display: "flex", gap: "10px", alignContent: "center" }}
                className={styles.links}
              >
                {attachments.map((attachment, index) => (
                  <div key={index} className={styles.url}>
                    {attachment.name}
                    <IconButton size="small" onClick={() => handleRemoveAttachment(index)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
              </Box>
            </div>
            <div>
              <span>Note : Add Vehicle Registration, Fitness and Tax Certificates</span>
            </div>
          </div>
          <div className={styles.action}>
            <button className={styles.cancel} onClick={handleClose}>
              Cancel
            </button>
            <button className={styles.save} onClick={props.isEdit ? handleEdit : handleSubmit}>
              {props.isEdit ? "Update Vehicle" : "Create Vehicle"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddVehicles;
