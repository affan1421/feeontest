import { useEffect, useState } from 'react';
import styles from './DownloadExcel.module.css';
import { Checkbox, Chip, FormControl, FormControlLabel, FormLabel, ListItemText, Menu, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import api from '@/store/api';
import { read, writeFile } from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface Props {
    setDownloadExcelDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Student {
    _id: string;
    name: string;
}

interface FormValues {
    type: string;
    academic_year: string;
    class: string;
    students: string[];
}

interface AcademicYear {
    _id: string;
    name: string;
}

interface Class {
    sectionId: string;
    name: string;
}

const DownloadExcel = (props: Props) => {
    const school_id = localStorage.getItem('school_id') as string

    // API States
    const getAcademicYearAPI = api(state => state.getAcademicYear);
    const getClassesAPI = api(state => state.getClasses);
    const getStudentsBySectionandAcademicYearAPI = api(state => state.getStudentsBySectionandAcademicYear);
    const downloadExcelExistingStudentsAPI = api(state => state.downloadExcelExistingStudents);

    const [formValues, setFormValues] = useState<FormValues>({
        type: 'default',
        academic_year: 'default',
        class: 'default',
        students: [],
    });

    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<Class[]>([]); // [
    const [students, setStudents] = useState<Student[]>([]);

    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    const handleTypeChange = (e: SelectChangeEvent) => {
        setFormValues({
            ...formValues,
            type: e.target.value,
        });
    };

    const handleAcademicYearChange = (e: SelectChangeEvent) => {
        setFormValues({
            ...formValues,
            academic_year: e.target.value,
        });
    };

    const handleClassChange = (e: SelectChangeEvent) => {
        setFormValues({
            ...formValues,
            class: e.target.value,
        });
        getStudentsBySectionandAcademicYear(e.target.value, formValues.academic_year)
    };

    const handleStudentSelection = (event: SelectChangeEvent<string | string[]>) => {
        setSelectedStudents(event.target.value as string[]);
    };

    const getStudentName = (studentId: string) => {
        const student = students.find((student) => student._id === studentId);
        return student ? student.name : '';
    };

    const handleSubmit = () => {
        setFormValues({
            ...formValues,
            students: selectedStudents,
        })
        downloadExcelExistingStudentsAPI(
            school_id,
            selectedStudents,
            academicYears.filter((academicYear) => academicYear._id === formValues.academic_year)[0].name,
        ).then((response) => {
            if (response.status === 200) {
                let data = response.data.data
                const workbook = arrayBufferToWorkbook(data);
                let name = `PreviousBalance-${classes.filter(
                    (classItem) => classItem.sectionId === formValues.class,
                )[0].name}.xlsx`
                writeFile(workbook, name);
                props.setDownloadExcelDialog(false);
            }
        })
    };

    function arrayBufferToWorkbook(arrayBuffer: ArrayBuffer) {
        const data = new Uint8Array(arrayBuffer);
        const workbook = read(data, { type: 'array' });
        return workbook;
    }

    const getAcademicYears = () => {
        getAcademicYearAPI().then((response) => {
            if (response.status === 200) {
                setAcademicYears(response.data.data);
            }
        })
    }

    const getClasses = () => {
        getClassesAPI(school_id).then((response) => {
            if (response.status === 200) {
                setClasses(response.data.data);
                setSelectedStudents([])
            }
        })
    }

    const getStudentsBySectionandAcademicYear = (sectionId: string, academicYearId: string) => {
        getStudentsBySectionandAcademicYearAPI(sectionId, academicYearId).then((response) => {
            if (response.status === 200) {
                setStudents(response.data.data);
            }
        })
    }


    const handleLeftDownload = () => {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Sheet 1');
        // Blank Row
        // Add Header Row
        let headerRow = worksheet.addRow(['NAME', 'CLASS', 'PARENT', 'BALANCE', 'USERNAME', 'GENDER', 'ACADEMIC_YEAR']);
        // Cell Style: Fill and Border
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF2F2F2' },
                bgColor: { argb: 'FF000000' }
            };
            cell.font = {
                color: { argb: 'FF000000' },
                size: 12,
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
        // Set All Columns Width to 25
        worksheet.columns.forEach((column) => {
            column.width = 25;
        })
        // Add Data and Conditional Formatting
        let genderFormula = "\"" + ['Male', 'Female'].join(',') + "\"";
        worksheet.getCell('F' + 2).dataValidation = {
            type: 'list',
            formulae: [genderFormula],
        };
        worksheet.getCell('F2').value = 'Male';
        let classesNames = classes.map((classItem) => classItem.name);
        classesNames.unshift('Select Class');
        let classFormula = "\"" + classesNames.join(',') + "\"";
        worksheet.getCell('B' + 2).dataValidation = {
            type: 'list',
            formulae: [classFormula]
        };
        worksheet.getCell('B2').value = 'Select Class';
        worksheet.getCell('G2').value = academicYears.filter((academicYear) => academicYear._id === formValues.academic_year)[0].name;
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'LeftStudents.xlsx');
            props.setDownloadExcelDialog(false);
        });
    }

    useEffect(() => {
        getAcademicYears()
        getClasses()
    }, [])

    return (
        <div className={styles.main}>
            <span className={styles.title}>Download Excel Format</span>
            <span className={styles.subtitle}>
                <InfoOutlined />
                Select Classes in which previous balance is there
            </span>
            <div className={styles.row}>
                <Select
                    className={styles.selector}
                    value={formValues.type}
                    onChange={handleTypeChange}
                >
                    <MenuItem value='default' disabled>Select Type</MenuItem>
                    <MenuItem value='existing_students'>Existing Student</MenuItem>
                    <MenuItem value='left_students'>Left Students</MenuItem>
                </Select>
                <Select
                    disabled={formValues.type == 'default'}
                    className={styles.selector}
                    value={formValues.academic_year}
                    onChange={handleAcademicYearChange}
                >
                    <MenuItem value='default' disabled>Select Academic Year</MenuItem>
                    {
                        academicYears.map((academicYear) => (
                            <MenuItem key={academicYear._id} value={academicYear._id}>{academicYear.name}</MenuItem>
                        ))
                    }
                </Select>
            </div>
            {formValues.type == 'existing_students' &&
                <div className={styles.row}>
                    <Select
                        disabled={formValues.academic_year == 'default'}
                        className={styles.selector}
                        value={formValues.class}
                        onChange={handleClassChange}
                    >
                        <MenuItem value='default' disabled>Select Class</MenuItem>
                        {
                            classes.map((classItem) => (
                                <MenuItem key={classItem.sectionId} value={classItem.sectionId}>{classItem.name}</MenuItem>
                            ))
                        }
                    </Select>

                    <FormControl className={styles.selector}>
                        <Select
                            disabled={formValues.class == 'default'}
                            multiple
                            value={selectedStudents}
                            onChange={handleStudentSelection}
                            input={<OutlinedInput />}
                            renderValue={(selected) => (
                                <div>
                                    {(selected as string[]).map((studentId) => (
                                        <Chip
                                            style={{ margin: '0px 5px' }}
                                            key={studentId} label={getStudentName(studentId)} />
                                    ))}
                                </div>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {students.map((student) => (
                                <MenuItem key={student._id} value={student._id}>
                                    <FormControlLabel
                                        control={<Checkbox checked={selectedStudents.includes(student._id)} />}
                                        label={student.name}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            }

            <div className={styles.footer}>
                <button onClick={() => {
                    props.setDownloadExcelDialog(false)
                }}>Cancel</button>
                {
                    formValues.type == 'existing_students' ?
                        <button onClick={handleSubmit}>Download</button> :
                        <button onClick={handleLeftDownload}>Download</button>
                }
            </div>
        </div>
    );
};

export default DownloadExcel;
