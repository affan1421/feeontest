import React, { useState, lazy, Suspense, useEffect } from "react";
import styles from "./Transportation.module.css";
import TransportSummary from "@/components/TransportSummary/TransportSummary";
import group from "@/assests/search_hands_free.svg";
import student from "@/assests/group.svg";
import stops from "@/assests/Asset 1 1.svg";
import route from "@/assests/route.svg";
import vector from "@/assests/directions_bus (1).svg";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { TabPanel } from "@mui/lab";
import TransportationStudent from "@/components/TransportationStudent/TransportationStudent";
import Trips from "@/components/Trips/Trips";
import Vehicles from "@/components/Vehicles/Vehicles";
import Drivers from "@/components/Drivers/Drivers";
import TransportationReceivable from "@/components/TransportationReceivable/TransportationReceivable";
import { useSearchParams } from "react-router-dom";
import api from "@/store/api";
const RoutePage = lazy(() => import("@/components/RoutePage/RoutePage"));

const Transportation = () => {

  const getTransportDataAPI = api((state) => state.getTransportData);

  const [summary, setSummary] = useState({
    driverCount: 0,
    routesCount: 0,
    stopsCount: 0,
    studentsCount:0,
    totalDueAmount:0,
    totalPaidAmount:0,
    vehiclesCount:0,
  });

  const getSummaryData = async () => {

    let schoolId = localStorage.getItem("school_id") as string;

    await getTransportDataAPI(schoolId).then((response) => {
      let data = response.data
      setSummary(data)
    })
  };

  const [tab, setTab]: any = useSearchParams({ tab: JSON.stringify("Students") });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab((prev: any) => {
      prev.set("tab", JSON.stringify(newValue));
      return prev;
    });
  };

  useEffect(() => {
    getSummaryData()
  }, [])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1>Transportation Management </h1>
        </div>

        <div className={styles.container}>
          <div className={styles.row}>
            <TransportationReceivable />
          </div>
          <div className={styles.row}>
            <TransportSummary icon={student} number={summary?.studentsCount} title={"Students"} />
            <TransportSummary icon={route} number={summary?.routesCount} title={"Routes"} />
            <TransportSummary icon={vector} number={summary?.vehiclesCount} title={"Vehicles"} />
            <TransportSummary icon={group} number={summary?.driverCount} title={"Drivers"} />
            <TransportSummary icon={stops} number={summary?.stopsCount} title={"Stops"} />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.tabs}>
            <TabContext value={JSON.parse(tab.get("tab"))}>
              <div>
                <Tabs value={JSON.parse(tab.get("tab"))} onChange={handleChange} className={styles.label}>
                  <Tab label="Students" style={{ marginLeft: "20px" }} className={styles.tab} value="Students" />
                  <Tab label="Routes" className={styles.tab} value="Routes" />
                  <Tab label="Vehicles" className={styles.tab} value="Vehicles" />
                  <Tab label="Drivers" className={styles.tab} value="Drivers" />
                </Tabs>
              </div>
              <TabPanel value="Students">
                <TransportationStudent />
              </TabPanel>
              <TabPanel value="Routes">
                <Suspense fallback={"loading"}>
                  <RoutePage />
                </Suspense>
              </TabPanel>
              <TabPanel value="Vehicles">
                <Vehicles />
              </TabPanel>
              <TabPanel value="Drivers">
                <Drivers />
              </TabPanel>
            </TabContext>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transportation;
