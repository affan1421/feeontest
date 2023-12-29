import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import TotalStudents from "@/components/TotalStudents/TotalStudents";
import IntervalSelector from "@/components/IntervalSelector/IntervalSelector";
import LinearGraph from "@/components/LinearGraph/LinearGraph";
import DataCard from "@/components/DataCard/DataCard";
import StudentPerformanceCard from "@/components/StudentPerformanceCard/StudentPerformanceCard";
import FinancialFlow from "@/components/FinancialFlow/FinancialFlow";
import {
  Box,
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  SelectChangeEvent,
} from "@mui/material";
import CloseCollection from "@/components/CloseCollection/CloseCollection";
import api from "@/store/api";
import { Clear } from "@mui/icons-material";
import {
  TotalStudentsModel,
  IncomeData,
  ExpenseData,
  TotalDiscounts,
  TotalPending,
  FeeCollection,
  TotalReceivable,
  DashboardStats,
  FinancialFlows,
  StudentPerformance,
  PaymentMethod,
} from "@/models/Dashboard";
import { Selector } from "@/Elements/Selector/Selector";
import PaymentMethods from "@/components/PaymentMethods/PaymentMethods";
import MultipleSelectorChip from "@/Elements/MultipleSelectorChip/MultipleSelectorChip";
import { parseDate } from "@internationalized/date";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DailyCloseCollection from "@/components/DailyCloseCollection/DailyCloseCollection";

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

