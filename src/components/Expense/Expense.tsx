import { useEffect, useState } from 'react';
import IntervalSelector from '../IntervalSelector/IntervalSelector';
import styles from './Expense.module.css';
import { Add } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import CreateExpense from '../CreateExpense/CreateExpense';
import LinearGraph from '../LinearGraph/LinearGraph';
import DataCard from '../DataCard/DataCard';
import ExpenseTransaction from '../ExpenseTransaction/ExpenseTransaction';
import api from '@/store/api';
import { ExpenseTransactionData } from '@/models/ExpenseTransaction';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { parseDate } from '@internationalized/date';

const Expense = () => {
  const schoolId = localStorage.getItem('school_id') as string;
  // API's
  const getExpenseDashboardDataAPI = api(state => state.getExpenseDashboardData);

  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly' | 'custom' | null>('daily');
  const [dialogEnabled, setDialogEnabled] = useState(false);
  const [rangeDialog, setRangeDialog] = useState(false);
  const [expenseData, setExpenseData] = useState<ExpenseTransactionData>({
    percentage: 0,
    totalExpense: {
      maxExpType: {
        expenseType: {
          name: '',
        },
        totalExpAmount: 0,
      },
      minExpType: {
        expenseType: {
          name: '',
        },
        totalExpAmount: 0,
      },
      totalAmount: 0,
    },
    totalExpenseCurrent: {
      expenseList: [],
      totalExpAmount: 0,
    },
  });
  const [refreshData, setRefreshData] = useState(false);
  const [range, setRange] = useState({
    start: parseDate(new Date().toISOString().slice(0, 10)),
    end: parseDate(new Date().toISOString().slice(0, 10))
  });

  const getExpenseDashboardData = (
    startDate?: string,
    endDate?: string,
    intervalType?: string
  ) => {
    getExpenseDashboardDataAPI(schoolId, dateFormatter(startDate as string), dateFormatter(endDate as string), intervalType as string).then(
      (response) => {
        
        if (response.status === 200) {
          setExpenseData(response.data.data);
        }
      }
    );
  };

  const rangeSelected = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      getExpenseDashboardData(startDate, endDate, 'daily');
    } else {
      getExpenseDashboardData(startDate, endDate);
    }
    setRangeDialog(false);
  };

  const handleCustomDateRangePicker = (value: any) => {
    setInterval('custom');
    setRange(value);

    let startDate = `${value.start.day.toString().padStart(2, '0')}/${(value.start.month).toString().padStart(2, '0')}/${value.start.year}`
    let endDate = `${value.end.day.toString().padStart(2, '0')}/${(value.end.month).toString().padStart(2, '0')}/${value.end.year}`
      

    getExpenseDashboardData(startDate, endDate);
}


const dateFormatter = (date: string | undefined) => {
  if (date) {
      const [day, month, year] = date.split('/');
      return `${day}/${month}/${year}`;
  } else {
      return '';
  }
}
  useEffect(() => {
    getExpenseDashboardData(interval as string);
  }, []);

  useEffect(() => {
    if (!interval) {
      setInterval('daily');
    } else if (interval == 'custom') {

    }
    else {
      getExpenseDashboardData('', '', interval as string);
    }
  }, [interval]);

  useEffect(() => {
    if (!dialogEnabled) {
      getExpenseDashboardData('', '', interval as string);
      setRefreshData(true);
      setTimeout(() => {
        setRefreshData(false);
      }, 1000);
    }
  }, [dialogEnabled]);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <IntervalSelector
          setInterval={setInterval}
          interval={interval}
          dialogEnabled={rangeDialog}
          setDialogEnabled={setRangeDialog}
          handleCustomDateRangePicker={handleCustomDateRangePicker}
          range={range}
          setRange={setRange}
        />
        <button onClick={() => setDialogEnabled(true)}>
          <Add /> &nbsp; Create Expense
        </button>
      </div>
      <div className={styles.row}>
        <div className={styles.left}>
          <LinearGraph
            amountEnabled={true}
            percentage={expenseData.percentage}
            labels={expenseData.totalExpenseCurrent.expenseList?.map((item) =>
              new Date(item.expenseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            )}
            graphHeight={100}
            amount={expenseData.totalExpenseCurrent.totalExpAmount}
            data={expenseData.totalExpenseCurrent.expenseList.map((item) => item.amount)}
            isExpense={true}
            isIncome={false}
            title="Expense"
            topColor="#FFD6AF"
            bottomColor="#FFF"
            borderColor="#FF9E44"
          />
        </div>
        <div className={styles.right}>
          <DataCard
            maxExpType={{
              expenseType: {
                name: expenseData?.totalExpense?.maxExpType?.expenseType?.name,
              },
              totalExpAmount: expenseData?.totalExpense?.maxExpType?.totalExpAmount,
            }}
            minExpType={{
              expenseType: {
                name: expenseData?.totalExpense?.minExpType?.expenseType?.name,
              },
              totalExpAmount: expenseData.totalExpense.minExpType.totalExpAmount,
            }}
            icon="totalpending"
            title="Total Expense"
            totalAmount={expenseData?.totalExpense?.totalAmount}
            format={true}
          />
        </div>
      </div>
      <div className={styles.row}>
        <ExpenseTransaction refreshData={refreshData} />
      </div>
      <Dialog open={dialogEnabled} maxWidth="xl">
        <CreateExpense setDialogEnabled={setDialogEnabled} />
      </Dialog>
    </div>
  );
};

export default Expense;
