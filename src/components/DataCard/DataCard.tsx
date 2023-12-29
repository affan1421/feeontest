import styles from './DataCard.module.css';
import feecollection_icon from '../../assests/feecollection_icon.svg';
import totalpending_icon from '../../assests/totalpending_icon.svg';
import totalreceivable_icon from '../../assests/totalreceivable_icon.svg';

interface Props {

    title: string;
    totalAmount: number;
    icon: 'totalrecievable' | 'totalpending' | 'feecollection';
    maxClass?: {
        amount: number;
        sectionId?: {
            className: string
            sectionName: string
            _id: string
        }
    }
    minClass?: {
        amount: number;
        sectionId?: {
            className: string
            sectionName: string
            _id: string
        }
    }
    maxExpType?: {
        expenseType: {
            name: string
        }
        totalExpAmount: number,
    },
    minExpType?: {
        expenseType: {
            name: string
        }
        totalExpAmount: number,
    }
    format:boolean
}

const formatNumber = (value: number): string => {
    if (value >= 1e12) {
        return (value / 1e12).toFixed(0) + 'T';
    } else if (value >= 1e9) {
        return (value / 1e9).toFixed(0) + 'B';
    } else if (value >= 1e6) {
        return (value / 1e6).toFixed(0) + 'M';
    } else if (value >= 1e3) {
        return (value / 1e3).toFixed(0) + 'K';
    }
    return value.toFixed(0);
}

const DataCard = (props: Props) => {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const formatAmount = (amount: number) => {
        return formatNumber(amount).replace(/[.,]00$/, '');
    };
    return (
        <>
            <div className={styles.main}>
                <div className={styles.header}>
                    {props.icon === 'totalrecievable' ? (
                        <img src={totalreceivable_icon} />
                    ) : null}
                    {props.icon === 'totalpending' ? (
                        <img src={totalpending_icon} />
                    ) : null}
                    {props.icon === 'feecollection' ? (
                        <img src={feecollection_icon} />
                    ) : null}
                    <span>{props.title}</span>
                </div>
                <div className={styles.amount}>
                    <span>{props.format ? formatter.format(props.totalAmount): props.totalAmount}</span>
                </div>
                <div className={styles.row}>
                    {
                        props.maxClass &&
                        <div className={styles.max}>
                            <span className={`${styles.classTitle} ${styles.maxTitle}`}>MAX</span>
                            <div className={styles.max_sub}>
                                <span className={styles.class}>{props.maxClass?.sectionId ? props.maxClass.sectionId?.className : '-'}</span>
                                <span className={styles.totamount}>{formatAmount(props.maxClass?.amount)}</span>
                            </div>
                        </div>
                    }
                    {
                        props.minClass &&
                        <div className={styles.min}>
                            <span className={`${styles.classTitle} ${styles.minTitle}`}>MIN</span>
                            <div className={styles.min_sub}>
                                <span className={styles.class}>{props.minClass?.sectionId ? props.minClass.sectionId?.className : '-'}</span>
                                <span className={styles.totamount}>{formatAmount(props.minClass?.amount)}</span>
                            </div>
                        </div>
                    }
                    {
                        props.minExpType &&
                        <div className={styles.min}>
                            <span className={`${styles.classTitle} ${styles.minTitle}`}>MIN</span>
                            <div className={styles.min_sub}>
                                <span className={styles.class}>{props.minExpType?.expenseType ? props.minExpType?.expenseType?.name : '-'}</span>
                                <span className={styles.totamount}>{formatAmount(props.minExpType.totalExpAmount)}</span>
                            </div>
                        </div>
                    }
                    {
                        props.maxExpType &&
                        <div className={styles.max}>
                            <span className={`${styles.classTitle} ${styles.maxTitle}`}>MAX</span>
                            <div className={styles.max_sub}>
                                <span className={styles.class}>{props.maxExpType?.expenseType ? props.maxExpType?.expenseType?.name : '-'}</span>
                                <span className={styles.totamount}>{formatAmount(props.maxExpType.totalExpAmount)}</span>
                            </div>
                        </div>
                    }

                </div>
            </div >
        </>
    )
}

export default DataCard