import React, { useState } from 'react'
import styles from './Trips.module.css'
import { IconButton, InputBase, Paper, Dialog } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import vector from '@/assests/Vector.svg'
import CTA from '@/assests/CTA.svg'
import TripPage from './TripPage/TripPage';

const Trips = () => {

    // data
    const schoolId = localStorage.getItem("school_id") as string;
    const Trips = 5;

    //APIS

    // State Variables
    const [searchTerm, setSearchTerm] = useState('');
    const [tripPageOpen, setTripPageOpen] = useState(false);

    //Event Handlers
    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
    }

    const handleCTAClick = () => {
        setTripPageOpen(true);
    }

    const handleCloseTripPage = () => {
        setTripPageOpen(false);
    }

    return (
        <>
            <div className={styles.main}>
                <div className={styles.row}>
                    <Paper className={styles.search}>
                        <IconButton aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            placeholder="Search By Vehicle Number"
                            id="filled-hidden-label-small"
                            size="small"
                            className={styles.search_input}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Paper>
                </div>
                <div className={styles.list}>
                    <List
                        sx={{ width: "100%", bgcolor: "background.paper", padding: '20px' }}
                    >
                        <ListItem
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar src={vector} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <div className={styles.title}>
                                        <span>KA98 8778</span>
                                    </div>
                                }
                                secondary={
                                    <div className={styles.innerText}>
                                        <span>Bus No 8</span>|
                                        <span>Seats 45</span>|
                                        <span>Trips {Trips}</span>
                                    </div>
                                }
                            />
                            <IconButton
                               onClick={handleCTAClick}>
                                <img src={CTA} height={30} alt="CTA" />
                            </IconButton>
                        </ListItem>
                    </List>
                    <div className={styles.border}></div>
                </div>
            </div>
            <Dialog open={tripPageOpen} maxWidth="xl">
                <TripPage setTripPageOpen={setTripPageOpen}  onClose={handleCloseTripPage} tripCount={Trips}/>
            </Dialog>
        </>
    )
}

export default Trips