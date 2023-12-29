import { formatter } from '@/helpers/formatter';
import { CloseRounded, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, MenuItem, Pagination, Select, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Input from '@/Elements/Input/Input'
import styles from './DiscountStudentList.module.css'
import React, { useEffect, useState } from 'react'
import api from '@/store/api';
import { Class } from '@/models/Class';
import { useNavigate } from 'react-router-dom';

interface Student {
  _id: string;
  name: string;
  className: string;
  totalFees: number;
}

const DiscountStudentList = () => {

  //Variables
  let schoolId = localStorage.getItem('school_id') as string

  //API's
  const getClassesAPI = api((state) => state.getClasses)
  const getStudentListAPI = api((state) => state.getStudentList)


  const filterValuesDefault = {
    searchTerm: "",
    class: "default",
  };

  // state variables
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState('default');
  const [filterValues, setFilterValues] = useState(filterValuesDefault);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();


  const studentColumns: GridColDef[] = [
    { field: 'name', headerName: 'Student Name', width: 200 },
    { field: 'className', headerName: 'Class', width: 150 },
    {
      field: 'totalFees', headerName: 'Total Fees', width: 120,
      renderCell: (params) => (
        <>
          {formatter(params.row.totalFees)}
        </>
      )
    },
    {
      field: 'discount',
      headerName: 'Discount Category',
      width: 250,
      renderCell: (params) => (
        <>
          <div className={styles.categoryRow}>
            {params.row.discounts && params.row.discounts.map((discount: any, index: any) => (
              <div key={index} className={styles.category}>
                {discount.name}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      field: 'discounts',
      headerName: 'Discount Amount',
      width: 180,
      renderCell: (params) => (
        <div className={styles.amountRow}>
          {params.row.discounts && params.row.discounts.map((discount: any, index: any) => (
            <div key={`amount-${params.row._id}-${index}`} className={styles.amount}>
              {formatter(discount.amount)}
            </div>
          ))}
        </div>
      ),
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
          onClick={(() => {
            navigate(`/studentReport/${params.row._id}`)
          })}
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
    getStudentListAPI(
      data.page,
      data.pageSize,
      filterValues.class !== 'default' ? filterValues.class : undefined,
      filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
    ).then((response) => {
      if (response.status === 200) {
        let data = response.data.data
        data = data.map((item: any) => {
          return { ...item, id: item._id }
        })
        setStudents(data)
        console.log(data)
        setTotalCount(response.data.resultCount);
      }
    })
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
        filterValues.class !== 'default' ? filterValues.class : undefined,
        searchTerm,
      )
    }, 300);
    setDebounceTimer(timer);
  }
  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value)
  }

  const getClasses = () => {
    getClassesAPI(schoolId).then((response: any) => {
      setClasses(response.data.data);
    });
  };

  const handleFilter = (sectionId: any, searchTerm: any) => {
    getStudentListAPI(
      paginationModel.page,
      paginationModel.pageSize,
      sectionId,
      searchTerm
    ).then((response) => {
      if (response.status === 200) {
        let data = response.data.data
        data = data.map((item: any) => {
          return { ...item, id: item._id }
        })
        setStudents(data)
        console.log(data)
        setTotalCount(response.data.resultCount);
      }
    }).catch((error) => {
      console.error(error);
      setStudents([]);
      setTotalCount(0);
    });

  }

  const getAllStudent = () => {
    getStudentListAPI(
      paginationModel.page,
      paginationModel.pageSize,
      filterValues.class !== 'default' ? filterValues.class : undefined,
      filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
    ).then((response) => {
      if (response.status === 200) {
        let data = response.data.data
        data = data.map((item: any) => {
          return { ...item, id: item._id }
        })
        setStudents(data)
        console.log(data)
        setTotalCount(response.data.resultCount);
      }
    }).catch((error) => {
      console.error(error);
      setStudents([]);
      setTotalCount(0);
    });;
  }

  useEffect(() => {
    getClasses()
    getAllStudent()
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
              handleFilter(classValue,
                filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
              )
            }}
            endAdornment={
              filterValues.class !== "default" && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setFilterValues({ ...filterValues, class: "default" })
                    handleFilter(
                      undefined,
                      filterValues.searchTerm !== '' ? filterValues.searchTerm : undefined,
                    )
                  }}
                >
                  <CloseRounded />
                </IconButton>
              )
            }
            IconComponent={
              selectedClass == "default" ? undefined : () => null
            }
          >
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
            getRowHeight={() => 'auto'}
            getRowId={(row) => row.id}
          />

        </div>

      </div>
    </>
  )
}

export default DiscountStudentList