import { useEffect, useRef, useState } from "react";
import styles from "./GenerateTcModal.module.css";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Box,
  Divider,
  FormControlLabel,
  InputAdornment,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Input from "@/Elements/Input/Input";
import Selector from "@/Elements/Selector/Selector";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import api from "@/store/api";

interface SelectListItem {
  class_id: string;
  sectionId: string;
  name: string;
  sequence_number: number;
  value: string;
}

interface Attachments {
  name: string;
  url: string;
}

export const GenerateTcModal = ({
  open,
  setOpen,
  setRefetch,
}: {
  open: boolean;
  setOpen: any;
  setRefetch: any;
}) => {
  const schoolId = localStorage.getItem("school_id") as string;
  const [tcType, setTcType] = useState("ALUMINI-TC");
  const [reasonType, setReasonType] = useState("default");
  const [newInstituteName, setNewInstituteName] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [uploadingFileStatus, setUploadFileStatus] = useState("Add attachment");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [message, setMessage] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [classesList, setClassesList] = useState<SelectListItem[]>([]);
  const [classValue, setClassValue] = useState("default");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attachments, setAttachments] = useState<Attachments[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [reasonSelectorList, setReasonSelectorList] = useState<{ name: string; value: string }[]>(
    []
  );
  const [studentTableRows, setStudentTableRows] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 8,
  });
  const fileInput = useRef<HTMLInputElement>(null);
  const studentsListApi = api((state) => state.searchStudentsList);
  const classListApi = api((state) => state.getClasses);
  const generateTcApi = api((state) => state.generateTc);
  const uploadAttachmentApi = api((state) => state.uploadFile);
  const getReaonsApi = api((state) => state.getTcReasonsForGenerateTc);
  const navigate = useNavigate();

  const resetCurrentValues = () => {
    setTcType("ALUMINI-TC");
    setReasonType("default");
    setClassValue("default");
    setUploadFileStatus("Add attachment");
    setShowErrorModal(false);
    setSearchInputValue("");
    setErrorStatus("");
    setMessage("");
    setFile(null);
    setPaginationModel({ page: 0, pageSize: 8 });
    setOpen(false);
  };

  const getClassList = async (school_id: string) => {
    const { data } = await classListApi(school_id);
    setClassesList(
      data?.data?.map((classData: any) => ({
        ...classData,
        value: `${classData.class_id}_${classData.name}`,
      }))
    );
  };

  const getStudentListFromSearch = async () => {
    setSelectedStudent("-1");
    const { data } = await studentsListApi(
      schoolId,
      searchInputValue,
      Number(paginationModel.page) + 1,
      paginationModel.pageSize,
      classValue
    );
    const newData = data?.data?.map((pre: any) => ({
      ...pre,
      id: `${pre._id}_${pre.classId}`,
      totalFees: Number(pre?.fees?.totalAmount || 0),
      paidFees: Number(pre?.fees?.paidAmount || 0),
      pendingFees: Number(pre?.fees?.totalAmount || 0) - Number(pre?.fees?.paidAmount || 0),
    }));
    setStudentTableRows(newData);
  };

  const tcTypes = [
    { value: "ALUMINI-TC", title: "Alumini TC" },
    { value: "AVAIL-TC", title: "Avail TC" },
    // { value: "BLOCKED", title: "Block Student" },
  ];

  const handleClick = (id: any) => {
    navigate(`/studentReport/${id}`);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Student name",
      width: 260,
      sortable: false,
      filterable: false,
    },
    { field: "className", headerName: "Class", width: 90, sortable: false },
    {
      field: "totalFees",
      headerName: "Total fees",
      type: "number",
      width: 120,
      sortable: false,
    },
    {
      field: "paidFees",
      headerName: "Paid fees",
      type: "number",
      width: 120,
      sortable: false,
    },
    {
      field: "pendingFees",
      headerName: "Pending fees",
      type: "number",
      width: 120,
      sortable: false,
    },
    {
      field: "open",
      headerName: "-",
      width: 70,
      sortable: false,
      renderCell: (params: any) => {
        const studentId = params.row._id;

        return (
          <button
            style={{ backgroundColor: "transparent", color: "black" }}
            onClick={() => {
              handleClick(studentId);
            }}
          >
            <RemoveRedEyeIcon />
          </button>
        );
      },
    },
  ];

  useEffect(() => {
    getClassList(schoolId);
  }, []);

  useEffect(() => {
    getStudentListFromSearch();
  }, [searchInputValue, classValue, paginationModel]);

  useEffect(() => {
    (async () => {
      const { data } = await getReaonsApi(schoolId);
      setReasonSelectorList(
        data?.data?.reasons?.map((e: any) => ({ value: e._id, name: e.reason }))
      );
    })();
  }, []);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudent(selectedStudent == studentId ? "-1" : studentId);
  };

  const uploadAttachment = async (): Promise<string> => {
    setUploadFileStatus("Uploading Attachment...");
    try {
      if (file == null) throw "Attachment file is requred";
      const formData = new FormData();
      formData.append("file", file);
      const {
        data: { message },
      } = await uploadAttachmentApi(formData);
      setAttachments((pre) => [...pre, { name: file.name, url: message }]);
      setUploadFileStatus("Add another attachment");
      return message;
    } catch (error) {
      setUploadFileStatus("Failed to upload retry ?");
      throw "Error while uploading file";
    }
  };

  const sendApprovalHandler = async () => {
    setShowErrorModal(false);
    setErrorStatus("");
    try {
      if (reasonType == "default") throw "Please select reason to generate TC";
      if (selectedStudent == "-1") throw "Please select a student to generate TC";

      const data = {
        transferringSchool: newInstituteName,
        comment: message,
        reason: reasonType,
        studentId: selectedStudent?.split("_")[0],
        tcType: tcType,
        classId: selectedStudent?.split("_")[1],
        attachments: undefined,
        schoolId: schoolId,
      };

      if (tcType == "AVAIL-TC") data.attachments = attachments.map((e) => e.url) as any;

      const response = await generateTcApi(data);
      if (response?.data?.success) setRefetch(3);
      if (response?.data?.success) resetCurrentValues();
      //
    } catch (error) {
      setShowErrorModal(true);
      console.log(error);
      setErrorStatus(typeof error == "string" ? error : "");
    }
  };

  const handleAddFile = async () => {
    fileInput.current?.click();
  };

  useEffect(() => {
    if (file) uploadAttachment();
  }, [file]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-add-tc"
      aria-describedby="add-tc-for-student"
      className={styles.modalThing}
    >
      <Box className={styles.modal_box}>
        <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)}>
          <div
            className={styles.modal_box}
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "15px",
            }}
          >
            {errorStatus}
          </div>
        </Modal>
        <Typography id="modal-add-tc" variant="h6" component="h2">
          Generate TC
        </Typography>
        <RadioGroup
          sx={{ my: 1 }}
          row
          value={tcType}
          aria-labelledby="Tc-type"
          name="Tc-type"
          onChange={(e) => setTcType(e.target.value)}
        >
          {tcTypes.map((tcType) => {
            return (
              <FormControlLabel
                key={tcType.value}
                value={tcType.value}
                control={<Radio />}
                label={tcType.title}
              />
            );
          })}
        </RadioGroup>
        <Divider />
        <Box my={2} sx={{ display: "flex" }}>
          <Selector
            onChange={(e) => setReasonType(e)}
            value={reasonType}
            defaultValue="Select reason type"
            items={reasonSelectorList}
          />
        </Box>
        <Input
          value={newInstituteName}
          onChange={(e) => setNewInstituteName(e.target.value)}
          width=" "
          placeholder="Enter the name of the School/Collage/Institue the student is transfering to"
        />
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          width=" "
          placeholder="Enter the reason or comment"
        />

        {/* TC Table */}

        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Input
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Search Students"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              width=" "
            />
            <Selector
              value={classValue}
              onChange={(e) => setClassValue(e)}
              defaultValue="All Classes"
              items={classesList}
              enableDefault
            />
          </Box>

          <Box sx={{ height: 350 }}>
            <DataGrid
              disableColumnMenu
              rows={studentTableRows}
              columns={columns}
              paginationModel={paginationModel}
              paginationMode="server"
              sortingMode="server"
              pageSizeOptions={[5]}
              rowSelectionModel={selectedStudent}
              checkboxSelection
              onPaginationModelChange={setPaginationModel}
              rowCount={studentTableRows?.[0]?.totalDocs || 0}
              onCellClick={(e) => handleSelectStudent(`${e.id}`)}
            />
          </Box>
        </Box>

        {/* TC Table end */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
          }}
        >
          <Box>
            {tcType == "AVAIL-TC" && (
              <>
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
                <Box sx={{ display: "flex", gap: "10px", alignContent: "center" }}>
                  {attachments.map((attachment) => {
                    return <div key={attachment.url}>{attachment.name}</div>;
                  })}
                </Box>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
              paddingX: "10px",
            }}
          >
            {/* <button style={{ backgroundColor: "#E6EDFE", color: "black" }}>
              Preview TC
            </button> */}
            <button onClick={sendApprovalHandler}>Send to approval</button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
