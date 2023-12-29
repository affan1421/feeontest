import { ClassRow } from '@/models/Discount'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material'
import styles from './ClassesList.module.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react'
import api from '@/store/api';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';

interface Props {
    discountId: string
    setSelectedClass: React.Dispatch<React.SetStateAction<string>>
    setValue: React.Dispatch<React.SetStateAction<string>>
}

interface ClassDetails {
    id: string;
    name: string;
    totalAmount: number;
    totalStudents: number;
    pendingStudents: number;
    approvedStudents: number;
}

const ClassesList = (props: Props) => {
    const navigate = useNavigate();

    // API's 
    const getClassesByDiscountIdAPI = api(state => state.getClassesByDiscountId)

    // Data
    const [classRows, setClassRows] = useState<ClassDetails[]>([])
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedClassRows = classRows.slice(startIndex, endIndex);



    const getClassesByDiscountId = () => {
        getClassesByDiscountIdAPI(props.discountId as string).then((response) => {
            if (response.status == 200) {
                console.log(response.data.data)
                setClassRows(response.data.data)
            }
        })
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };


    useEffect(() => {
        getClassesByDiscountId()
    }, [])

    return (
        <>
            <div className={styles.table}>
                <TableContainer component={Paper} style={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Class</b></TableCell>
                                <TableCell><b>Amount associated</b></TableCell>
                                <TableCell><b>Students associated</b></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {paginatedClassRows.map((classRow: ClassDetails) => {
                                return (<> */}
                            {
                                paginatedClassRows.map((classRow: ClassDetails) => {
                                    return <TableRow key={classRow.id}>
                                        <TableCell>{classRow.name}</TableCell>
                                        <TableCell>₹{classRow.totalAmount}</TableCell>
                                        <TableCell>
                                            <div className={styles.students_associated}>
                                                {classRow.totalStudents} Students Associated
                                                <div className={styles.approved}>
                                                    Approved {classRow.approvedStudents}
                                                </div>
                                                <div className={styles.pending}>
                                                    Pending {classRow.pendingStudents}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => {
                                                    props.setSelectedClass(classRow.id)
                                                    props.setValue('2')
                                                }}
                                                sx={{
                                                    border: '1.5px solid #DBDBDB',
                                                    borderRadius: '04px',
                                                    marginRight: '10px'
                                                }}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    navigate(`/class-discount/${classRow.id}/${classRow.name}/${props.discountId}`)
                                                }}
                                                sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                                                <Add />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                })
                            }

                            {/* <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow> */}
                        </TableBody>
                    </Table>
                    <div className={styles.pagination}>
                        <IconButton
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                        <IconButton
                            disabled={endIndex >= classRows.length}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                </TableContainer>
            </div>
        </>
    )
}

export default ClassesList