import { useEffect, useState } from 'react';
import styles from './Donor.module.css'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Dialog } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import user from '@/assests/user.png'
import AddDonor from '@/components/AddDonor/AddDonor';
import api from '@/store/api';
import { useNavigate } from 'react-router-dom'
import { formatter } from '@/helpers/formatter';

interface DonorPageData {
    totalDonations: number
    highestDonation: {
        className: string
        amount: number
    },
    highestDonor: {
        profile_image: string
        name: string
        totalAmount: number
        donorType: string
    }
}

interface Donor {
    name: string
    donated_amount: number
    id: string
    _id: string
}

const Donor = () => {
    // API's
    const getDonorStatsAPI = api(state => state.getDonorStats)

    const navigate = useNavigate()

    // API's 
    const getDonorListAPI = api(state => state.getDonorList)
    const [refreshTable, setRefreshTable] = useState(false);


    const schoolId = localStorage.getItem('school_id') as string
    const [rows, setRows] = useState<Donor[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Donors', width: 350 },
        { field: 'donated_amount', headerName: 'Donated Amount', width: 350 },
        {
            field: 'view',
            headerName: '',
            sortable: false,
            width: 250,
            align: 'right',

            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        navigate(`/donordetail/${params.row.id}`)
                    }}
                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ];

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const [dialogEnabled, setDialogEnabled] = useState<boolean>(false)

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
        getDonorList(data.page, data.pageSize)
    }

    const getDonorList = async (page: number, limit: number) => {
        getDonorListAPI(schoolId as string, page, limit).then((response) => {
            let data = response.data.data
            data = data.map((donor: any) => {
                return {
                    name: donor.name,
                    donated_amount: donor.totalAmount,
                    id: donor._id,
                }
            })
            setRows(data)
            setTotalCount(response.data.resultCount)
        })
    }

    const [data, setData] = useState<DonorPageData>(
        {
            totalDonations: 15000,
            highestDonation: {
                className: '',
                amount: 0
            },
            highestDonor: {
                profile_image: '',
                name: '',
                totalAmount: 0,
                donorType: ''
            },
        }
    )


    const handleFormSubmit = () => {
        setRefreshTable(true);
        getDonorList(paginationModel.page, paginationModel.pageSize)
    };

    const getDonorStats = async () => {
        getDonorStatsAPI(schoolId).then((response) => {
            if (response.status == 200) {
                let data = response.data.data
                setData({
                    ...data,
                    data
                })
            }
        })
    }

    useEffect(() => {
        getDonorList(paginationModel.page, paginationModel.pageSize)
        getDonorStats()
    }, [])

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <button onClick={() => { setDialogEnabled(true) }}>Add New</button>
            </div>
            <div className={styles.row}>
                <div className={`${styles.card} ${styles.total_amount_card}`}>
                    <span className={styles.amount}>{formatter(data?.totalDonations)}</span>
                    <span className={styles.title}>Total Amount Donated</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.tag}>Highest</span>
                    <span className={styles.amount}>{formatter(data?.highestDonation?.amount)}</span>
                    <span className={styles.title}>{data?.highestDonation?.className}</span>
                </div>
                <div className={`${styles.card} ${styles.top_donor_card}`}>
                    <div>
                        {data?.highestDonor?.profile_image && <img src={data?.highestDonor?.profile_image} />}
                        {!data?.highestDonor?.profile_image && <img src={user} />}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '20px'
                        }}
                    >
                        <span className={styles.tag}>Highest</span>
                        <span className={styles.amount}>{data?.highestDonor?.name}</span>
                        <span className={styles.title}>{data?.highestDonor?.totalAmount}</span>
                    </div>
                </div>
            </div>
            <div className={styles.table}>
                <DataGrid
                    key={refreshTable ? 'refresh' : 'initial'}
                    sx={{ border: '0px' }}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={handlePageChange}
                    rowCount={totalCount}
                    onCellClick={(params) => {
                        navigate(`/donordetail/${params.row.id}`)
                    }}
                />
            </div>
            <Dialog open={dialogEnabled} onClose={(()=>setDialogEnabled(false))} maxWidth='xl'>
                <AddDonor setDialogEnabled={setDialogEnabled} onFormSubmit={handleFormSubmit} />
            </Dialog>
        </div>
    )
}

export default Donor