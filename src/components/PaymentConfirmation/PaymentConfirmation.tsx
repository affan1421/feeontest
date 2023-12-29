import React, { useEffect, useState } from 'react';
import {
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import {
    ArrowDropDown,
    ArrowDropUp,
    CloseRounded,
    Print,
    ReceiptLong,
    Send,
} from '@mui/icons-material';
import styles from './PaymentConfirmatiom.module.css';
import dayjs from 'dayjs';
import DatePicker from "@/Elements/DatePicker/DatePicker";
import api from '@/store/api';
import { Class } from '@/models/Class'
import Input from '@/Elements/Input/Input'
import { PaymentConfirmation as PaymentConfirmationModel } from '@/models/PaymentConfirmation';

interface Props {
    studentId?: string;
    schoolId?: string;
}

interface Receipt {
    receiptId: string;
    description: string;
    paymentMethod: string;
    amount: number;
    status: string;
    fees: Fee[];
    hasReceipt: boolean;
    dropdown: boolean;
    studentName: string,
    parentName: string,
}

interface Fee {
    name: string;
    amount: number;
}

const PaymentConfirmation = (props: Props) => {
    // School ID
    const schoolId = localStorage.getItem('school_id') as string

    // API's
    const getClassesAPI = api(state => state.getClasses)
    const getPaymentConfirmationListAPI = api(state => state.getPaymentConfirmationList)

    const [classes, setClasses] = useState<Class[]>([])
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const [formValues, setFormValues] = useState({
        paymentMethod: 'default',
        status: 'default',
        date: '',
        search: '',
        section: 'default'
    });

    const paymentMethods = [
        { value: 'CASH', label: 'Cash' },
        { value: 'CHEQUE', label: 'Cheque' },
        { value: 'ONLINE_TRANSFER', label: 'Online Transfer' },
        { value: 'UPI', label: 'UPI' },
        { value: 'DD', label: 'DD' },
        { value: 'DEBIT_CARD', label: 'Debit Card' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
    ];

    const status = [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
    ];

    const [receipts, setReceipts] = useState<Receipt[]>([
        {
            receiptId: '123',
            description: 'Term Fee',
            studentName: 'John Doe',
            parentName: 'Alex Doe',
            paymentMethod: 'Cash',
            amount: 1000,
            status: 'Pending',
            fees: [
                { name: 'Admission Fee', amount: 1000 },
                { name: 'Sports Fees', amount: 1000 },
                { name: 'Book Fees', amount: 1000 },
            ],
            hasReceipt: false,
            dropdown: false,
        },
        {
            receiptId: '124',
            description: 'Term Fee',
            studentName: 'John Doe',
            parentName: 'Alex Doe',
            paymentMethod: 'Cash',
            amount: 1000,
            status: 'Approved',
            fees: [
                { name: 'Admission Fee', amount: 1000 },
                { name: 'Sports Fees', amount: 1000 },
                { name: 'Book Fees', amount: 1000 },
            ],
            hasReceipt: false,
            dropdown: false,
        },
        {
            receiptId: '121',
            description: 'Term Fee',
            paymentMethod: 'Cash',
            studentName: 'John Doe',
            parentName: 'Alex Doe',
            amount: 1000,
            status: 'Rejected',
            fees: [
                { name: 'Admission Fee', amount: 1000 },
                { name: 'Sports Fees', amount: 1000 },
                { name: 'Book Fees', amount: 1000 },
            ],
            hasReceipt: false,
            dropdown: false,
        },
        {
            receiptId: '121',
            description: 'Term Fee',
            paymentMethod: 'Cash',
            amount: 1000,
            status: 'Approved',
            studentName: 'John Doe',
            parentName: 'Alex Doe',
            fees: [
                { name: 'Admission Fee', amount: 1000 },
                { name: 'Sports Fees', amount: 1000 },
                { name: 'Book Fees', amount: 1000 },
            ],
            hasReceipt: true,
            dropdown: false,
        },
    ]);

    const handlePaymentMethodChange = (event: SelectChangeEvent) => {
        setFormValues({ ...formValues, paymentMethod: event.target.value });
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        setFormValues({ ...formValues, status: event.target.value });
    };

    const handleClearPaymentMethod = () => {
        setFormValues({ ...formValues, paymentMethod: 'default' });
    };

    const handleClearStatus = () => {
        setFormValues({ ...formValues, status: 'default' });
    };

    const handleDateChange = (dateString: string) => {
        setFormValues({
            ...formValues,
            date: dateString ? dateString : "",
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value as string;
        setFormValues({ ...formValues, search: searchValue });
        debouncedHandleSearch(searchValue);
    };

    const debouncedHandleSearch = (searchValue: string) => {
        clearTimeout(debounceTimer!); // Clear previous debounce timer
        const timer = setTimeout(() => {
            // Api call here
        }, 500); // Set debounce delay (e.g., 300ms)
        setDebounceTimer(timer); // Store new debounce timer
    };

    const toggleReceiptDropdown = (receiptId: string) => {
        setReceipts((prevReceipts) =>
            prevReceipts.map((receipt) =>
                receipt.receiptId === receiptId
                    ? { ...receipt, dropdown: !receipt.dropdown }
                    : receipt
            )
        );
    };

    // Get Classes
    const getClasses = () => {
        getClassesAPI(schoolId).then((response: any) => {
            setClasses(response.data.data)
        })
    }

    const getPaymentConfirmationList = () => {
        let data: PaymentConfirmationModel = {} as PaymentConfirmationModel
        getPaymentConfirmationListAPI(data).then((response) => {
            if (response.status == 200) {
                console.log(response)
            }
        })
    }

    useEffect(() => {
        getPaymentConfirmationList()
        getClasses()
    }, [])

    return (
        <div className={styles.main}>
            <div className={styles.filters}>
                {
                    // If SchoolId Exists   
                    props.schoolId && (
                        <>
                            <div className={styles.search}>
                                <Input
                                    value={formValues.search}
                                    placeholder={'Student Name, Receipt Number'}
                                    onChange={handleSearchChange}
                                    type='text'
                                />
                            </div>
                            <Select
                                className={styles.selector}
                                onChange={(e) => {
                                    setFormValues({ ...formValues, section: e.target.value as string })
                                }}
                                value={formValues.section}
                                endAdornment={
                                    formValues.section !== 'default' && (
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setFormValues({ ...formValues, section: 'default' })
                                            }}
                                        >
                                            <CloseRounded />
                                        </IconButton>
                                    )
                                }
                                IconComponent={
                                    formValues.section == 'default' ? undefined : () => null
                                }
                            >
                                <MenuItem value="default">Select Class</MenuItem>
                                {classes.map((item: Class) => {
                                    return (
                                        <MenuItem key={item.sectionId} value={item.sectionId}>
                                            {item.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </>
                    )
                }
                <Select
                    className={styles.selector}
                    onChange={handlePaymentMethodChange}
                    value={formValues.paymentMethod}
                    endAdornment={
                        formValues.paymentMethod !== 'default' && (
                            <IconButton size="small" onClick={handleClearPaymentMethod}>
                                <CloseRounded />
                            </IconButton>
                        )
                    }
                    IconComponent={formValues.paymentMethod == 'default' ? undefined : () => null}
                >
                    <MenuItem value="default">Payment Method</MenuItem>
                    {paymentMethods.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    className={styles.selector}
                    onChange={handleStatusChange}
                    value={formValues.status}
                    endAdornment={
                        formValues.status !== 'default' && (
                            <IconButton size="small" onClick={handleClearStatus}>
                                <CloseRounded />
                            </IconButton>
                        )
                    }
                    IconComponent={formValues.status === 'default' ? undefined : () => null}
                >
                    <MenuItem value="default">Receipt Status</MenuItem>
                    {status.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
                <DatePicker
                    label=""
                    value={formValues.date ? dayjs(formValues.date) : null}
                    onChange={handleDateChange}
                />
            </div>
            <div className={styles.table}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>SL</TableCell>
                                {props.schoolId && <TableCell > Student Name</TableCell>}
                                {props.schoolId && <TableCell>Parent Name</TableCell>}
                                <TableCell>Receipt</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payment Mode</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {receipts.map((receipt) => (
                                <React.Fragment key={receipt.receiptId}>
                                    <TableRow>
                                        <TableCell>{receipt.receiptId}</TableCell>
                                        {props.schoolId && <TableCell>{receipt.studentName}</TableCell>}
                                        {props.schoolId && <TableCell>{receipt.parentName}</TableCell>}
                                        <TableCell>{receipt.receiptId}</TableCell>
                                        <TableCell>{receipt.description}</TableCell>
                                        <TableCell>{receipt.amount}</TableCell>
                                        <TableCell>{receipt.paymentMethod}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`${styles.status} ${styles[
                                                    receipt.status.toLocaleLowerCase()
                                                ]}`}
                                            >
                                                {receipt.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {receipt.status === 'Approved' && receipt.hasReceipt ? (
                                                <Tooltip title="Print Receipt">
                                                    <IconButton
                                                        sx={{
                                                            border: '1.5px solid #DBDBDB',
                                                            borderRadius: '04px',
                                                        }}
                                                        onClick={() => { }}
                                                    >
                                                        <Print />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : receipt.status === 'Approved' ? (
                                                <Tooltip title="Generate Receipt">
                                                    <IconButton
                                                        sx={{
                                                            border: '1.5px solid #DBDBDB',
                                                            borderRadius: '04px',
                                                        }}
                                                        onClick={() => { }}
                                                    >
                                                        <ReceiptLong />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : receipt.status === 'Rejected' ? (
                                                <Tooltip title="Resend Receipt">
                                                    <IconButton
                                                        sx={{
                                                            border: '1.5px solid #DBDBDB',
                                                            borderRadius: '04px',
                                                        }}
                                                        onClick={() => { }}
                                                    >
                                                        <Send />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        <TableCell>
                                            {receipt.dropdown ? (
                                                <IconButton onClick={() => toggleReceiptDropdown(receipt.receiptId)}>
                                                    <ArrowDropUp />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => toggleReceiptDropdown(receipt.receiptId)}>
                                                    <ArrowDropDown />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {receipt.fees.length > 0 &&
                                        receipt.dropdown &&
                                        receipt.fees.map((fee, index) => (
                                            <TableRow key={index}>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                {props.schoolId && <>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                </>
                                                }
                                                <TableCell>{fee.name}</TableCell>
                                                <TableCell>{fee.amount}</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div >
    );
};

export default PaymentConfirmation;
