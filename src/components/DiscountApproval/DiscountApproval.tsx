import React, { useEffect, useState, useMemo } from 'react'
import styles from './DiscountApproval.module.css'
import { IconButton, InputBase, MenuItem, Paper, Select, Tooltip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate, useParams } from 'react-router-dom'
import { GridRowsProp, GridColDef, DataGrid, GridCellParams } from '@mui/x-data-grid';
import { CloseOutlined, CheckOutlined, RemoveCircleOutline, Download } from '@mui/icons-material';
import user from '@/assests/user.png'
import api from '@/store/api';
import { Class } from '../DiscountAllocationByClass/DiscountAllocationByClass';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { DiscountStudentAPI, DiscountApproval as DiscountApprovalModel } from '@/models/DiscountApproval';
import global from '@/store/global'
import { Discount } from '@/models/Discount';
import { formatter } from '@/helpers/formatter';

interface Student {
    id: string,
    studentId: string,
    studentName: string,
    sectionName: string,
    totalFees: number,
    discountAmount: number,
    otherDiscounts: number,
}

interface FormValues {
    class: string,
    status: string
}

const DiscountApproval = () => {
    const navigate = useNavigate()
    let { id } = useParams();
    const schoolId = localStorage.getItem('school_id') as string

    // API's 
    const getClassesAPI = api(state => state.getClasses)
    const updateStudentStatusinDiscountAPI = api(state => state.updateStudentStatusinDiscountAPI)
    const fetchStudentsforDiscountApprovalAPI = api(state => state.fetchStudentsforDiscountApproval)
    const getDiscountCategoryDataAPI = api(state => state.getDiscountCategoryData)
    const revokeDiscountAPI = api(state => state.revokeDiscount)

    // State
    const discountApprovalState = global(state => state.discountApproval)
    const setDiscountApproval = global(state => state.setDiscountApproval)
    const setIsDiscountEditManagementState = global((state) => state.setIsDiscountEditManagement)

    const setDiscountState = global((state) => state.setDiscount)

    const [classes, setClasses] = useState<Class[]>([])
    const [students, setStudents] = useState<Student[]>([])

    const columns: GridColDef[] = [
        {
            field: 'studentName', headerName: 'Student Name', width: 250,
            renderCell: (params: GridCellParams) => (
                <div className={styles.cell_container}>
                    {params.row.profile_image ?
                        <img
                            src={params.row.profile_image}
                            className={styles.cell_image}
                        />
                        :
                        <img
                            className={styles.cell_image}
                            src={user}
                        />
                    }
                    <div style={{ marginTop: '5px' }}>
                        {params.row.studentName}
                    </div>
                </div>
            )
        },
        {
            field: 'admission_no', headerName: 'Admission Number', width: 200,
            renderCell: (params) => {
                return <div>
                    {params.row.admission_no ? params.row.admission_no : '-'}
                </div>
            }
        },
        { field: 'sectionName', headerName: 'Class', width: 150 },
        {
            field: 'totalFees', headerName: 'Total Fees', width: 180,
            renderCell: (params: GridCellParams) => (
                <>{formatter(params.row.totalFees)}</>
            )
        },
        {
            field: 'discountAmount', headerName: 'Discount Amount', width: 180,
            renderCell: (params: GridCellParams) => (
                <>{params.row.isPending ? formatter(params.row.totalPendingAmount) : formatter(params.row.totalDiscountAmount)}</>
            )
        },
        {
            field: 'otherDiscounts', headerName: 'Other Discounts (Total)', width: 180,
            renderCell: (params: GridCellParams) => (
                <>{formatter(params.row.totalApprovedAmount)}</>
            )
        },
        {
            field: 'approve', headerName: '', width: 100,
            renderCell: (params: GridCellParams) => {
                if (!params.row.isPending) {
                    return <>
                        <Tooltip title="Revoke Discount" >
                            <IconButton
                                sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginRight: '10px' }}
                                onClick={() => {
                                    revokeDiscount(params.row.id)
                                }}
                            >
                                <RemoveCircleOutline />
                            </IconButton>
                        </Tooltip>
                        {
                            params.row.attachments && params.row.attachments.length > 0 &&
                            <Tooltip title="Download Attachment" >
                                <IconButton
                                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}
                                    onClick={() => {
                                        handleDocumentDownload(params.row.attachments)
                                    }}
                                >
                                    <Download />
                                </IconButton>
                            </Tooltip>
                        }
                    </>;
                }
                return (
                    <>
                        <Tooltip title="Approve Discount" >
                            <IconButton
                                sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginRight: '10px' }}
                                onClick={() => {
                                    updateStatus(params, 'Approved')
                                }}
                            >
                                <CheckOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Discount" >
                            <IconButton
                                sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}
                                onClick={() => { updateStatus(params, 'Rejected') }}
                            >
                                <CloseOutlined />
                            </IconButton>
                        </Tooltip>
                        {
                            params.row.attachments && params.row.attachments.length > 0 &&
                            <Tooltip title="Download Attachment" >
                                <IconButton
                                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}
                                    onClick={() => {
                                        handleDocumentDownload(params.row.attachments)
                                    }}
                                >
                                    <Download />
                                </IconButton>
                            </Tooltip>
                        }
                    </>
                );
            },
        },
    ];

    const [formValues, setFormValues] = useState<FormValues>({
        class: 'default',
        status: 'default'
    })



    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        if (!searchTerm) {
            return students;
        }
        return students.filter((student) => student.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [students, searchTerm]);

    // Get Classes
    const getClasses = () => {
        getClassesAPI(schoolId).then((response: any) => {
            setClasses(response.data.data)
        })
    }

    const handleDocumentDownload = (attachments: string[]) => {
        if (attachments.length > 0) {
            const attachmentUrl = attachments[0];
            const link = document.createElement('a');
            link.href = attachmentUrl;
            link.download = attachmentUrl.substring(attachmentUrl.lastIndexOf('/') + 1);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.click();
        }
    };

    const handleFilter = (classId?: string, status?: string) => {
        const filteredClassId = classId !== 'default' ? classId : undefined;
        const filteredStatus = status !== 'default' ? status : undefined;
        fetchStudentsforDiscountApproval(filteredClassId, filteredStatus);
    };


    const fetchStudentsforDiscountApproval = (sectionId?: string, status?: string) => {
        fetchStudentsforDiscountApprovalAPI(id as string, sectionId, status).then((response: any) => {
            if (response?.status == 200) {
                let data = response.data.data
                data = data.map((student: Student) => {
                    return {
                        ...student,
                        id: student.studentId,
                    }
                })
                setStudents(data);
            } else {
                setStudents([]);
            }
        })
    }

    const updateStatus = (params: GridCellParams, status: 'Approved' | 'Rejected') => {
        let student: any = {
            studentId: params.row.id,
            approvalAmount: params.row.totalPendingAmount,
            sectionName: params.row.sectionName as string,
            status: status
        }
        updateStudentStatusinDiscountAPI(id as string, student).then((response: any) => {
            if (response.status == 200) {
                fetchStudentsforDiscountApproval(
                    formValues.class !== 'default' ? formValues.class : undefined,
                    formValues.status !== 'default' ? formValues.status : undefined
                )
                updateDiscountCategoryData()
            }
        })
    }

    const updateDiscountCategoryData = () => {
        getDiscountCategoryDataAPI(id as string).then((response: any) => {
            if (response.status == 200) {
                let discountapproval: DiscountApprovalModel = {
                    name: response.data.data.name,
                    description: response.data.data.description,
                    totalBudget: response.data.data.totalBudget,
                    id: response.data.data.id,
                    allotted: response.data.data.budgetAlloted,
                    studentsCount: response.data.data.totalStudents,
                    budgetSpent: response.data.data.totalBudget - response.data.data.budgetRemaining,
                    classesCount: response.data.data.classesAssociated,
                    students: response.data.data.totalStudents,
                    remaining: response.data.data.budgetRemaining,
                    totalApproved: response.data.data.totalApproved,
                    totalPending: response.data.data.totalPending,
                }
                setDiscountApproval(discountapproval)
            }
        })
    }

    const handleEditDiscountCategory = () => {
        let discount: Discount = {
            name: discountApprovalState.name,
            description: discountApprovalState.description,
            totalBudget: discountApprovalState.totalBudget,
            budgetRemaining: discountApprovalState.remaining,
            createdBy: localStorage.getItem('user_id') as string,
            schoolId: localStorage.getItem('school_id') as string,
            id: discountApprovalState.id
        }
        setDiscountState(discount)
        setIsDiscountEditManagementState(true)
        navigate(`/add-discount/${id}`)
    }

    const revokeDiscount = (studentId: string) => {
        revokeDiscountAPI(id as string, studentId).then((response) => {
            if (response.status == 200) {
                fetchStudentsforDiscountApproval(
                    formValues.class !== 'default' ? formValues.class : undefined,
                    formValues.status !== 'default' ? formValues.status : undefined
                )
                updateDiscountCategoryData()
            }
        })
    }

    useEffect(() => {
        updateDiscountCategoryData()
        fetchStudentsforDiscountApproval()
        getClasses()
    }, [])

    return (
        <>
            <div className={styles.navigation}>
                <div>
                    <IconButton onClick={() => {
                        navigate('/discount')
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    &nbsp;&nbsp;
                    All Discounts
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <h1>{discountApprovalState.name}</h1>
                        <span className={styles.status}>
                            {formatter(discountApprovalState.totalBudget)}
                        </span>
                    </div>
                    <IconButton
                        sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px" }}
                        onClick={handleEditDiscountCategory}
                    >
                        <EditOutlinedIcon />
                    </IconButton>
                </div>
            </div>
            <div className={styles.stats_card}>
                <span className={styles.stats_title}>Budget Spent</span>
                <span className={styles.stats_budget_spent}>{formatter(discountApprovalState.budgetSpent)} </span>
                <div className={styles.gridcontainer}>
                    <div className={styles.griditem}><span>Allotted</span>{discountApprovalState.allotted ? formatter(discountApprovalState.allotted) : 0}</div>
                    <div className={styles.griditem}><span>Remaining </span>{discountApprovalState.remaining ? formatter(discountApprovalState.remaining) : 0}</div>
                    <div className={styles.griditem}><span>Classes </span>{discountApprovalState.classesCount ? Number(discountApprovalState.classesCount) : 0}</div>
                    <div className={styles.griditem}><span>Students </span>{discountApprovalState.studentsCount ? Number(discountApprovalState.studentsCount) : 0}</div>
                    <div className={styles.griditem}><span>Approved </span>{discountApprovalState.totalApproved ? Number(discountApprovalState.totalApproved) : 0}</div>
                    <div className={styles.griditem}><span>Pending </span>{discountApprovalState.totalPending ? Number(discountApprovalState.totalPending) : 0}</div>
                </div>

            </div>
            <div className={styles.filters}>
                <Paper
                    className={styles.input} >
                    <InputBase
                        placeholder='Search Student'
                        id="filled-hidden-label-small"
                        size="small"
                        className={styles.input_input}
                        value={searchTerm}
                        onSubmit={(e) => e.preventDefault()}
                        onChange={(e) => { setSearchTerm(e.target.value) }}
                    />
                </Paper>
                <Select
                    className={styles.selector}
                    onChange={(e) => {
                        handleFilter(e.target.value as string, formValues.status ? formValues.status : '');
                        setFormValues({ ...formValues, class: e.target.value as string })
                    }}
                    value={formValues.class}
                    endAdornment={
                        formValues.class !== 'default' && (
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setFormValues({ ...formValues, class: 'default' })
                                    fetchStudentsforDiscountApproval(
                                        undefined,
                                        formValues.status !== 'default' ? formValues.status : undefined
                                    )
                                }}
                            >
                                <CloseRounded />
                            </IconButton>
                        )
                    }
                    IconComponent={
                        formValues.class == 'default' ? undefined : () => null
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
                    value={formValues.status}
                    onChange={(e) => {
                        handleFilter(formValues.class ? formValues.class : '', e.target.value as string)
                        setFormValues({ ...formValues, status: e.target.value as string })
                    }}
                    endAdornment={
                        formValues.status !== 'default' && (
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setFormValues({ ...formValues, status: 'default' })
                                    fetchStudentsforDiscountApproval(
                                        formValues.class !== 'default' ? formValues.class : undefined,
                                        undefined
                                    )
                                }}
                            >
                                <CloseRounded />
                            </IconButton>
                        )
                    }
                    IconComponent={
                        formValues.status == 'default' ? undefined : () => null
                    }
                >
                    <MenuItem value='default' disabled>Select Status</MenuItem>
                    <MenuItem value='Approved'>Approved</MenuItem>
                    <MenuItem value='Pending'>Pending</MenuItem>
                </Select>
            </div>
            <div className={styles.table} >
                <div style={{ height: 450 }}>
                    <DataGrid
                        sx={{ border: 'none' }}
                        rows={filteredStudents}
                        columns={columns}
                        pageSizeOptions={[6]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 6,
                                },
                            },
                        }}
                    />
                </div>
            </div>

        </>


    )
}

export default DiscountApproval