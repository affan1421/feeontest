import React, { useState } from 'react'
import { ReceiptModel } from '@/models/Receipt'
import { Page, Text, View, Document, PDFViewer, Font } from '@react-pdf/renderer';
import style from './Receipt.module.css'
import { styles } from './styles'
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { dateFormatter } from '@/helpers/dateFormatter';

// Register Font
Font.register({
    family: "Roboto",
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});


const ReceiptTemplate = (receipt: ReceiptModel) => {
    const admin: any = localStorage.getItem('name');
    return <Document>
        <Page size={receipt.size} wrap={true} style={styles.page}>
            <View
                wrap={true}
                style={styles.header}>
                <View style={styles.left}>
                    <View style={styles.column}>
                        <Text style={receipt.size == 'A4' ? styles.maintitle : styles.maintitleA5}>{receipt.status ? (receipt.status == 'APPROVED' ? 'RECEIPT' : 'ACKNOWLEDGEMENT') : 'RECEIPT'}</Text>
                    </View>
                    <View style={styles.divider}>
                    </View>
                    <View style={styles.column}>
                        <Text style={receipt.size == 'A4' ? styles.school : styles.schoolA5}>{receipt.school.name.toUpperCase()}</Text>
                        <Text style={receipt.size == 'A4' ? styles.address : styles.addressA5}>
                            {receipt.school.address}
                        </Text>
                    </View>
                </View>
                {
                    receipt.size == 'A5' ?
                        // A5
                        <View style={styles.right}>
                            <View style={styles.row}>
                                <View style={styles.headerDataItemA5}>
                                    <Text style={styles.headerDataItemTitleA5}>{receipt.status ? (receipt.status == 'APPROVED' ? 'RECEIPT NO' : 'ACK NO') : 'RECEIPT NO'}</Text>
                                    <Text style={styles.headerDataItemValueA5} >{receipt.receiptId}</Text>
                                </View>
                                <View style={styles.headerDataItemA5}>
                                    <Text style={styles.headerDataItemTitleA5}>ISSUE DATE</Text>
                                    <Text style={styles.headerDataItemValueA5} >{new Date(receipt.issueDate).getDate() + '/' + Number(new Date(receipt.issueDate).getMonth() + 1) + '/' + new Date(receipt.issueDate).getFullYear()}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.headerDataItemA5}>
                                    <Text style={styles.headerDataItemTitleA5}>PAYMENT MODE</Text>
                                    <Text style={styles.headerDataItemValueA5} >{receipt.payment.method}</Text>
                                </View>
                                {receipt.payment.bankName ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>BANK NAME</Text>
                                        <Text style={styles.headerDataItemValueA5}>{receipt.payment.bankName}</Text>
                                    </View>

                                ) : null}
                            </View>
                            <View style={styles.row}>
                                {receipt.payment.transactionDate ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>TXN DATE</Text>
                                        <Text style={styles.headerDataItemValueA5}>{dateFormatter(receipt.payment.transactionDate)}</Text>
                                    </View>

                                ) : null}
                                {receipt.payment.ddDate ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>TXN DATE</Text>
                                        <Text style={styles.headerDataItemValueA5}>{dateFormatter(receipt.payment.ddDate)}</Text>
                                    </View>

                                ) : null}
                                {receipt.payment.chequeDate ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>TXN DATE</Text>
                                        <Text style={styles.headerDataItemValueA5}>{dateFormatter(receipt.payment.chequeDate)}</Text>
                                    </View>

                                ) : null}
                                {receipt.payment.chequeNumber ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>CHEQUE NO</Text>
                                        <Text style={styles.headerDataItemValueA5}>{receipt.payment.chequeNumber}</Text>
                                    </View>
                                ) : null}
                                {receipt.payment.transactionId ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>TXN ID</Text>
                                        <Text style={styles.headerDataItemValueA5}>{receipt.payment.transactionId}</Text>
                                    </View>
                                ) : null}
                                {receipt.payment.upiId ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>UPI ID</Text>
                                        <Text style={styles.headerDataItemValueA5}>{receipt.payment.upiId}</Text>
                                    </View>
                                ) : null}
                                {receipt.payment.ddNumber ? (
                                    <View style={styles.headerDataItemA5}>
                                        <Text style={styles.headerDataItemTitleA5}>DD NUMBER</Text>
                                        <Text style={styles.headerDataItemValueA5}>{receipt.payment.ddNumber}</Text>
                                    </View>
                                ) : null}

                            </View>
                        </View> :
                        // A4
                        <View style={styles.right}>
                            <View style={styles.row}>
                                <View style={styles.headerDataItem}>
                                    <Text style={styles.headerDataItemTitle}>{receipt.status ? (receipt.status == 'APPROVED' ? 'RECEIPT NO' : 'ACK NO') : 'RECEIPT NO'}</Text>
                                    <Text style={styles.headerDataItemValue} >{receipt.receiptId}</Text>
                                </View>
                                <View style={styles.headerDataItem}>
                                    <Text style={styles.headerDataItemTitle}>ISSUE DATE</Text>
                                    <Text style={styles.headerDataItemValue} >{new Date(receipt.issueDate).getDate() + '/' + Number(new Date(receipt.issueDate).getMonth() + 1) + '/' + new Date(receipt.issueDate).getFullYear()}</Text>
                                </View>
                                <View style={styles.headerDataItem}>
                                    <Text style={styles.headerDataItemTitle}>PAYMENT MODE</Text>
                                    <Text style={styles.headerDataItemValue} >{receipt.payment.method}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                {receipt.payment.bankName ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>BANK NAME</Text>
                                        <Text style={styles.headerDataItemValue}>{receipt.payment.bankName}</Text>
                                    </View>

                                ) : null}
                                {receipt.payment.transactionDate ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>TXN DATE</Text>
                                        <Text style={styles.headerDataItemValue}>{dateFormatter(receipt.payment.transactionDate)}</Text>
                                    </View>

                                ) : null}
                                {receipt.payment.ddDate ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>TXN DATE</Text>
                                        <Text style={styles.headerDataItemValue}>{dateFormatter(receipt.payment.ddDate)}</Text>
                                    </View>

                                ) : null}
                                {receipt.payment.chequeDate ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>TXN DATE</Text>
                                        <Text style={styles.headerDataItemValue}>{dateFormatter(receipt.payment.chequeDate)}</Text>
                                    </View>

                                ) : null}
                                {receipt.payment.chequeNumber ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>CHEQUE NO</Text>
                                        <Text style={styles.headerDataItemValue}>{receipt.payment.chequeNumber}</Text>
                                    </View>
                                ) : null}
                                {receipt.payment.transactionId ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>TXN ID</Text>
                                        <Text style={styles.headerDataItemValue}>{receipt.payment.transactionId}</Text>
                                    </View>
                                ) : null}
                                {receipt.payment.upiId ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>UPI ID</Text>
                                        <Text style={styles.headerDataItemValue}>{receipt.payment.upiId}</Text>
                                    </View>
                                ) : null}
                                {receipt.payment.ddNumber ? (
                                    <View style={styles.headerDataItem}>
                                        <Text style={styles.headerDataItemTitle}>DD NUMBER</Text>
                                        <Text style={styles.headerDataItemValue}>{receipt.payment.ddNumber}</Text>
                                    </View>
                                ) : null}

                            </View>
                        </View>
                }

            </View>

            <View style={styles.studentDetails}>
                <Text style={receipt.size == 'A4' ? styles.studentDetailsTitle : styles.studentDetailsTitleA5}>Student Details</Text>
                <View style={styles.divider}></View>
                <View style={styles.studentDetailsrow}>
                    <View style={styles.studentDetailsDataItem}>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Name &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{receipt.student.name}</Text>
                        </View>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Admission Number&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{receipt.student.admission_no ? receipt.student.admission_no : '-'}</Text>
                        </View>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Class &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{receipt.student.class.name + ' ' + receipt.student.section.name}</Text>
                        </View>
                    </View>
                    <View style={styles.studentDetailsDataItem}>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Parent Name &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{receipt.parent.name}</Text>
                        </View>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Phone Number &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{receipt.parent.mobile}</Text>
                        </View>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{receipt.academicYear.name}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.feeDetails}>
                <View style={receipt.size == 'A4' ? styles.feeDetailsHeader : styles.feeDetailsHeaderA5}>
                    <Text style={styles.feeDetailColumnWidth10}>SL</Text>
                    <Text style={styles.feeDetailColumnWidth30}>Description</Text>
                    <Text style={styles.feeDetailColumnWidth30}>Net Amount</Text>
                    <Text style={styles.feeDetailColumnWidth30}>Paid Amount</Text>
                </View>
                {receipt.items.map((item, index) => (
                    <View key={item.feeTypeId._id + index} style={receipt.size == 'A4' ? styles.feeDetailRow : styles.feeDetailRowA5}>
                        <Text style={styles.feeDetailColumnWidth10}>{index + 1}</Text>
                        <Text style={styles.feeDetailColumnWidth30}>{item.feeTypeId.feeType}&nbsp;
                            {item.date ? `(${new Date(item.date).toLocaleDateString('default', { month: 'long' })})` : ''}
                        </Text>
                        <Text style={styles.feeDetailColumnWidth30}>{item.netAmount}</Text>
                        <Text style={styles.feeDetailColumnWidth30}>{item.paidAmount}</Text>
                    </View>
                ))}
            </View>
            <View style={receipt.size == 'A4' ? styles.feeDetailsFooter : styles.feeDetailsFooterA5}>
                <Text style={styles.feeDetailColumnWidth30}>Amount Paid</Text>
                <Text style={styles.feeDetailColumnWidth30}>{receipt.paidAmount}</Text>
            </View>
            <View style={styles.footer}>
                {
                    receipt.totalAmount &&
                    <View style={styles.footerItemRow}>
                        <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Total Amount &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                        <Text style={styles.studentDetailsDataItemValue}>{receipt.totalAmount}</Text>
                    </View>
                }
                {
                    <View style={styles.footerItemRow}>
                        <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Total Paid &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                        <Text style={styles.studentDetailsDataItemValue}>{receipt.totalAmount - receipt.dueAmount}</Text>
                    </View>
                }
                {
                    receipt.dueAmount &&
                    <View style={styles.footerItemRow}>
                        <Text style={receipt.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Amount Due &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                        <Text style={styles.studentDetailsDataItemValue}>{receipt.dueAmount}</Text>
                    </View>
                }
            </View>
            <View style={styles.sign}>
                <View style={styles.divider}></View>
                <Text style={receipt.size == 'A4' ? styles.signTitle : styles.signTitleA5}>Authorized Signature</Text>
            </View>
            <View style={styles.footer_credits}>
                <Text style={receipt.size == 'A4' ? styles.signTitle : styles.signTitleA5}>{admin}</Text>
                <Text style={receipt.size == 'A4' ? styles.signTitle : styles.signTitleA5}>Generated by feeon</Text>
            </View>
            <View style={styles.main_footer}>
                <View style={styles.horizontal_line}></View>
            </View>

            <View style={styles.footer_credits}>
                <Text style={receipt.size == 'A4' ? styles.signTitle : styles.signTitleA5}>www.feeon.in</Text>
                <Text style={receipt.size == 'A4' ? styles.signTitle : styles.signTitleA5}>www.growon.app</Text>
            </View>
        </Page>
    </Document >
}

