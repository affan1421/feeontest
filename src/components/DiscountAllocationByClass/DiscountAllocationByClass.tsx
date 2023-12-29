import React, { useEffect, useState } from 'react'
import styles from './DiscountAllocationByClass.module.css'
import { Paper, InputBase, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { FormValues, FeeDetail } from '@/models/Discount'
import api from '@/store/api'
import StudentsSelector from './StudentsSelector/StudentsSelector'
import { APIData, RowData, Discount, SelectedStudent } from '@/models/Discount'
import { DiscountAllocationSchema } from '@/FormSchema/FormValidation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface DiscountAllocationByClassProps {

}

interface Student {
    name: string,
    sectionName: string,
    totalFees: number,
    discountAmount: number
    discountApplied: number,
    previousDiscounts?: [],
    profile_image?: string,
    isSelected?: boolean
    wasAlreadySelected?: boolean
    id: string
    studentId: string
    studentName?: string,
    attachments: string[]
}

export interface DiscountDetails {
    totalBudget: number,
    budgetAlloted: number,
    budgetRemaining: number
}

export interface Class {
    sectionId: string;
    name: string;
}

interface FeeCategory {
    _id: string;
    categoryName: string;
}

interface FeeStructure {
    _id: string;
    feeStructureName: string;
}

