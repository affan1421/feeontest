import { IconButton } from '@mui/material'
import styles from './DiscountClassCard.module.css'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CTA from '@/assests/CTA.svg';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

interface DiscountCategory {
  name: string,
  amount: number
}

interface ClassStats {
  name: string,
  id: string,
  totalDiscount: number,
  discountCategories: DiscountCategory[]
}

const DiscountClassCard = (props: ClassStats) => {

  useEffect(() => {
    console.log(props)
  }, [])

  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <>
      <div className={styles.main} onClick={() => navigate(`/class-discount/${props.id}/${props.name}`)}>
        <>
          <div className={styles.header}>
            <span>{props.name}</span>
            <img src={CTA} height={30} alt="CTA" />
          </div>
          <div className={styles.row}>
            <span>Total Discount</span>
            <span>{formatter.format(props.totalDiscount)}</span>
          </div>
          <div key={props.id}>
            {props.discountCategories.slice(0, 2).map((discount, idx) => (
              <div key={idx} className={styles.newrow} >
                <span>{discount.name}</span>
                <span>{formatter.format(discount.amount)}</span>
              </div>
            ))}
          </div>
        </>
      </div>
    </>
  )
}

export default DiscountClassCard