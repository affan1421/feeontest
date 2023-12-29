import { Phone, LocationOn, Mail } from '@mui/icons-material'
import styles from './DonorCard.module.css'
import user from '@/assests/user.png'
import { Donor } from '@/models/Donor'
import { formatter } from '@/helpers/formatter'

interface DonorCardProps {
    donor: Donor
}


const DonorCard = (props: DonorCardProps) => {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.left}>
                    {props.donor.profileImage ? <img src={props.donor.profileImage} /> : <img src={user} />}
                    <div className={styles.headerDataItem}>
                        <span className={styles.title}>{props.donor.name}</span>
                        <span className={styles.type}>{props.donor.donorType}</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <span className={styles.title}>{formatter(Number(props.donor.totalAmount))}</span>
                    <span className={styles.amount_donated}>Amount Donated</span>
                </div>
            </div>
            <div className={styles.container}>
                <span className={styles.subtitle}>Contact Details</span>
                <div className={styles.row}>
                    <div className={styles.contactDetailsItem}>
                        <Phone className={styles.icon} />
                        <span>{props.donor.contactNumber}</span>
                    </div>
                    <div className={styles.contactDetailsItem}>
                        <Mail className={styles.icon} />
                        <span>{props.donor.email}</span>
                    </div>
                    <div className={styles.contactDetailsItem}>
                        <LocationOn className={styles.icon} />
                        <span>{props.donor.address}</span>
                    </div>
                </div>
            </div>
            <div className={styles.container}>
                <span className={styles.subtitle}>Bank Details</span>
                <div className={styles.row}>
                    <div className={styles.bankDetailItem}>
                        <span className={styles.bankDetailItemTitle}>Account Number</span>
                        <span className={styles.bankDetailItemData}>{props.donor.accountNumber}</span>
                    </div>
                    <div className={styles.bankDetailItem}>
                        <span className={styles.bankDetailItemTitle}>Account Type</span>
                        <span className={styles.bankDetailItemData}>{props.donor.accountType}</span>
                    </div>
                    <div className={styles.bankDetailItem}>
                        <span className={styles.bankDetailItemTitle}>IFSC Code</span>
                        <span className={styles.bankDetailItemData}>{props.donor.IFSC}</span>
                    </div>
                    <div className={styles.bankDetailItem}>
                        <span className={styles.bankDetailItemTitle}>Bank Name</span>
                        <span className={styles.bankDetailItemData}>{props.donor.bank}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DonorCard