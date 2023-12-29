import { useState } from 'react'
import styles from './CreateCategory.module.css'
import { Paper, InputBase, TextareaAutosize } from '@mui/material';
import { FeeCategorySchema } from '../../FormSchema/FormValidation';
import api from '../../store/api';
import { FeeCategory } from '@/models/FeeCategory';

const CreateCategory = (props: any) => {
    // API Variables
    const setError = api((state) => state.setError)
    const createCategory = api((state) => state.createFeeCategory)

    // Data Variable
    const [feeCategory, setFeeCategory] = useState<FeeCategory>({
        name: '',
        description: '',
        schoolId: localStorage.getItem('school_id') as string
    })

    // Change Handlers
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeeCategory({
            ...feeCategory,
            name: event.target.value,
        })
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeeCategory({
            ...feeCategory,
            description: event.target.value,
        })
    }


    const handleClose = () => {
        props.setDialogEnabled(false);
    };

    const handleSubmit = async () => {
        // Call Validation 
        try {
            await FeeCategorySchema.validate(feeCategory, { abortEarly: false });
            // Call API
            createCategory(feeCategory).then((response: any) => {
                if (response.status == 201) {
                    handleClose()
                    setFeeCategory({
                        name: '',
                        description: '',
                    })
                }
            })
        } catch (error: any) {
            const errorMessage = error.errors.join('\n' + '& ');
            setError(true, errorMessage);
            setTimeout(() => {
                setError(false, '');
            }, 2000)
        }
    }

    return (
        <div className={styles.dialog}>
            <div className={styles.dialog_header}>
                <h1>Fee Category</h1>
            </div>
            <div className={styles.dialog_container}>
                <br />
                <div>
                    <span className={styles.label}>Name</span>
                    <br />
                    <Paper

                        className={styles.input} >
                        <InputBase
                            placeholder='Name'
                            id="filled-hidden-label-small"
                            size="small"
                            className={styles.input_input}
                            value={feeCategory.name}
                            onChange={handleNameChange}
                            data-testid='add-name'
                        />
                    </Paper>
                </div>
                <div style={{ margin: '20px 0px' }}>
                    <span className={styles.label}>Description</span>
                    <br />
                    <Paper

                        className={styles.input_desc} >
                        <TextareaAutosize
                            data-testid='add-description'
                            placeholder='Description'
                            id="filled-hidden-label-small"
                            className={styles.input_input_desc}
                            value={feeCategory.description}
                            onChange={handleDescriptionChange}
                        />
                    </Paper>
                </div>
            </div>
            <div className={styles.button}>
                <div>
                    <button className={styles.cancel} onClick={handleClose}>Cancel</button>
                </div>
                <div>
                    <button className={styles.save} onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateCategory