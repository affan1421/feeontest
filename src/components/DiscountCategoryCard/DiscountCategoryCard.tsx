import React from 'react';
import styles from './DiscountCategoryCard.module.css';
import CTA from '@/assests/CTA.svg';
import { useNavigate } from 'react-router-dom';

interface DiscountCategoryCardProps {
  title: string
  totalBudget: string
  remainingAmount: string
  totalDiscount: string
  id: string
}

const DiscountCategoryCard: React.FC<DiscountCategoryCardProps> = (props) => {
  const navigate = useNavigate()
  const { title, totalBudget, remainingAmount, totalDiscount } = props;

  return (
    <div className={styles.main} onClick={() => {
      navigate(`/single-discount/${props.id}`)
    }}>
      <div className={styles.row}>
        <span className={styles.title}>{title}</span>
        <img src={CTA} height={30} alt="CTA" />
      </div>
      <div className={styles.sub_container}>
        <div className={styles.data_item}>
          <span className={styles.data_label}>Budget Allocated</span>
          <span className={styles.data_amount}>{totalBudget}</span>
        </div>
        <div className={styles.data_item}>
          <span className={styles.data_label}>Budget Spent</span>
          <span className={styles.data_amount}>{totalDiscount}</span>
        </div>
        <div className={styles.data_item}>
          <span className={styles.data_label}>Budget Remaining</span>
          <span className={styles.data_amount}>{remainingAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default DiscountCategoryCard