import { InputBase, Paper, IconButton, Stack, Divider, Chip, TableCell, Input } from "@mui/material";
import InputCommon from "@/Elements/Input/Input";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ConcessionDetails.module.css";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import api from "@/store/api";

interface CreateReasonTypeProps {
  setDialogEnabled: (value: boolean) => void;
  studentId: string;
}

const classesColumns: GridColDef[] = [
  { field: "feeType", headerName: "Fee Type", width: 170 },
  {
    field: "feeSchedule",
    headerName: "Fee Schedule",
    width: 170,
  },
  { field: "amount", headerName: "Amount", width: 200, renderCell: ({ row }: any) => <>₹ {row.amount}</> },
  {
    field: "discAmount",
    headerName: "Discount",
    width: 200,
    renderCell: ({ row }: any) => <>{row.discountAmount}</>,
  },
  { field: "total", headerName: "Total", renderCell: ({ row }: any) => <>₹ {row.total}</>, width: 120 },
  { field: "paid", headerName: "Paid", renderCell: ({ row }: any) => <>₹ {row.paid}</>, width: 120 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => (
      <TableCell className={styles.t_body}>
        <span
          className={`${styles.status} ${
            params.row.status === "Paid"
              ? `${styles.paid}`
              : params.row.status === "Due"
              ? `${styles.due}`
              : params.row.alreadyPaidAmount === 0
              ? `${styles.upcoming}`
              : `${styles.partial}`
          }`}
        >
          {params?.row?.status?.toUpperCase()}
        </span>
      </TableCell>
    ),
  },
  {
    field: "concAmount",
    headerName: "Concession Amount",
    width: 170,
    renderCell: (params) => (
        <Paper className={styles.input}>
          <InputBase
            type="number"
            disabled={true}
            placeholder="Amount"
            id="filled-hidden-label-small"
            size="small"
            className={styles.input_input}
            value={params.row.concAmount}
          />
        </Paper>
    ),
  },
];

const ConcessionDetails = ({ setDialogEnabled, studentId }: CreateReasonTypeProps) => {
  const getStdConcDetials = api((state) => state.getStdConcDetials);
  const schoolId = localStorage.getItem("school_id");
  const [classesTotalCount, setClassesTotalCount] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [stdDetails, setStdDetails] = useState({ studentName: "", className: "" });
  const [dueDetails, setDueDetails] = useState({
    totalDue: 0,
    totalConc: 0,
    fees: [
      { feeCata: "Academic Fee", due: 0, conc: 0 },
      { feeCata: "Transport Fee", due: 0, conc: 0 },
    ],
  });

  const [feeDetials, setFeeDetials] = useState<any>([
    {
      id: 0,
      feeType: "",
      feeSchedule: "",
      amount: 0,
      discountAmount: 0,
      total: 0,
      paid: 0,
      status: "",
      concAmount: 0,
    },
  ]);
  const handleClose = () => {
    setDialogEnabled(false);
  };


  const fetchData = async () => {
    try {
      const { data } = await getStdConcDetials(schoolId, studentId);
      console.log(data,8989)
      setAttachments(data.attachments || [])
      setStdDetails({ studentName: data.studentName, className: data.className });
      setReason(data?.reason as string || '')
      setComment(data?.comment as string || '')
      setFeeDetials(
        data.feeInsta.map((x: any) => ({
          id: x?.feeType?._id,
          feeType: x?.feeType?.name,
          status: x.status,
          feeSchedule: x?.feeSchedules,
          amount: x?.totalAmount,
          discountAmount: x?.totalDiscountAmount,
          paid: x?.paidAmount,
          concAmount: x?.concessionAmount,
          total: x?.totalAmount - x?.totalDiscountAmount,
        }))
      );
      setDueDetails({
        ...dueDetails,
        totalDue: data.dueAmount,
        totalConc: data.concessionAmount,
        fees: data.totals.map((x: any) => ({ feeCata: x?.name, conc: x?.totalConcessionAmount || 0, due: x?.totalAmount - x.totalPaidAmount || 0 })),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Concession Details</span>
      <IconButton
        aria-label="close"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
        </div>
        <div className={styles.stdDetails}>
          <div>
            <p>Student Name</p>
            <span>{stdDetails.studentName}</span>
          </div>
          <div>
            <p>Class</p>
            <span>{stdDetails.className}</span>
          </div>
          <div>
            <p>Reason</p>
            <span>{reason}</span>
          </div>
          <div>
            <p>Due Details</p>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.row}>
            <div>
              <div className={styles.dues}>
                <div className={styles.dueDetails}>
                  <p>Total Due amount</p>
                  <span>₹{dueDetails.totalDue}</span>
                </div>
                {dueDetails.fees.map((x, i) => {
                  return (
                    <div key={i} className={styles.dueDetails}>
                      <p>{x.feeCata} Due</p>
                      <span>₹{x.due}</span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.divider}>
                <Divider />
              </div>

              <div className={styles.concType}>
                {/* <RadioGroup row value={selectedValue} onChange={handleRadioChange}> */}
                <div className={styles.radioGroupContainer}>
                  <div className={styles.radioGap}>
                    <div>
                      <span>Total Concession</span>
                      <Paper className={styles.input}>
                        <InputBase disabled size="small" className={styles.input_input} value={dueDetails.totalConc} />
                      </Paper>
                    </div>
                    {dueDetails.fees.map((x, i) => {
                      return (
                        <div key={i}>
                          {/* <FormControlLabel value="academicFeeConc" control={<Radio />} label="Academic Fee Conc." /> */}
                          <span>{x?.feeCata} Fee Conc</span>
                          <Paper className={styles.input}>
                            <InputBase disabled size="small" className={styles.input_input} value={x.conc} />
                          </Paper>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* </RadioGroup> */}
              </div>
            </div>
          </div>
        </div>

        <DataGrid rows={feeDetials} columns={classesColumns} hideFooterPagination rowCount={classesTotalCount} />

        <div>
          {comment && <InputCommon  value={comment} onChange={()=>{}} />}
          <Stack direction="row" spacing={1} flexWrap={"wrap"}>
            {attachments.length > 0 &&
              attachments?.map((attachment:string) => {
                const name = decodeURI(attachment?.split("/")?.pop() as string);
                return (
                  <a download={true} href={attachment}>
                    <Chip label={name} deleteIcon={<DownloadIcon />} onDelete={() => {}} variant="outlined" />
                  </a>
                );
              })}
          </Stack>
          <Stack direction="row" spacing={1} alignItems={"center"} flexWrap={"wrap"}></Stack>
          <div className={styles.action}>
            <button className={styles.cancel} onClick={handleClose}>
              Cancel
            </button>
            {/* <div className={styles.btn}>
              <button>Reject</button>
              <button>Approve</button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConcessionDetails;
