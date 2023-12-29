import { useEffect, useState } from "react";
import styles from "./AcademicYear.module.css";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import api from "../../store/api";
import Dialog from "@mui/material/Dialog";
import AddAcademicYear from "./AddAcademicYear/AddAcademicYear";

const AcademicYear = () => {
  const getYearAcademicInfoAPI = api((state) => state.getYearAcademicInfo);
  const updateAcademicInfoAPI = api((state) => state.updateAcademicInfo);
  const toggleAcademicInfoAPI = api((state) => state.toggleAcademicInfo);

  const [academicYears, setAcademicYears] = useState([]);
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "startend", headerName: "Start and End Date", width: 350 },
    {
      field: "edit",
      headerName: "Status",
      sortable: false,
      width: 350,
      align: "left",

      renderCell: (params) => (
        <>
          <Switch
            disabled={params.row.status}
            checked={params.row.status}
            onChange={() => {
              handleStatusChange(params);
            }}
          />
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [totalCount, setTotalCount] = useState(0);

  const [dialogEnabled, setDialogEnabled] = useState(false);

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize });
    getData(
      localStorage.getItem("school_id") as string,
      data.page,
      data.pageSize
    );
  };

  const getData = (schoolId: string, page: number, size: number) => {
    getYearAcademicInfoAPI(schoolId, page, size, false).then(
      (response: any) => {
        let data = response.data.data;
        data = data.map((item: any) => {
          return {
            item: item,
            id: item._id,
            name: item.name,
            status: item.isActive,
            startend: `${new Date(item.startDate).toLocaleDateString('en-GB')} - ${new Date(item.endDate).toLocaleDateString('en-GB')}`,
          };
        });
        setTotalCount(response?.data?.resultCount);
        setAcademicYears(data);
      }
    );
  };

  const handleStatusChange = (data: any) => {
    let id = data.row.id;
    let status = !data.row.status;
    toggleAcademicInfoAPI(id, status).then((response: any) => {
      if (response.status == 200) {
        getData(
          localStorage.getItem("school_id") as string,
          paginationModel.page,
          paginationModel.pageSize
        );
      }
    });
  };

  useEffect(() => {
    getData(
      localStorage.getItem("school_id") as string,
      paginationModel.page,
      paginationModel.pageSize
    );
  }, []);

  useEffect(() => {
    getData(
      localStorage.getItem("school_id") as string,
      paginationModel.page,
      paginationModel.pageSize
    );
  }, [dialogEnabled === false]);

  return (
    <div>
      <div className={styles.header}>
        <span>
          <b>Academic Year's</b>
        </span>
        <button
          data-testid="add-new"
          onClick={() => {
            setDialogEnabled(true);
          }}
        >
          Add New
        </button>
      </div>
      <div style={{ height: 400 }}>
        <DataGrid
          sx={{ border: "0px" }}
          rows={academicYears}
          columns={columns}
          pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={handlePageChange}
          rowCount={totalCount}
        />
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <AddAcademicYear
          setDialogEnabled={setDialogEnabled}
          dialogEnabled={dialogEnabled}
        />
      </Dialog>
    </div>
  );
};

export default AcademicYear;
