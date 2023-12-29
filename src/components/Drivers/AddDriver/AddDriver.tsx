import React, { useEffect, useRef, useState } from "react";
import styles from "./AddDriver.module.css";
import {
  Dialog,
  IconButton,
  Box,
  Paper,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  Chip,
  MenuItem,
  Alert,
  Stack,
} from "@mui/material";
import { AddOutlined, Close, CloseRounded } from "@mui/icons-material";
import api from "@/store/api";
import { DriverInfo } from "@/models/Transportation";
import group from "@/assests/search_hands_free.svg";
import Input from "@/Elements/Input/Input";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import FileDownloadIcon from "@/assests/download.svg";
import CloseIcon from "@mui/icons-material/Close";

interface Attachments {
  name: string;
  url: string;
}

const AddDriver = (props: any) => {
  let schoolId = localStorage.getItem("school_id") as string;

  const CreateDriverAPI = api((state) => state.createDriver);
  const UpdateDriverAPI = api((state) => state.updateDriver);
  const uploadAttachmentApi = api((state) => state.uploadFile);

  const handleClose = () => {
    props.setDialogEnabled(false);
  };

  const [attachments, setAttachments] = useState<Attachments[]>([]);
  const [viewAttachment, setViewAttachments] = useState<Attachments[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadingFileStatus, setUploadFileStatus] = useState("Add attachment");
  const fileInput = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [createDriver, setCreateDriver] = useState<DriverInfo>({
    name: "",
    contactNumber: null,
    emergencyNumber: null,
    drivingLicense: "",
    aadharNumber: null,
    bloodGroup: "default",
    address: "",
    schoolId: schoolId,
    attachments: [],
  });

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

      setCreateDriver({
        ...createDriver,
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

    const updatedVehicleAttachments = [...createDriver.attachments];
    updatedVehicleAttachments.splice(attachmentIndex, 1);
    setCreateDriver((prev) => ({
      ...prev,
      attachments: updatedVehicleAttachments,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateDriver({
      ...createDriver,
      name: e.target.value,
    });
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateDriver({
      ...createDriver,
      contactNumber: e.target.value as any,
    });
  };

  const handleEmergencyNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateDriver({
      ...createDriver,
      emergencyNumber: e.target.value as any,
    });
  };

  const handleDrivingLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateDriver({
      ...createDriver,
      drivingLicense: e.target.value,
    });
  };

  const handleAadharNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateDriver({
      ...createDriver,
      aadharNumber: e.target.value as any,
    });
  };

  const handleBloodGroupChange = (e: SelectChangeEvent<string>) => {
    setCreateDriver({
      ...createDriver,
      bloodGroup: e.target.value,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCreateDriver({
      ...createDriver,
      address: e.target.value,
    });
  };

  const validateData = () => {
    if (!createDriver?.name?.trim()) {
      return "driver name required !";
    }
    if (!createDriver?.contactNumber) {
      return "Contact Number required !";
    }
    if (!createDriver?.emergencyNumber) {
      return "Emergency Number required !";
    }
    if (!createDriver?.drivingLicense?.trim()) {
      return "Driving License required !";
    }
    if (!createDriver?.aadharNumber) {
      return "Aadhaar Number required !";
    }
    if (createDriver?.bloodGroup === "default") {
      return "Blood Group required !";
    }
    if (!createDriver?.address?.trim()) {
      return "Address required !";
    }
    if (!createDriver?.schoolId?.trim()) {
      return "schoolId required !";
    }
    if (!createDriver?.attachments[0]) {
      return "attachments required !";
    }
    return true;
  };

  const CreateDriver = async () => {
    try {
      const err = validateData();
      if (err !== true) {
        setErrorMsg(err);
        return;
      }
      await CreateDriverAPI(createDriver).then((response) => {
        if (response.status === 200) {
          setCreateDriver({
            ...createDriver,
            name: "",
            contactNumber: null,
            emergencyNumber: null,
            drivingLicense: "",
            aadharNumber: null,
            bloodGroup: "default",
            address: "",
            schoolId: schoolId,
            attachments: [],
          });
          handleClose();
          props.getDriverData();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateDriver = async () => {
    try {
      const err = validateData();
      if (err !== true) {
        setErrorMsg(err);
        return;
      }
      await UpdateDriverAPI(createDriver?._id || "", createDriver).then((response) => {
        if (response.status === 200) {
          setCreateDriver({
            ...createDriver,
            name: "",
            contactNumber: null,
            emergencyNumber: null,
            drivingLicense: "",
            aadharNumber: null,
            bloodGroup: "default",
            address: "",
            schoolId: schoolId,
            attachments: [],
          });
          props.setDialogEnabled(false);
          props.getDriverData();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.isEdit) {
      console.log(props.createDriver);
      setCreateDriver(props.createDriver);
      setViewAttachments(props.createDriver.attachments);
      console.log(attachments);
    }
  }, [props.isEdit, props.createDriver]);

  useEffect(() => {
    if (file) uploadAttachment();
  }, [file]);

  return (
    <>
      <Dialog open={true} onClose={handleClose} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>
              <img src={group} alt="driver" />
              {props.isEdit ? "Edit Driver" : "Create Driver"}
            </h1>
            <IconButton sx={{ p: "10px" }} onClick={() => props.setDialogEnabled(false)}>
              <Close />
            </IconButton>
          </div>
          <div className={styles.row}>
            <div className={styles.input}>
              <Input
                width="90%"
                placeholder="Driver Name"
                value={createDriver.name}
                onChange={handleNameChange}
              />
            </div>
            <div className={styles.input}>
              <Input
                type="number"
                width="90%"
                placeholder="Contact Number"
                value={createDriver.contactNumber}
                onChange={handleContactNumberChange}
              />
            </div>
            <div className={styles.input}>
              <Input
                type="number"
                width="90%"
                placeholder="Emergency Number"
                value={createDriver.emergencyNumber}
                onChange={handleEmergencyNumberChange}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.input}>
              <Input
                width="70%"
                placeholder="DL Number"
                value={createDriver.drivingLicense}
                onChange={handleDrivingLicenseChange}
              />
            </div>
            <div className={styles.input}>
              <Input
                type="number"
                width="70%"
                placeholder="Aadhaar"
                value={createDriver.aadharNumber}
                onChange={handleAadharNumberChange}
              />
            </div>
            <Select
              style={{ width: "40%", height: "50px" }}
              id="bloodGroup"
              value={createDriver.bloodGroup}
              onChange={handleBloodGroupChange}
            >
              <MenuItem value="default" disabled>
                Select Blood Group
              </MenuItem>
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <Paper className={styles.input_desc}>
              <TextareaAutosize
                data-testid="add-description"
                placeholder="Address"
                id="filled-hidden-label-small"
                className={styles.input_input_desc}
                value={createDriver.address}
                onChange={handleAddressChange}
              />
            </Paper>
          </div>
          {props.isEdit && (
            <Box
              sx={{ display: "flex", gap: "10px", alignContent: "center" }}
              className={styles.links}
            >
              {viewAttachment &&
                viewAttachment?.map((attachment: any, index) => (
                  <div className={styles.url} key={index}>
                    {attachment?.split("/").pop()}
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
              <span>Note : Add DL Document and Aadhaar Document</span>
            </div>
          </div>
          <Stack>{errorMsg && <Alert severity="error">{errorMsg}</Alert>}</Stack>
          <div className={styles.action}>
            <button className={styles.cancel}>Cancel</button>
            <button className={styles.save} onClick={props.isEdit ? UpdateDriver : CreateDriver}>
              {props.isEdit ? "Update Driver" : "Save Driver"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddDriver;
