import styles from './MiscellaneousCollectionList.module.css';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from 'react';
import api from '@/store/api';
import { ReceiptModel } from '@/models/Receipt';
import { Dialog, IconButton } from '@mui/material';
import { Print } from '@mui/icons-material';
import Receipt from '../Receipt/Receipt';
import { formatter } from '@/helpers/formatter';

interface MiscCollection {
  studentName: string;
  className: string;
  feeType: string;
  amount: number;
}

const MiscellaneousList = () => {
  const schoolId = localStorage.getItem('school_id')

  // API's
  const getMiscCollectionsAPI = api(state => state.getMiscCollections)
  const getReceiptbyIdAPI = api(state => state.getReceiptbyId)

  const [rows, setRows] = useState<MiscCollection[]>([]);

  const columns: GridColDef[] = [
    { field: "studentName", headerName: "Student Name", width: 250 },
    {
      field: 'admission_no', headerName: 'Admission Number', width: 200,
      renderCell: (params: any) => {
        return <div>
          {params.row.admission_no ? params.row.admission_no : "-"}
        </div>
      }
    },
    { field: "parentName", headerName: "Parent Name", width: 250 },
    { field: "className", headerName: "Class", width: 150 },
    { field: "feeType", headerName: "Fee Type", width: 250 },
    { field: "amount", headerName: "Amount", width: 140 },
    {
      field: "print",
      headerName: "",
      width: 50,
      renderCell: (params: any) => {
        return <IconButton
          onClick={(e) =>{ 
            e.stopPropagation()
            printReceipt(params.row.id)
          }}
          sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
          <Print />
        </IconButton>
      }
    },
  ]

  const [totalCount, setTotalCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [dialogEnabled, setDialogEnabled] = useState(false)
  const [receipt, setReceipt] = useState<ReceiptModel>({} as ReceiptModel)

  const handlePageChange = (data: any) => {
    setPaginationModel({ page: data.page, pageSize: data.pageSize })
    getMiscCollections(data.page, data.pageSize)
  }

  const getMiscCollections = (page: number, limit: number) => {
    getMiscCollectionsAPI(schoolId as string, page, limit).then((response: any) => {
      if (response.status === 200) {
        let data = response.data.data
        data = data.map((item: ReceiptModel) => {
          return {
            id: item._id,
            studentName: item.student.name,
            admission_no: item.student.admission_no,
            parentName: item.parent.name,
            className: item.student.class.name,
            feeType: item.items[0].feeTypeId.feeType,
            amount: `${formatter(item.totalAmount)}`
          }
        })
        setRows(data)
        setTotalCount(response.data.resultCount)
      }
    })
  }


  const printReceipt = (id: string) => {
    getReceiptbyIdAPI(id).then((response: any) => {
      if (response.status === 200) {
        setReceipt(response.data.data)
        setDialogEnabled(true)
      }
    })
  }

  useEffect(() => {
    getMiscCollections(paginationModel.page, paginationModel.pageSize)
  }, [])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <div style={{ height: '450px', margin: '20px 0px' }}>
            <DataGrid
              sx={{ border: "0px" }}
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={handlePageChange}
              rowCount={totalCount}
              onCellClick={(params) => {
                  printReceipt(params.row.id);
              }}
            />
          </div>
        </div>
      </div>
      <Dialog open={dialogEnabled} maxWidth='xl'>
        <Receipt
          receipt={receipt}
          setDialogEnabled={setDialogEnabled}
        />
      </Dialog >
    </>
  )

}

export default MiscellaneousList