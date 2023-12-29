import styles from './Miscellaneous.module.css';
import { useState } from 'react'
import MiscellaneousCollectionList from '@/components/MiscellaneousCollectionList/MiscellaneousCollectionList';
import MiscellaneousCollection from '@/components/MiscellaneousCollection/MiscellaneousCollection';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const Miscellaneous = () => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  return (
    <>
      <div className={styles.main}>
        <div className={styles.list}>
          <div className={styles.header}>
            {!isAdd ? <span>
              Miscellaneous Collections
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
                All Miscellaneous Forms
              </div>
            }
            {!isAdd && <button
              onClick={() => {
                setIsAdd(true)
              }}
            >
               New Misc Collection
            </button>}
          </div>
          {
            !isAdd ?
              <MiscellaneousCollectionList />
              :
              <MiscellaneousCollection setIsAdd={setIsAdd} />
          }
        </div>
      </div>
    </>
  )
}

export default Miscellaneous