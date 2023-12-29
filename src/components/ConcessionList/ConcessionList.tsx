import {
  Avatar,
  Box,
  Button,
  Dialog,
  FormControlLabel,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./ConcessionList.module.css";
import { useEffect, useState } from "react";
import { CloseRounded, VisibilityOutlined } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ConcessionDetails from "../ConcessionDetails/ConcessionDetails";
import ConcessionClassModal from "../ConcessionClassModal/ConcessionClassModal";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { studentType, classType } from "../../models/GiveConcessionTypes";
import api from "@/store/api";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const ConcessionList = ({ setRefetch, refetch }: any) => {
  const role = localStorage.getItem("role_name");
  const schoolId = localStorage.getItem("school_id");
  let defaultAmount = 0;

  const getConcessionData = api((state) => state.getConcessionData);
  const changeConcStatus = api((state) => state.changeConcStatus);
  const getClassConc = api((state) => state.getClassConc);
  const revokeConsessonApi = api((state) => state.revokeConsesson);

  const statusList = ["PENDING", "APPROVED", "REJECTED"];
  const [type, setType] = useState<string>("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("default");
  const [students, setStudents] = useState<studentType[]>([]);
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState<classType[]>([
    {
      id: "",
      className: "",
      totalStudents: 0,
      concessionStudents: 0,
      concessionAmount: 0,
    },
  ]);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [dialogEnabledforClass, setDialogEnabledforClass] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleRevoke = async (concId: string) => {
    try {
      await revokeConsessonApi(concId);
      setRefetch((prev: boolean) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusUpdate = async (status: string, concId: string) => {
    try {
      const data = await changeConcStatus(status, concId);
      if (data.data.success) {
        setRefetch((prev: boolean) => !prev);
        setStudents((prev) =>
          prev.map((x) => {
            if (x.id === data.data.data._id) {
              x.status = status;
            }
            return x;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllConcessions = async () => {
    try {
      const data = await getConcessionData(
        schoolId,
        status == "default" ? "" : status,
        searchTerm,
        paginationModel.page + 1,
        paginationModel.pageSize
      );
      setStudents(data?.data?.concessions);
      setTotalCount(data?.data?.totalDocuments);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllClassWiseConc = async () => {
    try {
      const data = await getClassConc(schoolId, searchTerm, paginationModel.page + 1, paginationModel.pageSize);
      setClasses(data.data.data);
      setTotalCount(data?.data?.resultCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (type === "students") {
      getAllConcessions();
    } else {
      getAllClassWiseConc();
    }
  }, [type, searchTerm, status, paginationModel, refetch]);

  const studentColumns: GridColDef[] = [
    {
      field: "studentName",
      headerName: "Student name",
      width: 270,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <Avatar sx={{ width: "24px", height: "24px" }} />
          &nbsp; &nbsp;
          {params.row.studentName}
        </>
      ),
    },
    {
      field: "className",
      headerName: "Class",
      width: 140,
      filterable: false,
      sortable: false,
    },
    {
      field: "fees",
      headerName: "Total Fees",
      width: 140,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.fees || defaultAmount,
    },
    {
      field: "paidAmount",
      headerName: "Paid Amount",
      width: 140,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.paidAmount || defaultAmount,
    },
    {
      field: "discountAmount",
      headerName: "Disc.Amount",
      width: 140,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.discountAmount || defaultAmount,
    },
    {
      field: "concessionAmount",
      headerName: "Conc.Amount",
      width: 140,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.concessionAmount || defaultAmount,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Tooltip placement="left-start" title={params?.row?.reason || ""}>
          <button
            style={{
              backgroundColor:
                params.row.status === "APPROVED" ? "#E8F7ED" : params.row.status === "REJECTED" ? "#FFAFAF" : "",
            }}
            className={styles.status}
          >
            {params.row.status}
          </button>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 300,
      sortable: false,
      renderCell: (params: any) => (
        <div className={styles.actions}>
          {role === "management" && (
            <Tooltip title={"Revoke"}>
              <Button
                variant="outlined"
                style={{ color: "#555555", borderColor: "#DBDBDB" }}
                size="small"
                onClick={() => handleRevoke(params.row.id)}
              >
                <RemoveCircleOutlineIcon />
              </Button>
            </Tooltip>
          )}
          {role === "management" && params.row.status === "PENDING" && (
            <>
              <Tooltip title={"Reject"}>
                <Button
                  variant="outlined"
                  style={{ color: "#555555", borderColor: "#DBDBDB" }}
                  size="small"
                  onClick={() => handleStatusUpdate("REJECTED", params.row.id)}
                >
                  <CloseIcon />
                </Button>
              </Tooltip>
              <Tooltip title={"Approve"}>
                <Button
                  variant="outlined"
                  style={{ color: "#555555", borderColor: "#DBDBDB" }}
                  size="small"
                  onClick={() => handleStatusUpdate("APPROVED", params.row.id)}
                >
                  <DoneIcon />
                </Button>
              </Tooltip>
            </>
          )}
          <Tooltip title={"View more"}>
            <Button
              variant="outlined"
              style={{ color: "#555555", borderColor: "#DBDBDB" }}
              size="small"
              onClick={() => {
                setStudentId(params.row.studentId);
                setDialogEnabled(true);
              }}
            >
              <VisibilityIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const classesColumns: GridColDef[] = [
    { field: "className", headerName: "Class Name", width: 170 },
    { field: "totalStudents", headerName: "No. Students", width: 170 },
    {
      field: "concessionStudents",
      headerName: "No. Concession Students",
      width: 270,
    },
    { field: "concessionAmount", headerName: "Conc.Amount", width: 170 },
    {
      field: "edit",
      headerName: "",
      sortable: false,
      width: 80,
      align: "right",
      renderCell: ({ row }: any) => (
        <Tooltip title={"View more"}>
          <Button
            variant="outlined"
            style={{ color: "#555555", borderColor: "#DBDBDB" }}
            size="small"
            onClick={() => {
              setClassId(row.id);
              setDialogEnabledforClass(true);
            }}
          >
            <VisibilityOutlined />
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <Paper className={styles.search}>
          <IconButton aria-label="menu">
            <SearchIcon />
          </IconButton>
          <InputBase
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ height: "100%" }}
            placeholder={"Search Students"}
            id="filled-hidden-label-small"
            size="small"
          />
        </Paper>
        <RadioGroup row value={type} onChange={(event) => setType(event.target.value)}>
          <FormControlLabel value="students" control={<Radio />} label="Students" />
          <FormControlLabel value="classes" control={<Radio />} label="Classes" />
        </RadioGroup>
        {type === "students" && (
          <div className={styles.select}>
            <Select
              className={styles.selector}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              endAdornment={
                status !== "default" && (
                  <IconButton size="small" onClick={() => setStatus("default")}>
                    <CloseRounded />
                  </IconButton>
                )
              }
              IconComponent={status == "default" ? undefined : () => null}
            >
              <MenuItem value="default">All Status</MenuItem>
              {statusList.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
      </div>

      <Box height={400}>
        <DataGrid
          sx={{ border: "0px" }}
          rows={type == "students" ? students : classes}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          columns={type == "students" ? studentColumns : classesColumns}
          rowCount={totalCount}
          paginationMode="server"
        />
      </Box>
      <Dialog open={dialogEnabled} onClose={() => setDialogEnabled(false)} maxWidth="md">
        <ConcessionDetails studentId={studentId} setDialogEnabled={setDialogEnabled} />
      </Dialog>
      <Dialog open={dialogEnabledforClass} onClose={() => setDialogEnabledforClass(false)} maxWidth="md">
        <ConcessionClassModal
          handleStatusUpdate={handleStatusUpdate}
          setConcId={setStudentId}
          setDialogEnabled={setDialogEnabled}
          classId={classId}
        />
      </Dialog>
    </div>
  );
};

export default ConcessionList;
