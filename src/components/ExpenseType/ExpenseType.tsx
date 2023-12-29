import React, { useEffect, useState } from 'react'
import styles from './ExpenseType.module.css'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { IconButton } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import api from '@/store/api';
import { Paper, InputBase, TextareaAutosize, Dialog } from '@mui/material';
import { ExpenseTypeModel } from '@/models/ExpenseCreation';
import { createExpenseTypeSchema } from '@/FormSchema/FormValidation';
import CreateExpenseType from '../CreateExpenseType/CreateExpenseType';

const ExpenseType = () => {
    // School Id
    let schoolId = localStorage.getItem('school_id')

    // API's
    const getExpenseTypesAPI = api(state => state.getExpenseTypes)

    // State Variables
    const [totalCount, setTotalCount] = useState(0)
    const [dialogEnabled, setDialogEnabled] = useState(false);
    const [rows, setRows] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const [expenseType, setExpenseType] = useState<ExpenseTypeModel>({
        name: '',
        schoolId: localStorage.getItem('school_id') as string,
        userId: localStorage.getItem('user_id') as string,
        description: '',
        budget: 0,
        remainingBudget: 0,
    })

    // table
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Expense Type', width: 280 },
        { field: 'budget', headerName: 'Budget Allocated', width: 280 },
        { field: 'remainingBudget', headerName: 'Budget Remaining', width: 280 },
        {
            field: 'edit',
            headerName: '',
            sortable: false,
            width: 100,
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

    // Pagination
    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
        getExpenseTypes(localStorage.getItem('school_id') as string, data.page, data.pageSize)
    }

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });


    useEffect(() => {
        getExpenseTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
    }, [])

    const getExpenseTypes = (school_id: string, page: number, limit: number) => {
        getExpenseTypesAPI(school_id, page, limit).then((response: any) => {
            if (response && response.data && response.data.data) {
                let data = response.data.data
                data.map((item: any) => {
                    item.id = item._id
                })
                setRows(data)
                setTotalCount(response?.data?.resultCount)
            }
        })
    }

    const EditExpenseType = (data: any) => {
        setIsEdit(true)
        setExpenseType({
            name: data?.row?.name,
            description: data?.row?.description,
            budget: data?.row?.budget,
            schoolId: localStorage.getItem('school_id') as string,
            userId: localStorage.getItem('user_id') as string,
            remainingBudget: data?.row?.remainingBudget,
            id: data.row.id
        })
        setDialogEnabled(true)
    }

    useEffect(() => {
        getExpenseTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
    }, [])

    useEffect(() => {
        if (!dialogEnabled) {
            getExpenseTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
        }
    }, [dialogEnabled])

    return (
        <div className={styles.main_list}>
            <div className={styles.header_list}>
                <button
                    onClick={() => {
                        setDialogEnabled(true)
                        setIsEdit(false)
                    }}
                >Add New</button>
            </div>
            <div
                style={{ height: 425, background: 'white', padding: '20px', borderRadius: '10px' }}>
                <DataGrid
                    sx={{ border: '0px' }}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                    onCellClick={EditExpenseType}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={handlePageChange}
                    rowCount={totalCount}

                />
            </div>
            <Dialog open={dialogEnabled} maxWidth="xl">
                <CreateExpenseType
                    isEdit={isEdit}
                    expenseType={expenseType}
                    setDialogEnabled={setDialogEnabled}
                />
            </Dialog>
        </div>
    )
}

export default ExpenseType