const Dashboard = () => {
  // School ID
  const schoolId = localStorage.getItem("school_id") as string;

  // API's
  const dashboardStatsAPI = api((state) => state.dashboardStats);
  const getFeeScheduleAPI = api((state) => state.getFeeSchedule);
  const getCardsDataAPI = api((state) => state.getCardsData);

  const [interval, setInterval] = useState<"daily" | "weekly" | "monthly" | "custom" | null>(
    "daily"
  );
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [customFilterDialog, setCustomFilterDialog] = useState(false);
  const [feeschedules, setFeeSchedules] = useState<FeeSchedule[]>([]);
  const [feeschedule, setFeeSchedule] = useState("default");
  const [dailyCollectionModal, setDailyCollectionModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStudents: {} as TotalStudentsModel,
    incomeData: {} as IncomeData,
    expenseData: {} as ExpenseData,
    totalDiscounts: {} as TotalDiscounts,
    studentPerformance: {} as StudentPerformance,
    paymentMethods: [] as PaymentMethod[],
    financialFlows: {} as FinancialFlows,
  });

  const [dashboardCardStats, setDashboardCardStats] = useState({
    totalPending: {} as TotalPending,
    totalCollectedData: {} as FeeCollection,
    totalReceivable: {} as TotalReceivable,
    feePerformance: {} as StudentPerformance,
  });

  const [terms, setTerms] = useState<Term[]>([]);
  const [range, setRange] = useState(null);

  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [value, setValue] = useState("withoutDisc");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    let disc = event.target.value === "withDisc" ? true : false;
    let scheduleDates;
    if (selectedTerms.length) {
      scheduleDates = selectedTerms.map((item) => {
        return dateFormatterLocal(new Date(item).toLocaleDateString("en-GB"));
      });
      console.log(scheduleDates, 87);
      ``;
    }
    getCardsDataAPI(feeschedule, scheduleDates, disc).then((response) => {
      if (response.status == 200) {
        setDashboardCardStats(response.data.data);
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
    getDashboardData(null, startDate, endDate);
  };

  // Get Dashboard Stats
  const getDashboardData = (
    interval: "daily" | "weekly" | "monthly" | "custom" | null,
    startDate: string,
    endDate: string
  ) => {
    dashboardStatsAPI(
      schoolId,
      interval,
      dateFormatterLocal(startDate as string),
      dateFormatterLocal(endDate as string)
    ).then((response) => {
      if (response.status === 200) {
        setDashboardStats(response.data.data);
      }
    });
  };

  const getFeeSchedule = () => {
    getFeeScheduleAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let FeeSchedule = await response.data.data;
        setFeeSchedules(FeeSchedule);
      }
    });
  };

  const handleFeeSchedule = (event: string) => {
    setSelectedTerms([]);
    setFeeSchedule(event);
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

  const getTerms = (months: []): string[] => {
    return months.map((month, index) => {
      return new Date(0, month - 1).toLocaleString("en-US", { month: "long" });
    });
  };

  const defaultSelector = () => {
    setFeeSchedule("default");
    setSelectedTerms([]);
    let disc = value === "withDisc" ? true : false;
    getCardsDataAPI(undefined, [], disc).then((response) => {
      if (response.status == 200) {
        setDashboardCardStats(response.data.data);
      }
    });
  };

  const dateFormatterLocal = (date: string | undefined) => {
    if (date) {
      const [day, month, year] = date.split("/");
      console.log(day, "ad", date);

      return `${day}/${month}/${year}`;
    } else {
      return "";
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
    let disc = value === "withDisc" ? true : false;
    getCardsDataAPI(feeschedule, scheduleDates, disc).then((response) => {
      if (response.status == 200) {
        setDashboardCardStats(response.data.data);
      }
    });
  };

  useEffect(() => {
    if (interval == null) {
      setInterval("daily");
    } else if (interval == "custom") {
    } else {
      getDashboardData(interval, "", "");
    }
  }, [interval]);

  useEffect(() => {
    defaultSelector();
    getDashboardData(interval, "", "");
    getFeeSchedule();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div>
          <IntervalSelector
            setInterval={setInterval}
            interval={interval}
            setDialogEnabled={setCustomFilterDialog}
            dialogEnabled={customFilterDialog}
            handleCustomDateRangePicker={handleCustomDateRangePicker}
            range={range}
            setRange={setRange}
          />
        </div>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <button
            onClick={() => setDailyCollectionModal(true)}
            className={styles.closeCollectionBtn}
          >
            &nbsp; Daily Collection
          </button>
          <button onClick={() => setDialogEnabled(true)}>
            <AccountBalanceWalletIcon />
            &nbsp; Close Collection
          </button>
        </Box>
      </div>
      <Dialog
        open={dailyCollectionModal}
        onClose={() => setDailyCollectionModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DailyCloseCollection setOpen={setDailyCollectionModal} />
      </Dialog>
      <Dialog open={dialogEnabled} maxWidth="xl" onClose={() => setDialogEnabled(false)}>
        <CloseCollection setDialogEnabled={setDialogEnabled} />
      </Dialog>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.row}>
            <div className={styles.card}>
              <TotalStudents
                boysCount={dashboardStats?.totalStudents.boysCount}
                girlsCount={dashboardStats?.totalStudents.girlsCount}
                totalCount={dashboardStats?.totalStudents.totalCount}
              />
            </div>
            {}
            <div className={styles.card}>
              <LinearGraph
                amountEnabled={true}
                graphHeight={75}
                isIncome={true}
                data={
                  dashboardStats?.incomeData.incomeList &&
                  dashboardStats?.incomeData.incomeList.length > 0
                    ? dashboardStats?.incomeData.incomeList.map((item) => item.paidAmount)
                    : [0]
                }
                labels={
                  dashboardStats?.incomeData.incomeList &&
                  dashboardStats?.incomeData.incomeList.length > 0
                    ? dashboardStats?.incomeData.incomeList.map((item) =>
                        new Date(item.issueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      )
                    : ["0"]
                }
                topColor="#B8DC6C"
                bottomColor="#ffff"
                borderColor="#A0C24A"
                title="Income"
                amount={dashboardStats?.incomeData.amount}
                titleFontSize={18}
                amountFontSize={25}
              />
            </div>
            <div className={styles.card}>
              <LinearGraph
                amountEnabled={true}
                graphHeight={75}
                isExpense={true}
                data={
                  dashboardStats?.expenseData?.totalExpenseCurrent?.expenseList.length > 0
                    ? dashboardStats?.expenseData?.totalExpenseCurrent?.expenseList.map(
                        (item) => item.amount
                      )
                    : [0]
                }
                labels={
                  dashboardStats?.expenseData?.totalExpenseCurrent?.expenseList.length > 0
                    ? dashboardStats?.expenseData?.totalExpenseCurrent?.expenseList.map((item) =>
                        new Date(item.expenseDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      )
                    : ["0"]
                }
                title="Expense"
                topColor="#FFD6AF"
                bottomColor="#FFF"
                borderColor="#FF9E44"
                amount={dashboardStats?.expenseData?.totalExpenseCurrent?.totalExpAmount}
                titleFontSize={18}
                amountFontSize={25}
              />
            </div>
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
              <div style={{ width: "40%" }}>
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
              <>
                {selectedTerms && selectedTerms.length > 0 && (
                  <div>
                    <IconButton
                      onClick={defaultSelector}
                      sx={{
                        border: "1.5px solid #DBDBDB",
                        borderRadius: "04px",
                        padding: "11.2px",
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </div>
                )}
              </>
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
            <div className={styles.row}>
              <div className={styles.card}>
                <DataCard
                  maxClass={dashboardCardStats?.totalReceivable?.maxClass}
                  minClass={dashboardCardStats?.totalReceivable?.minClass}
                  icon="totalrecievable"
                  title="Total Recievable"
                  totalAmount={
                    dashboardCardStats?.totalReceivable?.totalAmount
                      ? dashboardCardStats?.totalReceivable?.totalAmount
                      : 0
                  }
                  format={true}
                />
              </div>
              <div className={styles.card}>
                <DataCard
                  maxClass={dashboardCardStats?.totalCollectedData?.maxClass}
                  minClass={dashboardCardStats?.totalCollectedData?.minClass}
                  icon="feecollection"
                  title="Fee Collection"
                  totalAmount={
                    dashboardCardStats.totalCollectedData?.totalAmount
                      ? dashboardCardStats.totalCollectedData?.totalAmount
                      : 0
                  }
                  format={true}
                />
              </div>
              <div className={styles.card}>
                <DataCard
                  maxClass={dashboardCardStats?.totalPending?.maxClass}
                  minClass={dashboardCardStats?.totalPending?.minClass}
                  icon="totalpending"
                  title="Total Pending"
                  totalAmount={
                    dashboardCardStats.totalPending?.totalAmount
                      ? dashboardCardStats.totalPending?.totalAmount
                      : 0
                  }
                  format={true}
                />
              </div>
            </div>
            <div className={`${styles.row} ${styles.student_card}`}>
              <StudentPerformanceCard studentPerformance={dashboardCardStats.feePerformance} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.student_card}></div>
            <div className={styles.class_card}>
              {/* <ClassFeePerformance amount={100} maxClass='Class 10' minClass='Class 1' maxAmount={100} minAmount={50} /> */}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.column}>
            <div className={styles.rightItem}>
              <DataCard
                maxClass={dashboardStats?.totalDiscounts?.maxClass}
                minClass={dashboardStats?.totalDiscounts?.minClass}
                totalAmount={dashboardStats.totalDiscounts.totalApprovedAmount}
                icon="totalpending"
                title="Total Discount"
                format={true}
              />
            </div>

            <div className={styles.rightItem}>
              {<PaymentMethods items={dashboardStats.paymentMethods} />}
            </div>
            <div className={styles.rightItem}>
              <FinancialFlow
                expense={dashboardStats.financialFlows.expense}
                income={dashboardStats.financialFlows.income}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
