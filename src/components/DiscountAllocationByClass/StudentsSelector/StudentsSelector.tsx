import { useEffect, useState, useMemo } from 'react'
import styles from './StudentsSelector.module.css'
import { Box, Checkbox, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import SearchIcon from "@mui/icons-material/Search";
import user from '@/assests/user.png'
import global from '@/store/global'
import { TablePagination } from '@mui/material';
import { FormValues } from '@/models/Discount';
import api from '@/store/api';
import { Download, Upload } from '@mui/icons-material';
import { DiscountDetails } from '../DiscountAllocationByClass';
import { formatter } from '@/helpers/formatter';

interface Student {
    name: string,
    sectionName: string,
    totalFees: number,
    paidAmount?: number,
    discountAmount: number
    discountApplied: number
    totalDiscountAmount?: number,
    profile_image?: string,
    isSelected?: boolean
    wasAlreadySelected?: boolean
    id: string,
    discountStatus?: string
    file?: string
    fileStatus?: string
    attachments: string[]
    admission_no?: string
}

interface Props {
    students: Student[],
    selectedClass: string,
    totalAmount: number,
    totalDiscountAmount: number
    formValues: FormValues
    setselectedStudents: React.Dispatch<React.SetStateAction<any>>
    setFormValues: React.Dispatch<React.SetStateAction<any>>
    setDiscountDetails: React.Dispatch<React.SetStateAction<any>>
    discountDetails: DiscountDetails
}

interface SelectedStudent {
    studentId: string,
    attachment: string[]
}

const StudentsSelector = (props: Props) => {

    const setErrorAPI = api((state) => state.setError)
    const uploadFileAPI = api((state) => state.uploadFile)


    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>([]);
    const [newselectedStudents, setNewSelectedStudents] = useState<SelectedStudent[]>([]);
    const [searchTerm, setSearchTerm] = useState('')

    const isDiscountClassRowEditState = global((state) => state.isDiscountClassRowEdit)

    let filteredStudents = useMemo(() => {
        if (searchTerm == '') {
            if (students.length > 0) {
                return students.sort((a, b) => a.discountStatus ? -1 : 1)
            } else {
                let studentsData: Student[] = props?.students.map((student: Student) => {
                    return {
                        name: student.name,
                        class: props.selectedClass,
                        sectionName: student.sectionName,
                        totalFees: student.totalFees,
                        paidAmount: student.paidAmount,
                        discountApplied: student.discountApplied,
                        discountAmount: student.discountApplied ? student.discountApplied : 0,
                        totalDiscountAmount: student.totalDiscountAmount,
                        profile_image: '',
                        isSelected: student.isSelected ? true : false,
                        wasAlreadySelected: student.wasAlreadySelected,
                        id: student.id,
                        discountStatus: student.discountStatus,
                        attachments: student.attachments,
                        admission_no: student.admission_no ? student.admission_no : '-'
                    }
                })
                return studentsData.sort((a, b) => a.discountStatus ? -1 : 1)
            }
        }
        return students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [students, searchTerm])


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const totalItems = filteredStudents.length;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStudentChecked = (student: Student, checked: boolean) => {
        if (checked) {
            if (props.discountDetails.totalBudget >= (props.discountDetails.budgetAlloted + props.totalDiscountAmount)) {
                props.setDiscountDetails({
                    ...props.discountDetails,
                    budgetAlloted: props.discountDetails.budgetAlloted + props.totalDiscountAmount,
                    budgetRemaining: props.discountDetails.budgetRemaining - props.totalDiscountAmount
                })
                let tempstudents = [...students];
                let index = tempstudents.findIndex((e) => e.id == student.id);
                tempstudents[index].isSelected = true;
                tempstudents[index].discountAmount = props.totalDiscountAmount;

                setStudents(tempstudents);
                let selectedstudents = [...selectedStudents];
                selectedstudents.push({
                    studentId: student.id,
                    attachment: []
                });
                let newselectedstudents = [...newselectedStudents];
                newselectedstudents.push({
                    studentId: student.id,
                    attachment: []
                });
                setSelectedStudents(selectedstudents);
                setNewSelectedStudents(newselectedstudents);
            } else {
                setErrorAPI(true, 'Budget Exceeds, Please Request Management to Add Budget')
                setTimeout(() => {
                    setErrorAPI(false, '')
                }, 1800)
            }
        } else {
            props.setDiscountDetails({
                ...props.discountDetails,
                budgetAlloted: props.discountDetails.budgetAlloted - props.totalDiscountAmount,
                budgetRemaining: props.discountDetails.budgetRemaining + props.totalDiscountAmount
            })
            let tempstudents = [...students];
            let index = tempstudents.findIndex((e) => e.id == student.id);
            tempstudents[index].isSelected = false;
            tempstudents[index].discountAmount = 0;
            setStudents(tempstudents);
            let selectedstudents = [...selectedStudents];
            selectedstudents = selectedstudents.filter(e => e.studentId !== student.id)
            let newselectedstudents = [...newselectedStudents];
            newselectedstudents = newselectedstudents.filter(e => e.studentId !== student.id)
            setSelectedStudents(selectedstudents);
            setNewSelectedStudents(newselectedstudents);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        let tempstudents = [...students]
        let index = tempstudents.findIndex((e) => e.id == id)
        let formData: FormData = new FormData();
        const file = event.target.files && event.target.files[0];
        if (file) {
            formData.append('file', file);
        }
        uploadFileAPI(formData).then(async (response) => {
            if (response.status === 201) {
                tempstudents[index].file = response.data.message;
                tempstudents[index].fileStatus = 'Uploaded';
                tempstudents[index].attachments = []
                tempstudents[index].attachments.push(await response.data.message)
                setStudents(tempstudents);

                let selectedstudents = [...selectedStudents];
                let i = selectedstudents.findIndex((e) => e.studentId == id);
                selectedstudents[i].attachment.push(response.data.message);
                let newselectedstudents = [...newselectedStudents];
                let newindex = newselectedstudents.findIndex((e) => e.studentId == id);
                newselectedstudents[newindex].attachment.push(response.data.message);
                setSelectedStudents(selectedstudents);
                setNewSelectedStudents(newselectedstudents);
            }
        });
    }

    const handleDocumentDownload = (attachments: string[]) => {
        if (attachments.length > 0) {
            const attachmentUrl = attachments[0];
            const link = document.createElement('a');
            link.href = attachmentUrl;
            link.download = attachmentUrl.substring(attachmentUrl.lastIndexOf('/') + 1);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.click();
        }
    };

    useEffect(() => {
        if (props?.students.length) {
            let studentsData: Student[] = props?.students.map((student: Student) => {
                return {
                    name: student.name,
                    class: props.selectedClass,
                    sectionName: student.sectionName,
                    totalFees: student.totalFees,
                    paidAmount: student.paidAmount,
                    discountApplied: student.discountApplied,
                    discountAmount: student.discountApplied ? student.discountApplied : 0,
                    totalDiscountAmount: student.totalDiscountAmount,
                    profile_image: '',
                    isSelected: student.isSelected ? true : false,
                    wasAlreadySelected: student.wasAlreadySelected,
                    id: student.id,
                    discountStatus: student.discountStatus,
                    attachments: student.attachments,
                    admission_no: student.admission_no ? student.admission_no : '-',
                }
            })
            filteredStudents = studentsData
        }
    }, [])

    useEffect(() => {
        let studentsData: Student[] = props?.students.map((student: Student) => {
            return {
                name: student.name,
                class: props.selectedClass,
                sectionName: student.sectionName,
                totalFees: student.totalFees,
                paidAmount: student.paidAmount,
                discountApplied: student.discountApplied,
                discountAmount: student.discountApplied ? student.discountApplied : 0,
                totalDiscountAmount: student.totalDiscountAmount,
                profile_image: '',
                isSelected: student.isSelected ? true : false,
                wasAlreadySelected: student.wasAlreadySelected,
                id: student.id,
                discountStatus: student.discountStatus,
                attachments: student.attachments,
                admission_no: student.admission_no ? student.admission_no : '-',
            }
        })
        setStudents(studentsData)
        if (isDiscountClassRowEditState) {
            let selectedstudents: any = studentsData.filter(e => e.isSelected).map(e => e.id)
            setSelectedStudents(selectedstudents)
        }
    }, [props.students])

    useEffect(() => {
        let studentsData: Student[] = students.map((student: Student) => {
            return {
                ...student,
                discountAmount: student.totalDiscountAmount ? student.totalDiscountAmount : 0,
            }
        })
        setStudents(studentsData)
    }, [props.totalDiscountAmount])

    useEffect(() => {
        props.setselectedStudents(selectedStudents)
    }, [selectedStudents])

    useEffect(() => {
        props.setselectedStudents(newselectedStudents)
    }, [newselectedStudents])

    return (
        <>
            <div className={styles.main}>
                <Box>
                    <Paper className={styles.search}>
                        <IconButton aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            placeholder="Search student name, Roll number"
                            id="filled-hidden-label-small"
                            defaultValue="Search student name, Roll number"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value) }}
                            className={styles.search_input}
                        />
                    </Paper>
                </Box>
                <Box sx={{ minHeight: 500, width: '100%' }}>
                    <TableContainer style={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.t_head}>Student Name</TableCell>
                                    <TableCell className={styles.t_head}>Class</TableCell>
                                    <TableCell className={styles.t_head}>Admission No</TableCell>
                                    <TableCell className={styles.t_head}>Total Fees</TableCell>
                                    <TableCell className={styles.t_head}>Paid Amount</TableCell>
                                    <TableCell className={styles.t_head}>Discount Amount</TableCell>
                                    <TableCell className={styles.t_head}>Net Discount Fees</TableCell>
                                    <TableCell className={styles.t_head}>Total Discounts</TableCell>
                                    <TableCell className={styles.t_head}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((e) => {
                                        return <TableRow key={e.id}>
                                            <TableCell>
                                                <div className={styles.cell_container}>
                                                    <div>
                                                        <Checkbox
                                                            disabled={e.wasAlreadySelected || props.totalDiscountAmount < 1}
                                                            checked={e.isSelected}
                                                            onChange={(event) => { handleStudentChecked(e, event.target.checked) }}
                                                        />
                                                    </div>
                                                    <div>
                                                        {
                                                            e.profile_image ?
                                                                <img
                                                                    src={e.profile_image}
                                                                    className={styles.cell_image}
                                                                />
                                                                :
                                                                <img
                                                                    className={styles.cell_image}
                                                                    src={user}
                                                                />
                                                        }
                                                    </div>
                                                    <div style={{ marginTop: '5px' }}>
                                                        {e.name}
                                                        {
                                                            e?.discountStatus === 'Pending' ?
                                                                (<div className={`${styles.status} + ${styles.pending}`} >
                                                                    Pending
                                                                </div>)
                                                                : (e.discountStatus === 'Approved' ?
                                                                    <div className={`${styles.status} + ${styles.approved}`} >
                                                                        Approved
                                                                    </div> : '')
                                                        }
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{e.sectionName}</TableCell>
                                            <TableCell>{e.admission_no ? e.admission_no : '-'}</TableCell>
                                            <TableCell>{formatter(e.totalFees)}</TableCell>
                                            <TableCell>{formatter(Number(e.paidAmount))}</TableCell>
                                            <TableCell>{formatter(e.discountAmount)}</TableCell>
                                            <TableCell>{formatter(e.totalFees - e.discountAmount)}</TableCell>
                                            <TableCell>{formatter(Number(e.totalDiscountAmount))}</TableCell>
                                            <TableCell>
                                                {
                                                    e?.attachments && e?.attachments[0] ?
                                                        (
                                                            <IconButton
                                                                sx={{
                                                                    border: '1.5px solid #DBDBDB',
                                                                    borderRadius: '04px'
                                                                }}
                                                                onClick={() => handleDocumentDownload(e.attachments)}>
                                                                <Download />
                                                            </IconButton>
                                                        )
                                                        :
                                                        (
                                                            e.discountStatus !== 'Pending' &&
                                                            <IconButton
                                                                sx={{
                                                                    border: '1.5px solid #DBDBDB',
                                                                    borderRadius: '04px'
                                                                }}
                                                                disabled={!e.isSelected}
                                                                component="label"
                                                                htmlFor={`file-input-${e.id}`}
                                                            >
                                                                <Upload />
                                                                <input
                                                                    id={`file-input-${e.id}`}
                                                                    type="file"
                                                                    // accept=".pdf,.doc,.docx"
                                                                    style={{ display: 'none' }}
                                                                    onChange={(event) => handleFileChange(event, e.id)}
                                                                />
                                                            </IconButton>)
                                                }
                                            </TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalItems}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Box>
            </div >
        </>
    )
}

export default StudentsSelector