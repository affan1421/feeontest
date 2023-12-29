import React from 'react'
import styles from './UploadProof.module.css'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton } from '@mui/material'

const UploadProof = (props: any) => {

    const handleClose = () => {
        props.setDialogEnabled(false)
    }


    return (
        <Dialog open={true} onClose={handleClose} maxWidth='xl'>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Upload Vehicle Images</h1>
                    <IconButton
                        sx={{ p: "10px" }}
                        onClick={() => props.setDialogEnabled(false)}
                    >
                        <Close />
                    </IconButton>
                </div>
                <div className={styles.action}>
                    <button className={styles.cancel}>Cancel</button>
                    <button className={styles.add}>Save</button>
                </div>
            </div>
        </Dialog>
    )
}

export default UploadProof