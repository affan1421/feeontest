import React, { useEffect, useState } from 'react'
import styles from './ResendPaymentConfirmation.module.css'
import { Attachment, Cancel, Close, CloseRounded, Download, Payment, Upload } from '@mui/icons-material'
import { IconButton, Paper, TextareaAutosize } from '@mui/material'
import { ApprovalAPIData } from '@/models/PaymentConfirmation';
import api from '@/store/api';
import PaymentDetails from '../PaymentConfirmationManagement/PaymentDetails/PaymentDetails';

interface Props {
    handleClose: () => void;
    receiptId: string
    resendView: boolean
    resendDetails: ResendDetail
    paymentData: any;
    status: string;
}

interface ResendDetail {
    comment: string,
    attachments: string[]
}

interface FileItem {
    name: string,
    url: string,
}

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

const ResendPaymentConfirmation = (props: Props) => {
    const payment: Payment = mapPaymentFormat(props.paymentData);

    // API's
    const approvalPaymentConfirmationAPI = api(state => state.approvalPaymentConfirmation)
    const uploadFileAPI = api(state => state.uploadFile)

    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);


    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let formData: FormData = new FormData();
        const file = event.target.files && event.target.files[0];
        if (file) {
            formData.append('file', file);
            uploadFileAPI(formData).then((response) => {
                if (response.status == 201) {
                    let fileItem: FileItem = {
                        name: file.name,
                        url: response.data.message
                    }
                    setSelectedFiles((prevFiles) => [...prevFiles, fileItem]);
                }
            })
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };

    const handleSubmit = () => {
        let data: ApprovalAPIData = {
            status: 'RESEND',
            comment: description,
            attachments: selectedFiles.map(e => e.url)
        };

        approvalPaymentConfirmationAPI(data, props.receiptId).then((response) => {
            if (response.status === 200) {
                props.handleClose();
            }
        });
    };

    const handleDownload = (index: number) => {
        const s3Url = props.resendDetails.attachments[index];
        window.location.href = s3Url;
    }

    useEffect(() => {
        if (props.resendView) {
            console.log(props.resendDetails)
            setDescription(props.resendDetails.comment)
            setSelectedFiles(props.resendDetails.attachments.map(e => {
                return {
                    name: e,
                    url: e
                }
            }))
        }
    }, [])

    return (
        <>
            <div className={styles.dialog}>
                <div className={styles.dialog_header}>
                    <h1>Requesting Again for Approval</h1>
                    <IconButton
                        onClick={(() => {
                            props.handleClose()
                        })}
                    >
                        <Close />
                    </IconButton>
                </div>
                {props.resendView &&
                   <>
                    
                    <div className={styles.header}>
                        <span className={styles.title}>Payment Details</span>
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
                   </> 
                }
                <div style={{ margin: '10px 0px' }}>
                  <span className={styles.title}>Comment By Admin</span>
                    <Paper
                        className={styles.input_desc} >
                        <TextareaAutosize
                            disabled={props.resendView}
                            placeholder='Write Something'
                            className={styles.input_input_desc}
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </Paper>
                </div>
                <div className={styles.attachments}>
                    {
                        !props.resendView &&
                        <>
                            <label
                                htmlFor={`file-input-${props.receiptId}`}
                                className={styles.attachmentLabel}>
                                <Attachment sx={{
                                    color: '#2760EA',
                                    transform: 'rotate(-60deg)'
                                }} />
                                <span className={styles.attachment_label}>Add Attachment</span>
                            </label>
                            <input
                                id={`file-input-${props.receiptId}`}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(event) => handleFileChange(event)}
                            />
                        </>
                    }
                    {selectedFiles.map((file, index) => (
                        <div onClick={() => {
                            handleDownload(index)
                        }} key={file.name} className={styles.selectedFile}>
                            <span>{file.name.split('/').pop()}</span>
                            {!props.resendView &&
                                <Cancel
                                    className={styles.removeIcon}
                                    onClick={() => {
                                        handleRemoveFile(file.name)
                                    }}
                                />
                            }
                            {props.resendView &&
                                <Download
                                    className={styles.removeIcon}
                                />
                            }

                        </div>
                    ))}
                </div>
                {
                    !props.resendView &&
                    <div className={styles.button}>
                        <div>
                            <button className={styles.cancel} onClick={(() => {
                                props.handleClose()
                            })}>Close</button>
                        </div>
                        <div>
                            <button className={styles.save} onClick={handleSubmit}>
                                Send
                            </button>
                        </div>
                    </div>
                }

            </div>
        </>
    )
}

export default ResendPaymentConfirmation