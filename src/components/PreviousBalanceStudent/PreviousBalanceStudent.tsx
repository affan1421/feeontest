import React, { useEffect, useState } from 'react'
import styles from './PreviousBalanceStudent.module.css'
import { Dialog, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import api from '@/store/api';
import { Class } from '@/models/Class'
import { Selector } from "@/Elements/Selector/Selector"
import Input from "@/Elements/Input/Input"
import { ExistingStudent, LeftStudent } from '@/models/PreviousBalance'

interface Student {
    _id?: string;
    name: string;
    section?: string;
    value?: string;
}
interface AcademicYear {
    name: string
    _id: string
}

const PreviousBalanceStudent = (props: any) => {
    let schoolId = localStorage.getItem('school_id') as string

    const getClassesAPI = api((state) => state.getClasses)
    const getBySectionIdAPI = api((state) => state.getBySectionId)
    const getYearAcademicInfoAPI = api((state) => state.getAcademicYear)
    const createPreviousBalanceAPI = api((state) => state.createPreviousBalance)

    const [studentType, setStudentType] = useState('default');
    const [academicYear, setAcademicYear] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<Class[]>([])
    const [students, setStudents] = useState({
        studentId: 'default',
        classId: 'default',
    })
    const [studentsbyClass, setStudentsbyClass] = useState<Student[]>([
        { name: 'Select Student', _id: 'default' }
    ])

    const [existingStudent, setExistingStudent] = useState<ExistingStudent>({
        studentId: 'default',
        schoolId: schoolId,
        sectionId: 'default',
        academicYearId: 'default',
        pendingAmount: 0,

    })

    const [leftStudent, setLeftStudent] = useState<LeftStudent>({
        dueDate: '',
        studentName: '',
        parentName: '',
        username: 0,
        gender: 'default',
        schoolId: schoolId,
        sectionId: 'default',
        academicYearId: 'default',
        pendingAmount: 0
    })

    const handleStudentSelection = (event: string) => {
        setExistingStudent({
            ...existingStudent,
            studentId: event,
        })
    }

    const handleClassChange = (event: string) => {
        setExistingStudent({
            ...existingStudent,
            sectionId: event,
        })
        getStudents(event)
    }

    const getClasses = () => {
        getClassesAPI(schoolId).then(async (response: any) => {
            if (response.status === 200) {
                let classes: Class[] = await response.data.data
                classes.unshift({ name: 'Select Class', sectionId: 'default' })
                setClasses(classes)
            }
        })
    }
    const getStudents = (classId: string) => {
        getBySectionIdAPI(classId).then(async (response: any) => {
            if (response.status === 200) {
                let students: Student[] = await response.data.data
                students.unshift({ name: 'Select Student', _id: 'default' })
                setStudents(prevState => ({ ...prevState, studentId: 'default' }))
                setStudentsbyClass(students)
            }
        })
    }
    const handleStudentType = (event: SelectChangeEvent) => {
        setStudentType(event.target.value)
    }

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExistingStudent({
            ...existingStudent,
            pendingAmount: Number(event.target.value)
        })
    }
    const handleExistingAcademicYearChange = (event: string) => {
        setExistingStudent({
            ...existingStudent,
            academicYearId: event,
        })

    }
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLeftStudent({
            ...leftStudent,
            studentName: event.target.value,
        })
    }
    const handleParentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLeftStudent({
            ...leftStudent,
            parentName: event.target.value,
        })
    }
    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLeftStudent({
            ...leftStudent,
            username: Number(event.target.value),
        })
    }
    const handleGenderChange = (event: string) => {
        setLeftStudent({
            ...leftStudent,
            gender: event
        })
    }

    const handleLeftAcademicYearChange = (event: string) => {
        setLeftStudent({
            ...leftStudent,
            academicYearId: event,
        })
    }

    const handleDateChange = (event: any) => {
        let selectedDate = new Date(`${event.$M + 1}/${event.$D}/${event.$y}`).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: "numeric" }).split('/').join('-').replace(/\b\d\b/g, '0$&')
        setLeftStudent({
            ...leftStudent,
            dueDate: selectedDate
        })
    }

    const handleLeftClassChange = (event: string) => {
        setLeftStudent({
            ...leftStudent,
            sectionId: event,
        })
        getStudents(event)
    }

    const handleLeftAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLeftStudent({
            ...leftStudent,
            pendingAmount: Number(event.target.value),
        })
    }

    const getYearAcademicInfo = () => {
        getYearAcademicInfoAPI().then(async (response: any) => {
            console.log(response)
            if (response.status === 200) {
                let AcademicTypes = await response.data.data
                AcademicTypes.unshift({ name: "Academic Year", _id: "default" })
                setAcademicYear(AcademicTypes)
            }
        })
    }

    const handleSubmit = () => {
        if (studentType === 'EXISTING') {
            console.log(existingStudent)
            createPreviousBalanceAPI(existingStudent).then((response: any) => {
                if (response.status === 201) {
                    setExistingStudent({
                        ...existingStudent,
                        academicYearId: 'default',
                        pendingAmount: '',
                        sectionId: 'default',
                        studentId: 'default'
                    })
                    props.setDialogEnabled(false)

                }
            })
        }
        if (studentType === 'LEFT') {
            console.log(leftStudent)
            createPreviousBalanceAPI(leftStudent).then((response: any) => {
                if (response.status === 201) {
                    setLeftStudent({
                        ...leftStudent,
                        academicYearId: 'default',
                        dueDate: '',
                        gender: 'default',
                        parentName: '',
                        pendingAmount: '',
                        studentName: '',
                        username: '',
                        sectionId: 'default'
                    })
                    props.setDialogEnabled(false)
                }
            })

        }
    }

    useEffect(() => {
        getClasses()
        getYearAcademicInfo()
    }, [])



    return (
        <>
            <Dialog open={props.dialogEnabled}onClose={(()=>{props.setDialogEnabled(false)})} maxWidth="xl">
                <div className={styles.dialog}>
                    <div className={styles.dialog_header}>
                        <h1>Add Students to Pending Balance</h1>
                    </div>
                    <div className={styles.dialog_container}>
                        <Select
                            className={styles.selector}
                            onChange={handleStudentType}
                            value={studentType}>
                            <MenuItem value="default" disabled> Select Student Type</MenuItem>
                            <MenuItem value="EXISTING">Existing Student</MenuItem>
                            <MenuItem value="LEFT">Left Student</MenuItem>
                        </Select>
                        {studentType === 'LEFT' ? (
                            <>
                                {/* <div className={styles.input_date}>
                                    <LocalizationProvider
                                        className={styles.input_date}
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DatePicker
                                            label="Due Date"
                                            className={styles.datepicker}
                                            slotProps={{
                                                textField: {
                                                    variant: 'outlined',
                                                    InputProps: {
                                                        sx: {
                                                            height: '53px',
                                                        },
                                                    },
                                                }
                                            }}
                                            onChange={handleDateChange}
                                        />
                                    </LocalizationProvider>
                                </div> */}
                            </>
                        ) : null}
                    </div>
                    {studentType === 'EXISTING' ? (<>
                        <div className={styles.dialog_container}>
                            <div className={styles.select}>
                                <Selector
                                    value={existingStudent.sectionId}
                                    items={classes.map((e) => {
                                        return {
                                            name: e.name,
                                            value: e.sectionId
                                        }
                                    })}
                                    onChange={handleClassChange}
                                ></Selector>
                            </div>
                            <div className={styles.select}>
                                <Selector
                                    disabled={studentsbyClass.length === 1}
                                    value={existingStudent.studentId}
                                    items={studentsbyClass.map((e) => {
                                        return {
                                            name: e.name,
                                            value: e._id,
                                        }
                                    })}
                                    onChange={handleStudentSelection}
                                ></Selector>
                            </div>
                            <div className={styles.select}>
                                <Selector
                                    value={existingStudent.academicYearId}
                                    items={academicYear.map((e: AcademicYear) => {
                                        return {
                                            name: e.name,
                                            value: e._id,
                                        }
                                    })}
                                    onChange={handleExistingAcademicYearChange}
                                ></Selector>

                            </div>
                        </div>
                        <div className={styles.dialog_container}>
                            <Input
                                type="number"
                                width='100%'
                                placeholder="Amount"
                                onChange={handleAmountChange}
                                value={existingStudent.pendingAmount !== 0 ? existingStudent.pendingAmount : null}
                            />
                        </div>
                    </>) : null}
                    {studentType === 'LEFT' ? (
                        <>
                            <div className={styles.dialog_container}>
                                <div className={styles.select}>
                                    <Selector
                                        value={leftStudent.sectionId}
                                        items={classes.map((e) => {
                                            return {
                                                name: e.name,
                                                value: e.sectionId
                                            }
                                        })}
                                        onChange={handleLeftClassChange}
                                    ></Selector>
                                </div>
                                <div className={styles.select}>
                                    <Selector
                                        value={leftStudent.academicYearId}
                                        items={academicYear.map((e: AcademicYear) => {
                                            return {
                                                name: e.name,
                                                value: e._id,
                                            }
                                        })}
                                        onChange={handleLeftAcademicYearChange}
                                    ></Selector>
                                </div>
                                <div className={styles.select}>
                                    <Selector
                                        defaultValue="Select Gender"
                                        value={leftStudent.gender}
                                        items={[
                                            { name: 'Male', value: 'Male' },
                                            { name: 'Female', value: 'Female' }
                                        ]}
                                        onChange={handleGenderChange}
                                    ></Selector>
                                </div>
                            </div>
                            <div className={styles.dialog_container}>
                                <div className={styles.left_input}>
                                    <Input
                                        width='100%'
                                        placeholder="Student name"
                                        value={leftStudent.studentName}
                                        onChange={handleNameChange}
                                    />
                                </div>
                                <div className={styles.left_input}>
                                    <Input
                                        width='100%'
                                        placeholder="Parent Name"
                                        value={leftStudent.parentName}
                                        onChange={handleParentNameChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.dialog_container}>
                                <div className={styles.left_input}>
                                    <Input
                                        width='100%'
                                        placeholder="Phone Number"
                                        value={leftStudent.username !== 0 ? leftStudent.username : null}
                                        onChange={handlePhoneNumberChange}
                                    />
                                </div>
                                <div className={styles.left_input}>
                                    <Input
                                        type="number"
                                        width='100%'
                                        placeholder="Amount"
                                        onChange={handleLeftAmountChange}
                                        value={leftStudent.pendingAmount !== 0 ? leftStudent.pendingAmount : null}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}
                    <div className={styles.button}>
                        <div>
                            <button className={styles.cancel} onClick={() => {
                                props.setDialogEnabled(false)
                            }}>Cancel</button>
                        </div>
                        <div>
                            <button className={styles.save} onClick={handleSubmit}>Save</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default PreviousBalanceStudent