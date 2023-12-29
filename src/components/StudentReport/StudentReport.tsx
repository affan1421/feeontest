import React, { useEffect, useState } from 'react'
import styles from './StudentReport.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { Report } from '@/models/StudentReport'
import api from '@/store/api'
import { FeeCategory } from '@/models/FeeCategory'
import DataListforReport from '../DataListforReport/DataListforReport'
import StudentDetails from '../StudentDetails/StudentDetails'
import LinearGraph from '../LinearGraph/LinearGraph'
import dayjs from 'dayjs'
import { Dialog, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { EditOutlined, Money, OpenInFull, OpenInNew } from '@mui/icons-material'
import { FeeInstallment } from '@/models/StudentReport'
import TransactionListStudent from '../TransactionListStudent/TransactionListStudent'
import paid from '@/assests/paid.svg'
import total from '@/assests/total.svg'
import pending from '@/assests/pending.svg'
import { formatter } from '@/helpers/formatter'

interface ReceiptItem {
    _id: string,
    id: string,
    receiptId: string,
    issueDate: string,
    amount: number,
    paymentMode: string,
    status: string,
}

interface Data {
    label: string,
    amount: number
}

const StudentReport = () => {
    const { id } = useParams<{ id: string }>()

    const getFeeCategoriesbyStudentAPI = api(state => state.getFeeCategoriesbyStudent)
    const getStudentReportAPI = api(state => state.getStudentReport)
    const getTransactionsbyStudentAPI = api(state => state.getTransactionsbyStudent)

    const [categoryId, setCategoryId] = useState('')
    const [feeCategoryname, setFeeCategoryname] = useState('')
    const [report, setReport] = useState<Report>({} as Report)
    const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([])
    const [transactions, setTransactions] = useState<Data[]>([])
    const [rows, setRows] = useState<FeeInstallment[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [transactionDialog, setTransactionDialog] = useState(false);
    const navigate = useNavigate()

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'date', headerName: 'Due Date', width: 150,
            renderCell: (params) => {
                return <>{new Date(params.row.date).toLocaleDateString()} </>
            }
        },
        {
            field: 'totalAmount', headerName: 'Amount', width: 130,
            renderCell: (params) => {
                return <>{formatter(params.row.totalAmount)} </>
            }
        },
        {
            field: 'totalDiscountAmount', headerName: 'Disc', width: 130,
            renderCell: (params) => {
                return <>{formatter(params.row.totalDiscountAmount)} </>
            }
        },
        {
            field: 'netAmount', headerName: 'Total', width: 130,
            renderCell: (params) => {
                return <>{formatter(params.row.netAmount)} </>
            }
        },
        {
            field: 'paidAmount', headerName: 'Paid', width: 130,
            renderCell: (params) => {
                return <>{formatter(params.row.paidAmount)} </>
            }
        },
        {
            field: 'status', headerName: 'Status', width: 150,
            renderCell: (params) => {
                return <>
                    <span className={`${styles.status} ${params.row.status == 'Paid' ? `${styles.paid}` : (
                        params.row.status == 'Due' ? `${styles.due}` : (
                            params.row.status == 'Upcoming' ? `${styles.upcoming}` : `${styles.partial}`
                        )
                    )}`}>{params.row.status}</span>
                </>
            }
        },
        {
            field: 'balanceAmount', headerName: 'Balance', width: 150,
            renderCell: (params) => {
                return <>{formatter(params.row.netAmount - params.row.paidAmount)} </>
            }
        },
    ];

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
    }

    const getStudentReport = (category_id?: string) => {
        getStudentReportAPI(id as string, category_id ? category_id : categoryId).then(async (response) => {
            let data: Report = await response.data.data
            let feeInstallments = data.feeInstallments.map((item) => {
                return {
                    ...item,
                    id: item._id
                }
            })
            console.log(data)
            setRows(feeInstallments)
            setTotalCount(data.feeInstallments.length)
            setReport(data)
        })
    }

    const getFeeCategoriesbyStudent = async () => {
        getFeeCategoriesbyStudentAPI(id as string).then((response: any) => {
            if (response.status === 200) {
                let data: FeeCategory[] = response.data.data
                setCategoryId(data[0]._id as string)
                let categoryName = data.filter((item) => {
                    return item._id == data[0]._id
                })[0].name
                setFeeCategoryname(categoryName)
                getStudentReport(data[0]._id)
                setFeeCategories(data)
            }
        })
    }

    function convertData(data: any) {
        const { total, paid, due } = data[0];
        const result = [
            { label: "Total Amount", value: total },
            { label: "Paid Amount", value: paid },
            { label: "Due Amount", value: due }
        ];
        return result;
    }

    const getTransactionsbyStudent = () => {
        let data = { studentId: id }
        getTransactionsbyStudentAPI(data).then((response) => {
            try {
                if (response.status === 200) {
                    let data = response.data.data
                    data = data.map((item: ReceiptItem) => {
                        return {
                            amount: item.amount,
                            label: dayjs(item.issueDate).format('MM/DD/YYYY'),
                        }
                    })
                    setTransactions(data.reverse())
                }
            } catch (error) {
                setTransactions([])
            }

        })
    }

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategoryId(event.target.value)
        let categoryName = feeCategories.filter((item) => {
            return item._id == event.target.value
        })[0].name
        setFeeCategoryname(categoryName)
        getStudentReport(event.target.value)
    }

    useEffect(() => {
        getFeeCategoriesbyStudent()
        getTransactionsbyStudent()
    }, [id])

    return (
        <div>
            <div className={styles.row}>
                <div className={styles.student}>
                    {report.studentDetails &&
                        <StudentDetails
                            student={report?.studentDetails}
                        />
                    }
                </div>
                <div className={styles.counts}>
                    {
                        report.stats && <>
                            <div className={styles.count_item}>
                                <div>
                                    <img
                                        src={total}
                                    />
                                    <span className={styles.price}><span className={styles.inr}>₹</span>{Number(report.stats.total).toFixed(2)}</span>
                                </div>
                                <span className={styles.count_title}>Total Fees</span>
                            </div>
                            <div className={styles.count_item}>
                                <div>
                                    <img
                                        src={paid}
                                    />
                                    <span className={styles.price}><span className={styles.inr}>₹</span>{Number(report.stats.paid).toFixed(2)}</span>
                                </div>
                                <span className={styles.count_title}>Paid Amount</span>
                            </div>
                            <div className={styles.count_item}>
                                <div>
                                    <img
                                        src={pending}
                                    />
                                    <span className={styles.price}><span className={styles.inr}>₹</span>{Number(report.stats.pending).toFixed(2)}</span>
                                </div>
                                <span className={styles.count_title}>Pending Amount</span>
                            </div>
                        </>
                    }
                </div>
                <div className={styles.trasactions}>
                    <div className={styles.icon}>
                        <IconButton
                            onClick={() => {
                                setTransactionDialog(true)
                            }}
                            sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                            <OpenInNew />
                        </IconButton>
                    </div>
                    <LinearGraph
                        amountEnabled={false}
                        graphHeight={218}
                        isIncome={true}
                        data={transactions && transactions.length > 0 ? transactions.map((item) => item.amount) : [0]}
                        labels={transactions && transactions.length > 0 ? transactions.map((item) => item.label) : ['0']}
                        topColor='#B8DC6C'
                        bottomColor='#ffff'
                        borderColor='#A0C24A'
                        title="Transactions"
                        amount={0}
                        titleFontSize={18}
                        amountFontSize={25}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.item}>
                    {
                        report?.miscFees &&
                        <DataListforReport
                            link='miscellaneouscollection'
                            items={
                                report?.miscFees.map(e => {
                                    return {
                                        label: e.feetype as string,
                                        value: Number(e.amount)
                                    }
                                })
                            }
                            title='Miscelleneous Fees'
                        />
                    }
                </div>
                <div className={styles.item}>
                    {
                        report?.miscFees &&
                        <DataListforReport
                            link='discount'
                            isDiscount={true}
                            items={
                                report?.discounts.map(e => {
                                    return {
                                        label: e.name as string,
                                        value: Number(e.discountAmount),
                                        secondarylabel: e.status,
                                        id: e.id
                                    }
                                })
                            }
                            title='All Discounts'
                        />
                    }
                </div>
                <div className={styles.item}>
                    {
                        report?.previousBalance && report?.previousBalance.length > 0 &&
                        <DataListforReport
                            link='previous-balance'
                            items={
                                convertData(report?.previousBalance)
                            }
                            title='Previous Balance'
                        />
                    }
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.table}>
                    <div className={styles.row}>
                        <span className={styles.count_title}>Fee Structure <span className={styles.category_tag}>{feeCategoryname}</span><IconButton
                            onClick={() => {
                                navigate(`/pay/${id}/true`)
                            }}
                            sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}>
                            <OpenInNew />
                        </IconButton></span>
                        <Select
                            className={styles.selector}
                            value={categoryId}
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value='default' disabled >Fee Category</MenuItem>
                            {
                                feeCategories.map((feeCategory) => {
                                    return <MenuItem
                                        value={feeCategory._id}
                                        key={feeCategory._id}
                                    >{feeCategory.name}</MenuItem>
                                })
                            }

                        </Select>
                    </div>
                    <div>
                        {
                            rows?.length > 0 &&
                            <DataGrid
                                sx={{ border: '0px' }}
                                rows={rows}
                                columns={columns}
                                pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                                paginationModel={paginationModel}
                                onPaginationModelChange={handlePageChange}
                                rowCount={totalCount}
                            />}
                    </div>
                </div>
            </div>
            <Dialog open={transactionDialog} maxWidth="xl">
                <TransactionListStudent
                    onClose={setTransactionDialog}
                    studentId={id as string}
                />
            </Dialog>
        </div>
    )
}

export default StudentReport