import React, { useEffect, useState } from "react";
import styles from "./AddStudents.module.css";
import {
  Dialog,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Close, CloseRounded } from "@mui/icons-material";
import api from "@/store/api";
import { Class } from "@/models/Class";
import { Selector } from "@/Elements/Selector/Selector";
import students from "@/assests/for_you.svg";
import Checkbox from "@mui/material/Checkbox";
import Input from "@/Elements/Input/Input";
import { StudentInfo } from "@/models/Transportation";

interface Student {
  _id?: string;
  name: string;
  section?: string;
}

interface route {
  routeName: string;
  _id: string;
}

interface Stop {
  label: string;
  data: {
    stop: string;
    oneWay: number;
    roundTrip: number;
  };
  _id: string;
}

const AddStudents = (props: any) => {
  let schoolId = localStorage.getItem("school_id") as string;

  const getClassesAPI = api((state) => state.getClasses);
  const getBySectionIdAPI = api((state) => state.getBySectionId);
  const getRouteListAPI = api((state) => state.getRouteListById);
  const getStopNameByIdAPI = api((state) => state.getStopNameById);
  const createStudentAPI = api((state) => state.createStudent);
  const updateStudentAPI = api((state) => state.updateStudent);
  const getYearAcademicInfoAPI = api((state) => state.getYearAcademicInfo);

  const [classes, setClasses] = useState<Class[]>([]);
  const [stopes, setStops] = useState<Stop[]>([]);
  const [routes, setRoutes] = useState<route[]>([]);
  const [studentsbyClass, setStudentsbyClass] = useState<Student[]>([
    { name: "Select Student", _id: "default" },
  ]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [createStudent, setCreateStudents] = useState<StudentInfo>({
    schoolId: schoolId,
    sectionId: "default",
    studentId: "default",
    transportSchedule: "both",
    selectedRouteId: "default",
    stopId: "default",
    feeMonths: [],
    status: "Pending",
    monthlyFees: null,
  });

  const handleClose = () => {
    props.setDialogEnabled(false);
  };

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const defaultMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [months, setMonths] = useState([]);

  const [selectedMonths, setSelectedMonths]: any = useState<string[]>(["Select Month"]);

  const [monthsIndex, setMonthsIndex] = useState([]);

  // const handleMonthChange = (event: SelectChangeEvent<string>) => {
  //     setCreateStudents({ ...createStudent, feeMonths: event.target.value as string })
  // };

  const handleMonthChange = (event: any) => {
    setSelectedMonths(event.target.value);
  };

  const getMonths = () => {
    let apiMonths: any = [];
    getYearAcademicInfoAPI(localStorage.getItem("school_id") as string, 0, 1000, true).then(
      (response: any) => {
        let monthsIndex = response.data.data[0].months;
        setMonthsIndex(monthsIndex);
        apiMonths = monthsIndex.map((index: any) => defaultMonths[index - 1]);
        apiMonths.unshift("Select Month");
        setMonths(apiMonths);
      }
    );
  };

  useEffect(() => {
    const filteredMonths = selectedMonths.filter((month: string) => month !== "Select Month");
    setCreateStudents((prev) => ({
      ...prev,
      feeMonths: filteredMonths,
    }));
    console.log(filteredMonths);
  }, [selectedMonths]);

  const getClasses = () => {
    getClassesAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let classes: Class[] = await response.data.data;
        classes.unshift({ name: "Class", sectionId: "default" });
        setClasses(classes);
      }
    });
  };

  const handleClassChange = (event: string) => {
    setCreateStudents({
      ...createStudent,
      sectionId: event,
    });
    getStudents(event);
  };

  const handleStudentSelection = (event: SelectChangeEvent<string>) => {
    setCreateStudents({
      ...createStudent,
      studentId: event.target.value,
    });
  };

  const handleCheckboxChange = (option: any) => {
    setCreateStudents({
      ...createStudent,
      transportSchedule: option,
    });
    setSelectedOption(option);
  };

  const getRouteList = () => {
    getRouteListAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let RouteList: any = await response.data.data;
        // RouteList.unshift({ routeName: "Route", _id: "default" })
        setRoutes(RouteList);
      }
    });
    console.log(routes);
  };

  const handleRouteChange = (e: SelectChangeEvent<string>) => {
    setCreateStudents({
      ...createStudent,
      selectedRouteId: e.target.value,
    });
    getStops(e.target.value);
  };

  const handleStopChange = (e: SelectChangeEvent<string>) => {
    const selectedStopId = e.target.value;
    const selectedStop = stopes.find((stop: Stop) => stop._id === selectedStopId);
    let feeAmount = 0;
    if (selectedStop) {
      if (selectedOption === "pickup") {
        feeAmount = selectedStop.data.oneWay;
      } else if (selectedOption === "drop") {
        feeAmount = selectedStop.data.oneWay;
      } else if (selectedOption === "both") {
        feeAmount = selectedStop.data.roundTrip;
      }
    }
    setCreateStudents({
      ...createStudent,
      monthlyFees: feeAmount,
      stopId: e.target.value,
    });
  };

  // const handleTripNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setCreateStudents({
  //         ...createStudent,
  //         tripNumber: Number(event.target.value)
  //     })

  // }

  const getStudents = (classId: string) => {
    getBySectionIdAPI(classId).then(async (response: any) => {
      if (response.status === 200) {
        let students: Student[] = await response.data.data;
        students.unshift({ name: "Select Student", _id: "default" });
        students = students.map((e) => {
          return {
            ...e,
            name: `${e.name}`,
          };
        });
        setStudentsbyClass(students);
        // setCreateStudents({ ...createStudent, studentId: "default" })
      }
    });
  };

  const getStops = (routeId: string) => {
    getStopNameByIdAPI(routeId).then(async (response: any) => {
      if (response.status === 200) {
        let stops = await response.data.data;
        setStops(stops);
        // setCreateStudents({ ...createStudent, stopId: "default" })
      }
      console.log(stopes);
    });
  };

  const handleCreateStudent = async () => {
    await createStudentAPI(createStudent).then((response) => {
      if (response.status === 200) {
        setCreateStudents({
          ...createStudent,
          schoolId: schoolId,
          sectionId: "default",
          studentId: "default",
          transportSchedule: "both",
          selectedRouteId: "default",
          stopId: "default",
          feeMonths: [],
          status: "Pending",
          monthlyFees: null,
        });
        handleClose();
      }
    });
  };

  const handleEditStudent = async () => {
    await updateStudentAPI(props.createStudent?._id, createStudent).then((response) => {
      if (response.status === 200) {
        setCreateStudents({
          ...createStudent,
          schoolId: schoolId,
          sectionId: "default",
          studentId: "default",
          transportSchedule: "both",
          selectedRouteId: "default",
          stopId: "default",
          feeMonths: [],
          status: "Pending",
          monthlyFees: null,
        });
        handleClose();
      }
    });
  };

  useEffect(() => {
    getClasses();
    getRouteList();
    getMonths();
    setCreateStudents((prev) => ({
      ...prev,
      transportSchedule: "both",
    }));
  }, []);

  useEffect(() => {
    if (props.isEdit) {
      setCreateStudents(props.createStudent);
      getStudents(props.createStudent.sectionId);
      getStops(props.createStudent.selectedRouteId);
      setSelectedOption(props.createStudent.transportSchedule);
    }
  }, [props.isEdit, props.createStudent]);

  return (
    <>
      <Dialog open={true} onClose={handleClose} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>
              <img src={students} />
              {props.isEdit ? "Edit Student" : "Add Student"}
            </h1>
            <IconButton sx={{ p: "10px" }} onClick={() => props.setDialogEnabled(false)}>
              <Close />
            </IconButton>
          </div>
          <div className={styles.row}>
            <div className={styles.selector}>
              <Selector
                value={createStudent.sectionId}
                items={classes.map((e) => {
                  return {
                    name: e.name,
                    value: e.sectionId,
                  };
                })}
                onChange={handleClassChange}
              ></Selector>
            </div>
            <Select
              disabled={studentsbyClass.length === 1}
              value={createStudent.studentId}
              onChange={handleStudentSelection}
              style={{ width: "100%", height: "45px" }}
            >
              {studentsbyClass.map((e) => (
                <MenuItem key={e._id} value={e._id}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
            <div className={styles.checkboxGroup}>
              <Checkbox
                checked={selectedOption === "pickup"}
                onChange={() => handleCheckboxChange("pickup")}
              />
              <span>Pickup</span>

              <Checkbox
                checked={selectedOption === "drop"}
                onChange={() => handleCheckboxChange("drop")}
              />
              <span>Drop</span>

              <Checkbox
                checked={selectedOption === "both"}
                onChange={() => handleCheckboxChange("both")}
              />
              <span>Both</span>
            </div>
            {/* <div className={styles.selector}>
                            <Select
                                style={{ width: '100%', height: '45px' }}
                                value={createStudent.feeMonth} onChange={handleMonthChange} displayEmpty>
                                <MenuItem value="default" disabled>
                                    Month
                                </MenuItem>
                                {months.map((monthOption) => (
                                    <MenuItem key={monthOption} value={monthOption}>
                                        {monthOption}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div> */}
            <div className={styles.selector}>
              <Select
                style={{ width: "100%", height: "45px" }}
                className={styles.selector}
                renderValue={(selected: any) => selected.join(", ")}
                multiple
                value={selectedMonths}
                onChange={handleMonthChange}
              >
                {months?.map((month: any) => (
                  <MenuItem
                    key={month}
                    value={month}
                    placeholder="Select Month"
                    disabled={month === "Select Month"}
                  >
                    {month !== "Select Month" && (
                      <Checkbox checked={selectedMonths.indexOf(month) > -1} />
                    )}
                    <ListItemText primary={month} />
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.selector}>
              <Select
                style={{ width: "100%", height: "45px" }}
                onChange={handleRouteChange}
                value={createStudent.selectedRouteId}
                endAdornment={
                  createStudent.selectedRouteId !== "default" && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCreateStudents({ ...createStudent, selectedRouteId: "default" });
                      }}
                    >
                      <CloseRounded />
                    </IconButton>
                  )
                }
                IconComponent={createStudent.selectedRouteId === "default" ? undefined : () => null}
              >
                <MenuItem value="default" disabled>
                  Search Route
                </MenuItem>
                {routes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.routeName}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <Select
              disabled={stopes.length === 0}
              value={createStudent.stopId}
              onChange={handleStopChange}
              style={{ width: "70%", height: "45px", marginRight: "10px" }}
            >
              <MenuItem value="default" disabled>
                Search Stop
              </MenuItem>
              {stopes.map((item: any) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.data.stop}
                </MenuItem>
              ))}
            </Select>
            {/* <Input
                            width="35%"
                            placeholder="Trip Number"
                            value={createStudent.tripNumber}
                            onChange={handleTripNumberChange}
                        /> */}
          </div>
          <div className={styles.footer}>
            <div className={styles.data}>
              <span className={styles.cost}>Monthly Cost</span>
              <span className={styles.amount}>
                {createStudent.monthlyFees !== null
                  ? formatter.format(createStudent.monthlyFees)
                  : "0"}
              </span>
            </div>
            <div className={styles.action}>
              <button className={styles.cancel}>Cancel</button>
              <button
                className={styles.add}
                onClick={props.isEdit ? handleEditStudent : handleCreateStudent}
              >
                {props.isEdit ? "Edit Student" : "Save Student"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddStudents;
