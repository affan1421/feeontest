import React from 'react'
import styles from './DuesCard.module.css'
import feecollection_icon from '../../assests/feecollection_icon.svg'

const DuesCard = (props: any) => {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <>
            <div className={styles.main}>
                <div className={styles.header}>
                    <img src={feecollection_icon} />
                    <span>Dues</span>
                </div>
                <div className={styles.row}>
                    <div className={styles.receivable}>
                        <div>
                            <span className={styles.amount}>{formatter.format(props.receivable)}</span>
                        </div>
                        <div>
                            <span className={styles.text}>Receivable</span>
                        </div>
                    </div>
                    <div className={styles.amountDue}>
                        <div>
                            <span className={styles.amount}>{formatter.format(props.amountDue)}</span>
                        </div>
                        <div>
                            <span className={styles.text}>Amount Due</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DuesCard