import { useEffect, useState } from "react";
import styles from "./DueList.module.css";
import Input from "@/Elements/Input/Input";
import {
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Dialog,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  Box,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { CloseRounded, Download, VisibilityOutlined } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "@/store/api";
import { ClassListAPI, ClassListExcel, DueAPIData, StudentListExcel } from "@/models/DueList";
import { writeFile, read } from "xlsx";
import { useNavigate } from "react-router-dom";
import ClassSummary, { Data } from "./ClassSummary/ClassSummary";
import MultipleSelectorChip from "@/Elements/MultipleSelectorChip/MultipleSelectorChip";
import { dateFormatter } from "@/helpers/dateFormatter";

interface FormValues {
  searchTerm: string;
  type: string;
  studentType: string;
}

interface Props {
  feeCategory: string;
  feeSchedule: string[];
  selectedTerms: string[];
}

const DueList = (props: Props) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const navigate = useNavigate();

  // API's
  const getStudentDueListAPI = api((state) => state.getStudentDueList);
  const getClassesDueListAPI = api((state) => state.getClassesDueList);
  const downloadStudentListExcelAPI = api((state) => state.downloadStudentListExcel);
  const downloadClassListExcelAPI = api((state) => state.downloadClassListExcel);

  // Data
  const studentTypes = [
    { name: "Full Paid", value: "FULL" },
    { name: "Partial Paid", value: "PARTIAL" },
    { name: "Not Paid", value: "NOT" },
  ];
  const [studentType, setStudentType] = useState<string[]>(["PARTIAL", "NOT"]);
  const [formValues, setFormValues] = useState<FormValues>({
    studentType: "default",
    type: "students",
  } as FormValues);

  // Data Grid
  const studentColumns: GridColDef[] = [
    { field: "studentName", headerName: "Name", width: 170 },
    { field: "parentName", headerName: "Parent Name", width: 170 },
    { field: "sectionName", headerName: "Class", width: 120 },
    {
      field: "totalNetAmount",
      headerName: "Net Amount",
      width: 130,
      valueGetter: (params) => `${formatter.format(params.value)}`,
    },
    {
      field: "paidAmount",
      headerName: "Paid Amount",
      width: 120,
      valueGetter: (params) => `${formatter.format(params.value)}`,
    },
    {
      field: "dueAmount",
      headerName: "Amount Due",
      width: 100,
      valueGetter: (params) => `${formatter.format(params.value)}`,
    },
    {
      field: "view",
      headerName: "",
      sortable: false,
      width: 80,
      align: "right",
      renderCell: (params) => (
        <IconButton sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px" }}>
          <VisibilityOutlined />
        </IconButton>
      ),
    },
  ];
  const classesColumns: GridColDef[] = [
    { field: "className", headerName: "Class Name", width: 170 },
    { field: "totalStudents", headerName: "Students", width: 170 },
    { field: "dueStudents", headerName: "Due Students", width: 140 },
    {
      field: "totalNetAmount",
      headerName: "Receivable",
      width: 120,
      valueGetter: (params) => `${formatter.format(params.value)}`,
    },
    {
      field: "totalPaidAmount",
      headerName: "Paid Amount",
      width: 120,
      valueGetter: (params) => `${formatter.format(params.value)}`,
    },
    {
      field: "totalDueAmount",
      headerName: "Amount due",
      width: 100,
      valueGetter: (params) => `${formatter.format(params.value)}`,
    },
    {
      field: "edit",
      headerName: "",
      sortable: false,
      width: 80,
      align: "right",
      renderCell: () => (
        <IconButton sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px" }}>
          <VisibilityOutlined />
        </IconButton>
      ),
    },
  ];

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [classesTotalCount, setClassesTotalCount] = useState(0);

  const [studentPaginationModel, setStudentPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [classesPaginationModel, setClassesPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [dialog, setDialog] = useState(false);
  const [section, setSection] = useState("");
  const [data, setData] = useState<Data>({} as Data);

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setFormValues({ ...formValues, searchTerm: searchValue });
    debouncedHandleSearch(searchValue);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      type: event.target.value as string,
    });
    if (event.target.value == "students") {
      getStudentDueList(
        studentPaginationModel.page,
        studentPaginationModel.pageSize,
        studentType,
        formValues.searchTerm
      );
    }
    if (event.target.value == "classes") {
      getClassesDueList(classesPaginationModel.page, classesPaginationModel.pageSize, formValues.searchTerm);
    }
  };

  const handlePageChange = (data: any) => {
    setStudentPaginationModel({ page: data.page, pageSize: data.pageSize });
    getStudentDueList(data.page, data.pageSize, studentType, formValues.searchTerm);
  };

  const handleClassesPageChange = (data: any) => {
    setClassesPaginationModel({ page: data.page, pageSize: data.pageSize });
    getClassesDueList(data.page, data.pageSize, formValues.searchTerm);
  };

  const debouncedHandleSearch = (searchValue: string) => {
    clearTimeout(debounceTimer!);
    const timer = setTimeout(() => {
      if (formValues.type == "students") {
        getStudentDueList(studentPaginationModel.page, studentPaginationModel.pageSize, studentType, searchValue);
      } else {
        getClassesDueList(classesPaginationModel.page, classesPaginationModel.pageSize, searchValue);
      }
    }, 500);
    setDebounceTimer(timer);
  };

  const getStudentDueList = (page: number, limit: number, studentType: string[], search: string) => {
    let data: DueAPIData = {
      scheduleDates: props.selectedTerms.map((date) => date),
      scheduleId: props.feeSchedule,
      page: page,
      limit: limit,
      searchTerm: search,
    };
    if (studentType && studentType.length > 0) {
      data.paymentStatus = studentType;
    }
    getStudentDueListAPI(data).then((response) => {
      try {
        if (response.status == 200) {
          let data = response.data.data;
          data = data.map((item: any) => {
            return {
              ...item,
              id: item._id,
            };
          });
          setTotalCount(response.data.resultCount);
          setStudents(data);
        }
      } catch (error) {
        setTotalCount(0);
        setStudents([]);
      }
    });
  };

  const getClassesDueList = (page: number, limit: number, seachTerm: string) => {
    let data: ClassListAPI = {
      page: page,
      limit: limit,
      scheduleDates: props.selectedTerms,
      scheduleId: props.feeSchedule,
      searchTerm: seachTerm,
    };
    getClassesDueListAPI(data).then((response) => {
      try {
        if (response.status == 200) {
          let data = response.data.data;
          data = data.map((item: any) => {
            return {
              ...item,
              id: item.sectionId,
            };
          });
          setClassesTotalCount(response.data.resultCount);
          setClasses(data);
        }
      } catch (error) {
        setClassesTotalCount(0);
        setClasses([]);
      }
    });
  };

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const exportData = (type: string, sectionId?: string) => {
    if (type === "classes") {
      let data: ClassListExcel = {
        scheduleDates: props.selectedTerms,
        scheduleId: props.feeSchedule,
      };
      downloadClassListExcelAPI(data).then((response: any) => {
        if (response && response.status === 200) {
          let data = response.data.data;
          const workbook = arrayBufferToWorkbook(data);
          let name = `Class DueList (${getMonthNames(props.selectedTerms)}).xlsx`;
          writeFile(workbook, name);
        }
      });
    } else {
      if (type === "students") {
        let data: StudentListExcel = {
          scheduleDates: props.selectedTerms,
          scheduleId: props.feeSchedule,
          paymentStatus: studentType.length > 0 ? studentType : undefined,
        };
        if (sectionId) {
          data.sectionId = sectionId;
        }
        downloadStudentListExcelAPI(data).then((response: any) => {
          if (response && response.status === 200) {
            let data = response.data.data;
            const workbook = arrayBufferToWorkbook(data);
            let name = `Student DueList (${getMonthNames(props.selectedTerms)}).xlsx`;
            writeFile(workbook, name);
          }
        });
      }
    }
  };

  const getMonthNames = (dates: string[]) => {
    return dates.map((date) => {
      return new Date(date).toLocaleString("default", { month: "long" });
    });
  };

  function arrayBufferToWorkbook(arrayBuffer: ArrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    const workbook = read(data, { type: "array" });
    return workbook;
  }

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleStudentTypeChange = (e: any) => {
    let selectedTypes = e.target.value;
    setStudentType(selectedTypes);
    getStudentDueList(
      studentPaginationModel.page,
      studentPaginationModel.pageSize,
      selectedTypes,
      formValues.searchTerm
    );
  };

  const labelSelector = (value: string) => {
    let label: string = studentTypes.filter((item) => item.value == value)[0].name as string;
    return <span style={{ fontSize: "12px" }}>{label}</span>;
  };

  useEffect(() => {
    if (formValues.type == "students") {
      getStudentDueList(
        studentPaginationModel.page,
        studentPaginationModel.pageSize,
        studentType,
        formValues.searchTerm
      );
    }
    if (formValues.type == "classes") {
      getClassesDueList(classesPaginationModel.page, classesPaginationModel.pageSize, formValues.searchTerm);
    }
  }, [props.feeCategory, props.feeSchedule, props.selectedTerms]);

  useEffect(() => {
    if (formValues.type == "students") {
      getStudentDueList(
        studentPaginationModel.page,
        studentPaginationModel.pageSize,
        studentType,
        formValues.searchTerm
      );
    }
    if (formValues.type == "classes") {
      getClassesDueList(classesPaginationModel.page, classesPaginationModel.pageSize, formValues.searchTerm);
    }
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.filters}>
        <div className={styles.left}>
          <div className={styles.search}>
            <Input
              width="90%"
              value={formValues.searchTerm}
              placeholder={formValues.type == "students" ? "Student Name" : "Class Name"}
              onChange={handleSearchChange}
              type="text"
            />
          </div>
          <RadioGroup row value={formValues.type} onChange={handleTypeChange}>
            <FormControlLabel
              value="students"
              // disabled={props.selectedTerms.length == 0}
              control={<Radio />}
              label="Students"
            />
            <FormControlLabel
              value="classes"
              // disabled={props.selectedTerms.length == 0}
              control={<Radio />}
              label="Classes"
            />
          </RadioGroup>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel>Select Type</InputLabel>
              <Select
                className={styles.selector}
                input={<OutlinedInput label="Select Type" />}
                multiple
                value={studentType}
                onChange={handleStudentTypeChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={labelSelector(value)} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {studentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Checkbox checked={studentType.includes(type.value)} />
                    <ListItemText primary={type.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div></div>
        </div>
        <div className={styles.downloadBtn}>
          <button
            disabled={props.selectedTerms.length == 0}
            onClick={() => {
              exportData(formValues.type);
            }}
          >
            <Download />
          </button>
        </div>
      </div>
      <div className={styles.table}>
        {formValues.type == "students" ? (
          <div style={{ height: 425, background: "white", padding: "20px", borderRadius: "10px" }}>
            {
              <DataGrid
                sx={{ border: "0px" }}
                rows={students}
                columns={studentColumns}
                pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => {
                  return a - b;
                })}
                paginationModel={studentPaginationModel}
                paginationMode="server"
                onPaginationModelChange={handlePageChange}
                rowCount={totalCount}
                onCellClick={(params) => {
                  navigate(`/pay/${params.row._id}/true`);
                }}
              />
            }
          </div>
        ) : (
          <div style={{ height: 425, background: "white", padding: "20px", borderRadius: "10px" }}>
            {
              <DataGrid
                onCellClick={(params) => {
                  setData(params.row);
                  setSection(params.row.sectionId);
                  setDialog(true);
                }}
                sx={{ border: "0px" }}
                rows={classes}
                columns={classesColumns}
                pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => {
                  return a - b;
                })}
                paginationModel={classesPaginationModel}
                paginationMode="server"
                onPaginationModelChange={handleClassesPageChange}
                rowCount={classesTotalCount}
              />
            }
          </div>
        )}
      </div>
      <Dialog open={dialog} maxWidth="xl" onClose={handleCloseDialog}>
        <ClassSummary
          scheduleDates={props.selectedTerms}
          scheduleId={props.feeSchedule}
          sectionId={section}
          data={data}
          exportData={exportData}
        />
      </Dialog>
    </div>
  );
};

export default DueList;