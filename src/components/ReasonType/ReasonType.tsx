import { Dialog, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import styles from "./ReasonType.module.css";
import api from "@/store/api";
import { useEffect, useState } from "react";
import CreateReasonType from "../CreateReasonType/CreateReasonType";

const ReasonType = () => {
  // API's
  const getReasonsTypesAPI = api((state) => state.getReasonTypes);

  const [totalCount, setTotalCount] = useState(0);
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [rows, setRows] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [reasonType, setReasonType] = useState<any>({
    reason: "",
    id: "",
  });

  // table
  const columns: GridColDef[] = [
    { field: "reason", headerName: "Reason Type", width: 280 },
    {
      field: "edit",
      headerName: "",
      sortable: false,
      width: 100,
      align: "right",

      renderCell: () => (
        <IconButton
          data-testid="edit-btn"
          sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px" }}
        >
          <EditOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  // Pagination
  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize });
    getReasonTypes(localStorage.getItem("school_id") as string, data.page, data.pageSize);
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    getReasonTypes(
      localStorage.getItem("school_id") as string,
      paginationModel.page,
      paginationModel.pageSize
    );
  }, []);

  const getReasonTypes = (school_id: string, page: number, limit: number) => {
    getReasonsTypesAPI(school_id, page + 1, limit).then((response: any) => {
      console.log(response, "ressssss");

      if (response && response.data && response.data.data) {
        let data = response.data.data.reasons;
        data.map((item: any) => {
          item.id = item._id;
        });
        setRows(data);
        setTotalCount(response?.data?.data?.totalCount);
      }
    });
  };

  const EditReasonType = (data: any) => {
    setIsEdit(true);
    setReasonType({
      id: data?.row?._id,
      reason: data?.row?.reason,
      schoolId: localStorage.getItem("school_id") as string,
    });
    setDialogEnabled(true);
  };

  useEffect(() => {
    getReasonTypes(
      localStorage.getItem("school_id") as string,
      paginationModel.page,
      paginationModel.pageSize
    );
  }, []);

  useEffect(() => {
    if (!dialogEnabled) {
      getReasonTypes(
        localStorage.getItem("school_id") as string,
        paginationModel.page,
        paginationModel.pageSize
      );
    }
  }, [dialogEnabled]);
  return (
    <div className={styles.main_list}>
    <div className={styles.header_list}>
        <button
            onClick={() => {
                setDialogEnabled(true)
                setIsEdit(false)
            }}
        >Add New</button>
    </div>
    <div
        style={{ height: 425, background: 'white', padding: '20px', borderRadius: '10px' }}>
        <DataGrid
            sx={{ border: '0px' }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20, 50, 100].sort((a, b) => a - b)}
            onCellClick={EditReasonType}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={handlePageChange}
            rowCount={totalCount}

        />
    </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <CreateReasonType
          isEdit={isEdit}
          reasonType={reasonType}
          setDialogEnabled={setDialogEnabled}
        />
      </Dialog>
    </div>
  );
};

export default ReasonType;
