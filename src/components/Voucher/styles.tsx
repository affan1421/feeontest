import { red } from '@mui/material/colors';
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
    },
    header: {
        fontFamily: 'Helvetica',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        width: '100%',
        justifyContent: 'space-between',
    },
    maintitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 14,
        fontWeight: 900,
        marginBottom: 5,
    },
    maintitleA5: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        fontWeight: 900,
        marginBottom: 5,
    },
    left: {
        lineHeight: 1.5,
        width: '50%',
        display: 'flex',
        flexWrap: 'wrap',
        padding: 10,
    },
    right: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    school: {
        fontSize: 9,
        fontWeight: 400,
    },
    schoolA5: {
        fontSize: 7,
        fontWeight: 400,
    },
    address: {
        paddingTop: 5,
        fontSize: 8,
        fontWeight: 400,
    },
    addressA5: {
        paddingTop: 5,
        fontSize: 6,
        fontWeight: 400,
    },
    divider: {
        height: 2,
        width: 40,
        backgroundColor: 'blue',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    headerDataItem: {
        flexDirection: 'column',
        padding: 10,
        width: '30%'
    },
    headerDataItemA5: {
        flexDirection: 'column',
        padding: 10,
        width: '30%',
    },
    headerDataItemTitle: {
        flexDirection: 'column',
        fontSize: 9,
        fontWeight: 600,
    },
    headerDataItemTitleA5: {
        flexDirection: 'column',
        fontSize: 7,
        fontWeight: 600,
    },
    headerDataItemValue: {
        marginTop: 5,
        fontWeight: 400,
        fontSize: 8,
    },
    headerDataItemValueA5: {
        marginTop: 5,
        fontWeight: 400,
        fontSize: 6,
    },
    studentDetails: {
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'column',
        marginTop: 10,
        fontFamily: 'Helvetica',
    },
    studentDetailsTitle: {
        marginBottom: 5,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
    },
    studentDetailsTitleA5: {
        marginBottom: 5,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
    },
    studentDetailsDataItem: {
        minWidth: '30%',
        margin: '0px 5px',
        flexDirection: 'column',
        fontWeight: 500,
    },
    studentDetailsDataItemRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    studentDetailsDataItemTitle: {
        fontSize: 9,
        fontWeight: 600,
        fontFamily: 'Helvetica-Bold',
    },
    studentDetailsDataItemTitleA5: {
        fontSize: 7,
        fontWeight: 600,
        fontFamily: 'Helvetica-Bold',
    },
    studentDetailsDataItemValue: {
        fontSize: 9,
        fontWeight: 400,
    },
    studentDetailsDataItemValueA5: {
        fontSize: 7,
        fontWeight: 400,
    },
    studentDetailsrow: {
        flexDirection: 'row',
    },
    feeDetails: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
    },
    feeDetailsHeader: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eaeaea',
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    feeDetailsHeaderA5: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eaeaea',
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
    },
    feeDetailsFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        padding: 5,
        backgroundColor: '#eaeaea',
    },
    feeDetailsFooterA5: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 7,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        padding: 5,
        backgroundColor: '#eaeaea',
    },
    feeDetailColumnWidth30: {
        width: '20%',
    },
    feeDetailColumnWidth10: {
        width: '50%',
    },
    feeDetailRow: {
        padding: 6,
        fontSize: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    feeDetailRowA5: {
        padding: 6,
        fontSize: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingLeft: 30,
        paddingRight: 30,
    },
    footerItemRow: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    sign: {
        paddingTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'column',
    },
    signTitle: {
        fontSize: 9
    },
    signTitleA5: {
        fontSize: 7
    },
    main_footer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer_credits: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30,
    },
    horizontal_line: {
        height: 1,
        width: '90%',
        backgroundColor: 'black',
        marginTop: 10,
        marginBottom: 5,
    }
});