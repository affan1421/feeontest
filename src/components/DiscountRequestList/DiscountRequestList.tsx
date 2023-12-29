import Input from '@/Elements/Input/Input';
import styles from './DiscountRequestList.module.css'
import { CheckOutlined, CloseOutlined, CloseRounded, RemoveCircleOutline } from '@mui/icons-material';
import { Select, IconButton, MenuItem } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Class } from '../DiscountAllocationByClass/DiscountAllocationByClass';
import { useEffect, useState } from 'react';
import api from '@/store/api';
import { formatter } from '@/helpers/formatter';

interface DiscountCategory {
    name: string,
    _id: string
}

interface StudentPaymentInfo {
    discountAmount: number;
    studentId: string;
    studentName: string;
    className: string;
    totalFees: number;
    discountId: string;
    discountName: string;
}

const DiscountRequestList = (props: any) => {
    const schoolId = localStorage.getItem("school_id") as string;
    const role = localStorage.getItem('role_name')

    const getClassesAPI = api((state) => state.getClasses);
    const getDiscountCategoryAPI = api((state) => state.getDiscountCategory);
    const getDiscountApprovalAPI = api((state) => state.getDiscountApproval);
    const updateStudentStatusinDiscountAPI = api(state => state.updateStudentStatusinDiscountAPI);
    const revokeDiscountAPI = api(state => state.revokeDiscount)

    const filterValuesDefault = {
        searchTerm: "",
        class: "default",
        status: "default",
        category: "default",
    };

    const [filterValues, setFilterValues] = useState(filterValuesDefault);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);
    const [discountCategories, setDiscountCategories] = useState<DiscountCategory[]>([]);
    const [rows, setRows] = useState<StudentPaymentInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const columns: GridColDef[] = [
        {
            field: "studentName",
            headerName: "Name",
            width: 300,
            filterable: false,
            sortable: false,
        },
        {
            field: "className",
            headerName: "Class",
            width: 130,
            filterable: false,
            sortable: false,
        },
        {
            field: "totalFees",
            headerName: "Total Fees",
            width: 150,
            filterable: false,
            sortable: false,
            renderCell: (params) => (
                <div>
                    {formatter(params.row.totalFees)}
                </div>
            )
        },
        {
            field: "discountName",
            headerName: "Discount Category",
            width: 250,
            filterable: false,
            sortable: false,
        },
        {
            field: "discountAmount",
            headerName: "Discount Amount",
            width: 250,
            filterable: false,
            sortable: false,
            renderCell: (params) => (
                <div>
                    {formatter(params.row.discountAmount)}
                </div>
            )
        },
        {
            field: "action",
            headerName: "",
            width: 180,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                if (role === 'management') {

                    if (filterValues.status !== 'Approved') {
                        return (
                            <>
                                <IconButton
                                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginRight: '10px' }}
                                    onClick={() => {
                                        updateStatus(params, 'Approved');
                                    }}
                                >
                                    <CheckOutlined />
                                </IconButton>
                                <IconButton
                                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginRight: '10px' }}
                                    onClick={() => {
                                        updateStatus(params, 'Rejected');
                                    }}
                                >
                                    <CloseOutlined />
                                </IconButton>
                            </>
                        );
                    } else {
                        return (
                            <>
                                <IconButton
                                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginRight: '10px' }}
                                    onClick={() => {
                                        revokeDiscount(params.row)
                                    }}
                                >
                                    <RemoveCircleOutline />
                                </IconButton>
                            </>
                        )
                    }
                }
            },
        }

    ]
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    })

    const handlePageChange = (data: any) => {
        setPaginationModel({
            ...paginationModel,
            page: data.page,
            pageSize: data.pageSize,
        });
        const discountIdToUse = props.isDiscount ? props.discountId : filterValues.category !== 'default' ? filterValues.category : undefined;
        getDiscountApprovalAPI(
            data.page,
            data.pageSize,
            props.isClass ? props.sectionId : filterValues.class !== 'default' ? filterValues.class : undefined,
            discountIdToUse,
            filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
            filterValues.status !== 'default' && 'Pending' ? filterValues.status : undefined,
        ).then((response) => {
            if (response.status === 200) {
                let data = response.data.data
                data = data.map((item: any) => {
                    return { ...item, id: item.studentId }
                })
                setRows(data)
                console.log(data)
                setTotalCount(response.data.resultCount);
            }
        });
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value as string;
        setFilterValues({ ...filterValues, searchTerm: searchValue });
        debouncedHandleSearch(searchValue);
    }

    const debouncedHandleSearch = (searchTerm: string) => {
        clearTimeout(debounceTimer!);
        const timer = setTimeout(() => {
            handleFilter(
                props.isClass ? props.sectionId : filterValues.class !== 'default' ? filterValues.class : undefined,
                props.isDiscount ? props.discountId : filterValues.category !== 'default' ? filterValues.category : undefined,
                searchTerm,
                filterValues.status !== 'default' && 'Pending' ? filterValues.status : undefined,
            )
        }, 300);
        setDebounceTimer(timer);
    }

    const getClasses = () => {
        getClassesAPI(schoolId).then((response: any) => {
            setClasses(response.data.data);
        });
    };


    const getDiscountCategory = () => {
        getDiscountCategoryAPI(schoolId).then((response) => {
            if (response.status == 200) {
                setDiscountCategories(response.data.data)
            }
        })
    }

    const handleFilter = (sectionId: any, discountId: any, searchTerm: any, status: any) => {
        getDiscountApprovalAPI(paginationModel.page, paginationModel.pageSize, sectionId, discountId, searchTerm, status
        ).then((response) => {
            if (response.status === 200) {
                let data = response.data.data
                data = data.map((item: any) => {
                    return { ...item, id: item.studentId }
                })
                setRows(data)
                console.log(data)
                setTotalCount(response.data.resultCount);
            }

        }).catch((error) => {
            console.error(error);
            setRows([]);
            setTotalCount(0);
        });
    }

    const getDiscountApproval = () => {
        getDiscountApprovalAPI(
            paginationModel.page,
            paginationModel.pageSize,
            props.isClass ? props.sectionId : filterValues.class !== 'default' ? filterValues.class : undefined,
            props.isDiscount ? props.discountId : filterValues.category !== 'default' ? filterValues.category : undefined,
            filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
            filterValues.status !== 'default' && 'Pending' ? filterValues.status : undefined
        ).then((response) => {
            if (response.status === 200) {
                let data = response.data.data
                data = data.map((item: any) => {
                    return { ...item, id: item.studentId }
                })
                setRows(data)
                console.log(data)
                setTotalCount(response.data.resultCount);
            }

        }).catch((error) => {
            console.error(error);
            setRows([]);
            setTotalCount(0);
        });
    }

    let isApiCallInProgress = false;

    const updateStatus = (params: any, status: 'Approved' | 'Rejected') => {
        if (isApiCallInProgress) {
            return;
          }
        
          isApiCallInProgress = true;
        let student = {
            studentId: params.row.studentId,
            approvalAmount: params.row.discountAmount,
            sectionId: params.row.sectionId,
            status: status,
            discountId: params.row.discountId
        }
        updateStudentStatusinDiscountAPI(params.row.discountId, student).then((response: any) => {
            if (response.status == 200) {
                getDiscountApproval()
            }

            isApiCallInProgress = false;
        })
    }

    const revokeDiscount = (params: any) => {
        revokeDiscountAPI(params.discountId, params.studentId).then((response: any) => {
            if (response.status == 200) {
                getDiscountApproval()
            }
        })
    }

    useEffect(() => {
        getClasses()
        getDiscountCategory()
        getDiscountApproval()

        if (props.selectedClass) {
            setFilterValues({
                ...filterValues,
                class: props.selectedClass
            })
        }
    }, [])

    return (
        <div className={styles.main}>
            <h1>Discount Requests</h1>
            <br />
            <div className={styles.row}>
                <div className={styles.search}>
                    <Input
                        value={filterValues.searchTerm}
                        placeholder={"Search Students"}
                        onChange={handleSearchChange}
                        type="text"
                    />
                </div>
                {!props.isClass &&

                    <Select
                        className={styles.selector}
                        value={filterValues.class}
                        onChange={(e) => {
                            const classValue = e.target.value as string;
                            setFilterValues({
                                ...filterValues,
                                class: classValue,
                            });
                            handleFilter(classValue,
                                props.isDiscount ? props.discountId : filterValues.category !== 'default' ? filterValues.category : undefined,
                                filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
                                filterValues.status !== 'default' && 'Pending' ? filterValues.status : undefined
                            )
                        }}
                        endAdornment={
                            filterValues.class !== "default" && (
                                <IconButton size="small" onClick={() => {
                                    setFilterValues({ ...filterValues, class: "default" })
                                    handleFilter(
                                        undefined,
                                        props.isDiscount ? props.discountId : filterValues.category !== 'default' ? filterValues.category : undefined,
                                        filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
                                        filterValues.status !== 'default' && 'pending' ? filterValues.status : undefined,
                                    )
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
                }
                <Select
                    className={styles.selector}
                    value={filterValues.status}
                    onChange={(e) => {
                        const studentType = e.target.value as string;
                        setFilterValues({
                            ...filterValues,
                            status: studentType,
                        })
                        handleFilter(
                            props.isClass ? props.sectionId : filterValues.class !== 'default' ? filterValues.class : undefined,
                            props.isDiscount ? props.discountId : filterValues.category !== 'default' ? filterValues.category : undefined,
                            filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
                            studentType !== 'Pending' ? studentType : undefined

                        )
                    }}
                    endAdornment={
                        filterValues.status !== "default" && (
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setFilterValues({ ...filterValues, status: "default" });
                                    handleFilter(
                                        props.isClass ? props.sectionId : filterValues.class !== 'default' ? filterValues.class : undefined,
                                        props.isDiscount ? props.discountId : filterValues.category !== 'default' ? filterValues.category : undefined,
                                        filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
                                        undefined


                                    )
                                }}
                            >
                                <CloseRounded />
                            </IconButton>
                        )
                    }
                    IconComponent={
                        filterValues.status == "default" ? undefined : () => null
                    }
                >
                    <MenuItem value="default" disabled>All Requests</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                </Select>
                {!props.discountId &&

                    <Select
                        className={styles.selector}
                        value={filterValues.category}
                        onChange={(e) => {
                            const category = e.target.value as string;
                            setFilterValues({
                                ...filterValues,
                                category: category,
                            })
                            handleFilter(
                                props.isClass ? props.sectionId : filterValues.class !== 'default' ? filterValues.class : undefined,
                                category,
                                filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
                                filterValues.status !== 'default' && 'Pending' ? filterValues.status : undefined,


                            )
                        }}
                        endAdornment={
                            filterValues.category !== "default" && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setFilterValues({ ...filterValues, category: "default" });
                                        handleFilter(
                                            props.isClass ? props.sectionId : filterValues.class !== 'default' ? filterValues.class : undefined,
                                            undefined,
                                            filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
                                            filterValues.status !== 'default' && 'Pending' ? filterValues.status : undefined,

                                        )
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            )
                        }
                        IconComponent={
                            filterValues.category == "default" ? undefined : () => null
                        }
                    >
                        <MenuItem value="default" disabled>Discount Category</MenuItem>
                        {discountCategories.map((item: DiscountCategory) => {
                            return (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                }
            </div>
            <div className={styles.table}>
                <DataGrid
                    sx={{ border: "0px" }}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10].sort((a, b) => { return a - b; })}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={handlePageChange}
                    rowCount={totalCount}
                />
            </div>
        </div>
    )
}

export default DiscountRequestList