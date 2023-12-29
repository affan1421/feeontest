import DonorCard from '@/components/DonorCard/DonorCard'
import styles from './DonorDetail.module.css'
import DonorStudentList from '@/components/DonorStudentList/DonorStudentList'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import api from '@/store/api'
import { Donor } from '@/models/Donor'
import { Dialog, IconButton } from '@mui/material'
import { ArrowBack, Delete, Edit } from '@mui/icons-material'
import AddDonor from '@/components/AddDonor/AddDonor'

const DonarDetail = () => {
    // Nagivate
    const navigate = useNavigate()

    // API's 
    const getDonorDetailAPI = api(state => state.getDonorDetail)
    const deleteDonorAPI = api(state => state.deleteDonor)

    // Get Id From Params
    const { id } = useParams()
    const [dialogEnabled, setDialogEnabled] = useState(false)
    const [donor, setDonor] = useState<Donor>(
        {
            name: '',
            donorType: 'default',
            contactNumber: 0,
            email: '',
            address: '',
            accountNumber: 0,
            accountType: 'default',
            IFSC: '',
            bank: '',
            schoolId: ''
        }
    )

    const getDonor = () => {
        getDonorDetailAPI(id as string).then((response) => {
            setDonor(response.data.data)
        })
    }

    const deleteDonor = () => {
        deleteDonorAPI(id as string).then((response) => {
            if (response.status === 200) {
                navigate('/donor')
            }
        })
    }

    useEffect(() => {
        getDonor()
    }, [])

    return (
        <>
            <div className={styles.header}>
                <div>
                    <IconButton onClick={() => {
                        navigate('/donor')
                    }}>
                        <ArrowBack />
                    </IconButton>
                    &nbsp;&nbsp;
                    All Donors
                </div>
                <div>
                    <IconButton
                        sx={{
                            border: '1.5px solid #DBDBDB',
                            borderRadius: '04px',
                            marginRight: '10px',
                            backgroundColor: '#FFF'
                        }}
                        onClick={() => {
                            setDialogEnabled(true)
                        }}>
                        <Edit />
                    </IconButton>
                    <IconButton
                        sx={{
                            border: '1.5px solid #DBDBDB',
                            borderRadius: '04px',
                            backgroundColor: '#FFF'

                        }}
                        onClick={() => {
                            deleteDonor()
                        }}>
                        <Delete />
                    </IconButton>
                </div>
            </div>
            <div className={styles.donor_card}>
                <DonorCard donor={donor} />
            </div>
            <div className={styles.donor_list}>
                <DonorStudentList donorId={id as string} />
            </div>
            <Dialog open={dialogEnabled} maxWidth='xl'>
                <AddDonor
                    id={id as string}
                    setDialogEnabled={setDialogEnabled}
                    onFormSubmit={getDonor}
                    donor={donor}
                />
            </Dialog>
        </>
    )
}

export default DonarDetail