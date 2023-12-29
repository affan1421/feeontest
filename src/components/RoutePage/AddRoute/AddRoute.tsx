import React, { useEffect, useState } from "react";
import styles from "./AddRoute.module.css";
import {
  Alert,
  Button,
  Dialog,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import api from "@/store/api";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import Selector from "@/Elements/Selector/Selector";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const AddRoute = (props: any) => {
  // data
  const schoolId = localStorage.getItem("school_id") as string;

  // APIs
  const createRouteAPI = api((state) => state.createRoute);
  const updateRouteAPI = api((state) => state.updateRoute);
  const setError = api((state) => state.setError);
  const getVehicleNumbersApi = api((state) => state.getVehicleNumbers);
  const getAllDriverListApi = api((state) => state.getAllDriverList);

  const [search, setSearch] = useState("");
  const [vehicle, setVehicle] = useState<any>("default");
  const [vehicleList, setVehicleList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [errorMessage, setErrorMsg] = useState<string>("");

  const handleVehicleChange = (event: { target: { value: string } }) => {
    setVehicle(event.target.value);
  };

  // State Variables
  const [inputValues, setInputValues] = useState<any>({
    schoolId: schoolId,
    routeName: "",
    stops: [{ label: "stop 1", data: { stop: "", oneWay: undefined, roundTrip: undefined } }],
  });

  const [driver, setDriver] = useState<any>("default");

  // event Handlers
  const handleClose = () => {
    props.setDialogEnabled(false);
  };

  const handleInputChange = (index: any, field: any, value: any) => {
    const updatedValues: any = { ...inputValues };
    if (field === "startingPoint" || field === "routeName") {
      updatedValues[field] = value;
    } else {
      updatedValues.stops[index].data[field] = value;
    }
    setInputValues(updatedValues);
  };

  const handleAddStop = () => {
    const newStopLabel = `Stop ${inputValues.stops.length + 1}`;
    setInputValues((prevState: any) => ({
      ...prevState,
      stops: [...prevState.stops, { label: newStopLabel, data: { stop: "", oneWay: undefined, roundTrip: undefined } }],
    }));
  };

  const handleRemoveStop = (index: any) => {
    setInputValues((prevValues: any) => {
      const updatedStops = prevValues.stops.filter((_: any, i: number) => i !== index);
      return { ...prevValues, stops: updatedStops };
    });
  };

  const validateData = async () => {
    if (vehicle === "default") return "select vehicle";
    if (driver === "default") return "select driver";
    if (inputValues?.schoolId === "") return "schoolId required !";
    if (inputValues?.routeName === "") return "route name required !";
    const err = await inputValues?.stops.map((x: any) => {
      if (!x?.data?.stop) return "stop name required !";
      if (!x?.data?.oneWay) return "one way amount required !";
      if (!x?.data?.roundTrip) return "round trip amount required !";
    });
    if (!err[0]) {
      return true;
    } else {
      return err[0];
    }
  };

  // handle creation
  const handleSave = async () => {
    try {
      const data = { ...inputValues, vehicleId: vehicle, driverId: driver };
      const err = await validateData();
      if (err !== true) {
        console.error("Validation Error", `"${err}"`);
        setErrorMsg(err as string);
        setError(true, err as string);
        return;
      }
      await createRouteAPI(data).then((response) => {
        setInputValues({
          schoolId: schoolId,
          routeName: "",
          stops: [{ data: { stop: "", oneWay: undefined, roundTrip: undefined } }],
        });
        props.setDialogEnabled(false);
      });
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  // handle edit
  const handleEdit = async () => {
    try {
      const data = { ...inputValues, vehicleId: vehicle, driverId: driver };
      const err = await validateData();
      if (err !== true) {
        console.error("Validation Error", `"${err}"`);
        setErrorMsg(err as string);
        setError(true, err as string);
        return;
      }
      await updateRouteAPI(props.editingRoute._id, data);

      setInputValues({
        schoolId: schoolId,
        routeName: "",
        stops: [{ data: { stop: "", oneWay: undefined, roundTrip: undefined } }],
      });
      props.setDialogEnabled(false);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  const handleDriverChange = (e: any) => {
    setDriver(e);
  };

  const fetchVehicleList = async () => {
    const { data } = await getVehicleNumbersApi(schoolId, search);
    setVehicleList(data.data);
  };
  const fetchAllDrivers = async () => {
    const { data } = await getAllDriverListApi(schoolId);
    setDriverList(data.data);
  };

  const handleTripNoChange = (e: any) => {
    setInputValues((prevState: any) => ({
      ...prevState,
      tripNo: Number(e.target.value) || 0,
    }));
  };

  useEffect(() => {
    if (props.isEdit) {
      setInputValues(props.editingRoute);
      setDriver(props.editingRoute?.driverInfo[0]?._id);
      setVehicle(props?.editingRoute?.vehicleInfo[0]?._id);
    }
  }, []);

  useEffect(() => {
    fetchVehicleList();
    fetchAllDrivers();
  }, []);

  useEffect(() => {
    if (errorMessage !== "") {
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  }, [errorMessage]);


  return (
    <>
      <Dialog open={true} onClose={handleClose} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <Stack direction={"row"} alignItems={"center"}>
              <RouteOutlinedIcon htmlColor="#46BFF3" />
              <Typography color={"var(--Grey-1, #171717)"} fontSize={20} fontWeight={600}>
                {props.isEdit ? "Edit Route" : "Create Route"}
              </Typography>
            </Stack>
            <Tooltip title={"Close"}>
              <IconButton sx={{ p: "10px" }} onClick={() => props.setDialogEnabled(false)}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
          <div className={styles.border}></div>
          <Grid container direction={"row"} spacing={2} p={2}>
            <Grid item xs={4}>
              <TextField
                value={inputValues?.routeName}
                onChange={(e: any) => handleInputChange(0, "routeName", e.target.value)}
                fullWidth
                label="Enter Route Name"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={5}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={vehicle}
                fullWidth
                onChange={handleVehicleChange}
              >
                <MenuItem value={"default"}>
                  {inputValues?.vehicleInfo &&
                  inputValues?.vehicleInfo?.length > 0 &&
                  inputValues?.vehicleInfo[0].assignedVehicleNumber ? (
                    <Stack direction={"row"} width={"100%"} justifyContent={"space-between"}>
                      <Typography color={"var(--Grey-1, #171717)"}>
                        {inputValues?.vehicleInfo[0]?.registrationNumber}
                      </Typography>
                      <Typography color={"var(--text-on-surface-subdued, #555)"}>
                        {inputValues?.vehicleInfo[0]?.assignedVehicleNumber}
                      </Typography>
                    </Stack>
                  ) : (
                    "Select Vehicle"
                  )}
                </MenuItem>
                {/* <MenuItem
                onClick={(e: any) => {
                  e.stopPropagation();
                }}
                value=""
                sx={{ padding: 0 }}
              >
                <Stack
                  onClick={(e: any) => {
                    e.stopPropagation();
                  }}
                  p={1.5}
                >
                  <Paper
                    className={styles.search}
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconButton aria-label="menu">
                      <SearchIcon />
                    </IconButton>
                    <InputBase
                      placeholder={"Search Vehicles"}
                      value={search}
                      onChange={(e: any) => setSearch(e.target.value)}
                      id="filled-hidden-label-small"
                      size="small"
                    />
                  </Paper>
                </Stack>
              </MenuItem> */}
                <hr />
                {vehicleList.map((x: any) => {
                  return (
                    <MenuItem value={x?._id}>
                      <Stack direction={"row"} width={"100%"} justifyContent={"space-between"}>
                        <Typography color={"var(--Grey-1, #171717)"}>{x?.registrationNumber}</Typography>
                        <Typography color={"var(--text-on-surface-subdued, #555)"}>
                          {x?.assignedVehicleNumber}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Selector
                height="53px"
                defaultValue={"Select Driver"}
                value={driver}
                items={driverList.map((x: any) => {
                  return {
                    name: x?.name,
                    value: x?._id,
                  };
                })}
                onChange={handleDriverChange}
              />
            </Grid>
          </Grid>

          {inputValues.stops?.map((stop: any, index: any) => (
            <div className={styles.row} key={index}>
              <Paper className={styles.search}>
                <IconButton aria-label="menu">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder={"Enter Stop Name"}
                  value={stop?.data?.stop}
                  onChange={(e: any) => handleInputChange(index, "stop", e.target.value)}
                  id="filled-hidden-label-small"
                  size="small"
                />
              </Paper>

              <Paper className={styles.search}>
                <IconButton aria-label="menu">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder={"One way Price"}
                  value={stop?.data?.oneWay}
                  type="number"
                  onChange={(e: any) => handleInputChange(index, "oneWay", Number(e.target.value))}
                  id="filled-hidden-label-small"
                  size="small"
                />
              </Paper>
              <Paper className={styles.search}>
                <IconButton aria-label="menu">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder={"Round Trip Price"}
                  value={stop?.data?.roundTrip}
                  type="number"
                  onChange={(e: any) => handleInputChange(index, "roundTrip", Number(e.target.value))}
                  id="filled-hidden-label-small"
                  size="small"
                />
              </Paper>

              <IconButton
                aria-label="menu"
                sx={{
                  border: "1.5px solid #DBDBDB",
                  borderRadius: "04px",
                  marginLeft: "10px",
                }}
                onClick={() => handleRemoveStop(index)}
              >
                <Close />
              </IconButton>
            </div>
          ))}
          <Stack pt={2}>
            <Button variant="contained" onClick={handleAddStop}>
              <AddIcon />
              Add Stop
            </Button>
          </Stack>

          <Stack width={"100%"} py={2} gap={5} direction={"row"} justifyContent={"space-between"}>
            <Stack>
              {inputValues?.tripNo && (
                <>
                  <Typography color={"var(--Grey-2, #928989)"} whiteSpace={"nowrap"} fontSize={16} fontWeight={500}>
                    Trip Number
                  </Typography>
                  <InputBase
                    value={inputValues?.tripNo}
                    onChange={handleTripNoChange}
                    type="number"
                    sx={{ border: "solid 1px black", width: "40px" }}
                  />
                </>
              )}
            </Stack>
            {errorMessage && (
              <Stack width={"100%"} justifyContent={"center"}>
                <Alert severity="error">{errorMessage}</Alert>
              </Stack>
            )}

            <div className={styles.action}>
              <button className={styles.cancel} onClick={handleClose}>
                Cancel
              </button>
              <button className={styles.save} onClick={props.isEdit ? handleEdit : handleSave}>
                {props.isEdit ? "Update" : "Add"}
              </button>
            </div>
          </Stack>
        </div>
      </Dialog>
    </>
  );
};

export default AddRoute;
