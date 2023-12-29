import { StudentModel } from '@/models/Student'
import styles from './StudentListCard.module.css'
import user from '@/assests/user.png'
import { IconButton } from '@mui/material'
import { ArrowOutward } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import global from '@/store/global'

interface Props {
    student: StudentModel
}

const StudentListCard = (props: Props) => {
    const setSearchDialog = global(state => state.setSearchDialog);
    const navigate = useNavigate()

    const handleClick = (id: string) => {
        setSearchDialog(false)
        navigate(`/studentReport/${id}`)
    }

    return (
        <div className={styles.main} onClick={() => {
            handleClick(props.student._id)
        }}>
            <div className={styles.left}>
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
                <div className={styles.details}>
                    <span>{props.student.name}</span>
                    <div className={styles.tags}>
                        {props.student.class && <span className={styles.status}>Class: {props.student.class}</span>}
                        {props.student.parentName && <span className={styles.status}>Parent: {props.student.parentName}</span>}
                    </div>
                    <span><b>Contact</b>: +91 {props.student.username}</span>
                </div>
            </div>
            <div className={styles.details}>
                <IconButton
                    onClick={() => {
                        handleClick(props.student._id)
                    }}
                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                    <ArrowOutward />
                </IconButton>
            </div>
        </div>
    )
}

export default StudentListCard