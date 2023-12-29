import React, { useState } from 'react'
import { Page, Text, View, Document, PDFViewer, Font } from '@react-pdf/renderer';
import { styles } from './styles'
import { dateFormatter } from '@/helpers/dateFormatter';
import style from './Voucher.module.css'
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { getSchoolDetails } from '@/helpers/schoolDetails';

export interface VoucherModel {
    size?: string,
    reason: string,
    voucherNumber: string,
    amount: number,
    expenseDate: string,
    paymentMethod: string,
    schoolId?: string,
    expenseType?: string
    approvedBy?: string,
    schoolName: string,
    schoolAddress: string,
}

export interface VoucherProps {
    handleClose: () => void;
    voucher: VoucherModel;
}

const ReceiptTemplate = (voucher: VoucherModel) => {
    const admin: any = localStorage.getItem('name');
    return <Document>
        <Page size={'A4'} wrap={true} style={styles.page}>
            <View
                wrap={true}
                style={styles.header}>
                <View style={styles.left}>
                    <View style={styles.column}>
                        <Text style={voucher.size == 'A4' ? styles.maintitle : styles.maintitleA5}>Voucher</Text>
                    </View>
                    <View style={styles.divider}>
                    </View>
                    <View style={styles.column}>
                        <Text style={voucher.size == 'A4' ? styles.school : styles.schoolA5}>{voucher.schoolName}</Text>
                        <Text style={voucher.size == 'A4' ? styles.address : styles.addressA5}>
                            {voucher.schoolAddress}
                        </Text>
                    </View>
                </View>
                {
                    voucher.size == 'A5' ?
                        // A5
                        <View style={styles.right}>
                            <View style={styles.row}>
                                <View style={styles.headerDataItemA5}>
                                    <Text style={styles.headerDataItemTitleA5}>Voucher Number</Text>
                                    <Text style={styles.headerDataItemValueA5} >{voucher.voucherNumber}</Text>
                                </View>
                                <View style={styles.headerDataItemA5}>
                                    <Text style={styles.headerDataItemTitleA5}>Payment Method</Text>
                                    <Text style={styles.headerDataItemValueA5} >{voucher.paymentMethod}</Text>
                                </View>
                            </View>
                        </View> :
                        // A4
                        <View style={styles.right}>
                            <View style={styles.row}>
                                <View style={styles.headerDataItem}>
                                    <Text style={styles.headerDataItemTitle}>Voucher Number</Text>
                                    <Text style={styles.headerDataItemValue} >{voucher.voucherNumber}</Text>
                                </View>
                                <View style={styles.headerDataItem}>
                                    <Text style={styles.headerDataItemTitle}>Payment Method</Text>
                                    <Text style={styles.headerDataItemValue} >{voucher.paymentMethod}</Text>
                                </View>
                            </View>
                        </View>
                }

            </View>

            <View style={styles.studentDetails}>
                <Text style={voucher.size == 'A4' ? styles.studentDetailsTitle : styles.studentDetailsTitleA5}>Expense Details</Text>
                <View style={styles.divider}></View>
                <View style={styles.studentDetailsrow}>
                    <View style={styles.studentDetailsDataItem}>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={voucher.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Expense Type &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={voucher.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{voucher.expenseType}</Text>
                        </View>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={voucher.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Approved By&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={voucher.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{voucher.approvedBy ? voucher.approvedBy : '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.studentDetailsDataItem}>
                        <View style={styles.studentDetailsDataItemRow}>
                            <Text style={voucher.size == 'A4' ? styles.studentDetailsDataItemTitle : styles.studentDetailsDataItemTitleA5}>Date &nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            <Text style={voucher.size == 'A4' ? styles.studentDetailsDataItemValue : styles.studentDetailsDataItemValueA5}>{voucher.expenseDate}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.feeDetails}>
                <View style={voucher.size == 'A4' ? styles.feeDetailsHeader : styles.feeDetailsHeaderA5}>
                    <Text style={styles.feeDetailColumnWidth10}>Reason</Text>
                    <Text style={styles.feeDetailColumnWidth30}>Amount</Text>
                </View>
                <View style={voucher.size == 'A4' ? styles.feeDetailRow : styles.feeDetailRowA5}>
                    <Text style={styles.feeDetailColumnWidth10}>{voucher.reason}</Text>
                    <Text style={styles.feeDetailColumnWidth30}>{voucher.amount}</Text>
                </View>
            </View>

            <View style={styles.sign}>

            </View>
            <View style={styles.footer_credits}>
                <Text style={voucher.size == 'A4' ? styles.signTitle : styles.signTitleA5}>{admin}</Text>
                <Text style={voucher.size == 'A4' ? styles.signTitle : styles.signTitleA5}>Generated by feeon</Text>
            </View>
            <View style={styles.main_footer}>
                <View style={styles.horizontal_line}></View>
            </View>

            <View style={styles.footer_credits}>
                <Text style={voucher.size == 'A4' ? styles.signTitle : styles.signTitleA5}>www.feeon.in</Text>
                <Text style={voucher.size == 'A4' ? styles.signTitle : styles.signTitleA5}>www.growon.app</Text>
            </View>
        </Page>
    </Document >
}

const Voucher = (props: VoucherProps) => {
    const { schoolName, schoolAddress } = getSchoolDetails()
    const navigate = useNavigate()
    const [size, setSize] = useState<'A4' | 'A5'>('A4')
    return (
        <div className={style.main}>
            <div className={style.header}>
                <span>
                    Download Receipt
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
                            props.handleClose()
                        }}
                    >
                        <Close />
                    </IconButton>

                </div>
            </div>
            <PDFViewer height={800} showToolbar={true} >
                <ReceiptTemplate
                    schoolAddress={schoolAddress}
                    schoolName={schoolName}
                    amount={props.voucher.amount}
                    expenseDate={props.voucher.expenseDate}
                    paymentMethod={props.voucher.paymentMethod}
                    reason={props.voucher.reason}
                    voucherNumber={props.voucher.voucherNumber}
                    approvedBy='Admin'
                    expenseType={props.voucher.expenseType}
                    size={size}
                />
            </PDFViewer>
        </div>

    )
}

export default Voucher