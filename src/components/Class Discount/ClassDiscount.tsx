import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from '../Class Discount/ClassDiscount.module.css';

const ClassDiscount = (props: any) => {
    const [value, setValue] = React.useState<number>(props.value);

    return (
        <>
            <div data-testid='datagrid' className={styles.right_container} style={{ height: 358, background: 'white', padding: '20px', borderRadius: '10px' }}>
                <div className={styles.heading}>
                    <span>
                        By class discount
                    </span>
                </div>
                <div className={styles.slider}>
                    <div className={styles.classname}>
                        <span>{props.name}</span>
                    </div>
                    <Box width={300}>
                        <Slider
                            size="small"
                            aria-label="Small"
                            valueLabelDisplay="auto"
                            color="primary"
                            value={value}
                        />
                    </Box>
                    <div className={styles.amount}>
                        <span>{props.amount}</span>
                    </div>
                </div>
                <div className={styles.status}>
                    <span>
                        Approved {props.approved}, Pending {props.pending}
                    </span>
                </div>
            </div>
        </>
    )
}

export default ClassDiscount;