interface ReceiptProps {
    receipt: ReceiptModel,
    setDialogEnabled: React.Dispatch<React.SetStateAction<boolean>>
    setIsMakePayment?: React.Dispatch<React.SetStateAction<boolean>>
}


const Receipt = (receipt: ReceiptProps) => {
    const navigate = useNavigate()
    const [size, setSize] = useState<'A4' | 'A5'>('A4')
    return (
        <div className={style.main}>
            <div className={style.header}>
                <span>
                    Download {receipt.receipt.status ? (receipt.receipt.status == 'APPROVED' ? 'Receipt' : 'Acknowledgement') : 'Receipt'}
                </span>
                <div>
                    <IconButton
                        sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}
                        onClick={() => { setSize('A4') }}
                    >
                        <span style={{ fontSize: '16px' }}>A4</span>
                    </IconButton>
                    <IconButton
                        sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}
                        onClick={() => { setSize('A5') }}
                    >
                        <span style={{ fontSize: '16px' }}>A5</span>
                    </IconButton>
                    <IconButton
                        sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}
                        onClick={() => {
                            if (receipt.setIsMakePayment) {
                                navigate('/collection')
                                receipt.setIsMakePayment(false)
                            }
                            receipt.setDialogEnabled(false)
                        }
                        }
                    >
                        <CloseIcon />
                    </IconButton>

                </div>
            </div>
            <PDFViewer height={800} showToolbar={true} >
                <ReceiptTemplate
                    receiptId={receipt.receipt.receiptId}
                    size={size}
                    student={receipt.receipt.student}
                    academicYear={receipt.receipt.academicYear}
                    _id={receipt.receipt._id}
                    createdAt={receipt.receipt.createdAt}
                    issueDate={receipt.receipt.issueDate}
                    items={receipt.receipt.items}
                    payment={receipt.receipt.payment}
                    totalAmount={receipt.receipt.totalAmount}
                    paidAmount={receipt.receipt.paidAmount}
                    dueAmount={receipt.receipt.dueAmount}
                    parent={receipt.receipt.parent}
                    school={receipt.receipt.school}
                    status={receipt.receipt.status}
                />
            </PDFViewer>
        </div>

    )
}

export default Receipt