import { Close, LocalFireDepartment } from "@mui/icons-material"
import {
    Button,
    Dialog,
    IconButton,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextareaAutosize,
} from "@mui/material"
import Input from "@/Elements/Input/Input"
import styles from "./CreateExpense.module.css"
import React, { useEffect, useState } from "react"
import { Expense } from "@/models/ExpenseCreation"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import api from "@/store/api"
import { Selector } from "@/Elements/Selector/Selector"
import { CreateExpenseSchema } from "@/FormSchema/FormValidation"
import dayjs from "dayjs"

interface ExpenseType {
    name: string
    _id: string
    remainingBudget?: number
}

interface Props {
    setDialogEnabled: (state: boolean) => void
}

const CreateExpense = (props: Props) => {
    // Data varaibles
    let schoolId = localStorage.getItem("school_id") as string
    let userId = localStorage.getItem("user_id") as string

    //API
    const getExpenseTypeNamesAPI = api((state) => state.getExpenseTypeNames)
    const createExpenseAPI = api((state) => state.createExpense)
    const setError = api((state) => state.setError)
    const getSchoolDetailAPI = api(state => state.getSchoolDetailsById)

    //State Variables
    const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([])
    const [budget, setBudget] = useState<number>(0)
    const [createExpense, setCreateExpense] = useState<Expense>({
        reason: "",
        schoolId: schoolId,
        expenseType: "default",
        expenseTypeName: "",
        paymentMethod: "default",
        amount: 0,
        createdBy: userId,
        // expenseDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\b\d\b/g, '0$&'),
        expenseDate: dayjs(),
        approvedBy: "",
    })
    const [loading,setLoading] = useState(false)

    const [schoolDetails, setSchoolDetails] = useState({
        permissions: {
            prevDateReceipt: false,
            prevDateVoucher: false
        }
    });

    useEffect(() => {
        getAllExpenseType()
    }, [])

    const getAllExpenseType = () => {
        getExpenseTypeNamesAPI(schoolId).then(async (response: any) => {
            console.log(response)
            if (response.status === 200) {
                let ExpenseTypes: ExpenseType[] = await response.data.data
                ExpenseTypes.unshift({ name: "Select Expense Type", _id: "default" })
                setExpenseTypes(ExpenseTypes)
            }
        })
    }

    const getExpenseTypeName = (id: string) => {
        return expenseTypes.filter((e) => e._id == id)[0].name
    }

    const getRemainingBudget = (id: string): number => {
        return Number(expenseTypes.filter((e) => e._id == id)[0].remainingBudget)
    }

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateExpense({
            ...createExpense,
            amount: Number(event.target.value),
        })
    }

    const handleExpenseChange = async (event: string) => {
        setCreateExpense({
            ...createExpense,
            expenseType: event as Expense["expenseType"],
            expenseTypeName: await getExpenseTypeName(event),
        })
        let budget: number = getRemainingBudget(event)
        setBudget(budget)
    }

    const handleApprovedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateExpense({
            ...createExpense,
            approvedBy: event.target.value,
        })
    }

    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setCreateExpense({
            ...createExpense,
            reason: event.target.value,
        })
    }

    const handleDateChange = (date: any) => {
        // let currentDate = new Date(`${event.$M + 1}/${event.$D}/${event.$y}`)
        // let formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        // console.log(formattedDate);
        setCreateExpense({
            ...createExpense,
            expenseDate: date
        })
        console.log(date)
    }

    const handlePaymentChange = (event: SelectChangeEvent) => {
        setCreateExpense({
            ...createExpense,
            paymentMethod: event.target.value as Expense['paymentMethod'],
        })
    }

    const getSchoolDetails = () => {
        getSchoolDetailAPI(schoolId).then((response) => {
            let permissions = response.data.data[0].permissions;
            setSchoolDetails({
                ...schoolDetails,
                permissions: permissions
            });
            console.log(schoolDetails);
        });
    }

    useEffect(() => {
        getSchoolDetails()
    }, [])

    const handleSubmit = async () => {
        setLoading(true)
        let date: any = createExpense.expenseDate
        let currentDate = new Date(`${date.$M + 1}/${date.$D}/${date.$y}`)
        let formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

        let apiData: any = createExpense
        apiData = { ...createExpense, expenseDate: formattedDate, validateExpenseDate: currentDate }

        try {
            await CreateExpenseSchema.validate({ ...apiData, expenseDate: formattedDate }, { abortEarly: false })
            createExpenseAPI(apiData).then((response: any) => {
                if (response.status === 201) {
                    setLoading(false)
                    setCreateExpense({
                        ...createExpense,
                        reason: "",
                        expenseType: "default",
                        paymentMethod: "default",
                        amount: 0,
                        expenseDate: dayjs(),
                        approvedBy: "",
                    })
                    props.setDialogEnabled(false)
                }
            })
        } catch (error: any) {
            // console.log(error)
            setLoading(false)
            const errorMessage = error.errors.join("\n")
            setError(true, errorMessage)
            setTimeout(() => {
                setError(false, "")
            }, 2000)
        }
    }

    return (
        <>
            <Dialog open={true} onClose={(() => props.setDialogEnabled(false))} maxWidth="xl">
                <div className={styles.dialog}>
                    <div className={styles.dialog_header}>
                        <h1>Create Expense</h1>
                        <IconButton
                            sx={{ p: "10px" }}
                            onClick={() => props.setDialogEnabled(false)}
                        >
                            <Close />
                        </IconButton>
                    </div>
                    <div className={styles.dialog_container}>
                        <div className={styles.row}>
                            <div className={styles.selector}>
                                {/* <label htmlFor="nameInput" className={styles.label}>
                                    Expense Type
                                </label> */}
                                <div style={{ margin: "10px" }}>
                                    <Selector
                                        value={createExpense.expenseType}
                                        items={expenseTypes.map((e) => {
                                            return {
                                                name: e.name,
                                                value: e._id,
                                            }
                                        })}
                                        onChange={handleExpenseChange}
                                    ></Selector>
                                </div>
                            </div>
                            <div className={styles.input}>
                                {/* <label htmlFor="nameInput" className={styles.label}>
                                    Approved By
                                </label> */}
                                <Input
                                    width="90%"
                                    placeholder="Approved By"
                                    value={createExpense.approvedBy}
                                    onChange={handleApprovedChange}
                                />
                            </div>
                        </div>
                        <div>
                            {/* <label htmlFor="nameInput" className={styles.label}>
                                Reason
                            </label> */}
                            <Paper className={styles.input_desc}>
                                <TextareaAutosize
                                    data-testid="add-description"
                                    placeholder="Reason"
                                    id="filled-hidden-label-small"
                                    className={styles.input_input_desc}
                                    onChange={handleDescriptionChange}
                                    value={createExpense.reason}
                                />
                            </Paper>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.input_amount}>
                                {/* <label htmlFor="nameInput" className={styles.label}>
                                    Amount
                                </label> */}
                                <Input
                                    width="90%"
                                    type="number"
                                    placeholder="Enter Amount"
                                    value={
                                        createExpense.amount !== 0 ? createExpense.amount : null
                                    }
                                    onChange={handleAmountChange}
                                />
                            </div>
                            {schoolDetails.permissions.prevDateVoucher &&
                                
                            <div className={styles.input_date}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        className={styles.datepicker}
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                InputProps: {
                                                    sx: {
                                                        height: '48px',
                                                    },
                                                },
                                            }
                                        }}
                                        value={createExpense.expenseDate}
                                        onChange={(newValue) => { handleDateChange(newValue) }}
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                            </div>
                            }
                            <div className={styles.input_budget}>
                                <span className={styles.budget_rem}>Budget Remaining</span>
                                <span className={styles.budget_amt}>{budget}</span>
                            </div>
                        </div>
                        {/* <label htmlFor="nameInput" className={styles.label}>
                            Payment Method
                        </label> */}
                        <div className={styles.row}>
                            <div className={styles.payment_selector}>
                                <Select
                                    style={{ width: "100%" }}
                                    value={createExpense.paymentMethod}
                                    onChange={handlePaymentChange}
                                >
                                    <MenuItem value="default">Payment Method</MenuItem>
                                    <MenuItem value="CASH">Cash</MenuItem>
                                    <MenuItem value="CHEQUE">Cheque</MenuItem>
                                    <MenuItem value="ONLINE_TRANSFER">Online Transfer</MenuItem>
                                    <MenuItem value="UPI">UPI</MenuItem>
                                    <MenuItem value="DD">DD</MenuItem>
                                    <MenuItem value="DEBIT_CARD">Debit Card</MenuItem>
                                    <MenuItem value="CREDIT_CARD">Debit Card</MenuItem>
                                </Select>
                            </div>
                        </div>
                        <div className={styles.button}>
                            <div>
                                <button className={styles.cancel}>Cancel</button>
                            </div>
                            <div>
                                <Button disabled={loading} variant="contained" sx={{padding:"10px 20px"}} onClick={handleSubmit}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default CreateExpense
