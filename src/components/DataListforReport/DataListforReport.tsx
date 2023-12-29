import { useEffect } from 'react'
import styles from './DataListforReport.module.css'
import misc_icon from '@/assests/misc_icon.svg'
import { OpenInNew } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { formatter } from '@/helpers/formatter'

interface item {
    label: string
    secondarylabel?: string
    value: number
    id: string
}

interface Props {
    items: any,
    title: string,
    isDiscount?: boolean
    link?: string
}

const DataListforReport = (props: Props) => {
    const navigate = useNavigate()

    return <div className={styles.main}>
        <div className={styles.icon}>
            <IconButton
                onClick={() => {
                    navigate(`/${props.link}`)
                }}
                sx={{ border: '1.5px solid #DBDBDB', borderRadius: '04px' }}>
                <OpenInNew />
            </IconButton>
        </div>
        <div className={styles.header}>
            <img src={misc_icon} alt="misc_icon" />
            <span className={styles.title}>{props.title}</span>
        </div>
        <>
            {props.items.length ? props.items.map((item: item) => {
                return <>
                    <div className={`${styles.item} ${props.isDiscount ? `${styles.discountItem}` : ''}`} >
                        <div onClick={() => {
                            if (props.isDiscount) {
                                navigate(`/single-discount/${item.id}`)
                            }
                        }}>
                            <span className={styles.item_title}>{item.label}</span>
                            <span className={`${styles.status} ${styles[`${item.secondarylabel?.toLowerCase()}`]}`}>{item.secondarylabel}</span>
                        </div>
                        <span className={styles.item_amount}>{formatter(Number(item.value))}</span>
                    </div>
                </>

            })
                :
                <div className={styles.no_item}>
                    <span>No Records Found</span>
                </div>
            }
        </>
    </div>
}

export default DataListforReport