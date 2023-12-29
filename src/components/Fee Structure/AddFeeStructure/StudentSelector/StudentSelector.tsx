import React, { useEffect, useMemo, useState } from 'react'
import styles from './StudentSelector.module.css'
import { Paper, IconButton, InputBase, Checkbox } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Student } from '../../../../models/Student'
import { FeeStructureModel } from '../../../../models/FeeStructure'
import user from '@/assests/user.png'

interface Props {
    students: Student[];
    studentsbyClass: any[];
    setStudentdialogEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setStudents: React.Dispatch<React.SetStateAction<any>>
    setStudentsbyClass: React.Dispatch<React.SetStateAction<any>>
    feeStructure: FeeStructureModel;
    setfeeStructure: React.Dispatch<React.SetStateAction<FeeStructureModel>>;
}

const StudentSelector: React.FC<Props> = (props) => {
    const [students, setStudents] = useState<Student[]>(
        props?.students?.map((student) => ({ ...student, isSelected: student.isSelected !== undefined ? student.isSelected : false }))
    );

    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        if (!searchTerm) {
            return students;
        }
        return students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [students, searchTerm]);

    const handleSubmit = () => {
        let sectionId = students[0].section

        const section = {
            sectionId: sectionId,
            students: students
        }

        let studentsbyClass;
        studentsbyClass = props.studentsbyClass.length > 0 ? props.studentsbyClass : []

        const index = studentsbyClass.findIndex((item) => item.sectionId === sectionId);

        if (index !== -1) {
            studentsbyClass[index] = section
        } else {
            studentsbyClass.push(section)
        }
        let selectedStudents = studentsbyClass.flatMap((item: any) => [...item.students])

        props.setfeeStructure({
            ...props.feeStructure,
            studentList: selectedStudents
        })
        props.setStudentsbyClass(studentsbyClass);

        // Close Dialog
        props.setStudentdialogEnabled(false)
        props.setStudents([])

    }

    useEffect(() => {
        // students.forEach((student) => {
        //     if (student.isSelected) {
        //         student.wasAlreadySelected = true
        //     }
        // })
    }, [students])

    return (
        <div className={styles.main}>
            <h1>Select Students</h1>
            <Paper className={styles.search}>
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    placeholder="Search Student"
                    id="filled-hidden-label-small"
                    size="small"
                    value={searchTerm}
                    onSubmit={(e) => e.preventDefault()}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                    }}
                    className={styles.search_input}
                />
            </Paper>
            <Paper className={styles.students}>

                {filteredStudents.length > 0 && filteredStudents.map((student) => {
                    return (
                        <div
                            key={student._id}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: '10px',
                                borderBottom: '1px solid #e0e0e0'

                            }}
                        >
                            <Checkbox
                                checked={student.isSelected}
                                disabled={student.isPaid}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    const updatedStudents = students.map((s) => {
                                        if (s._id === student._id) {
                                            if (!checked) {
                                                return {
                                                    ...s,
                                                    isSelected: false,
                                                    isRemoved: true
                                                }
                                            } else {
                                                if (!student.wasAlreadySelected) {
                                                    return {
                                                        ...s,
                                                        isSelected: checked,
                                                        isRemoved: false,
                                                        isNew: true
                                                    }
                                                } else {
                                                    return {
                                                        ...s,
                                                        isSelected: checked,
                                                        isRemoved: false,
                                                        isNew: false
                                                    }
                                                }
                                            }

                                        }
                                        return s;
                                    });
                                    setStudents(updatedStudents);
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {
                                    student.profile_image ?
                                        <img
                                            src={student.profile_image ? student.profile_image : ''}
                                            height={30}
                                            style={{ borderRadius: '50px', marginLeft: '10px' }} />
                                        :
                                        <img
                                            src={user}
                                            height={30}
                                            style={{ borderRadius: '50px', marginLeft: '10px' }}
                                        />
                                }

                                <span
                                    style={{ marginLeft: '15px' }}
                                >{student.name}</span>

                            </div>
                        </div>
                    );
                })}
            </Paper >
            <div
                style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0px' }}
            >
                <button
                    className={styles.faded_btn}
                    onClick={() => {
                        props.setStudents([])
                        props.setStudentdialogEnabled(false);
                    }}
                >
                    Cancel
                </button>
                <button onClick={handleSubmit}>Save</button>
            </div>
        </div >
    );
};

export default StudentSelector;
