import styles from "./Income.module.css";
import LinearGraph from "@/components/LinearGraph/LinearGraph";
import { IncomeData, IncomeDataCard } from "@/models/Income";
import api from "@/store/api";
import { useEffect, useState } from "react";
import DataList from "../DataList/DataList";
import DataCard from "@/components/DataCard/DataCard";
import IntervalSelector from "../IntervalSelector/IntervalSelector";
import IncomeTransactions from "../IncomeTransaction/IncomeTransactions";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { IconButton, SelectChangeEvent } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { Selector } from "@/Elements/Selector/Selector";
import MultipleSelectorChip from "@/Elements/MultipleSelectorChip/MultipleSelectorChip";
import { parseDate } from "@internationalized/date";

interface FeeSchedule {
  scheduleName: string;
  _id: string;
  months?: [];
  scheduledDates?: [];
}

interface Term {
  schedule: string;
  value: string;
}

const Income = () => {
  const schoolId = localStorage.getItem("school_id") as string;
  const [interval, setInterval] = useState<"daily" | "weekly" | "monthly" | "custom" | null>(
    "daily"
  );
  // API's
  const getIncomeDashboardDataAPI = api((state) => state.getIncomeDashboardData);
  const getFeeScheduleAPI = api((state) => state.getFeeSchedule);
  const getCardsDataAPI = api((state) => state.getCardsData);

  const [incomeCardData, setIncomeCardData] = useState<IncomeDataCard>({
    totalReceivable: {
      totalAmount: 0,
      maxClass: {
        amount: 0,
        sectionId: {
          _id: "",
          sectionName: "",
          className: "",
        },
      },
      minClass: {
        amount: 0,
        sectionId: {
          _id: "",
          sectionName: "",
          className: "",
        },
      },
    },
    totalCollectedData: {
      totalAmount: 0,
      maxClass: {
        amount: 0,
        sectionId: null,
      },
      minClass: {
        amount: 0,
        sectionId: null,
      },
    },
    totalPending: {
      totalAmount: 0,
      maxClass: {
        amount: 0,
        sectionId: null,
      },
      minClass: {
        amount: 0,
        sectionId: null,
      },
    },
  });
  const [incomeData, setIncomeData] = useState<IncomeData>({
    miscellaneous: {
      totalAmount: 0,
      miscList: [],
    },
    totalCollected: {
      totalAmount: 0,
      feeList: [],
    },
    totalIncome: {
      amount: 0,
      percentage: 0,
      incomeList: [],
    },
  });
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [range, setRange] = useState({
    start: parseDate(new Date().toISOString().slice(0, 10)),
    end: parseDate(new Date().toISOString().slice(0, 10)),
  });
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [feeschedules, setFeeSchedules] = useState<FeeSchedule[]>([]);
  const [feeschedule, setFeeSchedule] = useState("default");
  const [value, setValue] = useState("withoutDisc");

  const defaultSelector = () => {
    setFeeSchedule("default");
    setSelectedTerms([]);
    let disc = value === "withDisc" ? true : false;
    getCardsDataAPI(undefined, [], disc).then((response) => {
      if (response.status == 200) {
        setIncomeCardData(response.data.data);
      }
    });
  };

  const handleCustomDateRangePicker = (value: any) => {
    setInterval("custom");
    setRange(value);

    let startDate = `${value.start.day.toString().padStart(2, "0")}/${value.start.month
      .toString()
      .padStart(2, "0")}/${value.start.year}`;
    let endDate = `${value.end.day.toString().padStart(2, "0")}/${value.end.month
      .toString()
      .padStart(2, "0")}/${value.end.year}`;
    getIncomeDashboardData("", startDate, endDate);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    let disc = event.target.value === "withDisc" ? true : false;
    let scheduleDates;
    if (selectedTerms.length) {
      scheduleDates = selectedTerms.map((item) => {
        return new Date(item).toLocaleDateString("en-US");
      });
    }
    getCardsDataAPI(feeschedule, scheduleDates, disc).then((response) => {
      if (response.status == 200) {
        setIncomeCardData(response.data.data);
      }
    });
  };

  const getIncomeDashboardData = (
    interval: string | null,
    startDate?: string,
    endDate?: string
  ) => {
    getIncomeDashboardDataAPI(
      schoolId,
      dateFormatter(startDate as string),
      dateFormatter(endDate as string),
      interval as string
    ).then((response: any) => {
      let data = response.data.data as IncomeData;
      setIncomeData(data);
    });
  };

  const getIncomeData = () => {
    getIncomeDashboardDataAPI(schoolId).then((response: any) => {
      let data = response.data.data;
      // setIncomeCardData(data)
    });
  };

  const getFeeSchedules = () => {
    getFeeScheduleAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let feeSchedules = await response.data.data;
        // feeSchedules.unshift({ scheduleName: "Select Fee Schedule", _id: "default" })
        setFeeSchedules(feeSchedules);
        // defaultSelector(feeSchedules)
      }
    });
  };

  const rangeSelected = (startDate: string, endDate: string) => {
    if (startDate == endDate) {
      getIncomeDashboardData("daily", startDate, endDate);
    } else {
      getIncomeDashboardData("", startDate, endDate);
    }
    setDialogEnabled(false);
  };

  const dateFormatter = (date: string | undefined) => {
    if (date) {
      const [day, month, year] = date.split("/");
      return `${day}/${month}/${year}`;
    } else {
      return "";
    }
  };
  const handleFeeSchedule = (event: string) => {
    setSelectedTerms([]);
    setFeeSchedule(event);
    // Get Fee Schedule
    let feeSchedule: any = feeschedules.filter((feeSchedule) => feeSchedule._id === event)[0];
    if (feeSchedule) {
      let months = getTerms(feeSchedule.months ? feeSchedule.months : []);
      let terms: Term[] = months?.map((month: string, index: number) => {
        return {
          schedule: month,
          value: feeSchedule && feeSchedule.scheduledDates[index],
        };
      });
      setTerms(terms);
    }
  };

  const handleTermChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTerms(event.target.value as string[]);
    let scheduleDates = event.target.value as string[];
    scheduleDates = scheduleDates.map((date) =>
      new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );
    let disc = event.target.value === "withDisc" ? true : false;
    getCardsDataAPI(feeschedule, scheduleDates, disc).then((response) => {
      if (response.status == 200) {
        setIncomeCardData(response.data.data);
      }
    });
  };

  const getTerms = (months: []): string[] => {
    return months.map((month, index) => {
      return new Date(0, month - 1).toLocaleString("en-US", { month: "long" });
    });
  };

  useEffect(() => {
    getIncomeDashboardData(interval);
    defaultSelector();
    getIncomeData();
    getFeeSchedules();
  }, []);

  useEffect(() => {
    if (interval == null) {
      setInterval("daily");
    } else if (interval == "custom") {
    } else {
      getIncomeDashboardData(interval);
    }
  }, [interval]);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <IntervalSelector
          setInterval={setInterval}
          interval={interval}
          setDialogEnabled={setDialogEnabled}
          dialogEnabled={dialogEnabled}
          handleCustomDateRangePicker={handleCustomDateRangePicker}
          range={range}
          setRange={setRange}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.left}>
          <div className={styles.leftTop}>
            <LinearGraph
              amountEnabled={true}
              graphHeight={150}
              isIncome={true}
              data={incomeData.totalIncome.incomeList.map((item) => item.paidAmount)}
              labels={incomeData.totalIncome.incomeList.map((item) =>
                new Date(item.issueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              )}
              topColor="#B8DC6C"
              bottomColor="#ffff"
              borderColor="#A0C24A"
              title="Income"
              amount={incomeData.totalIncome.amount}
              percentage={incomeData.totalIncome.percentage}
            />
          </div>
          <div className={styles.bg}>
            <div className={styles.rowSelector}>
              <div className={styles.selector}>
                <div style={{ margin: "10px" }}>
                  <Selector
                    defaultValue="Select Fee Schedule"
                    value={feeschedule}
                    items={feeschedules.map((e) => {
                      return {
                        name: e.scheduleName,
                        value: e._id,
                      };
                    })}
                    onChange={handleFeeSchedule}
                    height="auto !important"
                  ></Selector>
                </div>
              </div>
              <div
                style={{
                  width: "40%",
                }}
              >
                <div style={{ margin: "10px" }}>
                  <MultipleSelectorChip
                    defaultValue="Select Term"
                    disabled={feeschedule == "default"}
                    value={selectedTerms}
                    items={terms.map((e) => {
                      return {
                        name: e.schedule,
                        value: e.value,
                      };
                    })}
                    onChange={handleTermChange as any}
                  />
                </div>
              </div>
              {selectedTerms && selectedTerms.length > 0 && (
                <div>
                  <IconButton
                    onClick={defaultSelector}
                    sx={{
                      border: "1.5px solid #DBDBDB",
                      borderRadius: "04px",
                      padding: "11.2px",
                      marginLeft: "10px",
                    }}
                  >
                    <Clear />
                  </IconButton>
                </div>
              )}
            </div>
            <div style={{ marginLeft: "10px" }}>
              <FormControl>
                <RadioGroup value={value} onChange={handleChange} row>
                  <FormControlLabel value="withDisc" control={<Radio />} label="With Discount" />
                  <FormControlLabel
                    value="withoutDisc"
                    control={<Radio />}
                    label="Without Discount"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className={styles.leftBottom}>
              <div className={styles.card}>
                <DataCard
                  maxClass={incomeCardData.totalReceivable.maxClass}
                  minClass={incomeCardData.totalReceivable.minClass}
                  icon="totalrecievable"
                  title="Total Receivable"
                  totalAmount={incomeCardData.totalReceivable.totalAmount}
                  format={true}
                />
              </div>
              <div className={styles.card}>
                <DataCard
                  maxClass={incomeCardData.totalCollectedData.maxClass}
                  minClass={incomeCardData.totalCollectedData.minClass}
                  icon="feecollection"
                  title="Fee Collection"
                  totalAmount={incomeCardData.totalCollectedData.totalAmount}
                  format={true}
                />
              </div>
              <div className={styles.card}>
                <DataCard
                  maxClass={incomeCardData.totalPending.maxClass}
                  minClass={incomeCardData.totalPending.minClass}
                  icon="totalpending"
                  title="Total Pending"
                  totalAmount={incomeCardData.totalPending.totalAmount}
                  format={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <DataList
            miscTotal={incomeData.miscellaneous && incomeData.miscellaneous.totalAmount}
            miscItems={incomeData.miscellaneous && incomeData.miscellaneous.miscList}
            feeTotal={incomeData.totalCollected && incomeData.totalCollected.totalAmount}
            feeItems={incomeData.totalCollected && incomeData.totalCollected.feeList}
          />
        </div>
      </div>
      <div className={styles.transactions}>
        <IncomeTransactions />
      </div>
    </div>
  );
};

export default Income;
