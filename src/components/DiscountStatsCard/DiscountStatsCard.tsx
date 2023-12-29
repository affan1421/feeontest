import styles from './DiscountStatsCard.module.css'
import React from 'react'

interface Statistics {
  title: string,
  amount: number,
  isCurrency: boolean
}

const DiscountStatsCard = (props: Statistics) => {

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });


  return (
    <>
      <div className={styles.main}>
        <span className={styles.title}>{props.title}</span>
        <span className={styles.amount}> {props.isCurrency ? formatter.format(props.amount) : props.amount}</span>
      </div>
    </>
  )
}

export default DiscountStatsCard