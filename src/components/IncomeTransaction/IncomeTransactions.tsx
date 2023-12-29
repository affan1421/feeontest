import api from '@/store/api'
import { useEffect, useState } from 'react'
import { Dialog, IconButton, MenuItem, Select, Tooltip } from '@mui/material'
import { Close, CloseRounded, Download, ModeComment, Print } from '@mui/icons-material'
import { Transaction, FormValues } from '@/models/Transaction'
import { Class } from '@/models/Class'
import Input from '@/Elements/Input/Input'
import styles from './IncomeTransaction.module.css'
import Receipt from '@/components/Receipt/Receipt'
import { ReceiptModel } from '@/models/Receipt'
import { read, writeFile } from 'xlsx';
import CustomDateRangePicker from '@/Elements/CustomDateRangePicker/CustomDateRangePicker'
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Paper,
} from '@mui/material';
import { formatter } from '@/helpers/formatter'

const IncomeTransactions = () => {
    // School ID
    const schoolId = localStorage.getItem('school_id') as string

    // API's
    const getTransactionsAPI = api(state => state.getTransactions)
    const getIncomeExcelAPI = api(state => state.getIncomeExcel)
    const getClassesAPI = api(state => state.getClasses)
    const getReceiptbyIdAPI = api(state => state.getReceiptbyId)

    const [rows, setRows] = useState<Transaction[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const [range, setRange] = useState(null)

    const columns = [
        { id: 'name', label: 'Name' },
        { id: 'admission_no', label: 'Admission No.' },
        { id: 'parentName', label: 'Parent Name' },
        { id: 'className', label: 'Class Name' },
        { id: 'amount', label: 'Amount' },
        { id: 'description', label: 'Description' },
        { id: 'receiptId', label: 'Receipt ID' },
        { id: 'issueDate', label: 'Date' },
        { id: 'paymentMode', label: 'Payment Mode' },
        { id: 'No', label: 'No' },
        { id: '_id', label: '' },
    ]
    const rowsPerPageOptions = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

    const [formValues, setFormValues] = useState<FormValues>({
        searchTerm: '',
        section: 'default',
        paymentMethod: 'default',
        startDate: '',
        endDate: '',
    })

    const [classes, setClasses] = useState<Class[]>([])
    const [dialogEnabled, setDialogEnabled] = useState(false)
    const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel)
    const [summary, setSummary] = useState(0)

    const paymentMethods = [
        { value: 'CASH', label: 'Cash' },
        { value: 'CHEQUE', label: 'Cheque' },
        { value: 'ONLINE_TRANSFER', label: 'Online Transfer' },
        { value: 'UPI', label: 'UPI' },
        { value: 'DD', label: 'DD' },
        { value: 'DEBIT_CARD', label: 'Debit Card' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
    ]

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        getTransactions(
            schoolId,
            newPage,
            rowsPerPage,
            formValues.searchTerm !== 'default' ? formValues.searchTerm : undefined,
            formValues.section !== 'default' ? formValues.section : undefined,
            formValues.paymentMethod !== 'default' ? formValues.paymentMethod as 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD' : undefined,
            formValues.startDate !== '' ? (formValues.startDate) : undefined,
            formValues.endDate !== '' ? (formValues.endDate) : undefined,
        )
    };

    const dateFormatter = (date: string): string => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(date).toLocaleDateString('en-GB', options);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPage(0);
        setRowsPerPage(newRowsPerPage);
        getTransactions(
            schoolId,
            0,
            newRowsPerPage,
            formValues.searchTerm !== 'default' ? formValues.searchTerm : undefined,
            formValues.section !== 'default' ? formValues.section : undefined,
            formValues.paymentMethod !== 'default' ? formValues.paymentMethod as 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD' : undefined,
            formValues.startDate !== '' ? (formValues.startDate) : undefined,
            formValues.endDate !== '' ? (formValues.endDate) : undefined,
        )
    };


    const debouncedHandleSearch = (searchValue: string) => {
        clearTimeout(debounceTimer!)
        const timer = setTimeout(() => {
            handleFilter(searchValue, formValues.section, formValues.paymentMethod, formValues.startDate, formValues.endDate);
        }, 500)
        setDebounceTimer(timer)
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value as string;
        setFormValues({ ...formValues, searchTerm: searchValue })
        debouncedHandleSearch(searchValue)
    };

    const getTransactions = async (
        schoolId: string,
        page: number,
        limit: number,
        searchTerm?: string,
        section_id?: string,
        paymentMethod?: 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD',
        startDate?: string | undefined,
        endDate?: string | undefined
    ) => {
        getTransactionsAPI(
            schoolId,
            page, limit,
            section_id ? section_id : undefined,
            paymentMethod ? paymentMethod : undefined,
            searchTerm ? searchTerm : undefined,
            undefined,
            startDate ? startDate : undefined,
            endDate ? endDate : undefined,
            undefined
        ).then(async (response) => {
            if (response && response.status === 200) {
                let data = await response.data.data
                data = data.data.map((item: Transaction) => {
                    return {
                        ...item,
                        description: item.items,
                    }
                })
                setRows(data)
                setTotalCount(response.data.resultCount)
                setSummary(Number(response.data.data.totalAmount))
            }
            else {
                setRows([])
                setTotalCount(0)
            }
        })
    }

    const getReceiptbyId = (receiptId: string) => {
        getReceiptbyIdAPI(receiptId).then((response: any) => {
            if (response && response.status === 200) {
                setReceipt(response.data.data)
                setDialogEnabled(true)
            }
        })
    }

    const handleFilter = (searchTerm: string, section: string, paymentMethod: string, startDate: string, endDate: string) => {
        getTransactions(
            schoolId,
            page,
            rowsPerPage,
            searchTerm !== 'default' ? searchTerm : undefined,
            section !== 'default' ? section : undefined,
            paymentMethod !== 'default' ? paymentMethod as 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD' : undefined,
            startDate !== '' ? (startDate as string) : undefined,
            endDate !== '' ? (endDate as string) : undefined,
        )
    }

    // Get Classes
    const getClasses = () => {
        getClassesAPI(schoolId).then((response: any) => {
            setClasses(response.data.data)
        })
    }

    const exportData = () => {
        getIncomeExcelAPI(schoolId,
            formValues.paymentMethod !== 'default' ? formValues.paymentMethod as 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD' : undefined,
            formValues.section !== 'default' ? formValues.section : undefined,
            formValues.startDate !== '' ? (formValues.startDate) : undefined,
            formValues.endDate !== '' ? (formValues.endDate) : undefined,
        ).then((response: any) => {
            if (response && response.status === 200) {
                let data = response.data.data
                const workbook = arrayBufferToWorkbook(data);
                let name = `IncomeTransactions-${new Date().toLocaleDateString()}.xlsx`
                writeFile(workbook, name);
            }
        })
    }

    function arrayBufferToWorkbook(arrayBuffer: ArrayBuffer) {
        const data = new Uint8Array(arrayBuffer);
        const workbook = read(data, { type: 'array' });
        return workbook;
    }

    const handleCustomDateRangePicker = (value: any) => {
        setRange(value);
        let startDate = `${value.start.day.toString().padStart(2, '0')}/${(value.start.month).toString().padStart(2, '0')}/${value.start.year}`
        let endDate = `${value.end.day.toString().padStart(2, '0')}/${(value.end.month).toString().padStart(2, '0')}/${value.end.year}`
        setFormValues({
          ...formValues,
          startDate: startDate,
          endDate: endDate,
        });
        getTransactions(
            schoolId,
            page, rowsPerPage,
            formValues.searchTerm !== 'default' ? formValues.searchTerm : undefined,
            formValues.section !== 'default' ? formValues.section : undefined,
            formValues.paymentMethod !== 'default' ? formValues.paymentMethod as 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD' : undefined,
            startDate !== '' ? (startDate) : undefined,
            endDate !== '' ? (endDate) : undefined,
        )
    }

    const clearDateRange = () => {
        setRange(null)
        setFormValues({
            ...formValues,
            startDate: '',
            endDate: ''
        })
        getTransactions(
            schoolId,
            page,
            rowsPerPage,
            formValues.searchTerm !== 'default' ? formValues.searchTerm : undefined,
            formValues.section !== 'default' ? formValues.section : undefined,
            formValues.paymentMethod !== 'default' ? formValues.paymentMethod as 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER' | 'UPI' | 'DD' | 'DEBIT_CARD' | 'CREDIT_CARD' : undefined,
            undefined,
            undefined,
        )
    };

    useEffect(() => {
        getClasses()
        getTransactions(schoolId, page, rowsPerPage)
    }, [])

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <h1>Transactions</h1>
                <div className={styles.row}>
                    <div className={styles.search}>
                        <Input
                            value={formValues.searchTerm}
                            placeholder={'Student Name, Receipt Number'}
                            onChange={handleSearchChange}
                            type='text'
                        />
                    </div>
                    <Select
                        className={styles.selector}
                        onChange={(e) => {
                            handleFilter(formValues.searchTerm ? formValues.searchTerm : '', e.target.value as string,
                                formValues.paymentMethod ? formValues.paymentMethod : '', formValues.startDate, formValues.endDate);
                            setFormValues({ ...formValues, section: e.target.value as string })
                        }}
                        value={formValues.section}
                        endAdornment={
                            formValues.section !== 'default' && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        handleFilter(
                                            formValues.searchTerm ? formValues.searchTerm : '', 'default',
                                            formValues.paymentMethod ? formValues.paymentMethod : '',
                                            formValues.startDate, formValues.endDate)
                                        setFormValues({ ...formValues, section: 'default' })
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            )
                        }
                        IconComponent={
                            formValues.section == 'default' ? undefined : () => null
                        }
                    >
                        <MenuItem value="default">Select Class</MenuItem>
                        {classes.map((item: Class) => {
                            return (
                                <MenuItem key={item.sectionId} value={item.sectionId}>
                                    {item.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                    <Select
                        className={styles.selector}
                        onChange={(e) => {
                            handleFilter(formValues.searchTerm, formValues.section, e.target.value as string, formValues.startDate, formValues.endDate);
                            setFormValues({ ...formValues, paymentMethod: e.target.value })
                        }}
                        value={formValues.paymentMethod}
                        endAdornment={
                            formValues.paymentMethod !== 'default' && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setFormValues({ ...formValues, paymentMethod: 'default' })
                                        handleFilter(formValues.searchTerm, formValues.section, 'default', formValues.startDate, formValues.endDate)
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
                        <MenuItem value="default">Select Payment Method</MenuItem>
                        {paymentMethods.map((item: any) => {
                            return (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            )
                        })}
                    </Select>
                    <div className={`${styles.selector} ${styles.datepicker}`}>
                        <CustomDateRangePicker
                            setRange={handleCustomDateRangePicker}
                            range={range}
                        />
                    </div>
                    {
                        ((range !== null)) && <div
                            className={styles.active}
                            onClick={clearDateRange}>
                            <Close />
                        </div>
                    }
                    <div className={styles.download}>
                        <button
                            onClick={exportData}
                        >
                            <Download className={styles.download_icon} />&nbsp;
                        </button>
                    </div>
                </div>
                {
                    summary !== 0 && (
                        <div className={styles.summary}>
                            <span className={styles.summary_amount}>{formatter(Number(summary))}</span>
                            <span className={styles.summary_desc}>Amount based on Filters</span>
                        </div>
                    )
                }

            </div>
            {
                totalCount ?
                    <div className={styles.table}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}
                                            ><span className={styles.heading}>{column.label}</span></TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        rows.map((row: any, index) => (
                                            <TableRow key={index}
                                                sx={{
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => { getReceiptbyId(row._id) }}>
                                                {columns.map((column) => {
                                                    if (column.id == '_id') {
                                                        return <TableCell
                                                            key={column.id}>{
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <IconButton
                                                                        sx={{
                                                                            border: '1.5px solid #DBDBDB',
                                                                            borderRadius: '04px'
                                                                        }}
                                                                        onClick={() => {
                                                                            getReceiptbyId(row[column.id])
                                                                        }}
                                                                    >
                                                                        <Print />
                                                                    </IconButton>
                                                                    {
                                                                        row.comment &&
                                                                        <Tooltip title={row.comment}>
                                                                            <IconButton
                                                                                sx={{
                                                                                    border: '1.5px solid #DBDBDB',
                                                                                    borderRadius: '04px',
                                                                                    marginLeft: '10px'
                                                                                }}
                                                                            >
                                                                                <ModeComment />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    }

                                                                </div>
                                                            }</TableCell>
                                                    }
                                                    else if (column.id == 'issueDate') {
                                                        return <TableCell key={column.id}>
                                                            <span className={styles.body}>{dateFormatter(row[column.id])}</span>
                                                        </TableCell>
                                                    }
                                                    else if (column.id == 'No') {
                                                        return <TableCell  key={column.id}>
                                                            <span className={styles.body} >
                                                            {row?.payment?.method === "CASH" && "-" }
                                                            {row?.payment?.chequeNumber && row?.payment?.chequeNumber }
                                                            {row?.payment?.transactionId && row?.payment?.transactionId }
                                                            {row?.payment?.upiId && row?.payment?.upiId }
                                                            </span>
                                                        </TableCell>
                                                    }
                                                    else {
                                                        return <TableCell key={column.id}><span className={styles.body}>{row[column.id]}</span></TableCell>
                                                    }
                                                })
                                                }
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div> :
                    <div className={styles.nodata}>No Data</div>
            }

            <Dialog open={dialogEnabled} maxWidth='xl'>
                <Receipt
                    receipt={receipt}
                    setDialogEnabled={setDialogEnabled}
                />
            </Dialog>
        </div>
    )
}

export default IncomeTransactions