import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styles from './ImportExcel.module.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Close from '@mui/icons-material/Close';
import { Dialog, IconButton } from '@mui/material';
import add from '@/assests/add.svg'
import DownloadExcel from './DownloadExcel/DownloadExcel';
import api from '@/store/api';

interface Props {
    setImportDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImportExcel = (props: Props) => {
    // School ID
    const schoolId = localStorage.getItem('school_id') as string;

    // API's state
    const importExcelAPI = api(state => state.importExcel)

    const [type, setType] = useState('existing_students');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState<FormData>(new FormData());
    const [fileName, setFileName] = useState<string>(''); // Added state for file name
    const [downloadExcelDialog, setDownloadExcelDialog] = useState<boolean>(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setType(event.target.value);
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = (file: File) => {
        const newFormData = new FormData();
        newFormData.append('file', file);
        setFormData(newFormData)
        setFileName(file.name)
    };

    const onFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length) {
            handleFileUpload(files[0]);
        }
    };

    const handleImport = () => {
        let isExisting = type === 'existing_students' ? true : false;
        importExcelAPI(schoolId, formData, isExisting).then((response) => {
            console.log(response)
            if (response.status === 200) {
                props.setImportDialog(false)

            }
        })
    }

    return (
        <div className={styles.main}>
            {/* Header Div */}
            <div className={styles.header}>
                <span className={styles.title}>Import</span>
                <div>
                    <IconButton
                        sx={{
                            border: '1.5px solid #DBDBDB',
                            borderRadius: '04px'
                        }}
                        onClick={() => {
                            setFileName('')
                            setFormData(new FormData())
                            props.setImportDialog(false)
                        }}
                    >
                        <Close />
                    </IconButton>

                </div>
            </div>
            {/* Radio Selector Div */}
            <div className={styles.radio}>
                <FormControl>
                    <RadioGroup
                        row
                        value={type}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="existing_students" control={<Radio />} label="Existing Students" />
                        <FormControlLabel value="left_students" control={<Radio />} label="Left Students" />
                    </RadioGroup>
                </FormControl>
                <button
                    className={styles.download_btn}
                    onClick={() => setDownloadExcelDialog(true)}
                >Download Format</button>
            </div>
            {/* Import Container Div */}
            <div className={styles.import_container}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={onFileInputClick}
            >
                <img src={add} height={120} width={120} />
                {
                    fileName ? <span>{fileName}</span> : <span>Drag & Drop Excel Here Or Click here to upload</span>
                }
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xlsx,.xls"
                    onChange={onFileChange}
                />
            </div>
            {/* Footer Div */}
            <div className={styles.footer}>
                <button
                    className={styles.cancel_btn}
                    onClick={() => {
                        setFileName('')
                        setFormData(new FormData())
                        props.setImportDialog(false)
                    }}
                >Cancel</button>
                <button
                    className={styles.import_btn}
                    onClick={handleImport}
                >Import</button>
            </div>
            <Dialog
                open={downloadExcelDialog}
                maxWidth="xl"
            >
                <DownloadExcel
                    setDownloadExcelDialog={setDownloadExcelDialog}
                />
            </Dialog>
        </div>
    )
}

export default ImportExcel