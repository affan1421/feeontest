import { Box, Stack, Switch, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import styles from "./FinanceSetup.module.css";
import api from "@/store/api";

const FinanceSetup = () => {
  const updateEditStatusApi = api((state) => state.updateEditStatus);
  const [allowEditOnCloseCollectionAmounts, setAllowEditOnCloseCollectionAmounts] = useState(
    localStorage.getItem("collection_editable") == "true"
  );

  const handleAllowChange = (e: ChangeEvent<any>) => {
    setAllowEditOnCloseCollectionAmounts(e.target.checked);
    localStorage.setItem("collection_editable", e.target.checked ? "true" : "false");
    (async () => {
      await updateEditStatusApi(localStorage.getItem("school_id"), e.target.checked);
    })();
  };

  return (
    <Box>
      <Stack gap={1}>
        <span className={styles.header}>Close collection</span>
        <Typography variant="subtitle1">
          Enabling the switch below will allow the admin to edit both expense and deposit amount{" "}
        </Typography>
        <Switch checked={allowEditOnCloseCollectionAmounts} onChange={(e) => handleAllowChange(e)} />
      </Stack>
    </Box>
  );
};

export default FinanceSetup;
