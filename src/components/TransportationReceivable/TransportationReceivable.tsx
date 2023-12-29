import React, { useEffect, useState } from "react";
import styles from "./TransportationReceivable.module.css";
import { Select, MenuItem, Stack, SelectChangeEvent } from "@mui/material";
import api from "@/store/api";

const TransportationReceivable = () => {
  let schoolId = localStorage.getItem("school_id") as string;

  const getTransportDataAPI = api((state) => state.getTransportData);

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const [month, setMonth] = useState(
    new Date().toLocaleString("default", { month: "long" }) || "January"
  );
  const [cardDetails, setCardDetails] = useState({
    totalReceivable: 0,
    pending: 0,
    collection: 0,
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "November",
    "December",
  ];

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setMonth(event.target.value as string);
  };

  const fetchData = async (selectedMonth?: string) => {
    await getTransportDataAPI(schoolId, selectedMonth).then((response) => {
      let totalAmount = response.data?.feeDetails.dueAmount + response.data?.feeDetails.paidAmount;
      setCardDetails({
        totalReceivable: totalAmount || 0,
        pending: response.data?.feeDetails.dueAmount || 0,
        collection: response.data?.feeDetails.paidAmount || 0,
      });
    });
  };

  useEffect(() => {
    fetchData(month);
  }, [month]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <span>Total Receivable</span>
          <Stack sx={{ width: "35%" }}>
            <Select value={month} onChange={handleMonthChange} displayEmpty>
              <MenuItem value="" disabled>
                Month
              </MenuItem>
              {months.map((monthOption) => (
                <MenuItem key={monthOption} value={monthOption}>
                  {monthOption}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </div>
        <div className={styles.amount}>
          <span>{formatter.format(cardDetails.totalReceivable)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.title}>Collection</span>
          <span className={styles.received}>{formatter.format(cardDetails.collection)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.title}>Pending</span>
          <span className={styles.pending}>{formatter.format(cardDetails.pending)}</span>
        </div>
      </div>
    </>
  );
};

export default TransportationReceivable;
