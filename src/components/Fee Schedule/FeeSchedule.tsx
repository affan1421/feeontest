import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Paper, InputBase, TextareaAutosize, Select, SelectChangeEvent, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import styles from './FeeSchedule.module.css'
import { FeeScheduleModel } from '../../models/FeeSchedule'
import api from '../../store/api'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { FeeScheduleSchema } from '../../FormSchema/FormValidation'

const FeeSchedule = (props: any) => {
    // APS's
    const createFeeScheduleAPI = api((state) => state.createFeeSchedule)
    const getFeeSchedulesAPI = api((state) => state.getFeeSchedules)
    const updateFeeScheduleAPI = api((state) => state.updateFeeSchedule)
    const getYearAcademicInfoAPI = api((state) => state.getYearAcademicInfo)
    const setError = api((state) => state.setError)

    // Data variables
    const [dialogEnabled, setDialogEnabled] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [feeSchedule, setFeeSchedule] = useState<FeeScheduleModel>({
        scheduleName: '',
        description: '',
        day: 'default',
        months: [],
        categoryId: props.id
    })

    const defaultMonths = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ]

    const [months, setMonths] = useState([
    ])

    const [selectedMonths, setSelectedMonths]: any = useState<string[]>([
        'Select Month'
    ]);

    const [monthsIndex, setMonthsIndex] = useState([])

    const [rows, setRows] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const columns: GridColDef[] = [
        { field: 'scheduleName', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'interval', headerName: 'Repeat Every', width: 300 },
        {
            field: 'edit',
            headerName: '',
            sortable: false,
            width: 250,
            align: 'right',

            renderCell: () => (
                <IconButton
                    data-testid='edit-btn'
                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                    <EditOutlinedIcon />
                </IconButton>
            ),
        },
    ];
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    // LifeCyle Hooks
    useEffect(() => {
        getFeeSchedules(paginationModel.page, paginationModel.pageSize, localStorage.getItem('school_id') as string)
        getMonths()
    }, [])

    // Input Value Handlers
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeeSchedule({
            ...feeSchedule,
            scheduleName: event.target.value,
        })
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeeSchedule({
            ...feeSchedule,
            description: event.target.value,
        })
    }

    const handleMonthChange = (event: SelectChangeEvent<typeof months>) => {
        setSelectedMonths(
            event.target.value
        )
    }

    useEffect(() => {
        let newMonths = selectedMonths.map((month: any) => {
            return defaultMonths.indexOf(month) + 1;
        })
        newMonths = newMonths.filter((element: any) => element !== 0)
        setFeeSchedule({
            ...feeSchedule,
            months: newMonths
        })
        console.log(newMonths);
    }, [selectedMonths])

    const handleDayChange = (event: SelectChangeEvent<typeof months>) => {
        setFeeSchedule({ ...feeSchedule, day: Number(event.target.value) })
    };

    // Handle Submissions
    const handleSubmit = async () => {
        try {
            await FeeScheduleSchema.validate(feeSchedule, { abortEarly: false });
            let schoolId: any = localStorage.getItem('school_id')
            if (schoolId !== '' && schoolId.length == 24) {
                await createFeeScheduleAPI({ ...feeSchedule, schoolId: schoolId, existMonths: monthsIndex }).then((response: Response) => {
                    if (response.status == 201) {
                        setDialogEnabled(false)
                        setFeeSchedule({
                            ...feeSchedule,
                            scheduleName: '',
                            description: '',
                            day: 0,
                            months: [],
                        })
                        setSelectedMonths(['Select Month'])
                        setTimeout(() => {
                            getFeeSchedules(paginationModel.page, paginationModel.pageSize, localStorage.getItem('school_id') as string)
                        }, 3000)
                    }
                })
            }
        } catch (error: any) {
            const errorMessage = error.errors.join('\n');
            setError(true, errorMessage);
            setTimeout(() => {
                setError(false, '');
            }, 2000)
        }
    }

    const handleUpdate = async () => {
        try {
            await FeeScheduleSchema.validate(feeSchedule, { abortEarly: false });
            const school_id: string | any = localStorage.getItem('school_id')
            if (school_id !== '' && school_id.length == 24) {
                await updateFeeScheduleAPI({ ...feeSchedule, schoolId: school_id, existMonths: monthsIndex }).then((response: any) => {
                    if (response.status == 200) {
                        setDialogEnabled(false)
                        setFeeSchedule({
                            ...feeSchedule,
                            scheduleName: '',
                            description: '',
                            day: 0,
                            months: [],
                        })
                        setTimeout(() => {
                            getFeeSchedules(paginationModel.page, paginationModel.pageSize, localStorage.getItem('school_id') as string)
                        }, 3000)
                    }
                })
            }
        } catch (error: any) {
            const errorMessage = error.errors.join('\n');
            setError(true, errorMessage);
            setTimeout(() => {
                setError(false, '');
            }, 2000)
        }
    }

    // Get and Edit
    const getFeeSchedules = (page: number, limit: number, schoolId: string, scheduleType?: '') => {
        getFeeSchedulesAPI(page, limit, schoolId, props.id, scheduleType).then((response: any) => {
            if (response && response?.status == 200) {
                let data: any = response?.data?.data
                data = data?.map((item: any) => {
                    return {
                        id: item._id,
                        scheduleName: item.scheduleName,
                        description: item.description,
                        interval: `${addOrdinalSuffix(item.day)} of ${[...getMonthNames(item.months).splice(0, 3), '...']}`,
                        day: item.day,
                        months: item.months
                    }
                })
                setRows(data)
                setTotalCount(response?.data?.resultCount)
            }
        })
    }

    function addOrdinalSuffix(number: number) {
        if (isNaN(number)) {
            return number;
        }

        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return `${number}th`;
        } else if (lastDigit === 1) {
            return `${number}st`;
        } else if (lastDigit === 2) {
            return `${number}nd`;
        } else if (lastDigit === 3) {
            return `${number}rd`;
        } else {
            return `${number}th`;
        }
    }

    const EditFeeSchedule = (data: any) => {
        setIsEdit(true)
        setFeeSchedule({
            ...feeSchedule,
            scheduleName: data.row.scheduleName,
            description: data.row.description,
            day: data.row.day,
            months: data.row.months,
            id: data.row.id
        })
        setSelectedMonths(getMonthNames(data.row.months))
        setDialogEnabled(true)
    }

    // Pagination
    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
        getFeeSchedules(data.page, data.pageSize, localStorage.getItem('school_id') as string)
    }

    const getMonths = () => {
        let apiMonths: any = []
        getYearAcademicInfoAPI(localStorage.getItem('school_id') as string, 0, 1000, true).then((response: any) => {
            let monthsIndex = response.data.data[0].months
            setMonthsIndex(monthsIndex)
            apiMonths = monthsIndex.map((index: any) => defaultMonths[index - 1])
            apiMonths.unshift('Select Month')
            setMonths(apiMonths)
        })
    }

    function getMonthNames(monthNumbers: any) {
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        return monthNumbers.map((num: any) => monthNames[num - 1]);
    }

    return (
        <>
            <div className={styles.main}>
                <div className={styles.header}>
                    <button
                        data-testid='add-new'
                        onClick={() => {
                            setDialogEnabled(true)
                            setIsEdit(false)
                            setSelectedMonths(['Select Month'])
                            setFeeSchedule({ ...feeSchedule, day: 'default' })
                        }}>Add New</button>
                </div>
                <div className={styles.container}>
                    <div data-testid='datagrid' style={{ height: 425, background: 'white', padding: '20px', borderRadius: '10px' }}>
                        <DataGrid
                            sx={{ border: '0px' }}
                            rows={rows}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                            onCellClick={EditFeeSchedule}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={handlePageChange}
                            rowCount={totalCount}
                        />
                    </div>
                </div>
                <Dialog open={dialogEnabled} onClose={(()=>{setDialogEnabled(false)})} maxWidth='xl'>
                    <div className={styles.dialog}>
                        <div className={styles.dialog_header}>
                            <h1>Fee Schedule</h1>
                            <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={() => {
                                setDialogEnabled(false);
                                setFeeSchedule({
                                    ...feeSchedule,
                                    scheduleName: '',
                                    description: '',
                                    day: 0,
                                    months: [],
                                })
                            }} data-testid='close'>
                                <Close />
                            </IconButton>
                        </div>
                        <div className={styles.dialog_container}>
                            <div>
                                <span className={styles.label}>Name</span>
                                <br />
                                <Paper

                                    className={styles.input} >
                                    <InputBase
                                        placeholder='Name'
                                        id="filled-hidden-label-small"
                                        size="small"
                                        className={styles.input_input}
                                        value={feeSchedule.scheduleName}
                                        onChange={handleNameChange}
                                        data-testid='add-name'
                                    />
                                </Paper>
                            </div>
                            <div style={{ margin: '20px 0px' }}>
                                <span className={styles.label}>Description</span>
                                <br />
                                <Paper

                                    className={styles.input_desc} >
                                    <TextareaAutosize
                                        data-testid='add-description'
                                        placeholder='Description'
                                        id="filled-hidden-label-small"
                                        className={styles.input_input_desc}
                                        value={feeSchedule.description}
                                        onChange={handleDescriptionChange}
                                    />
                                </Paper>
                            </div>
                            <div className={styles.start_and_end}>
                                <div style={{ width: '50%', marginRight: '10px' }}>
                                    <br />
                                    <Select
                                        className={styles.selector}
                                        value={feeSchedule.day}
                                        onChange={handleDayChange}
                                    >
                                        <MenuItem value='default' disabled>Select Day</MenuItem>
                                        {[...Array(31)].map((_, i) => (
                                            <MenuItem value={i + 1}>{i + 1}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <br />
                                    <Select
                                        className={styles.selector}
                                        renderValue={(selected: any) => selected.join(', ')}
                                        multiple
                                        value={selectedMonths}
                                        onChange={handleMonthChange}
                                    >
                                        {months?.map((month: any) => (
                                            <MenuItem key={month} value={month}
                                                placeholder='Select Month'
                                                disabled={month === 'Select Month'}>
                                                {month !== 'Select Month' && <Checkbox checked={selectedMonths.indexOf(month) > -1} />}
                                                <ListItemText primary={month} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>

                            </div>
                        </div>
                        <div className={styles.dialog_footer}>
                            {!isEdit ?
                                <button
                                    data-testid='add-save'
                                    onClick={() => {
                                        handleSubmit()
                                    }}>Save</button> :
                                <button onClick={() => {
                                    handleUpdate()
                                }}>Update</button>}
                        </div>
                    </div>
                </Dialog >
            </div >
        </>
    )
}

export default FeeSchedule