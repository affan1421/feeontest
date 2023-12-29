import { IconButton } from '@mui/material';
import styles from './PaymentDetails.module.css';
import { Close } from '@mui/icons-material';

interface Payment {
    method: string;
    bankName: string;
    date: string;
    transactionId?: string;
    upiId?: string;
    ddNumber?: number;
    ddDate?: string;
    payerName?: string;
}

interface Props {
    handleClose: () => void;
    paymentData: any; // Input payment data in various formats
}

function mapPaymentFormat(paymentData: any): Payment {
    const { method, bankName } = paymentData;
    let payment: Payment = {
        method: method,
        bankName: bankName,
        date: paymentData.chequeDate || paymentData.transactionDate || paymentData.ddDate || paymentData.date,
    };

    switch (method) {
        case "CHEQUE":
            payment = {
                ...payment,
                ddNumber: paymentData.chequeNumber,
            };
            break;
        case "ONLINE_TRANSFER":
            payment = {
                ...payment,
                transactionId: paymentData.transactionId,
            };
            break;
        case "UPI":
            payment = {
                ...payment,
                upiId: paymentData.upiId,
            };
            break;
        case "DD":
            payment = {
                ...payment,
                ddNumber: paymentData.ddNumber,
                ddDate: paymentData.ddDate,
            };
            break;
        case "DEBIT_CARD":
            payment = {
                ...payment,
                transactionId: paymentData.transactionId,
                payerName: paymentData.payerName,
            };
            break;
        case "CREDIT_CARD":
            payment = {
                ...payment,
                transactionId: paymentData.transactionId,
            };
            break;
        default:
            break;
    }

    return payment;
}

const PaymentDetails = (props: Props) => {
    const { handleClose, paymentData } = props;
    const payment: Payment = mapPaymentFormat(paymentData);

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <span className={styles.title}>Payment Details</span>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        borderRadius: '10px',
                    }}>
                    <Close />
                </IconButton>
            </div>
            <div className={styles.row}>
                <span><b>Payment mode</b> {payment.method}</span>
                {(payment.method !== "DEBIT_CARD") && (payment.method !== "CREDIT_CARD") && <span><b>Bank Name</b> {payment.bankName}</span>}
            </div>
            {payment.method === "CHEQUE" && (
                <div className={styles.row}>
                    <span><b>Cheque Number</b> {payment.ddNumber}</span>
                    <span><b>Cheque Date</b> {new Date(payment.date).toLocaleDateString('en-GB')}</span>
                </div>
            )}
            {payment.method === "ONLINE_TRANSFER" && (
                <div className={styles.row}>
                    <span><b>Transaction ID</b> {payment.transactionId}</span>
                    <span><b>Transaction Date</b> {new Date(payment.date).toLocaleDateString('en-GB')}</span>
                </div>
            )}
            {payment.method === "UPI" && (
                <div className={styles.row}>
                    <span><b>UPI ID</b> {payment.upiId}</span>
                    <span><b>Transaction Date</b> {new Date(payment.date).toLocaleDateString('en-GB')}</span>
                </div>
            )}
            {payment.method === "DD" && payment.ddDate && (
                <div className={styles.row}>
                    <span><b>DD Number</b> {payment.ddNumber}</span>
                    <span><b>DD Date</b> {new Date(payment.ddDate).toLocaleDateString('en-GB')}</span>
                </div>
            )}
            {(payment.method === "DEBIT_CARD" || payment.method === "CREDIT_CARD") && (
                <div className={styles.row}>
                    <span><b>Transaction ID</b> {payment.transactionId}</span>
                </div>
            )}
        </div>
    )
}

export default PaymentDetails;
