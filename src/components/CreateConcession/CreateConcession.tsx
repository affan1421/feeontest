import {
  Dialog,
  InputBase,
  Paper,
  IconButton,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Typography,
  TableCell,
  Button,
  TextField,
  Modal,
  Tooltip,
} from "@mui/material";
import InputCommon from "@/Elements/Input/Input";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./CreateConcession.module.css";
import { useState, useEffect, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import api from "@/store/api";
import { StudentModel } from "@/models/Student";
import { Box } from "@mui/system";
import Input from "@/Elements/Input/Input";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CreateConcessionDataGrid from "../CreateConcessionDataGrid/CreateConcessionDataGrid";
import Selector from "@/Elements/Selector/Selector";

interface CreateReasonTypeProps {
  setDialogEnabled: (value: boolean) => void;
  setRefetch: any;
}

interface Class {
  _id: string;
  class_id: string;
  className: string;
}

const CreateConcession = (props: CreateReasonTypeProps) => {
  // const splitFeeTypes = () => {
  //   const typeWithEdit = concsessionFeeTypeSplits?.filter((e) => e.edited);
  //   let totalWithEdited = 0;
  //   let total = 0;
  //   concsessionFeeTypeSplits?.forEach((concession) => {
  //     if (concession.edited) totalWithEdited = totalWithEdited + Number(concession.value | 0);
  //     total = total + Number(concession.value | 0);
  //   });

  //   const totalSplittable = (totalConc - totalWithEdited) / (concsessionFeeTypeSplits?.length - typeWithEdit?.length);

  //   const newOutput = concsessionFeeTypeSplits?.map((e) => {
  //     if (totalConc < totalWithEdited) {
  //       e.value = totalConc / concsessionFeeTypeSplits?.length;
  //       return e;
  //     } else {
  //       if (!e.edited) {
  //         e.value = totalSplittable;
  //         return e;
  //       } else return e;
  //     }
  //   });

  //   setConcessionFeeTypeSplits(newOutput);
  // };

  // useEffect(() => {
  //   splitFeeTypes();
  // }, [concsessionFeeTypeSplits]);

  interface Splits {
    value: number;
    edited: boolean;
    id: string;
    name?: string;
  }

  interface Attachments {
    name: string;
    url: string;
  }

  const schoolId = localStorage.getItem("school_id") as string;
  const getClassesApi = api((state) => state.getClasses);
  const getAllReasonsApi = api((state) => state.getConcReason);
  const getStudentsApi = api((state) => state.getStudentsForConcession);
  const getFeeDetailsApi = api((state) => state.concsessionGetFeeDetails);
  const uploadAttachmentApi: any = api((state) => state.uploadFile);
  const createConcessionApi = api((state) => state.createConsesson);

  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("default");
  const [selectedStudent, setSelectedStudent] = useState("default");
  const [selectedReason, setSelectedReason] = useState("default");
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [reasons, setReasons] = useState<any[]>([]);
  const [feeDetails, setFeeDetails] = useState<any>();
  const [totalConc, setTotalConc] = useState<any>(0);
  const [feeinstallments, setFeeinstallments] = useState([]);

  const [selectedFeeCatgory, setSelectedFeeCategory] = useState("default");
  const [concsessionFeeTypeSplits, setConcessionFeeTypeSplits] = useState<Splits[]>([]);
  const [errorInFeeType, setErrorInFeeType] = useState(false);
  const [concessionObj, setConcessionObj] = useState<{ [key: string]: string | number }>({});
  const [comment, setComment] = useState("");

  const [uploadingFileStatus, setUploadFileStatus] = useState("Add attachment");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [attachments, setAttachments] = useState<Attachments[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleClose = () => props.setDialogEnabled(false);

  const setFeecategorieSelection: any = (categoryId: string, value: string) => {
    setConcessionFeeTypeSplits((pre: any) =>
      pre?.map((e: any) => (e.id == categoryId ? { ...e, value: value, edited: true } : e))
    );
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
      throw "Error in Attachment file upload";
    }
  };

  const handleRest = () => {
    try {
      setSelectedStudent("default");
      setConcessionFeeTypeSplits([]);
      setFeeDetails(null);
      setSelectedFeeCategory("default");
      setFeeinstallments([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    errorStatus && setShowErrorModal(true);
  }, [errorStatus]);

  useEffect(() => {
    (async () => {
      setClasses((await getClassesApi(schoolId))?.data?.data?.map((e: any) => ({ ...e, value: e?.sectionId })));
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setReasons(
        (await getAllReasonsApi(schoolId))?.data?.data?.reasons?.map((x: any) => ({ name: x.reason, value: x._id }))
      );
    })();
  }, []);

  useEffect(() => {
    selectedClass != "default"
      ? (async () => {
          setStudents(
            (await getStudentsApi(schoolId, selectedClass))?.data?.students?.map((e: any) => ({ ...e, value: e._id }))
          );
        })()
      : handleRest();
  }, [selectedClass]);

  useEffect(() => {
    selectedStudent != "default"
      ? (async () => {
          const data = (await getFeeDetailsApi(schoolId, selectedStudent))?.data?.data;
          setConcessionFeeTypeSplits(
            data?.feeData?.map((e: any) => ({ ...e.feecategories, id: e?.feecategories?._id }))
          );
          setFeeDetails(data);
          setSelectedFeeCategory(data?.feeData?.[0]?.feecategories?._id);
        })()
      : handleRest();
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedFeeCatgory !== "default") {
      const data = feeDetails?.feeData?.filter((e: any) => e?.feecategories?._id == selectedFeeCatgory)?.[0];
      setFeeinstallments(
        data?.feeinstallments?.feedetails?.map((e: any) => ({
          ...e,
          id: e?._id,
          feeType: e?.feeType?.name,
          feeSchedule: e?.feeSchedule?.name || "",
          total: Number(e?.totalAmount) - Number(e?.totalDiscountAmount),
        })) || []
      );
    }
  }, [selectedFeeCatgory, feeDetails]);

  useEffect(() => {
    const outObj: { [key: string]: number } = {};
    Object.keys(concessionObj)?.forEach((feeStructureId_categoryId) => {
      const categoryId = feeStructureId_categoryId?.split("_")?.[1];
      outObj[categoryId] = (Number(outObj?.[categoryId]) || 0) + Number(concessionObj[feeStructureId_categoryId]);
    });
    let total = 0;
    Object.keys(outObj).forEach((type) => {
      total = total + Number(outObj[type]);
      setFeecategorieSelection(type, outObj[type]);
    });
    setTotalConc(total);
  }, [concessionObj]);

  const handleAddFile = async () => {
    fileInput.current?.click();
  };

  useEffect(() => {
    if (file) uploadAttachment();
  }, [file]);

  const submitData = async () => {
    try {
      if (!selectedClass || selectedClass === "default") {
        throw "Please select a class";
      }
      if (!selectedStudent || selectedStudent === "default") {
        throw "Please select a student";
      }
      if (!selectedReason || selectedReason === "default") {
        throw "Please select a reason";
      }

      const newData: { feeInstallmentId: string; concessionAmount: number }[] = [];

      Object.keys(concessionObj).forEach((e) => {
        newData.push({
          feeInstallmentId: e?.split("_")?.[0],
          concessionAmount: Number(concessionObj?.[e]),
        });
      });

      if (newData?.length === 0) {
        throw "Concession Amount is not provided";
      }

      const data = {
        studentId: selectedStudent,
        schoolId,
        sectionId: selectedClass,
        feeCategoryIds: newData,
        totalConcession: totalConc,
        totalAmount: feeDetails?.totalAmount,
        paidAmount: feeDetails?.paidAmount,
        dueAmount: Number(feeDetails?.totalAmount) - Number(feeDetails?.paidAmount) || 0,
        discountAmount: feeDetails?.totalDiscountAmount,
        reason: selectedReason,
        comment: comment,
        attachments: attachments?.map((e) => e.url),
        totals: concsessionFeeTypeSplits?.map((e) => ({ value: e.value, id: e.id })),
      };

      const res = await createConcessionApi(data);
      if (res) {
        props.setDialogEnabled(false);
        props.setRefetch((prev: boolean) => !prev);
      }
    } catch (error) {
      console.log(error);
      setErrorStatus(typeof error == "string" ? error : "all fields are required !");
    }
  };

  return (
    <>
      <Modal
        open={showErrorModal}
        onClose={() => {
          setErrorStatus("");
          setShowErrorModal(false);
        }}
      >
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
      <Stack gap={2} p={4}>
        <Stack alignItems={"center"} justifyContent={"space-between"} direction={"row"}>
          <Typography variant="h5">Give concession</Typography>
          <Tooltip title={"Close"}>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack gap={3}>
          <Stack direction={"row"} gap={2} maxWidth={"600px"}>
            <Selector
              defaultValue="Select Class"
              onChange={(value) => setSelectedClass(value)}
              value={selectedClass}
              items={classes as any}
            />

            <Selector
              defaultValue="Select Students"
              onChange={(value) => setSelectedStudent(value)}
              value={selectedStudent}
              items={students || []}
              disabled={selectedClass === "default"}
            />

            <Selector
              defaultValue="Select Reason"
              onChange={(value) => setSelectedReason(value)}
              value={selectedReason}
              items={reasons || []}
            />
          </Stack>

          <Stack direction={"row"} gap={4}>
            <div>
              <Typography variant="h6">Total Fee Amount</Typography>
              <Typography fontWeight={"bold"}>₹{feeDetails?.totalAmount || 0}</Typography>
            </div>
            <div>
              <Typography variant="h6">Total Paid Amount</Typography>
              <Typography fontWeight={"bold"}>₹{feeDetails?.paidAmount || 0}</Typography>
            </div>
            <div>
              <Typography variant="h6">Total Due Amount</Typography>
              <Typography fontWeight={"bold"}>
                ₹{Number(feeDetails?.totalAmount) - Number(feeDetails?.paidAmount) || 0}
              </Typography>
            </div>
          </Stack>

          <RadioGroup row value={selectedFeeCatgory} onChange={(e) => setSelectedFeeCategory(e.target.value)}>
            <Stack gap={1} alignItems={"center"} direction={"row"} justifyContent={"space-between"}>
              <Box>
                <Typography pb={1} variant="h6">
                  Total Concession
                </Typography>
                <Input
                  disabled={true}
                  width=" "
                  placeholder="Enter amount"
                  type="number"
                  onChange={() => {}}
                  value={totalConc}
                  startAdornment={
                    <Box mr={1}>
                      <CurrencyRupeeIcon fontSize={"small"} />
                    </Box>
                  }
                />
              </Box>
              {concsessionFeeTypeSplits?.map((category) => {
                return (
                  <Box key={category?.id}>
                    <FormControlLabel
                      value={category?.id}
                      control={<Radio />}
                      label={<Typography variant="h6">{category?.name}</Typography>}
                    />
                    <Input
                      disabled={true}
                      error={errorInFeeType}
                      width=" "
                      type="number"
                      placeholder="Enter amount"
                      onChange={(e) => {}}
                      value={category.value}
                      startAdornment={
                        <Box mr={1}>
                          <CurrencyRupeeIcon fontSize={"small"} />
                        </Box>
                      }
                    />
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>
        </Stack>

        <CreateConcessionDataGrid
          rows={feeinstallments}
          dataInputValues={concessionObj}
          setDataInputValues={setConcessionObj}
        />

        <InputCommon
          width=" "
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          placeholder="enter any reason or comment"
        />

        <Stack direction="row" spacing={1} alignItems={"center"} flexWrap={"wrap"}>
          <Box>
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
              {attachments.map((attachment: any) => {
                return <div key={attachment.url}>{attachment.name}</div>;
              })}
            </Box>
          </Box>
          {/* <Button>
          <AttachFileIcon /> {uploadingFileStatus}
        </Button> */}
          {/* <input hidden onChange={(e) => setFile(e.target.files?.[0] || null)} type="file" ref={fileInput} /> */}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => submitData()}>
            Send for Approval
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default CreateConcession;
