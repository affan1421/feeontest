import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Dialog, Stack, Tab } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import LeadTable from "../LeadTable/LeadTable";
import { useEffect, useState } from "react";
import AddLeadModal from "../AddLead/AddLeadModal";
import api from "@/store/api";

export default function AdmissionList() {
  const [value, setValue] = useSearchParams();
  const [search, setSearch] = useState("");
  const [addLeadModal, setAddLeadModal] = useState(false);
  const [followUpModal, setflowUpModal] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 5 });

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(
      (prev: any) => {
        prev.set("tab", newValue);
        return prev;
      },
      { replace: true }
    );
  };

  const getAdmissionStudentsApi = api((state) => state.getAdmissionStudents);
  const getCardDataApi = api((state) => state.getCardData);
  const updateStatusApi = api((state) => state.updateStatus);

  const handleSearchChange = (e: any) => setSearch(e?.target?.value);
  const handleModalClose = () => setAddLeadModal(false);
  const handleModalOpen = () => setAddLeadModal(true);

  const fecthData = async () => {
    console.log("calll");
    const response = await getAdmissionStudentsApi(
      value.get("tab") === "ALL" ? "" : value.get("tab"),
      search,
      paginationModel?.page,
      paginationModel?.pageSize
    );
    console.log("response", response);
    setRows(
      response?.data?.data?.map((x: any) => {
        return {
          studentName: x?.studentName,
          parentName: x?.parentName,
          className: x?.className,
          createdAt: x?.createdAt,
          applicationNo: x?.applicationNo,
          id: x?._id,
          status: x?.status,
        };
      }) || []
    );
  };

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize });
  };

  const handleStatusChange = async (id: any, status: string) => {
    const data = await updateStatusApi(status, id);
    fecthData();
  };

  useEffect(() => {
    fecthData();
  }, [value, search, paginationModel]);

  return (
    <Stack sx={{ backgroundColor: "white", p: 3, borderRadius: 3 }} gap={3}>
      <TabContext value={value.get("tab") || "ALL"}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Stack direction={"row"} pr={3} justifyContent={"space-between"}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="ALL" value="ALL" />
              <Tab label="LEADS" value="LEAD" />
              <Tab label="FORM-ISSUED" value="FORM-ISSUED" />
              <Tab label="ADMITTED" value="ADMITTED" />
              <Tab label="REJECTED" value="REJECTED" />
              <Tab label="CANCELLED" value="CANCELLED" />
            </TabList>
            <Button onClick={handleModalOpen} sx={{ height: "35px" }} size="small" variant="contained">
              Add lead
            </Button>
          </Stack>
        </Box>
        <TabPanel sx={{ padding: 0 }} value="ALL">
          <LeadTable
            followUpModal={followUpModal}
            setflowUpModal={setflowUpModal}
            rows={rows}
            search={search}
            tab={value.get("tab")}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            handleStatusChange={handleStatusChange}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="LEAD">
          <LeadTable
            followUpModal={followUpModal}
            setflowUpModal={setflowUpModal}
            rows={rows}
            search={search}
            tab={value.get("tab")}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            handleStatusChange={handleStatusChange}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="FORM-ISSUED">
          <LeadTable
            followUpModal={followUpModal}
            setflowUpModal={setflowUpModal}
            rows={rows}
            search={search}
            tab={value.get("tab")}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            handleStatusChange={handleStatusChange}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="ADMITTED">
          <LeadTable
            followUpModal={followUpModal}
            setflowUpModal={setflowUpModal}
            rows={rows}
            search={search}
            tab={value.get("tab")}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            handleStatusChange={handleStatusChange}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="REJECTED">
          <LeadTable
            followUpModal={followUpModal}
            setflowUpModal={setflowUpModal}
            rows={rows}
            search={search}
            tab={value.get("tab")}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            handleStatusChange={handleStatusChange}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="CANCELLED">
          <LeadTable
            followUpModal={followUpModal}
            setflowUpModal={setflowUpModal}
            rows={rows}
            search={search}
            tab={value.get("tab")}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            paginationModel={paginationModel}
            handleStatusChange={handleStatusChange}
          />
        </TabPanel>
      </TabContext>
      <Dialog maxWidth={"sm"} fullWidth open={addLeadModal} onClose={handleModalClose}>
        <AddLeadModal handleModalClose={handleModalClose} />
      </Dialog>
    </Stack>
  );
}
