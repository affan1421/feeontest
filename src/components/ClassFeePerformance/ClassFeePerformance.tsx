import React from 'react';
import styles from './ClassFeePerformance.module.css';
import Class_icon from '../../assests/class_icon.svg';

interface Props {
    amount: number,
    maxClass: string,
    minClass: string,
    maxAmount: number,
    minAmount: number
}

const ClassFeePerformance = (props:Props) => {
    return (
        <>
            <div className={styles.main}>
                <div className={styles.header}>
                    <img src={Class_icon} />
                    <span>Classes Fee Performance</span>
                </div>
                <div className={styles.amount}>
                    <span>{props.amount}%</span>
                </div>
                <div className={styles.row}>

                    <div className={styles.max}>
                        <span className={`${styles.classTitle} ${styles.maxTitle}`}>Best</span>
                        <div className={styles.max_sub}>
                            <span className={styles.class}>{props.maxClass}</span>
                            <span className={styles.totamount}>{props.maxAmount}K</span>
                        </div>
                    </div>
                    <div className={styles.min}>
                        <span className={`${styles.classTitle} ${styles.minTitle}`}>Least</span>
                        <div className={styles.min_sub}>
                            <span className={styles.class}>{props.minClass}</span>
                            <span className={styles.totamount}>{props.minAmount}K</span>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ClassFeePerformance