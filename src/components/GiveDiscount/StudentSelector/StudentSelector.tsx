import React, { useState, useMemo, useEffect } from 'react';
import { Box, Checkbox, Dialog, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import user from '@/assests/user.png';
import { TablePagination } from '@mui/material';
import { formatter } from '@/helpers/formatter';
import styles from './StudentSelector.module.css'
import { FeeData } from '../GiveDiscount';
import ExcessDailog from '@/components/ExcessDailog/ExcessDailog';
import { Visibility } from '@mui/icons-material';
import Alert_Message from '@/ErrorHandling/Alert_Message';

export interface Student {
    studentName: string;
    sectionName: string;
    totalFees: number;
    paidAmount: number;
    discountApplied: number;
    discountStatus?: string;
    totalDiscountAmount: number;
    profile_image?: string;
    isSelected?: boolean;
    id: string;
    excessAmount: number;
    attachments: string[];
    _id: string

    // Extra Fields for Backend
    // studentId: string;
    // isPercentage: boolean;
    // value: number;
    // discountAmount: number

    feeDetails: FeeData[]

    // For Local
    feeStructure: FeeData[]
}

interface Props {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<any>>;
    feeStructure: FeeData[] | any
    formValues: any
}

const StudentSelector = (props: Props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExcess, setIsExcess] = useState(false);
    const [hasRefund, setHasRefund] = useState(false);
    const [canSelect, setCanSelect] = useState(false);
    const [feeStructure, setFeeStructure] = useState<FeeData[]>([] as FeeData[])
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [refund, setRefund] = useState(0);
    const [error, setError] = useState({
        message: '',
        snack_state: false,
    })

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredStudents = useMemo(() => {
        if (!searchTerm) {
            if (props.students.length > 0) {
                return props.students.sort((a, b) => a.discountStatus ? -1 : 1)
            } else {
                return props.students.sort((a, b) => a.discountStatus ? -1 : 1);
            }
        }
        const lowerSearchTerm = searchTerm.toLowerCase();
        return props.students.filter((student) =>
            student.studentName.toLowerCase().includes(lowerSearchTerm)
        ).sort((a, b) => a.discountStatus ? -1 : 1)
    }, [props.students, searchTerm]);

    const totalItems = filteredStudents?.length;

    const handleStudentChecked = (studentId: string, checked: boolean) => {
        if (checked) {
            let updatedstudents: any = [...props.students];
            let index = updatedstudents.findIndex((e: any) => e._id == studentId);
            updatedstudents[index].isSelected = true;
            let isExcess = checkDiscountisExcess(updatedstudents[index].feeDetails, props.feeStructure)

            setName(updatedstudents[index].studentName)
            console.log(updatedstudents[index].feeDetails)
            updatedstudents[index].feeStructure = applyDiscount(updatedstudents[index].feeDetails, props.feeStructure)
            updatedstudents[index].discountApplied = getDiscountApplied(updatedstudents[index].feeStructure)
            setFeeStructure(updatedstudents[index].feeStructure)
            getRefund(updatedstudents[index].feeStructure)

            if (isExcess || updatedstudents[index].paidAmount !== 0) {
                setIsExcess(true)
                updatedstudents[index].isExcess = true
            } else {
                updatedstudents[index].isExcess = false
            }

            if (updatedstudents[index].discountApplied == 0) {
                updatedstudents[index].isSelected = false;
                setIsExcess(false)
                setError({
                    snack_state: true,
                    message: `Student Already Paid Full Amount`
                })
                setTimeout(() => {
                    setError({
                        snack_state: false,
                        message: ``
                    })
                }, 1300)
            }
            props.setStudents(updatedstudents);
        } else {
            let updatedstudents = [...props.students];
            let index = updatedstudents.findIndex((e) => e._id == studentId);
            updatedstudents[index].isSelected = false;
            updatedstudents[index].feeStructure = updatedstudents[index].feeDetails
            updatedstudents[index].discountApplied = 0
            setFeeStructure(updatedstudents[index].feeStructure)
            getRefund(updatedstudents[index].feeStructure)
            props.setStudents(updatedstudents);
        }
    };

    const checkDiscountisExcess = (feeStructure: any, discountedFeeStructure: any) => {
        const totalDiscountAmount = discountedFeeStructure.reduce((total: any, fee: any) => {
            if (fee.amountType === "Amount") {
                total += fee.discountValue;
            }
            else if (fee.amountType === "Percentage") {
                const amount = (fee.amount * fee.discountValue) / 100;
                total += amount;
            }
            return total;
        }, 0);

        const totalAmounttoBePaid = feeStructure.reduce((acc: any, fee: any) => {
            return acc + fee.breakdown.reduce((feeAcc: any, breakdown: any) => {
                return feeAcc + (breakdown.netAmount - breakdown.paidAmount);
            }, 0);
        }, 0);

        return totalAmounttoBePaid < totalDiscountAmount
    }

    function applyDiscount(feeStructure: any, discountedFeeStructure: any) {
        let refund = 0;
        // Loop through each fee structure object
        feeStructure.forEach((feeObj: any, index: number) => {
            let newindex = discountedFeeStructure.findIndex((e: any) => {
                return (feeObj.feeType._id == e.feeType.id)
            })
            console.log('newindex', newindex)
            if (newindex !== -1) {
                const discountedFeeObj = discountedFeeStructure[newindex];
                console.log('discountedFeeObj', discountedFeeObj)
                console.log('Fee Obj', feeObj)
                // Passing Data From Template to Student Fee Structure
                // feeObj.amountType = discountedFeeObj.isPercentage ? 'Percentage' : 'Amount'
                feeObj.amountType = discountedFeeObj.amountType
                feeObj.amount = discountedFeeObj.amount
                feeObj.discountValue = discountedFeeObj.discountValue
                feeObj.dropdown = discountedFeeObj.dropdown
                // Check if any breakdown is paid
                const paidBreakdown = feeObj.breakdown.find((b: any) => b.paidAmount > 0);

                if (paidBreakdown) {
                    // Get total discount value
                    let totalDiscount = discountedFeeObj.discountValue;

                    feeObj.breakdown.forEach((b: any, i: any) => {

                        b.pendingAmount = b.netAmount - b.paidAmount
                        if (discountedFeeObj.amountType === "Amount") {
                            if (totalDiscount > 0) {
                                if (totalDiscount >= b.pendingAmount) {
                                    totalDiscount = totalDiscount - b.pendingAmount
                                    b.discountValue = b.pendingAmount
                                }
                                else {
                                    b.discountValue = totalDiscount
                                    totalDiscount = totalDiscount - b.pendingAmount
                                    // b.discountValue = b.pendingAmount - totalDiscount
                                }
                            }
                            else {
                                b.discountValue = 0
                            }

                            refund = totalDiscount
                            setRefund(totalDiscount)
                            console.log('refund', refund)
                        } else {

                            b.discountValue = (b.pendingAmount / b.netAmount) * 100

                            b.discountAmount = (b.discountValue * b.netAmount) / 100
                        }

                    });

                    let allDiscountinPercentage = feeObj.breakdown.reduce((acc: number, obj: any) => {
                        return acc + obj.discountAmount
                    }, 0)

                    feeObj.refund = feeObj.amountType == 'Amount' ? refund : (feeObj.discountValue * feeObj.netFees / 100) - allDiscountinPercentage
                } else {
                    // Apply discounts as is if no breakdown is paid
                    discountedFeeObj.breakdown.forEach((b: any, i: any) => {
                        feeObj.breakdown[i].discountValue = b.discountValue;
                        console.log('discObh', b, feeObj.breakdown[i])
                    });
                }
            } else {
                // feeObj.discountValue = 0

            }

        });
        console.log('feeStructure', feeStructure)
        return feeStructure;
    }

    const handleClose = () => {
        setIsExcess(false)
    }

    const getDiscountApplied = (feeStructure: any[]) => {
        let discountApplied = 0
        feeStructure.forEach((fee: any) => {
            if (fee.amountType == 'Amount') {
                fee.breakdown.forEach((breakdown: any) => {
                    discountApplied += breakdown.discountValue ? breakdown.discountValue : 0
                })
            }
            // else {
            //     fee.breakdown.forEach((breakdown: any) => {
            //         discountApplied += breakdown.totalAmount * breakdown.discountValue / 100
            //     })
            // }
        })
        console.log('discountApplied', feeStructure)
        return discountApplied
    }

    const getRefund = (feeStructure: any) => {
        let paid = 0
        let discount = 0
        let net = 0
        feeStructure.forEach((fee: any) => {
            fee.breakdown.forEach((item: any) => {
                paid += item.paidAmount
                discount += item.discountValue
                net += item.netAmount
            })
            if (Number(fee.discountValue - (net - paid)) >= 0) {
                setRefund(Number(fee.discountValue - (net - paid)))
                setHasRefund(false)
            } else {
                setHasRefund(true)
                setRefund(0)
            }
        })
    }

    useEffect(() => {
        let total = props.feeStructure.reduce((acc: number, feeItem: any) => {
            if (feeItem.value) {
                acc = acc + feeItem.value
            }
            return acc
        }, 0)

        if (total == 0) {
            let unselectstudents = [...props.students]
            unselectstudents.forEach((student) => {
                student.isSelected = false
            })
            props.setStudents(unselectstudents)
        }

        setCanSelect(total !== 0)
    }, [props.feeStructure])

    return (
        <>
            <div className={styles.main}>
                <Box>
                    <Paper className={styles.search}>
                        <IconButton aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            placeholder="Search student name, Roll number"
                            id="filled-hidden-label-small"
                            defaultValue="Search student name, Roll number"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0);
                            }}
                            className={styles.search_input}
                        />
                    </Paper>
                </Box>
                <Box sx={{ minHeight: 500, width: '100%' }}>
                    <TableContainer style={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.t_head}>Student Name</TableCell>
                                    <TableCell className={styles.t_head}>Class</TableCell>
                                    <TableCell className={styles.t_head}>Total Fees</TableCell>
                                    <TableCell className={styles.t_head}>Paid Amount</TableCell>
                                    <TableCell className={styles.t_head}>Due Amount</TableCell>
                                    <TableCell className={styles.t_head}>Discount Amount</TableCell>
                                    <TableCell className={styles.t_head}>Total Discounts</TableCell>
                                    <TableCell className={styles.t_head}></TableCell>
                                    <TableCell className={styles.t_head}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((student: any, index: number) => {
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className={styles.cell_container}>
                                                        <div>
                                                            <Checkbox
                                                                // disabled={(!canSelect)}
                                                                disabled={student.discountStatus !== null || (!canSelect)}
                                                                checked={student.isSelected}
                                                                onChange={(event) => {
                                                                    handleStudentChecked(student._id, event.target.checked);
                                                                    // handleStudentChecked(index, event.target.checked);
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            {student.profile_image ? (
                                                                <img src={student.profile_image} className={styles.cell_image} />
                                                            ) : (
                                                                <img className={styles.cell_image} src={user} />
                                                            )}
                                                        </div>
                                                        <div style={{ marginTop: '5px' }}>
                                                            {student.studentName}
                                                            {student?.discountStatus === 'Pending' ? (
                                                                <div className={`${styles.status} + ${styles.pending}`}>Pending</div>
                                                            ) : student.discountStatus === 'Approved' ? (
                                                                <div className={`${styles.status} + ${styles.approved}`}>Approved</div>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{student.sectionName}</TableCell>
                                                <TableCell>{formatter(student.totalFees)}</TableCell>
                                                <TableCell>{formatter(Number(student.paidAmount))}</TableCell>
                                                <TableCell>{formatter(Number(student.dueAmount))}</TableCell>
                                                <TableCell>{formatter(student.discountApplied)}</TableCell>
                                                <TableCell>{formatter(student.totalDiscountAmount)}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            setStudentId(student._id)
                                                            setName(student.studentName)
                                                            setFeeStructure(student.feeStructure ? student.feeStructure : student.feeDetails)
                                                            setIsExcess(true)
                                                        }}
                                                        disabled={!student.isExcess}
                                                        sx={{
                                                            border: '1px solid #d0d0d0',
                                                            borderRadius: '04px'
                                                        }}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalItems}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Box>
            </div>
            <Dialog open={isExcess} maxWidth='xl'>
                <ExcessDailog
                    setIsExcess={setIsExcess}
                    feeStructure={feeStructure} studentId={studentId}
                    studentName={name} students={props.students} setStudents={props.setStudents}
                    formValues={props.formValues}
                    refund={refund}
                    hasRefund={hasRefund}
                />
            </Dialog>
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
    );
};

export default StudentSelector;
