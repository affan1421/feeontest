import { Paper, InputBase, TextareaAutosize, Dialog } from '@mui/material';
import styles from './CreateExpenseType.module.css';
import { ExpenseTypeModel } from '@/models/ExpenseCreation';
import api from '@/store/api';
import { useEffect, useState } from 'react';
import { createExpenseTypeSchema } from '@/FormSchema/FormValidation';

interface CreateExpenseTypeProps {
    isEdit: boolean
    expenseType: ExpenseTypeModel
    setDialogEnabled: (value: boolean) => void
}

const CreateExpenseType = (props: CreateExpenseTypeProps) => {

    // API's
    const createExpenseTypeAPI = api((state) => state.createExpenseType)
    const updateExpenseTypeAPI = api(state => state.updateExpenseType)
    const setError = api((state) => state.setError)

    // Data Variables
    const [expenseType, setExpenseType] = useState<ExpenseTypeModel>({
        name: '',
        schoolId: localStorage.getItem('school_id') as string,
        userId: localStorage.getItem('user_id') as string,
        description: '',
        budget: 0,
        remainingBudget: 0,
        _id: '',
    })


    const handleClose = () => {
        props.setDialogEnabled(false);
    };

    const handleExpenseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpenseType({
            ...expenseType,
            name: event.target.value,
        })
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setExpenseType({
            ...expenseType,
            description: event.target.value,
        })
    }

    const handlebudgetAllotedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpenseType({
            ...expenseType,
            budget: Number(event.target.value),
            remainingBudget: props.isEdit ? expenseType.remainingBudget : Number(event.target.value),
        })
    }

    const handleSave = async () => {
        try {
            await createExpenseTypeSchema.validate(expenseType, { abortEarly: false });
            createExpenseTypeAPI(expenseType).then((response: any) => {
                if (response.status == 201) {
                    setExpenseType({
                        name: '',
                        description: '',
                        budget: 0,
                        remainingBudget: 0,
                    })
                    handleClose();
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
            await createExpenseTypeSchema.validate(expenseType, { abortEarly: false });
            await updateExpenseTypeAPI({ ...expenseType }).then((response: any) => {
                if (response.status == 200) {
                    setExpenseType({
                        ...expenseType,
                        name: '',
                        description: '',
                        budget: 0,
                        remainingBudget: 0,
                    })
                    handleClose()
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

    useEffect(() => {
        if (props.isEdit) {
            setExpenseType(props.expenseType)
        }
    }, [])

    return (
        <>
            <Dialog open={true} onClose={handleClose} maxWidth='xl'>
                
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Create Expense Type</h1>
                    <div className={styles.action}>
                        <button className={styles.cancel} onClick={handleClose}> Cancel</button>
                        {!props.isEdit ?
                            <button
                                onClick={() => {
                                    handleSave()
                                }}>Save</button> :
                            <button onClick={() => {
                                handleUpdate()
                            }}>Update</button>}
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.main_left}>
                        <div className={styles.row}>
                            <div style={{ width: '95%' }}>
                                <label><b>Expense Type Name</b></label>
                                <Paper
                                    className={styles.input} >
                                    <InputBase
                                        placeholder='Name'
                                        size="small"
                                        className={styles.input_input}
                                        value={expenseType.name}
                                        onChange={handleExpenseNameChange}
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
                                        placeholder='Description'
                                        className={styles.input_input_desc}
                                        value={expenseType.description}
                                        onChange={handleDescriptionChange}
                                    />
                                </Paper>
                            </div>
                        </div>
                    </div>
                    <div className={styles.main_right}>
                        <div className={styles.row}>
                            <div style={{ width: '95%' }}>
                                <label><b>Monthly Budget Allocated</b></label>
                                <Paper
                                    className={styles.input} >
                                    <InputBase
                                        type='number'
                                        placeholder='0'
                                        size="small"
                                        className={styles.input_input}
                                        value={expenseType.budget}
                                        onChange={handlebudgetAllotedChange}
                                    />
                                </Paper>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div style={{ width: '95%' }}>
                                <label><b>Monthly Budget Remaining</b></label>
                                <Paper
                                    className={`${styles.input} ${styles.nobackgroundInput}`} >
                                    <InputBase
                                        placeholder='Amount is auto Calculated here'
                                        disabled
                                        size="small"
                                        value={expenseType.remainingBudget}
                                        className={styles.input_input}
                                    />
                                </Paper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             </Dialog>
        </>
    )
}

export default CreateExpenseType