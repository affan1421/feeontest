import React, { useState, useEffect } from "react";
import styles from "./RoutePage.module.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import {
  IconButton,
  InputBase,
  Paper,
  Dialog,
  Box,
  Typography,
  Skeleton,
  Tooltip,
} from "@mui/material";
import AddRoute from "./AddRoute/AddRoute";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import api from "@/store/api";
import { RouteDetail } from "@/models/Transportation";
import Stack from "@mui/material/Stack";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useSearchParams } from "react-router-dom";

const RoutePage = () => {
  // data
  const schoolId = localStorage.getItem("school_id") as string;

  // API's
  const getRouteDetailAPI = api((state) => state.getRouteDetails);

  // State Variable
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [routeData, setRouteData] = useState<any>(new Array(4).fill(0));
  const [editingRoute, setEditingRoute] = useState<RouteDetail | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);

  var w = window.innerWidth - 650;

  const schoolName = localStorage.getItem("school_name");

  // event Handlers
  const debouncedHandleSearch = (searchQuery: string) => {
    clearTimeout(debounceTimer!);
    const timer = setTimeout(() => {
      getRouteDetail(searchQuery);
    }, 350);
    setDebounceTimer(timer);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value as string;
    setSearchTerm(
      (prev: any) => {
        prev.set("q", searchValue);
        return prev;
      },
      { replace: true }
    );
    debouncedHandleSearch(searchValue);
  };

  const getRouteDetail = async (searchQuery?: string) => {
    setLoading(true);
    await getRouteDetailAPI(schoolId, searchQuery)
      .then((response) => {
        const data = response.data.routes || [];
        setRouteData(data);
        // console.log("dt",data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        setRouteData([]);
        console.log("Error", err.message);
      });
  };
  const handleEditRoute = (route: RouteDetail) => {
    setEditingRoute(route);
    setIsEdit(true);
    setDialogEnabled(true);
  };

  // onChange
  useEffect(() => {
    getRouteDetail();
  }, [dialogEnabled]);

  console.log("routeData", routeData);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.row}>
          <Paper className={styles.search}>
            <IconButton aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search by Route Name"
              id="filled-hidden-label-small"
              size="small"
              className={styles.search_input}
              value={searchTerm.get("q")}
              onChange={handleSearchChange}
            />
          </Paper>
          <div className={styles.btn}>
            <Tooltip title={"Add Route"}>
              <button
                onClick={() => {
                  setDialogEnabled(true);
                  setIsEdit(false);
                }}
              >
                <PersonAddAlt1OutlinedIcon />
                Add
              </button>
            </Tooltip>
          </div>
        </div>

        {routeData.length > 0 ? (
          routeData.map((route: any, index: number) => (
            <div className={styles.card} key={index}>
              <div className={styles.header}>
                {!loading ? (
                  <span>
                    {route?.routeName} {"Route"}
                  </span>
                ) : (
                  <Skeleton variant="text" width={180} height={30} />
                )}
                <Tooltip title={"Edit"}>
                  <IconButton
                    sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px" }}
                    onClick={() => handleEditRoute(route)}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {!loading ? (
                <Typography mb={1}>{route?.studentsCount} Students</Typography>
              ) : (
                <Skeleton variant="text" width={80} height={30} />
              )}

              <Box
                height={300}
                width={"95%"}
                position={"relative"}
                bgcolor={"white"}
                p={2.5}
                borderRadius={2}
              >
                <Stack
                  width={"100%"}
                  className={styles.customScrollBar}
                  sx={{ overflowY: "auto", paddingBottom: 0 }}
                >
                  <Stack
                    sx={{
                      "> div": {
                        flexShrink: 0,
                      },
                    }}
                    width={"auto"}
                    direction={"row"}
                    alignItems={"center"}
                    pb={2}
                  >
                    {!loading ? (
                      <Tooltip placement="top" title={schoolName}>
                        <Stack
                          borderRadius={"50%"}
                          width={"13px"}
                          height={"13px"}
                          bgcolor={"#2760EA"}
                        />
                      </Tooltip>
                    ) : (
                      <Skeleton
                        variant="circular"
                        sx={{
                          width: (window.innerWidth - 720) / route?.stops?.length,
                        }}
                        height={3}
                      />
                    )}
                    {route?.stops?.length > 0 &&
                      route?.stops?.map((x: any, i: number) => {
                        return (
                          <React.Fragment key={i}>
                            <Stack direction={"row"}>
                              {loading ? (
                                <>
                                  <Skeleton
                                    variant="text"
                                    sx={{ mt: 0.4 }}
                                    width={250}
                                    height={7}
                                  />
                                  <Skeleton variant="circular" width={3} height={3} />
                                </>
                              ) : (
                                <>
                                  <Box
                                    className={styles.line}
                                    mt={0.6}
                                    sx={{
                                      width: (window.innerWidth - 720) / route?.stops?.length,
                                    }}
                                    bgcolor={"#2760EA"}
                                    height={3}
                                  ></Box>

                                  {/* <p>df {JSON.stringify(x?.data?.stop)}</p> */}
                                  <Tooltip placement="top" title={x?.data?.stop}>
                                    <Stack
                                      borderRadius={"50%"}
                                      width={"13px"}
                                      height={"13px"}
                                      bgcolor={"#2760EA"}
                                    />
                                  </Tooltip>
                                </>
                              )}
                            </Stack>
                          </React.Fragment>
                        );
                      })}
                  </Stack>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} py={1}>
                  <Typography className={styles.schoolName}>
                    {!loading ? schoolName : <Skeleton variant="text" width={80} height={23} />}
                  </Typography>
                  <Stack justifyContent={"center"} alignItems={"center"}>
                    <Typography fontSize={14} fontWeight={500} color={"#555555"}>
                      {!loading ? (
                        route?.tripNo + " Stops"
                      ) : (
                        <Skeleton variant="text" width={80} height={23} />
                      )}
                    </Typography>
                    <CompareArrowsIcon />
                  </Stack>
                  <Typography color={"#555555"} fontSize={14} fontWeight={500}>
                    {!loading ? (
                      route?.stops?.[route?.stops?.length - 1]?.data?.stop
                    ) : (
                      <Skeleton variant="text" width={80} height={23} />
                    )}
                  </Typography>
                </Stack>
              </Box>

              <Stack className={styles.details} direction={"row"}>
                <div className={styles.box}>
                  <Typography className={styles.routeDataHeading}>Assigned Vehicle</Typography>
                  <span>
                    {!loading ? (
                      route?.vehicleInfo?.length > 0 ? (
                        route?.vehicleInfo[0]?.registrationNumber
                      ) : (
                        0
                      )
                    ) : (
                      <Skeleton variant="text" width={80} height={23} />
                    )}
                  </span>
                </div>
                <div className={styles.box}>
                  <Typography className={styles.routeDataHeading}>Vehicle No</Typography>
                  <span>
                    {!loading ? (
                      route?.vehicleInfo?.length ? (
                        route?.vehicleInfo[0]?.assignedVehicleNumber
                      ) : (
                        0
                      )
                    ) : (
                      <Skeleton variant="text" width={80} height={23} />
                    )}
                  </span>
                </div>
                <div className={styles.box}>
                  <Typography className={styles.routeDataHeading}>Assigned Driver</Typography>
                  <span>
                    {!loading ? (
                      route?.driverInfo?.length > 0 && route?.driverInfo[0]?.name
                    ) : (
                      <Skeleton variant="text" width={80} height={23} />
                    )}
                  </span>
                </div>
                <div className={styles.box}>
                  <Typography className={styles.routeDataHeading}>Trip Number</Typography>
                  <span>
                    {!loading ? route?.tripNo : <Skeleton variant="text" width={80} height={23} />}
                  </span>
                </div>
                <div className={styles.box}>
                  <Typography className={styles.routeDataHeading}>Available Seats</Typography>
                  <span>
                    {!loading ? (
                      route?.availableSeats
                    ) : (
                      <Skeleton variant="text" width={80} height={23} />
                    )}
                  </span>
                </div>
              </Stack>
            </div>
          ))
        ) : (
          <Stack height={400} alignItems={"center"} justifyContent={"center"}>
            no routes found
          </Stack>
        )}
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <AddRoute setDialogEnabled={setDialogEnabled} editingRoute={editingRoute} isEdit={isEdit} />
      </Dialog>
    </>
  );
};

export default RoutePage;
