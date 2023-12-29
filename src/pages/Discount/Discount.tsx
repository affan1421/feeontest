import { useEffect, useState } from 'react'
import { Log } from 'nawaz-bettr-logger'
import styles from './Discount.module.css'
import ClassDiscount from '../../components/Class Discount/ClassDiscount';
import DiscountList from '../../components/Discount List/DiscountList';
import { useNavigate } from 'react-router-dom';

const Discount = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem('role_name')

  return (
    <>
      <div className={styles.main}>
        <div className={styles.list}>
          <div className={styles.header}>
            <span>
              Discounts
            </span>
            {
              (role == 'management') &&
              <button
                data-testid='add-new'
                onClick={() => {
                  navigate('/add-discount')
                }}>Add New </button>}
          </div>
          <div className={styles.container}>
            {/* <ClassDiscount name='Class 2A' amount='#########' approved='21' pending='3' value='50' /> */}
          </div>
          <DiscountList />
        </div>
      </div>
    </>
  )
}

export default Discount