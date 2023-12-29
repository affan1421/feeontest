import styles from './ApplicationList.module.css';
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Dialog, IconButton } from "@mui/material";
import api from "@/store/api";
import { useEffect, useState } from 'react';
import { ApplicationForm } from '@/models/ApplicationForm';
import { Print } from '@mui/icons-material';
import Receipt from '../Receipt/Receipt';
import { ReceiptModel } from '@/models/Receipt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { EnrollStudent } from '@/models/ApplicationForm';

const ApplicationList = () => {
    // API's
    const getAllApplicationFormsAPI = api(state => state.getAllApplicationForms)
    const getReceiptbyIdAPI = api(state => state.getReceiptbyId)
    const enrollStudentAPI = api(state => state.enrollStudent)

    const schoolId = localStorage.getItem('school_id') as string
    const columns: GridColDef[] = [
        { field: "studentName", headerName: "Student Name", width: 200 },
        {
            field: 'admission_no', headerName: 'Admission Number', width: 200,
            renderCell: (params: any) => {
                return <div>
                    {params.row.admission_no ? params.row.admission_no : "-"}
                </div>
            }
        },
        {
            field: "gender", headerName: "Gender", width: 200,
            renderCell: (params: any) => {
                return <div>
                    {params.row.gender ? params.row.gender : "-"}
                </div>
            }
        },
        { field: "className", headerName: "Class", width: 150 },
        { field: "parentName", headerName: "Parent Name", width: 180 },
        { field: "phoneNumber", headerName: "Phone Number", width: 180 },
        { field: "course", headerName: "Course", width: 150 },
        { field: "amount", headerName: "Amount", width: 150 },
        {
            field: "receipt", headerName: "", width: 80,
            renderCell: (params: any) => (
                <IconButton
                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}
                    onClick={() => {
                        getReceiptbyId(params.row.receiptId)
                    }}
                >
                    <Print />
                </IconButton>
            )
        },
        {
            field: "enroll", headerName: "", width: 80,
            renderCell: (params: any) => (
                <IconButton
                    disabled={params.row.isEnrolled}
                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}
                    onClick={() => {
                        handleEnrollStudent(params.row)
                    }}
                >
                    <PersonAddAlt1Icon />
                </IconButton>
            )
        },


    ]

    const [applicationForms, setApplicationForms] = useState([])
    const [dialogEnabled, setDialogEnabled] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const debouncedHandleSearch = (searchValue: string) => {
        clearTimeout(debounceTimer!); // Clear previous debounce timer
        const timer = setTimeout(() => {
            getAllApplicationForms(paginationModel.page, paginationModel.pageSize, searchValue)
        }, 500); // Set debounce delay (e.g., 300ms)
        setDebounceTimer(timer); // Store new debounce timer
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value as string;
        setSearchTerm(searchValue)
        debouncedHandleSearch(searchValue); // Call the debounced search handler
    };

    const [searchTerm, setSearchTerm] = useState('')


    const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel);

    const [totalCount, setTotalCount] = useState(0);

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize });
        getAllApplicationForms(data.page, data.pageSize);
    };

    const handleEnrollStudent = (data: any) => {
        let apiData: EnrollStudent = {
            school_id: data.schoolId,
            applicationId: data._id,
            p_username: data.phoneNumber,
            guardian: data.phoneNumber,
            p_name: data.parentName,
            name: data.studentName,
            gender: data.gender,
            class: data.classId,
            section: data.sectionId,
        };
        switch (data.parentType) {
            case 'FATHER':
                apiData.f_contact_number = data.phoneNumber
                break;
            case 'MOTHER':
                apiData.m_contact_number = data.phoneNumber
                break;
            case 'GUARDIAN':
                apiData.guardian_contact = data.phoneNumber
                break;
            default:
                apiData.f_contact_number = data.phoneNumber
                break;
        }
        enrollStudentAPI(apiData).then((response) => {
            if (response.status === 201) {
                getAllApplicationForms(paginationModel.page, paginationModel.pageSize)
            }
        })
    };


    const getAllApplicationForms = (page: number, size: number, searchValue?: string) => {
        getAllApplicationFormsAPI(schoolId, page, size, searchValue).then((response: any) => {
            if (response.status === 200) {
                let data = response.data.data
                data.map((item: ApplicationForm) => {
                    item.id = item._id
                })
                setTotalCount(response.data.resultCount)
                setApplicationForms(data)
            } else {
                setTotalCount(0)
                setApplicationForms([])
            }
        })
    }

    const getReceiptbyId = (receiptId: string) => {
        try {
            getReceiptbyIdAPI(receiptId).then((response: any) => {
                if (response.status === 200) {
                    setDialogEnabled(true)
                    setReceipt(response.data.data)
                }
            })
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getAllApplicationForms(paginationModel.page, paginationModel.pageSize)
    }, [])

    return (
        <>
            <div className={styles.container}>
                <div className={styles.box}>
                    <Paper className={styles.search}>
                        <IconButton aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            placeholder="Search Student name"
                            id="filled-hidden-label-small"
                            value={searchTerm}
                            size="small"
                            className={styles.search_input}
                            onChange={handleSearchChange}
                        />
                    </Paper>
                    <div style={{ height: '450px', margin: '20px 0px' }}>
                        <DataGrid
                            sx={{ border: "0px" }}
                            rows={applicationForms}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={handlePageChange}
                            rowCount={totalCount}
                        />
                    </div>
                </div>
            </div>
            <Dialog open={dialogEnabled} maxWidth="xl">
                <Receipt
                    receipt={receipt}
                    setDialogEnabled={setDialogEnabled}
                />
            </Dialog>
        </>
    )
}

export default ApplicationList