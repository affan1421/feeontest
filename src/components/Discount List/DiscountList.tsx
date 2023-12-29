import React, { useEffect, useState } from "react";
import styles from "../Discount List/DiscountList.module.css";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import api from "@/store/api";
import { Discount } from "@/models/Discount";
import global from '@/store/global'
import { useNavigate } from "react-router-dom";
import { DiscountApproval } from "@/models/DiscountApproval";

const DiscountList = () => {
  // Role
  const role = localStorage.getItem('role_name')

  // Navigate
  const navigate = useNavigate()

  // API's 
  const getDiscountTypesAPI = api(state => state.getDiscountTypes)

  // State
  const setIsDiscountEdit = global(state => state.setIsDiscountEdit)
  const setDiscountApproval = global(state => state.setDiscountApproval)

  // Data Variables
  const schoolId = localStorage.getItem('school_id') as string

  const columns: GridColDef[] = [
    { field: "name", headerName: "Discount category", width: 200 },
    { field: "totalBudget", headerName: "Budget Allocated", width: 160 },
    { field: "budgetRemaining", headerName: "Budget remaining", width: 160 },
    { field: "totalStudents", headerName: "Students mapped", width: 160 },
    { field: "totalApproved", headerName: "Approved Students", width: 160 },
    { field: "totalPending", headerName: "Pending Students", width: 160 },
    {
      field: "edit",
      headerName: "",
      sortable: false,
      width: 60,
      align: "right",

      renderCell: (params) => (
        <IconButton
          sx={{ border: "1.5px solid #DBDBDB", borderRadius: "04px" }}
          onClick={() => {
            role !== 'management' ?
              handleEditDiscount(params)
              :
              handleDiscountView(params)
          }}
        >
          {role !== 'management' ?
            <VisibilityIcon />
            :
            <VisibilityIcon />
          }
        </IconButton>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [totalCount, setTotalCount] = useState(0);
  const [rows, setRows] = useState<Discount[]>([])

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize })
    getDiscountTypes(localStorage.getItem('school_id') as string, data.page, data.pageSize)
  }
  const getDiscountTypes = (schoolId: string, page: number, limit: number) => {
    getDiscountTypesAPI(schoolId, page, limit).then((response: any) => {
      if (response && response?.status == 200) {
        let data = response.data.data
        data = data.map((item: any) => {
          return {
            ...item,
            id: item._id
          }
        })
        setTotalCount(Number(response.data.resultCount))
        setRows(data);
      } else {
        setTotalCount(0)
        setRows([])
      }
    })
  }

  const handleEditDiscount = (params: any) => {
    setIsDiscountEdit(true)
    navigate(`/add-discount/${params.row.id}`)
  }

  const handleDiscountView = (params: any) => {
    let discountapproval: DiscountApproval = {
      name: params.row.name,
      description: params.row.description,
      totalBudget: params.row.totalBudget,
      id: params.row.id,
      allotted: params.row.budgetAlloted,
      studentsCount: params.row.totalStudents,
      budgetSpent: params.row.totalBudget - params.row.budgetRemaining,
      classesCount: params.row.classesAssociated,
      students: params.row.totalStudents,
      remaining: params.row.budgetRemaining,
      totalPending: params.row.totalPending,
      totalApproved: params.row.totalApproved
    }
    setDiscountApproval(discountapproval)
    navigate(`/discount-approval/${params.row.id}`)
  }

  useEffect(() => {
    getDiscountTypes(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
  }, [])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <div style={{ height: '450px', margin: '20px 0px' }}>
            <DataGrid
              sx={{ border: '0px' }}
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={handlePageChange}
              rowCount={totalCount}
              onCellClick={(params) => {
                role !== 'management' ?
                handleEditDiscount(params)
                :
                handleDiscountView(params)
            }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountList;
