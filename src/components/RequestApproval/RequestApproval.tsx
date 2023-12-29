import React, { useState } from 'react'
import styles from './RequestApproval.module.css'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton } from '@mui/material'

const RequestApproval = () => {
    const [dialog, setDialog] = useState(true)
    const PaymentDetails = {
        paymentMode: 'cheque',
        bankName: 'Canara bank',
        Id: '12345678',
        date:'06/7/2023'
    }
    return (
        <>
            <Dialog open={dialog} maxWidth='xl'>
                <div className={styles.dialog}>
                    <div className={styles.dialog_header}>
                        <h1>Requesting Again for Approval</h1>
                        <IconButton sx={{ p: '10px' }} aria-label="menu" data-testid='close' onClick={(() => {
                            setDialog(false)
                        })} >
                            <Close />
                        </IconButton>
                    </div>
                    <div className={styles.heading}>
                        <span>Payment Details</span>
                    </div>
                    <div className={styles.row}>
                        <div>
                            <span>Payment Mode</span>&nbsp;&nbsp;<span className={styles.detail}>{PaymentDetails.paymentMode}</span>&nbsp;&nbsp;
                            <span>Bank Name</span>&nbsp;&nbsp;<span className={styles.detail}>{PaymentDetails.bankName}</span>

                        </div>
                    </div>
                    <div className={styles.row}>
                        <div>
                            <span>Cheque Number</span>&nbsp;&nbsp;<span className={styles.detail}>{PaymentDetails.Id}</span>&nbsp;&nbsp;
                            <span>Cheque Date</span>&nbsp;&nbsp;<span className={styles.detail}>{PaymentDetails.date}</span>

                        </div>
                    </div>
                    <div className={styles.comment}>
                        <span>Comment By admin</span>
                    </div>
                    <div className={styles.row}>
                        <p>Your approval is essentail for generating the bill and completing the
                        <br />
                        payment process.Please review and provide your approval
                    </p>
                    </div>
                </div>
            </Dialog>

        </>
    )
}

export default RequestApproval