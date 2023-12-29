import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from './TransactionListStudent.module.css'
import { Dialog, TextareaAutosize, IconButton, Paper, MenuItem, Select, Tooltip } from '@mui/material'
import { Close, CloseRounded, ModeComment, Print } from '@mui/icons-material'
import DatePicker from '@/Elements/DatePicker/DatePicker'
import dayjs from 'dayjs'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import api from '@/store/api'
import { PaymentMethod } from '@/models/ExpenseTransaction'
import Receipt from '../Receipt/Receipt'
import { ReceiptModel } from '@/models/Receipt'
import { TransactionAPIData } from '@/models/TransactionList'
import { formatter } from '@/helpers/formatter'

export interface FormValues {
    paymentMethod: string,
    receiptStatus: 'REQUESTED' | 'CANCELLED' | 'REJECTED' | 'default',
    date?: string,
}

interface Props {
    onClose: Dispatch<SetStateAction<boolean>>
    studentId?: string
    sectionId?: string
    username?: string
}

interface ReceiptItem {
    _id: string,
    id: string,
    receiptId: string,
    issueDate: string,
    amount: number,
    paymentMode: string,
    status: string,
}

export interface ReceiptCancellationData {
    status: 'REQUESTED' | 'CANCELLED' | 'REJECTED',
    reason?: string
}


