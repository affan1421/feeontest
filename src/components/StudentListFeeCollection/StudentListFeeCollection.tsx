import { useState, useEffect } from 'react'
import styles from './StudentListFeeCollection.module.css'
import { IconButton, InputBase, MenuItem, Paper, Select } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SearchIcon from '@mui/icons-material/Search'
import api from '@/store/api'
import debounce from 'lodash.debounce'
import { useNavigate } from 'react-router-dom'
import { CloseRounded } from '@mui/icons-material'
import { Class } from '@/models/Class'
import { formatter } from '@/helpers/formatter'

interface PaginationModel {
    page: number
    pageSize: number
}

interface Student {
    name: string
    className: string
    pendingAmount: number
    id: string
    _id: string
}

interface Props {
    isReport?: boolean
}

interface State {
    rows: Student[]
    totalCount: number
    paginationModel: PaginationModel
    search: string
    timerId: number | null
}


const StudentListFeeCollection = (props: Props) => {
    // API's 
    const getStudentsinFeeCollectionAPI = api(state => state.getStudentsinFeeCollection)
    const getClassesAPI = api(state => state.getClasses)

    const schoolId = localStorage.getItem('school_id') as string
    const [rows, setRows] = useState<Student[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: 0,
        pageSize: 8,
    });
    const [search, setSearch] = useState<string>('')
    const [sectionId, setSectionId] = useState<string>('default')
    const [classes, setClasses] = useState<Class[]>([])
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 250
        },
        {
            field: 'admission_no',
            headerName: 'Admission Number',
            width: 250,
            renderCell: (params) => (
                <div>
                    {params.row.admission_no ? params.row.admission_no : "-"}
                </div>
            )
        },
        {
            field: 'parentName',
            headerName: 'Parent Name',
            width: 250
        },
        {
            field: 'className',
            headerName: 'Class',
            width: 250
        },
        {
            field: 'pendingAmount',
            headerName: 'Total Pending',
            width: 250,
            renderCell: (params) => (
                <div>
                    {params.row.pendingAmount ? formatter(params.row.pendingAmount) : "₹0"}
                </div>

            )
        },
        {
            field: 'view',
            headerName: '',
            sortable: false,
            width: 50,
            filterable: false,
            align: 'right',

            renderCell: (params) => {
                return (
                    params.row.hasfeeStructure ?
                        <IconButton sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                            <VisibilityIcon />
                        </IconButton>
                        : ''
                )
            },
        },
    ];

    const navigate = useNavigate()

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
        getStudentsinFeeCollection(data.page, data.pageSize, sectionId)
    }

    const getClasses = () => {
        getClassesAPI(schoolId).then((response: any) => {
            setClasses(response.data.data)
        })
    }

    const getStudentsinFeeCollection = (page: number, limit: number, section_id: string) => {
        getStudentsinFeeCollectionAPI(page,
            limit,
            schoolId,
            search,
            section_id
        ).then(async (response: any) => {
            if (response.status === 200) {
                let students = await response.data.data
                students = students.map((student: Student) => {
                    return {
                        ...student,
                        id: student._id,
                    }
                })
                setRows(students)
                setTotalCount(response.data.resultCount)
            }
        })
    }

    useEffect(() => {
        const delayedSearch = debounce(() => {
            getStudentsinFeeCollection(paginationModel.page, paginationModel.pageSize, sectionId)
        }, 400)
        delayedSearch()
        return delayedSearch.cancel
    }, [search])


    useEffect(() => {
        getClasses()
        getStudentsinFeeCollection(paginationModel.page, paginationModel.pageSize, sectionId)
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Paper className={styles.search}>
                    <IconButton >
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        placeholder="Student name, Phone Number"
                        id="filled-hidden-label-small"
                        size="small"
                        className={styles.search_input}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Paper>
                <Select
                    className={styles.selector}
                    onChange={(e) => {
                        setSectionId(e.target.value)
                        getStudentsinFeeCollection(paginationModel.page, paginationModel.pageSize, e.target.value)
                    }}
                    value={sectionId}
                    endAdornment={
                        sectionId !== 'default' && (
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setSectionId('default')
                                    getStudentsinFeeCollection(paginationModel.page, paginationModel.pageSize, 'default')
                                }}
                            >
                                <CloseRounded />
                            </IconButton>
                        )
                    }
                    IconComponent={
                        sectionId == 'default' ? undefined : () => null
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
            </div>
            <div className={styles.main}>
                <div className={styles.table}>
                    {
                        rows?.length > 0 &&
                        <DataGrid
                            sx={{ border: '0px' }}
                            rows={rows}
                            columns={columns}
                            pageSizeOptions={[8, 16, 32, totalCount < 50 ? totalCount : 50].sort((a, b) => { return a - b })}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={handlePageChange}
                            rowCount={totalCount}
                            onCellClick={
                                (params) => {
                                    // if (params.row.hasfeeStructure) {
                                        if (!props.isReport) {
                                            navigate(`/pay/${params.row.id}/${params.row.hasfeeStructure}`)
                                        } else {
                                            navigate(`/studentReport/${params.row.id}`)
                                        }
                                    // }
                                }
                            }
                        />}
                </div>
            </div>
        </div>
    )
}

export default StudentListFeeCollection
