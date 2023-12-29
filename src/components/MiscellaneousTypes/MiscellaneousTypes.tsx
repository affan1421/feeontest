import styles from './MiscellaneousTypes.module.css';
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { IconButton, InputBase, MenuItem, Paper, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material';
import Close from '@mui/icons-material/Close'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FeeTypeModel } from '@/models/FeeType';
import api from '../../store/api';
import { FeeTypeSchema } from '../../FormSchema/FormValidation'

const AddMiscellaneous = () => {
    const schoolId = localStorage.getItem('school_id') as string
    const [rows, setRows] = useState([]);
    const [totalCount, setTotalCount] = useState(0)
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'associatedAccount', headerName: 'Associated Account', width: 300 },
    ];

    const createMiscellaneousFeeAPI = api((state) => state.createMiscellaneousFee)
    const getMiscellaneousFeeTypesAPI = api((state) => state.getMiscellaneousFeeTypes)
    const setError = api((state) => state.setError)

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const [dialogEnabled, setDialogEnabled] = useState(false)

    const [feeType, setFeeType] = useState<FeeTypeModel>({
        feeType: '',
        description: '',
        accountType: 'default',
        schoolId: '',
        isMisc: true
    })

    useEffect(() => {
        getMiscFeeTypes(schoolId, paginationModel.page, paginationModel.pageSize)
    }, [])

    const handleSubmit = async () => {
        try {
            await FeeTypeSchema.validate(feeType, { abortEarly: false });
            const school_id: string | any = localStorage.getItem('school_id')
            if (school_id !== '' && school_id.length == 24) {
                await createMiscellaneousFeeAPI({ ...feeType, schoolId: school_id, isMisc: true }).then((response: any) => {
                    if (response.status == 201) {
                        setDialogEnabled(false)
                        setFeeType({
                            ...feeType,
                            feeType: '',
                            description: '',
                            accountType: 'default',
                        })
                        setTimeout(() => {
                            getMiscFeeTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
                        }, 3000)
                    }
                })
            }
        } catch (error: any) {
            const errorMessage = error.errors.join('\n');
            setError(true, errorMessage);
            setTimeout(() => {
                setError(false, '');
            }, 2000)
        }

    }

    const getMiscFeeTypes = async (school_id: string, page: number, limit: number) => {
        getMiscellaneousFeeTypesAPI(school_id, page, limit).then((response: any) => {
            if (response.status == 200) {
                let data: any = response?.data?.data
                data = data?.map((item: FeeTypeModel) => {
                    return {
                        id: item._id,
                        name: item.feeType,
                        description: item.description,
                        associatedAccount: item.accountType
                    }
                })
                setRows(data)
                setTotalCount(response?.data?.resultCount)
            }
        })
    }

    const handlePageChange = (data: any) => {
        getMiscFeeTypes(schoolId, data.page, data.pageSize)
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeeType({
            ...feeType,
            feeType: event.target.value,
        })
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeeType({
            ...feeType,
            description: event.target.value,
        })
    }

    const handleAccountChange = (event: SelectChangeEvent) => {
        setFeeType({
            ...feeType,
            accountType: event.target.value as FeeTypeModel['accountType'],
        })
    }

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <span>Miscellaneous Types</span>
                <button
                    onClick={() => {
                        setDialogEnabled(true)
                    }}>Add New</button>
            </div>
            <div className={styles.container}>
                <div
                    style={{ height: 425, margin: '20px', background: 'white', padding: '20px', borderRadius: '10px' }}>
                    <DataGrid
                        sx={{ border: '0px' }}
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                        paginationModel={paginationModel}
                        paginationMode="server"
                        onPaginationModelChange={handlePageChange}
                        rowCount={totalCount}
                    />
                </div>
            </div>
            <Dialog open={dialogEnabled}onClose={(()=>{setDialogEnabled(false)})} maxWidth='xl'>
                <div className={styles.dialog}>
                    <div className={styles.dialog_header}>
                        <h1>Create Miscellaneous Fee</h1>
                        <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={() => {
                            setDialogEnabled(false);
                        }} data-testid='close'>
                            <Close />
                        </IconButton>
                    </div>
                    <div className={styles.dialog_container}>
                        <div>
                            <span className={styles.label}>Name</span>
                            <br />
                            <Paper
                                className={styles.input} >
                                <InputBase
                                    placeholder='Name'
                                    id="filled-hidden-label-small"
                                    size="small"
                                    className={styles.input_input}
                                    value={feeType.feeType}
                                    onChange={handleNameChange}
                                    data-testid='add-name'
                                />
                            </Paper>
                        </div>
                        <div style={{ margin: '20px 0px' }}>
                            <span className={styles.label}>Description</span>
                            <br />
                            <Paper
                                className={styles.input_desc} >
                                <TextareaAutosize
                                    data-testid='add-description'
                                    placeholder='Description'
                                    id="filled-hidden-label-small"
                                    className={styles.input_input_desc}
                                    value={feeType.description}
                                    onChange={handleDescriptionChange}
                                />
                            </Paper>
                        </div>
                        <div>
                            <Select
                                value={feeType.accountType}
                                className={styles.account_selector}
                                onChange={handleAccountChange}
                                data-testid='add-selectaccount'
                            >
                                <MenuItem value='default'>Select Account</MenuItem>
                                <MenuItem value='Savings'>Savings</MenuItem>
                                <MenuItem value='Current'>Current</MenuItem>
                                <MenuItem value='FixedDeposit'>Fixed Deposit</MenuItem>
                                <MenuItem value='Assets'>Assets</MenuItem>
                                <MenuItem value='Liabilities'>Liabilities</MenuItem>
                                <MenuItem value='Equity'>Equity</MenuItem>
                                <MenuItem value='Revenue'>Revenue</MenuItem>
                                <MenuItem value='Expenses'>Expenses</MenuItem>
                                <MenuItem value='Debits'>Debits</MenuItem>
                                <MenuItem value='Credits'>Credits</MenuItem>
                                <MenuItem value='AccountsPayable'>Accounts Payable</MenuItem>
                                <MenuItem value='AccountsReceivable'>Accounts Receivable</MenuItem>
                                <MenuItem value='Cash'>Cash</MenuItem>
                            </Select>
                        </div>
                        <br />
                    </div>
                    <div className={styles.dialog_footer}>

                        <button
                            onClick={() => {
                                handleSubmit()
                            }}>Save</button>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default AddMiscellaneous