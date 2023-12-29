import { useEffect, useState } from 'react'
import styles from './FeeType.module.css'
import Dialog from '@mui/material/Dialog';
import { IconButton, InputBase, MenuItem, Paper, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material';
import Close from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import api from '../../store/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FeeTypeModel } from '../../models/FeeType';
import { FeeTypeSchema } from '../../FormSchema/FormValidation'


const FeeType = (props: any) => {
  const [rows, setRows] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'associatedAccount', headerName: 'Associated Account', width: 300 },
    {
      field: 'edit',
      headerName: '',
      sortable: false,
      width: 250,
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

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize })
    getFeeTypes(localStorage.getItem('school_id') as string, data.page, data.pageSize)
  }


  useEffect(() => {
    getFeeTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
  }, [])

  const createFeeType = api((state) => state.createFeeType)
  const updateFeeType = api((state) => state.updateFeeType)
  const getFeeTypesApi = api((state) => state.getFeeType)
  const setError = api((state) => state.setError)

  const [feeType, setFeeType] = useState<FeeTypeModel>({
    feeType: '',
    description: '',
    accountType: 'default',
    schoolId: '',
    categoryId: props.id
  });

  const [dialogEnabled, setDialogEnabled] = useState(false)

  const handleChange = (event: SelectChangeEvent) => {
    setFeeType({
      ...feeType,
      accountType: event.target.value as FeeTypeModel['accountType'],
    })
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

  const handleSubmit = async () => {
    try {
      await FeeTypeSchema.validate(feeType, { abortEarly: false });
      const school_id: string | any = localStorage.getItem('school_id')
      if (school_id !== '' && school_id.length == 24) {
        await createFeeType({ ...feeType, schoolId: school_id }).then((response: any) => {
          if (response.status == 201) {
            setDialogEnabled(false)
            setFeeType({
              ...feeType,
              feeType: '',
              description: '',
              accountType: 'default',
            })
            setTimeout(() => {
              getFeeTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
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


  const getFeeTypes = async (school_id: string, page: number, limit: number) => {
    getFeeTypesApi(school_id, page, limit, props.id).then((response: any) => {
      let data: any = response?.data?.data
      data = data?.map((item: any) => {
        return {
          id: item._id,
          name: item.feeType,
          description: item.description,
          associatedAccount: item.accountType
        }
      })
      setRows(data)
      setTotalCount(response?.data?.resultCount)
    })
  }

  const handleUpdate = async () => {
    try {
      await FeeTypeSchema.validate(feeType, { abortEarly: false });
      const school_id: string | any = localStorage.getItem('school_id')
      if (school_id !== '' && school_id.length == 24) {
        await updateFeeType({ ...feeType, schoolId: school_id }).then((response: any) => {
          if (response.status == 200) {
            setDialogEnabled(false)
            setFeeType({
              ...feeType,
              feeType: '',
              description: '',
              accountType: 'default',
            })
            setTimeout(() => {
              getFeeTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
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

  const EditFeeType = (data: any) => {
    setIsEdit(true)
    setFeeType({
      feeType: data?.row?.name,
      description: data?.row?.description,
      accountType: data?.row?.associatedAccount,
      schoolId: localStorage.getItem('school_id'),
      id: data.row.id
    })
    setDialogEnabled(true)
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <button
          data-testid='add-new'
          onClick={() => {
            setDialogEnabled(true)
            setIsEdit(false)
          }}>Add New</button>
      </div>
      <div className={styles.container}>
        <div data-testid='datagrid' style={{ height: 425, background: 'white', padding: '20px', borderRadius: '10px' }}>
          {
            rows?.length > 0 &&
            <DataGrid
              data-testid='fee-type-datagrid'
              sx={{ border: '0px' }}
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
              onCellClick={EditFeeType}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={handlePageChange}
              rowCount={totalCount}
            />}
        </div>
      </div>
      <Dialog open={dialogEnabled} onClose={(()=>{setDialogEnabled(false)})} maxWidth='xl'>
        <div className={styles.dialog}>
          <div className={styles.dialog_header}>
            <h1>Fee Type</h1>
            <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={() => {
              setDialogEnabled(false);
              setFeeType({
                ...feeType,
                feeType: '',
                description: '',
                accountType: 'default',
              })
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
                onChange={handleChange}
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
            {!isEdit ?
              <button
                data-testid='add-save'
                onClick={() => {
                  handleSubmit()
                }}>Save</button> :
              <button onClick={() => {
                handleUpdate()
              }}>Update</button>}
          </div>
        </div>
      </Dialog >
    </div >
  )
}

export default FeeType
