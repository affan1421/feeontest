import { DataGrid, GridColDef } from '@mui/x-data-grid'
import styles from './DonorStudentList.module.css'
import { useEffect, useState } from 'react';
import api from '@/store/api'
import { formatter } from '@/helpers/formatter';

interface DonorStudentListProps {
    donorId: string
}

interface Student {
    _id: string,
    amount: number,
    date: string,
    paymentType: string,
    studentId: {
        _id: string,
        name: string,
        admission_no: number,
    },
    sectionId: {
        _id: string,
        name: string,
        className: string
    }
}

const DonorStudentList = (props: DonorStudentListProps) => {
    // API's
    const getDonorStudentListAPI = api(state => state.getStudentsListDonor)

    const [rows, setRows] = useState<Student[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 250 },
        {
            field: 'admission_no', headerName: 'Admission Number', width: 200,
            renderCell: (params) => {
                return <div>{params.row.admission_no ? params.row.admission_no : '-'}</div>
            }
        },
        { field: 'class', headerName: 'Class', width: 200 },
        { field: 'amount', headerName: 'Donation Amount', width: 200 },
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'paymentMethod', headerName: 'Payment Method', width: 200 },
    ]

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
    }

    const getStudents = () => {
        getDonorStudentListAPI(props.donorId, paginationModel.page, paginationModel.pageSize).then((response) => {
            let data = response.data.data
            data = data.map((donor: Student) => {
                return {
                    ...donor,
                    id: donor._id,
                    name: donor.studentId.name,
                    admission_no: donor.studentId.admission_no,
                    class: donor.sectionId.className,
                    date: new Date(donor.date).getDate() + '/' + (new Date(donor.date).getMonth() + 1) + '/' + new Date(donor.date).getFullYear(),
                    amount: formatter(donor.amount),
                    paymentMethod: donor.paymentType
                }
            })
            setRows(data)
            setTotalCount(response.data.data.totalCount)
        })
    }

    useEffect(() => {
        getStudents()
    }, [])

    return (
        <div className={styles.main}>
            <DataGrid
                sx={{ border: '0px' }}
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 25, totalCount < 150 ? totalCount : 150].sort((a, b) => { return a - b })}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={handlePageChange}
                rowCount={totalCount}
            />
        </div>
    )
}

export default DonorStudentList