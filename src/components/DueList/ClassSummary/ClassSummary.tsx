import styles from './ClassSummary.module.css'
import { Construction, Download, VisibilityOutlined } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'
import { Paper, InputBase, IconButton } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import api from '@/store/api'
import { DueBySection } from '@/models/DueList'
import { useNavigate } from 'react-router-dom'

interface Props {
    scheduleDates: string[]
    scheduleId: string[]
    sectionId: string
    data: Data
    exportData: any
}

export interface Data {
    dueStudents: number;
    totalPaidAmount: number;
    totalNetAmount: number;
    totalDueAmount: number;
    sectionId: string;
    className: string;
    totalStudents: number;
    id: string;
}

const ClassSummary = (props: Props) => {
    const navigate = useNavigate()

    // API's 
    const studentDueListbySectionAPI = api(state => state.studentDueListbySection)

    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [rows, setRows] = useState([])
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    })
    const columns: GridColDef[] = [
        { field: 'studentName', headerName: 'Name', width: 180 },
        { field: 'parentName', headerName: 'Parent', width: 140 },
        { field: 'username', headerName: 'Phone', width: 140, valueGetter: (params) => `${params.value}` },
        { field: 'totalNetAmount', headerName: 'Net Amount', width: 130, valueGetter: (params) => `${formatter.format(params.value)}` },
        { field: 'dueAmount', headerName: 'Amount Due', width: 130, valueGetter: (params) => `${formatter.format(params.value)}` },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 160,
            valueGetter: (params) => `${props.scheduleDates[props.scheduleDates.length - 1]}`
        },
        {
            field: 'view',
            headerName: '',
            sortable: false,
            width: 60,
            align: 'right',
            renderCell: (params) => (
                <IconButton
                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}
                >
                    <VisibilityOutlined />
                </IconButton>
            ),
        },
    ];

    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const filteredRows = useMemo(() => {
        let data = rows;
        if (search !== '') {
            return data.filter((row: any) =>
                row.studentName && row.studentName.toString().toLowerCase().includes(search.toLowerCase()) ||
                row.parentName && row.parentName.toString().toLowerCase().includes(search.toLowerCase()) ||
                row.username && row.username.toString().includes(search)
            )
        } else {
            return rows
        }
    }, [rows, search]);

    const handlePaginationChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value;
        setSearch(searchText)
    };

    const studentDueListbySection = () => {
        let data: DueBySection = {
            scheduleDates: props.scheduleDates,
            scheduleId: props.scheduleId,
            sectionId: props.sectionId,
            searchTerm: search
        }
        studentDueListbySectionAPI(data).then((response) => {
            let data = response.data.data
            data = data.map((item: any) => {
                return {
                    ...item,
                    id: item._id
                }
            })
            setTotalCount(response.data.resultCount)
            setRows(data)
        })
    }

    useEffect(() => {
        studentDueListbySection()
    }, [])


    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.search_download}>
                    <div className={styles.input_container}>
                        <Paper
                            className={styles.input}
                        >
                            <InputBase
                                type='text'
                                placeholder={`Search Students`}
                                size="small"
                                className={styles.input_input}
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </Paper>
                    </div>
                    <button onClick={() => {
                        props.exportData('students', props.data.sectionId)
                    }}>
                        <Download />
                    </button>
                </div>
                <div className={styles.row}>
                    <div className={styles.item}>
                        <div className={styles.label}>Class Name</div>
                        <div className={styles.value}>{props.data.className}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label}>Students</div>
                        <div className={styles.value}>{props.data.totalStudents}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label}>Due Student</div>
                        <div className={styles.value}>{props.data.dueStudents}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label}>Receivable</div>
                        <div className={styles.value}>{formatter.format(props.data.totalNetAmount)}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label}>Paid Amount</div>
                        <div className={styles.value}>{formatter.format(props.data.totalPaidAmount)}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label}>Amount Due</div>
                        <div className={styles.value}>{formatter.format(props.data.totalDueAmount)}</div>
                    </div>
                </div>
            </div>
            <div className={styles.table}>
                <DataGrid
                    onCellClick={(params) => {
                        navigate(`/pay/${params.row._id}/true`)
                    }}
                    sx={{ border: '0px' }}
                    rows={filteredRows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationChange}
                    rowCount={totalCount}
                />
            </div>
        </div>
    )
}

export default ClassSummary