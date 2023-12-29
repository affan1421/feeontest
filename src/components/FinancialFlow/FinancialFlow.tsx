import styles from './FinancialFlow.module.css';
import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import financialFlow_icon from '../../assests/financialFlow_icon.svg'
import { formatter } from '@/helpers/formatter';

interface ExpenseItem {
    expenseTypeName: string
    totalExpAmount: number
}

interface IncomeItem {
    _id: string,
    totalAmount: number
}

interface FinancialFlows {
    expense: ExpenseItem[],
    income: IncomeItem[]
}

const FinancialFlow = (props: FinancialFlows) => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <div className={styles.main}>
                <div className={styles.header}>
                    <img src={financialFlow_icon} />
                    <span>Financial Flow</span>
                </div>
                <div className={styles.container}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Income" value="1" />
                                    <Tab label="Expense" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                {
                                    props?.income && props?.income.map((item, index) => {
                                        return (
                                            <div className={styles.item}>
                                                <span className={styles.item_title}>{item._id}</span>
                                                <span className={styles.item_amount}>{formatter(item.totalAmount)}</span>
                                            </div>
                                        )
                                    })
                                }
                            </TabPanel>
                            <TabPanel value="2">
                                {
                                    props.expense && props.expense.map((item, index) => {
                                        return (
                                            <div className={styles.item}>
                                                <span className={styles.item_title}>{item.expenseTypeName}</span>
                                                <span className={styles.item_amount}>{formatter(item.totalExpAmount)}</span>
                                            </div>
                                        )
                                    })
                                }
                            </TabPanel>
                        </TabContext>
                    </Box>
                </div>
            </div>

        </>
    )
}

export default FinancialFlow