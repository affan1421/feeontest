import {
  Button,
  Dialog,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
  TextField,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./leadtable.module.css";
import Selector from "@/Elements/Selector/Selector";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LeadTable({
  search,
  handleSearchChange,
  rows: rowsData,
  followUpModal,
  setflowUpModal,
  tab,
  handlePageChange,
  paginationModel,
  handleStatusChange,
}: any) {
  const [rowSelectorValue, setRowSelectorValue] = useState({});
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "studentName",
      headerName: "Students Name",
      flex: 1,
      renderCell: (rows: any) => {
        const firstTwoLetters = rows?.row?.studentName.slice(0, 2).toUpperCase();
        return (
          <Stack direction="row" alignItems="center">
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#3f51b5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Typography variant="subtitle1" color="white">
                {firstTwoLetters}
              </Typography>
            </div>
            {rows?.row?.studentName}
          </Stack>
        );
      },
    },
    {
      field: "parentName",
      headerName: `Parent's name`,
      flex: 1,
    },
    { field: "className", headerName: "Class", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
    },
    ...(rowsData.some((row: any) => row.status !== "ADMITTED")
      ? [
          {
            field: "status",
            headerName: "Status",
            sortable: false,
            width: 160,
            renderCell: ({ row }: any) => (
              <Selector
                hideClearButton
                value={(rowSelectorValue as any)?.[row?.id] || row?.status}
                items={[
                  { name: "LEAD", value: "LEAD" },
                  { name: "CANCELLED", value: "CANCELLED" },
                  { name: "REJECTED", value: "REJECTED" },
                  { name: "PENDING-FEES", value: "PENDING-FEES" },
                  { name: "FORM-ISSUED", value: "FORM-ISSUED" },
                ]}
                onChange={(e: any) => handleStatusChange(row?.applicationNo, e)}
                defaultValue="select"
              />
            ),
          },
        ]
      : []),
    {
      field: " ",
      headerName: "Action",
      sortable: false,
      width: 160,
      renderCell: (rows: any) => {
        let button;
        if (rows?.row?.status === "ADMITTED") {
          button = (
            <Button
              onClick={() => navigate(`/admission/add-student/${rows?.row?.applicationNo}?step=5`)}
              variant="outlined"
            >
              Preview
            </Button>
          );
        } else if (rows?.row?.status === "LEAD") {
          button = (
            <Button onClick={() => setflowUpModal(rows?.id)} variant="outlined">
              Follow-up
            </Button>
          );
        } else if (rows?.row?.status === "FORM-ISSUED") {
          button = (
            <Button
              onClick={() => {
                navigate(`/admission/add-student/${rows?.row?.applicationNo}?step=1`);
              }}
              variant="outlined"
            >
              Update profile
            </Button>
          );
        } else {
          button = null; // No buttons for REJECTED and CANCELLED status
        }
        return button;
      },
    },
  ];

  return (
    <Stack sx={{ height: 400, backgroundColor: "white", borderRadius: 3 }}>
      <Grid pb={2} container>
        <Grid item xs={5}>
          <Paper className={styles.search}>
            <IconButton aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder={`Search Student ${tab === "ALL" ? "" : tab}`}
              id="filled-hidden-label-small"
              value={search}
              size="small"
              className={styles.search_input}
              onChange={handleSearchChange}
            />
          </Paper>
        </Grid>
        <Grid item xs={5}></Grid>
      </Grid>
      <DataGrid
        rows={rowsData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePageChange}
        pageSizeOptions={[5, 10]}
      />
      <Dialog
        maxWidth={"sm"}
        onClose={() => setflowUpModal("")}
        fullWidth
        open={followUpModal ? true : false}
      >
        <Stack p={2} gap={1.5}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontSize={16} fontWeight={500}>
              Follow up message
            </Typography>
            <Close onClick={() => setflowUpModal("")} />
          </Stack>
          <hr />
          <TextField multiline rows={3} />
          <TextField />
          <Stack></Stack>
        </Stack>
      </Dialog>
    </Stack>
  );
}
