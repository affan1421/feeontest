import { Close } from '@mui/icons-material'
import styles from './IntervalSelector.module.css'
import { Dispatch, SetStateAction } from 'react'
import CustomDateRangePicker from '@/Elements/CustomDateRangePicker/CustomDateRangePicker'
import { parseDate } from '@internationalized/date';

interface Props {
    setInterval: (interval: 'daily' | 'weekly' | 'monthly' | 'custom' | null) => void
    interval: 'daily' | 'weekly' | 'monthly' | 'custom' | null
    setDialogEnabled?: Dispatch<SetStateAction<boolean>>
    dialogEnabled?: boolean
    range: any,
    handleCustomDateRangePicker: any
    setRange?: any
}

const IntervalSelector = (props: Props) => {
    return (
        <div className={styles.main}>
            <div
                className={`${styles.item} ${props.interval == 'daily' ? styles.active : ''}`}
                onClick={() => props.setInterval('daily')}>
                Daily
            </div>
            <div
                className={`${styles.item} ${props.interval == 'weekly' ? styles.active : ''}`}
                onClick={() => props.setInterval('weekly')}>
                Weekly
            </div>
            <div
                className={`${styles.item} ${props.interval == 'monthly' ? styles.active : ''}`}
                onClick={() => props.setInterval('monthly')}>
                Monthly
            </div>
            <div className={styles.custom}>
                <CustomDateRangePicker
                    setRange={props.handleCustomDateRangePicker}
                    range={props.range}
                />
            </div>
            {
                ((props.interval !== 'daily')) && <div
                    className={`${styles.item} ${props.interval !== null || props.interval !== 'daily' ? styles.active : ''}`}
                    onClick={() => {
                        props.setInterval(null)
                        props.setRange(null)
                    }
                    }>
                    <Close />
                </div>
            }

        </div >
    )
}

export default IntervalSelector
