import { Paper, TextareaAutosize } from '@mui/material'
import styles from './RejectDialog.module.css'
import { useState } from 'react'
import api from '@/store/api'
import { ApprovalAPIData } from '@/models/PaymentConfirmation'

interface Props {
    handleClose: () => void
    receiptId: string
}

const RejectDialog = (props: Props) => {
    // API's
    const approvalPaymentConfirmationAPI = api(state => state.approvalPaymentConfirmation)

    const [description, setDescription] = useState('')

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
    }

    const handleSubmit = () => {
        let data: ApprovalAPIData = {
            status: 'DECLINED',
            comment: description
        }
        approvalPaymentConfirmationAPI(data, props.receiptId).then((response) => {
            if (response.status == 200) {
                props.handleClose()
            }
        })
    }

    return (
        <div className={styles.main}>
            <span className={styles.title}>Reject Payment Confirmation</span>
            <Paper
                className={styles.input_desc} >
                <TextareaAutosize
                    placeholder='Write a Reason for Rejecting'
                    className={styles.input_input_desc}
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </Paper>
            <div className={styles.actions}>
                <button className={styles.close} onClick={() => {
                    setDescription('')
                    props.handleClose()
                }} >Close</button>
                <button className={styles.reject} onClick={handleSubmit}>Reject</button>
            </div>
        </div>
    )
}

export default RejectDialog