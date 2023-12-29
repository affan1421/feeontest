import style from "./DailyCloseCollection.module.css";
import InputCommon from "@/Elements/Input/Input";
import { Alert, Box, Chip, Dialog, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import api from "@/store/api";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const DailyCloseCollection = ({ setOpen }: { setOpen: any }) => {
  const schoolId = localStorage.getItem("school_id") as string;
  const role = localStorage.getItem("role_name") as string;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsMeta, setRowsMeta] = useState({ total: 0 });
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [rejectReason, setReajectReason] = useState({ reason: "", id: "", status: "" });
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadFileStatus, setUploadFileStatus] = useState("Add attachment");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const fileInput = useRef<HTMLInputElement>(null);
  const getDailyCloseCollectionApi = api((state) => state.getDailyCloseCollection);
  const uploadAttachmentApi = api((state) => state.uploadFile);
  const updateStatusApi = api((state) => state.setDailyCloseCollectionStatus);

  const getRowsData = async () => {
    const { data } = await getDailyCloseCollectionApi(
      schoolId,
      search,
      date,
      paginationModel.page + 1,
      paginationModel.pageSize
    );
    setRowsMeta((pre) => ({ ...pre, total: data.total }));
    setRows(data?.data?.map((e: any) => ({ ...e, id: e._id, date: new Date(e.date)?.toLocaleDateString("en-GB")})));
  };

  const uploadAttachment = async () => {
    setUploadFileStatus("Uploading Attachment...");
    try {
      if (file == null) throw "Attachment file is requred";
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await uploadAttachmentApi(formData);
      setAttachments((pre) => [...pre, data?.message]);
      setUploadFileStatus("Add another attachment");
    } catch (error) {
      setUploadFileStatus("Failed to upload retry ?");
      throw "Error while uploading file";
    } finally {
      setFile(null);
    }
  };

  const updateStatus = async (id: string, approve: boolean) => {
    if (!approve && attachments?.length == 0 && rejectReason.reason.trim()?.length == 0) {
      return setReajectReason((pre) => ({
        ...pre,
        status: "Attachment or reason is required to reject close collection",
      }));
    }
    await updateStatusApi(id, approve ? "APPROVED" : "REJECTED", rejectReason.reason, attachments);
    setRejectReasonModal(false);
    getRowsData();
  };

  const handleUpdateStatus = (id: string, approve: boolean) => {
    setReajectReason((pre) => ({ ...pre, id: id }));
    if (!approve) return setRejectReasonModal(true);
    updateStatus(id, approve);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 120,
      sortable: false,
      filterable: false,
    },
    {
      field: "bankName",
      headerName: "Bank name",
      width: 150,
      sortable: false,
    },
    {
      field: "cashAmount",
      headerName: "Amount",
      type: "number",
      width: 100,
      sortable: false,
    },
    {
      field: "expenseAmount",
      headerName: "Expense Amount",
      type: "number",
      width: 150,
      sortable: false,
    },
    {
      field: "date",
      headerName: "Date",
      type: "number",
      width: 150,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      width: 150,
      sortable: false,
      renderCell: (prop) => {
        return (
          <>
            {role == "management" && prop.value == "PENDING" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <button
                  onClick={() => handleUpdateStatus(prop.row.id, false)}
                  style={{
                    padding: 6,
                    backgroundColor: "transparent",
                    color: "black",
                    border: "1px solid gray",
                  }}
                >
                  <CloseIcon />
                </button>
                <button
                  onClick={() => handleUpdateStatus(prop.row.id, true)}
                  style={{
                    padding: 6,
                    backgroundColor: "transparent",
                    color: "black",
                    border: "1px solid gray",
                  }}
                >
                  <DoneIcon />
                </button>
              </Box>
            ) : (
              <Box
                sx={{ p: 1, px: 2, borderRadius: 1, boxSizing: "border-box" }}
                bgcolor="#FFD6AF"
                className={style?.[prop.value]}
              >
                {prop.value}
              </Box>
            )}
          </>
        );
      },
    },
  ];

  const handleAddFile = async () => {
    fileInput.current?.click();
  };

  useEffect(() => {
    setAttachments([]);
    setFile(null);
    if (!rejectReasonModal) setReajectReason({ id: "", reason: "", status: "" });
  }, [rejectReasonModal]);

  useEffect(() => {
    if (file) uploadAttachment();
  }, [file]);

  useEffect(() => {
    getRowsData();
  }, [search, date, paginationModel]);

  useEffect(() => {
    setReajectReason((pre) => ({ ...pre, status: "" }));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography component="h2" variant="h5" fontWeight="bold">
          Daily Close Collections
        </Typography>
        <CloseIcon onClick={() => setOpen(false)} sx={{ cursor: "pointer" }} />
      </Stack>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 2 }}>
        <InputCommon
          startAdornment={<SearchIcon sx={{ mr: 1 }} />}
          width=" "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Name, Amount..."
        />
        <TextField type="date"  value={date} onChange={(e) => setDate(e.target.value)} />
      </Box>
      <Box height="375px">
        <DataGrid
          disableColumnMenu
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          columns={columns}
          rows={rows}
          rowCount={rowsMeta.total}
        />
      </Box>
      <Dialog open={rejectReasonModal} onClose={() => setRejectReasonModal(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography component="h2" variant="h5" fontWeight="bold">
              Reject Close Collection
            </Typography>
            <CloseIcon onClick={() => setRejectReasonModal(false)} sx={{ cursor: "pointer" }} />
          </Stack>
          {rejectReason?.status && <Alert severity="error">{rejectReason.status}</Alert>}
          <InputCommon
            value={rejectReason.reason}
            onChange={(e) => setReajectReason((pre) => ({ ...pre, reason: e.target.value }))}
            multiline
            width=" "
            placeholder="Write a reason for rejecting"
          />
          <Stack direction="row" spacing={1} alignItems={"center"} flexWrap={"wrap"}>
            <button
              style={{
                backgroundColor: "transparent",
                color: "blue",
                gap: "5px",
              }}
              onClick={handleAddFile}
            >
              <AttachFileIcon /> {uploadFileStatus}
              <input hidden onChange={(e) => setFile(e.target.files?.[0] || null)} type="file" ref={fileInput} />
            </button>
            <Stack direction="row" spacing={1} flexWrap={"wrap"} ml={2}>
              {attachments?.map((attachment) => {
                const name = decodeURI(attachment?.split("/")?.pop() as string);
                return (
                  <Chip
                    label={name}
                    onDelete={() => setAttachments((pre) => pre?.filter((e) => e != attachment))}
                    variant="outlined"
                  />
                );
              })}
            </Stack>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <button
              onClick={() => setRejectReasonModal(false)}
              style={{ border: "1px solid gray", backgroundColor: "transparent", color: "black" }}
            >
              Close
            </button>
            <button onClick={() => updateStatus(rejectReason.id, false)}>Reject</button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DailyCloseCollection;
