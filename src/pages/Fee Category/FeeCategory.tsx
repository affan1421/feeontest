import { useState, useEffect } from 'react'
import styles from './FeeCategory.module.css'
import { Dialog, IconButton } from '@mui/material'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateCategory from '../../components/CreateCategory/CreateCategory';
import api from '../../store/api';
import { useNavigate } from 'react-router-dom';


const FeeCategory = () => {
    const navigate = useNavigate();
    const getFeeCategoriesAPI = api((state) => state.getFeeCategories)

    const [rows, setRows] = useState([
    ])
    const [totalCount, setTotalCount] = useState(1)
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'academicterm', headerName: 'Academic Term', width: 300 },
        {
            field: 'edit',
            headerName: '',
            sortable: false,
            width: 250,
            filterable: false,
            align: 'right',

            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        navigate(`/fee-structure/${params.row.id}/${params.row.name}`);
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
    const [dialogEnabled, setDialogEnabled] = useState(false);

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize })
    }

    const getFeeCategories = async (school_id: string, page: number, limit: number) => {
        getFeeCategoriesAPI(school_id, page, limit).then((response: any) => {
            if (response.status == 200) {
                let data: any = response?.data?.data
                data = data?.map((item: any) => {
                    return {
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        academicterm: item?.academicYearId[0].name
                    }
                })
                console.log(data);
                setRows(data)
                setTotalCount(response?.data?.resultCount)
            }
        })
    }

    useEffect(() => {
        // Fetch API
        getFeeCategories(localStorage.getItem('school_id') as string, paginationModel.page, paginationModel.pageSize)
    }, [dialogEnabled === false]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>Fee Categories</span>
                <button onClick={() => {
                    setDialogEnabled(true)
                }}>Add New</button>
            </div>
            <div
                className={styles.main}
            >
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
                        navigate(`/fee-structure/${params.row.id}/${params.row.name}`);
                    }}
                />
            </div>
            <Dialog open={dialogEnabled} onClose={(()=>{setDialogEnabled(false)})} maxWidth="xl">
                <CreateCategory
                    setDialogEnabled={setDialogEnabled}
                    dialogEnabled={dialogEnabled}
                />
            </Dialog>
        </div>
    )
}

export default FeeCategory