import React, { useState } from "react";
import styles from "./EditStudent.module.css";
import { Dialog, IconButton, Input, MenuItem, Select } from "@mui/material";
import { Close, CloseRounded } from "@mui/icons-material";
import { Selector } from "@/Elements/Selector/Selector";

interface route {
  name: string;
  _id: string;
}

const EditStudent = (props: any) => {
  const [routes, setRoutes] = useState<route[]>([]);
  const [route, setRoute] = useState("default");
  const [transport, setTransport] = useState("default");

  const handleClose = () => {
    props.setDialogEnabled(false);
  };

  const handleRouteChange = () => {};
  return (
    <>
      <Dialog open={true} onClose={handleClose} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Edit Students</h1>
            <IconButton sx={{ p: "10px" }} onClick={() => props.setDialogEnabled(false)}>
              <Close />
            </IconButton>
          </div>
          <div className={styles.row}>
            <span className={styles.textinput}>Student Name</span>
            <Input value={""} style={{ width: "200px" }} />
          </div>
          <div className={styles.row}>
            <span className={styles.textinput}>Class</span>
            <Input value={""} style={{ width: "200px" }} />
          </div>
          <div className={styles.row}>
            <span className={styles.textinput}>Select Route</span>
            <div className={styles.route}>
              <input className={styles.input} type="text" value={"School"} disabled />
              <span>to</span>
              <div className={styles.selector} style={{ marginBottom: "25px" }}>
                <Select
                  style={{ width: "150px", height: "45px" }}
                  onChange={handleRouteChange}
                  value={route}
                  endAdornment={
                    route !== "default" && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setRoute("default");
                        }}
                      >
                        <CloseRounded />
                      </IconButton>
                    )
                  }
                  IconComponent={route === "default" ? undefined : () => null}
                >
                  <MenuItem value="default" disabled>
                    Route
                  </MenuItem>
                  {routes.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <span className={styles.textinput}>Transport Schedule</span>
            <div style={{ width: "150px" }}>
              <Select style={{ width: "100%", height: "45px" }} value={transport}>
                <MenuItem value="default" disabled>
                  Select
                </MenuItem>
                <MenuItem value="roundtrip">Round Trip</MenuItem>
                <MenuItem value="oneway">One Way</MenuItem>
              </Select>
            </div>
          </div>
          <div className={styles.row}>
            <span className={styles.textinput}>Vehicle</span>
            <Input value={""} type="text" style={{ width: "200px" }} />
          </div>
          <div className={styles.action}>
            <button className={styles.add}>Save Changes</button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EditStudent;
