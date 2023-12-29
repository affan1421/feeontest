import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import styles from './DatePickerUI.module.css'

interface Props {
    label: string,
    value: Dayjs | null,
    onChange: (e: any) => void
}

const DatePickerUI = (props: Props) => {
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    format='DD/MM/YYYY'
                    componentsProps={{
                        actionBar: {
                            actions: ['clear'],
                        },
                    }}
                    sx={{
                        '& .MuiInputBase-root': {
                            height: '42px', // Change the height here
                        },
                    }}
                    label={props.label}
                    value={props.value} onChange={props.onChange} />
            </LocalizationProvider>
        </div>

    )
}

export default DatePickerUI