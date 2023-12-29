import styles from './TotalStudents.module.css';
import Student_icon from '../../assests/Student_Icon.svg';
import boys_icon from '../../assests/boys_icon.svg';
import girls_icon from '../../assests/girls_icon.svg'

interface TotalStudentProps {
    totalCount: number;
    boysCount: number
    girlsCount: number
}

const TotalStudent = (props: TotalStudentProps) => {
    return (
        <>
            <div className={styles.main}>
                <div className={styles.header}>
                    <img src={Student_icon} />
                    <span>Total Students</span>
                </div>
                <div className={styles.amount}>
                    <span>{props.totalCount}</span>
                </div>
                <div className={styles.row}>
                    <div className={styles.boys}>
                        <img src={boys_icon} />&nbsp;
                        <div className={styles.data}>
                            <span className={styles.font}>Boys</span>
                            <span className={styles.font_amt}>{props.boysCount}</span>
                        </div>
                    </div>
                    <div className={styles.girls}>
                        <img src={girls_icon} />&nbsp;
                        <div className={styles.data}>
                            <span className={styles.font}>Girls</span>
                            <span className={styles.font_amt}>{props.girlsCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TotalStudent