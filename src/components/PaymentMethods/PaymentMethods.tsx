import React, { useEffect } from 'react'
import styles from './PaymentMethods.module.css'
import misc_icon from '@/assests/misc_icon.svg'
import { SentimentVeryDissatisfiedRounded, } from '@mui/icons-material';
import { formatter } from '@/helpers/formatter';

interface item {
    _id: string
    totalAmount: number
}

interface Props {
    items: item[]
}

const PaymentMethods = (props: Props) => {
    useEffect(() => {
        console.log(props.items)
    }, [])

    return <div className={styles.main}>
        <div className={styles.header}>
            <img src={misc_icon} alt="misc_icon" />
            <span className={styles.title}>Payment Methods</span>
        </div>
        <>
            {props.items.length ? props.items.map((item: item) => {
                return <div className={styles.item}>
                    <span className={styles.item_title}>{item._id}</span>
                    <span className={styles.item_amount}>{formatter(item.totalAmount)}</span>
                </div>
            })
            :
            <div className={styles.no_item}>
                <span>No Records Found</span>
            </div>
            }
        </>
    </div>
}

export default PaymentMethods