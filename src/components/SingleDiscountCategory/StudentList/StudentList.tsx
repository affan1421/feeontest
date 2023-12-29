import styles from './StudentList.module.css'
import { formatter } from '@/helpers/formatter';
import { CloseRounded, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Input from '@/Elements/Input/Input'
import React, { useEffect, useState } from 'react'
import api from '@/store/api';
import { Class } from '@/models/Class';


const StudentList = () => {

    // data variables
    let schoolId = localStorage.getItem('school_id') as string

    // API's
    const getClassesAPI = api((state) => state.getClasses)


    const filterValuesDefault = {
        searchTerm: "",
        class: "default",
        requestType: "default",
    };

    // State Variables
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState('default');
    const requestTypes = ['Approved', 'Pending', 'Rejected'];
    const [requestType, setRequestType] = useState('default');
    const [filterValues, setFilterValues] = useState(filterValuesDefault);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);


    const studentColumns: GridColDef[] = [
        { field: 'studentName', headerName: 'Student Name', width: 150 },
        { field: 'class', headerName: 'Class', width: 150 },
        { field: 'totalFees', headerName: 'Total Fees', width: 150 },
        { field: 'discountAmount', headerName: 'Discount Amount', width: 170 },
        {
            field: 'otherDiscount', headerName: 'Other Discount', width: 170,
            renderCell: (params) => (
                <div className={styles.amountRow}>
                  {params.row.discountAmount.map((amount: any, index: any) => (
                    <div key={index} className={styles.amount}>
                      {formatter(amount)}
                    </div>
                  ))}
                </div>
              )
        },
        {
            field: 'view',
            headerName: '',
            sortable: false,
            width: 80,
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

    const [totalCount, setTotalCount] = useState(0)

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value as string;
        setFilterValues({ ...filterValues, searchTerm: searchValue });
        debouncedHandleSearch(searchValue);
    }

    const debouncedHandleSearch = (searchTerm: string) => {
        clearTimeout(debounceTimer!);
        const timer = setTimeout(() => {
        }, 300);
        setDebounceTimer(timer);
    }
    const handleClassChange = (event: SelectChangeEvent) => {
        setSelectedClass(event.target.value)
    }

    const handleRequestTypeChange = (event: SelectChangeEvent) => {
        const requestTypeValue = event.target.value;
        setRequestType(requestTypeValue);
    };

    const getClasses = () => {
        getClassesAPI(schoolId).then((response: any) => {
            setClasses(response.data.data);
        });
    };

    useEffect(() => {
        getClasses()
    }, [])

    return (
        <>
            <div className={styles.main}>
                <div className={styles.filter}>
                    <div className={styles.search}>
                        <Input
                            value={filterValues.searchTerm}
                            placeholder={"Search Students"}
                            onChange={handleSearchChange}
                            type="text"
                        />
                    </div >
                    <Select
                        className={styles.selector}
                        value={filterValues.class}
                        onChange={(e) => {
                            const classValue = e.target.value as string;
                            setFilterValues({
                                ...filterValues,
                                class: classValue,
                            });
                        }}
                        endAdornment={
                            filterValues.class !== "default" && (
                                <IconButton size="small" onClick={() => {
                                    setFilterValues({ ...filterValues, class: "default" })
                                }}>
                                    <CloseRounded />
                                </IconButton>
                            )
                        }
                        IconComponent={filterValues.class == "default" ? undefined : () => null}>
                        <MenuItem value="default" disabled>
                            All Classes
                        </MenuItem>
                        {classes.map((item: Class) => {
                            return (
                                <MenuItem key={item.sectionId} value={item.sectionId}>
                                    {item.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <Select
                        className={styles.selector}
                        value={filterValues.requestType}
                        onChange={(e) => {
                            const studentType = e.target.value as string;
                            setFilterValues({
                                ...filterValues,
                                requestType: studentType,
                            })
                        }}
                        endAdornment={
                            filterValues.requestType !== "default" && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setFilterValues({ ...filterValues, requestType: "default" });
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            )
                        }
                        IconComponent={
                            filterValues.requestType == "default" ? undefined : () => null
                        }
                    >
                        <MenuItem value="default" disabled>All Requests</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                    </Select>

                </div>
                <div style={{ height: 400, borderRadius: '10px', }}>
                    <DataGrid
                        sx={{ border: '0px' }}
                        rows={students}
                        columns={studentColumns}
                        pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                        paginationModel={paginationModel}
                        paginationMode="server"
                        onPaginationModelChange={handlePageChange}
                        rowCount={totalCount}
                    />

                </div>

            </div>
        </>
    )
}

export default StudentList