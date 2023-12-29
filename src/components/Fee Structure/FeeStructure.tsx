import { IconButton } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import styles from './FeeStructure.module.css'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import api from '../../store/api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddFeeStructure from '../Fee Structure/AddFeeStructure/AddFeeStructure'
import { FeeStructureModel } from '../../models/FeeStructure'

const FeeStructure = (props: any) => {

  // API's 
  const getFeeStructureAPI = api(state => state.getFeeStructures)
  const getFeeStructureByIdAPI = api(state => state.getFeeStructureById)


  // Data variables
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDuplicate, setIsDuplicate] = useState(false)

  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const columns: GridColDef[] = [
    { field: 'feeStructureName', headerName: 'Name', width: 180 },
    { field: 'description', headerName: 'Description', width: 180 },
    { field: 'academicYear', headerName: 'Academic Term', width: 180 },
    { field: 'classesString', headerName: 'Classes Associated', width: 180 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 200 },
    {
      field: 'edit',
      headerName: '',
      sortable: false,
      width: 100,
      align: 'right',

      renderCell: (params) => (
        <IconButton
          onClick={() => {
            EditFeeStructure(params)
          }}
          data-testid='edit-btn'
          sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}
        >
          <EditOutlinedIcon />
        </IconButton>
      ),
    },
    {
      field: 'duplicate',
      headerName: '',
      sortable: false,
      width: 50,
      align: 'right',

      renderCell: (params) => (
        <IconButton
          onClick={() => {
            DuplicateFeeStructure(params)
          }}
          data-testid='edit-btn'
          sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}
        >
          <ContentCopyIcon />
        </IconButton>
      ),
    }
  ];
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [feeStructure, setfeeStructure] = useState<FeeStructureModel>({
    feeStructureName: '',
    academicYear: 'default',
    schoolId: null,
    classes: [],
    description: '',
    feeDetails: [],
    totalAmount: 0,
    categoryId: props.id
  })

  // Pagination
  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize })
    getFeeStructures(localStorage.getItem('school_id') as string, data.page, data.pageSize)
  }

  // Get and Edit

  const getFeeStructures = (schoolId: string, page: number, limit: number) => {
    getFeeStructureAPI(schoolId, page, limit, props.id).then((response: any) => {
      if (response.status == 200) {
        let data: any = response?.data?.data
        data = data?.map((item: any) => {
          return {
            id: item._id,
            feeStructureName: item.feeStructureName,
            academicYear: item.academicYearId.name,
            schoolId: item.schoolId,
            classes: item.classes.map((cls: any) => ({
              name: cls.name,
              sectionId: cls.sectionId,
            })),
            classesString: item.classes.map((cls: any) => (
              ' ' + (cls.name.toString().toUpperCase())
            )),
            description: item.description,
            feeDetails: item.feeDetails.map((fd: any) => ({
              feeTypeId: fd.feeTypeId,
              scheduleTypeId: fd.scheduleTypeId,
              scheduledDates: fd.scheduledDates.map((sd: any) => ({
                date: new Date(sd.date),
                amount: sd.amount,
              })),
              totalAmount: fd.totalAmount,
              breakdown: fd.breakdown,
            })),
            totalAmount: item.totalAmount,
          }
        })
        setRows(data)
        setTotalCount(response?.data?.resultCount)
      }
    })
  }

  useEffect(() => {
    console.log(props);
    getFeeStructures(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
  }, [])


  const EditFeeStructure = async (data: any) => {
    await getFeeStructureByIdAPI(data.row.id).then(async (response: any) => {
      let data = await response.data.data;
      console.log(data);
      setfeeStructure({
        id: data._id,
        feeStructureName: data.feeStructureName,
        academicYear: data.academicYear,
        academicYearId: data.academicYearId._id,
        schoolId: data.schoolId,
        classes: data.classes,
        classesString: data.classesString,
        description: data.description,
        feeDetails: data.feeDetails,
        totalAmount: data.totalAmount,
        studentList: data.studentList
      })
    })
    setIsEdit(true)
    setIsAdd(true)
  }

  const DuplicateFeeStructure = async (data: any) => {
    await getFeeStructureByIdAPI(data.row.id).then(async (response: any) => {
      let data = await response.data.data;
      setfeeStructure({
        id: data._id,
        feeStructureName: `${data.feeStructureName} - DUPLICATED`,
        academicYear: data.academicYear,
        schoolId: data.schoolId,
        classes: data.classes,
        classesString: data.classesString,
        description: `${data.description} - DUPLICATED`,
        feeDetails: data.feeDetails,
        totalAmount: data.totalAmount,
        studentList: data.studentList,
        categoryId: props.id
      })
    })

    setIsDuplicate(true)
    setIsEdit(false)
    setIsAdd(true)
  }

  const closeAdd = () => {
    setIsAdd(false)
  }

  useEffect(() => {
    if (!isAdd) {
      setTimeout(() => {
        getFeeStructures(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
      }, 2000)
    }
  }, [isAdd])



  return (
    <>
      <div className={styles.main}>
        {
          isAdd ?
            <div className={styles.add} >
              <div className={styles.add_header}>
                <div className={styles.a_h_left} >
                  <IconButton onClick={() => {
                    setIsAdd(false)
                  }}>
                    <ArrowBackIcon />
                  </IconButton>
                  &nbsp;&nbsp;
                  All fee structures
                </div>
              </div>
              <div>
                {
                  isEdit ?
                    // Edit
                    <AddFeeStructure isEdit={true} feeStructure={feeStructure} categoryId={props.id} closeAdd={closeAdd} />
                    :
                    (isDuplicate
                      ?
                      // Duplicate
                      <AddFeeStructure isEdit={false} isDuplicate={true} closeAdd={closeAdd} categoryId={props.id} feeStructure={feeStructure} />
                      :
                      // Only Add
                      <AddFeeStructure isEdit={false} closeAdd={closeAdd} categoryId={props.id} />
                    )


                }
              </div>
            </div> :
            <div className={styles.list}>
              <div className={styles.header}>
                <button
                  data-testid='add-new'
                  onClick={() => {
                    setfeeStructure({
                      ...feeStructure,
                      id: '',
                      feeStructureName: '',
                      academicYear: '',
                      classes: [],
                      description: '',
                      feeDetails: [],
                      totalAmount: 0,
                      studentList: [],
                      categoryId: props.id,
                    })
                    setIsAdd(true)
                    setIsEdit(false)
                  }}>Add New</button>
              </div>
              <div className={styles.container}>
                <div data-testid='datagrid' style={{ height: 425, background: 'white', padding: '20px', borderRadius: '10px' }}>
                  <DataGrid
                    data-testid='fee-type-datagrid'
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
            </div>
        }


      </div >
    </>
  )
}

export default FeeStructure