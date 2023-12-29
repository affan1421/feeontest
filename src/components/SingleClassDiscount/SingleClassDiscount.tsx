import { IconButton } from '@mui/material'
import styles from './SingleClassDiscount.module.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DiscountStatsCard from '../DiscountStatsCard/DiscountStatsCard'
import { useParams } from 'react-router-dom'
import api from '@/store/api'
import { TabContext, TabPanel } from '@mui/lab'
import { Tabs, Tab } from '@mui/material'
import DiscountRequestList from '../DiscountRequestList/DiscountRequestList'
import GiveDiscount from '../GiveDiscount/GiveDiscount'

interface ClassSummary {
  totalAmount: number
  totalDiscount: number
}

const SingleClassDiscount = () => {

  //variables
  const navigate = useNavigate()
  const { classId, className, categoryId } = useParams()
  const role = localStorage.getItem('role_name');

  //State variables
  const [classData, setClassData] = useState<ClassSummary>({
    totalAmount: 0,
    totalDiscount: 0
  })
  const [value, setValue]: any = useState('1')

  //API's
  const getClassSummaryAPI = api(state => state.getClassSummaryById);

  const getClassSummary = () => {
    getClassSummaryAPI(String(classId)).then((response) => {
      if (response.status === 200) {
        setClassData(response.data.data)
      }
    })
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    getClassSummary()
  }, [])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.navigation} >
          <IconButton
            onClick={() => {
              navigate('/discount')
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          Back
        </div>
        <div className={styles.header}>
          <span>{className}</span>
        </div>
        <div className={styles.cards}>
          <DiscountStatsCard title={'Total Amount'} amount={classData.totalAmount} isCurrency={true} />
          <DiscountStatsCard title={'Total Discount'} amount={classData.totalDiscount} isCurrency={false} />
        </div>
        {role === 'management' ?
          (
            <div className={styles.tabs}>
              <TabContext value={value}>
                <div style={{ 'marginLeft': '20px' }}>
                  <Tabs value={value} onChange={handleChange}  >
                    <Tab label="Discount" className={styles.tab} value='1' />
                    <Tab label="Discount Requests" className={styles.tab} value='2' />
                  </Tabs>
                </div>
                <TabPanel value='1' >
                  <GiveDiscount classId={classId} discountId={categoryId} />
                </TabPanel>
                <TabPanel value='2' >
                  <DiscountRequestList isClass={true} sectionId={classId} isDiscount={false} />
                </TabPanel>

              </TabContext>
            </div>
          )
          :
          (<div>
            <GiveDiscount classId={classId} discountId={categoryId} />
          </div>)}

      </div>
    </>
  )
}

export default SingleClassDiscount