import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import styles from './FeeStructure.module.css'
import { Outlet } from 'react-router-dom'
import { TabPanel } from '@mui/lab'
import FeeType from '../../components/Fee Type/FeeType'
import FeeSchedule from '../../components/Fee Schedule/FeeSchedule'
import FeeStructureComponent from '../../components/Fee Structure/FeeStructure'
import { useParams } from "react-router-dom"
import { IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom';

const FeeStructure = (props: any) => {
    const navigate = useNavigate();
    let { id, name } = useParams();
    const [value, setValue]: any = useState('1')

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.navigation} >
                        <IconButton onClick={() => {
                            navigate('/feecategory')
                        }}>
                            <ArrowBackIcon />
                        </IconButton>
                        &nbsp;&nbsp;
                        All Fee Categories
                    </div>
                </div>
                <div className={styles.tabs}>
                    <h1>{name}</h1>
                    <br />
                    <TabContext value={value} >
                        <div>
                            <Tabs value={value} onChange={handleChange}  >
                                <Tab label="Fee Type" className={styles.tab} value='1' />
                                <Tab label="Fee Schedule" className={styles.tab} value='2' />
                                <Tab label="Fee Structure" className={styles.tab} value='3' />
                            </Tabs>
                        </div>
                        <TabPanel value='1' >
                            <FeeType id={id} />
                        </TabPanel>
                        <TabPanel value='2' >
                            <FeeSchedule id={id} />
                        </TabPanel>
                        <TabPanel value='3' >
                            <FeeStructureComponent id={id} />
                        </TabPanel>
                    </TabContext>
                </div>

                <Outlet />

            </div>
        </>
    )
}

export default FeeStructure