import styles from './DiscountComment.module.css'
import React, { useState } from 'react'
import { Dialog, IconButton, Paper, TextareaAutosize } from '@mui/material'
import { Close } from '@mui/icons-material'

interface DiscountComment{
    studentName: string,
    class: string,
    discountCategory: string,
    comment: string,
    url:string,
}

const DiscountComment = (props: DiscountComment) => {
    const [dialog, setDialog] = useState(true)
    const [description, setDescription] = useState('');

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
    }

    const handleSubmit = () => {

    }
    return (
        <>
            <Dialog open={dialog} maxWidth='xl'>
                <div className={styles.dialog}>
                    <div className={styles.dialog_header}>
                        <h1>{props.studentName}</h1>
                        <IconButton sx={{ p: '10px' }} aria-label="menu" data-testid='close' onClick={(() => {
                            setDialog(false)
                        })} >
                            <Close />
                        </IconButton>
                    </div>
                    <div className={styles.row}>
                        <div><span className={styles.heading}>Class</span>&nbsp;&nbsp;<span className={styles.details}>{props.class}</span></div>
                        <div><span className={styles.heading}>Discount Category</span>&nbsp;&nbsp;<span className={styles.details}>{props.discountCategory}</span></div>
                    </div>
                    <div style={{ margin: '20px 0px' }}>
                        <div className={styles.title}>
                            <h1>Discount Comment</h1>
                       </div>
                        <Paper

                            className={styles.input_desc} >
                            <TextareaAutosize
                                data-testid='add-description'
                                placeholder='Write Something'
                                id="filled-hidden-label-small"
                                className={styles.input_input_desc}
                                value={props.comment}
                                onChange={handleDescriptionChange}
                                readOnly
                            />
                        </Paper>
                    </div>
                    <div className={styles.download}>
                        <span>{props.url}</span>
                    </div>
                </div>
            </Dialog>

        </>
    )
}

export default DiscountComment