const TransactionListStudent = (props: Props) => {
    // API's
    const getReceiptbyIdAPI = api(state => state.getReceiptbyId)
    const getTransactionsbyStudentAPI = api(state => state.getTransactionsbyStudent)
    const cancelReceiptAPI = api(state => state.cancelReceipt)

    // Data Grid
    const columns: GridColDef[] = [
        { field: 'receiptId', headerName: 'Receipt Id', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 100 },
        { field: 'issueDate', headerName: 'Issue Date', width: 150 },
        { field: 'paymentMode', headerName: 'Payment Mode', width: 170 },
        {
            field: 'status', headerName: 'Status', width: 150,
            renderCell: (params) => (
                <>
                    <Tooltip title={params.row.reason && <span className={styles.tooltip}>{params.row.reason}</span>}>
                        <div className={`${styles.status} ${styles[params.row.status.toLowerCase()]}`}>
                            {params.row.status}
                        </div>
                    </Tooltip>
                </>

            )
        },
        {
            field: 'action',
            headerName: '',
            sortable: false,
            width: 160,
            align: 'right',

            renderCell: (params) => (
                <>
                    <IconButton
                        onClick={() => {
                            getReceiptbyId(params.row.id)
                        }}
                        sx={{
                            border: '1.5px solid #DBDBDB',
                            borderRadius: '04px',
                        }}>
                        <Print />
                    </IconButton>
                    {
                        params.row.comment &&
                        <Tooltip title={params.row.comment}>
                            <IconButton
                                sx={{
                                    border: '1.5px solid #DBDBDB',
                                    borderRadius: '04px',
                                    marginLeft: '15px'
                                }}
                            >
                                <ModeComment />
                            </IconButton>
                        </Tooltip>
                    }
                    {
                        (
                            params.row.status !== 'REQUESTED' &&
                            params.row.status !== 'CANCELLED'
                        ) &&
                        <IconButton
                            onClick={() => {
                                getReceiptbyIdforCancellation(params.row.id)
                            }}
                            sx={{
                                border: '1.5px solid #DBDBDB',
                                borderRadius: '04px',
                                marginLeft: '15px'
                            }}>
                            <Close />
                        </IconButton>
                    }
                </>
            ),
        },
    ]
    const [rows, setRows] = useState([])
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    })
    const [totalCount, setTotalCount] = useState(0)


    // Dialog
    const [dialogEnabled, setDialogEnabled] = useState(false)
    const [cancelDialogEnabled, setCancelDialogEnabled] = useState(false)
    const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel)

    // Filter
    const [formValues, setFormValues] = useState<FormValues>({
        paymentMethod: 'default',
        receiptStatus: 'default',
        date: '',
    })

    const [comment, setComment] = useState('')


    // Selectors
    const paymentMethods = [
        { value: 'CASH', label: 'Cash' },
        { value: 'CHEQUE', label: 'Cheque' },
        { value: 'ONLINE_TRANSFER', label: 'Online Transfer' },
        { value: 'UPI', label: 'UPI' },
        { value: 'DD', label: 'DD' },
        { value: 'DEBIT_CARD', label: 'Debit Card' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
    ]

    const receiptStatus = [
        { value: 'REQUESTED', label: 'Requested' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'REJECTED', label: 'Rejected' },
    ]

    // Handlers
    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
    }

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    }

    const getTransactionsbyStudent = async (paymentMethod?: PaymentMethod, status?: 'REQUESTED' | 'CANCELLED' | 'REJECTED' | 'default', date?: string) => {
        let data: TransactionAPIData = {}
        if (paymentMethod && paymentMethod !== 'default') {
            data.paymentMethod = paymentMethod
        }
        if (status && status !== 'default') {
            data.status = status
        }
        if (date && date !== '') {
            data.date = date
        }
        if (props.studentId) {
            data.studentId = props.studentId
        } else {
            data.sectionId = props.sectionId
            data.username = props.username
        }
        getTransactionsbyStudentAPI(data).then((response) => {
            try {
                if (response.status === 200) {
                    let data = response.data.data
                    data = data.map((item: ReceiptItem) => {
                        return {
                            ...item,
                            amount: `${formatter(item.amount)}`,
                            issueDate: dayjs(item.issueDate).format('DD/MM/YYYY'),
                            id: item._id,
                            status: item.status ? item.status : 'PAID'
                        }
                    })
                    setRows(data)
                    setTotalCount(response.data.resultCount)
                }
            } catch (error) {
                setRows([])
                setTotalCount(0)
            }

        })
    }

    const handleFilter = (paymentMethod?: PaymentMethod, status?: 'REQUESTED' | 'CANCELLED' | 'REJECTED' | 'default', date?: string) => {
        getTransactionsbyStudent(paymentMethod, status,
            date &&
            dayjs(date).format('DD/MM/YYYY'))
    }

    const getReceiptbyId = (receiptId: string) => {
        getReceiptbyIdAPI(receiptId).then((response) => {
            if (response && response.status === 200) {
                setReceipt(response.data.data)
                setDialogEnabled(true)
            }
        })
    }

    const getReceiptbyIdforCancellation = (receiptId: string) => {
        getReceiptbyIdAPI(receiptId).then((response) => {
            if (response && response.status === 200) {
                setReceipt(response.data.data)
                setCancelDialogEnabled(true)
            }
        })
    }

    const cancelReceipt = () => {
        let data: ReceiptCancellationData = {
            reason: comment,
            status: 'REQUESTED'
        }
        if (comment) {
            cancelReceiptAPI(receipt._id, data).then((response) => {
                if (response && response.status === 200) {
                    setComment('')
                    setCancelDialogEnabled(false)
                    getTransactionsbyStudent()
                }
            })
        }
    }

    useEffect(() => {
        getTransactionsbyStudent()
    }, [])

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <span className={styles.title}>All Transactions</span>
                <IconButton onClick={
                    () => {
                        props.onClose(false)
                    }
                }>
                    <Close />
                </IconButton>
            </div>
            <div className={styles.filter}>
                <div className={styles.filter_item}>
                    <Select
                        className={styles.selector}
                        onChange={(e) => {
                            handleFilter(e.target.value as PaymentMethod, formValues.receiptStatus, formValues.date)
                            setFormValues({ ...formValues, paymentMethod: e.target.value })
                        }}
                        value={formValues.paymentMethod}
                        endAdornment={
                            formValues.paymentMethod !== 'default' && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        handleFilter(undefined, formValues.receiptStatus, formValues.date)
                                        setFormValues({ ...formValues, paymentMethod: 'default' })
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            )
                        }
                        IconComponent={
                            formValues.paymentMethod == 'default' ? undefined : () => null
                        }
                    >
                        <MenuItem value="default">Payment Method</MenuItem>
                        {paymentMethods.map((item: any) => {
                            return (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </div>
                <div className={styles.filter_item}>
                    <Select
                        className={styles.selector}
                        onChange={(e) => {
                            handleFilter(formValues.paymentMethod as PaymentMethod, e.target.value as 'REQUESTED' | 'CANCELLED' | 'REJECTED' | 'default', formValues.date)
                            setFormValues({ ...formValues, receiptStatus: e.target.value as 'REQUESTED' | 'CANCELLED' | 'REJECTED' | 'default' })
                        }}
                        value={formValues.receiptStatus}
                        endAdornment={
                            formValues.receiptStatus !== 'default' && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        handleFilter(formValues.paymentMethod as PaymentMethod, undefined, formValues.date)
                                        setFormValues({ ...formValues, receiptStatus: 'default' })
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            )
                        }
                        IconComponent={
                            formValues.receiptStatus == 'default' ? undefined : () => null
                        }
                    >
                        <MenuItem value="default">Receipt Status</MenuItem>
                        {receiptStatus.map((item: any) => {
                            return (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </div>
                <div className={styles.filter_item}>
                    <DatePicker
                        label={''}
                        value={formValues.date !== '' ? dayjs(formValues.date) : null}
                        onChange={(date) => {
                            handleFilter(formValues.paymentMethod as PaymentMethod, formValues.receiptStatus as 'REQUESTED' | 'CANCELLED' | 'REJECTED' | 'default', date)
                            setFormValues({
                                ...formValues,
                                date: date ? date.format('MM/DD/YYYY') : undefined
                            })
                        }}
                    />
                </div>
            </div>
            <div className={styles.table}>
                <DataGrid
                    sx={{ border: '0px' }}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                    paginationModel={paginationModel}
                    paginationMode="client"
                    onPaginationModelChange={handlePageChange}
                    rowCount={totalCount}
                />
            </div>
            <Dialog open={dialogEnabled} maxWidth='xl'>
                <Receipt
                    receipt={receipt}
                    setDialogEnabled={setDialogEnabled}
                />
            </Dialog>
            <Dialog open={cancelDialogEnabled} maxWidth='xl'>
                <Receipt
                    receipt={receipt}
                    setDialogEnabled={setCancelDialogEnabled}
                />
                <div style={{ margin: '20px 20px' }}>
                    <Paper
                        className={styles.input_desc} >
                        <TextareaAutosize
                            placeholder='Reason for Cancellation'
                            className={styles.input_input_desc}
                            value={comment}
                            onChange={handleCommentChange}
                        />
                    </Paper>
                </div>
                <div className={styles.reason_footer}>
                    <button disabled={comment === ''}
                        className={
                            `${!comment && styles.disabled}`
                        }
                        onClick={() => { cancelReceipt() }}
                    >Proceed to Cancellation</button>
                </div>
            </Dialog>
        </div >
    )
}

export default TransactionListStudent