import React from "react";
import styles from "./Setup.module.css";
import AcademicYear from "../../components/AcademicYear/AcademicYear";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import MiscellaneousTypes from "@/components/MiscellaneousTypes/MiscellaneousTypes";
import ExpenseType from "@/components/ExpenseType/ExpenseType";
import ReasonType from "@/components/ReasonType/ReasonType";
import ConcessionReasonSetup from "@/components/ConcessionReasonSetup/ConcessionReasonSetup";
import ReceiptSetup from "@/components/ReceiptSetup/ReceiptSetup";
import Settings from "@/components/SetSettings/Settings";

const Setup = () => {
  const [value, setValue] = React.useState("academic-year");

  let roleName = localStorage.getItem("role_name") as string;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Setup Configuration</span>
      </div>
      <div className={styles.main}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Academic Year" value="academic-year" />
              <Tab label="Miscellaneous Types" value="misc" />
              <Tab label="Expense Type" value="expense-type" />
              {roleName === "management" && <Tab label="Finance" value="receipt-setup" />}
              {/* <Tab label="TC" value="tc-reason-type" />
                            <Tab label="Concession" value="concession-reason-type" /> */}
              <Tab label="Settings" value="settings" />
            </TabList>
          </Box>
          <TabPanel value="academic-year">
            <AcademicYear />
          </TabPanel>
          <TabPanel value="misc">
            <MiscellaneousTypes />
          </TabPanel>
          <TabPanel value="expense-type">
            <ExpenseType />
          </TabPanel>
          <TabPanel value="receipt-setup">
            <ReceiptSetup />
          </TabPanel>

          {/* <TabPanel value="tc-reason-type">
            <ReasonType />
          </TabPanel> */}
          {/* <TabPanel value="concession-reason-type">
            <ConcessionReasonSetup />
           </TabPanel> */}
          <TabPanel value="settings">
            <Settings />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default Setup;
