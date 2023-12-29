import styles from './SingleDiscountCategory.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Dialog, IconButton } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'
import { Tabs, Tab } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DiscountStatsCard from '../DiscountStatsCard/DiscountStatsCard'
import ClassesList from './ClassesList/ClassesList'
import StudentList from './StudentList/StudentList'
import api from '@/store/api'
import CreateDiscountCategory from '../CreateDiscountCategoryPopup/CreateDiscountCategoryPopup';
import DiscountRequestList from '../DiscountRequestList/DiscountRequestList';
import { Discount } from '@/models/Discount';

interface CategoryStats {
  classesAssociated: number,
  budgetRemaining: number,
  totalStudents: number,
  totalDiscount: number,
  totalBudget: number,
  name: string,
}

const SingleDiscountCategory = () => {
  // Params
  const { discountId } = useParams()
  const navigate = useNavigate()

  // data
  const role = localStorage.getItem('role_name');

  // API's 
  const getDiscountByIdAPI = api(state => state.getDiscountById)

  // state variables    
  const [statsCard, setStatsCard] = useState<CategoryStats>({
    classesAssociated: 0,
    budgetRemaining: 0,
    totalStudents: 0,
    totalDiscount: 0,
    totalBudget: 0,
    name: '',
  })
  const [value, setValue]: any = useState('1')
  const [dialog, setDialog] = useState(false);

  const [discount, setDiscount] = useState<Discount>({
    name: '',
    description: '',
    totalBudget: null,
    createdBy: localStorage.getItem('user_id') as string,
    schoolId: localStorage.getItem('school_id') as string,
  })


  const [selectedClass, setSelectedClass] = useState('')

  const handleClose = () => {
    setDialog(false);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const getDiscountById = () => {
    getDiscountByIdAPI(String(discountId)).then((response) => {
      if (response.status === 200) {
        console.log(response.data.data)
        setStatsCard(response.data.data)
        setDiscount(response.data.data)
      }
    })
    console.log(discount)
  }


  useEffect(() => {
    getDiscountById()
  }, [])

  useEffect(() => {
    getDiscountById()
  }, [dialog])



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
          <h1>{statsCard.name}</h1>
          {role === 'management' ? (
            <IconButton
              sx={{ borderRadius: '4px', background: '#E6EDFE' }}
              onClick={() => {
                setDialog(true);
              }}
            >
              <EditOutlinedIcon />
            </IconButton>

          ) : null}
        </div>
        <div className={styles.row}>
          <DiscountStatsCard title={'Total Discount'} amount={statsCard.totalDiscount} isCurrency={true} />
          <DiscountStatsCard title={'Total Budget'} amount={statsCard.totalBudget} isCurrency={true} />
          <DiscountStatsCard title={'Budget Remaining'} amount={statsCard.budgetRemaining} isCurrency={true} />
          <DiscountStatsCard title={'Total Students'} amount={statsCard.totalStudents} isCurrency={false} />
          <DiscountStatsCard title={'Classes'} amount={statsCard.classesAssociated} isCurrency={false} />
        </div>
        <div className={styles.tabs}>
          <TabContext value={value}>
            <div style={{ 'marginLeft': '20px' }}>
              <Tabs value={value} onChange={handleChange}  >
                <Tab label="Classes" className={styles.tab} value='1' />
                <Tab label="Students" className={styles.tab} value='2' />
              </Tabs>
            </div>
            <TabPanel value='1' >
              <ClassesList setValue={setValue} setSelectedClass={setSelectedClass} discountId={discountId as string} />
            </TabPanel>
            <TabPanel value='2' >
              <DiscountRequestList selectedClass={selectedClass} isClass={false} isDiscount={true} discountId={discountId} />
            </TabPanel>
          </TabContext>
        </div>
      </div>
      <Dialog open={dialog} maxWidth="xl" onClose={handleClose}>
        <CreateDiscountCategory setDialog={handleClose} discount={discount} />
      </Dialog>
    </>
  )
}

export default SingleDiscountCategory