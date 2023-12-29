import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@mui/material'
import { Alert_Message_Model } from '../models/Alert_Message'


const Alert_Message: React.FC<Alert_Message_Model> = ({ isSnackbar, isAlert, AlertProperties, SnackbarProperties }) => {
    const [open, setOpen]: any = useState(true)
    return (
        <>
            {
                isAlert ?
                    <>
                        {/* Alert Logic */}
                        <Alert
                            severity={AlertProperties?.severity}
                            sx={{ width: AlertProperties?.width }}
                        >
                            {AlertProperties?.message}
                        </Alert>
                    </> :
                    <>
                        {/* Snackbar Logic */}
                        <Snackbar
                            autoHideDuration={SnackbarProperties?.autoHideDuration}
                            open={open}
                            onClose={() => {
                                setOpen(SnackbarProperties?.noHide ? true : false)
                            }}
                        >
                            <Alert severity={AlertProperties?.severity} sx={{ width: AlertProperties?.width }}>
                                {AlertProperties?.message}
                            </Alert>
                        </Snackbar>

                    </>
            }
        </>

    )
}

export default Alert_Message