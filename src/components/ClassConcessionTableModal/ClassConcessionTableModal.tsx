import styles from "./ClassConcessionTableModal.module.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Avatar, Button } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ClassConcessionTableModal = ({ tableData, totalCount, setDialogEnabled, setConcId, handleStatusUpdate, setRefetch, setPaginationModel, paginationModel }: any) => {
  const role = localStorage.getItem("role_name");

  let defaultAmount = 0;
  const Columns: GridColDef[] = [
    {
      field: "studentslist",
      headerName: "Student name",
      width: 200,
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
      width: 100,
      filterable: false,
      sortable: false,
    },
    {
      field: "totalAmount",
      headerName: "Total fees",
      width: 100,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.totalAmount || defaultAmount,
    },
    {
      field: "paidAmount",
      headerName: "Paid Amount",
      width: 100,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.paidAmount || defaultAmount,
    },
    {
      field: "pendingAmount",
      headerName: "Pending Fees",
      width: 150,
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => row.totalAmount - (row.paidAmount - row.discountAmount),
      valueGetter: (params: any) => params.row.pendingAmount || defaultAmount,
    },
    {
      field: "discountAmount",
      headerName: "Disc.Amount",
      width: 150,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.pendingAmount || defaultAmount,
    },
    {
      field: "concAmount",
      headerName: "Conc.Amount",
      width: 150,
      filterable: false,
      sortable: false,
      valueGetter: (params: any) => params.row.pendingAmount || defaultAmount,
    },
    {
      field: "status",
      headerName: "TC Status",
      width: 180,
      sortable: false,
      renderCell: (params: any) => (
        <button
          style={{
            backgroundColor:
              params.row.status === "APPROVED" ? "#E8F7ED" : params.row.status === "REJECTED" ? "#FFAFAF" : "",
          }}
          className={styles.status}
        >
          {params.row.status}
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 240,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div className={styles.actions}>
            {role === "management" && params.row.status === "PENDING" && (
              <>
                <Button onClick={()=> {
                  handleStatusUpdate("REJECTED", params.row.id)
                  setRefetch((prev:any) => !prev)
                }} variant="outlined" style={{ color: "#555555", borderColor: "#DBDBDB" }} size="small">
                  <CloseIcon />
                </Button>
                <Button onClick={()=> {
                  handleStatusUpdate("APPROVED", params.row.id)
                  setRefetch((prev:any) => !prev)
                  }} variant="outlined" style={{ color: "#555555", borderColor: "#DBDBDB" }} size="small">
                  <DoneIcon />
                </Button>
              </>
            )}
            <Button
              onClick={() => {
                setDialogEnabled(true);
                setConcId(params.row.id);
              }}
              variant="outlined"
              style={{ color: "#555555", borderColor: "#DBDBDB" }}
              size="small"
            >
              <VisibilityIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.table}>
        <div
          style={{
            background: "white",
            borderRadius: "10px",
          }}
        >
          <DataGrid rows={tableData} hideFooterPagination paginationModel={paginationModel} paginationMode="server" onPaginationModelChange={setPaginationModel} columns={Columns} rowCount={totalCount} />
        </div>
      </div>
    </div>
  );
};

export default ClassConcessionTableModal;
