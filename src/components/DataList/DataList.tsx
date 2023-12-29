import styles from './DataList.module.css'
import { Tabs, Tab } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'
import React from 'react'
import { formatter } from '@/helpers/formatter'

interface item {
    amount: number,
    feeTypeId: {
        feeType: string
    },
}

interface Props {
    feeTotal: number
    miscTotal: number
    miscItems?: item[]
    feeItems?: item[]
}

const MiscellaneousIncomeList = (props: Props) => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    }

    return (
        <div className={styles.main}>
            <TabContext value={value}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Fee Collection" value='1' />
                    <Tab label="Miscellaneous" value='2' />
                </Tabs>
                <TabPanel value='1'
                    style={{
                        width: '85%',
                    }}
                >
                    {props.feeTotal && <span className={styles.total_amount}>{formatter(props.feeTotal)}</span>}
                    {props.feeItems ? props.feeItems.map((item: item) => {
                        return <div className={styles.item}>
                            <span className={styles.item_title}>{item.feeTypeId.feeType}</span>
                            <span className={styles.item_amount}>{formatter(Number(item.amount))}</span>
                        </div>
                    }) :
                        <div className={styles.no_item}>
                            <span>No Records Found</span>
                        </div>
                    }
                </TabPanel>
                <TabPanel value='2' style={{
                    width: '85%',
                }} >
                    {props.miscTotal && <span className={styles.total_amount}>{formatter(props.miscTotal)}</span>}
                    {props.miscItems ? props.miscItems.map((item: item) => {
                        return <div className={styles.item}>
                            <span className={styles.item_title}>{item.feeTypeId.feeType}</span>
                            <span className={styles.item_amount}>{formatter(Number(item.amount))}</span>
                        </div>
                    }) :
                        <div className={styles.no_item}>
                            <span>No Records Found</span>
                        </div>
                    }
                </TabPanel>

            </TabContext>

        </div >
    )
}

export default MiscellaneousIncomeList