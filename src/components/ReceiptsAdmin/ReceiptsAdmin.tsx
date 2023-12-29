import styles from './ReceiptsAdmin.module.css'
import PaymentConfirmation from '../PaymentConfirmation/PaymentConfirmation'

const ReceiptsAdmin = () => {
    return (
        <div className={styles.main}>
            <h1>Receipts</h1>
            <br />
            <br />
            <PaymentConfirmation
                schoolId='1234'
            />
        </div>
    )
}

export default ReceiptsAdmin