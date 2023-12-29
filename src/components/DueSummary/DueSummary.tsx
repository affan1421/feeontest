import React, { useEffect, useState } from 'react'
import styles from './DueSummary.module.css'
import TotalStudent from '../TotalStudents/TotalStudents'
import DataCard from '../DataCard/DataCard'
import DuesCard from '../DuesCard/DuesCard'
import { IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import api from '@/store/api'
import { Selector } from '@/Elements/Selector/Selector'
import DueList from '../DueList/DueList'
import MultipleSelectorChip from '@/Elements/MultipleSelectorChip/MultipleSelectorChip'
import { Clear } from '@mui/icons-material'
import MultipleSelectorFormControl from '@/Elements/MultipleSelectorFormControl/MultipleSelectorFormControl'

interface FeeCategory {
  name: string
  _id: string
}

interface FeeSchedule {
  scheduleName: string
  _id: string
}
interface Term {
  schedule: string
  value: string
}

const DueSummary = () => {

  const schoolId = localStorage.getItem('school_id') as string

  const getFeeCategoriesAPI = api((state) => state.getFeeCategories)
  const getFeeSchedulesAPI = api((state) => state.getFeeSchedule)
  const getDueSummaryAPI = api(state => state.getDueSummary)

  const [feeCategory, setFeeCategory] = useState<string>('default')
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([])

  const [feeSchedule, setFeeSchedule] = useState<string[]>([])
  const [feeschedules, setFeeSchedules] = useState<FeeSchedule[]>([])
  const [selectedFeeScheduleNames, setSelectedFeeScheduleNames] = useState<string[]>([]);

  const [terms, setTerms] = useState<Term[]>([])
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [termsFormatted, setTermsFormatted] = useState<string[]>([]);

  const [dueStudents, setDueStudents] = useState({
    totalStudents: 0,
    girls: 0,
    boys: 0
  })
  const [due, setDue] = useState({
    dueAmount: 0,
    totalReceivables: 0
  })
  const [classes, setClasses] = useState({
    maxClass: {
      amount: 0,
      sectionId: {
        className: '',
        sectionName: '',
        _id: '',
      }
    },
    minClass: {
      amount: 0,
      sectionId: {
        className: '',
        sectionName: '',
        _id: '',
      }
    },
    totalClassesDue: 0,
  })

  const defaultSelector = () => {
    setFeeSchedule([])
    setFeeCategory('default')
    setSelectedTerms([])
    setDueStudents({
      ...dueStudents,
      totalStudents: 0,
      girls: 0,
      boys: 0
    })
    setDue({
      ...due,
      dueAmount: 0,
      totalReceivables: 0
    })
    setClasses({
      ...classes,
      maxClass: {
        amount: 0,
        sectionId: {
          className: '',
          sectionName: '',
          _id: '',
        }
      },
      minClass: {
        amount: 0,
        sectionId: {
          className: '',
          sectionName: '',
          _id: '',
        }
      },
      totalClassesDue: 0,
    })
    getDueSummaryAPI('', [], []).then((response) => {
      if (response.status == 200) {
        console.log(response.data.data)
        setDueStudents(response.data.data.dueStudents)
        setClasses(response.data.data.totalClassesDue)
        setDue(response.data.data.duesAmount)
      }
    })

  }

  const getFeeCategories = () => {
    getFeeCategoriesAPI(schoolId).then(async (response: any) => {
      if (response.status === 200) {
        let FeeCategory = await response.data.data
        setFeeCategories(FeeCategory)
        // setFeeCategory(response.data?.data[0]?._id)
        // getFeeSchedules(response.data?.data[0]?._id)
      }
    })
  }

  const getFeeSchedules = (feeCategory: string) => {
    getFeeSchedulesAPI(schoolId, feeCategory).then(async (response: any) => {
      if (response.status === 200) {
        let feeSchedules = await response.data.data;
        setFeeSchedules(feeSchedules);
      }
    });
  };

  const handleFeeCategory = (event: string) => {
    setFeeSchedule([])
    setFeeCategory(event)
    getFeeSchedules(event)
    getDueSummaryAPI(event, feeSchedule, selectedTerms).then(response => {
      if (response.status === 200) {
        setDueStudents(response.data.data.dueStudents);
        setClasses(response.data.data.totalClassesDue);
        setDue(response.data.data.duesAmount);
      }
    });
  }


  const handleFeeSchedule = async (event: any) => {
    setSelectedTerms([]);
    setTermsFormatted([]);
    let allMonths: { schedule: string; value?: string }[] = [];
    const selectedValues: any = event.target.value;
    setFeeSchedule(selectedValues);
    console.log(selectedValues);

    await Promise.all(
      selectedValues.map(async (selectedValue: any) => {
        let feeSchedule: any = feeschedules.find(
          (schedule: FeeSchedule) => schedule._id === selectedValue
        );

        if (feeSchedule) {
          console.log(feeSchedule);
          let months = getTerms(feeSchedule.months ? feeSchedule.months : []);
          allMonths = [
            ...allMonths,
            ...months.map((month: string, index: number) => ({
              schedule: month,
              value: feeSchedule && feeSchedule.scheduledDates[index],
            })),
          ];
        }
      })
    );
    console.log(allMonths);
    setTerms(allMonths as Term[]);

    getDueSummaryAPI(
      feeCategory === 'default' ? '' : feeCategory,
      selectedValues,
      []
    ).then((response) => {
      if (response.status === 200) {
        setDueStudents(response.data.data.dueStudents);
        setClasses(response.data.data.totalClassesDue);
        setDue(response.data.data.duesAmount);
      }
    });
  };


  const getTerms = (months: []): string[] => {
    return months.map((month, index) => {
      return new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })
    })
  }

  const handleTermChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTerms(event.target.value as string[]);
    let scheduleDates = event.target.value as string[];
    console.log(scheduleDates, "SDFSDFSDF");
    (scheduleDates = scheduleDates.map((date) =>
      new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    )),
      setTermsFormatted(scheduleDates as string[]);

    getDueSummaryAPI(feeCategory, feeSchedule, scheduleDates).then((response) => {
      if (response.status == 200) {
        setDueStudents(response.data.data.dueStudents);
        setClasses(response.data.data.totalClassesDue);
        setDue(response.data.data.duesAmount);
      }
    });
  };



  useEffect(() => {
    getFeeCategories()
  }, [])

  useEffect(() => {
    getDueSummaryAPI(feeCategory == 'default' ? '' : feeCategory, feeSchedule, selectedTerms).then(response => {
      if (response.status === 200) {
        setDueStudents(response.data.data.dueStudents);
        setClasses(response.data.data.totalClassesDue);
        setDue(response.data.data.duesAmount);
      }
    });
  }, [])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.heading}>
            <span>Due Summary</span>
          </div>
          <div className={styles.filter}>
            <div className={styles.selector}>
              <Selector
                defaultValue='Fee Category'
                value={feeCategory}
                items={feeCategories.map((e) => {
                  return {
                    name: e.name,
                    value: e._id,
                  }
                })}
                onChange={handleFeeCategory}
                height='auto !important'
              ></Selector>
            </div>

            {feeCategory !== 'default' && (
              <>
                <MultipleSelectorFormControl
                  label="Fee Schedule"
                  value={feeSchedule}
                  onChange={handleFeeSchedule}
                  items={feeschedules.map((e) => ({ name: e.scheduleName, value: e._id }))}
                />
              </>
            )}

            {feeCategory !== 'default' && feeSchedule && feeSchedule.length > 0 && (
              <>
                <MultipleSelectorFormControl
                  label="Select Term"
                  value={selectedTerms}
                  onChange={handleTermChange}
                  items={terms.map(e => ({ name: e.schedule, value: e.value }))}
                />
              </>
            )}
            {
              selectedTerms && selectedTerms.length > 0 &&
              <div style={{ 'marginTop': '15px' }}>
                <IconButton
                  onClick={defaultSelector}
                  sx={{
                    border: '1.5px solid #DBDBDB',
                    borderRadius: '04px',
                    padding: '11.2px',
                    marginLeft: '10px'
                  }}
                >
                  <Clear />
                </IconButton>
              </div>
            }
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.card}>
            <TotalStudent
              boysCount={dueStudents.boys}
              girlsCount={dueStudents.girls}
              totalCount={dueStudents.totalStudents}
            />
          </div>
          <div className={styles.card}>
            <DataCard
              maxClass={classes.maxClass}
              minClass={classes.minClass}
              icon='totalrecievable'
              title='Classes'
              totalAmount={classes.totalClassesDue}
              format={false}
            />
          </div>
          <div className={styles.card}>
            <DuesCard
              receivable={due.totalReceivables}
              amountDue={due.dueAmount}
            />
          </div>
        </div>
      </div>
      <div className={styles.table}>
        <DueList
          feeCategory={feeCategory}
          feeSchedule={feeSchedule}
          selectedTerms={termsFormatted}
        />
      </div>
    </>
  )
}

export default DueSummary