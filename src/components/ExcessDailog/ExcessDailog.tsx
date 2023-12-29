import styles from './ExcessDailog.module.css'
import React, { useCallback, useEffect, useState } from 'react'
import { Dialog, IconButton, MenuItem, Paper, Select, TextField, TextareaAutosize, setRef } from '@mui/material'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, } from '@mui/material'
import { Close, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { FeeBreakdown, FeeData } from '../GiveDiscount/GiveDiscount'
import debounce from 'lodash.debounce'
import Alert_Message from '@/ErrorHandling/Alert_Message'


interface Props {
    feeStructure: FeeData[]
    studentId: string,
    studentName: string,
    students: any,
    setStudents: React.Dispatch<React.SetStateAction<any>>
    setIsExcess: React.Dispatch<React.SetStateAction<any>>
    formValues: any,
    refund: number,
    hasRefund: boolean
}

const ExcessDailog = (props: Props) => {
    const [feeStructure, setFeeStrcuture] = useState<any[]>([]);
    const [description, setDescription] = useState('');
    const [refund, setRefund] = useState(0);
    // const [discountAmount, seDiscountAmount] = useState<any>([]);
    const [previousSubAmount, setPreviousSubAmount] = useState(0);
    const [error, setError] = useState({
        message: '',
        snack_state: false,
    })

    const [currState, setCurrState] = useState(false)


    // const getDiscountAmount = () => {
    //     let updatedstudents: any = [...props.students];
    //     let index: any = updatedstudents.findIndex((e: any) => e._id == props.studentId)
    //     let discountamount = updatedstudents[index].feeStructure.map((item: any) => {
    //         return item.discountValue
    //     })
    //     seDiscountAmount(discountamount)
    //     console.log(discountamount)
    // }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
    }

    const handleSubmit = () => {
        if (refund == 0) {
            // Sve
        } else {
            getRefund()
        }
        handleClose()
    }

    function extractMonthShortNames(data: FeeBreakdown[]) {
        const shortMonthNames = [];

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        for (const entry of data) {
            const date = new Date(entry.date);
            const monthIndex = date.getMonth();
            const shortMonthName = months[monthIndex];
            shortMonthNames.push(shortMonthName);
        }

        const concatenatedString = shortMonthNames.join(", ");
        return concatenatedString.length > 20 ? concatenatedString.slice(0, 20) + "..." : concatenatedString;
    }

    const handleDropDownChange = (index: number) => {
        let updatedRows = [...feeStructure]
        updatedRows[index].dropdown = !updatedRows[index].dropdown
        setFeeStrcuture(updatedRows)
    }

    function getMonthNameFromDate(date: Date): string {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const monthIndex = date.getMonth();
        return months[monthIndex];
    }

    const paidAmountCalculator = (index: number) => {
        const totalAmounttoBePaid = props.feeStructure[index].breakdown.reduce((feeAcc: any, breakdown: any) => {
            return feeAcc + breakdown.paidAmount
        }, 0);
        return totalAmounttoBePaid
    }

    const updateStudentFromExcess = (studentId: string, rowIndex: number, breakdownIndex: number, value: number) => {
        let updatedstudents: any = [...props.students];
        let index: any = updatedstudents.findIndex((e: any) => e._id == studentId)
        let pendingAmount = updatedstudents[index].feeStructure[rowIndex].breakdown[breakdownIndex].netAmount - updatedstudents[index].feeStructure[rowIndex].breakdown[breakdownIndex].paidAmount
        // let discountAmount = updatedstudents[index].feeStructure[rowIndex].discountValue
        // console.log('discountAmount', discountAmount)
        if (value <= pendingAmount) {
            updatedstudents[index].feeStructure[rowIndex].breakdown[breakdownIndex].discountValue = value
            // discountAmount[rowIndex] = discountAmount[rowIndex] - value
        }


        props.setStudents(updatedstudents)
        console.log(pendingAmount)
        // console.log(pendingAmount, student.feeStructure[rowIndex].breakdown[breakdownIndex].discountValue)
    }

    const handleSubRowChange = (
        row: FeeData,
        index: number,
        totalAmount: number,
        newSubAmount: number,
        monthName: string,
        maxAmount: number
    ) => {

        let divideCount = 0;
        let updatedTotalAmount = 0;

        if (newSubAmount <= totalAmount && newSubAmount >= 0 && newSubAmount <= maxAmount) {
            let updatedMonths = row.breakdown.map((breakdown: FeeBreakdown) => {
                if (monthName === getMonthNameFromDate(new Date(breakdown.date))) {
                    updatedTotalAmount += Number(newSubAmount);
                    return {
                        ...breakdown,
                        discountValue: Number(newSubAmount),
                        isUpdated: true
                    };
                } else if (breakdown.isUpdated) {
                    updatedTotalAmount += Number(breakdown.discountValue);
                } else {
                    divideCount++;
                }
                return breakdown;
            });

            // Get Divide Count of Paid Installments
            let divideCountOfPaid = row.breakdown.reduce((acc: number, item: any) => {
                if ((item.netAmount - item.paidAmount) == 0) {
                    acc = acc + 1
                }
                return acc
            }, 0)

            console.log('divideCountOfPaid', divideCountOfPaid)
            let newNonUpdatedAmount =
                (Number(totalAmount) - Number(updatedTotalAmount)) / (divideCount - divideCountOfPaid);

            let newMonthsData = updatedMonths.map((month: any) => {
                if (!month.isUpdated && newNonUpdatedAmount >= 0) {
                    if (newNonUpdatedAmount <= (month.netAmount - month.paidAmount)) {
                        month.discountValue = newNonUpdatedAmount;
                    } else {
                        month.discountValue = (month.netAmount - month.paidAmount);
                    }
                }
                return month;
            });


            let newrows = [...feeStructure]
            newrows[index].breakdown = newMonthsData
            setFeeStrcuture(newrows)

            debouncedChangeHandler(newMonthsData, totalAmount);
        }


    };

    const checkTotalIfItsCorrect = (breakdowns: FeeBreakdown[], totalAmount: number) => {
        let currentTotal = 0
        breakdowns.forEach((breakdown: FeeBreakdown) => {
            currentTotal += Number(breakdown.discountValue)
        })
        if (Number(currentTotal - totalAmount).toFixed(2) !== '0.00') {
            if ((Number(currentTotal.toFixed(2)) + 0.01) > Number((totalAmount).toFixed(2))) {
                setError({
                    snack_state: props.refund !== 0 ? false : true,
                    message: `Please Enter Correct Value -
                    Newly Added value Exceeds Total Value By
                    ${Number(currentTotal - totalAmount).toFixed(2)}`
                })
                setRefund(Number(currentTotal - totalAmount))
                setCurrState(true)
            }
            else if ((Number(currentTotal.toFixed(2)) + 0.01) < Number((totalAmount).toFixed(2))) {
                setError({
                    snack_state: props.refund !== 0 ? false : true,
                    message: `Current Total is Less than Total Value
                    ${Number(totalAmount - currentTotal).toFixed(2)}`
                })
                setRefund(Number(totalAmount - currentTotal))
                setCurrState(true)
            } else {
                setError({
                    snack_state: false,
                    message: ''
                })
                setRefund(Number(0))
                setCurrState(false)
            }
        } else {
            setError({
                snack_state: false,
                message: ''
            })
            setRefund(Number(0))
            setCurrState(false)
        }
    };

    const debouncedChangeHandler = useCallback(
        debounce(checkTotalIfItsCorrect, 1000),
        []
    );


    const getRefund = () => {
        let paid = 0
        let discount = 0
        let net = 0
        let feestrcut = [...props.feeStructure]
        feestrcut.forEach((fee: any) => {
            fee.breakdown.forEach((item: any) => {
                paid += item.paidAmount
                discount += item.discountValue
                net += item.netAmount
            })
            if (Number(fee.discountValue - (net - paid)) >= 0) {
                setRefund(Number(fee.discountValue - (net - paid)))
            } else {
                setRefund(0)
            }
        })
    }

    const handleClose = () => {
        if (!error.snack_state) {
            props.setIsExcess(false)
        }
    }

    useEffect(() => {
        if (props.refund) {
            setRefund(props.refund)
        } else {
            getRefund()
        }
        // getDiscountAmount()
        setFeeStrcuture(props.feeStructure)
        console.log(props.feeStructure)
    }, [])

    useEffect(() => {
        console.log('props.hasRefund', props.hasRefund)
    }, [props.hasRefund])

    return (
        <>
            <div className={styles.dialog}>
                <div className={styles.dialog_header}>
                    <h1>{props.studentName}</h1>
                    <IconButton sx={{ p: '10px' }}
                        onClick={() => {
                            handleClose()
                        }} >
                        <Close />
                    </IconButton>
                </div>
                <div className={styles.row}>
                    <div><span className={styles.heading}>Class</span>&nbsp;<span className={styles.details}>{props.formValues.className}</span></div>
                    <div><span className={styles.heading}>Discount Category</span>&nbsp;<span className={styles.details}>{props.formValues.discountCategory}</span></div>
                    <div><span className={styles.heading}>Fee Category</span>&nbsp;<span className={styles.details}>{props.formValues.feeCategory}</span></div>
                    <div><span className={styles.heading}>Fee Structure</span>&nbsp;<span className={styles.details}>{props.formValues.feeStructure}</span></div>
                </div>
                <div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>SL</b></TableCell>
                                    <TableCell><b>Fee type</b></TableCell>
                                    {/* <TableCell><b>Amount Type</b></TableCell> */}
                                    <TableCell><b>Fee Schedule</b></TableCell>
                                    <TableCell><b>Amount</b></TableCell>
                                    <TableCell><b>Paid Amount</b></TableCell>
                                    <TableCell><b>Enter Discount</b></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feeStructure && feeStructure.map((row: any, rowIndex: number) => {
                                    return <>
                                        <TableRow key={row._id}>
                                            <TableCell>{rowIndex + 1}</TableCell>
                                            <TableCell>{row.feeType.name}</TableCell>
                                            {/* <TableCell sx={{ width: '150px' }}>
                                                <Select
                                                    disabled
                                                    defaultValue={row.amountType}
                                                    sx={{ width: '150px', height: '46px' }}
                                                >
                                                    <MenuItem value="default" disabled>Select Amount Type</MenuItem>
                                                    <MenuItem value="Percentage">Percentage</MenuItem>
                                                    <MenuItem value="Amount">Amount</MenuItem>
                                                </Select>
                                            </TableCell> */}
                                            <TableCell>{extractMonthShortNames(row.breakdown)}</TableCell>
                                            <TableCell>₹{row.amount}</TableCell>
                                            <TableCell>₹{paidAmountCalculator(rowIndex)}</TableCell>
                                            <TableCell sx={{ width: '150px' }}>
                                                <TextField
                                                    disabled
                                                    placeholder={`Enter ${row.amountType == 'Percentage' ? 'Value' : 'Amount'}`}
                                                    type='text'
                                                    sx={{ height: '46px' }}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        // handleParentAmountChange(rowIndex, Number(event.target.value))
                                                    }}
                                                    value={row.discountValue} />
                                            </TableCell>
                                            <TableCell>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    height: '100%'
                                                }}>
                                                    {
                                                        row.breakdown.length > 1 &&
                                                        <IconButton
                                                            onClick={() => {
                                                                handleDropDownChange(rowIndex)
                                                            }}
                                                            sx={{
                                                                marginTop: '05px',
                                                                borderRadius: '4px',
                                                            }}
                                                        >
                                                            {row.dropdown ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                        </IconButton>
                                                    }

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {
                                            row.breakdown.length > 1 && row.dropdown && (
                                                row.breakdown.map((breakdown: any, breakdownIndex: number) => {
                                                    return <TableRow>
                                                        {/* <TableCell></TableCell> */}
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell>{getMonthNameFromDate(new Date(breakdown.date))}</TableCell>
                                                        <TableCell>₹{breakdown.netAmount}</TableCell>
                                                        <TableCell>₹{breakdown.paidAmount}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                // disabled={props.hasRefund}
                                                                placeholder={`Enter ${row.amountType == 'Percentage' ? 'Value' : 'Amount'}`}
                                                                type='text'
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    handleSubRowChange(row, rowIndex, row.discountValue, Number(event.target.value), getMonthNameFromDate(new Date(breakdown.date)),
                                                                        (breakdown.netAmount - breakdown.paidAmount)
                                                                    )
                                                                }}
                                                                value={breakdown.discountValue} />
                                                        </TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                })
                                            )
                                        }

                                    </>

                                })}
                            </TableBody >
                            {

                                props.refund !== 0 &&
                                <TableRow>
                                    <TableCell><b>Refund</b></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><b>₹{refund}</b></TableCell>
                                </TableRow>
                            }
                        </Table>
                    </TableContainer>
                </div>
                {/* <div style={{ margin: '20px 0px' }}>
                    <div className={styles.title}>
                        <h1>Discount Comment</h1>
                    </div>
                    <Paper

                        className={styles.input_desc} >
                        <TextareaAutosize
                            data-testid='add-description'
                            placeholder='Write Something'
                            id="filled-hidden-label-small"
                            className={styles.input_input_desc}
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </Paper>
                </div> */}
                <div className={styles.button}>
                    <div>
                        <button onClick={handleClose} className={styles.cancel}>Close</button>
                    </div>
                    <div>
                        <button className={`${styles.save} ${error.snack_state && `${styles.disabled}`}`}
                            disabled={error.snack_state}
                            onClick={handleSubmit}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            {
                error.snack_state &&
                <Alert_Message
                    isSnackbar={true}
                    AlertProperties={
                        {
                            severity: 'error',
                            message: `${error.message}`,
                            width: '100%',

                        }
                    }
                    SnackbarProperties={
                        {
                            noHide: true
                        }
                    }
                />
            }
        </>
    )
}

export default ExcessDailog