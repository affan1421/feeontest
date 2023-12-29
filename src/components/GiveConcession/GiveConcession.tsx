import { Props } from '@/models/GiveConcessionTypes';
import styles from './GiveConcession.module.css'
import CloseIcon from '@mui/icons-material/Close';
import Selector from '@/Elements/Selector/Selector';

const GiveConcession = ({setGiveConcessionModal}:Props) => {

    const handleModalClose = () => {
        setGiveConcessionModal(false)
    }
    const handleClassSelect = () => {
        
    }



    return(
        <div className={styles.main}>
        <div className={styles.headingWrapper}>
        <h1>Give Concession</h1> 
        <CloseIcon onClick={handleModalClose} />
        </div>
        <div className={styles.selectWrapper}>
            <div className={styles.classSelectWrapper}>
            <Selector
            defaultValue="Select Fee Schedule"
            value={"dummy"}
            items={[{name:'one',value:'sfd'},{name:'ftwo',value:'fdsfsd'},{name:'three',value:'dfss'}]}
            onChange={handleClassSelect}
            />
            </div>
            <div className={styles.studentSelectWrapper}>
            <Selector
            defaultValue="Select Fee Schedule"
            value={"dummy"}
            items={[{name:'one',value:'sfd'},{name:'ftwo',value:'fdsfsd'},{name:'three',value:'dfss'}]}
            onChange={handleClassSelect}
            />
            </div>
        </div>
        </div>
    )
}

export default GiveConcession