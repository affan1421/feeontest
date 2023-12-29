import { TableCell, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import styles from "./CreateConcessionDataGrid.module.css";
import { Box } from "@mui/system";

interface InputValues {
  [key: string]: string | number;
}

const CreateConcessionDataGrid = ({
  rows,
  dataInputValues,
  setDataInputValues,
}: {
  rows: any[];
  dataInputValues: InputValues;
  setDataInputValues: React.Dispatch<React.SetStateAction<InputValues>>;
}) => {
  const classesColumns: GridColDef[] = [
    { field: "feeType", headerName: "Fee Type", width: 140, sortable: false, filterable: false },
    {
      field: "feeSchedule",
      headerName: "Fee Schedule",
      width: 140,
      sortable: false,
      filterable: false,
    },
    { field: "totalAmount", headerName: "Amount", width: 100, sortable: false, filterable: false },
    {
      field: "totalDiscountAmount",
      headerName: "Discount",
      width: 100,
      sortable: false,
      filterable: false,
    },
    { field: "total", headerName: "Total", width: 80, sortable: false, filterable: false },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <TableCell>
          <span className={`${styles.status} ${params.row.status}`}>{params.row.status.toUpperCase()}</span>
        </TableCell>
      ),
    },
    {
      field: "concAmount",
      headerName: "Concession Amount",
      width: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <TableCell>
          <TextField
            type="number"
            placeholder="Amount"
            id="filled-hidden-label-small"
            size="small"
            value={dataInputValues?.[`${params.row._id}_${params.row.categoryId}`]}
            onChange={(e) => {
              let value = e.target.value;
              if (Number(params?.row?.total) < Number(e.target.value)) value = params?.row?.total;
              setDataInputValues((pre) => ({ ...pre, [`${params.row._id}_${params.row.categoryId}`]: value }));
            }}
            error={
              Number(dataInputValues?.[`${params.row._id}_${params.row.categoryId}`]) > Number(params?.row?.total) ||
              Number(dataInputValues?.[`${params.row._id}_${params.row.categoryId}`]) < 0
            }
          />
        </TableCell>
      ),
    },
  ];

  return (
    <Box mt={3} sx={{ height: 400 }}>
      <DataGrid
        disableColumnMenu
        hideFooterPagination
        rows={rows}
        columns={classesColumns}
        rowCount={1}
        rowHeight={54}
      />
    </Box>
  );
};

export default CreateConcessionDataGrid;
