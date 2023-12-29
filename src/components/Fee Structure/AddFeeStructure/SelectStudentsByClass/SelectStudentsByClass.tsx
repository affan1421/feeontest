import React, { useEffect, useState } from 'react'
import styles from './SelectStudentsByClass.module.css'
import { Accordion, AccordionSummary, Typography, AccordionDetails, Checkbox, Dialog } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../../../store/api';
import StudentSelector from '../StudentSelector/StudentSelector';
import { Student as StudentModel } from '../../../../models/Student'

interface Class {
    sectionId: string;
    name: string;
}

interface Student {
    _id: string;
    name: string;
    section: string;
    isPaid: boolean
}

interface Props {
    feeStructure: any,
    setfeeStructure: any,
    isEdit?: any,
    categoryId?: string
}

const SelectStudentsByClass = (props: Props) => {

    const schoolId = localStorage.getItem('school_id') as string
    const [classes, setClasses] = useState<Class[]>([])
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [students, setStudents] = useState<Student[]>([])
    const [studentsbyClass, setStudentsbyClass] = useState<Student[]>([])
    const [studentdialogEnabled, setStudentdialogEnabled] = useState<boolean>(false)

    // API's
    const getClassesAPI = api(state => state.getClasses)
    const getClassesbyCategoryAPI = api(state => state.getClassesbyCategory)
    const getStudentsbySectionAPI = api((state) => state.getStudentsbySection)
    const getStudentsbySectionandCategoryAPI = api((state) => state.getStudentsbySectionandCategory)

    // Get Classes
    const getClasses = () => {
        if (props.isEdit) {
            getClassesAPI(schoolId).then((response: any) => {
                setClasses(response.data.data)
            })
        } else {
            getClassesbyCategoryAPI(schoolId, props.feeStructure.categoryId).then((response: any) => {
                setClasses(response.data.data)
            })
        }
    }

    const getStudentsbySectionandCategory = (sectionId: string, sectionName: string, categoryId: string, updatedClasses: any) => {
        getStudentsbySectionandCategoryAPI(sectionId, categoryId).then((response: any) => {
            if (response) {
                autoAssignStudents(sectionId, response.data.data)
                setSelectedClasses(updatedClasses);
            } else {
                let selectedclasses = updatedClasses
                // ## Need to Uncomment ##
                // let index = selectedclasses.findIndex((e: any) => e == sectionName)
                // if (index !== -1) {
                //     selectedclasses.splice(index, 1)
                // }
                setSelectedClasses(selectedclasses);
            }
        })
    }

    const handleClassChange = async (event: React.ChangeEvent<HTMLInputElement>, item: Class) => {
        const checked = event.target.checked;
        let updatedClasses = [...selectedClasses];
        if (checked) {
            updatedClasses.push(item.name);
            getStudentsbySectionandCategory(
                item.sectionId,
                item.name,
                props.feeStructure.categoryId ?
                    props.feeStructure.categoryId :
                    props.categoryId, updatedClasses)
        } else {
            setStudents([])
            let studentsbyClassNew: any;
            studentsbyClassNew = studentsbyClass.length > 0 ? studentsbyClass : []
            const index = studentsbyClass.findIndex((e: any) => e.sectionId === item.sectionId);

            if (index !== -1) {
                studentsbyClassNew.splice(index, 1)
            }
            let selectedStudents = studentsbyClassNew.flatMap((item: any) => [...item.students])
            props.setfeeStructure((prevState: any) => ({
                ...props.feeStructure,
                classes: prevState.classes,
                studentList: selectedStudents
            }));

            setStudentsbyClass(studentsbyClassNew)
            updatedClasses = updatedClasses.filter((name: string) => name !== item.name);
            setSelectedClasses(updatedClasses);
        }
    }

    const autoAssignStudents = (sectionId: string, studentList: any) => {
        let students = studentList.map((student: Student) => {
            return { ...student, isSelected: true, isNew: true }
        })
        const section = {
            sectionId: sectionId,
            students: students
        }
        let studentsbyClassNew: any;
        studentsbyClassNew = studentsbyClass.length > 0 ? studentsbyClass : []
        const index = studentsbyClass.findIndex((item: any) => item.sectionId === sectionId);

        if (index !== -1) {
            studentsbyClassNew[index] = section
        } else {
            studentsbyClassNew.push(section)
        }
        let selectedStudents = studentsbyClassNew.flatMap((item: any) => [...item.students])
        props.setfeeStructure((prevState: any) => ({
            ...props.feeStructure,
            classes: prevState.classes,
            studentList: selectedStudents
        }));

        setStudentsbyClass(studentsbyClassNew)
    }

    const handleAssignStudents = (sectionId: string) => {
        if (students.length == 0) {
            let section: any = studentsbyClass.filter((item: any) => item.sectionId === sectionId)
            let students = section[0].students
            students = students.map((student: StudentModel) => {
                return { ...student, wasAlreadySelected: student.isSelected }
            })
            setStudents(students)
        }
        setStudentdialogEnabled(true)
    }

    useEffect(() => {
        getClasses()
    }, [])

    useEffect(() => {
        if (props.isEdit) {
            // Here Go's the Logic
            // Lets first get the classes selected
            let selectedclasses = props.feeStructure.classes.map((e: any) => e.name)
            setSelectedClasses(selectedclasses)
            // Let get Classes Classes
            let selectedclassesid = props.feeStructure.classes.map((e: any) => e.sectionId)
            let studentsbyclass: any = []
            selectedclassesid.forEach((id: any) => {
                let section = {
                    sectionId: id,
                    students: []
                }
                section.students = props.feeStructure.studentList.filter((student: any) => {
                    return student.section === id
                })
                studentsbyclass.push(section)
            })
            setStudentsbyClass(studentsbyclass)
        }
    }, [])

    useEffect(() => {
        props.setfeeStructure({
            ...props.feeStructure,
            classes: classes.filter((item: any) => selectedClasses.includes(item.name))
        })
    }, [selectedClasses])

    return (
        <>
            <Accordion style={{ width: '60%', borderRadius: '10px' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Select Classes</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                    {
                        classes.map((item: Class) => {
                            return <div className={styles.class} key={item.sectionId}>
                                <div>
                                    <Checkbox
                                        onChange={(e) => {
                                            handleClassChange(e, item)
                                        }}
                                        checked={selectedClasses.indexOf(item.name) > -1}
                                        value={item.sectionId}
                                    />
                                    <span>{item.name}</span>
                                </div>
                                <button
                                    disabled={!(selectedClasses.indexOf(item.name) > -1)}
                                    className={styles.assign}
                                    onClick={() => {
                                        handleAssignStudents(item.sectionId)
                                    }}
                                > Assign Students </button>
                            </div>
                        })
                    }
                </AccordionDetails>
            </Accordion>
            <Dialog open={studentdialogEnabled} maxWidth='xl'>
                <StudentSelector
                    students={students}
                    setStudentdialogEnabled={setStudentdialogEnabled}
                    setStudents={setStudents}
                    setStudentsbyClass={setStudentsbyClass}
                    studentsbyClass={studentsbyClass}
                    feeStructure={props.feeStructure}
                    setfeeStructure={props.setfeeStructure}
                />
            </Dialog>
        </>
    )
}

export default SelectStudentsByClass