import styles from './StudentDetails.module.css'
import user from '@/assests/user.png'

interface Student {
    username: string,
    studentName: string,
    parentName: string,
    class: string
    profile_image: string
}

interface Props {
    student: Student;
}

const StudentDetails = (props: Props) => {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.profile}>
                    {props.student.profile_image ?
                        <img
                            src={props.student.profile_image}
                            className={styles.cell_image}
                        />
                        :
                        <img
                            className={styles.cell_image}
                            src={user}
                        />
                    }
                </div>
                <div className={styles.header_item}>
                    <span className={styles.label}>Student Name</span>
                    <span className={styles.value}>{props.student.studentName}</span>
                </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.item}>
                <span className={styles.label}>Class</span>
                <span className={styles.value}>{props.student.class}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>Parent Name</span>
                <span className={styles.value}>{props.student.parentName}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>Contact number</span>
                <span className={styles.value}>{props.student.username}</span>
            </div>
        </div >
    )
}

export default StudentDetails