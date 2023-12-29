import { useEffect, useState } from 'react'
import styles from './AddDiscount.module.css'
import { Paper, InputBase, TextareaAutosize, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip } from '@mui/material'
import { Discount } from '../../models/Discount'
import { DiscountSchema } from '../../FormSchema/FormValidation'
import api from '../../store/api'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ClassRow } from '../../models/Discount'
import global from '@/store/global'
import VisibilityIcon from '@mui/icons-material/Visibility';

const AddDiscount = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const role = localStorage.getItem('role_name')


    // API Varibles
    const setError = api((state) => state.setError)
    const createDiscountAPI = api((state) => state.createDiscount)
    const updateDiscountCategoryAPI = api((state) => state.updateDiscountCategory)
    const getDiscountClassRowAPI = api((state) => state.getDiscountClassRow)
    const getDiscountCategoryAPI = api(state => state.getDiscountCategoryData)

    // State Variable
    const discountState = global((state) => state.discount)
    const setDiscountState = global((state) => state.setDiscount)
    const isDiscountEditState = global((state) => state.isDiscountEdit)
    const isDiscountEditManagementState = global((state) => state.isDiscountEditManagement)
    const setIsDiscountEditState = global((state) => state.setIsDiscountEdit)
    const setIsDiscountEditManagementState = global((state) => state.setIsDiscountEditManagement)
    const setIsDiscountClassRowEditState = global((state) => state.setIsDiscountClassRowEdit)

    // Data Variables
    const [discount, setDiscount] = useState<Discount>(
        {
            name: '',
            description: '',
            totalBudget: null,
            budgetRemaining: 0,
            createdBy: localStorage.getItem('user_id') as string,
            schoolId: localStorage.getItem('school_id') as string
        }
    )

    const [classRows, setClassRows] = useState<ClassRow[]>([])

    // Change Handlers

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount({
            ...discount,
            name: event.target.value,
        })
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDiscount({
            ...discount,
            description: event.target.value,
        })
    }

    const handleBudgetAllocatedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount({
            ...discount,
            totalBudget: event.target.value ? Number(event.target.value) : null,
            budgetRemaining: isDiscountEditManagementState ? discount.budgetRemaining : Number(event.target.value),
        })
    }

    const handleSubmit = async () => {
        try {
            await DiscountSchema.validate(discount, { abortEarly: false });
            createDiscountAPI(discount).then((response: any) => {
                if (response.status == 201) {
                    setDiscount({
                        name: '',
                        description: '',
                        totalBudget: 0,
                        budgetRemaining: 0,
                    })
                    navigate('/discount')
                }
            })
        } catch (error: any) {
            const errorMessage = error.errors.join('\n');
            setError(true, errorMessage);
            setTimeout(() => {
                setError(false, '');
            }, 2000)
        }
    }

    const handleUpdate = async () => {
        try {
            await DiscountSchema.validate(discount, { abortEarly: false });
            updateDiscountCategoryAPI(id as string, discount).then((response: any) => {
                if (response.status == 200) {
                    setDiscount({
                        name: '',
                        description: '',
                        totalBudget: 0,
                        budgetRemaining: 0,
                    })
                    navigate('/discount')
                    setIsDiscountEditManagementState(false)
                }
            })
        } catch (error: any) {
            const errorMessage = error.errors.join('\n');
            setError(true, errorMessage);
            setTimeout(() => {
                setError(false, '');
            }, 2000)
        }
    }

    const handleAddClassRow = () => {
        setIsDiscountClassRowEditState(false)
        let discountstate: Discount = discountState;
        discountstate.id = discount.id ? discount.id : id
        setDiscountState(discountstate)
        navigate(`/discount-allocation/${false}/${id}/classId/${encodeURIComponent(discount.name)}`)
    }

    const getDiscountClassRow = () => {
        getDiscountClassRowAPI(id as string).then((response: any) => {
            setClassRows(response.data.data);
        })
    }

    const handleClassRowDetail = (classRow: ClassRow) => {
        let discountstate: Discount = discountState;
        discountstate.selectedClass = classRow.sectionId
        discountstate.categoryId = classRow.categoryId
        discountstate.name = discount.name
        discountstate.totalBudget = discount.totalBudget
        discountstate.budgetRemaining = discount.budgetRemaining
        discountstate.feeStructureId = classRow.feeStructureId
        discountstate.id = discount.id ? discount.id : id
        discountstate.totalAmount = classRow.totalFees

        setDiscountState(discountstate)
        setIsDiscountClassRowEditState(true)
        navigate(`/discount-allocation/${true}/${id}/${classRow.sectionId}/${encodeURIComponent(discount.name)}`)
    }

    const getDiscountCategory = () => {
        getDiscountCategoryAPI(id as string).then((response: any) => {
            if (response.status == 200) {
                setDiscount(response.data.data)
                setDiscountState(response.data.data)
            }
        })
    }

    useEffect(() => {
        if (id) {
            getDiscountCategory()
            if (role !== 'management') {
                getDiscountClassRow()
            }
        }
    }, [])


    return (<>
        <div className={styles.add}>
            <div className={styles.add_header}>
                <div className={styles.a_h_left} >
                    <IconButton onClick={() => {
                        navigate('/discount')
                        setIsDiscountEditState(false)
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    &nbsp;&nbsp;
                    All Discounts
                </div>
            </div>
        </div>
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Discount</h1>
                <div className={styles.action}>
                    <button
                        className={styles.cancel}
                        onClick={() => {
                            setIsDiscountEditState(false)
                            setIsDiscountEditManagementState(false)
                            navigate('/discount')
                        }}
                    >
                        Cancel
                    </button>
                    {
                        (role == 'management') &&
                        (
                            isDiscountEditManagementState ?
                                <button className={styles.save} onClick={handleUpdate}>Update</button>
                                : <button className={styles.save} onClick={handleSubmit}>Save</button>
                        )
                    }
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.main_left}>
                    <div className={styles.row}>
                        <div style={{ width: '95%' }}>
                            <label><b>Name</b></label>
                            <Paper

                                className={styles.input} >
                                <InputBase
                                    disabled={role !== 'management'}
                                    placeholder='Name'
                                    id="filled-hidden-label-small"
                                    size="small"
                                    className={styles.input_input}
                                    value={discount.name}
                                    onChange={handleNameChange}
                                    data-testid='add-name'
                                />
                            </Paper>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div style={{ width: '95%' }}>
                            <label><b>Description</b></label>
                            <Paper

                                className={styles.input_desc} >
                                <TextareaAutosize
                                    disabled={role !== 'management'}
                                    data-testid='add-description'
                                    placeholder='Description'
                                    id="filled-hidden-label-small"
                                    className={styles.input_input_desc}
                                    value={discount.description}
                                    onChange={handleDescriptionChange}
                                />
                            </Paper>
                        </div>
                    </div>
                </div>
                <div className={styles.main_right}>
                    <div className={styles.row}>
                        <div style={{ width: '95%' }}>
                            <label><b>Budget Allocated</b></label>
                            <Paper
                                className={styles.input} >
                                <InputBase
                                    type='number'
                                    disabled={role !== 'management'}
                                    placeholder='0'
                                    id="filled-hidden-label-small"
                                    size="small"
                                    className={styles.input_input}
                                    value={discount.totalBudget}
                                    onChange={handleBudgetAllocatedChange}
                                    data-testid='add-name'
                                />
                            </Paper>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div style={{ width: '95%' }}>
                            <label><b>Budget Remaining</b></label>
                            <Paper
                                className={`${styles.input} ${styles.nobackgroundInput}`} >
                                <InputBase
                                    placeholder='Amount is auto Calculated here'
                                    disabled
                                    id="filled-hidden-label-small"
                                    size="small"
                                    className={styles.input_input}
                                    value={discount.budgetRemaining}
                                    data-testid='add-name'
                                />
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
            {/* Assigning Classes & Students  */}
            {
                (role !== 'management') &&
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
                                {
                                    classRows.map((classRow: ClassRow) => {
                                        return <TableRow key={classRow.sectionName}>
                                            <TableCell>{classRow.sectionName}</TableCell>
                                            <TableCell>{classRow.totalAmount}</TableCell>
                                            <TableCell>
                                                <div className={styles.students_associated}>
                                                    {classRow.totalApproved + classRow.totalPending} Students Associated
                                                    <div className={styles.approved}>
                                                        Approved {classRow.totalApproved}
                                                    </div>
                                                    <div className={styles.pending}>
                                                        Pending {classRow.totalPending}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => { handleClassRowDetail(classRow) }}
                                                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    })
                                }

                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell style={{ display: 'flex', justifyContent: 'end' }}>
                                        <button className={styles.faded_btn} onClick={handleAddClassRow}>Add Class</button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            }

        </div>
    </>

    )
}

export default AddDiscount