import React, { useState } from "react";
import styles from "./AddAcademicYear.module.css";
import { Dialog, IconButton, InputBase, Paper } from "@mui/material";
import { Close } from "@mui/icons-material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import api from "../../../store/api";
import { AcademicYear } from "../../../models/AcademicYear";

const AddAcademicYear = (props: any) => {
  const [academicYear, setAcademicYear] = useState<AcademicYear>({
    name: "",
    startDate: "",
    endDate: "",
    schoolId: "",
  });

  const createAcademicInfoAPI = api((state) => state.createAcademicInfo);

  const handlenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAcademicYear({
      ...academicYear,
      name: event.target.value,
    });
  };

  const handlestartDateChange = (event: any) => {
    let currentDate = new Date(`${event.$M + 1}/${event.$D}/${event.$y}`)
    let formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    setAcademicYear({
      ...academicYear,
      startDate: formattedDate,
    });
  };

  const handleendDateChange = (event: any) => {
    let currentDate = new Date(`${event.$M + 1}/${event.$D}/${event.$y}`)
    let formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    setAcademicYear({
      ...academicYear,
      endDate: formattedDate,
    });
  };

  const handleSubmit = async () => {
    const school_id: string | any = localStorage.getItem("school_id");
    if (school_id !== "" && school_id.length == 24) {
      await createAcademicInfoAPI({
        ...academicYear,
        schoolId: school_id,
      }).then((response: any) => {
        if (response.status == 201) {
          setAcademicYear({
            name: '',
            startDate: '',
            endDate: '',
            schoolId: '',
          })
          handleClose()
        }
      });
    }
  };

  const handleClose = () => {
    props.setDialogEnabled(false);
  };

  return (
    <>
      <Dialog open={props.dialogEnabled} onClose={handleClose} maxWidth="xl">
        <div className={styles.dialog}>
          <div className={styles.dialog_header}>
            <h1>Add Academic Year</h1>
            {/* <IconButton
              sx={{ p: "10px" }}
              aria-label="menu"
              onClick={handleClose}
              data-testid="close"
            >
              <Close />
            </IconButton> */}
          </div>
          <div className={styles.dialog_container}>
            <div>
              <span className={styles.label}>Name</span>
              <br />
              <Paper component="form" className={styles.input}>
                <InputBase
                  placeholder="Name"
                  id="filled-hidden-label-small"
                  size="small"
                  className={styles.input_input}
                  value={academicYear.name}
                  onChange={handlenameChange}
                  data-testid="add-name"
                />
              </Paper>
            </div>
          </div>
          <div className={styles.start_and_end}>
            <div style={{ width: "50%", marginRight: "10px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Start Date"
                    sx={{ width: "98%" }}
                    defaultValue={academicYear.startDate}
                    onChange={handlestartDateChange}
                    format="DD/MM/YYYY"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div style={{ width: "50%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="End Date"
                    onChange={handleendDateChange}
                    defaultValue={academicYear.endDate}
                    sx={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <div className={styles.button}>
            <div>
              <button className={styles.cancel} onClick={handleClose}>Cancel</button>
            </div>
            <div>
              <button className={styles.save} onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddAcademicYear;
