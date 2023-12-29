import React, { useState } from 'react'
import styles from './TripPage.module.css';
import { Dialog, IconButton, Paper, InputBase } from '@mui/material';
import { Close } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import personAdd from '@/assests/person_add.svg'
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Add } from '@mui/icons-material';


const TripPage = (props: any) => {

    const [activeButton, setActiveButton] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [rows, setRows] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const columns: GridColDef[] = [
        { field: "name", headerName: "Students Name", width: 200 },
        { field: "class", headerName: "Class", width: 150 },
        { field: "fees", headerName: "Fees", width: 150 },
        { field: "route", headerName: "Route", width: 150 },
        {
            field: "delete", headerName: "", width: 80,
            renderCell: (params: any) => (
                <IconButton
                    sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px', marginLeft: '10px' }}
                    onClick={() => {
                        // handleDeleteVehicle(params.row._id)
                    }}

                >
                    <DeleteOutlineOutlinedIcon />
                </IconButton>
            )
        },
    ]


    const handleButtonClick = (index: number) => {
        setActiveButton(index);
    };

    const handleSearchChange = () => { }

    const handlePageChange = (data: any) => {
        setPaginationModel({ page: data.page, pageSize: data.pageSize });
    };

    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <>
            <Dialog maxWidth='xl' open={props.setTripPageOpen}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Trips Details</h1>
                        <IconButton
                            sx={{ p: "10px" }}
                            onClick={() => props.setTripPageOpen(false)}
                        >
                            <Close />
                        </IconButton>
                    </div>
                    <div className={styles.border}></div>
                    <div className={styles.trips}>
                        {Array.from({ length: props.tripCount }, (_, i) => (
                            <button
                                key={i}
                                className={i === activeButton ? styles.activeButton : styles.button}
                                onClick={() => handleButtonClick(i)}
                            >
                                Trip {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.row}>
                        <Paper className={styles.search}>
                            <IconButton aria-label="menu">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                placeholder="Search Students"
                                id="filled-hidden-label-small"
                                size="small"
                                className={styles.search_input}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </Paper>
                        <div className={styles.btn}>
                            <button onClick={() => {
                                // setDialogEnabled(true)
                                // setIsEdit(false)
                            }
                            }>
                                <img src={personAdd} />
                                Add
                            </button>
                        </div>
                    </div>
                    <div style={{ height: '400px', margin: '20px 0px' }}>
                        <DataGrid
                            sx={{ border: "0px" }}
                            rows={rows}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, totalCount < 100 ? totalCount : 100].sort((a, b) => { return a - b })}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={handlePageChange}
                            rowCount={totalCount}
                        />
                    </div>
                    <div className={styles.info}>
                        <div>
                            <span>Assigned Driver</span>&nbsp;&nbsp;:
                            <span>Suresh Kumar</span>
                        </div>
                        <div>
                            <span>Contact</span>&nbsp;&nbsp;:
                            <span>987867867866</span>
                        </div>
                        <div>
                            <span>Monthly Salary</span>&nbsp;&nbsp;:
                            <span>{formatter.format(1000000)}</span>
                        </div>
                    </div>
                    <div className={styles.action}>
                        <button className={styles.delete}>
                        <DeleteOutlineOutlinedIcon />
                            Delete Trip</button>
                        <button className={styles.add}>
                            <Add/>
                            Add Trip</button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default TripPage