const DiscountAllocationByClass = (props: DiscountAllocationByClassProps) => {
    const {
        isEdit,
        id,
        classId,
        discountName
    } = useParams();

    // API'S
    const fetchFeeCategoriesbySectionAPI = api(state => state.fetchFeeCategoriesbySection)
    const getClassesbyDiscountAPI = api(state => state.getClassesbyDiscount)
    const getClassesAPI = api(state => state.getClasses)
    const assignDiscountAPI = api(state => state.assignDiscount)
    const updateStudentsinAssignDiscountAPI = api(state => state.updateStudentsinAssignDiscount)
    const setError = api((state) => state.setError)
    const fetchStudentsbyDiscountandStructureAPI = api((state) => state.fetchStudentsbyDiscountandStructure)
    const getFeeDetailsbyClassRowDiscountandStructureAPI = api((state) => state.getFeeDetailsbyClassRowDiscountandStructure)
    const fetchFeeStructuresbySectionandCategoryAPI = api((state) => state.fetchFeeStructuresbySectionandCategory)
    const getStudentsandFeeDetailsAPI = api((state) => state.getStudentsandFeeDetails)
    const getDiscountCategoryDataAPI = api((state) => state.getDiscountCategoryData)

    const [discountDetails, setDiscountDetails] = useState<DiscountDetails>({
        totalBudget: 0,
        budgetAlloted: 0,
        budgetRemaining: 0
    })
    const schoolId = localStorage.getItem('school_id') as string
    const navigate = useNavigate()
    const [formValues, setFormValues] = useState<FormValues>({
        selectedClass: 'default',
        categoryId: 'default',
        feeStructureId: 'default',
        discountCategoryId: 'default'
    })

    const [feeDetails, setFeeDetails] = useState<FeeDetail[]>([])
    const [classes, setClasses] = useState<Class[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [selectedstudents, setselectedStudents] = useState<SelectedStudent[]>([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([])
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
    const [totalDiscountAmount, setTotalDiscountAmount] = useState(0)



    const handleClassChange = (event: SelectChangeEvent) => {
        setFeeDetails([])
        setFormValues({
            ...formValues,
            feeStructureId: 'default',
            categoryId: 'default',
            selectedClass: event.target.value as string
        })
        setStudents([])
        setselectedStudents([])
        fetchFeeCategoriesbySection(event.target.value as string)
    }

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setFormValues({
            ...formValues,
            categoryId: event.target.value as string
        })
        fetchFeeStructuresbySectionandCategory(formValues.selectedClass, event.target.value as string, id as string, isEdit ? false : true)
    }

    const handleFeeStructureChange = (event: SelectChangeEvent) => {
        setFormValues({
            ...formValues,
            feeStructureId: event.target.value as string
        })
        if (classId && classId !== 'classId') {
            getFeeDetailsbyClassRowDiscountandStructure(event.target.value as string)
            fetchStudentsbyDiscountandStructure(event.target.value as string)
        } else {
            getStudentsandFeeDetails(event.target.value as string)
        }
    }

    const handleAmountTypeChange = (event: SelectChangeEvent, index: number) => {
        const newFeeDetails = [...feeDetails];
        newFeeDetails[index].amountType = event.target.value as string;
        newFeeDetails[index].discountAmount = 0;
        newFeeDetails[index].enteredAmount = null;
        setFeeDetails(newFeeDetails);
    }

    const handleEnteredAmountChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        // UnSelect Selected Students
        const newStudents = [...students];
        newStudents.forEach((student) => {
            student.isSelected = false
        })
        setStudents(newStudents)

        // Set Discount Allotted Amount to Default
        setDiscountDetails({
            ...discountDetails,
            budgetAlloted: Number(discountDetails.budgetAlloted)
        })


        const newFeeDetails = [...feeDetails];
        newFeeDetails[index].enteredAmount = event.target.value ? Number(event.target.value) : null;
        if (newFeeDetails[index].amountType == 'Percentage') {
            if (Number(event.target.value) > 100) {
                newFeeDetails[index].enteredAmount = 100
                const errorMessage = 'Value Must be less than equal to 100';
                setError(true, errorMessage);
                setTimeout(() => {
                    setError(false, '');
                }, 2000)
            } else {
                newFeeDetails[index].discountAmount = newFeeDetails[index].amount * Number(event.target.value) / 100;
            }
        } else {
            if (Number(newFeeDetails[index].enteredAmount) > Number(newFeeDetails[index].amount)) {
                newFeeDetails[index].enteredAmount = newFeeDetails[index].amount
                const errorMessage = `Value Must be less than ${newFeeDetails[index].amount} or equal to ${newFeeDetails[index].amount} `;
                setError(true, errorMessage);
                setTimeout(() => {
                    setError(false, '');
                }, 2000)
            } else {
                newFeeDetails[index].discountAmount = Number(event.target.value);
            }
        }
        setFeeDetails(newFeeDetails);
    }

    const handleSubmit = async () => {
        // handle form submission
        let rows = feeDetails
        const transformObject = (originalObject: any) => {
            const newArray = {
                rowId: originalObject.rowId,
                breakdown: originalObject.breakDown,
                isPercentage: (originalObject.amountType === "Percentage"),
                value: originalObject.enteredAmount,
                feeTypeId: originalObject.feeTypeId
            };
            return newArray;
        };

        const newRows: RowData[] = rows.map(transformObject);

        let data: APIData = {
            sectionId: formValues.selectedClass,
            sectionName: classes.filter(e => e.sectionId == formValues.selectedClass)[0].name,
            categoryId: formValues.categoryId,
            rows: newRows.filter(e => e.value),
            studentList: selectedstudents,
            feeStructureId: formValues.feeStructureId,
        }
        try {
            await DiscountAllocationSchema.validate(data, { abortEarly: false });
            assignDiscountAPI(id as string, data).then((response: any) => {
                if (response.status == 200) {
                    navigate(`/add-discount/${id}`)
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

    const getDiscountCategoryData = () => {
        getDiscountCategoryDataAPI(id as string).then((response: any) => {
            let data = response.data.data
            return setDiscountDetails({
                totalBudget: data.totalBudget,
                budgetRemaining: data.budgetRemaining,
                budgetAlloted: data.budgetAlloted,
            })
        })
    }

    const handleUpdate = async () => {
        // handle form submission
        let rows = feeDetails
        const transformObject = (originalObject: any) => {
            const newArray = {
                rowId: originalObject.rowId,
                breakdown: originalObject.breakDown,
                isPercentage: (originalObject.amountType === "Percentage"),
                value: originalObject.enteredAmount,
                feeTypeId: originalObject.feeTypeId
            };
            return newArray;
        };

        const newRows: RowData[] = rows.map(transformObject);

        let data: APIData = {
            sectionId: formValues.selectedClass,
            sectionName: classes.filter(e => e.sectionId == formValues.selectedClass)[0].name,
            categoryId: formValues.categoryId,
            rows: newRows.filter(e => e.value),
            studentList: removeAlreadySelectedStudents(students, selectedstudents),
            feeStructureId: formValues.feeStructureId,
        }

        try {
            await DiscountAllocationSchema.validate(data, { abortEarly: false });
            updateStudentsinAssignDiscountAPI(id as string, data).then((response: any) => {
                if (response.status == 200) {
                    navigate(`/add-discount/${id}`)
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

    const removeAlreadySelectedStudents = (students: Student[], selectedstudents: SelectedStudent[]) => {
        let wasAlreadySelected = students.map((student) => {
            if (student.wasAlreadySelected) {
                return student.id
            }
        }).filter((e) => e != undefined)
        let newSelectedStudents = selectedstudents.filter((student) => {
            if (wasAlreadySelected.includes(student.studentId)) {
                return false
            } else {
                return true
            }
        })
        return newSelectedStudents
    }

    // Methods
    const fetchFeeCategoriesbySection = (section_id: string) => {
        fetchFeeCategoriesbySectionAPI(section_id).then(async (response: any) => {
            if (response && response?.status == 200) {
                setFeeCategories(response.data.data)
                if ((classId && classId !== 'classId')) {
                    setFormValues({
                        ...formValues,
                        selectedClass: section_id,
                        categoryId: await response.data.data[0]._id
                    })
                    fetchFeeStructuresbySectionandCategory(section_id, response.data.data[0]._id, id as string, isEdit ? true : false)
                }
            } else {
                setFeeCategories([])
            }
        })
    }

    const fetchFeeStructuresbySectionandCategory = (section_id: string, category_id: string, discountId: string, isMapped: boolean) => {
        fetchFeeStructuresbySectionandCategoryAPI(section_id, category_id, discountId).then((response: any) => {
            if (response) {
                setFeeStructures(response.data.data)
                if (classId && classId !== 'classId') {
                    setFormValues({
                        ...formValues,
                        selectedClass: section_id,
                        categoryId: category_id,
                        feeStructureId: response.data.data[0]._id
                    })
                    getFeeDetailsbyClassRowDiscountandStructure(response.data.data[0]._id)
                    fetchStudentsbyDiscountandStructure(response.data.data[0]._id)
                }
            } else {
                setFeeStructures([])
            }
        })
    }

    const getStudentsandFeeDetails = (feeStructureId: string) => {
        getStudentsandFeeDetailsAPI(feeStructureId, formValues.selectedClass !== 'default' ? formValues.selectedClass : classId as string).then((response: any) => {
            if (response) {
                if (response && response?.status == 200) {
                    let feeDetails = response.data.data.feeDetails
                    feeDetails.forEach((item: any) => {
                        item.amountType = 'default'
                    })
                    let studentsData = response.data.data.studentList
                    studentsData = studentsData.map((e: { studentName: string, studentId: string }) => {
                        return {
                            ...e,
                            id: e.studentId,
                            name: e.studentName
                        }
                    })
                    setTotalAmount(response.data.data.totalAmount)
                    setStudents(studentsData)
                    setFeeDetails(feeDetails);
                } else {
                }
            }
        })
    }

    // Get Classes
    const getClassesbyDiscount = () => {
        getClassesbyDiscountAPI(schoolId, id as string).then((response: any) => {
            setClasses(response.data.data)
        })
    }

    const getClasses = () => {
        getClassesAPI(schoolId).then((response: any) => {
            setClasses(response.data.data)
        })
    }

    const fetchStudentsbyDiscountandStructure = (feeStructureId: string) => {
        fetchStudentsbyDiscountandStructureAPI(id as string, feeStructureId ? feeStructureId : formValues.feeStructureId, formValues.selectedClass !== 'default' ? formValues.selectedClass : classId as string).then((response: any) => {
            let selectedstudents: Student[] = response.data.data
            selectedstudents = selectedstudents.map(e => {
                return { ...e, id: e.studentId, name: e.studentName as string, wasAlreadySelected: e.isSelected ? true : false }
            })
            setStudents(selectedstudents);
        })
    }

    const getFeeDetailsbyClassRowDiscountandStructure = (feeStructureId: string) => {
        getFeeDetailsbyClassRowDiscountandStructureAPI(
            id as string,
            feeStructureId ? feeStructureId : formValues.feeStructureId,
            classId !== 'classId' ? classId as string : formValues.selectedClass
        ).then((response: any) => {
            if (response && response?.status == 200) {
                let feedetails = response.data.data.feeDetails.map((e: RowData) => {
                    return {
                        feeTypeName: e.feeType?.feeType as string,
                        feeTypeId: e.feeType?._id as string,
                        amount: e.totalAmount,
                        amountType: e.isPercentage ? 'Percentage' : 'Amount',
                        discountAmount: e.isPercentage ? (e.value * Number(e.totalAmount) / 100) : e.value,
                        breakDown: e.breakdown,
                        enteredAmount: e.value,
                    }
                })
                setFeeDetails(feedetails)
                let discountDetails = response.data.data.discountDetails
                setDiscountDetails(discountDetails)
                console.log(discountDetails)
            }
        })
    }

    useEffect(() => {

        // if ((classId && classId !== 'classId')) {
        //     getClasses()
        //     fetchFeeCategoriesbySection(classId as string)
        //     setFormValues({
        //         selectedClass: classId as string,
        //         categoryId: 'default',
        //         feeStructureId: 'default',
        //     })
        // } else {
        //     getDiscountCategoryData()
        //     setFormValues({
        //         selectedClass: 'default',
        //         categoryId: 'default',
        //         feeStructureId: 'default',
        //     })
        //     getClasses()
        // }
    }, [])

    useEffect(() => {
        let totaldiscountamount = 0
        feeDetails.forEach((feeDetail: FeeDetail) => {
            totaldiscountamount += feeDetail.discountAmount ? Number(feeDetail.discountAmount) : 0
        })
        setTotalDiscountAmount(totaldiscountamount)
    }, [feeDetails])

    return (
        <>
            <div className={styles.navigation_header}>
                <div>
                    <IconButton onClick={() => {
                        navigate(`/add-discount/${id}`)
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    &nbsp;&nbsp;
                    Back
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.h_left}>
                        <h1>Add Students to ({discountName})</h1>
                    </div>
                    <div className={styles.h_right}>
                        <button
                            className={styles.cancel}
                            onClick={() => {
                                navigate(`/add-discount/${id}`)
                            }} >Cancel</button>
                        {
                            classId && classId !== 'classId' ?
                                <button onClick={handleUpdate}>Update</button> :
                                <button onClick={handleSubmit}>Add</button>
                        }
                    </div>
                </div>
                <div className={styles.row}>
                    <div style={{ flexBasis: '20%', marginRight: '0px', marginBottom: '10px' }}>
                        <Select
                            disabled={
                                (classId && classId !== 'classId')
                                    ? true : false
                            }
                            value={formValues.selectedClass}
                            onChange={handleClassChange}
                            className={styles.selector}
                        >
                            <MenuItem value='default'>Select Class</MenuItem>
                            {
                                classes.map((item: Class) => {
                                    return <MenuItem value={item.sectionId} key={item.sectionId}>{item.name}</MenuItem>
                                })
                            }
                        </Select>
                    </div>
                    <div style={{ flexBasis: '20%', marginRight: '0px', marginBottom: '10px' }}>
                        <Select
                            disabled={feeCategories.length == 0}
                            value={formValues.categoryId}
                            onChange={handleCategoryChange}
                            className={styles.selector}
                        >
                            <MenuItem value='default'>Select Fee Category</MenuItem>
                            {
                                feeCategories.map((feeCategory: FeeCategory) => {
                                    return <MenuItem value={feeCategory._id} key={feeCategory._id}>{feeCategory.categoryName}</MenuItem>
                                })
                            }
                        </Select>
                    </div>
                    <div style={{ flexBasis: '20%', marginRight: '0px', marginBottom: '10px' }}>
                        <Select
                            disabled={feeCategories.length == 0}
                            value={formValues.feeStructureId}
                            onChange={handleFeeStructureChange}
                            className={styles.selector}
                        >
                            <MenuItem value='default'>Select Fee Structure</MenuItem>
                            {
                                feeStructures.map((feeStructure: FeeStructure) => {
                                    return <MenuItem value={feeStructure._id} key={feeStructure._id}>{feeStructure.feeStructureName}</MenuItem>
                                })
                            }
                        </Select>
                    </div>
                    <div style={{ flexBasis: '17%', marginRight: '0px', marginBottom: '10px' }}>
                        <span className={styles.label}>Budget Allocated</span>
                        <br />
                        <Paper className={styles.input}>
                            <InputBase
                                placeholder='Budget Allocated'
                                id="filled-hidden-label-small"
                                size="small"
                                className={styles.input_input}
                                value={discountDetails.totalBudget}
                                disabled
                            />
                        </Paper>
                    </div>
                    <div style={{ flexBasis: '17%', marginBottom: '10px' }}>
                        <span className={styles.label}>Budget Alloted</span>
                        <br />
                        <Paper
                            className={styles.input} >
                            <InputBase
                                placeholder='Budget Alloted'
                                id="filled-hidden-label-small"
                                size="small"
                                className={styles.input_input}
                                value={discountDetails.budgetAlloted}
                                disabled
                            />
                        </Paper>
                    </div>
                </div>
                {
                    feeDetails.length > 0 &&
                    <div className={styles.table}>
                        <TableContainer>
                            <Table aria-label="Fee table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>SL</b></TableCell>
                                        <TableCell sx={{ width: '150px' }} ><b>Fee Type</b> </TableCell>
                                        <TableCell sx={{ width: '150px' }} ><b>Amount</b></TableCell>
                                        <TableCell sx={{ width: '150px' }} ><b>Total</b></TableCell>
                                        <TableCell><b>Amount Type</b> </TableCell>
                                        <TableCell><b>Enter Value</b> </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {feeDetails.length > 0 && feeDetails.map((row, index) => (
                                        <TableRow key={row.feeTypeName + index + 1}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.feeTypeName}</TableCell>
                                            <TableCell>{`${Number(Number(row.amount) / Number(row.breakDown)).toFixed(2)} (x${row.breakDown})`}</TableCell>
                                            <TableCell>{Number(row.amount).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Select
                                                    disabled={classId && classId !== 'classId' ? true : false}
                                                    onChange={(e) => {
                                                        handleAmountTypeChange(e, index)
                                                    }}
                                                    defaultValue={row.amountType}
                                                    className={styles.selector}
                                                >
                                                    <MenuItem value="default">Select Amount Type</MenuItem>
                                                    <MenuItem value="Percentage">Percentage</MenuItem>
                                                    <MenuItem value="Amount">Amount</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    disabled={classId && classId !== 'classId' ? true : false || row.amountType === 'default'}
                                                    placeholder='Enter Amount'
                                                    type='number'
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        handleEnteredAmountChange(event, index)
                                                    }}
                                                    value={row.enteredAmount} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
                <StudentsSelector
                    students={students}
                    selectedClass={
                        classes.find(c => c.sectionId === formValues.selectedClass)?.name as string
                    }
                    totalAmount={
                        totalAmount ?
                            totalAmount :
                            Number(discountDetails.totalBudget)
                    }
                    totalDiscountAmount={totalDiscountAmount}
                    setselectedStudents={setselectedStudents}
                    formValues={formValues}
                    discountDetails={discountDetails}
                    setFormValues={setFormValues}
                    setDiscountDetails={setDiscountDetails}
                />
            </div>
        </>
    )
}

export default DiscountAllocationByClass