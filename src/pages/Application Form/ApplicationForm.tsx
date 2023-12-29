import { useState } from 'react';
import styles from './ApplicationForm.module.css';
import ApplicationList from '@/components/Application List/ApplicationList';
import AddApplication from '@/components/Application List/Add Application/AddApplication';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ApplicationForm = () => {
  const [isAdd, setIsAdd] = useState<boolean>(false);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.list}>
          <div className={styles.header}>
            {!isAdd ? <span>
              Application Form
            </span> :
              <div className={styles.navigation} >
                <IconButton
                  onClick={() => {
                    setIsAdd(false)
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                &nbsp;&nbsp;
                All Application Forms
              </div>
            }
            {!isAdd && <button
              onClick={() => {
                setIsAdd(true)
              }}
            >
              Add New
            </button>}
          </div>
          {
            !isAdd ?
              <ApplicationList />
              :
              <AddApplication setIsAdd={setIsAdd} />
          }
        </div>
      </div>
    </>
  )
}

export default ApplicationForm;